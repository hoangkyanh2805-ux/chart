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

export interface ScriptSubtitle {
  timePercent: number; // 0.0 -> 1.0 (or progress milestone)
  text: string;
  stageName?: 'Hook' | 'Trap' | 'Setup' | 'Execution' | 'Lesson';
}

export interface ExecutionOrder {
  type: 'BUY' | 'SELL';
  entry: number;
  sl: number;
  tp: number;
  lot: number;
  risk: number; // e.g. 30 ($30)
}

export interface SetupValidationReport {
  isValid: boolean;
  score: number; // 0 - 100
  expectedDirection: 'BUY' | 'SELL' | 'NEUTRAL';
  checks: {
    titleDirectionMatch: boolean;
    candleDriftMatch: boolean;
    triggerWickValid: boolean;
    riskRewardValid: boolean;
    subtitlesAligned: boolean;
  };
  warnings: string[];
  normalizedSetup?: {
    executionOrder: ExecutionOrder;
    calloutPinText: string;
    calloutCandleIndex: number;
    targetPips: number;
    scriptSubtitles: ScriptSubtitle[];
  };
}

export type BeforeAfterMode = 'auto' | 'before' | 'after' | 'off';

export interface ChartSettings {
  symbol: string;
  timeframe: string;
  bannerHook?: string;
  fontFamily: string;
  bannerFontSize: number;
  bannerBgColor: string;
  bannerTextColor: string;
  aspectRatio: AspectRatio;
  revealSpeed: number; // milliseconds per candle
  bullishColor: string;
  bearishColor: string;
  wickWidth: number;
  candleWidth: number;
  candleGap: number;
  showGrid: boolean;
  spotlightEnabled: boolean;
  beforeAfterMode?: BeforeAfterMode;
}
