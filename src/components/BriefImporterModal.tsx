'use client';

import React, { useState, useEffect } from 'react';
import { useChartStore } from '../store/useChartStore';
import { FileText, Sparkles, X, CheckCircle, ArrowRight, Wand2, Scissors, RefreshCw } from 'lucide-react';

interface BriefImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Intelligent extractor for Long Briefs
function parseBriefText(text: string) {
  let headline = 'THE STOP LOSS CAME FIRST';
  let subline = 'The entry came second. That order is the whole video.';
  let symbol = 'XAUUSD';
  let riskBudget = 30;
  let slPips = 20;
  let rrRatio = 3.5;
  let supportPrice = 4128.0;

  // 1. Look for Hook Short (e.g. Hook Short (10 từ): "The stop loss came first. The entry came second.")
  const hookShortMatch = text.match(/Hook(?:\s*Short)?(?:\s*\([^)]*\))?:\s*["“]?([^"”\r\n]+)["”]?/i);
  if (hookShortMatch && hookShortMatch[1]) {
    const raw = hookShortMatch[1].trim();
    const parts = raw.split(/[.?!]/).map((s) => s.trim()).filter(Boolean);
    if (parts[0]) headline = parts[0];
    if (parts[1]) subline = parts[1] + (parts.length > 2 ? '. ' + parts.slice(2).join('. ') : '.');
  } else {
    // 2. Look for Title (e.g. 1. TITLE CUỐI: Define the Loss First: 3 Steps Before Any XAUUSD Entry)
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
    } else {
      // 3. Fallback: Take first punchy sentence
      const cleanText = text.replace(/#.*$/gm, '').replace(/\[\d+:\d+\].*?$/gm, '').trim();
      const firstSentence = cleanText.split(/[.?!]/)[0] || 'THE STOP LOSS CAME FIRST';
      headline = firstSentence.trim();
    }
  }

  // Auto-cut headline: strictly cap at 6-7 words for 9:16 mobile canvas!
  const headWords = headline.split(/\s+/).filter(Boolean);
  if (headWords.length > 7) {
    headline = headWords.slice(0, 6).join(' ');
  }

  // Auto-cut subline: strictly cap at 12 words
  const subWords = subline.split(/\s+/).filter(Boolean);
  if (subWords.length > 12) {
    subline = subWords.slice(0, 10).join(' ') + '...';
  }

  // 4. Extract trading numbers if present
  const budgetMatch = text.match(/\$(\d+)\s*(?:budget|risk|loss)/i) || text.match(/(?:budget|risk|loss)[^\d]*\$?(\d+)/i);
  if (budgetMatch) riskBudget = parseInt(budgetMatch[1], 10);

  const pipsMatch = text.match(/(\d+)\s*pips?/i);
  if (pipsMatch) slPips = parseInt(pipsMatch[1], 10);

  const rrMatch = text.match(/1\s*:\s*(\d+(?:\.\d+)?)/i);
  if (rrMatch) rrRatio = parseFloat(rrMatch[1]);

  const supportMatch = text.match(/\$?([4-9]\d{3}(?:\.\d{1,2})?)/);
  if (supportMatch) supportPrice = parseFloat(supportMatch[1]);

  return {
    headline: headline.toUpperCase(),
    subline,
    symbol,
    riskBudget,
    slPips,
    rrRatio,
    supportPrice,
  };
}

export const BriefImporterModal: React.FC<BriefImporterModalProps> = ({ isOpen, onClose }) => {
  const { setHeadlineText, setSublineText, setCurrentTime, setIsPlaying, addCandle, clearAllCandles, addOverlay } =
    useChartStore();

  const [briefText, setBriefText] = useState<string>(`# Script -- 2026-10-19 (risk-first-xauusd-beginner-roadmap-risk-first)
1. TITLE CUỐI: Define the Loss First: 3 Steps Before Any XAUUSD Entry
Hook Short (10 từ): "The stop loss came first. The entry came second."
Ví dụ XAUUSD: $30 budget → 20 pips → $1.50/pip, Previous High Support $4,128.00, 1:3.5 RR. Label: ILLUSTRATION`);

  // Parsed fields
  const [parsedHeadline, setParsedHeadline] = useState<string>('THE STOP LOSS CAME FIRST');
  const [parsedSubline, setParsedSubline] = useState<string>('The entry came second.');

  // Auto-parse on briefText change
  useEffect(() => {
    const res = parseBriefText(briefText);
    setParsedHeadline(res.headline);
    setParsedSubline(res.subline);
  }, [briefText]);

  if (!isOpen) return null;

  const handleApplyBrief = () => {
    // 1. Set clean Headline & Subline
    setHeadlineText(parsedHeadline);
    setSublineText(parsedSubline);
    useChartStore.setState({ duration: 12 });

    // 2. Generate Compliance-Approved Risk-First XAUUSD Candlestick Structure
    clearAllCandles();
    // Prior trend: Higher Highs & Higher Lows
    addCandle({ open: 4120.0, high: 4132.0, low: 4119.0, close: 4130.0 }); // Leg 1
    addCandle({ open: 4130.0, high: 4131.0, low: 4123.0, close: 4124.5 }); // Pullback Low
    addCandle({ open: 4124.5, high: 4142.0, low: 4124.0, close: 4140.0 }); // Higher High ($4,140)
    // Pullback to Support Level ($4,128.00)
    addCandle({ open: 4140.0, high: 4141.0, low: 4128.0, close: 4129.0 });
    // Rejection Candle (Trigger Entry)
    addCandle({ open: 4129.0, high: 4136.0, low: 4126.0, close: 4134.5 });
    // Target Expansion
    addCandle({ open: 4134.5, high: 4148.0, low: 4133.5, close: 4146.0 });

    // 3. Technical Risk:Reward Overlays
    addOverlay({
      type: 'LIQUIDITY_LINE',
      startCandleIndex: 1,
      endCandleIndex: 5,
      priceStart: 4128.0,
      priceEnd: 4128.0,
      color: '#38BDF8',
      label: 'Previous High Support ($4,128.00)',
    });

    addOverlay({
      type: 'LONG_SHORT',
      startCandleIndex: 4,
      endCandleIndex: 5,
      priceStart: 4128.0, // Entry at Support ($4,128.00)
      priceEnd: 4135.0,   // TP (+70 pips = 1:3.5 RR)
      color: '#00F5A0',
      label: 'Risk Budget: $30 | Size: $1.50/pip (1:3.5 RR)',
    });

    // 4. Auto-Play Animation
    setCurrentTime(0);
    setIsPlaying(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0F1420] border border-[#1E293B] rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-slate-200 select-none max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <span>Trích Xuất Brief Dài Tự Động (AI-Cut)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  CHO EDITOR
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Copy nguyên brief dài dán vào đây — hệ thống tự cắt lọc Hook ngắn gọn, không bị tràn chữ
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

        {/* Textarea: Paste Long Brief */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
            <span>Dán nội dung Brief dài (Google Drive):</span>
            <span className="text-[10px] text-indigo-400 font-mono">Tự nhận diện Hook Short & Title</span>
          </div>
          <textarea
            rows={5}
            value={briefText}
            onChange={(e) => setBriefText(e.target.value)}
            placeholder="Dán toàn bộ file brief dài vào đây..."
            className="w-full bg-[#141B29] border border-[#1E293B] rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono transition resize-none"
          />
        </div>

        {/* AI Auto-Cut Preview (Editor Can Verify & Adjust) */}
        <div className="bg-[#141B28] rounded-xl p-3.5 border border-indigo-500/40 flex flex-col gap-3 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wide">
              <Scissors className="w-3.5 h-3.5" />
              <span>Kết Quả Đã Cắt Gọn Tối Ưu Cho Video 9:16:</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Không bị tràn màn hình</span>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                Tiêu đề Hook (Headline - Cắt tối đa 6 từ):
              </span>
              <input
                type="text"
                value={parsedHeadline}
                onChange={(e) => setParsedHeadline(e.target.value)}
                className="w-full bg-[#0D121F] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 uppercase"
              />
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                Phụ đề giải thích (Subline - Cắt tối đa 10 từ):
              </span>
              <input
                type="text"
                value={parsedSubline}
                onChange={(e) => setParsedSubline(e.target.value)}
                className="w-full bg-[#0D121F] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-1 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>XAUUSD · Hỗ trợ $4,128.00 · Cắt lỗ: 20 pips ($30) · RR: 1:3.5</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleApplyBrief}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-[0.98]"
        >
          <Wand2 className="w-4 h-4" />
          <span>Áp Dụng Vào Canvas & Chạy Video (1-Click)</span>
        </button>
      </div>
    </div>
  );
};
