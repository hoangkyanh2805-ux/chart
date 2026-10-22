'use client';

import React, { useState } from 'react';
import { useChartStore } from '../store/useChartStore';
import { AZZAM_OPS_ITEMS, AzzamPainPointItem } from '../data/azzamOps';
import { Radio, X, Sparkles, MessageSquareQuote, CheckCircle2, Video, TrendingUp, AlertTriangle } from 'lucide-react';

interface AzzamOpsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAndExport: () => void;
}

export const AzzamOpsModal: React.FC<AzzamOpsModalProps> = ({
  isOpen,
  onClose,
  onSelectAndExport,
}) => {
  const {
    loadTemplate,
    updateSettings,
    setHeadlineText,
    setSublineText,
    setBadges,
    clearAllCandles,
    addCandle,
    addOverlay,
    setCurrentTime,
    setIsPlaying,
  } = useChartStore();
  const [activeTab, setActiveTab] = useState<'all' | 'pain_point' | 'backlog'>('all');

  if (!isOpen) return null;

  const filteredItems =
    activeTab === 'all'
      ? AZZAM_OPS_ITEMS
      : AZZAM_OPS_ITEMS.filter((item) => item.type === activeTab);

  const handleApplyBrief = (item: AzzamPainPointItem) => {
    loadTemplate(item.recommendedSetup);

    // Synchronize candles & overlays
    clearAllCandles();
    item.recommendedSetup.candles.forEach((c) => addCandle(c));
    item.recommendedSetup.overlays.forEach((o) => addOverlay(o));

    // Update Stage typography & stepper badges
    setHeadlineText((item.recommendedSetup.bannerHook || item.hookTitle).toUpperCase());
    setSublineText(item.solutionSummary);
    setBadges([
      `1. ${item.type === 'pain_point' ? 'PAIN' : 'BACKLOG'} #${item.rank}`,
      `2. SCORE ${item.score}`,
      `3. ${item.category.split('|')[0]?.trim().toUpperCase().slice(0, 10)}`,
    ]);

    updateSettings({
      bannerHook: item.recommendedSetup.bannerHook,
      aspectRatio: item.recommendedSetup.aspectRatio,
    });

    useChartStore.setState({ duration: item.recommendedSetup.duration || 10 });
    setCurrentTime(0);
    setIsPlaying(true);
    onClose();
  };

  const handleApplyAndExport = (item: AzzamPainPointItem) => {
    handleApplyBrief(item);
    onSelectAndExport();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#0D1117] border border-[#21262D] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-[#21262D] flex items-center justify-between bg-[#161B22]/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Azzam Ops Live Intelligence Hub</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  dashboard.azzamedu.com/ops
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Đấu nối trực tiếp Top Pain Points & Content Backlog đã được duyệt sang video nến XAUUSD
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#21262D] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 py-3 border-b border-[#21262D] flex items-center gap-2 bg-[#0A0D12]">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              activeTab === 'all'
                ? 'bg-sky-500 text-black shadow'
                : 'text-slate-400 hover:text-white hover:bg-[#161B22]'
            }`}
          >
            Tất cả ({AZZAM_OPS_ITEMS.length})
          </button>
          <button
            onClick={() => setActiveTab('pain_point')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'pain_point'
                ? 'bg-amber-500 text-black shadow'
                : 'text-slate-400 hover:text-white hover:bg-[#161B22]'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-amber-400" /> Top Pain Point (Alan duyệt)
          </button>
          <button
            onClick={() => setActiveTab('backlog')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'backlog'
                ? 'bg-emerald-500 text-black shadow'
                : 'text-slate-400 hover:text-white hover:bg-[#161B22]'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Content Backlog (Dựng ngay)
          </button>
        </div>

        {/* Items List */}
        <div className="p-6 overflow-y-auto flex flex-col gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#161B22] border border-[#30363D] hover:border-sky-500/50 transition-all rounded-xl p-5 flex flex-col gap-3.5 shadow-md"
            >
              {/* Row 1: Badges & Scores */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    {item.type === 'pain_point' ? `Pain Point #${item.rank}` : `Backlog Short #${item.rank}`}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Nhóm: <span className="text-slate-200">{item.category}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-[11px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Impact Score: {item.score}
                  </span>
                </div>
              </div>

              {/* Row 2: Hook Title & Real Audience Quote */}
              <div className="flex flex-col gap-1.5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-amber-400">🔥</span> {item.hookTitle}
                </h3>
                <div className="bg-[#0D1117] p-2.5 rounded-lg border border-[#21262D] text-xs text-slate-300 italic flex items-start gap-2">
                  <MessageSquareQuote className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <span>&quot;{item.painQuote}&quot;</span>
                </div>
              </div>

              {/* Row 3: Solution & Setup Mapping */}
              <div className="flex flex-col gap-1 text-xs text-slate-400">
                <div>
                  <span className="text-slate-300 font-semibold">Giải pháp Video:</span> {item.solutionSummary}
                </div>
                <div className="text-emerald-400 font-medium">
                  <span className="text-slate-400">CTA Kêu gọi:</span> {item.ctaText}
                </div>
              </div>

              {/* Row 4: Actions */}
              <div className="flex items-center justify-between border-t border-[#21262D] pt-3 mt-1">
                <div className="text-[11px] text-slate-400 font-mono">
                  Mã Vàng: <span className="text-amber-300 font-bold">XAUUSD ~4,129.09</span> • Khung 9:16 (Shorts)
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => handleApplyBrief(item)}
                    className="px-3 py-1.5 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-slate-200 text-xs font-semibold border border-[#30363D] transition"
                  >
                    Xem & Tùy biến Nến
                  </button>
                  <button
                    onClick={() => handleApplyAndExport(item)}
                    className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-sky-500/20 transition"
                  >
                    <Video className="w-3.5 h-3.5" /> Xuất Video Ngay
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
