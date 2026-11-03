import { describe, it, expect, vi } from 'vitest';
import { REA_ORIGINAL_CANDLES, renderPaperTheme } from '../src/components/canvas/renderPaperTheme';

describe('REA + JEV Paper Theme Video Reproduction Suite (2W7MgNk3Wss)', () => {
  it('REA Step: Reconstructed 17 sequence candles must be mathematically valid OHLC', () => {
    expect(REA_ORIGINAL_CANDLES.length).toBe(17);

    REA_ORIGINAL_CANDLES.forEach((c, idx) => {
      expect(c.high).toBeGreaterThanOrEqual(Math.max(c.open, c.close));
      expect(c.low).toBeLessThanOrEqual(Math.min(c.open, c.close));
      expect(c.phase).toBeGreaterThanOrEqual(0.0);
      expect(c.phase).toBeLessThanOrEqual(1.0);
    });

    // Check specific structural milestones from the video:
    // 1. Sweep Candle (Index 5) must puncture below Daily Low 4128.0
    const sweepCandle = REA_ORIGINAL_CANDLES[5];
    expect(sweepCandle.low).toBeLessThan(4128.0);

    // 2. Reclaim Candle (Index 6) closes back above Daily Low
    const reclaimCandle = REA_ORIGINAL_CANDLES[6];
    expect(reclaimCandle.close).toBeGreaterThan(4128.0);

    // 3. MSS Candle (Index 9) expands above Recent High (4135.0)
    const mssCandle = REA_ORIGINAL_CANDLES[9];
    expect(mssCandle.high).toBeGreaterThanOrEqual(4135.0);
    expect(mssCandle.close).toBeGreaterThan(mssCandle.open); // Strong green

    // 4. Retest Candle (Index 13) closes bullish
    const retestCandle = REA_ORIGINAL_CANDLES[13];
    expect(retestCandle.close).toBeGreaterThan(retestCandle.open);

    // 5. Target Expansion (Index 16) hits Daily High 4140.0
    const targetCandle = REA_ORIGINAL_CANDLES[16];
    expect(targetCandle.high).toBeGreaterThanOrEqual(4140.0);
  });

  it('Canvas Renderer: Executes completely and draws core video branding elements', () => {
    const filledTexts: string[] = [];
    const strokes: string[] = [];

    const mockCtx = {
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      font: '',
      textAlign: '',
      setLineDash: vi.fn(),
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      arc: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      roundRect: vi.fn(),
      fillText: vi.fn((txt: string) => filledTexts.push(txt)),
      strokeText: vi.fn((txt: string) => strokes.push(txt)),
      measureText: vi.fn(() => ({ width: 80 })),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    // Render at progress = 1.0 (final state)
    renderPaperTheme({
      ctx: mockCtx,
      width: 360,
      height: 640,
      progress: 1.0,
      currentTime: 15.0,
      duration: 15.0,
    });

    // Verify key brand elements and annotations are drawn
    expect(filledTexts).toContain('MARKET');
    expect(filledTexts).toContain('ANALYSIS');
    expect(filledTexts).toContain('DAILY HIGH');
    expect(filledTexts).toContain('DAILY LOW');
    expect(filledTexts).toContain('STOP');
    expect(filledTexts).toContain('FVG');
    expect(filledTexts).toContain('ENTRY');
    expect(filledTexts).toContain('TARGET');
    expect(filledTexts).toContain('@marketanalysis-13');
    expect(strokes).toContain('@marketanalysis-13');
  });

  it('Kinetic Headline Progression: Correctly switches text through the 10 stages', () => {
    const checkHeadlinesAtProgress = (prog: number) => {
      const texts: string[] = [];
      const mockCtx = {
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        font: '',
        textAlign: '',
        setLineDash: vi.fn(),
        fillRect: vi.fn(),
        strokeRect: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        arc: vi.fn(),
        closePath: vi.fn(),
        fill: vi.fn(),
        stroke: vi.fn(),
        roundRect: vi.fn(),
        fillText: vi.fn((txt: string) => texts.push(txt)),
        strokeText: vi.fn(),
        measureText: vi.fn(() => ({ width: 80 })),
        save: vi.fn(),
        restore: vi.fn(),
        translate: vi.fn(),
        rotate: vi.fn(),
      } as unknown as CanvasRenderingContext2D;

      renderPaperTheme({
        ctx: mockCtx,
        width: 360,
        height: 640,
        progress: prog,
        currentTime: prog * 15,
        duration: 15.0,
      });

      return texts;
    };

    // Stage 1 (0.05): BREAKOUT / ENTRY?
    const s1 = checkHeadlinesAtProgress(0.05);
    expect(s1).toContain('BREAKOUT');
    expect(s1).toContain('ENTRY?');

    // Stage 2 (0.12): LIQUIDITY / SWEEP.
    const s2 = checkHeadlinesAtProgress(0.12);
    expect(s2).toContain('LIQUIDITY');
    expect(s2).toContain('SWEEP.');

    // Stage 4 (0.30): DAILY / HIGH + LOW.
    const s4 = checkHeadlinesAtProgress(0.30);
    expect(s4).toContain('DAILY');
    expect(s4).toContain('HIGH + LOW.');

    // Stage 8 (0.72): FVG / ENTRY?
    const s8 = checkHeadlinesAtProgress(0.72);
    expect(s8).toContain('FVG');

    // Stage 9 (0.82): RETEST. / BULLISH CLOSE.
    const s9 = checkHeadlinesAtProgress(0.82);
    expect(s9).toContain('RETEST.');
    expect(s9).toContain('BULLISH CLOSE.');

    // Stage 10 (0.95): COMMENT / MSS OR FVG?
    const s10 = checkHeadlinesAtProgress(0.95);
    expect(s10).toContain('COMMENT');
    expect(s10).toContain('MSS OR FVG?');
  });
});
