import { describe, it, expect, vi } from 'vitest';
import { priceToY, SAFE_ZONES } from '../../src/video/layout';
import { renderFrame } from '../../src/video/renderFrame';
import { compileScene } from '../../src/video/compileScene';
import { makeAudioReadyPilot } from '../fixtures/s2v/factories';

function createMockContext(): CanvasRenderingContext2D {
  return {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    font: '',
    textAlign: '',
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    fillText: vi.fn(),
    strokeText: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    roundRect: vi.fn(),
    setLineDash: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    measureText: vi.fn((text: string) => ({ width: text.length * 15 })),
  } as unknown as CanvasRenderingContext2D;
}

describe('Deterministic Renderer & Layout Suite (Task 3)', () => {
  it('maps higher price above lower price on canvas Y axis', () => {
    const box = { top: 390, bottom: 1160, min: 100, max: 200 };
    expect(priceToY(200, box)).toBe(390); // max price -> top
    expect(priceToY(100, box)).toBe(1160); // min price -> bottom
    expect(priceToY(150, box)).toBe((390 + 1160) / 2); // middle price -> middle Y

    // Higher price has strictly smaller Y coordinate
    expect(priceToY(180, box)).toBeLessThan(priceToY(120, box));
  });

  it('rejects degenerate price or box ranges', () => {
    expect(() => priceToY(150, { top: 390, bottom: 1160, min: 100, max: 100 })).toThrow(
      'Degenerate price range'
    );
    expect(() => priceToY(150, { top: 1160, bottom: 390, min: 100, max: 200 })).toThrow(
      'Degenerate vertical box'
    );
  });

  it('renderFrame executes synchronously and returns valid FrameReceipt', () => {
    const pilot = makeAudioReadyPilot();
    const compiled = compileScene(pilot);
    expect(compiled.ok).toBe(true);
    if (!compiled.ok) throw new Error('compile failed');

    const scene = compiled.value;
    const mockCtx = createMockContext();

    // Render frame 0
    const receipt0 = renderFrame(mockCtx, scene, 0);
    expect(receipt0.frame).toBe(0);
    expect(receipt0.sceneSha256).toBe(scene.sceneSha256);
    expect(receipt0.visibleIds).toContain('watermark');
    expect(receipt0.visibleIds).toContain('cue:disclosure');

    // Render final cue frame (e.g. frame 400)
    const receiptFinal = renderFrame(mockCtx, scene, scene.frameCount - 1);
    expect(receiptFinal.frame).toBe(scene.frameCount - 1);
    expect(receiptFinal.visibleIds).toContain('watermark');
    expect(receiptFinal.visibleIds).toContain('outcome:STOP_LOSS');
  });

  it('asserts chart region changes when visible candles/geometry change', () => {
    const pilot = makeAudioReadyPilot();
    const compiled = compileScene(pilot);
    if (!compiled.ok) throw new Error('compile failed');

    const scene = compiled.value;
    const mockCtx = createMockContext();

    // Frame 0 has no revealed candles yet (only disclosure)
    const receipt0 = renderFrame(mockCtx, scene, 0);
    const candlesAt0 = receipt0.bounds.filter((b) => b.id.startsWith('candle:'));
    expect(candlesAt0.length).toBe(0);

    // Frame 100 is in context cue where c1, c2, c3 are revealed
    const receipt100 = renderFrame(mockCtx, scene, 100);
    const candlesAt100 = receipt100.bounds.filter((b) => b.id.startsWith('candle:'));
    expect(candlesAt100.length).toBe(3);
  });

  it('renders with paper, dark, and white themes preserving semantic visibleIds', () => {
    const themes = ['paper', 'dark', 'white'] as const;

    for (const theme of themes) {
      const pilot = makeAudioReadyPilot();
      pilot.theme = theme;
      const compiled = compileScene(pilot);
      if (!compiled.ok) throw new Error('compile failed');

      const mockCtx = createMockContext();
      const receipt = renderFrame(mockCtx, compiled.value, 150);

      expect(receipt.visibleIds).toContain('watermark');
      expect(receipt.visibleIds).toContain('overlay:lvl-support');
    }
  });

  it('throws error when frameIndex is out of bounds', () => {
    const pilot = makeAudioReadyPilot();
    const compiled = compileScene(pilot);
    if (!compiled.ok) throw new Error('compile failed');

    const mockCtx = createMockContext();
    expect(() => renderFrame(mockCtx, compiled.value, -1)).toThrow('out of bounds');
    expect(() => renderFrame(mockCtx, compiled.value, compiled.value.frameCount)).toThrow(
      'out of bounds'
    );
  });
});

