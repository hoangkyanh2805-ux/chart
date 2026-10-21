'use client';

import React from 'react';
import { Header } from '../components/Header';
import { ChartCanvas } from '../components/ChartCanvas';
import { ControlsPanel } from '../components/ControlsPanel';
import { TimelinePlayer } from '../components/TimelinePlayer';

export default function Home() {
  return (
    <main className="flex flex-col h-screen w-screen bg-[#0B0E14] text-slate-100 select-none">
      {/* Top Navbar */}
      <Header />

      {/* Main Studio Workspace: Center Canvas + Right Controls */}
      <div className="flex-1 flex overflow-hidden">
        <section className="flex-1 h-full p-4 flex flex-col justify-center items-center">
          <ChartCanvas />
        </section>

        <aside className="h-full">
          <ControlsPanel />
        </aside>
      </div>

      {/* Bottom Timeline Keyframe Player */}
      <TimelinePlayer />
    </main>
  );
}
