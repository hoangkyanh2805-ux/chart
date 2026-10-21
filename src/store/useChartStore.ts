import { create } from 'zustand';
import { Candle, Overlay, ChartSettings, RevealAnimationType } from '../types/chart';
import { generateGBMCandle } from '../math/gbm';

interface ChartState {
  candles: Candle[];
  overlays: Overlay[];
  settings: ChartSettings;
  
  // Timeline State
  currentTime: number; // in seconds
  duration: number; // in seconds
  isPlaying: boolean;
  revealMode: RevealAnimationType;

  // Actions
  addCandle: (candle: Omit<Candle, 'id' | 'index'>) => void;
  updateCandle: (index: number, updates: Partial<Candle>) => void;
  removeLastCandle: () => void;
  generateRandomWalk: (count: number, drift?: number, volatility?: number) => void;
  
  addOverlay: (overlay: Omit<Overlay, 'id'>) => void;
  removeOverlay: (id: string) => void;
  
  setCurrentTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setRevealMode: (mode: RevealAnimationType) => void;
  updateSettings: (updates: Partial<ChartSettings>) => void;
  loadTemplate: (template: any) => void;
  resetChart: () => void;
}

// Initial demo candles for XAUUSD (Gold)
const INITIAL_CANDLES: Candle[] = [
  { id: 'c-1', index: 0, open: 2645.0, high: 2652.5, low: 2643.0, close: 2650.0 },
  { id: 'c-2', index: 1, open: 2650.0, high: 2658.0, low: 2648.5, close: 2656.5 },
  { id: 'c-3', index: 2, open: 2656.5, high: 2659.0, low: 2646.0, close: 2647.5 },
  { id: 'c-4', index: 3, open: 2647.5, high: 2668.0, low: 2646.0, close: 2665.0 }, // Expansion
  { id: 'c-5', index: 4, open: 2665.0, high: 2674.0, low: 2663.0, close: 2672.5 },
  { id: 'c-6', index: 5, open: 2672.5, high: 2673.5, low: 2656.0, close: 2658.0 }, // FVG Retest
  { id: 'c-7', index: 6, open: 2658.0, high: 2682.0, low: 2657.0, close: 2680.0 }, // Target rally
];

export const useChartStore = create<ChartState>((set, get) => ({
  candles: INITIAL_CANDLES,
  overlays: [
    {
      id: 'fvg-gold',
      type: 'FVG',
      startCandleIndex: 3,
      endCandleIndex: 6,
      priceStart: 2649.0,
      priceEnd: 2663.0,
      color: '#00F5A0',
      opacity: 0.22,
      label: 'XAUUSD Bullish FVG [2649.00 - 2663.00]',
    },
    {
      id: 'asia-low',
      type: 'LIQUIDITY_LINE',
      startCandleIndex: 0,
      endCandleIndex: 3,
      priceStart: 2643.0,
      priceEnd: 2643.0,
      color: '#F59E0B',
      opacity: 0.85,
      label: 'Asia Low Liquidity - 2643.00',
    },
  ],
  settings: {
    symbol: 'XAUUSD',
    timeframe: 'M15',
    aspectRatio: '9:16',
    revealSpeed: 0.5,
    bullishColor: '#00F5A0',
    bearishColor: '#FF3366',
    wickWidth: 2,
    candleWidth: 28,
    candleGap: 18,
    showGrid: true,
    spotlightEnabled: false,
  },
  currentTime: 3,
  duration: 6,
  isPlaying: false,
  revealMode: 'sequential',

  addCandle: (c) =>
    set((state) => {
      const index = state.candles.length;
      const newCandle: Candle = {
        ...c,
        id: `c-${Date.now()}`,
        index,
      };
      return { candles: [...state.candles, newCandle] };
    }),

  updateCandle: (index, updates) =>
    set((state) => ({
      candles: state.candles.map((c, i) => (i === index ? { ...c, ...updates } : c)),
    })),

  removeLastCandle: () =>
    set((state) => ({
      candles: state.candles.slice(0, -1),
    })),

  generateRandomWalk: (count, drift = 0.001, volatility = 0.008) =>
    set((state) => {
      const result: Candle[] = [];
      let lastPrice = state.candles.length > 0 ? state.candles[state.candles.length - 1].close : 2650;
      let startIndex = state.candles.length;

      for (let i = 0; i < count; i++) {
        const gen = generateGBMCandle(lastPrice, { drift, volatility });
        result.push({
          id: `c-gbm-${Date.now()}-${i}`,
          index: startIndex + i,
          open: gen.open,
          high: gen.high,
          low: gen.low,
          close: gen.close,
        });
        lastPrice = gen.nextPrice;
      }

      return { candles: [...state.candles, ...result] };
    }),

  addOverlay: (overlay) =>
    set((state) => ({
      overlays: [...state.overlays, { ...overlay, id: `overlay-${Date.now()}` }],
    })),

  removeOverlay: (id) =>
    set((state) => ({
      overlays: state.overlays.filter((o) => o.id !== id),
    })),

  setCurrentTime: (time) => set({ currentTime: time }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setRevealMode: (mode) => set({ revealMode: mode }),
  updateSettings: (updates) =>
    set((state) => ({
      settings: { ...state.settings, ...updates },
    })),

  loadTemplate: (template) =>
    set((state) => ({
      candles: template.candles,
      overlays: template.overlays,
      duration: template.duration,
      currentTime: template.duration,
      isPlaying: false,
      revealMode: template.revealMode || 'sequential',
      settings: {
        ...state.settings,
        aspectRatio: template.aspectRatio || state.settings.aspectRatio,
        spotlightEnabled: template.spotlightEnabled ?? state.settings.spotlightEnabled,
      },
    })),

  resetChart: () =>
    set({
      candles: INITIAL_CANDLES,
      currentTime: 0,
      isPlaying: false,
    }),
}));
