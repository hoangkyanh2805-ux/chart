import { Candle, Direction, Outcome, Overlay, Order, Gap } from './contracts';

export interface ChoreographerOptions {
  direction?: Direction;
  outcome?: Outcome;
  basePrice?: number;
  setupType?: 'SMC_FVG_RETEST' | 'LIQUIDITY_SWEEP' | 'BREAKOUT_RETEST';
}

export interface ChoreographedSetup {
  candles: Candle[];
  overlays: Overlay[];
  order: Order | null;
  entryBasis: 'NONE' | 'EXPLICIT' | 'FVG_CE';
  entryOverlayId: string | null;
}

/**
 * Dynamic Candlestick & Institutional Overlay Choreographer
 * Replaces static hardcoded candles with mathematically verified OHLC sequences.
 */
export function choreographInstitutionalSetup(
  options: ChoreographerOptions = {}
): ChoreographedSetup {
  const direction = options.direction || 'BUY';
  const outcome = options.outcome || 'STOP_LOSS';
  const base = options.basePrice || 4130.0;
  const setupType = options.setupType || 'SMC_FVG_RETEST';

  const round = (val: number) => Number(val.toFixed(2));

  if (direction === 'BUY') {
    // Bullish SMC Setup
    // c1: Base setup candle
    const c1: Candle = {
      id: 'c1',
      index: 0,
      open: round(base - 10.0),
      high: round(base - 2.0),
      low: round(base - 11.5),
      close: round(base - 3.0),
    };

    // c2: Strong impulsive displacement candle (MSS / Breakout)
    const c2: Candle = {
      id: 'c2',
      index: 1,
      open: round(base - 3.0),
      high: round(base + 12.0),
      low: round(base - 3.5),
      close: round(base + 10.0),
    };

    // c3: Extension candle leaving Fair Value Gap with c1
    // FVG is between c1.high and c3.low
    const c3: Candle = {
      id: 'c3',
      index: 2,
      open: round(base + 10.0),
      high: round(base + 16.0),
      low: round(base + 4.0), // c3.low (base+4) > c1.high (base-2) -> FVG of $6
      close: round(base + 14.5),
    };

    const fvgLow = c1.high;
    const fvgHigh = c3.low;
    const fvgCe50 = round((fvgLow + fvgHigh) / 2); // Consequent Encroachment 50%

    // c4: Pullback candle retracing into the FVG zone
    const c4: Candle = {
      id: 'c4',
      index: 3,
      open: round(base + 14.5),
      high: round(base + 15.0),
      low: round(fvgCe50),
      close: round(fvgCe50 + 2.0),
    };

    // c5: Entry candle tapping C.E. 50% with long lower rejection wick
    const c5: Candle = {
      id: 'c5',
      index: 4,
      open: round(fvgCe50 + 2.0),
      high: round(fvgCe50 + 6.0),
      low: round(fvgCe50 - 0.5),
      close: round(fvgCe50 + 4.5),
    };

    const entryPrice = fvgCe50;
    const slPrice = round(c1.low - 2.0); // Stop Loss below c1
    const slPips = Math.round((entryPrice - slPrice) * 10);
    const tpPrice = round(entryPrice + (entryPrice - slPrice) * 3.5); // 1:3.5 R:R

    // c6: Resolution candle based on outcome
    let c6: Candle;
    if (outcome === 'TAKE_PROFIT') {
      c6 = {
        id: 'c6',
        index: 5,
        open: round(fvgCe50 + 4.5),
        high: round(tpPrice + 2.0),
        low: round(fvgCe50 + 3.0),
        close: round(tpPrice),
      };
    } else {
      // STOP_LOSS or NO_TRADE
      c6 = {
        id: 'c6',
        index: 5,
        open: round(fvgCe50 + 4.5),
        high: round(fvgCe50 + 5.0),
        low: round(slPrice - 1.5), // Pierces Stop Loss
        close: round(slPrice - 1.0),
      };
    }

    const fvgOverlay: Gap = {
      id: 'fvg_1',
      kind: 'FVG',
      candleIds: ['c1', 'c2', 'c3'],
      low: fvgLow,
      high: fvgHigh,
    };

    const supportOverlay: Overlay = {
      id: 'lvl_support',
      kind: 'LEVEL',
      price: fvgLow,
      label: 'BULLISH FVG DEMAND',
    };

    const order: Order = {
      direction: 'BUY',
      entry: entryPrice,
      sl: slPrice,
      tp: tpPrice,
    };

    return {
      candles: [c1, c2, c3, c4, c5, c6],
      overlays: [fvgOverlay, supportOverlay],
      order,
      entryBasis: 'FVG_CE',
      entryOverlayId: 'fvg_1',
    };
  } else {
    // Bearish SMC Setup (SELL)
    const c1: Candle = {
      id: 'c1',
      index: 0,
      open: round(base + 10.0),
      high: round(base + 11.5),
      low: round(base + 2.0),
      close: round(base + 3.0),
    };

    const c2: Candle = {
      id: 'c2',
      index: 1,
      open: round(base + 3.0),
      high: round(base + 3.5),
      low: round(base - 12.0),
      close: round(base - 10.0),
    };

    const c3: Candle = {
      id: 'c3',
      index: 2,
      open: round(base - 10.0),
      high: round(base - 4.0), // c3.high (base-4) < c1.low (base+2) -> Bearish FVG
      low: round(base - 16.0),
      close: round(base - 14.5),
    };

    const fvgLow = c3.high;
    const fvgHigh = c1.low;
    const fvgCe50 = round((fvgLow + fvgHigh) / 2);

    const c4: Candle = {
      id: 'c4',
      index: 3,
      open: round(base - 14.5),
      high: round(fvgCe50),
      low: round(base - 15.0),
      close: round(fvgCe50 - 2.0),
    };

    const c5: Candle = {
      id: 'c5',
      index: 4,
      open: round(fvgCe50 - 2.0),
      high: round(fvgCe50 + 0.5),
      low: round(fvgCe50 - 6.0),
      close: round(fvgCe50 - 4.5),
    };

    const entryPrice = fvgCe50;
    const slPrice = round(c1.high + 2.0);
    const tpPrice = round(entryPrice - (slPrice - entryPrice) * 3.5);

    let c6: Candle;
    if (outcome === 'TAKE_PROFIT') {
      c6 = {
        id: 'c6',
        index: 5,
        open: round(fvgCe50 - 4.5),
        high: round(fvgCe50 - 3.0),
        low: round(tpPrice - 2.0),
        close: round(tpPrice),
      };
    } else {
      c6 = {
        id: 'c6',
        index: 5,
        open: round(fvgCe50 - 4.5),
        high: round(slPrice + 1.5),
        low: round(fvgCe50 - 5.0),
        close: round(slPrice + 1.0),
      };
    }

    const fvgOverlay: Gap = {
      id: 'fvg_1',
      kind: 'FVG',
      candleIds: ['c1', 'c2', 'c3'],
      low: fvgLow,
      high: fvgHigh,
    };

    const order: Order = {
      direction: 'SELL',
      entry: entryPrice,
      sl: slPrice,
      tp: tpPrice,
    };

    return {
      candles: [c1, c2, c3, c4, c5, c6],
      overlays: [fvgOverlay],
      order,
      entryBasis: 'FVG_CE',
      entryOverlayId: 'fvg_1',
    };
  }
}
