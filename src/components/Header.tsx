'use client';

import React from 'react';
import { useChartStore } from '../store/useChartStore';
import { AspectRatio } from '../types/chart';
import { Download, Monitor, Smartphone, Square, Sparkles, Eye } from 'lucide-react';

export const Header: React.FC = () => {
  const { settings, updateSettings, candles } = useChartStore();

  const handleExportPNG = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `chartanimator-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <header className="h-14 bg-[#0B0E14] border-b border-[#1E293B] px-6 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-cyan-400 flex items-center justify-center font-black text-white text-base shadow-lg shadow-primary/25">
          CA
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
            ChartAnimator <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-primary/20 text-primary">Studio</span>
          </h1>
          <p className="text-[10px] text-slate-400">Clean-Room Animated Trading Video Maker</p>
        </div>
      </div>

      {/* Aspect Ratio Switcher (YouTube 16:9 vs TikTok/Shorts 9:16) */}
      <div className="flex items-center bg-[#131A26] p-1 rounded-lg border border-[#1E293B]">
        <button
          onClick={() => updateSettings({ aspectRatio: '16:9' })}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition ${
            settings.aspectRatio === '16:9' ? 'bg-primary text-white font-medium shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" /> 16:9 (YouTube)
        </button>
        <button
          onClick={() => updateSettings({ aspectRatio: '9:16' })}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition ${
            settings.aspectRatio === '9:16' ? 'bg-primary text-white font-medium shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" /> 9:16 (Shorts/TikTok)
        </button>
        <button
          onClick={() => updateSettings({ aspectRatio: '1:1' })}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition ${
            settings.aspectRatio === '1:1' ? 'bg-primary text-white font-medium shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Square className="w-3.5 h-3.5" /> 1:1 (Post)
        </button>
      </div>

      {/* Spotlight toggle & Export button */}
      <div className="flex items-center gap-3">
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
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white rounded-lg font-medium text-xs shadow-lg shadow-primary/20 transition"
        >
          <Download className="w-3.5 h-3.5" /> Export Frame
        </button>
      </div>
    </header>
  );
};
