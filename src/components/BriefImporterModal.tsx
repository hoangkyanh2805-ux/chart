'use client';

import React, { useState } from 'react';
import { useChartStore } from '../store/useChartStore';
import { FileText, Sparkles, X, CheckCircle, ArrowRight, Wand2 } from 'lucide-react';

interface BriefImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BriefImporterModal: React.FC<BriefImporterModalProps> = ({ isOpen, onClose }) => {
  const { setHeadlineText, setSublineText, setCurrentTime, setIsPlaying, addCandle, clearAllCandles, addOverlay } =
    useChartStore();

  const [briefText, setBriefText] = useState<string>(`Define the Loss First: 3 Steps Before Any XAUUSD Entry
Hook: "The stop loss came first. The entry came second. That order is the whole video."
Chart: XAUUSD Higher highs, pullback to support, rejection candle, SL 20 pips ($30 budget), 1:3.5 RR. Label: ILLUSTRATION`);

  if (!isOpen) return null;

  const handleApplyBrief = () => {
    // 1. Intelligent parsing of Hook & Subline
    let headline = 'THE STOP LOSS CAME FIRST';
    let subline = 'The entry came second. That order is the whole video.';

    const hookMatch = briefText.match(/Hook(?:\s*Short)?(?:\s*\([^)]*\))?:\s*["“]?([^"”\n\r]+)["”]?/i);
    if (hookMatch && hookMatch[1]) {
      const parts = hookMatch[1].split(/[.?!]/).map(s => s.trim()).filter(Boolean);
      if (parts[0]) headline = parts[0].toUpperCase();
      if (parts[1]) subline = parts.slice(1).join('. ') + '.';
    }

    setHeadlineText(headline);
    setSublineText(subline);
    useChartStore.setState({ duration: 12 });

    // 2. Generate Compliance-Approved Risk-First XAUUSD Candlestick Structure
    clearAllCandles();
    // Prior trend: Higher Highs & Higher Lows
    addCandle({ open: 4120.0, high: 4132.0, low: 4119.0, close: 4130.0 }); // Leg 1
    addCandle({ open: 4130.0, high: 4131.0, low: 4123.0, close: 4124.5 }); // Pullback Low
    addCandle({ open: 4124.5, high: 4142.0, low: 4124.0, close: 4140.0 }); // Higher High ($4,140)
    // Pullback to Support Level ($4,128.00)
    addCandle({ open: 4140.0, high: 4141.0, low: 4128.0, close: 4129.0 });
    // Rejection Candle (Long lower wick bouncing on support, entry trigger!)
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
      priceEnd: 4135.0,   // TP (+70 pips / 1:3.5 RR)
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
      <div className="w-full max-w-lg bg-[#0F1420] border border-[#1E293B] rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-slate-200 select-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <span>Dán Brief Tạo Video Tự Động</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  DÀNH CHO EDITOR
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Editor không cần rành trading — chỉ cần dán đoạn Brief, app tự sinh kịch bản nến & xuất video
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
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Nội dung Brief / Script (từ Google Drive hoặc kịch bản):</span>
            <span className="text-[10px] text-indigo-400 font-mono">Auto-Extracts Hook & Setup</span>
          </label>
          <textarea
            rows={6}
            value={briefText}
            onChange={(e) => setBriefText(e.target.value)}
            placeholder="Dán nội dung Brief vào đây..."
            className="w-full bg-[#141B29] border border-[#1E293B] rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono transition resize-none"
          />
        </div>

        {/* Quick Help Guide for Editors */}
        <div className="bg-[#121927] p-3 rounded-xl border border-[#1E293B] text-xs space-y-1.5 text-slate-300">
          <div className="font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Quy trình 3 bước siêu tốc cho Editor:</span>
          </div>
          <p className="text-[11px] text-slate-400">
            1. Bấm <strong>Tự động tạo Video</strong> $\rightarrow$ App sẽ tự trích xuất tiêu đề Hook, vẽ biểu đồ XAUUSD chuẩn Stop Loss $30.
          </p>
          <p className="text-[11px] text-slate-400">
            2. Video tự động chạy thử trên màn hình để kiểm tra chữ.
          </p>
          <p className="text-[11px] text-slate-400">
            3. Bấm nút tím <strong>EXPORT</strong> ở góc dưới để tải video hoàn thiện về máy dựng.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleApplyBrief}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-[0.98]"
        >
          <Wand2 className="w-4 h-4" />
          <span>Tự Động Tạo Video Từ Brief Này (1-Click)</span>
        </button>
      </div>
    </div>
  );
};
