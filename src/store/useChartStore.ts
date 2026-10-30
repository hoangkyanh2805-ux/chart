import { create } from 'zustand';
import { Candle, Overlay, ChartSettings, RevealAnimationType, ScriptSubtitle, ExecutionOrder, SetupValidationReport } from '../types/chart';
import { generateGBMCandle } from '../math/gbm';
import { generateGroupCandleSequence } from '../math/groupCandles';
import { generateZigZagCandles } from '../math/zigzag';
import { validateAndNormalizeSetup } from '../utils/dynamicValidator';
import { convertStateToEnglish } from '../utils/englishLocalization';
import { generateDynamicScriptSubtitles } from '../utils/dynamicScriptNarrator';

interface ChartState {
  candles: Candle[];
  overlays: Overlay[];
  settings: ChartSettings;
  
  // Studio & Workspace Mode
  builderMode: 'single' | 'group' | 'zigzag';
  activeWorkspaceTab: 'canvas' | 'timeline';
  revealAnimation: boolean;

  // Full NLE Editor State
  activeTool: 'templates' | 'ohlc' | 'text' | 'elements' | 'settings' | 'audit' | 'hermes' | 'script';
  stageTheme: 'white' | 'dark';
  headlineText: string;
  sublineText: string;
  badges: [string, string, string];
  isHermesChatOpen: boolean;
  isAzzamOpsOpen: boolean;
  showSafeZones: boolean;
  activeScriptMeta: { id: string; title: string; format?: string } | null;
  setActiveScriptMeta: (meta: { id: string; title: string; format?: string } | null) => void;

  // TikTok / Reels Video Dynamics
  showCalloutPin: boolean;
  calloutPinText: string;
  calloutCandleIndex: number;
  showPipCounter: boolean;
  targetPips: number;
  showExecutionBadge: boolean;
  executionOrder: ExecutionOrder | null;
  scriptSubtitles: ScriptSubtitle[];
  showPhoneFrame: boolean;
  showTikTokUIOverlay: boolean;
  beforeAfterMode: 'auto' | 'before' | 'after' | 'off';
  setBeforeAfterMode: (mode: 'auto' | 'before' | 'after' | 'off') => void;
  
  // Validation State
  validationReport: SetupValidationReport | null;
  validateCurrentSetup: () => SetupValidationReport;
  applyAutoNormalize: () => void;
  applyComprehensiveAutoFix: () => void;
  applyEnglishVersion: () => void;
  
  // Voice & Audio State (Google AI Studio Gemini 3.8 Flash TTS + Web Speech Engine)
  voiceAudioUrl: string | null;
  voiceAudioBase64: string | null;
  isVoiceGenerating: boolean;
  selectedVoice: 'Charon' | 'Puck' | 'Aoede' | 'Kore' | 'Fenrir';
  isAudioMuted: boolean;
  audioEngine: 'gemini' | 'webspeech';
  hasTtsQuotaExceeded: boolean;
  setAudioEngine: (engine: 'gemini' | 'webspeech') => void;
  setVoiceAudio: (audioBase64: string | null, mimeType?: string) => void;
  setSelectedVoice: (voice: 'Charon' | 'Puck' | 'Aoede' | 'Kore' | 'Fenrir') => void;
  setIsAudioMuted: (muted: boolean) => void;
  generateVoiceover: () => Promise<boolean>;
  
  // Timeline State
  currentTime: number; // in seconds
  duration: number; // in seconds
  isPlaying: boolean;
  revealMode: RevealAnimationType;

  // Actions
  setActiveTool: (tool: 'templates' | 'ohlc' | 'text' | 'elements' | 'settings' | 'audit' | 'hermes' | 'script') => void;
  setStageTheme: (theme: 'white' | 'dark') => void;
  setHeadlineText: (text: string) => void;
  setSublineText: (text: string) => void;
  setBadges: (badges: [string, string, string]) => void;
  setIsHermesChatOpen: (open: boolean) => void;
  isAzzamOpsOpen: boolean;
  setIsAzzamOpsOpen: (open: boolean) => void;
  setShowSafeZones: (show: boolean) => void;

  setShowCalloutPin: (show: boolean) => void;
  setCalloutPinText: (text: string) => void;
  setCalloutCandleIndex: (index: number) => void;
  setShowPipCounter: (show: boolean) => void;
  setTargetPips: (pips: number) => void;
  setShowExecutionBadge: (show: boolean) => void;
  setExecutionOrder: (order: ExecutionOrder | null) => void;
  setScriptSubtitles: (subtitles: ScriptSubtitle[]) => void;
  setShowPhoneFrame: (show: boolean) => void;
  setShowTikTokUIOverlay: (show: boolean) => void;

  setBuilderMode: (mode: 'single' | 'group' | 'zigzag') => void;
  setActiveWorkspaceTab: (tab: 'canvas' | 'timeline') => void;
  setRevealAnimation: (enabled: boolean) => void;
  
  setCandles: (candles: Candle[]) => void;
  setOverlays: (overlays: Overlay[]) => void;
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

// Initial demo candles: Hexagold Asia Sweep (Bẫy Quét Đỉnh Á XAUUSD - Sell +240 Pips)
const INITIAL_CANDLES: Candle[] = [
  { id: 'c-1', index: 0, open: 4130.0, high: 4135.0, low: 4128.0, close: 4134.0 }, // Asian Range
  { id: 'c-2', index: 1, open: 4134.0, high: 4138.0, low: 4132.0, close: 4137.5 }, // Approaching Asia High
  { id: 'c-3', index: 2, open: 4137.5, high: 4146.0, low: 4135.0, close: 4136.0 }, // Bull Trap Wick (Liquidity Sweep)
  { id: 'c-4', index: 3, open: 4136.0, high: 4137.0, low: 4122.0, close: 4123.5 }, // Displacement Dump & MSS
  { id: 'c-5', index: 4, open: 4123.5, high: 4132.0, low: 4121.0, close: 4131.0 }, // Retest Bearish FVG [4126 - 4135]
  { id: 'c-6', index: 5, open: 4131.0, high: 4131.5, low: 4115.0, close: 4116.0 }, // Selloff continuation
  { id: 'c-7', index: 6, open: 4116.0, high: 4117.0, low: 4099.0, close: 4102.0 }, // TP Hit +240 pips
];

export const useChartStore = create<ChartState>((set, get) => ({
  candles: INITIAL_CANDLES,
  overlays: [
    {
      id: 'asia-high-line',
      type: 'LIQUIDITY_LINE',
      startCandleIndex: 0,
      endCandleIndex: 3,
      priceStart: 4138.0,
      priceEnd: 4138.0,
      color: '#F59E0B',
      opacity: 0.9,
      label: 'Đỉnh Phiên Á (Asia High - 4,138.00)',
    },
    {
      id: 'fvg-bear',
      type: 'FVG',
      startCandleIndex: 3,
      endCandleIndex: 5,
      priceStart: 4126.0,
      priceEnd: 4135.0,
      color: '#FF3366',
      opacity: 0.25,
      label: 'Bearish FVG M15 [4126 - 4135]',
    },
    {
      id: 'rr-setup',
      type: 'LONG_SHORT',
      startCandleIndex: 4,
      endCandleIndex: 6,
      priceStart: 4131.0,
      priceEnd: 4102.0,
      color: '#00F5A0',
      opacity: 0.25,
      label: 'SELL XAUUSD +240 Pips (1:4 RR)',
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
  activeTool: 'templates',
  stageTheme: 'white',
  headlineText: 'TẠI SAO BẠN THUA LỖ KHI BUY GOLD TẠI ĐỈNH?',
  sublineText: 'Bẫy Liquidity Sweep M15 & Điểm vào lệnh chuẩn SMC',
  badges: ['1. LOSS $30', '2. SL 20 PIPS', '3. LOT 0.05'],
  isHermesChatOpen: false,
  isAzzamOpsOpen: false,
  showSafeZones: false,

  // TikTok / Reels Video Dynamics
  showCalloutPin: true,
  calloutPinText: '🎯 BẪY DỤ BUY QUÉT ĐỈNH',
  calloutCandleIndex: 2,
  showPipCounter: true,
  targetPips: 240,
  showExecutionBadge: true,
  executionOrder: {
    type: 'SELL',
    entry: 4136.0,
    sl: 4142.0,
    tp: 4112.0,
    lot: 0.05,
    risk: 30,
  },
  scriptSubtitles: [
    { timePercent: 0.0, text: 'Rất nhiều trader thấy cây nến xanh lớn liền vội vàng BUY đuổi...', stageName: 'Hook' },
    { timePercent: 0.28, text: 'Nhưng đây là cái bẫy thanh khoản của Market Maker dụ Retail Trader!', stageName: 'Trap' },
    { timePercent: 0.58, text: 'Nến rút râu để lại Bearish FVG M15 & MSS. Đây là dấu chân Big Boys!', stageName: 'Setup' },
    { timePercent: 0.82, text: 'Đặt SL 20 pips ($30 Risk), chốt lời +240 pips tại đáy cũ (1:4 R:R).', stageName: 'Execution' },
  ],
  showPhoneFrame: true,
  showTikTokUIOverlay: false,
  beforeAfterMode: 'off',
  setBeforeAfterMode: (mode) => set({ beforeAfterMode: mode }),
  validationReport: null,
  currentTime: 6.0,
  duration: 6.0,
  isPlaying: false,
  revealMode: 'sequential',

  // Voice & Audio State (Google AI Studio Gemini 3.8 Flash TTS + Web Speech Engine)
  voiceAudioUrl: null,
  voiceAudioBase64: null,
  isVoiceGenerating: false,
  selectedVoice: 'Charon',
  isAudioMuted: false,
  audioEngine: 'gemini',
  hasTtsQuotaExceeded: false,

  setAudioEngine: (engine) => set({ audioEngine: engine }),

  setVoiceAudio: (audioBase64, mimeType = 'audio/wav') => {
    if (!audioBase64) {
      set({ voiceAudioUrl: null, voiceAudioBase64: null });
      return;
    }
    const dataUrl = `data:${mimeType};base64,${audioBase64}`;
    set({ voiceAudioUrl: dataUrl, voiceAudioBase64: audioBase64, audioEngine: 'gemini', hasTtsQuotaExceeded: false });
  },

  setSelectedVoice: (voice) => set({ selectedVoice: voice }),
  setIsAudioMuted: (muted) => set({ isAudioMuted: muted }),

  generateVoiceover: async () => {
    const state = get();
    if (state.isVoiceGenerating) return false;

    set({ isVoiceGenerating: true });
    try {
      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subtitles: state.scriptSubtitles,
          voice: state.selectedVoice,
        }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          console.warn('Gemini 3.8 Flash TTS Free Tier quota exceeded (10/day). Falling back to Web Speech Engine.');
          set({ hasTtsQuotaExceeded: true, audioEngine: 'webspeech' });
          return false;
        }
        throw new Error(`TTS API failed: ${res.status}`);
      }

      const data = await res.json();
      if (data.audioBase64) {
        state.setVoiceAudio(data.audioBase64, data.mimeType || 'audio/wav');
        set({ audioEngine: 'gemini', hasTtsQuotaExceeded: false });
        return true;
      }
      if (data.rateLimited) {
        set({ hasTtsQuotaExceeded: true, audioEngine: 'webspeech' });
        return false;
      }
      return false;
    } catch (e) {
      console.error('Failed to generate voiceover with Gemini 3.8 Flash TTS:', e);
      set({ hasTtsQuotaExceeded: true, audioEngine: 'webspeech' });
      return false;
    } finally {
      set({ isVoiceGenerating: false });
    }
  },

  setActiveTool: (tool) => set({ activeTool: tool }),
  setStageTheme: (theme) => set({ stageTheme: theme }),
  setHeadlineText: (text) => set({ headlineText: text }),
  setSublineText: (text) => set({ sublineText: text }),
  setBadges: (badges) => set({ badges }),
  setIsAzzamOpsOpen: (open) => set({ isAzzamOpsOpen: open }),
  setIsHermesChatOpen: (open) => set({ isHermesChatOpen: open }),
  setShowSafeZones: (show) => set({ showSafeZones: show }),
  activeScriptMeta: null,
  setActiveScriptMeta: (meta) => set({ activeScriptMeta: meta }),

  setShowCalloutPin: (show) => set({ showCalloutPin: show }),
  setCalloutPinText: (text) => set({ calloutPinText: text }),
  setCalloutCandleIndex: (index) => set({ calloutCandleIndex: index }),
  setShowPipCounter: (show) => set({ showPipCounter: show }),
  setTargetPips: (pips) => set({ targetPips: pips }),
  setShowExecutionBadge: (show) => set({ showExecutionBadge: show }),
  setExecutionOrder: (order) => set({ executionOrder: order }),
  setScriptSubtitles: (subtitles) => set({ scriptSubtitles: subtitles }),
  setShowPhoneFrame: (show) => set({ showPhoneFrame: show }),
  setShowTikTokUIOverlay: (show) => set({ showTikTokUIOverlay: show }),

  setBuilderMode: (mode) => set({ builderMode: mode }),
  setActiveWorkspaceTab: (tab) => set({ activeWorkspaceTab: tab }),
  setRevealAnimation: (enabled) =>
    set({
      revealAnimation: enabled,
      revealMode: enabled ? 'sequential' : 'instant',
    }),

  setCandles: (candles) => set({ candles }),
  setOverlays: (overlays) => set({ overlays }),

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
      headlineText: template.headlineText || template.title,
      sublineText: template.sublineText || template.description?.substring(0, 70) || '',
      badges: template.badges || ['1. LOSS $30', '2. SL 20 PIPS', '3. LOT 0.05'],

      // State Isolation: KHÔNG lấy trộm dữ liệu cũ từ state nếu template không có
      showCalloutPin: template.showCalloutPin ?? (!!template.calloutPinText),
      calloutPinText: template.calloutPinText || '',
      calloutCandleIndex: template.calloutCandleIndex ?? 0,
      showPipCounter: template.showPipCounter ?? (!!template.targetPips),
      targetPips: template.targetPips ?? 0,
      showExecutionBadge: template.showExecutionBadge ?? (!!template.executionOrder),
      executionOrder: template.executionOrder || null,
      scriptSubtitles: template.scriptSubtitles || [],
      voiceAudioUrl: null,
      voiceAudioBase64: null,

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

  validateCurrentSetup: () => {
    const state = get();
    const report = validateAndNormalizeSetup({
      title: state.headlineText,
      candles: state.candles,
      overlays: state.overlays,
      executionOrder: state.executionOrder,
      calloutPinText: state.calloutPinText,
      calloutCandleIndex: state.calloutCandleIndex,
      scriptSubtitles: state.scriptSubtitles,
      badges: state.badges,
    });
    set({ validationReport: report });
    return report;
  },

  applyAutoNormalize: () => {
    const state = get();
    const report = state.validateCurrentSetup();
    if (report.normalizedSetup) {
      set({
        executionOrder: report.normalizedSetup.executionOrder,
        calloutPinText: report.normalizedSetup.calloutPinText,
        calloutCandleIndex: report.normalizedSetup.calloutCandleIndex,
        targetPips: report.normalizedSetup.targetPips,
        scriptSubtitles: report.normalizedSetup.scriptSubtitles,
        showPipCounter: true,
        showExecutionBadge: true,
        showCalloutPin: true,
      });
      // Re-run validation to get 100% score
      state.validateCurrentSetup();
    }
  },

  applyComprehensiveAutoFix: () => {
    const state = get();
    state.applyAutoNormalize();
  },

  applyEnglishVersion: () => {
    const state = get();
    const en = convertStateToEnglish({
      headlineText: state.headlineText,
      sublineText: state.sublineText,
      calloutPinText: state.calloutPinText,
      badges: state.badges,
      scriptSubtitles: state.scriptSubtitles,
      overlays: state.overlays,
      executionOrder: state.executionOrder,
    });

    set({
      headlineText: en.headlineText,
      sublineText: en.sublineText,
      calloutPinText: en.calloutPinText,
      badges: en.badges,
      scriptSubtitles: en.scriptSubtitles,
      overlays: en.overlays,
    });

    state.validateCurrentSetup();
  },
}));
