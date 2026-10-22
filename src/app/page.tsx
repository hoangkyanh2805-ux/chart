'use client';

import React from 'react';
import { Header } from '../components/Header';
import { BuilderModeBar } from '../components/BuilderModeBar';
import { ChartCanvas } from '../components/ChartCanvas';
import { ControlsPanel } from '../components/ControlsPanel';
import { TimelinePlayer } from '../components/TimelinePlayer';

export default function Home() {
  return (
    <main className="flex flex-col h-screen w-screen bg-[#0B0F19] text-slate-100 select-none overflow-hidden">
      {/* Top Navbar */}
      <Header />

      {/* Top Builder Mode Switcher: Single Candle ★ Free | Group Candle ★ Pro | ZigZag Candle ★ Creator */}
      <BuilderModeBar />

      {/* Main Studio Workspace: Left Controls + Right Canvas & Timeline */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: OHLC Controls, Gap, Width, Wick Size, Animations */}
        <aside className="h-full flex-shrink-0">
          <ControlsPanel />
        </aside>

        {/* Center / Right Side: Canvas Viewport with LIMIT guides & Interactive Timeline */}
        <section className="flex-1 h-full p-4 flex flex-col justify-center items-center overflow-hidden">
          <ChartCanvas />
        </section>
      </div>

      {/* Bottom Quick Playhead Scrubber */}
      <TimelinePlayer />
    </main>
  );
}
