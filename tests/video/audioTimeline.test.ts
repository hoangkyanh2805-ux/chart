import { describe, it, expect } from 'vitest';
import { scheduleCues } from '../../src/video/audioTimeline';
import { makeAudioReadyPilot } from '../fixtures/s2v/factories';

describe('Narration Audio Timeline Quantization (Task 4)', () => {
  it('pads only the fractional final frame with silence', () => {
    const cues = makeAudioReadyPilot().narration.slice(0, 2);
    cues[0].audio!.sampleCount = 48001; // 48001 / 1600 = 30.000625 -> ceil = 31 frames
    cues[1].audio!.sampleCount = 48000; // 48000 / 1600 = 30 frames exact

    const r = scheduleCues(cues);
    expect(r.ok).toBe(true);
    if (!r.ok) throw new Error('unexpected failure');

    // Cue 0: startFrame 0, endFrame 31, startSample 0, endSample 48001
    expect(r.value.cues[0].startFrame).toBe(0);
    expect(r.value.cues[0].endFrame).toBe(31);
    expect(r.value.cues[0].startSample).toBe(0);
    expect(r.value.cues[0].endSample).toBe(48001);

    // Cue 1 starts at frame 31 (= 31 * 1600 = 49600 samples)
    expect(r.value.cues[1].startFrame).toBe(31);
    expect(r.value.cues[1].endFrame).toBe(61);
    expect(r.value.cues[1].startSample).toBe(49600);
    expect(r.value.cues[1].endSample).toBe(49600 + 48000);

    // Total frames = 31 + 30 = 61 frames
    expect(r.value.frameCount).toBe(61);
    // Total padded audio samples = 61 * 1600 = 97600
    expect(r.value.audioSampleCount).toBe(97600);
  });

  it('rejects audio with missing or zero sampleCount', () => {
    const cues = makeAudioReadyPilot().narration.slice(0, 1);
    cues[0].audio = null;
    const r1 = scheduleCues(cues);
    expect(r1.ok).toBe(false);
    if (!r1.ok) {
      expect(r1.issues.some((i) => i.code === 'AUDIO_MISSING')).toBe(true);
    }

    const cues2 = makeAudioReadyPilot().narration.slice(0, 1);
    cues2[0].audio!.sampleCount = 0;
    const r2 = scheduleCues(cues2);
    expect(r2.ok).toBe(false);
    if (!r2.ok) {
      expect(r2.issues.some((i) => i.code === 'INVALID_AUDIO_LENGTH')).toBe(true);
    }
  });
});

