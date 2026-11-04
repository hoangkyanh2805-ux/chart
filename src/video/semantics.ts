import { Candle, Issue } from './contracts';

export function validateCandleOHLC(c: Candle, index?: number): Issue[] {
  const issues: Issue[] = [];
  const prefix = index !== undefined ? `candles[${index}]` : `candle(${c.id})`;

  if (!Number.isFinite(c.open) || !Number.isFinite(c.high) || !Number.isFinite(c.low) || !Number.isFinite(c.close)) {
    issues.push({
      code: 'OHLC_NAN_OR_INFINITY',
      path: prefix,
      message: `Candle ${c.id} contains non-finite price values`,
      severity: 'error',
    });
    return issues;
  }

  if (c.open <= 0 || c.high <= 0 || c.low <= 0 || c.close <= 0) {
    issues.push({
      code: 'OHLC_BOUNDS',
      path: prefix,
      message: `Candle ${c.id} prices must be strictly positive`,
      severity: 'error',
    });
    return issues;
  }

  const minBody = Math.min(c.open, c.close);
  const maxBody = Math.max(c.open, c.close);

  if (c.low > minBody || c.high < maxBody) {
    issues.push({
      code: 'OHLC_BOUNDS',
      path: prefix,
      message: `Candle ${c.id} violated OHLC structure (low <= body <= high failed)`,
      severity: 'error',
    });
  }

  return issues;
}

export function computeBudgetUsdPerPip(riskUsd: number, slPips: number): number {
  if (slPips <= 0) throw new Error('SL pips must be positive');
  return Number((riskUsd / slPips).toFixed(4));
}

export function computeFvgCe(low: number, high: number): number {
  if (high <= low) throw new Error('FVG high must be strictly greater than low');
  return Number(((low + high) / 2).toFixed(4));
}

export function deepFreeze<T>(obj: T): Readonly<T> {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  Object.freeze(obj);

  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const val = (obj as Record<string, unknown>)[prop];
    if (val !== null && (typeof val === 'object' || typeof val === 'function') && !Object.isFrozen(val)) {
      deepFreeze(val);
    }
  });

  return obj as Readonly<T>;
}

