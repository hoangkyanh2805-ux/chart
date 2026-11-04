import { describe, it, expect, vi } from 'vitest';
import { REA_ORIGINAL_CANDLES, renderPaperTheme } from '../src/components/canvas/renderPaperTheme';

describe('REA + JEV Paper Theme Video Reproduction Suite (2W7MgNk3Wss)', () => {
  it('REA Step: Reconstructed 17 sequence candles must be mathematically valid OHLC', () => {
    expect(REA_ORIGINAL_CANDLES.length).toBe(17);

    REA_ORIGINAL_CANDLES.forEach((c) => {
      expect(c.high).toBeGreaterThanOrEqual(Math.max(c.open, c.close));
      expect(c.low).toBeLessThanOrEqual(Math.min(c.open, c.close));
      expect(c.startSec).toBeGreaterThanOrEqual(0.0);
      expect(c.startSec).toBeLessThanOrEqual(58.5);
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

    // Render at full duration = 58.5s
    renderPaperTheme({
      ctx: mockCtx,
      width: 360,
      height: 640,
      progress: 1.0,
      currentTime: 58.5,
      duration: 58.5,
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
    expect(filledTexts.some((t) => t.includes('@azzammastertradinggold') || t.includes('@marketanalysis-13'))).toBe(true);
    expect(strokes.some((t) => t.includes('@azzammastertradinggold') || t.includes('@marketanalysis-13'))).toBe(true);
  });

  it('Kinetic Headline Progression: Correctly switches text through the exact 58.5s timeline', () => {
    const checkHeadlinesAtTime = (sec: number) => {
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
        progress: sec / 58.5,
        currentTime: sec,
        duration: 58.5,
      });

      return texts;
    };

    // Stage 1 (3s): BREAKOUT / ENTRY?
    const s1 = checkHeadlinesAtTime(3.0);
    expect(s1).toContain('BREAKOUT');
    expect(s1).toContain('ENTRY?');

    // Stage 2 (8s): SAVE THIS
    const s2 = checkHeadlinesAtTime(8.0);
    expect(s2).toContain('SAVE THIS');

    // Stage 3 (15s): DAILY / HIGH + LOW.
    const s3 = checkHeadlinesAtTime(15.0);
    expect(s3).toContain('DAILY');
    expect(s3).toContain('HIGH + LOW.');

    // Stage 4 (24s): DON'T SELL / THE BREAKOUT.
    const s4 = checkHeadlinesAtTime(24.0);
    expect(s4).toContain("DON'T SELL");

    // Stage 5 (30s): WAIT FOR / RECLAIM.
    const s5 = checkHeadlinesAtTime(30.0);
    expect(s5).toContain('WAIT FOR');
    expect(s5).toContain('RECLAIM.');

    // Stage 6 (40s): FVG
    const s6 = checkHeadlinesAtTime(40.0);
    expect(s6).toContain('FVG');

    // Stage 7 (48s): RETEST. / BULLISH CLOSE.
    const s7 = checkHeadlinesAtTime(48.0);
    expect(s7).toContain('RETEST.');
    expect(s7).toContain('BULLISH CLOSE.');

    // Stage 8 (55s): COMMENT / MSS OR FVG?
    const s8 = checkHeadlinesAtTime(55.0);
    expect(s8).toContain('COMMENT');
    expect(s8).toContain('MSS OR FVG?');
  });

  it('Dynamic Script Mode: Renders custom candles, overlays, auto-wrapped headlines, and official branding', () => {
    const filledTexts: string[] = [];
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
      strokeText: vi.fn(),
      measureText: vi.fn((str: string) => ({ width: str.length * 8 })),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    renderPaperTheme({
      ctx: mockCtx,
      width: 360,
      height: 640,
      progress: 0.8,
      currentTime: 24.0,
      duration: 30.0,
      headlineText: 'THE 30-DAY XAUUSD ROADMAP: LEARN IN THE RIGHT ORDER',
      sublineText: 'Chiến Lược Chuẩn Hóa: LONG-20261013-30DAY-XAUUSD-ROADMAP',
      candles: [
        { id: 'sc-1', index: 0, open: 4125.0, high: 4130.0, low: 4123.0, close: 4129.0 },
        { id: 'sc-2', index: 1, open: 4129.0, high: 4134.0, low: 4127.5, close: 4133.0 },
        { id: 'sc-3', index: 2, open: 4133.0, high: 4145.0, low: 4131.0, close: 4142.0 },
      ],
      overlays: [
        {
          id: 'ov-fvg',
          type: 'FVG',
          startCandleIndex: 1,
          endCandleIndex: 2,
          priceStart: 4129.0,
          priceEnd: 4134.0,
          label: 'FVG 50% C.E.',
        },
      ],
    });

    // Verify official channel branding & disclaimer
    expect(filledTexts).toContain('@azzammastertradinggold');
    expect(filledTexts).toContain('EDUCATIONAL ILLUSTRATION — NOT FINANCIAL ADVICE');

    // Verify FVG overlay rendered
    expect(filledTexts).toContain('FVG 50% C.E.');

    // Verify headline auto-wrap lines were rendered
    const hasRoadmapHeadline = filledTexts.some((t) => t.includes('30-DAY') || t.includes('ROADMAP'));
    expect(hasRoadmapHeadline).toBe(true);
  });
});
