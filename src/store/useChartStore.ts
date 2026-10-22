import { create } from 'zustand';
import { Candle, Overlay, ChartSettings, RevealAnimationType } from '../types/chart';
import { generateGBMCandle } from '../math/gbm';
import { generateGroupCandleSequence } from '../math/groupCandles';
import { generateZigZagCandles } from '../math/zigzag';

interface ChartState {
  candles: Candle[];
  overlays: Overlay[];
  settings: ChartSettings;
  
  // Studio & Workspace Mode
  builderMode: 'single' | 'group' | 'zigzag';
  activeWorkspaceTab: 'canvas' | 'timeline';
  revealAnimation: boolean;
  
  // Timeline State
  currentTime: number; // in seconds
  duration: number; // in seconds
  isPlaying: boolean;
  revealMode: RevealAnimationType;

  // Actions
  setBuilderMode: (mode: 'single' | 'group' | 'zigzag') => void;
  setActiveWorkspaceTab: (tab: 'canvas' | 'timeline') => void;
  setRevealAnimation: (enabled: boolean) => void;
  
  addCandle: (candle: Omit<Candle, 'id' | 'index'>) => void;
  updateCandle: (index: number, updates: Partial<Candle>) => void;
  removeLastCandle: () => void;
  clearAllCandles: () => void;
  generateRandomWalk: (count: number, drift?: number, volatility?: number) => void;
  addGroupCandles: (options: { count: number; direction: 'bullish' | 'bearish' | 'range'; momentum: 'high' | 'moderate' | 'grind'; avgCandleSize?: number }) => void;
  addZigZagLegs: (legs: { targetPrice: number; candleCount: number; label?: string }[]) => void;
  
  addOverlay: (overlay: Omit<Overlay, 'id'>) => void;
  removeOverlay: (id: string) => void;
  updateOverlayLabel: (id: string, label: string) => void;
  
  setCurrentTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setRevealMode: (mode: RevealAnimationType) => void;
  updateSettings: (updates: Partial<ChartSettings>) => void;
  loadTemplate: (template: any) => void;
  resetChart: () => void;
}

// Initial demo candles for XAUUSD (Gold - Live Price Range ~4,129.00)
const INITIAL_CANDLES: Candle[] = [
  { id: 'c-1', index: 0, open: 4125.0, high: 4132.5, low: 4123.0, close: 4130.0 },
  { id: 'c-2', index: 1, open: 4130.0, high: 4138.0, low: 4128.5, close: 4136.5 },
  { id: 'c-3', index: 2, open: 4136.5, high: 4139.0, low: 4126.0, close: 4127.5 },
  { id: 'c-4', index: 3, open: 4127.5, high: 4148.0, low: 4126.0, close: 4145.0 }, // Expansion
  { id: 'c-5', index: 4, open: 4145.0, high: 4154.0, low: 4143.0, close: 4152.5 },
  { id: 'c-6', index: 5, open: 4152.5, high: 4153.5, low: 4136.0, close: 4138.0 }, // FVG Retest
  { id: 'c-7', index: 6, open: 4138.0, high: 4162.0, low: 4137.0, close: 4160.0 }, // Target rally
];

export const useChartStore = create<ChartState>((set, get) => ({
  candles: INITIAL_CANDLES,
  overlays: [
    {
      id: 'fvg-gold',
      type: 'FVG',
      startCandleIndex: 3,
      endCandleIndex: 6,
      priceStart: 4129.0,
      priceEnd: 4143.0,
      color: '#00F5A0',
      opacity: 0.22,
      label: 'XAUUSD Bullish FVG [4129.00 - 4143.00]',
    },
    {
      id: 'asia-low',
      type: 'LIQUIDITY_LINE',
      startCandleIndex: 0,
      endCandleIndex: 3,
      priceStart: 4123.0,
      priceEnd: 4123.0,
      color: '#F59E0B',
      opacity: 0.85,
      label: 'Asia Low Liquidity - 4,123.00',
    },
  ],
  settings: {
    symbol: 'XAUUSD',
    timeframe: 'M15',
    bannerHook: 'HOW TO TRADE XAUUSD LIKE BANKS (ICT SETUP)',
    fontFamily: 'Montserrat',
    bannerFontSize: 13,
    bannerBgColor: 'rgba(15, 23, 42, 0.94)',
    bannerTextColor: '#FDE047',
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
  builderMode: 'single',
  activeWorkspaceTab: 'canvas',
  revealAnimation: true,
  currentTime: 3,
  duration: 6,
  isPlaying: false,
  revealMode: 'sequential',

  setBuilderMode: (mode) => set({ builderMode: mode }),
  setActiveWorkspaceTab: (tab) => set({ activeWorkspaceTab: tab }),
  setRevealAnimation: (enabled) =>
    set({
      revealAnimation: enabled,
      revealMode: enabled ? 'sequential' : 'instant',
    }),

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

  clearAllCandles: () =>
    set({
      candles: [],
      overlays: [],
      currentTime: 0,
    }),

  addGroupCandles: (options) =>
    set((state) => {
      const startIndex = state.candles.length;
      const lastPrice = state.candles.length > 0 ? state.candles[state.candles.length - 1].close : 4129.0;
      const newCandles = generateGroupCandleSequence(lastPrice, startIndex, options);
      return {
        candles: [...state.candles, ...newCandles],
        currentTime: (state.candles.length + newCandles.length) * 0.6,
        duration: Math.max(state.duration, (state.candles.length + newCandles.length) * 0.6),
      };
    }),

  addZigZagLegs: (legs) =>
    set((state) => {
      const startIndex = state.candles.length;
      const lastPrice = state.candles.length > 0 ? state.candles[state.candles.length - 1].close : 4129.0;
      const { candles: newCandles, swingPoints } = generateZigZagCandles(lastPrice, startIndex, legs);
      
      // Optionally add a liquidity line or wave overlay
      return {
        candles: [...state.candles, ...newCandles],
        currentTime: (state.candles.length + newCandles.length) * 0.6,
        duration: Math.max(state.duration, (state.candles.length + newCandles.length) * 0.6),
      };
    }),

  generateRandomWalk: (count, drift = 0.001, volatility = 0.004) =>
    set((state) => {
      const result: Candle[] = [];
      let lastPrice = state.candles.length > 0 ? state.candles[state.candles.length - 1].close : 4129.0;
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

  updateOverlayLabel: (id, label) =>
    set((state) => ({
      overlays: state.overlays.map((o) => (o.id === id ? { ...o, label } : o)),
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
