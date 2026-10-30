import { describe, it, expect } from 'vitest';
import { formatKlinesToCandles, buildRealMarketCaseStudy } from '../src/utils/realMarketFeed';

describe('Real-Market Case Study Importer & Feed Test Suite', () => {
  const rawMockKlines = [
    [1730120400000, '4055.20', '4058.50', '4054.10', '4057.80', '124.5', 1730121299999],
    [1730121300000, '4057.80', '4062.00', '4056.50', '4061.20', '210.8', 1730122199999],
    [1730122200000, '4061.20', '4064.50', '4059.00', '4060.10', '350.2', 1730123099999], // High sweep wick 4064.50
    [1730123100000, '4060.10', '4060.50', '4052.00', '4053.40', '420.1', 1730123999999], // Dump
    [1730124000000, '4053.40', '4057.00', '4051.80', '4055.50', '180.4', 1730124899999], // Retest
    [1730124900000, '4055.50', '4056.00', '4046.00', '4047.20', '290.7', 1730125799999], // Sells
    [1730125800000, '4047.20', '4048.00', '4038.50', '4040.00', '315.6', 1730126699999], // TP reached
  ];

  it('correctly parses raw Binance klines to valid Candle[] structure', () => {
    const candles = formatKlinesToCandles(rawMockKlines);
    expect(candles.length).toBe(7);

    candles.forEach((c, idx) => {
      expect(c.index).toBe(idx);
      expect(c.high).toBeGreaterThanOrEqual(c.open);
      expect(c.high).toBeGreaterThanOrEqual(c.close);
      expect(c.low).toBeLessThanOrEqual(c.open);
      expect(c.low).toBeLessThanOrEqual(c.close);
    });

    expect(candles[2].high).toBe(4064.5);
  });

  it('builds an authentic educational SELL case study when market sweeps high and sells off', () => {
    const candles = formatKlinesToCandles(rawMockKlines);
    const caseStudy = buildRealMarketCaseStudy(candles, 'XAUUSD');

    expect(caseStudy.symbol).toBe('XAUUSD');
    expect(caseStudy.executionOrder.type).toBe('SELL');
    expect(caseStudy.executionOrder.risk).toBe(30);

    // Direction check: SL > Entry > TP
    const { entry, sl, tp } = caseStudy.executionOrder;
    expect(sl).toBeGreaterThan(entry);
    expect(entry).toBeGreaterThan(tp);

    // Risk:Reward check >= 3.0
    const rr = (entry - tp) / (sl - entry);
    expect(rr).toBeGreaterThanOrEqual(3.0);

    // Pin should be placed at the high wick (index 2)
    expect(caseStudy.calloutCandleIndex).toBe(2);
    expect(caseStudy.calloutPinText).toContain('ĐỈNH');

    // 4-stage subtitles present
    expect(caseStudy.scriptSubtitles.length).toBe(4);
    expect(caseStudy.scriptSubtitles[0].stageName).toBe('Hook');
    expect(caseStudy.scriptSubtitles[3].stageName).toBe('Execution');
  });

  it('builds an authentic educational BUY case study when market sweeps low and rallies', () => {
    const rawBullishKlines = [
      [1, '4050.0', '4052.0', '4048.0', '4049.0', '100', 2],
      [2, '4049.0', '4050.0', '4038.0', '4042.0', '200', 3], // Low sweep wick 4038.0
      [3, '4042.0', '4056.0', '4041.0', '4055.0', '300', 4], // Strong expansion up
      [4, '4055.0', '4065.0', '4054.0', '4063.0', '400', 5], // Rally
    ];

    const candles = formatKlinesToCandles(rawBullishKlines);
    const caseStudy = buildRealMarketCaseStudy(candles, 'XAUUSD');

    expect(caseStudy.executionOrder.type).toBe('BUY');
    const { entry, sl, tp } = caseStudy.executionOrder;
    expect(tp).toBeGreaterThan(entry);
    expect(entry).toBeGreaterThan(sl);

    const rr = (tp - entry) / (entry - sl);
    expect(rr).toBeGreaterThanOrEqual(3.0);
    expect(caseStudy.calloutPinText).toContain('ĐÁY');
  });

  it('rejects arrays with fewer than 3 candles', () => {
    const invalidKlines = [
      [1, '4050.0', '4052.0', '4048.0', '4049.0', '100', 2],
    ];
    const candles = formatKlinesToCandles(invalidKlines);
    expect(() => buildRealMarketCaseStudy(candles)).toThrow();
  });
});

