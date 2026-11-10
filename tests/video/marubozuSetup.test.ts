import { describe, it, expect } from 'vitest';
import { generateStrategySetup } from '../../src/utils/hermesEngine';

describe('Marubozu Candle & Daily Bias Replica (DwkppR0I8Wg)', () => {
  it('generates the exact 13-candle sequence with giant Marubozu candle closing above previous high', () => {
    const { candles, overlays } = generateStrategySetup('Marubozu Daily Bias', 4128.0);
    expect(candles.length).toBe(13);

    // The 13th candle (index 12) must be a giant Bullish Marubozu
    const c13 = candles[12];
    expect(c13.close).toBeGreaterThan(c13.open);

    // Marubozu anatomy: virtually no wicks (high === close and low approx open)
    expect(c13.high).toBe(c13.close);
    expect(Math.abs(c13.low - c13.open)).toBeLessThanOrEqual(0.15);

    // Must close above the previous candle's high
    const c12 = candles[11];
    expect(c13.close).toBeGreaterThan(c12.high);

    // Previous high overlay exists
    const prevHighOverlay = overlays.find((o) => o.id === 'prev-high-line');
    expect(prevHighOverlay).toBeDefined();
    expect(prevHighOverlay?.type).toBe('LIQUIDITY_LINE');
  });
});
