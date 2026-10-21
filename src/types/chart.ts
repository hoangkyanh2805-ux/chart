export interface Candle {
  id: string;
  index: number;
  open: number;
  high: number;
  low: number;
  close: number;
  timestamp?: number;
}

export type RevealAnimationType = 'instant' | 'sequential' | 'wick-then-body' | 'brownian';

export type AspectRatio = '16:9' | '9:16' | '1:1';

export type OverlayType = 'FVG' | 'ORDER_BLOCK' | 'LIQUIDITY_LINE' | 'LONG_SHORT' | 'SPOTLIGHT';

export interface Overlay {
  id: string;
  type: OverlayType;
  startCandleIndex: number;
  endCandleIndex: number;
  priceStart: number;
  priceEnd: number;
  color?: string;
  opacity?: number;
  label?: string;
}

export interface ChartSettings {
  symbol: string;
  timeframe: string;
  aspectRatio: AspectRatio;
  revealSpeed: number; // milliseconds per candle
  bullishColor: string;
  bearishColor: string;
  wickWidth: number;
  candleWidth: number;
  candleGap: number;
  showGrid: boolean;
  spotlightEnabled: boolean;
}
