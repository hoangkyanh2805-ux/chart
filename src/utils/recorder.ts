/**
 * Client-Side Canvas Video Recorder using MediaRecorder API & captureStream
 */

export interface ExportVideoOptions {
  fps?: number;
  durationSec: number;
  onProgress?: (progressPercent: number) => void;
  onComplete?: (blob: Blob, filename: string) => void;
  onError?: (err: Error) => void;
}

export function exportCanvasVideo(
  canvas: HTMLCanvasElement,
  renderFrameAtTime: (timeSec: number) => void,
  options: ExportVideoOptions
): { cancel: () => void } {
  const fps = options.fps || 30;
  const durationSec = options.durationSec;
  const totalFrames = Math.ceil(durationSec * fps);
  let currentFrame = 0;
  let isCancelled = false;

  // Determine optimal MIME type
  let mimeType = 'video/webm;codecs=vp9';
  let extension = 'webm';

  if (typeof MediaRecorder !== 'undefined') {
    if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1.42E01E,mp4a.40.2')) {
      mimeType = 'video/mp4;codecs=avc1.42E01E,mp4a.40.2';
      extension = 'mp4';
    } else if (MediaRecorder.isTypeSupported('video/mp4')) {
      mimeType = 'video/mp4';
      extension = 'mp4';
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
      mimeType = 'video/webm;codecs=vp9';
      extension = 'webm';
    } else if (MediaRecorder.isTypeSupported('video/webm')) {
      mimeType = 'video/webm';
      extension = 'webm';
    }
  }

  // Capture canvas video stream
  const stream = canvas.captureStream(fps);
  const chunks: Blob[] = [];

  let recorder: MediaRecorder;
  try {
    recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 8000000, // 8 Mbps high quality
    });
  } catch (e) {
    recorder = new MediaRecorder(stream);
  }

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  recorder.onstop = () => {
    if (isCancelled) return;
    const blob = new Blob(chunks, { type: mimeType });
    const filename = `chart-animation-${Date.now()}.${extension}`;
    options.onComplete?.(blob, filename);
  };

  recorder.start();

  // Precise frame-by-frame offline rendering loop
  const frameIntervalMs = 1000 / fps;

  function renderNext() {
    if (isCancelled) {
      recorder.stop();
      return;
    }

    if (currentFrame <= totalFrames) {
      const timeSec = (currentFrame / totalFrames) * durationSec;
      renderFrameAtTime(timeSec);

      currentFrame++;
      const percent = Math.min(100, Math.round((currentFrame / totalFrames) * 100));
      options.onProgress?.(percent);

      setTimeout(renderNext, frameIntervalMs);
    } else {
      setTimeout(() => {
        recorder.stop();
      }, 200);
    }
  }

  // Start frame sequencing
  renderNext();

  return {
    cancel: () => {
      isCancelled = true;
      try {
        recorder.stop();
      } catch (err) {}
    },
  };
}
