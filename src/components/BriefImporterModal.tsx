'use client';

import React, { useState, useEffect } from 'react';
import { useChartStore } from '../store/useChartStore';
import { Candle, Overlay } from '../types/chart';
import {
  FileText,
  Sparkles,
  X,
  CheckCircle,
  Wand2,
  Scissors,
  Layers,
  TrendingUp,
  TrendingDown,
  Activity,
  Flame,
  Key,
  BrainCircuit,
  Loader2,
  ShieldCheck,
  Bookmark,
  Bot,
  RefreshCw,
  Clock,
  Radio,
  Zap,
  ListOrdered,
  Target,
  DollarSign,
} from 'lucide-react';
import { ApiKeyModal } from './ApiKeyModal';
import { executeHermesDirective, HermesDirectorDirective } from '../utils/hermesEngine';

interface BriefImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type SetupType = 'risk-first' | 'liquidity-sweep' | 'fvg' | 'break-retest' | 'bearish-supply';

interface ParsedBrief {
  headline: string;
  subline: string;
  setupType: SetupType;
  symbol: string;
  basePrice: number;
  riskBudget: number;
  slPips: number;
  rrRatio: number;
}

interface SeniorTraderAIResult {
  headline: string;
  subline: string;
  strategy: string;
  seniorTraderRationale: string;
  symbol: string;
  basePrice: number;
  candles: Candle[];
  overlays: Overlay[];
  provider?: string;
}

interface HermesScript {
  id: string;
  filename: string;
  title: string;
  hook: string;
  date: string;
  painpoint?: string;
  content: string;
}

const SAMPLE_BRIEFS = [
  {
    id: 'sweep',
    label: '⚡ Quét BSL ($4,154)',
    strategyName: 'Liquidity Sweep',
    text: `# Kịch Bản: Quét Thanh Khoản Buy Side Liquidity (BSL)
TITLE CUỐI: You Stop Watching The Sweep: Institutional Purge
Hook Short (10 từ): "You stop watching the sweep. You start watching after it."
Setup: Smart Money quét đỉnh BSL $4,154 rồi xả hàng Short cực mạnh về $4,130. Tỷ lệ RR 1:3.2.`,
  },
  {
    id: 'fvg',
    label: '🎯 FVG 50% CE ($4,125)',
    strategyName: 'Fair Value Gap',
    text: `# Kịch Bản: Fair Value Gap Retest XAUUSD
TITLE CUỐI: The 50% FVG Entry Secret: Institutional Magnet
Hook Short (10 từ): "Fair Value Gaps are institutional magnets. 50% entry."
Setup: Nến đẩy mạnh tạo M15 FVG từ $4,120 đến $4,129. Chờ nến hồi về 50% Consequent Encroachment để Buy lên $4,144.`,
  },
  {
    id: 'break',
    label: '💥 Break & Retest ($4,132)',
    strategyName: 'Break & Retest',
    text: `# Kịch Bản: Breakout & Retest Kháng Cự Cũ
TITLE CUỐI: Clean Break and Retest Only: High Winrate
Hook Short (10 từ): "Clean break and retest only. Patience pays maximum reward."
Setup: Nến Marubozu phá vỡ kháng cự $4,132, nến sau retest giữ vững rồi tiếp tục tăng mạnh lên $4,148.`,
  },
  {
    id: 'supply',
    label: '📉 Khối Cung ($4,145)',
    strategyName: 'Bearish Supply',
    text: `# Kịch Bản: H1 Supply Zone Phân Phối
TITLE CUỐI: Supply Zone Rejection: When Retail Buys Top
Hook Short (10 từ): "When retail buys the top, institutions distribute heavily."
Setup: Giá chạm khối Supply Zone $4,145 xuất hiện nến từ chối râu trên cực dài, Smart Money xả hàng về $4,125.`,
  },
  {
    id: 'risk',
    label: '🛡️ Risk-First ($30 SL)',
    strategyName: 'Risk-First Support',
    text: `# Script -- 2026-10-19 (risk-first-xauusd-beginner-roadmap-risk-first)
TITLE CUỐI: Define the Loss First: 3 Steps Before Any XAUUSD Entry
Hook Short (10 từ): "The stop loss came first. The entry came second."
Ví dụ XAUUSD: $30 budget → 20 pips → $1.50/pip, Previous High Support $4,128.00, 1:3.5 RR. Label: ILLUSTRATION`,
  },
];

// Client-side quick parser supporting both Vietnamese & English
function parseBriefText(text: string): ParsedBrief {
  let headline = 'CLEAN TRADING SETUP';
  let subline = 'Disciplined execution beats market noise.';
  let setupType: SetupType = 'risk-first';
  let symbol = 'XAUUSD';
  let basePrice = 4128.0;
  let riskBudget = 30;
  let slPips = 20;
  let rrRatio = 3.5;

  const isSweep = /sweep|liquidity|bsl|ssl|purge|stop watching|fakeout|trap|quét|thanh khoản|bẫy|quét đỉnh|quét đáy/i.test(text);
  const isFVG = /fvg|imbalance|fair value gap|consequent encroachment|50%|mất cân bằng|khoảng trống/i.test(text);
  const isBreakRetest = /break (?:and|&) retest|retest|bos|break of structure|phá vỡ|test lại|cản/i.test(text);
  const isSupply = /bearish|short|dump|sell|supply|distribution|phân phối|bán tháo|cung|giảm mạnh/i.test(text);
  const isRisk = /risk-first|define the loss|stop loss first|loss budget|quản lý vốn|cắt lỗ|ngân sách rủi ro/i.test(text);

  if (isSweep) {
    setupType = 'liquidity-sweep';
    headline = 'YOU STOP WATCHING THE SWEEP';
    subline = 'You start watching what happens after it';
    basePrice = 4140.0;
  } else if (isFVG) {
    setupType = 'fvg';
    headline = 'THE 50% FVG ENTRY SECRET';
    subline = 'Fair Value Gaps are institutional price magnets';
    basePrice = 4125.0;
  } else if (isBreakRetest) {
    setupType = 'break-retest';
    headline = 'CLEAN BREAK & RETEST ONLY';
    subline = 'Patience pays 1:3.5 Risk-to-Reward';
    basePrice = 4132.0;
  } else if (isSupply) {
    setupType = 'bearish-supply';
    headline = 'SUPPLY ZONE REJECTION';
    subline = 'When retail buys the top, institutions distribute';
    basePrice = 4145.0;
  } else if (isRisk) {
    setupType = 'risk-first';
    headline = 'THE STOP LOSS CAME FIRST';
    subline = 'The entry came second. That order is the whole video.';
    basePrice = 4128.0;
  }

  // 1. Custom Hook Short extraction
  const hookShortMatch = text.match(/Hook(?:\s*Short)?(?:\s*\([^)]*\))?:\s*["“]?([^"”\r\n]+)["”]?/i);
  if (hookShortMatch && hookShortMatch[1]) {
    const raw = hookShortMatch[1].trim();
    const parts = raw.split(/[.?!]/).map((s) => s.trim()).filter(Boolean);
    if (parts[0]) headline = parts[0];
    if (parts[1]) subline = parts[1] + (parts.length > 2 ? '. ' + parts.slice(2).join('. ') : '.');
  } else {
    // 2. Cutoff match
    const cutoffMatch = text.match(/Short hook cutoff:\s*["“]?([^"”\r\n]+)["”]?/i);
    if (cutoffMatch && cutoffMatch[1]) {
      const parts = cutoffMatch[1].trim().split(/[.?!]/).map((s) => s.trim()).filter(Boolean);
      if (parts[0]) headline = parts[0];
      if (parts[1]) subline = parts[1] + '.';
    } else {
      // 3. Title extraction
      const titleMatch = text.match(/(?:1\.\s*)?(?:TITLE|Title)(?:[^\r\n]*?)[:\-]\s*([^\r\n]+)/i);
      if (titleMatch && titleMatch[1]) {
        const rawTitle = titleMatch[1].trim();
        if (rawTitle.includes(':')) {
          const [h, s] = rawTitle.split(':');
          headline = h.trim();
          subline = s.trim();
        } else {
          headline = rawTitle;
        }
      }
    }
  }

  // Auto-cut headline: strictly cap at 6 words
  const headWords = headline.split(/\s+/).filter(Boolean);
  if (headWords.length > 6) {
    headline = headWords.slice(0, 6).join(' ');
  }

  // Auto-cut subline: strictly cap at 10 words
  const subWords = subline.split(/\s+/).filter(Boolean);
  if (subWords.length > 10) {
    subline = subWords.slice(0, 10).join(' ') + '...';
  }

  // Extract numbers
  const budgetMatch = text.match(/\$(\d+)\s*(?:budget|risk|loss)/i) || text.match(/(?:budget|risk|loss)[^\d]*\$?(\d+)/i);
  if (budgetMatch) riskBudget = parseInt(budgetMatch[1], 10);

  const pipsMatch = text.match(/(\d+)\s*pips?/i);
  if (pipsMatch) slPips = parseInt(pipsMatch[1], 10);

  const rrMatch = text.match(/1\s*:\s*(\d+(?:\.\d+)?)/i);
  if (rrMatch) rrRatio = parseFloat(rrMatch[1]);

  const priceMatch = text.match(/\$?([2-9]\d{3}(?:\.\d{1,2})?)/);
  if (priceMatch) basePrice = parseFloat(priceMatch[1]);

  return {
    headline: headline.toUpperCase(),
    subline,
    setupType,
    symbol,
    basePrice,
    riskBudget,
    slPips,
    rrRatio,
  };
}

// Generate distinct candlestick sequences for each setup type
function generateSetupData(type: SetupType, baseP: number) {
  let candles: Candle[] = [];
  let overlays: Overlay[] = [];

  if (type === 'liquidity-sweep') {
    candles = [
      { id: 'c-1', index: 0, open: baseP, high: baseP + 6.0, low: baseP - 1.0, close: baseP + 5.0 },
      { id: 'c-2', index: 1, open: baseP + 5.0, high: baseP + 14.0, low: baseP + 4.0, close: baseP + 13.0 },
      { id: 'c-3', index: 2, open: baseP + 13.0, high: baseP + 14.5, low: baseP + 9.0, close: baseP + 10.0 },
      { id: 'c-4', index: 3, open: baseP + 10.0, high: baseP + 21.0, low: baseP + 6.0, close: baseP + 7.0 },
      { id: 'c-5', index: 4, open: baseP + 7.0, high: baseP + 7.5, low: baseP - 4.0, close: baseP - 3.0 },
      { id: 'c-6', index: 5, open: baseP - 3.0, high: baseP - 2.5, low: baseP - 12.0, close: baseP - 10.0 },
    ];

    overlays = [
      {
        id: 'bsl-line',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 1,
        endCandleIndex: 3,
        priceStart: baseP + 14.0,
        priceEnd: baseP + 14.0,
        color: '#F59E0B',
        label: `BSL Sweep Level ($${(baseP + 14.0).toFixed(2)})`,
      },
      {
        id: 'sweep-rr',
        type: 'LONG_SHORT',
        startCandleIndex: 3,
        endCandleIndex: 5,
        priceStart: baseP + 7.0,
        priceEnd: baseP - 10.0,
        color: '#EF4444',
        label: 'Short Entry | TP: +1:3.2 RR',
      },
    ];
  } else if (type === 'fvg') {
    candles = [
      { id: 'c-1', index: 0, open: baseP - 5.0, high: baseP, low: baseP - 6.0, close: baseP - 1.0 },
      { id: 'c-2', index: 1, open: baseP - 1.0, high: baseP + 15.0, low: baseP - 1.5, close: baseP + 14.0 },
      { id: 'c-3', index: 2, open: baseP + 14.0, high: baseP + 19.0, low: baseP + 9.0, close: baseP + 18.0 },
      { id: 'c-4', index: 3, open: baseP + 18.0, high: baseP + 18.5, low: baseP + 5.0, close: baseP + 6.0 },
      { id: 'c-5', index: 4, open: baseP + 6.0, high: baseP + 8.0, low: baseP + 4.5, close: baseP + 7.5 },
      { id: 'c-6', index: 5, open: baseP + 7.5, high: baseP + 24.0, low: baseP + 7.0, close: baseP + 23.0 },
    ];

    overlays = [
      {
        id: 'fvg-box',
        type: 'FVG',
        startCandleIndex: 1,
        endCandleIndex: 4,
        priceStart: baseP,
        priceEnd: baseP + 9.0,
        color: '#00F5A0',
        label: `M15 Bullish FVG [${baseP.toFixed(1)} - ${(baseP + 9.0).toFixed(1)}]`,
      },
      {
        id: 'fvg-rr',
        type: 'LONG_SHORT',
        startCandleIndex: 4,
        endCandleIndex: 5,
        priceStart: baseP + 7.5,
        priceEnd: baseP + 23.0,
        color: '#00F5A0',
        label: 'Buy FVG CE | 1:3.5 RR',
      },
    ];
  } else if (type === 'break-retest') {
    const resLevel = baseP + 4.0;
    candles = [
      { id: 'c-1', index: 0, open: baseP - 2.0, high: resLevel, low: baseP - 3.0, close: resLevel - 1.0 },
      { id: 'c-2', index: 1, open: resLevel - 1.0, high: resLevel + 0.5, low: baseP - 2.0, close: baseP - 1.0 },
      { id: 'c-3', index: 2, open: baseP - 1.0, high: resLevel + 11.0, low: baseP - 1.5, close: resLevel + 10.0 },
      { id: 'c-4', index: 3, open: resLevel + 10.0, high: resLevel + 10.5, low: resLevel + 0.5, close: resLevel + 1.5 },
      { id: 'c-5', index: 4, open: resLevel + 1.5, high: resLevel + 6.0, low: resLevel, close: resLevel + 5.0 },
      { id: 'c-6', index: 5, open: resLevel + 5.0, high: resLevel + 16.0, low: resLevel + 4.5, close: resLevel + 15.0 },
    ];

    overlays = [
      {
        id: 'breakout-line',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 0,
        endCandleIndex: 4,
        priceStart: resLevel,
        priceEnd: resLevel,
        color: '#38BDF8',
        label: `Break & Retest Level ($${resLevel.toFixed(2)})`,
      },
      {
        id: 'break-rr',
        type: 'LONG_SHORT',
        startCandleIndex: 4,
        endCandleIndex: 5,
        priceStart: resLevel + 5.0,
        priceEnd: resLevel + 15.0,
        color: '#00F5A0',
        label: 'Retest Entry | 1:3.0 RR',
      },
    ];
  } else if (type === 'bearish-supply') {
    const supplyLevel = baseP + 12.0;
    candles = [
      { id: 'c-1', index: 0, open: baseP + 8.0, high: supplyLevel - 1.0, low: baseP + 6.0, close: supplyLevel - 2.0 },
      { id: 'c-2', index: 1, open: supplyLevel - 2.0, high: supplyLevel + 2.0, low: baseP + 7.0, close: baseP + 8.0 },
      { id: 'c-3', index: 2, open: baseP + 8.0, high: baseP + 8.5, low: baseP - 3.0, close: baseP - 2.0 },
      { id: 'c-4', index: 3, open: baseP - 2.0, high: baseP + 3.0, low: baseP - 2.5, close: baseP + 2.0 },
      { id: 'c-5', index: 4, open: baseP + 2.0, high: baseP + 2.5, low: baseP - 10.0, close: baseP - 9.0 },
      { id: 'c-6', index: 5, open: baseP - 9.0, high: baseP - 8.5, low: baseP - 18.0, close: baseP - 17.0 },
    ];

    overlays = [
      {
        id: 'supply-box',
        type: 'ORDER_BLOCK',
        startCandleIndex: 0,
        endCandleIndex: 2,
        priceStart: supplyLevel - 2.0,
        priceEnd: supplyLevel + 2.0,
        color: '#EF4444',
        label: `H1 Supply Zone [${(supplyLevel - 2).toFixed(1)} - ${(supplyLevel + 2).toFixed(1)}]`,
      },
    ];
  } else {
    candles = [
      { id: 'c-1', index: 0, open: baseP - 8.0, high: baseP + 4.0, low: baseP - 9.0, close: baseP + 2.0 },
      { id: 'c-2', index: 1, open: baseP + 2.0, high: baseP + 3.0, low: baseP - 5.0, close: baseP - 3.5 },
      { id: 'c-3', index: 2, open: baseP - 3.5, high: baseP + 14.0, low: baseP - 4.0, close: baseP + 12.0 },
      { id: 'c-4', index: 3, open: baseP + 12.0, high: baseP + 13.0, low: baseP, close: baseP + 1.0 },
      { id: 'c-5', index: 4, open: baseP + 1.0, high: baseP + 8.0, low: baseP - 2.0, close: baseP + 6.5 },
      { id: 'c-6', index: 5, open: baseP + 6.5, high: baseP + 20.0, low: baseP + 5.5, close: baseP + 18.0 },
    ];

    overlays = [
      {
        id: 'support-line',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 1,
        endCandleIndex: 4,
        priceStart: baseP,
        priceEnd: baseP,
        color: '#38BDF8',
        label: `Previous High Support ($${baseP.toFixed(2)})`,
      },
      {
        id: 'risk-rr',
        type: 'LONG_SHORT',
        startCandleIndex: 4,
        endCandleIndex: 5,
        priceStart: baseP,
        priceEnd: baseP + 7.0,
        color: '#00F5A0',
        label: 'Risk Budget: $30 | 1:3.5 RR',
      },
    ];
  }

  return { candles, overlays };
}

export const BriefImporterModal: React.FC<BriefImporterModalProps> = ({ isOpen, onClose }) => {
  const { setHeadlineText, setSublineText, setCurrentTime, setIsPlaying, clearAllCandles, addCandle, addOverlay } =
    useChartStore();

  const [activeTab, setActiveTab] = useState<'hermes' | 'manual'>('hermes');
  const [hermesScripts, setHermesScripts] = useState<HermesScript[]>([]);
  const [selectedHermesId, setSelectedHermesId] = useState<string>('');
  const [isLoadingHermes, setIsLoadingHermes] = useState<boolean>(false);
  const [hermesDirective, setHermesDirective] = useState<HermesDirectorDirective | null>(null);
  const [showOutlinePreview, setShowOutlinePreview] = useState<boolean>(false);

  const [briefText, setBriefText] = useState<string>(SAMPLE_BRIEFS[4].text);
  const [parsedHeadline, setParsedHeadline] = useState<string>('THE STOP LOSS CAME FIRST');
  const [parsedSubline, setParsedSubline] = useState<string>('The entry came second.');
  const [selectedSetup, setSelectedSetup] = useState<SetupType>('risk-first');
  const [basePrice, setBasePrice] = useState<number>(4128.0);

  // Gemini AI Integration States (Auxiliary fallback)
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<SeniorTraderAIResult | null>(null);

  // Load Hermes scripts on modal open
  useEffect(() => {
    if (isOpen) {
      fetchHermesScripts();
    }
  }, [isOpen]);

  const fetchHermesScripts = async () => {
    setIsLoadingHermes(true);
    try {
      const res = await fetch('/api/hermes/scripts');
      const data = await res.json();
      if (data.scripts && data.scripts.length > 0) {
        setHermesScripts(data.scripts);
        // Automatically execute the first Hermes script
        if (!selectedHermesId) {
          handleSelectHermesScript(data.scripts[0]);
        }
      }
    } catch (err) {
      console.warn('Lỗi tải danh sách kịch bản Hermes:', err);
    } finally {
      setIsLoadingHermes(false);
    }
  };

  // Load saved API key on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('gemini_api_key');
      if (savedKey) setCustomApiKey(savedKey);
    }
  }, [isApiKeyModalOpen]);

  // Synchronize client parse immediately when text changes
  const applyTextParse = (text: string) => {
    const res = parseBriefText(text);
    setParsedHeadline(res.headline);
    setParsedSubline(res.subline);
    setSelectedSetup(res.setupType);
    setBasePrice(res.basePrice);
  };

  // ⚡ HERMES NATIVE EXECUTION (DIRECTOR SOT)
  const handleSelectHermesScript = (s: HermesScript) => {
    setSelectedHermesId(s.id);
    setBriefText(s.content);

    // Run Hermes Native Engine synchronously: 0% hallucination!
    const directive = executeHermesDirective(s.content, s.filename);
    setHermesDirective(directive);
    setParsedHeadline(directive.hookHeadline);
    setParsedSubline(directive.hookSubline);
    setBasePrice(directive.basePrice);

    if (/sweep|liquidity/i.test(directive.strategy)) {
      setSelectedSetup('liquidity-sweep');
    } else if (/fvg|imbalance/i.test(directive.strategy)) {
      setSelectedSetup('fvg');
    } else if (/structure|trend|chart/i.test(directive.strategy)) {
      setSelectedSetup('break-retest');
    } else if (/bearish|supply/i.test(directive.strategy)) {
      setSelectedSetup('bearish-supply');
    } else {
      setSelectedSetup('risk-first');
    }

    setAiResult({
      headline: directive.hookHeadline,
      subline: directive.hookSubline,
      strategy: directive.strategy,
      seniorTraderRationale: `Chỉ thị thực chiến từ Hermes: Nỗi đau "${directive.painpoint}". Giờ vàng: ${directive.goldenHour}. Quản lý vốn: $${directive.riskBudget} budget, ${directive.slPips} pips SL, $${directive.lotSize}/pip.`,
      symbol: 'XAUUSD',
      basePrice: directive.basePrice,
      candles: directive.candles,
      overlays: directive.overlays,
      provider: '⚡ Hermes Native Director Engine (100% SOT)',
    });
  };

  // Call Gemini AI for manual briefs
  const handleAnalyzeWithGemini = async (textToAnalyze?: string) => {
    const text = (textToAnalyze !== undefined ? textToAnalyze : briefText).trim();
    if (!text) return;

    setHermesDirective(null); // Clear Hermes directive when running custom Gemini analysis
    applyTextParse(text);

    setIsLoadingAI(true);
    try {
      const res = await fetch('/api/ai/parse-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          briefText: text,
          customApiKey: customApiKey.trim() || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: SeniorTraderAIResult = await res.json();
      setAiResult(data);
      if (data.headline) setParsedHeadline(data.headline);
      if (data.subline) setParsedSubline(data.subline);
      if (data.basePrice) setBasePrice(data.basePrice);

      if (/sweep|liquidity/i.test(data.strategy)) {
        setSelectedSetup('liquidity-sweep');
      } else if (/fvg|imbalance/i.test(data.strategy)) {
        setSelectedSetup('fvg');
      } else if (/break/i.test(data.strategy)) {
        setSelectedSetup('break-retest');
      } else if (/bearish|supply/i.test(data.strategy)) {
        setSelectedSetup('bearish-supply');
      } else {
        setSelectedSetup('risk-first');
      }
    } catch (err: any) {
      console.warn('Gemini AI notice:', err.message);
    } finally {
      setIsLoadingAI(false);
    }
  };

  if (!isOpen) return null;

  const setupOptions: { id: SetupType; label: string; icon: any; color: string }[] = [
    { id: 'risk-first', label: '🛡️ Risk-First Support', icon: TrendingUp, color: 'text-sky-400 border-sky-500/40' },
    { id: 'liquidity-sweep', label: '⚡ Liquidity Sweep', icon: Flame, color: 'text-amber-400 border-amber-500/40' },
    { id: 'fvg', label: '🎯 Fair Value Gap (FVG)', icon: Layers, color: 'text-emerald-400 border-emerald-500/40' },
    { id: 'break-retest', label: '💥 Break & Retest', icon: Activity, color: 'text-indigo-400 border-indigo-500/40' },
    { id: 'bearish-supply', label: '📉 Bearish Supply Zone', icon: TrendingDown, color: 'text-rose-400 border-rose-500/40' },
  ];

  const handleSelectSample = (sample: typeof SAMPLE_BRIEFS[0]) => {
    setHermesDirective(null);
    setBriefText(sample.text);
    handleAnalyzeWithGemini(sample.text);
  };

  const handleApply = () => {
    // 1. Set text & badges
    setHeadlineText(parsedHeadline);
    setSublineText(parsedSubline);
    if (hermesDirective && hermesDirective.badges) {
      useChartStore.getState().setBadges(hermesDirective.badges);
    }
    useChartStore.setState({ duration: 12 });

    clearAllCandles();

    // 2. Priority: Hermes Directive -> AI Result -> Generator
    let dir: 'BUY' | 'SELL' = 'BUY';
    let riskB = 10;
    let slP = 20;
    let rr = 3.5;
    let lotStr = '0.05 lot';

    if (hermesDirective && hermesDirective.candles && hermesDirective.candles.length > 0) {
      hermesDirective.candles.forEach((c) => addCandle(c));
      if (hermesDirective.overlays) {
        hermesDirective.overlays.forEach((o) => addOverlay(o));
      }
      dir = /sweep|supply|bearish/i.test(hermesDirective.strategy) ? 'SELL' : 'BUY';
      riskB = hermesDirective.riskBudget || 10;
      slP = hermesDirective.slPips || 20;
      rr = hermesDirective.rrRatio || 3.5;
      lotStr = hermesDirective.lotSize || '0.05 lot';
    } else if (aiResult && aiResult.candles && aiResult.candles.length > 0) {
      aiResult.candles.forEach((c) => addCandle(c));
      if (aiResult.overlays) {
        aiResult.overlays.forEach((o) => addOverlay(o));
      }
      dir = /sweep|supply|bearish/i.test(aiResult.strategy) ? 'SELL' : 'BUY';
    } else {
      const { candles: newCandles, overlays: newOverlays } = generateSetupData(selectedSetup, basePrice);
      newCandles.forEach((c) => addCandle(c));
      newOverlays.forEach((o) => addOverlay(o));
      dir = selectedSetup === 'liquidity-sweep' || selectedSetup === 'bearish-supply' ? 'SELL' : 'BUY';
    }

    // 2.5 State Hygiene: Update executionOrder, targetPips, calloutPin, and subtitles
    const baseP = basePrice || 4128.0;
    const slDist = slP * 0.1;
    const tpDist = slP * rr * 0.1;
    const slPrice = dir === 'BUY' ? baseP - slDist : baseP + slDist;
    const tpPrice = dir === 'BUY' ? baseP + tpDist : baseP - tpDist;
    const targetPips = Math.round(slP * rr);
    const lotNum = parseFloat(lotStr.replace(/[^0-9.]/g, '')) || 0.05;

    useChartStore.setState({
      executionOrder: {
        type: dir,
        lot: lotNum,
        entry: parseFloat(baseP.toFixed(1)),
        sl: parseFloat(slPrice.toFixed(1)),
        tp: parseFloat(tpPrice.toFixed(1)),
        risk: riskB,
        reward: Math.round(riskB * rr),
        pips: targetPips,
      },
      targetPips,
      showPipCounter: true,
      showExecutionBadge: true,
      calloutPinText: dir === 'BUY' ? `🎯 RÚT CHÂN HỖ TRỢ ($${baseP.toFixed(0)})` : `🎯 BẪY DỤ BUY QUÉT ĐỈNH ($${baseP.toFixed(0)})`,
      calloutCandleIndex: 4,
      showCalloutPin: true,
      scriptSubtitles: [
        { timePercent: 0.0, text: `Khóa rủi ro 1R ($${riskB}) trước khi nhìn chart!`, stageName: 'Hook' },
        { timePercent: 0.28, text: `Thị trường test lại cản kỹ thuật, dụ đám đông vào lệnh cảm xúc.`, stageName: 'Trap' },
        { timePercent: 0.58, text: `Nến xác nhận đảo chiều. Chuẩn bị vào lệnh ${dir} ${lotNum} lot.`, stageName: 'Setup' },
        { timePercent: 0.82, text: `Khóa SL ${slP} pips ($${riskB}), chốt lời +${targetPips} pips (1:${rr} R:R).`, stageName: 'Execution' },
      ],
    });

    // 2.6 Run Runtime Validation
    useChartStore.getState().validateCurrentSetup();

    // 3. Play video immediately
    setCurrentTime(0);
    setIsPlaying(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0F1420] border border-[#1E293B] rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-slate-200 select-none max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-amber-500/20 via-sky-500/20 to-indigo-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <span>Hermes Native Execution • Đạo Diễn Kịch Bản Trading</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  DIRECTOR SOT
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Thực thi 100% nguyên bản chỉ đạo từ Hermes Agent • Không qua Gemini • 0% Sai lệch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Hermes Live Sync vs Manual Paste */}
        <div className="flex items-center justify-between bg-[#141B29] p-1 rounded-xl border border-[#1E293B]">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('hermes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'hermes'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>⚡ Hermes Native ({hermesScripts.length} Kịch Bản Sẵn)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('manual');
                setHermesDirective(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'manual'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>📝 Dán Brief Tùy Ý (Gemini AI)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsApiKeyModalOpen(true)}
            className="text-[11px] text-slate-400 hover:text-indigo-300 flex items-center gap-1 font-mono px-2.5 py-1 rounded-lg hover:bg-[#1E293B] transition"
          >
            <Key className="w-3 h-3 text-slate-400" />
            <span>{customApiKey ? 'Gemini: 🟢' : 'Gemini: Cài Key'}</span>
          </button>
        </div>

        {/* TAB 1: Hermes Native Execution */}
        {activeTab === 'hermes' && (
          <div className="flex flex-col gap-2.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Chọn kịch bản Hermes để kích hoạt Native Execution:</span>
              </span>
              <button
                type="button"
                onClick={fetchHermesScripts}
                disabled={isLoadingHermes}
                className="text-[11px] text-slate-400 hover:text-sky-400 flex items-center gap-1 transition"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingHermes ? 'animate-spin' : ''}`} />
                <span>Quét Lại Thư Mục</span>
              </button>
            </div>

            {/* Hermes Scripts Horizontal Scroller */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
              {hermesScripts.map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleSelectHermesScript(s)}
                  className={`p-2 rounded-xl border cursor-pointer transition flex flex-col gap-1 text-left ${
                    selectedHermesId === s.id
                      ? 'bg-amber-500/15 border-amber-500/60 text-white shadow-md'
                      : 'bg-[#141B29] border-[#1E293B] hover:bg-[#1A2335] text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs truncate max-w-[220px] text-white">
                      {s.title || s.filename}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {s.date ? new Date(s.date).toLocaleDateString('vi-VN') : ''}
                    </span>
                  </div>

                  {s.hook && (
                    <div className="text-[11px] text-amber-300/90 italic truncate">
                      Hook: "{s.hook}"
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Hermes Master Directive Inspector Card */}
            {hermesDirective && (
              <div className="bg-[#121824] rounded-xl p-3 border border-amber-500/40 flex flex-col gap-2.5 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Chỉ thị đạo diễn của Hermes Agent</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    100% NATIVE SOT
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#0B0F19] p-2 rounded-lg border border-[#1E293B]">
                    <span className="text-[10px] text-slate-400 block font-semibold">🎬 Tiêu đề video (Hermes Title):</span>
                    <span className="font-bold text-white text-xs leading-snug">{hermesDirective.title}</span>
                  </div>

                  <div className="bg-[#0B0F19] p-2 rounded-lg border border-[#1E293B]">
                    <span className="text-[10px] text-slate-400 block font-semibold">⏰ Khung giờ vàng đăng:</span>
                    <span className="font-bold text-amber-300 text-xs">{hermesDirective.goldenHour}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-[#0B0F19] p-1.5 rounded-lg border border-[#1E293B] text-center">
                    <span className="text-[9px] text-slate-400 block">Ngân sách rủi ro:</span>
                    <span className="font-bold text-emerald-400 font-mono">${hermesDirective.riskBudget}</span>
                  </div>
                  <div className="bg-[#0B0F19] p-1.5 rounded-lg border border-[#1E293B] text-center">
                    <span className="text-[9px] text-slate-400 block">Khoảng cách SL:</span>
                    <span className="font-bold text-sky-400 font-mono">{hermesDirective.slPips} pips</span>
                  </div>
                  <div className="bg-[#0B0F19] p-1.5 rounded-lg border border-[#1E293B] text-center">
                    <span className="text-[9px] text-slate-400 block">Khối lượng lệnh:</span>
                    <span className="font-bold text-amber-400 font-mono">${hermesDirective.lotSize}/pip</span>
                  </div>
                </div>

                {hermesDirective.painpoint && (
                  <div className="text-[11px] text-slate-300 bg-[#0B0F19] p-2 rounded-lg border border-[#1E293B]">
                    <span className="text-amber-400 font-bold">💡 Nỗi đau khán giả thật: </span>
                    <span>"{hermesDirective.painpoint}"</span>
                  </div>
                )}

                {/* Toggle Outline Preview */}
                {hermesDirective.outline.length > 0 && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowOutlinePreview(!showOutlinePreview)}
                      className="text-[11px] text-sky-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                      <span>{showOutlinePreview ? 'Ẩn Dàn ý 8 phần của Hermes' : 'Xem Dàn ý 8 phần của Hermes (Timeline Cues)'}</span>
                    </button>

                    {showOutlinePreview && (
                      <div className="mt-1.5 bg-[#080B12] rounded-lg p-2 border border-[#1E293B] max-h-36 overflow-y-auto text-[11px]">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-slate-500 border-b border-[#1E293B] pb-1">
                              <th className="py-0.5">#</th>
                              <th>Mốc Giây</th>
                              <th>Ý Chính</th>
                              <th>Minh Họa</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1E293B]/50">
                            {hermesDirective.outline.map((o) => (
                              <tr key={o.step} className="text-slate-300">
                                <td className="py-1 font-bold text-amber-400">{o.step}</td>
                                <td className="font-mono text-sky-300">{o.timestamp}</td>
                                <td>{o.mainIdea}</td>
                                <td className="text-slate-400 truncate max-w-[180px]">{o.chartNeed}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Manual Paste (Gemini AI) */}
        {activeTab === 'manual' && (
          <div className="flex flex-col gap-2.5 animate-in fade-in duration-150">
            {/* 1-Click Sample Presets */}
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_BRIEFS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelectSample(s)}
                  className="px-2.5 py-1 rounded-lg bg-[#141B29] hover:bg-indigo-600/30 border border-[#1E293B] hover:border-indigo-500/50 text-[11px] font-semibold text-slate-300 hover:text-white transition shadow-sm"
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              rows={4}
              value={briefText}
              onPaste={(e) => {
                const pasted = e.clipboardData.getData('text');
                if (pasted && pasted.trim().length > 10) {
                  setBriefText(pasted);
                  handleAnalyzeWithGemini(pasted);
                }
              }}
              onChange={(e) => {
                const val = e.target.value;
                setBriefText(val);
                applyTextParse(val);
                setAiResult(null);
              }}
              placeholder="Dán toàn bộ file brief từ Google Drive hoặc văn bản kịch bản vào đây..."
              className="w-full bg-[#141B29] border border-[#1E293B] rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono transition resize-none"
            />

            {/* Gemini AI Action Trigger Button */}
            <button
              type="button"
              onClick={() => handleAnalyzeWithGemini()}
              disabled={isLoadingAI || !briefText.trim()}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingAI ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Đang Phân Tích Với Google Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>Phân Tích Bằng AI (Tự Động Sinh Setup Nến Mới Khác Biệt)</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Hook Cut Preview (Common to both modes) */}
        <div className="bg-[#141B28] rounded-xl p-3.5 border border-amber-500/40 flex flex-col gap-2.5 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
              <Scissors className="w-3.5 h-3.5" />
              <span>Hook Cắt Gọn Tối Ưu Cho Video 9:16:</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>Chuẩn Mobile Safe-Zone</span>
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                Headline (Tối đa 6 từ):
              </span>
              <input
                type="text"
                value={parsedHeadline}
                onChange={(e) => setParsedHeadline(e.target.value)}
                className="w-full bg-[#0D121F] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-amber-500 uppercase font-mono"
              />
            </div>

            <div>
              <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                Subline (Tối đa 10 từ):
              </span>
              <input
                type="text"
                value={parsedSubline}
                onChange={(e) => setParsedSubline(e.target.value)}
                className="w-full bg-[#0D121F] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleApply}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition active:scale-[0.98]"
        >
          <Zap className="w-4 h-4 text-black fill-current" />
          <span>Áp Dụng Chỉ Thị Của Hermes Vào Canvas & Sinh Video Ngay (1-Click)</span>
        </button>
      </div>

      {/* Api Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={(newKey) => setCustomApiKey(newKey)}
      />
    </div>
  );
};
