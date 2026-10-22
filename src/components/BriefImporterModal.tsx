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
} from 'lucide-react';

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

// Client-side quick parser
function parseBriefText(text: string): ParsedBrief {
  let headline = 'THE STOP LOSS CAME FIRST';
  let subline = 'The entry came second. That order is the whole video.';
  let setupType: SetupType = 'risk-first';
  let symbol = 'XAUUSD';
  let basePrice = 4128.0;
  let riskBudget = 30;
  let slPips = 20;
  let rrRatio = 3.5;

  if (/sweep|liquidity|bsl|ssl|purge|stop watching|fakeout|trap/i.test(text)) {
    setupType = 'liquidity-sweep';
    headline = 'YOU STOP WATCHING THE SWEEP';
    subline = 'You start watching what happens after it';
  } else if (/fvg|imbalance|fair value gap|consequent encroachment|50%/i.test(text)) {
    setupType = 'fvg';
    headline = 'THE 50% C.E. SECRET ENTRY';
    subline = 'Fair Value Gaps are institutional price magnets';
  } else if (/break (?:and|&) retest|retest|bos|break of structure/i.test(text)) {
    setupType = 'break-retest';
    headline = 'CLEAN BREAK & RETEST ONLY';
    subline = 'Patience pays 1:3.5 Risk-to-Reward';
  } else if (/bearish|short|dump|sell|supply|distribution/i.test(text)) {
    setupType = 'bearish-supply';
    headline = 'SUPPLY ZONE REJECTION';
    subline = 'When retail buys the top, institutions distribute';
  } else if (/risk-first|define the loss|stop loss first|loss budget/i.test(text)) {
    setupType = 'risk-first';
    headline = 'THE STOP LOSS CAME FIRST';
    subline = 'The entry came second. That order is the whole video.';
  }

  const hookShortMatch = text.match(/Hook(?:\s*Short)?(?:\s*\([^)]*\))?:\s*["“]?([^"”\r\n]+)["”]?/i);
  if (hookShortMatch && hookShortMatch[1]) {
    const raw = hookShortMatch[1].trim();
    const parts = raw.split(/[.?!]/).map((s) => s.trim()).filter(Boolean);
    if (parts[0]) headline = parts[0];
    if (parts[1]) subline = parts[1] + (parts.length > 2 ? '. ' + parts.slice(2).join('. ') : '.');
  } else {
    const titleMatch = text.match(/(?:TITLE|Title)(?:[^\r\n]*?)[:\-]\s*([^\r\n]+)/i);
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

  const headWords = headline.split(/\s+/).filter(Boolean);
  if (headWords.length > 7) {
    headline = headWords.slice(0, 6).join(' ');
  }

  const subWords = subline.split(/\s+/).filter(Boolean);
  if (subWords.length > 12) {
    subline = subWords.slice(0, 10).join(' ') + '...';
  }

  const budgetMatch = text.match(/\$(\d+)\s*(?:budget|risk|loss)/i) || text.match(/(?:budget|risk|loss)[^\d]*\$?(\d+)/i);
  if (budgetMatch) riskBudget = parseInt(budgetMatch[1], 10);

  const pipsMatch = text.match(/(\d+)\s*pips?/i);
  if (pipsMatch) slPips = parseInt(pipsMatch[1], 10);

  const rrMatch = text.match(/1\s*:\s*(\d+(?:\.\d+)?)/i);
  if (rrMatch) rrRatio = parseFloat(rrMatch[1]);

  const priceMatch = text.match(/\$?([4-9]\d{3}(?:\.\d{1,2})?)/);
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
    // Risk-First Support Bounce
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

  const [briefText, setBriefText] = useState<string>(`# Script -- 2026-10-19 (risk-first-xauusd-beginner-roadmap-risk-first)
1. TITLE CUỐI: Define the Loss First: 3 Steps Before Any XAUUSD Entry
Hook Short (10 từ): "The stop loss came first. The entry came second."
Ví dụ XAUUSD: $30 budget → 20 pips → $1.50/pip, Previous High Support $4,128.00, 1:3.5 RR. Label: ILLUSTRATION`);

  const [parsedHeadline, setParsedHeadline] = useState<string>('THE STOP LOSS CAME FIRST');
  const [parsedSubline, setParsedSubline] = useState<string>('The entry came second.');
  const [selectedSetup, setSelectedSetup] = useState<SetupType>('risk-first');
  const [basePrice, setBasePrice] = useState<number>(4128.0);

  // Gemini AI Integration States
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [showApiKeySetting, setShowApiKeySetting] = useState<boolean>(false);
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<SeniorTraderAIResult | null>(null);

  // Load saved API key on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('gemini_api_key');
      if (savedKey) setCustomApiKey(savedKey);
    }
  }, []);

  // Save API key when changed
  const handleSaveApiKey = (key: string) => {
    setCustomApiKey(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gemini_api_key', key);
    }
  };

  // Quick initial parse
  useEffect(() => {
    if (!aiResult) {
      const res = parseBriefText(briefText);
      setParsedHeadline(res.headline);
      setParsedSubline(res.subline);
      setSelectedSetup(res.setupType);
      setBasePrice(res.basePrice);
    }
  }, [briefText, aiResult]);

  // Call Gemini AI / Senior Trader Brain API
  const handleAnalyzeWithGemini = async () => {
    setIsLoadingAI(true);
    try {
      const res = await fetch('/api/ai/parse-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          briefText,
          customApiKey: customApiKey.trim() || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: SeniorTraderAIResult = await res.json();
      setAiResult(data);
      setParsedHeadline(data.headline);
      setParsedSubline(data.subline);
      setBasePrice(data.basePrice);

      // Map strategy to local setup
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
      console.error('Failed to analyze with Gemini:', err);
      // Fallback to local heuristic
      const local = parseBriefText(briefText);
      setParsedHeadline(local.headline);
      setParsedSubline(local.subline);
      setSelectedSetup(local.setupType);
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

  const handleApply = () => {
    // 1. Set text
    setHeadlineText(parsedHeadline);
    setSublineText(parsedSubline);
    useChartStore.setState({ duration: 12 });

    clearAllCandles();

    // 2. Use AI-generated candles/overlays if available; otherwise use strategy generator
    if (aiResult && aiResult.candles && aiResult.candles.length > 0) {
      aiResult.candles.forEach((c) => addCandle(c));
      if (aiResult.overlays) {
        aiResult.overlays.forEach((o) => addOverlay(o));
      }
    } else {
      const { candles: newCandles, overlays: newOverlays } = generateSetupData(selectedSetup, basePrice);
      newCandles.forEach((c) => addCandle(c));
      newOverlays.forEach((o) => addOverlay(o));
    }

    // 3. Play video immediately
    setCurrentTime(0);
    setIsPlaying(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#0F1420] border border-[#1E293B] rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-slate-200 select-none max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <BrainCircuit className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <span>Google Gemini AI • Phân Tích Brief & Sinh Setup Nến</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                  SENIOR TRADER
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Tự động trích xuất Hook không tràn màn hình và sinh 6 nến cấu trúc riêng biệt
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

        {/* Textarea */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
            <span>Dán nội dung Brief kịch bản (dài đến 1,400 từ từ Drive):</span>
            <button
              onClick={() => setShowApiKeySetting(!showApiKeySetting)}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono transition"
            >
              <Key className="w-3 h-3" />
              <span>{customApiKey ? 'Đã cài Gemini API Key' : 'Cài đặt Gemini API Key'}</span>
            </button>
          </div>

          {/* Optional Gemini API Key Input */}
          {showApiKeySetting && (
            <div className="bg-[#141B29] border border-indigo-500/30 rounded-xl p-2.5 flex flex-col gap-1.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Google Gemini API Key (Không bắt buộc - mặc định dùng Senior Trader Engine):</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={customApiKey}
                  onChange={(e) => handleSaveApiKey(e.target.value)}
                  className="flex-1 bg-[#0B0F19] border border-[#1E293B] rounded-lg px-2.5 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
                {customApiKey && (
                  <button
                    onClick={() => handleSaveApiKey('')}
                    className="text-[10px] text-rose-400 hover:underline px-2"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>
          )}

          <textarea
            rows={4}
            value={briefText}
            onChange={(e) => {
              setBriefText(e.target.value);
              setAiResult(null); // Reset when editing raw text
            }}
            placeholder="Dán toàn bộ file brief vào đây..."
            className="w-full bg-[#141B29] border border-[#1E293B] rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono transition resize-none"
          />
        </div>

        {/* Gemini AI Action Trigger Button */}
        <button
          type="button"
          onClick={handleAnalyzeWithGemini}
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
              <span>Phân Tích Bằng AI (Tự Động Sinh Setup Nến Khác Biệt)</span>
            </>
          )}
        </button>

        {/* AI Senior Trader Breakdown Card */}
        {aiResult && (
          <div className="bg-[#141B28] rounded-xl p-3 border border-indigo-500/40 flex flex-col gap-2 shadow-inner animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Chiến thuật: {aiResult.strategy}</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {aiResult.provider || 'AI Engine'}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic bg-[#0D121F] p-2 rounded-lg border border-[#1E293B]">
              "{aiResult.seniorTraderRationale}"
            </p>
          </div>
        )}

        {/* Setup Type Selector Chips */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Chiến thuật nến áp dụng:</span>
            <span className="text-[10px] font-mono text-amber-400">5 Setup Chiến Thuật Khác Biệt</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {setupOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setSelectedSetup(opt.id);
                  setAiResult(null); // Clear manual override of candle generation
                }}
                className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all text-left ${
                  selectedSetup === opt.id
                    ? 'bg-indigo-600/40 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-[#141B29] border-[#1E293B] text-slate-400 hover:text-white hover:bg-[#1A2335]'
                }`}
              >
                <opt.icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI-Cut Preview */}
        <div className="bg-[#141B28] rounded-xl p-3.5 border border-indigo-500/40 flex flex-col gap-2.5 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wide">
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
                className="w-full bg-[#0D121F] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 uppercase"
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
                className="w-full bg-[#0D121F] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleApply}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition active:scale-[0.98]"
        >
          <Wand2 className="w-4 h-4" />
          <span>Áp Dụng Vào Canvas & Sinh Video Ngay (1-Click)</span>
        </button>
      </div>
    </div>
  );
};
