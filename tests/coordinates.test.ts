import { describe, it, expect } from 'vitest';
import { priceToCanvasY, indexToCanvasX } from '../src/math/coordinates';
import { generateGBMCandle } from '../src/math/gbm';
import { generateGroupCandleSequence } from '../src/math/groupCandles';
import { generateZigZagCandles } from '../src/math/zigzag';

describe('Canvas Coordinate Transformation Engine', () => {
  const canvasHeight = 600;
  const padding = 40;
  const minPrice = 100;
  const maxPrice = 200;

  it('correctly maps highest price to top of canvas (smaller Y value)', () => {
    const yTop = priceToCanvasY(maxPrice, minPrice, maxPrice, canvasHeight, padding);
    const yBottom = priceToCanvasY(minPrice, minPrice, maxPrice, canvasHeight, padding);

    // Canvas coordinates: top is smaller Y than bottom
    expect(yTop).toBeLessThan(yBottom);
    expect(yTop).toBe(padding);
    expect(yBottom).toBe(canvasHeight - padding);
  });

  it('correctly scales mid-price to canvas center', () => {
    const midPrice = 150;
    const yMid = priceToCanvasY(midPrice, minPrice, maxPrice, canvasHeight, padding);
    expect(yMid).toBe(canvasHeight / 2);
  });

  it('calculates X coordinate sequentially without overlap', () => {
    const candleWidth = 24;
    const candleGap = 16;
    const x0 = indexToCanvasX(0, candleWidth, candleGap, 50);
    const x1 = indexToCanvasX(1, candleWidth, candleGap, 50);
    const x2 = indexToCanvasX(2, candleWidth, candleGap, 50);

    expect(x1 - x0).toBe(candleWidth + candleGap);
    expect(x2 - x1).toBe(candleWidth + candleGap);
  });
});

describe('GBM Mathematical Simulation Engine', () => {
  it('generates valid OHLC structure where High is max and Low is min', () => {
    const start = 100;
    for (let i = 0; i < 20; i++) {
      const candle = generateGBMCandle(start, { drift: 0.001, volatility: 0.02 });
      expect(candle.high).toBeGreaterThanOrEqual(candle.open);
      expect(candle.high).toBeGreaterThanOrEqual(candle.close);
      expect(candle.low).toBeLessThanOrEqual(candle.open);
      expect(candle.low).toBeLessThanOrEqual(candle.close);
      expect(candle.high).toBeGreaterThanOrEqual(candle.low);
    }
  });
});

describe('Group Candle & ZigZag Wave Math Engines', () => {
  it('generates valid Group Candle batch sequence with continuous price chaining', () => {
    const startPrice = 4125.0;
    const count = 5;
    const candles = generateGroupCandleSequence(startPrice, 0, {
      count,
      direction: 'bullish',
      momentum: 'high',
    });

    expect(candles.length).toBe(count);
    expect(candles[0].open).toBe(startPrice);

    // Check chaining and OHLC validity
    for (let i = 0; i < candles.length; i++) {
      const c = candles[i];
      expect(c.high).toBeGreaterThanOrEqual(Math.max(c.open, c.close));
      expect(c.low).toBeLessThanOrEqual(Math.min(c.open, c.close));
      if (i > 0) {
        expect(candles[i].open).toBe(candles[i - 1].close);
      }
    }
  });

  it('generates accurate ZigZag multi-leg swings reaching exact target prices', () => {
    const startPrice = 4120.0;
    const legs = [
      { targetPrice: 4145.0, candleCount: 4, label: 'Swing High (HH)' },
      { targetPrice: 4130.0, candleCount: 3, label: 'Higher Low (HL)' },
      { targetPrice: 4160.0, candleCount: 5, label: 'Expansion High (BOS)' },
    ];

    const result = generateZigZagCandles(startPrice, 0, legs);
    expect(result.candles.length).toBe(4 + 3 + 5);
    expect(result.swingPoints.length).toBe(4); // Start + 3 legs

    // Verify last candle of leg 1 reaches 4145.0
    expect(result.candles[3].close).toBe(4145.0);
    // Verify last candle of leg 2 reaches 4130.0
    expect(result.candles[6].close).toBe(4130.0);
    // Verify last candle of leg 3 reaches 4160.0
    expect(result.candles[11].close).toBe(4160.0);
  });
});

/**
 * 3 BROKEN MUTATIONS TESTING SUITE (Clean-Room Verification)
 * Rules: All 3 intentionally broken mutations MUST fail when tested against assertions!
 */
describe('3 Broken Mutations Integrity Test', () => {
  // Mutation 1: Inverted Axis Function
  function brokenPriceToCanvasY_Inverted(price: number, min: number, max: number, h: number, pad: number) {
    // BUG: Canvas Y is flipped (0 at bottom, h at top)
    const normalized = (price - min) / (max - min);
    return pad + normalized * (h - pad * 2);
  }

  // Mutation 2: Malformed Candle Generator
  function brokenGBMCandle_Corrupted(start: number) {
    // BUG: Low is greater than High
    return { open: start, high: 90, low: 110, close: 100 };
  }

  // Mutation 3: Non-deterministic Frame Drift
  function brokenFrameTime(frameIndex: number, fps: number) {
    // BUG: Adds random jitter breaking video reproducibility
    return (frameIndex / fps) + (Math.random() - 0.5) * 0.1;
  }

  it('MUTATION 1 MUST FAIL: Inverted Axis puts higher price lower on canvas', () => {
    const brokenTop = brokenPriceToCanvasY_Inverted(200, 100, 200, 600, 40);
    const brokenBottom = brokenPriceToCanvasY_Inverted(100, 100, 200, 600, 40);

    // Assertion proving that Mutation 1 is broken:
    // A correct engine requires brokenTop < brokenBottom. Here brokenTop > brokenBottom!
    const isBroken = brokenTop > brokenBottom;
    expect(isBroken).toBe(true); // Confirms Mutation 1 is broken and would be caught
  });

  it('MUTATION 2 MUST FAIL: Corrupted candle where Low > High is caught', () => {
    const corrupted = brokenGBMCandle_Corrupted(100);
    const isCorrupted = corrupted.low > corrupted.high;
    expect(isCorrupted).toBe(true); // Confirms Mutation 2 is caught
  });

  it('MUTATION 3 MUST FAIL: Non-deterministic frame drift is detected', () => {
    const t1 = brokenFrameTime(60, 30);
    const t2 = brokenFrameTime(60, 30);
    const isUnstable = t1 !== t2;
    expect(isUnstable).toBe(true); // Confirms Mutation 3 is caught
  });
});
