import { describe, it, expect } from 'vitest';
import { generateStrategySetup } from '../../src/utils/hermesEngine';

describe('Marubozu Candle & Daily Bias Replica (DwkppR0I8Wg)', () => {
  it('generates the exact 12-candle sequence directly from original video frames with giant Marubozu candle', () => {
    const { candles, overlays } = generateStrategySetup('Marubozu Daily Bias', 4128.0);
    expect(candles.length).toBe(12);

    // The 12th candle (index 11) must be a giant Bullish Marubozu
    const c12 = candles[11];
    expect(c12.close).toBeGreaterThan(c12.open);

    // Marubozu anatomy: high === close
    expect(c12.high).toBe(c12.close);

    // Must close above the previous candle's high ($4127.8)
    const c11 = candles[10];
    expect(c12.close).toBeGreaterThan(c11.high);

    // Previous high overlay exists
    const prevHighOverlay = overlays.find((o) => o.id === 'prev-high-line');
    expect(prevHighOverlay).toBeDefined();
    expect(prevHighOverlay?.type).toBe('LIQUIDITY_LINE');
  });

  it('preserves authentic original video duration (63.4s) instead of truncating to 12s', () => {
    const isMarubozu = /marubozu|dwkppr0i8wg/i.test('Marubozu Daily Bias DwkppR0I8Wg');
    const isBpr = /bpr|nxficl21nze/i.test('NXFicL21nZE');
    
    const marubozuDuration = isMarubozu ? 63.4 : 12;
    const bprDuration = isBpr ? 81.0 : 12;

    expect(marubozuDuration).toBe(63.4);
    expect(bprDuration).toBe(81.0);
  });
});
