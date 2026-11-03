import { describe, it, expect } from 'vitest';
import { jevFastReflexVerify } from '../src/utils/jevReflexGate';
import { ChartTemplate } from '../src/data/templates';

/**
 * REA + JEV Verification Test Suite for Short Video Template:
 * Reverse-Engineered from YouTube Short: https://youtube.com/shorts/2W7MgNk3Wss
 * Title: Breakout Trap! Why Your Stop-Loss Gets Hit (1D to 15M Liquidity Strategy)
 */

export const BREAKOUT_TRAP_SHORT_TEMPLATE: ChartTemplate = {
  id: 'breakout-trap-liquidity-sweep-2w7mgnk3wss',
  title: '[Shorts 9:16] Bẫy Breakout & Chiến Lược Quét Thanh Khoản D1 -> M15',
  strategy: 'SMC',
  tier: 'Creator',
  aspectRatio: '9:16',
  duration: 15.0, // Scaled for fast-paced viral loop (or 56s full cadence)
  revealMode: 'sequential',
  description: 'Dịch ngược từ video Shorts 2W7MgNk3Wss: Bắt bài bẫy quét đáy ngày PDL, Market Structure Shift (MSS) và Sniper Entry tại 50% FVG.',
  headlineText: 'BREAKOUT TRAP: DONT BE LIQUIDITY',
  sublineText: 'Wait for D1 Sweep + M15 MSS + 50% FVG Retest',
  badges: ['1. RISK $30', '2. SL 20 PIPS', '3. R:R 1:3.5'],
  showCalloutPin: true,
  calloutPinText: '🎯 50% FVG C.E. RETEST ($4,129.80)',
  calloutCandleIndex: 3,
  showPipCounter: true,
  targetPips: 70,
  showExecutionBadge: true,
  executionOrder: {
    type: 'BUY',
    entry: 4129.8,
    sl: 4127.8, // 20 pips SL
    tp: 4136.8, // 70 pips TP (R:R 1:3.5)
    lot: 0.15,
    risk: 30, // $30 Risk Budget
  },
  scriptSubtitles: [
    { timePercent: 0.0, text: 'BREAKOUT TRAP: DONT BE LIQUIDITY! Vừa vào lệnh breakout đã dính ngay Stop Loss?', stageName: 'Hook' },
    { timePercent: 0.25, text: 'Đây không phải fakeout ngẫu nhiên, đây là bẫy quét thanh khoản (Liquidity Sweep) của Big Boys!', stageName: 'Trap' },
    { timePercent: 0.55, text: 'Giá quét đáy ngày PDL, tạo Market Structure Shift (MSS) phá đỉnh và để lại hộp FVG tăng trưởng!', stageName: 'Setup' },
    { timePercent: 0.8, text: 'Canh nến hồi về đúng 50% FVG tại $4,129.80 rồi BUY. Stop Loss 20 pips, chốt lời đỉnh ngày, R:R 1:3.5!', stageName: 'Execution' },
  ],
  spotlightEnabled: true,
  candles: [
    { id: 'c-d1-pdl', index: 0, open: 4132.0, high: 4134.0, low: 4128.0, close: 4129.0 }, // Cây 1: Chạm vùng PDL
    { id: 'c-m15-sweep', index: 1, open: 4129.0, high: 4130.0, low: 4126.0, close: 4128.5 }, // Cây 2: Chọc râu thủng PDL quét thanh khoản (Trap)
    { id: 'c-m15-mss', index: 2, open: 4128.5, high: 4133.0, low: 4128.0, close: 4132.5 }, // Cây 3: Nến xanh xung lực phá đỉnh swing high (MSS) & tạo FVG
    { id: 'c-m15-fvg-retest', index: 3, open: 4132.5, high: 4133.5, low: 4129.8, close: 4133.0 }, // Cây 4: Rút chân retest 50% FVG C.E.
    { id: 'c-m15-tp-expansion', index: 4, open: 4133.0, high: 4137.0, low: 4132.5, close: 4136.8 }, // Cây 5: Phóng thẳng về TP 70 pips
  ],
  overlays: [
    {
      id: 'ov-pdl-level',
      type: 'LIQUIDITY_LINE',
      startCandleIndex: 0,
      endCandleIndex: 4,
      priceStart: 4128.0,
      priceEnd: 4128.0,
      color: '#F43F5E',
      opacity: 0.9,
      label: 'Daily Low (PDL) $4,128.00',
    },
    {
      id: 'ov-mss-level',
      type: 'BREAK_OF_STRUCTURE',
      startCandleIndex: 1,
      endCandleIndex: 3,
      priceStart: 4130.0,
      priceEnd: 4130.0,
      color: '#3B82F6',
      opacity: 0.85,
      label: 'Market Structure Shift (MSS)',
    },
    {
      id: 'ov-fvg-box',
      type: 'FVG',
      startCandleIndex: 2,
      endCandleIndex: 4,
      priceStart: 4129.0,
      priceEnd: 4132.0,
      color: '#F59E0B',
      opacity: 0.35,
      label: 'Bullish FVG (50% C.E. $4,129.80)',
    },
    {
      id: 'ov-rr-execution',
      type: 'LONG_SHORT',
      startCandleIndex: 3,
      endCandleIndex: 4,
      priceStart: 4129.8,
      priceEnd: 4136.8,
      color: '#10B981',
      opacity: 0.4,
      label: 'BUY 0.15 lot @ $4,129.80 (1:3.5 RR)',
    },
  ],
};

describe('REA + JEV Video Engine: YouTube Shorts 2W7MgNk3Wss Verification', () => {
  it('REA Step: Should successfully parse and structure template according to Clean-Room specs', () => {
    expect(BREAKOUT_TRAP_SHORT_TEMPLATE.aspectRatio).toBe('9:16');
    expect(BREAKOUT_TRAP_SHORT_TEMPLATE.strategy).toBe('SMC');
    expect(BREAKOUT_TRAP_SHORT_TEMPLATE.candles.length).toBe(5);
    expect(BREAKOUT_TRAP_SHORT_TEMPLATE.overlays.length).toBe(4);
    expect(BREAKOUT_TRAP_SHORT_TEMPLATE.executionOrder?.type).toBe('BUY');
  });

  it('JEV Fast-Reflex Gatekeeper: Should pass financial risk-first verification in sub-10ms', () => {
    const verification = jevFastReflexVerify({
      headline: BREAKOUT_TRAP_SHORT_TEMPLATE.headlineText!,
      subline: BREAKOUT_TRAP_SHORT_TEMPLATE.sublineText!,
      slPips: 20,
      riskBudget: BREAKOUT_TRAP_SHORT_TEMPLATE.executionOrder!.risk,
      rrRatio: 3.5,
      targetPips: BREAKOUT_TRAP_SHORT_TEMPLATE.targetPips!,
      scriptSubtitles: BREAKOUT_TRAP_SHORT_TEMPLATE.scriptSubtitles,
      candles: BREAKOUT_TRAP_SHORT_TEMPLATE.candles,
    });

    expect(verification.reflexTimeMs).toBeLessThan(10);
    expect(verification.passed).toBe(true);
    expect(verification.gates.acousticSyncGate).toBe(true);
    expect(verification.gates.financialGate).toBe(true);
    expect(verification.gates.ohlcIntegrityGate).toBe(true);
  });

  it('Dynamic Script Parameterization: Can adapt to different custom tickers and price levels', () => {
    // Demonstration of dynamic customization:
    const customDynamicSetup = {
      ...BREAKOUT_TRAP_SHORT_TEMPLATE,
      id: 'custom-gold-cpi-sweep',
      title: 'CPI Gold Sweep Setup',
      headlineText: 'BREAKOUT TRAP: CPI SWEEP',
      candles: BREAKOUT_TRAP_SHORT_TEMPLATE.candles.map((c) => ({
        ...c,
        open: c.open + 10,
        high: c.high + 10,
        low: c.low + 10,
        close: c.close + 10,
      })),
    };

    expect(customDynamicSetup.candles[0].open).toBe(4142.0);
    expect(customDynamicSetup.candles[1].low).toBe(4136.0);
  });

  it('JEV 3 Broken Mutations Guard: Must catch and reject intentional flaws', () => {
    // Mutation 1: High < Low (Broken OHLC Geometry)
    const brokenOhlc = jevFastReflexVerify({
      headline: 'BREAKOUT TRAP: DONT BE LIQUIDITY',
      candles: [{ open: 4128, high: 4120, low: 4135, close: 4125 }],
    });
    expect(brokenOhlc.gates.ohlcIntegrityGate).toBe(false);

    // Mutation 2: Risk Violation (Over-leveraged / Invalid Risk Budget)
    const brokenRisk = jevFastReflexVerify({
      headline: 'BREAKOUT TRAP: DONT BE LIQUIDITY',
      slPips: 50, // Invalid SL
      riskBudget: 500, // Invalid Risk
      rrRatio: 1.0, // Invalid RR
    });
    expect(brokenRisk.gates.financialGate).toBe(false);

    // Mutation 3: Acoustic Desync (Headline banner doesn't match spoken hook)
    const acousticDesync = jevFastReflexVerify({
      headline: 'BREAKOUT TRAP: DONT BE LIQUIDITY',
      scriptSubtitles: [{ timePercent: 0.0, text: 'Chào mừng các bạn đến với kênh trading...', stageName: 'Hook' }],
    });
    expect(acousticDesync.gates.acousticSyncGate).toBe(false);
  });
});
