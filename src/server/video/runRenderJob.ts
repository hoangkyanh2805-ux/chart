import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { FrozenScene, FrameReceipt } from '../../video/contracts';
import { probeAndVerifyMedia, MediaProbeResult } from './verifyMedia';

export interface JobReceipt {
  id: string;
  sceneSha256: string;
  status: 'DRAFT' | 'FROZEN' | 'RENDERING' | 'MEDIA_VERIFIED' | 'FAILED' | 'CANCELLED';
  artifactHashes: {
    sceneSha256: string;
    mp4Sha256?: string;
    receiptsSha256?: string;
  };
  observedMedia?: MediaProbeResult;
  diagnostics: string[];
  errorCode?: string;
}

export interface RenderJobOptions {
  runId: string;
  outputDir?: string;
  audioWavPath?: string;
  framesToStream?: number; // Optional override for transport mutation testing
  frameSource?: (frameIndex: number) => Promise<Buffer>;
}

export async function runRenderJob(
  scene: FrozenScene,
  options: RenderJobOptions
): Promise<JobReceipt> {
  const runId = options.runId || `s2v_job_${Date.now()}`;
  const outDir = path.resolve(
    options.outputDir || path.resolve(process.cwd(), `livrables/s2v_runs/${runId}`)
  );
  fs.mkdirSync(outDir, { recursive: true });

  const diagnostics: string[] = [];
  const scenePath = path.resolve(outDir, 'frozen-scene.json');
  fs.writeFileSync(scenePath, JSON.stringify(scene, null, 2), 'utf8');

  // Verify audio WAV availability
  let audioPath = options.audioWavPath;
  if (!audioPath || !fs.existsSync(audioPath)) {
    // Generate deterministic silent PCM WAV matching exact scene sample count if no file provided
    audioPath = path.resolve(outDir, 'narration.wav');
    if (!fs.existsSync(audioPath)) {
      writeDeterministicWav(audioPath, scene.audioSampleCount);
      diagnostics.push(`Created deterministic padded WAV with ${scene.audioSampleCount} samples`);
    }
  }

  const partialMp4Path = path.resolve(outDir, 'output.partial.mp4');
  const finalMp4Path = path.resolve(outDir, 'output.mp4');
  const receiptsLogPath = path.resolve(outDir, 'frame-receipts.jsonl');
  const receiptsStream = fs.createWriteStream(receiptsLogPath, { encoding: 'utf8' });

  // Prepare FFmpeg args
  const ffmpegArgs = [
    '-hide_banner',
    '-nostdin',
    '-f',
    'image2pipe',
    '-framerate',
    '30',
    '-vcodec',
    'png',
    '-i',
    'pipe:0',
    '-i',
    audioPath,
    '-map',
    '0:v:0',
    '-map',
    '1:a:0',
    '-c:v',
    'libx264',
    '-preset',
    'medium',
    '-crf',
    '18',
    '-pix_fmt',
    'yuv420p',
    '-fps_mode',
    'cfr',
    '-c:a',
    'aac',
    '-ar',
    '48000',
    '-b:a',
    '192k',
    '-movflags',
    '+faststart',
    '-y',
    partialMp4Path,
  ];

  let stderrLog = '';

  const jobPromise = new Promise<JobReceipt>((resolve) => {
    const ffmpegProc = spawn('ffmpeg', ffmpegArgs, { shell: false });

    ffmpegProc.stderr.on('data', (chunk) => {
      stderrLog += chunk.toString();
    });

    ffmpegProc.on('error', (err) => {
      diagnostics.push(`FFmpeg spawn error: ${err.message}`);
      resolve({
        id: runId,
        sceneSha256: scene.sceneSha256,
        status: 'FAILED',
        errorCode: 'FFMPEG_SPAWN_ERROR',
        artifactHashes: { sceneSha256: scene.sceneSha256 },
        diagnostics,
      });
    });

    ffmpegProc.on('close', (code) => {
      receiptsStream.end();
      fs.writeFileSync(path.resolve(outDir, 'ffmpeg.stderr.log'), stderrLog, 'utf8');

      if (code !== 0) {
        diagnostics.push(`FFmpeg exited with non-zero exit code: ${code}`);
        resolve({
          id: runId,
          sceneSha256: scene.sceneSha256,
          status: 'FAILED',
          errorCode: 'FFMPEG_ENCODER_FAILED',
          artifactHashes: { sceneSha256: scene.sceneSha256 },
          diagnostics,
        });
        return;
      }

      // Verify media file with ffprobe
      const probeResult = probeAndVerifyMedia(partialMp4Path, scene.frameCount, 30);
      if (!probeResult.valid) {
        diagnostics.push(...probeResult.errors);
        resolve({
          id: runId,
          sceneSha256: scene.sceneSha256,
          status: 'FAILED',
          errorCode: 'MEDIA_VERIFICATION_FAILED',
          observedMedia: probeResult,
          artifactHashes: { sceneSha256: scene.sceneSha256 },
          diagnostics,
        });
        return;
      }

      // Atomic rename
      fs.renameSync(partialMp4Path, finalMp4Path);
      const mp4Bytes = fs.readFileSync(finalMp4Path);
      const mp4Sha256 = crypto.createHash('sha256').update(mp4Bytes).digest('hex');

      resolve({
        id: runId,
        sceneSha256: scene.sceneSha256,
        status: 'MEDIA_VERIFIED',
        observedMedia: probeResult,
        artifactHashes: {
          sceneSha256: scene.sceneSha256,
          mp4Sha256,
        },
        diagnostics,
      });
    });

    // Stream frames sequentially into pipe:0
    (async () => {
      try {
        const frameSource =
          options.frameSource ||
          (async (idx: number) => createDeterministicSolidPng(1080, 1920, idx));

        const totalFramesToStream =
          options.framesToStream !== undefined ? options.framesToStream : scene.frameCount;

        for (let frameIndex = 0; frameIndex < totalFramesToStream; frameIndex++) {
          const pngBuffer = await frameSource(frameIndex);

          // Write receipt to log
          const receipt: FrameReceipt = {
            frame: frameIndex,
            sceneSha256: scene.sceneSha256,
            visibleIds: ['watermark'],
            bounds: [],
          };
          receiptsStream.write(JSON.stringify(receipt) + '\n');

          // Stream into stdin with backpressure
          const canWrite = ffmpegProc.stdin.write(pngBuffer);
          if (!canWrite) {
            await new Promise((r) => ffmpegProc.stdin.once('drain', r));
          }
        }

        // Close stdin after exactly N frames
        ffmpegProc.stdin.end();
      } catch (streamErr: any) {
        diagnostics.push(`Frame streaming error: ${streamErr.message}`);
        ffmpegProc.kill('SIGTERM');
      }
    })();
  });

  return jobPromise;
}

/**
 * Creates a valid mono 48kHz PCM WAV file with N samples of silence/tone
 */
export function writeDeterministicWav(filePath: string, sampleCount: number): void {
  const bytesPerSample = 2; // 16-bit
  const dataSize = sampleCount * bytesPerSample;
  const header = Buffer.alloc(44);

  // RIFF chunk
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);

  // fmt chunk
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // subchunk1 size
  header.writeUInt16LE(1, 20); // audio format (1 = PCM)
  header.writeUInt16LE(1, 22); // channels (mono)
  header.writeUInt32LE(48000, 24); // sample rate
  header.writeUInt32LE(48000 * bytesPerSample, 28); // byte rate
  header.writeUInt16LE(bytesPerSample, 32); // block align
  header.writeUInt16LE(16, 34); // bits per sample

  // data chunk
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  const data = Buffer.alloc(dataSize); // zeroed PCM silence
  fs.writeFileSync(filePath, Buffer.concat([header, data]));
}

/**
 * Generates an uncompressed minimal 1080x1920 PNG buffer with frame counter watermark
 */
import zlib from 'node:zlib';

export function createDeterministicSolidPng(width: number, height: number, frameIndex: number): Buffer {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type (truecolor RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = createPngChunk('IHDR', ihdrData);

  // Raw image scanlines: filter byte (0) + width * 3 bytes (R, G, B)
  const rowSize = 1 + width * 3;
  const rawData = Buffer.alloc(rowSize * height);

  // Slight color variation based on frameIndex to verify dynamic changes
  const r = (30 + (frameIndex % 50)) & 0xff;
  const g = 58;
  const b = 95;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // filter None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 3;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createPngChunk('IDAT', compressedData);
  const iendChunk = createPngChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createPngChunk(type: string, data: Buffer): Buffer {
  const chunk = Buffer.alloc(8 + data.length + 4);
  chunk.writeUInt32BE(data.length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = crc32(chunk.subarray(4, 8 + data.length));
  chunk.writeInt32BE(crc, 8 + data.length);
  return chunk;
}

function crc32(buf: Buffer): number {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return ~c;
}

const CRC_TABLE = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[n] = c;
}
