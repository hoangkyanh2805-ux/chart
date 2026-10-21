/**
 * Geometric Brownian Motion (GBM) Simulation for Realistic Candlestick Generation
 * dS = mu * S * dt + sigma * S * dW
 */

// Standard normal distribution generator via Box-Muller transform
export function boxMullerRandom(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export interface GBMOption {
  startPrice: number;
  drift: number; // mu: trend (>0 uptrend, <0 downtrend)
  volatility: number; // sigma: price fluctuation magnitude
  stepsPerCandle?: number; // sub-ticks inside each candle
}

/**
 * Generates an OHLC candle from internal sub-ticks simulating price path
 */
export function generateGBMCandle(
  startPrice: number,
  options: { drift?: number; volatility?: number; steps?: number } = {}
): { open: number; high: number; low: number; close: number; nextPrice: number; path: number[] } {
  const drift = options.drift ?? 0.001;
  const volatility = options.volatility ?? 0.02;
  const steps = options.steps ?? 20;
  const dt = 1 / steps;

  let current = startPrice;
  const path: number[] = [current];

  for (let i = 0; i < steps; i++) {
    const z = boxMullerRandom();
    const returnVal = (drift - 0.5 * volatility * volatility) * dt + volatility * Math.sqrt(dt) * z;
    current = current * Math.exp(returnVal);
    path.push(current);
  }

  const open = Math.round(startPrice * 100) / 100;
  const close = Math.round(current * 100) / 100;
  const high = Math.round(Math.max(...path) * 100) / 100;
  const low = Math.round(Math.min(...path) * 100) / 100;

  return {
    open,
    high,
    low,
    close,
    nextPrice: close,
    path,
  };
}
