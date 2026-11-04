import { NarrationCue, ScheduledCue, Result, Issue } from './contracts';

export const SAMPLE_RATE = 48000;
export const FPS = 30;
export const SAMPLES_PER_FRAME = SAMPLE_RATE / FPS; // 1600

export function scheduleCues(
  narration: NarrationCue[]
): Result<{ cues: ScheduledCue[]; frameCount: number; audioSampleCount: number }> {
  const issues: Issue[] = [];

  if (!Array.isArray(narration) || narration.length === 0) {
    return {
      ok: false,
      issues: [{ code: 'NO_NARRATION', path: 'narration', message: 'No narration cues to schedule', severity: 'error' }],
    };
  }

  const scheduled: ScheduledCue[] = [];
  let currentFrame = 0;

  for (let i = 0; i < narration.length; i++) {
    const cue = narration[i];
    if (!cue.audio) {
      issues.push({
        code: 'AUDIO_MISSING',
        path: `narration[${i}].audio`,
        message: `Cue ${cue.id} does not have an attached AudioReceipt`,
        severity: 'error',
      });
      continue;
    }

    const sampleCount = cue.audio.sampleCount;
    if (sampleCount <= 0) {
      issues.push({
        code: 'INVALID_AUDIO_LENGTH',
        path: `narration[${i}].audio.sampleCount`,
        message: `Cue ${cue.id} has invalid sample count: ${sampleCount}`,
        severity: 'error',
      });
      continue;
    }

    const framesForCue = Math.ceil(sampleCount / SAMPLES_PER_FRAME);
    const startSample = currentFrame * SAMPLES_PER_FRAME;
    const endSample = startSample + sampleCount;
    const startFrame = currentFrame;
    const endFrame = startFrame + framesForCue;

    scheduled.push({
      id: cue.id,
      text: cue.text,
      startSample,
      endSample,
      startFrame,
      endFrame,
      audioAssetId: cue.audio.assetId,
    });

    currentFrame += framesForCue;
  }

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  const totalFrames = currentFrame;
  const totalDurationSec = totalFrames / FPS;

  if (totalDurationSec <= 0 || totalDurationSec > 120) {
    return {
      ok: false,
      issues: [
        {
          code: 'DURATION_OUT_OF_BOUNDS',
          path: 'narration',
          message: `Scheduled duration ${totalDurationSec.toFixed(2)}s is outside allowed range (0, 120]s`,
          severity: 'error',
        },
      ],
    };
  }

  const totalAudioSamples = totalFrames * SAMPLES_PER_FRAME;

  return {
    ok: true,
    value: {
      cues: scheduled,
      frameCount: totalFrames,
      audioSampleCount: totalAudioSamples,
    },
    issues: [],
  };
}

