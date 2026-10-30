'use client';

import React, { useState } from 'react';
import { useChartStore } from '../store/useChartStore';
import { Header } from '../components/Header';
import { ToolRail } from '../components/ToolRail';
import { TemplateSidebar } from '../components/TemplateSidebar';
import { ControlsPanel } from '../components/ControlsPanel';
import { TextTypographyPanel } from '../components/TextTypographyPanel';
import { AuditorPanel } from '../components/AuditorPanel';
import { HermesSidebarPanel } from '../components/HermesSidebarPanel';
import { ScriptSetupPanel } from '../components/ScriptSetupPanel';
import { StageCanvas } from '../components/StageCanvas';
import { ChartCanvas } from '../components/ChartCanvas';
import { NleTimeline } from '../components/NleTimeline';
import { ExportModal } from '../components/ExportModal';
import { useAudioPlaybackSync } from '../utils/audioSync';
import { Sparkles, BarChart2, Layout, Zap, Radio } from 'lucide-react';

export default function Home() {
  useAudioPlaybackSync();
  const {
    activeTool,
    setActiveTool,
    stageTheme,
    setStageTheme,
    setIsHermesChatOpen,
    loadTemplate,
    activeScriptMeta,
  } = useChartStore();
  const [viewMode, setViewMode] = useState<'stage' | 'chart'>('stage');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isLoadingMarket, setIsLoadingMarket] = useState<boolean>(false);

  const handleLoadHexagold = () => {
    // Import first template (Hexagold Asia Sweep)
    const { TEMPLATES } = require('../data/templates');
    if (TEMPLATES && TEMPLATES[0]) {
      loadTemplate(TEMPLATES[0]);
      setViewMode('stage');
    }
  };

  const handleLoadLiveMarketCaseStudy = async () => {
    setIsLoadingMarket(true);
    try {
      const res = await fetch('/api/market/gold');
      const data = await res.json();
      if (data.success && data.caseStudy) {
        loadTemplate({
          id: `case-study-${Date.now()}`,
          title: data.caseStudy.headlineText,
          strategy: 'Price Action',
          tier: 'Creator',
          aspectRatio: '9:16',
          duration: 6.0,
          revealMode: 'sequential',
          description: data.caseStudy.sublineText,
          headlineText: data.caseStudy.headlineText,
          sublineText: data.caseStudy.sublineText,
          badges: data.caseStudy.badges,
          showCalloutPin: true,
          calloutPinText: data.caseStudy.calloutPinText,
          calloutCandleIndex: data.caseStudy.calloutCandleIndex,
          showPipCounter: true,
          targetPips: data.caseStudy.targetPips,
          showExecutionBadge: true,
          executionOrder: data.caseStudy.executionOrder,
          scriptSubtitles: data.caseStudy.scriptSubtitles,
          candles: data.caseStudy.candles,
          overlays: data.caseStudy.overlays,
          spotlightEnabled: true,
        });
        useChartStore.getState().updateSettings({ symbol: 'XAUUSD (REAL SPOT)' });
        setViewMode('stage');
      }
    } catch (e) {
      console.error('Failed to load market data', e);
    } finally {
      setIsLoadingMarket(false);
    }
  };

  return (
    <main className="flex flex-col h-screen w-screen bg-[#070A11] text-slate-100 select-none overflow-hidden">
      {/* Top Navbar */}
      <Header />

      {/* Main Studio Middle Area: ToolRail + Sidebar Drawer + Stage Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Leftmost Vertical Tool Rail (5 Tools) */}
        <ToolRail />

        {/* Secondary Drawer: Template Library OR Text Studio OR Auditor Panel OR Hermes Copilot OR Script Inspector OR Controls */}
        <aside className="h-full flex-shrink-0">
          {activeTool === 'templates' ? (
            <TemplateSidebar />
          ) : activeTool === 'script' ? (
            <ScriptSetupPanel onOpenExport={() => setIsExportModalOpen(true)} />
          ) : activeTool === 'text' ? (
            <TextTypographyPanel />
          ) : activeTool === 'audit' ? (
            <AuditorPanel />
          ) : activeTool === 'hermes' ? (
            <HermesSidebarPanel />
          ) : (
            <ControlsPanel />
          )}
        </aside>

        {/* Center Canvas Studio Stage */}
        <section className="flex-1 h-full flex flex-col items-center justify-between overflow-hidden relative bg-[#090D16]">
          {/* Top View Mode Switcher: Stage Headline vs Technical Chart */}
          <div className="w-full h-11 px-6 bg-[#0B0F19] border-b border-[#1E293B] flex items-center justify-between flex-shrink-0 z-10">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                CHẾ ĐỘ STUDIO:
              </span>
              <div className="flex items-center bg-[#121927] p-1 rounded-xl border border-[#1E293B]">
                <button
                  onClick={() => setViewMode('stage')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                    viewMode === 'stage'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layout className="w-3.5 h-3.5" />
                  <span>📱 TikTok / Shorts 9:16</span>
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
                  <span>📊 Wide OHLC Chart</span>
                </button>
              </div>

              {/* 1-Click Load Hexagold TikTok Setup */}
              <button
                onClick={handleLoadHexagold}
                title="Tải mẫu video Vàng TikTok chuẩn Hexagold (Hook + Nến Quét Đỉnh + FVG + Subtitles)"
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-extrabold transition shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Mẫu Hexagold</span>
              </button>

              {/* 1-Click Load Live Real-Market Case Study */}
              <button
                onClick={handleLoadLiveMarketCaseStudy}
                disabled={isLoadingMarket}
                title="Lấy 10 nến M15 Vàng thực tế vừa diễn ra hôm nay làm Case Study video bài học"
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 text-xs font-extrabold transition shadow-sm active:scale-95"
              >
                <Radio className={`w-3.5 h-3.5 text-rose-400 ${isLoadingMarket ? 'animate-spin' : 'animate-pulse'}`} />
                <span>{isLoadingMarket ? 'Đang Lấy Nến Thật...' : '🔴 Nạp Nến Vàng Hôm Nay (Case Study)'}</span>
              </button>
            </div>

            {/* Quick Status Tag & Active Script Verification Badge */}
            {activeScriptMeta ? (
              <button
                onClick={() => setActiveTool('script')}
                title="Bấm để mở bảng Đối Soát Kịch Bản & Setup Nến"
                className="flex items-center gap-2 px-3 py-1 bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/40 hover:border-blue-400 rounded-lg text-xs transition cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
                <span className="text-blue-300 font-bold">🎬 KỊCH BẢN ĐANG DỰNG:</span>
                <span className="font-mono text-white font-bold">{activeScriptMeta.id}</span>
                <span className="text-emerald-400 font-bold bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px]">
                  ✓ KHỚP 100% SETUP (Bấm để xem)
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-emerald-400 font-bold">TikTok 9:16 Video Ready</span>
              </div>
            )}
          </div>

          {/* Central Workspace Content */}
          <div className="flex-1 w-full h-full flex items-center justify-center p-4 overflow-hidden">
            {viewMode === 'stage' ? <StageCanvas /> : <ChartCanvas />}
          </div>
        </section>
      </div>

      {/* Bottom Multi-Track NLE Timeline Scrubber */}
      <NleTimeline onOpenExport={() => setIsExportModalOpen(true)} />

      {/* Floating Hermes Copilot Trigger Pill (Toggles Docked Sidebar) */}
      <button
        onClick={() => setActiveTool(activeTool === 'hermes' ? 'templates' : 'hermes')}
        className={`fixed bottom-24 right-6 z-40 px-3.5 py-2 font-extrabold text-xs rounded-full shadow-2xl flex items-center gap-2 border transition-all hover:scale-105 active:scale-95 ${
          activeTool === 'hermes'
            ? 'bg-amber-400 text-slate-950 border-white shadow-amber-500/40'
            : 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black border-amber-300 shadow-amber-500/30'
        }`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
        </span>
        <Zap className="w-3.5 h-3.5 fill-current" />
        <span>{activeTool === 'hermes' ? 'Đóng Hermes' : 'Chat Với Hermes'}</span>
      </button>

      {/* Export Video Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </main>
  );
}
