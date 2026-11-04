import { describe, it, expect } from 'vitest';
import { validateDraft } from '../../src/video/validateDraft';
import { makePilotDraft, makeFvgDraft } from '../fixtures/s2v/factories';

describe('Scene Draft Hard Validation Suite (Task 2)', () => {
  it('passes on clean pilot draft', () => {
    const draft = makePilotDraft();
    const issues = validateDraft(draft);
    expect(issues).toEqual([]);
  });

  it('rejects bad OHLC anywhere, not only trigger candle', () => {
    // Non-trigger candle 0 corrupted
    const d1 = makePilotDraft();
    d1.candles[0].high = 0;
    const issues1 = validateDraft(d1);
    expect(issues1.some((i) => i.code === 'OHLC_BOUNDS')).toBe(true);

    // Candle with NaN
    const d2 = makePilotDraft();
    d2.candles[2].low = NaN;
    const issues2 = validateDraft(d2);
    expect(issues2.some((i) => i.code === 'OHLC_NAN_OR_INFINITY')).toBe(true);

    // Candle where low > close
    const d3 = makePilotDraft();
    d3.candles[1].low = 5000;
    const issues3 = validateDraft(d3);
    expect(issues3.some((i) => i.code === 'OHLC_BOUNDS')).toBe(true);
  });

  it('rejects contradictory storyboard outcome action', () => {
    const draft = makePilotDraft();
    // Outcome is STOP_LOSS, but storyboard attempts to mark TAKE_PROFIT
    draft.storyboard.at(-1)!.actions = [{ kind: 'MARK_OUTCOME', outcome: 'TAKE_PROFIT' }];
    const issues = validateDraft(draft);
    expect(issues.some((i) => i.code === 'OUTCOME_ACTION_MISMATCH')).toBe(true);
  });

  it('validates budget unit math and rejects mismatch', () => {
    const draft = makePilotDraft();
    // Budget is 30 / 20 = 1.5, alter usdPerPip to 2.0
    draft.budget!.usdPerPip = 2.0;
    const issues = validateDraft(draft);
    expect(issues.some((i) => i.code === 'BUDGET_CALCULATION_MISMATCH')).toBe(true);
  });

  it('validates FVG 50% CE entry and rejects independent wrong entry price', () => {
    const fvgDraft = makeFvgDraft();
    expect(validateDraft(fvgDraft)).toEqual([]);

    // Corrupt entry from 4132.5 to 4130.0
    fvgDraft.order!.entry = 4130.0;
    const issues = validateDraft(fvgDraft);
    expect(issues.some((i) => i.code === 'FVG_CE_ENTRY_MISMATCH')).toBe(true);
  });

  it('rejects reversed order price geometry', () => {
    const fvgDraft = makeFvgDraft();
    // BUY order with entry <= sl
    fvgDraft.order!.sl = 4140.0; // SL higher than entry
    const issues = validateDraft(fvgDraft);
    expect(issues.some((i) => i.code === 'ORDER_PRICE_INCONSISTENCY')).toBe(true);
  });

  it('rejects reference to non-existent candle or overlay in storyboard', () => {
    const draft = makePilotDraft();
    draft.storyboard[0].actions.push({ kind: 'REVEAL_CANDLES', candleIds: ['phantom-candle'] });
    draft.storyboard[0].actions.push({ kind: 'SHOW_OVERLAY', overlayId: 'phantom-overlay' });
    const issues = validateDraft(draft);
    expect(issues.some((i) => i.code === 'UNKNOWN_CANDLE_ID')).toBe(true);
    expect(issues.some((i) => i.code === 'UNKNOWN_OVERLAY_ID')).toBe(true);
  });
});

