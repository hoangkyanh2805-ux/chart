'use client';

import React, { useState } from 'react';
import { useChartStore } from '../store/useChartStore';
import { TEMPLATES, ChartTemplate } from '../data/templates';
import { LayoutTemplate, X, Sparkles, Monitor, Smartphone, ArrowRight, Video, Flame } from 'lucide-react';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAndExport: (template: ChartTemplate) => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectAndExport,
}) => {
  const { loadTemplate } = useChartStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const filteredTemplates =
    selectedCategory === 'All'
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.strategy.toLowerCase().includes(selectedCategory.toLowerCase()));

  const handleApply = (template: ChartTemplate) => {
    loadTemplate(template);
    onClose();
  };

  const handleApplyAndExport = (template: ChartTemplate) => {
    loadTemplate(template);
    onClose();
    onSelectAndExport(template);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#0F141C] border border-[#1E293B] rounded-2xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-[#1E293B] flex items-center justify-between bg-[#131A26]/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 text-white shadow-lg shadow-primary/25">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Thư Viện Template Chuẩn Pro</h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400 fill-current" /> ChartAnimator Pro
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Các mẫu thiết lập giao dịch có sẵn (SMC, ICT, Wyckoff) — Chọn mẫu là có thể render xuất video ngay
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1E293B] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Categories */}
        <div className="px-6 py-3 border-b border-[#1E293B] flex items-center gap-2 bg-[#0C1017]">
          {['All', 'SMC', 'ICT', 'Wyckoff', 'Elliott Wave'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-[#161F2E]'
              }`}
            >
              {cat === 'All' ? 'Tất cả Template' : cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-[#131A26] border border-[#1E293B] hover:border-primary/50 transition-all rounded-xl p-4 flex flex-col justify-between gap-3 shadow-lg group hover:shadow-primary/10"
            >
              {/* Card Header */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {template.strategy}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        template.tier === 'Creator'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : template.tier === 'Pro'
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {template.tier}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      {template.aspectRatio === '9:16' ? (
                        <>
                          <Smartphone className="w-3 h-3 text-primary" /> 9:16 (Shorts/TikTok)
                        </>
                      ) : (
                        <>
                          <Monitor className="w-3 h-3 text-sky-400" /> 16:9 (YouTube)
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-white text-sm group-hover:text-primary transition line-clamp-1">
                  {template.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{template.description}</p>
              </div>

              {/* Stats & Actions */}
              <div className="flex items-center justify-between border-t border-[#1E293B] pt-3 mt-1">
                <div className="text-[11px] text-slate-400 font-mono">
                  <span className="text-white font-semibold">{template.candles.length}</span> Nến •{' '}
                  <span className="text-white font-semibold">{template.overlays.length}</span> Vùng SMC
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApply(template)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#1C2638] hover:bg-[#25334D] text-slate-200 text-xs font-medium border border-[#1E293B] transition"
                  >
                    Mở chỉnh sửa
                  </button>
                  <button
                    onClick={() => handleApplyAndExport(template)}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-primary/20 transition"
                  >
                    <Video className="w-3.5 h-3.5" /> Xuất Video
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
