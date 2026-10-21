'use client';

import React, { useState } from 'react';
import { useChartStore } from '../store/useChartStore';
import { AspectRatio } from '../types/chart';
import { Download, Monitor, Smartphone, Square, Eye, Video, LayoutTemplate, Flame } from 'lucide-react';
import { ExportModal } from './ExportModal';
import { TemplateModal } from './TemplateModal';
import { ChartTemplate } from '../data/templates';

export const Header: React.FC = () => {
  const { settings, updateSettings } = useChartStore();
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);

  const handleExportPNG = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `chart-frame-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleSelectAndExport = (template: ChartTemplate) => {
    // Open Export modal immediately after selecting template
    setIsExportModalOpen(true);
  };

  return (
    <>
      <header className="h-14 bg-[#0B0E14] border-b border-[#1E293B] px-6 flex items-center justify-between">
        {/* Brand & XAUUSD Asset Tag */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center font-black text-black text-sm shadow-lg shadow-amber-500/25">
            AU
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                XAUUSD <span className="text-amber-400 font-extrabold">GOLD</span>
              </h1>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                M15 FOREX
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Forex Gold Animated Breakdown Studio</p>
          </div>
        </div>

        {/* Center: Template Library button & Aspect Ratio Switcher */}
        <div className="flex items-center gap-3">
          {/* Templates Trigger Button */}
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#161F2E] hover:bg-[#1E293B] border border-primary/40 hover:border-primary text-slate-200 hover:text-white rounded-lg text-xs font-medium transition shadow-sm"
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-primary" />
            <span>Templates</span>
            <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              PRO
            </span>
          </button>

          {/* Aspect Ratio Switcher (YouTube 16:9 vs TikTok/Shorts 9:16) */}
          <div className="flex items-center bg-[#131A26] p-1 rounded-lg border border-[#1E293B]">
            <button
              onClick={() => updateSettings({ aspectRatio: '16:9' })}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition ${
                settings.aspectRatio === '16:9'
                  ? 'bg-primary text-white font-medium shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" /> 16:9
            </button>
            <button
              onClick={() => updateSettings({ aspectRatio: '9:16' })}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition ${
                settings.aspectRatio === '9:16'
                  ? 'bg-primary text-white font-medium shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> 9:16
            </button>
            <button
              onClick={() => updateSettings({ aspectRatio: '1:1' })}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition ${
                settings.aspectRatio === '1:1'
                  ? 'bg-primary text-white font-medium shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Square className="w-3.5 h-3.5" /> 1:1
            </button>
          </div>
        </div>

        {/* Actions: Spotlight, Export PNG, Export Video */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => updateSettings({ spotlightEnabled: !settings.spotlightEnabled })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition ${
              settings.spotlightEnabled
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'border-[#1E293B] text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Spotlight
          </button>

          <button
            onClick={handleExportPNG}
            title="Tải ảnh chụp khung hình hiện tại"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#161F2E] hover:bg-[#1E293B] border border-[#1E293B] text-slate-300 hover:text-white rounded-lg text-xs transition"
          >
            <Download className="w-3.5 h-3.5" /> Ảnh PNG
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white rounded-lg font-semibold text-xs shadow-lg shadow-primary/20 transition"
          >
            <Video className="w-3.5 h-3.5" /> Xuất Video
          </button>
        </div>
      </header>

      {/* Template Library Modal */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectAndExport={handleSelectAndExport}
      />

      {/* Video Export Modal */}
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
    </>
  );
};
