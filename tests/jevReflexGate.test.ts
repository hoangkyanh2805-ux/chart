import { describe, it, expect } from 'vitest';
import { jevFastReflexVerify } from '../src/utils/jevReflexGate';

describe('Jev Reflex Decision Layer (System 1 Sub-10ms Gatekeeper)', () => {
  it('should execute in sub-10ms latency', () => {
    const res = jevFastReflexVerify({
      headline: 'CPI TRAP: DONT BE LIQUIDITY',
      slPips: 20,
      riskBudget: 30,
      rrRatio: 3.5,
      targetPips: 70,
    });

    expect(res.reflexTimeMs).toBeLessThan(10);
    expect(res.passed).toBe(true);
  });

  it('should auto-calibrate financial violations (SL != 20p, RR < 3.5)', () => {
    const res = jevFastReflexVerify({
      headline: 'TEST VIOLATION SETUP',
      slPips: 8, // Invalid!
      riskBudget: 50, // Invalid!
      rrRatio: 1.5, // Invalid!
    });

    expect(res.passed).toBe(false);
    expect(res.calibratedPayload.slPips).toBe(20);
    expect(res.calibratedPayload.riskBudget).toBe(30);
    expect(res.calibratedPayload.rrRatio).toBe(3.5);
    expect(res.calibratedPayload.targetPips).toBe(70);
    expect(res.interventions.length).toBeGreaterThan(0);
  });

  it('should enforce acoustic sync between spoken hook and headline banner', () => {
    const res = jevFastReflexVerify({
      headline: 'STOP CHASING THE CPI SPIKE',
      subline: 'Wait for the sweep',
      scriptSubtitles: [
        { timePercent: 0.0, text: 'Rất nhiều trader thấy cây nến xanh vội BUY...', stageName: 'Hook' },
      ],
    });

    expect(res.gates.acousticSyncGate).toBe(false);
    expect(res.calibratedPayload.scriptSubtitles![0].text).toContain('STOP CHASING THE CPI SPIKE');
  });

  it('should repair invalid candle OHLC geometry (High < Open or Low > Close)', () => {
    const res = jevFastReflexVerify({
      headline: 'BROKEN CANDLE MUTATION',
      candles: [
        { open: 4130, high: 4125, low: 4135, close: 4128 }, // Broken! High < Open and Low > Close
      ],
    });

    expect(res.gates.ohlcIntegrityGate).toBe(false);
    const fixedCandle = res.calibratedPayload.candles![0];
    expect(fixedCandle.high).toBeGreaterThanOrEqual(fixedCandle.open);
    expect(fixedCandle.low).toBeLessThanOrEqual(fixedCandle.close);
  });
});

