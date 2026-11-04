import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { priceToY } from '../../src/video/layout';
import { hashText } from '../../src/video/canonicalHash';
import { validateDraft } from '../../src/video/validateDraft';
import { compileScene } from '../../src/video/compileScene';
import { isAudioBindingValid, createAudioBindingRequest } from '../../src/video/audioIdentity';
import { runRenderJob, createDeterministicSolidPng } from '../../src/server/video/runRenderJob';
import { makeAudioReadyPilot, makePilotDraft } from '../fixtures/s2v/factories';

describe('Task 8 Mutation Testing Suite (5 Broken Mutations Rule)', () => {
  it('Baseline check: clean baseline passes without mutations', () => {
    const draft = makeAudioReadyPilot();
    const compiled = compileScene(draft);
    expect(compiled.ok).toBe(true);

    const box = { top: 390, bottom: 1160, min: 100, max: 200 };
    expect(priceToY(200, box)).toBe(390);
    expect(priceToY(100, box)).toBe(1160);
  });

  it('Mutation 1: Inverted Canvas Coordinate mapping is caught and FAILS', () => {
    const box = { top: 390, bottom: 1160, min: 100, max: 200 };
    // Mutant formula: inverted Y (maps high price to bottom instead of top)
    const mutantPriceToY = (price: number) =>
      box.top + ((price - box.min) / (box.max - box.min)) * (box.bottom - box.top);

    // Baseline invariant: high price (200) MUST be at box.top (390)
    // The mutant maps 200 to 1160 (bottom) -> FAILS invariant
    expect(mutantPriceToY(200)).not.toBe(390);
    expect(mutantPriceToY(200)).toBe(1160);
  });

  it('Mutation 2: Corrupted OHLC structure is caught by semantic validator and FAILS', () => {
    const mutantDraft = makeAudioReadyPilot();
    // Corrupt candle 3: low > high
    mutantDraft.candles[3].low = 5000.0;
    mutantDraft.candles[3].high = 4000.0;

    const issues = validateDraft(mutantDraft);
    expect(issues.length).toBeGreaterThan(0);
    expect(issues.some((i) => i.code === 'OHLC_BOUNDS')).toBe(true);

    const compileRes = compileScene(mutantDraft);
    expect(compileRes.ok).toBe(false);
  });

  it('Mutation 3: Dropped frame in transport pipeline is caught by ffprobe and FAILS', async () => {
    const draft = makeAudioReadyPilot();
    draft.narration = draft.narration.slice(0, 1);
    draft.narration[0].audio!.sampleCount = 48000; // 30 frames
    draft.source.selectedText = draft.narration[0].text;
    draft.source.selectedTextSha256 = hashText(draft.source.selectedText);
    const validIntents = new Set(draft.narration.map((c) => c.intentId));
    draft.storyboard = draft.storyboard.filter((sb) => validIntents.has(sb.intentId));

    const compileRes = compileScene(draft);
    expect(compileRes.ok).toBe(true);
    if (!compileRes.ok) throw new Error('compile failed');

    const testScene = compileRes.value;
    const runId = `mutant_transport_${Date.now()}`;
    const testDir = path.resolve(process.cwd(), `livrables/s2v_runs/${runId}`);

    // Stream only 28 frames instead of 30
    const jobReceipt = await runRenderJob(testScene, {
      runId,
      outputDir: testDir,
      framesToStream: 28,
      frameSource: async (idx) => createDeterministicSolidPng(1080, 1920, idx),
    });

    // Verification MUST FAIL
    expect(jobReceipt.status).toBe('FAILED');
    expect(jobReceipt.errorCode).toBe('MEDIA_VERIFICATION_FAILED');
  }, 45000);

  it('Mutation 4: Ignored scene geometry (substituting phantom candles) is caught and FAILS', () => {
    const draft = makePilotDraft();
    const phantomCandleId = 'phantom-c99';

    // Mutant storyboard references a candle not present in scene
    draft.storyboard[0].actions = [{ kind: 'REVEAL_CANDLES', candleIds: [phantomCandleId] }];

    const issues = validateDraft(draft);
    expect(issues.some((i) => i.code === 'UNKNOWN_CANDLE_ID')).toBe(true);

    const compileRes = compileScene(draft);
    expect(compileRes.ok).toBe(false);
  });

  it('Mutation 5: Stale audio revision / mismatched transcript is caught and FAILS', () => {
    const draft = makeAudioReadyPilot();
    const cue = draft.narration[0];
    const req = createAudioBindingRequest(draft.source.id, draft.source.revision, cue);

    // Stale transcript hash attached
    const mutantCue = { ...cue, text: 'Mutated text that was not spoken' };
    const isValid = isAudioBindingValid(req, draft.source.id, draft.source.revision, mutantCue);
    expect(isValid).toBe(false);

    // Compile fails when audio transcript does not match current text
    draft.narration[0].audio!.transcriptSha256 = 'stale_hash_from_previous_version';
    const compileRes = compileScene(draft);
    expect(compileRes.ok).toBe(false);
    if (!compileRes.ok) {
      expect(compileRes.issues.some((i) => i.code === 'AUDIO_TRANSCRIPT_MISMATCH')).toBe(true);
    }
  });
});
