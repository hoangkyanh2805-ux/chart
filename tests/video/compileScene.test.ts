import { describe, it, expect } from 'vitest';
import { compileScene } from '../../src/video/compileScene';
import { makePilotDraft, makeAudioReadyPilot } from '../fixtures/s2v/factories';

describe('Pure Scene Compiler Test Suite (Task 2)', () => {
  it('rejects compilation when narration has missing audio receipts', () => {
    const draftWithoutAudio = makePilotDraft();
    const result = compileScene(draftWithoutAudio);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((i) => i.code === 'AUDIO_MISSING')).toBe(true);
    }
  });

  it('compiles audio-ready pilot into deterministic immutable FrozenScene', () => {
    const audioReady = makeAudioReadyPilot();
    const res1 = compileScene(audioReady);
    const res2 = compileScene(audioReady);

    expect(res1.ok).toBe(true);
    expect(res2.ok).toBe(true);

    if (res1.ok && res2.ok) {
      const s1 = res1.value;
      const s2 = res2.value;

      // Deterministic identical hashes
      expect(s1.sceneSha256).toBe(s2.sceneSha256);
      expect(s1.draftSha256).toBe(s2.draftSha256);

      // Invariants
      expect(s1.watermark).toBe('EDUCATIONAL ILLUSTRATION — NOT FINANCIAL ADVICE');
      expect(s1.draft.outcome).toBe('STOP_LOSS');
      expect(s1.cues.length).toBe(7);
      expect(s1.events.length).toBeGreaterThan(0);

      // Total duration = 7 cues * 2s = 14s = 420 frames at 30fps
      expect(s1.frameCount).toBe(420);
      expect(s1.audioSampleCount).toBe(420 * 1600);
    }
  });

  it('freezes draft and scene: mutations to original draft do not mutate compiled scene', () => {
    const audioReady = makeAudioReadyPilot();
    const res = compileScene(audioReady);
    expect(res.ok).toBe(true);

    if (res.ok) {
      const frozen = res.value;

      // Try mutating the original draft
      audioReady.candles[0].close = 9999.0;
      expect(frozen.draft.candles[0].close).not.toBe(9999.0);

      // Verify Object.isFrozen
      expect(Object.isFrozen(frozen)).toBe(true);
      expect(Object.isFrozen(frozen.draft)).toBe(true);
      expect(Object.isFrozen(frozen.draft.candles)).toBe(true);
    }
  });

  it('rejects duration > 120s', () => {
    const audioReady = makeAudioReadyPilot();
    // 7 cues with 20 seconds each = 140s (> 120s maxDurationSec)
    audioReady.narration.forEach((cue) => {
      cue.audio!.sampleCount = 48000 * 20;
    });
    const res = compileScene(audioReady);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.issues.some((i) => i.code === 'DURATION_OUT_OF_BOUNDS')).toBe(true);
    }
  });
});

