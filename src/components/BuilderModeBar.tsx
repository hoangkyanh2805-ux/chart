'use client';

import React from 'react';
import { useChartStore } from '../store/useChartStore';
import { Sparkles, Lock, Unlock } from 'lucide-react';

export const BuilderModeBar: React.FC = () => {
  const { builderMode, setBuilderMode } = useChartStore();

  return (
    <div className="flex items-center justify-center gap-3 py-3 bg-[#0B0F19] border-b border-[#1E293B]/60 select-none">
      {/* Single Candle Mode */}
      <button
        onClick={() => setBuilderMode('single')}
        className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
          builderMode === 'single'
            ? 'bg-emerald-950/40 border-2 border-emerald-500 text-emerald-300 shadow-emerald-500/10'
            : 'bg-[#121826] border border-[#1E293B] text-slate-400 hover:text-white hover:border-slate-600'
        }`}
      >
        <span>Single Candle</span>
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
            builderMode === 'single'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          ★ Free
        </span>
      </button>

      {/* Group Candle (Pro) */}
      <button
        onClick={() => setBuilderMode('group')}
        className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
          builderMode === 'group'
            ? 'bg-indigo-950/40 border-2 border-indigo-500 text-indigo-300 shadow-indigo-500/15'
            : 'bg-[#121826] border border-[#1E293B] text-slate-400 hover:text-white hover:border-slate-600'
        }`}
      >
        <span>Group Candle</span>
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 ${
            builderMode === 'group'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              : 'bg-purple-900/30 text-purple-300 border border-purple-800/40'
          }`}
        >
          ★ Pro
        </span>
        <Unlock className="w-3 h-3 text-indigo-400" />
      </button>

      {/* ZigZag Candle (Creator) */}
      <button
        onClick={() => setBuilderMode('zigzag')}
        className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
          builderMode === 'zigzag'
            ? 'bg-amber-950/40 border-2 border-amber-500 text-amber-300 shadow-amber-500/15'
            : 'bg-[#121826] border border-[#1E293B] text-slate-400 hover:text-white hover:border-slate-600'
        }`}
      >
        <span>ZigZag Candle</span>
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 ${
            builderMode === 'zigzag'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'bg-amber-900/30 text-amber-300 border border-amber-800/40'
          }`}
        >
          ★ Creator
        </span>
        <Unlock className="w-3 h-3 text-amber-400" />
      </button>
    </div>
  );
};
