import { describe, it, expect } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import { runRenderJob, createDeterministicSolidPng, writeDeterministicWav } from '../../src/server/video/runRenderJob';
import { compileScene } from '../../src/video/compileScene';
import { hashText } from '../../src/video/canonicalHash';
import { makeAudioReadyPilot } from '../fixtures/s2v/factories';

describe('Deterministic Local Media Supervisor & FFmpeg Transport (Task 5)', () => {
  it('encodes and verifies a technical vertical slice with image2pipe and WAV mux', async () => {
    const draft = makeAudioReadyPilot();
    // Reduce duration for fast test execution: 2 cues of 30 frames (1s each) = 60 frames = 2 seconds
    draft.narration = draft.narration.slice(0, 2);
    draft.narration[0].audio!.sampleCount = 48000;
    draft.narration[1].audio!.sampleCount = 48000;
    draft.source.selectedText = draft.narration.map((c) => c.text).join('');
    draft.source.selectedTextSha256 = hashText(draft.source.selectedText);
    const validIntents = new Set(draft.narration.map((c) => c.intentId));
    draft.storyboard = draft.storyboard.filter((sb) => validIntents.has(sb.intentId));

    const compileResult = compileScene(draft);
    if (!compileResult.ok) {
      console.error('Compile issues:', compileResult.issues);
    }
    expect(compileResult.ok).toBe(true);
    if (!compileResult.ok) throw new Error('compile failed');

    const scene = compileResult.value;
    expect(scene.frameCount).toBe(60);

    const runId = `test_run_${Date.now()}`;
    const testDir = path.resolve(process.cwd(), `livrables/s2v_runs/${runId}`);

    const jobReceipt = await runRenderJob(scene, {
      runId,
      outputDir: testDir,
      frameSource: async (idx) => createDeterministicSolidPng(1080, 1920, idx),
    });

    expect(jobReceipt.status).toBe('MEDIA_VERIFIED');
    expect(jobReceipt.observedMedia).toBeDefined();
    expect(jobReceipt.observedMedia?.valid).toBe(true);
    expect(jobReceipt.observedMedia?.frameCount).toBe(60);
    expect(jobReceipt.observedMedia?.width).toBe(1080);
    expect(jobReceipt.observedMedia?.height).toBe(1920);
    expect(jobReceipt.observedMedia?.hasAudio).toBe(true);

    const mp4Path = path.resolve(testDir, 'output.mp4');
    expect(fs.existsSync(mp4Path)).toBe(true);
  }, 45000); // 45s timeout for encoding 60 frames

  it('fails verification when frame count does not match expected scene count', async () => {
    const draft = makeAudioReadyPilot();
    draft.narration = draft.narration.slice(0, 1);
    draft.narration[0].audio!.sampleCount = 48000; // 30 frames expected
    draft.source.selectedText = draft.narration.map((c) => c.text).join('');
    draft.source.selectedTextSha256 = hashText(draft.source.selectedText);
    const validIntents = new Set(draft.narration.map((c) => c.intentId));
    draft.storyboard = draft.storyboard.filter((sb) => validIntents.has(sb.intentId));

    const compileResult = compileScene(draft);
    if (!compileResult.ok) {
      console.error('Compile issues test 2:', compileResult.issues);
    }
    if (!compileResult.ok) throw new Error('compile failed');

    const scene = compileResult.value;
    const runId = `test_run_fail_${Date.now()}`;
    const testDir = path.resolve(process.cwd(), `livrables/s2v_runs/${runId}`);

    // Dropping a frame in transport (streams only 29 frames for a 30-frame scene)
    const jobReceipt = await runRenderJob(scene, {
      runId,
      outputDir: testDir,
      framesToStream: 29, // Omit 1 frame
      frameSource: async (idx) => createDeterministicSolidPng(1080, 1920, idx),
    });

    // Should FAIL verification due to frame count mismatch (30 vs 35)
    expect(jobReceipt.status).toBe('FAILED');
    expect(jobReceipt.errorCode).toBe('MEDIA_VERIFICATION_FAILED');
    expect(jobReceipt.diagnostics.some((d) => d.includes('Frame count mismatch'))).toBe(true);
  }, 45000);
});
