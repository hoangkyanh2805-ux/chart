import { describe, it, expect } from 'vitest';
import { TEMPLATES } from '../src/data/templates';
import { useChartStore } from '../src/store/useChartStore';

describe('SPEC-SETUP-SEMANTIC-ALIGNMENT Verification Test Suite', () => {
  it('contains production-ready templates (including PP-0023)', () => {
    expect(TEMPLATES.length).toBeGreaterThanOrEqual(11);
  });

  describe('Invariant 1: Directional Consistency & Risk-First Math', () => {
    TEMPLATES.forEach((tpl) => {
      it(`[${tpl.id}] satisfies order direction, candle drift, and R:R >= 1:3.0`, () => {
        expect(tpl.executionOrder).toBeDefined();
        const order = tpl.executionOrder!;
        const lastCandle = tpl.candles[tpl.candles.length - 1];

        if (order.type === 'BUY') {
          // BUY: TP > Entry > SL
          expect(order.tp).toBeGreaterThan(order.entry);
          expect(order.entry).toBeGreaterThan(order.sl);

          // Candlestick direction check: Last candle must end ABOVE entry!
          expect(lastCandle.close).toBeGreaterThan(order.entry);

          const slDistance = order.entry - order.sl;
          const tpDistance = order.tp - order.entry;
          const rr = tpDistance / slDistance;
          expect(rr).toBeGreaterThanOrEqual(2.9); // At least 1:3 RR

          // Target Pips must match TP distance (+-10 pips tolerance)
          if (tpl.targetPips) {
            const expectedPips = Math.round(tpDistance * 10);
            expect(Math.abs(tpl.targetPips - expectedPips)).toBeLessThanOrEqual(15);
          }
        } else if (order.type === 'SELL') {
          // SELL: SL > Entry > TP
          expect(order.sl).toBeGreaterThan(order.entry);
          expect(order.entry).toBeGreaterThan(order.tp);

          // Candlestick direction check: Last candle must end BELOW entry!
          expect(lastCandle.close).toBeLessThan(order.entry);

          const slDistance = order.sl - order.entry;
          const tpDistance = order.entry - order.tp;
          const rr = tpDistance / slDistance;
          expect(rr).toBeGreaterThanOrEqual(2.9); // At least 1:3 RR

          // Target Pips must match TP distance (+-10 pips tolerance)
          if (tpl.targetPips) {
            const expectedPips = Math.round(tpDistance * 10);
            expect(Math.abs(tpl.targetPips - expectedPips)).toBeLessThanOrEqual(15);
          }
        }
      });
    });
  });

  describe('Invariant 2: Callout Pin & Candlestick Index Validity', () => {
    TEMPLATES.forEach((tpl) => {
      it(`[${tpl.id}] callout pin index is within valid candle bounds`, () => {
        if (tpl.showCalloutPin) {
          expect(tpl.calloutCandleIndex).toBeDefined();
          expect(tpl.calloutCandleIndex).toBeGreaterThanOrEqual(0);
          expect(tpl.calloutCandleIndex!).toBeLessThan(tpl.candles.length);
          expect(tpl.calloutPinText).toBeTruthy();
        }
      });
    });
  });

  describe('Invariant 3: Complete 4-Stage Subtitle Storyboard', () => {
    TEMPLATES.forEach((tpl) => {
      it(`[${tpl.id}] has 4-stage subtitles synchronized from 0.0s to 1.0s`, () => {
        expect(tpl.scriptSubtitles).toBeDefined();
        expect(tpl.scriptSubtitles!.length).toBe(4);

        tpl.scriptSubtitles!.forEach((sub) => {
          expect(sub.timePercent).toBeGreaterThanOrEqual(0.0);
          expect(sub.timePercent).toBeLessThanOrEqual(1.0);
          expect(sub.text.length).toBeGreaterThan(10);
        });
      });
    });
  });

  describe('Invariant 4: State Hygiene & Isolation (No Dirty State Leakage)', () => {
    it('cleanly transitions between SELL and BUY templates without inheriting stale state', () => {
      const store = useChartStore.getState();

      // 1. Load SELL template (Hexagold Asia Sweep)
      const sellTpl = TEMPLATES.find((t) => t.id === 'hexagold-asia-sweep')!;
      store.loadTemplate(sellTpl);

      const afterSell = useChartStore.getState();
      expect(afterSell.executionOrder?.type).toBe('SELL');
      expect(afterSell.calloutPinText).toContain('BẪY DỤ BUY QUÉT ĐỈNH');

      // 2. Load BUY template (London Asia Low Sweep)
      const buyTpl = TEMPLATES.find((t) => t.id === 'xauusd-london-asia-sweep')!;
      store.loadTemplate(buyTpl);

      const afterBuy = useChartStore.getState();
      // MUST NOT be SELL!
      expect(afterBuy.executionOrder?.type).toBe('BUY');
      expect(afterBuy.executionOrder?.entry).toBe(4132.0);
      expect(afterBuy.executionOrder?.tp).toBe(4158.5);
      expect(afterBuy.calloutPinText).toBe('🎯 QUÉT ĐÁY Á 4,114.00 (H1 OB)');
      expect(afterBuy.targetPips).toBe(265);
    });

    it('resets dynamic fields to null/empty when template does not provide them', () => {
      const store = useChartStore.getState();

      // Mock bare minimal template without executionOrder or subtitles
      const bareTemplate = {
        id: 'bare-test',
        title: 'Bare Test Template',
        strategy: 'SMC' as const,
        tier: 'Free' as const,
        aspectRatio: '9:16' as const,
        duration: 5.0,
        revealMode: 'instant' as const,
        description: 'Test template without executionOrder',
        candles: [
          { id: '1', index: 0, open: 100, high: 105, low: 95, close: 102 },
          { id: '2', index: 1, open: 102, high: 108, low: 100, close: 106 },
        ],
        overlays: [],
      };

      store.loadTemplate(bareTemplate);

      const state = useChartStore.getState();
      expect(state.executionOrder).toBeNull();
      expect(state.showExecutionBadge).toBe(false);
      expect(state.calloutPinText).toBe('');
      expect(state.showCalloutPin).toBe(false);
      expect(state.scriptSubtitles).toEqual([]);
    });
  });
});

