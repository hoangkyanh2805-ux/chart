import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

export interface MediaProbeResult {
  valid: boolean;
  frameCount: number;
  width: number;
  height: number;
  videoDurationSec: number;
  audioDurationSec: number;
  hasAudio: boolean;
  errors: string[];
}

export function probeAndVerifyMedia(
  filePath: string,
  expectedFrames: number,
  expectedFps = 30
): MediaProbeResult {
  const errors: string[] = [];

  if (!fs.existsSync(filePath)) {
    return {
      valid: false,
      frameCount: 0,
      width: 0,
      height: 0,
      videoDurationSec: 0,
      audioDurationSec: 0,
      hasAudio: false,
      errors: [`File does not exist: ${filePath}`],
    };
  }

  // 1. Run ffprobe
  try {
    const probeOutput = execFileSync(
      'ffprobe',
      [
        '-v',
        'error',
        '-count_frames',
        '-show_streams',
        '-show_format',
        '-of',
        'json',
        filePath,
      ],
      { encoding: 'utf8' }
    );

    const probe = JSON.parse(probeOutput);
    const videoStream = probe.streams?.find((s: any) => s.codec_type === 'video');
    const audioStream = probe.streams?.find((s: any) => s.codec_type === 'audio');

    if (!videoStream) {
      errors.push('No video stream found in media file');
    }

    const width = Number(videoStream?.width || 0);
    const height = Number(videoStream?.height || 0);
    const nbReadFrames = Number(videoStream?.nb_read_frames || videoStream?.nb_frames || 0);
    const videoDuration = Number(videoStream?.duration || probe.format?.duration || 0);
    const audioDuration = Number(audioStream?.duration || 0);

    if (width !== 1080 || height !== 1920) {
      errors.push(`Resolution mismatch: expected 1080x1920, got ${width}x${height}`);
    }

    if (nbReadFrames !== expectedFrames) {
      errors.push(`Frame count mismatch: expected ${expectedFrames}, decoded ${nbReadFrames}`);
    }

    if (videoStream?.pix_fmt !== 'yuv420p') {
      errors.push(`Pixel format mismatch: expected yuv420p, got ${videoStream?.pix_fmt}`);
    }

    if (!audioStream) {
      errors.push('No audio stream found in media file');
    } else {
      if (Number(audioStream.sample_rate) !== 48000) {
        errors.push(`Audio sample rate mismatch: expected 48000, got ${audioStream.sample_rate}`);
      }
    }

    // 2. Decode test with ffmpeg -f null
    try {
      execFileSync('ffmpeg', ['-v', 'error', '-i', filePath, '-f', 'null', '-'], {
        encoding: 'utf8',
      });
    } catch (decodeErr: any) {
      errors.push(`Full decode verification failed: ${decodeErr.message}`);
    }

    return {
      valid: errors.length === 0,
      frameCount: nbReadFrames,
      width,
      height,
      videoDurationSec: videoDuration,
      audioDurationSec: audioDuration,
      hasAudio: !!audioStream,
      errors,
    };
  } catch (err: any) {
    return {
      valid: false,
      frameCount: 0,
      width: 0,
      height: 0,
      videoDurationSec: 0,
      audioDurationSec: 0,
      hasAudio: false,
      errors: [`ffprobe execution failed: ${err.message}`],
    };
  }
}
