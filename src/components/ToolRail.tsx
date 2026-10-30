'use client';

import React from 'react';
import { useChartStore } from '../store/useChartStore';
import { LayoutGrid, Sliders, Type, Layers, Settings, Sun, Moon, Sparkles, ShieldCheck, Zap, Radio, FileText } from 'lucide-react';

export const ToolRail: React.FC = () => {
  const { activeTool, setActiveTool, stageTheme, setStageTheme, validationReport, setIsAzzamOpsOpen, activeScriptMeta } = useChartStore();

  const isAuditSafe = (validationReport?.isValid ?? true) && (validationReport?.score ?? 100) >= 80;

  const tools = [
    { id: 'hermes' as const, label: 'Hermes Copilot (Đạo Diễn AI)', icon: Zap, isHermes: true },
    { id: 'script' as const, label: 'Đối Soát Kịch Bản (Script Setup)', icon: FileText, isScript: true },
    { id: 'audit' as const, label: 'Kiểm Định (Auditor)', icon: ShieldCheck, isAudit: true },
    { id: 'templates' as const, label: 'Library', icon: LayoutGrid },
    { id: 'ohlc' as const, label: 'OHLC', icon: Sliders },
    { id: 'text' as const, label: 'Text', icon: Type },
    { id: 'elements' as const, label: 'SMC', icon: Layers },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-14 bg-[#090D16] border-r border-[#1E293B] flex flex-col items-center justify-between py-4 select-none flex-shrink-0 z-30">
      {/* Top Brand Pill */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-black text-white text-xs shadow-md shadow-indigo-500/30">
          CA
        </div>

        {/* Tool Icons */}
        <div className="flex flex-col gap-2 mt-2">
          {/* Quick Ops Dashboard Trigger */}
          <button
            onClick={() => setIsAzzamOpsOpen(true)}
            title="Azzam Ops & Live Dashboard (8 Điểm Mù, Content Package, 62 Kịch Bản)"
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all relative text-sky-400 hover:text-white hover:bg-sky-500/20 border border-sky-500/30 bg-sky-950/20"
          >
            <Radio className="w-5 h-5 text-sky-400 animate-pulse" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-sky-400 animate-ping" />
          </button>
          {tools.map((t) => {
            const Icon = t.icon;
            const isActive = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTool(t.id)}
                title={t.label}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative ${
                  isActive
                    ? t.isHermes
                      ? 'bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30'
                      : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold'
                    : t.isHermes
                      ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-[#131B2A]'
                }`}
              >
                <Icon className={`w-5 h-5 ${t.isAudit && !isAuditSafe ? 'text-amber-400 animate-pulse' : ''} ${t.isScript && activeScriptMeta ? 'text-blue-400' : ''}`} />
                {t.isAudit && (
                  <span
                    className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                      isAuditSafe ? 'bg-emerald-400' : 'bg-rose-500 animate-ping'
                    }`}
                  />
                )}
                {t.isHermes && !isActive && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
                {t.isScript && activeScriptMeta && !isActive && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Controls: Light/Dark Theme Switcher */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={() => setStageTheme(stageTheme === 'white' ? 'dark' : 'white')}
          title={stageTheme === 'white' ? 'Switch to Dark Canvas' : 'Switch to White Canvas'}
          className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
            stageTheme === 'white'
              ? 'bg-amber-400/10 border-amber-400/40 text-amber-300'
              : 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300'
          }`}
        >
          {stageTheme === 'white' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
