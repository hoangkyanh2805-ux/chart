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
  resetChart: () => void;
}

// Initial demo candles
const INITIAL_CANDLES: Candle[] = [
  { id: 'c-1', index: 0, open: 100, high: 108, low: 98, close: 106 },
  { id: 'c-2', index: 1, open: 106, high: 112, low: 104, close: 110 },
  { id: 'c-3', index: 2, open: 110, high: 115, low: 102, close: 103 },
  { id: 'c-4', index: 3, open: 103, high: 105, low: 95, close: 96 },
  { id: 'c-5', index: 4, open: 96, high: 114, low: 95, close: 113 },
  { id: 'c-6', index: 5, open: 113, high: 122, low: 112, close: 120 },
];

export const useChartStore = create<ChartState>((set, get) => ({
  candles: INITIAL_CANDLES,
  overlays: [
    {
      id: 'fvg-1',
      type: 'FVG',
      startCandleIndex: 2,
      endCandleIndex: 4,
      priceStart: 105,
      priceEnd: 112,
      color: '#00F5A0',
      opacity: 0.2,
      label: 'Bullish FVG',
    },
  ],
  settings: {
    aspectRatio: '16:9',
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

  generateRandomWalk: (count, drift = 0.002, volatility = 0.03) =>
    set((state) => {
      const result: Candle[] = [];
      let lastPrice = state.candles.length > 0 ? state.candles[state.candles.length - 1].close : 100;
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

  resetChart: () =>
    set({
      candles: INITIAL_CANDLES,
      currentTime: 0,
      isPlaying: false,
    }),
}));
