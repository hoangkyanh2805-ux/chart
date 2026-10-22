import { Candle } from '../types/chart';

export interface GroupCandleOptions {
  count: number;
  direction: 'bullish' | 'bearish' | 'range';
  momentum: 'high' | 'moderate' | 'grind';
  avgCandleSize?: number; // In dollars (for XAUUSD, e.g. $4.0 - $12.0)
  includePullback?: boolean; // Realistic trading groups have 1-2 minor pullback candles
}

export function generateGroupCandleSequence(
  startPrice: number,
  startIndex: number,
  options: GroupCandleOptions
): Candle[] {
  const { count, direction, momentum, includePullback = true } = options;
  const result: Candle[] = [];

  let currentPrice = startPrice;
  let currentIndex = startIndex;

  // Base step size in price
  let stepMagnitude = options.avgCandleSize || (momentum === 'high' ? 8.5 : momentum === 'moderate' ? 4.5 : 2.5);

  for (let i = 0; i < count; i++) {
    const open = Math.round(currentPrice * 100) / 100;
    let isBullishCandle = direction === 'bullish';

    if (direction === 'range') {
      isBullishCandle = i % 2 === 0;
    } else if (includePullback && count >= 4 && (i === 2 || i === count - 2)) {
      // 1 minor pullback candle in a strong trend
      isBullishCandle = direction !== 'bullish';
    }

    const variance = (0.7 + Math.random() * 0.6);
    const bodyHeight = (isBullishCandle === (direction === 'bullish')) 
      ? stepMagnitude * variance 
      : (stepMagnitude * 0.45 * variance);

    let close: number;
    if (isBullishCandle) {
      close = Math.round((open + bodyHeight) * 100) / 100;
    } else {
      close = Math.round((open - bodyHeight) * 100) / 100;
    }

    const bodyTop = Math.max(open, close);
    const bodyBottom = Math.min(open, close);
    const wickTop = Math.round((bodyTop + Math.random() * (stepMagnitude * 0.35)) * 100) / 100;
    const wickBottom = Math.round((bodyBottom - Math.random() * (stepMagnitude * 0.35)) * 100) / 100;

    result.push({
      id: `c-group-${i}-${Date.now()}`,
      index: currentIndex,
      open,
      high: wickTop,
      low: wickBottom,
      close,
    });

    currentPrice = close;
    currentIndex++;
  }

  return result;
}
