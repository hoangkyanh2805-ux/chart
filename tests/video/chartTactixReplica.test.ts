import { describe, it, expect } from 'vitest';
import { generateStrategySetup } from '../../src/utils/hermesEngine';
import { THEMES } from '../../src/video/themes';

describe('ChartTactix BPR Replica & White Minimalist Theme (NXFicL21nZE)', () => {
  it('generates the exact 11-candle institutional sequence for Balanced Price Range', () => {
    const { candles, overlays } = generateStrategySetup('Balanced Price Range', 4128.0);
    expect(candles.length).toBe(11);

    // Bullish displacement candle at index 7 (c-8)
    const c8 = candles[7];
    expect(c8.close).toBeGreaterThan(c8.open);

    // Inversion displacement candle at index 9 (c-10)
    const c10 = candles[9];
    expect(c10.close).toBeLessThan(c10.open);

    // Check overlays: FVG and BPR box exist, NO cluttered LONG_SHORT covering the candles
    const hasLongShort = overlays.some((o) => o.type === 'LONG_SHORT');
    expect(hasLongShort).toBe(false);

    const fvgOverlay = overlays.find((o) => o.id === 'bullish-fvg-box');
    expect(fvgOverlay).toBeDefined();
    expect(fvgOverlay?.type).toBe('FVG');
  });

  it('verifies White Minimalist theme tokens match ChartTactix visual signature', () => {
    const whiteTheme = THEMES.white;
    expect(whiteTheme.background).toBe('#FFFFFF');
    expect(whiteTheme.bullishCandle).toBe('#11806C'); // Teal
    expect(whiteTheme.bearishCandle).toBe('#000000'); // Pitch Black
    expect(whiteTheme.candleWick).toBe('#000000'); // Black wicks
    expect(whiteTheme.fvgBoxStroke).toBe('#38BDF8'); // Sky blue
  });
});
