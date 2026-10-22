'use client';

import React, { useState } from 'react';
import { useChartStore } from '../store/useChartStore';
import { Header } from '../components/Header';
import { ToolRail } from '../components/ToolRail';
import { TemplateSidebar } from '../components/TemplateSidebar';
import { ControlsPanel } from '../components/ControlsPanel';
import { TextTypographyPanel } from '../components/TextTypographyPanel';
import { StageCanvas } from '../components/StageCanvas';
import { ChartCanvas } from '../components/ChartCanvas';
import { NleTimeline } from '../components/NleTimeline';
import { ExportModal } from '../components/ExportModal';
import { Sparkles, BarChart2, Layout, Zap } from 'lucide-react';

export default function Home() {
  const { activeTool, stageTheme, setStageTheme, setIsHermesChatOpen } = useChartStore();
  const [viewMode, setViewMode] = useState<'stage' | 'chart'>('stage');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  return (
    <main className="flex flex-col h-screen w-screen bg-[#070A11] text-slate-100 select-none overflow-hidden">
      {/* Top Navbar */}
      <Header />

      {/* Main Studio Middle Area: ToolRail + Sidebar Drawer + Stage Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Leftmost Vertical Tool Rail (5 Tools) */}
        <ToolRail />

        {/* Secondary Drawer: Template Library (2-column grid) OR Text Studio OR OHLC Controls Panel */}
        <aside className="h-full flex-shrink-0">
          {activeTool === 'templates' ? (
            <TemplateSidebar />
          ) : activeTool === 'text' ? (
            <TextTypographyPanel />
          ) : (
            <ControlsPanel />
          )}
        </aside>

        {/* Center Canvas Studio Stage */}
        <section className="flex-1 h-full flex flex-col items-center justify-between overflow-hidden relative bg-[#090D16]">
          {/* Top View Mode Switcher: Stage Headline vs Technical Chart */}
          <div className="w-full h-11 px-6 bg-[#0B0F19] border-b border-[#1E293B] flex items-center justify-between flex-shrink-0 z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                VIEWPORT:
              </span>
              <div className="flex items-center bg-[#121927] p-1 rounded-xl border border-[#1E293B]">
                <button
                  onClick={() => setViewMode('stage')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                    viewMode === 'stage'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layout className="w-3.5 h-3.5" />
                  <span>Stage (Sweep & Headline)</span>
                </button>
                <button
                  onClick={() => setViewMode('chart')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                    viewMode === 'chart'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>Interactive OHLC Chart</span>
                </button>
              </div>
            </div>

            {/* Quick Status Tag */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Full NLE Editor Active</span>
            </div>
          </div>

          {/* Central Workspace Content */}
          <div className="flex-1 w-full h-full flex items-center justify-center p-4 overflow-hidden">
            {viewMode === 'stage' ? <StageCanvas /> : <ChartCanvas />}
          </div>
        </section>
      </div>

      {/* Bottom Multi-Track NLE Timeline Scrubber */}
      <NleTimeline onOpenExport={() => setIsExportModalOpen(true)} />

      {/* Floating Hermes Copilot Trigger Pill */}
      <button
        onClick={() => setIsHermesChatOpen(true)}
        className="fixed bottom-24 right-6 z-40 px-3.5 py-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold text-xs rounded-full shadow-2xl shadow-amber-500/30 flex items-center gap-2 border border-amber-300 transition-all hover:scale-105 active:scale-95"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
        </span>
        <Zap className="w-3.5 h-3.5 fill-current" />
        <span>Chat Với Hermes</span>
      </button>

      {/* Export Video Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </main>
  );
}
