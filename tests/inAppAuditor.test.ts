import { describe, it, expect } from 'vitest';
import { validateAndNormalizeSetup } from '../src/utils/dynamicValidator';
import { Candle, ExecutionOrder } from '../src/types/chart';

describe('IN-APP TRADING COMPLIANCE AUDITOR & EXPORT HARD GATE', () => {
  const dummyCandles: Candle[] = [
    { id: 'c-1', index: 0, open: 4120, high: 4125, low: 4118, close: 4122 },
    { id: 'c-2', index: 1, open: 4122, high: 4126, low: 4120, close: 4124 },
    { id: 'c-3', index: 2, open: 4124, high: 4125, low: 4115, close: 4123 }, // Lower wick rejection
    { id: 'c-4', index: 3, open: 4123, high: 4132, low: 4122, close: 4130 },
  ];

  it('Mutation 1: Contradictory Buy Title with Sell Execution Order triggers BLOCKED status', () => {
    // Title is BUY pullback, but order is dirty SELL from previous template
    const brokenInput = {
      title: '1R LOSS BEFORE LOOKING AT CHART (BUY PULLBACK)',
      candles: dummyCandles,
      executionOrder: {
        type: 'SELL' as const,
        entry: 4136.0,
        sl: 4138.0,
        tp: 4112.0,
        lot: 0.05,
        risk: 30,
      },
      targetPips: 240,
      badges: ['1. LOSS $50', '2. SL 20 PIPS', '3. LOT 0.25'] as [string, string, string],
    };

    const report = validateAndNormalizeSetup(brokenInput);

    // Hard Gate Verification: Must be BLOCKED
    expect(report.isValid).toBe(false);
    expect(report.score).toBeLessThan(80);
    expect(report.checks.titleDirectionMatch).toBe(false);
    expect(report.warnings.some((w) => w.includes('Lệch hướng'))).toBe(true);
  });

  it('Mutation 2: Broken PnL Math (Inverted SL/TP prices) triggers math warning', () => {
    const invalidMathOrder: ExecutionOrder = {
      type: 'BUY',
      entry: 4128.0,
      sl: 4130.0, // SL higher than entry on BUY -> BROKEN
      tp: 4125.0, // TP lower than entry on BUY -> BROKEN
      lot: 0.25,
      risk: 50,
    };

    const report = validateAndNormalizeSetup({
      title: 'BUY SUPPORT REBOUND',
      candles: dummyCandles,
      executionOrder: invalidMathOrder,
    });

    expect(report.isValid).toBe(false);
    expect(report.checks.riskRewardValid).toBe(false);
  });

  it('Comprehensive 1-Click Auto-Fix fixes contradictory state into 100% PASS', () => {
    const brokenInput = {
      title: '1R LOSS BEFORE LOOKING AT CHART',
      candles: dummyCandles,
      executionOrder: {
        type: 'SELL' as const,
        entry: 4136.0,
        sl: 4138.0,
        tp: 4112.0,
        lot: 0.05,
        risk: 30,
      },
      targetPips: 240,
      badges: ['1. LOSS $50', '2. SL 20 PIPS', '3. LOT 0.25'] as [string, string, string],
    };

    const initialReport = validateAndNormalizeSetup(brokenInput);
    expect(initialReport.isValid).toBe(false);

    // Run Auto-Fix using normalizedSetup
    const fixedSetup = initialReport.normalizedSetup;
    expect(fixedSetup).toBeDefined();

    if (fixedSetup) {
      // Re-validate the auto-fixed setup
      const fixedReport = validateAndNormalizeSetup({
        title: brokenInput.title,
        candles: dummyCandles,
        executionOrder: fixedSetup.executionOrder,
        calloutPinText: fixedSetup.calloutPinText,
        calloutCandleIndex: fixedSetup.calloutCandleIndex,
        targetPips: fixedSetup.targetPips,
        scriptSubtitles: fixedSetup.scriptSubtitles,
        badges: brokenInput.badges,
      });

      // Assert it is now 100% PASS
      expect(fixedReport.isValid).toBe(true);
      expect(fixedReport.score).toBeGreaterThanOrEqual(80);
      expect(fixedReport.checks.titleDirectionMatch).toBe(true);
      expect(fixedReport.checks.riskRewardValid).toBe(true);

      // Assert exact math for $50 risk & 20 pips SL
      expect(fixedSetup.executionOrder.type).toBe('BUY');
      expect(fixedSetup.executionOrder.lot).toBe(0.25);
      expect(fixedSetup.executionOrder.risk).toBe(50);
      expect(fixedSetup.targetPips).toBe(70); // 20 * 3.5 = 70 pips
      expect(fixedSetup.calloutPinText).toContain('RÚT CHÂN');
      expect(fixedSetup.calloutPinText).toContain('HỖ TRỢ');
    }
  });

  it('In-App Auditor verifies $5,000 capital 1R risk sizing math accurately', () => {
    const report = validateAndNormalizeSetup({
      title: 'XAUUSD $5,000 ACCOUNT: 1R RISK-FIRST DISCIPLINE',
      candles: dummyCandles,
      badges: ['1. LOSS $50', '2. SL 20 PIPS', '3. LOT 0.25'],
    });

    const norm = report.normalizedSetup;
    expect(norm).toBeDefined();
    if (norm) {
      expect(norm.executionOrder.risk).toBe(50);
      expect(norm.executionOrder.lot).toBe(0.25);
      expect(norm.targetPips).toBe(70);
      expect(norm.scriptSubtitles[0].text).toContain('$50');
      expect(norm.scriptSubtitles[3].text).toContain('+70 pips');
    }
  });
});
