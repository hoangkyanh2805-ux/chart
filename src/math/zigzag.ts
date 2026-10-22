import { Candle } from '../types/chart';

export interface SwingLeg {
  targetPrice: number;
  candleCount: number;
  label?: string; // e.g. 'HH', 'HL', 'LH', 'LL'
}

/**
 * Generates an authentic candlestick sequence along a multi-leg ZigZag path (Swing Highs & Lows)
 */
export function generateZigZagCandles(
  startPrice: number,
  startIndex: number,
  legs: SwingLeg[]
): { candles: Candle[]; swingPoints: { index: number; price: number; label?: string }[] } {
  const result: Candle[] = [];
  const swingPoints: { index: number; price: number; label?: string }[] = [];

  let currentPrice = startPrice;
  let currentIndex = startIndex;

  // Record initial swing anchor
  swingPoints.push({ index: currentIndex, price: currentPrice, label: 'Start' });

  legs.forEach((leg, legIdx) => {
    const isUp = leg.targetPrice >= currentPrice;
    const totalDelta = leg.targetPrice - currentPrice;
    const count = Math.max(2, leg.candleCount);
    const avgStep = totalDelta / count;

    for (let i = 0; i < count; i++) {
      const open = Math.round(currentPrice * 100) / 100;
      
      // Calculate target close for this candle
      // Last candle of the leg must land exactly on targetPrice
      let close: number;
      if (i === count - 1) {
        close = Math.round(leg.targetPrice * 100) / 100;
      } else {
        const stepNoise = (Math.random() - 0.45) * 0.3 * avgStep;
        close = Math.round((open + avgStep + stepNoise) * 100) / 100;
      }

      // Generate realistic wicks
      const candleMin = Math.min(open, close);
      const candleMax = Math.max(open, close);
      const wickRange = Math.abs(close - open) * 0.35 + 0.8;

      let high = Math.round((candleMax + Math.random() * wickRange) * 100) / 100;
      let low = Math.round((candleMin - Math.random() * wickRange) * 100) / 100;

      // Special handling for the peak/trough candle of the leg
      if (i === count - 1) {
        if (isUp) {
          high = Math.max(high, leg.targetPrice + 0.5);
        } else {
          low = Math.min(low, leg.targetPrice - 0.5);
        }
      }

      result.push({
        id: `c-zigzag-${legIdx}-${i}-${Date.now()}`,
        index: currentIndex,
        open,
        high,
        low,
        close,
      });

      currentPrice = close;
      currentIndex++;
    }

    // Record swing point at the end of this leg
    swingPoints.push({
      index: currentIndex - 1,
      price: leg.targetPrice,
      label: leg.label || (isUp ? 'HH' : 'LL'),
    });
  });

  return { candles: result, swingPoints };
}
