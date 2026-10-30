import { describe, it, expect } from 'vitest';
import {
  extractSemanticIntent,
  validateCandleGeometry,
  enforceRiskFirstMath,
  validateAndNormalizeSetup,
} from '../src/utils/dynamicValidator';
import { Candle } from '../src/types/chart';

describe('SPEC-DYNAMIC-CONTENT-RUNTIME-VALIDATOR Test Suite', () => {
  describe('Gate 1: Semantic Intent Extraction', () => {
    it('detects BUY intent from Vietnamese and English keywords', () => {
      expect(extractSemanticIntent('QUÉT ĐÁY PHIÊN Á BÙNG NỔ TĂNG GIÁ')).toBe('BUY');
      expect(extractSemanticIntent('High R:R Scalp Gold - Canh Mua 50% FVG C.E.')).toBe('BUY');
      expect(extractSemanticIntent('Wyckoff Spring Reclaim Support')).toBe('BUY');
    });

    it('detects SELL intent from Vietnamese and English keywords', () => {
      expect(extractSemanticIntent('BẪY DỤ BUY QUÉT ĐỈNH PHIÊN Á SẬP 240 PIPS')).toBe('SELL');
      expect(extractSemanticIntent('Tin CPI Giật Bấc Judas Swing Sập Gãy Cấu Trúc')).toBe('SELL');
      expect(extractSemanticIntent('H1 Supply Zone Institutional Distribution')).toBe('SELL');
    });

    it('returns NEUTRAL when no strong keywords are found', () => {
      expect(extractSemanticIntent('Biểu đồ XAUUSD M15 ngày 28/10')).toBe('NEUTRAL');
    });
  });

  describe('Gate 2: Candle Geometry & Wick Analysis', () => {
    it('validates bullish candle drift for BUY setup', () => {
      const bullishCandles: Candle[] = [
        { id: '1', index: 0, open: 4120, high: 4125, low: 4118, close: 4124 },
        { id: '2', index: 1, open: 4124, high: 4140, low: 4122, close: 4138 },
      ];
      const result = validateCandleGeometry(bullishCandles, 'BUY', 0);
      expect(result.isDriftValid).toBe(true);
      expect(result.drift).toBeGreaterThan(0);
    });

    it('flags bearish drift when expected direction is BUY', () => {
      const bearishCandles: Candle[] = [
        { id: '1', index: 0, open: 4140, high: 4142, low: 4135, close: 4136 },
        { id: '2', index: 1, open: 4136, high: 4137, low: 4110, close: 4112 },
      ];
      const result = validateCandleGeometry(bearishCandles, 'BUY', 0);
      expect(result.isDriftValid).toBe(false);
      expect(result.drift).toBeLessThan(0);
    });

    it('validates upper wick ratio on a liquidity sweep high bar', () => {
      const sweepCandle: Candle = {
        id: 's',
        index: 2,
        open: 4136,
        high: 4150, // High wick 4150 - 4137 = 13 pts
        low: 4134, // Low 4134, Total range = 16 pts
        close: 4137, // Upper wick ratio = 13 / 16 = 81%
      };
      const result = validateCandleGeometry([sweepCandle, sweepCandle], 'SELL', 0);
      expect(result.isTriggerWickValid).toBe(true);
      expect(result.triggerWickRatio).toBeGreaterThanOrEqual(0.35);
    });
  });

  describe('Gate 3: Risk-First Math Enforcer', () => {
    it('generates immutable 20-pip SL and 1:3.5 RR for BUY orders', () => {
      const order = enforceRiskFirstMath(4130.0, 'BUY');
      expect(order.type).toBe('BUY');
      expect(order.entry).toBe(4130.0);
      expect(order.sl).toBe(4128.0); // 20 pips = 2.0 gold pts
      expect(order.tp).toBe(4137.0); // 70 pips = 7.0 gold pts
      expect(order.lot).toBe(0.05);
      expect(order.risk).toBe(30);

      const rr = (order.tp - order.entry) / (order.entry - order.sl);
      expect(rr).toBe(3.5);
    });

    it('generates immutable 20-pip SL and 1:3.5 RR for SELL orders', () => {
      const order = enforceRiskFirstMath(4135.0, 'SELL');
      expect(order.type).toBe('SELL');
      expect(order.entry).toBe(4135.0);
      expect(order.sl).toBe(4137.0); // 20 pips above
      expect(order.tp).toBe(4128.0); // 70 pips below
      expect(order.lot).toBe(0.05);
      expect(order.risk).toBe(30);

      const rr = (order.entry - order.tp) / (order.sl - order.entry);
      expect(rr).toBe(3.5);
    });
  });

  describe('Full Pipeline: validateAndNormalizeSetup()', () => {
    it('Case 1: Standard valid setup scores >= 80 and isValid is true', () => {
      const report = validateAndNormalizeSetup({
        title: 'BẪY DỤ BUY QUÉT ĐỈNH Á SẬP 240 PIPS',
        candles: [
          { id: '1', index: 0, open: 4130, high: 4135, low: 4128, close: 4134 },
          { id: '2', index: 1, open: 4134, high: 4146, low: 4132, close: 4135 }, // Sweep wick
          { id: '3', index: 2, open: 4135, high: 4136, low: 4110, close: 4112 }, // Dump
        ],
        executionOrder: {
          type: 'SELL',
          entry: 4135.0,
          sl: 4143.0,
          tp: 4110.0,
          lot: 0.05,
          risk: 30,
        },
        calloutCandleIndex: 1,
        scriptSubtitles: [
          { timePercent: 0.0, text: 'Nến xanh lớn dụ phe mua...' },
          { timePercent: 0.28, text: 'Quét râu đỉnh gom thanh khoản...' },
          { timePercent: 0.58, text: 'Sập mạnh gãy cấu trúc...' },
          { timePercent: 0.82, text: 'Vào lệnh chốt lời 240 pips...' },
        ],
      });

      expect(report.isValid).toBe(true);
      expect(report.score).toBeGreaterThanOrEqual(80);
      expect(report.expectedDirection).toBe('SELL');
      expect(report.checks.titleDirectionMatch).toBe(true);
    });

    it('Case 2: Inverted input (Title BUY but order SELL) is caught and auto-normalized to BUY', () => {
      const report = validateAndNormalizeSetup({
        title: 'LONDON QUÉT ĐÁY Á BÙNG NỔ TĂNG GIÁ',
        candles: [
          { id: '1', index: 0, open: 4120, high: 4125, low: 4115, close: 4122 },
          { id: '2', index: 1, open: 4122, high: 4145, low: 4120, close: 4142 },
        ],
        executionOrder: {
          type: 'SELL', // WRONG DIRECTION!
          entry: 4130,
          sl: 4135,
          tp: 4115,
          lot: 0.05,
          risk: 30,
        },
      });

      // Detected inconsistency
      expect(report.checks.titleDirectionMatch).toBe(false);
      expect(report.expectedDirection).toBe('BUY');
      expect(report.warnings.length).toBeGreaterThan(0);

      // Auto-normalized proposal fixes it
      expect(report.normalizedSetup).toBeDefined();
      expect(report.normalizedSetup!.executionOrder.type).toBe('BUY');
      expect(report.normalizedSetup!.calloutPinText).toContain('ĐÁY');
      expect(report.normalizedSetup!.scriptSubtitles.length).toBe(4);
    });

    it('Case 4: Enforces 1:3.5 RR when dynamic input has sub-optimal RR', () => {
      const report = validateAndNormalizeSetup({
        title: 'Scalp XAUUSD',
        candles: [
          { id: '1', index: 0, open: 4130, high: 4132, low: 4128, close: 4131 },
          { id: '2', index: 1, open: 4131, high: 4136, low: 4130, close: 4135 },
        ],
        executionOrder: {
          type: 'BUY',
          entry: 4130.0,
          sl: 4125.0, // SL 5 pts
          tp: 4135.0, // TP 5 pts -> RR 1:1 (FAIL)
          lot: 0.05,
          risk: 30,
        },
      });

      expect(report.checks.riskRewardValid).toBe(false);
      expect(report.normalizedSetup!.executionOrder.tp).toBeGreaterThanOrEqual(4137.0);
    });
  });
});

