'use client';

import React, { useEffect, useRef } from 'react';
import { useChartStore } from '../store/useChartStore';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';

export const TimelinePlayer: React.FC = () => {
  const {
    currentTime,
    duration,
    isPlaying,
    revealMode,
    setCurrentTime,
    setIsPlaying,
    setRevealMode,
    resetChart,
    candles,
  } = useChartStore();

  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Animation Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const loop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaSec = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      const nextTime = currentTime + deltaSec;
      if (nextTime >= duration) {
        setCurrentTime(duration);
        setIsPlaying(false);
      } else {
        setCurrentTime(nextTime);
        animationFrameRef.current = requestAnimationFrame(loop);
      }
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, currentTime, duration, setCurrentTime, setIsPlaying]);

  return (
    <div className="h-20 bg-[#0F141C] border-t border-[#1E293B] px-6 flex items-center justify-between text-slate-200">
      {/* Play / Reset Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (currentTime >= duration) setCurrentTime(0);
            setIsPlaying(!isPlaying);
          }}
          className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center text-white transition shadow-lg shadow-primary/20"
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        <button
          onClick={resetChart}
          title="Reset to 0s"
          className="p-2 rounded-lg hover:bg-[#1E293B] text-slate-400 hover:text-white transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="text-xs font-mono text-slate-400">
          <span className="text-white font-bold">{currentTime.toFixed(1)}s</span> / {duration.toFixed(1)}s
        </div>
      </div>

      {/* Main Timeline Scrubber Bar */}
      <div className="flex-1 mx-8 flex flex-col gap-1.5">
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>0.0s (Start)</span>
          <span className="text-primary font-semibold">
            {Math.round((currentTime / duration) * 100)}% ({Math.ceil((currentTime / duration) * candles.length)}/
            {candles.length} Candles)
          </span>
          <span>{duration.toFixed(1)}s (End)</span>
        </div>
        <input
          type="range"
          min="0"
          max={duration}
          step="0.05"
          value={currentTime}
          onChange={(e) => {
            setIsPlaying(false);
            setCurrentTime(Number(e.target.value));
          }}
          className="w-full accent-primary h-2 bg-[#1E293B] rounded-lg cursor-pointer"
        />
      </div>

      {/* Reveal Mode Presets */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <FastForward className="w-3.5 h-3.5 text-primary" /> Reveal Mode:
        </span>
        <select
          value={revealMode}
          onChange={(e) => setRevealMode(e.target.value as any)}
          className="bg-[#131A26] border border-[#1E293B] text-xs rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-primary"
        >
          <option value="sequential">Sequential Reveal</option>
          <option value="wick-then-body">Wick-First Reveal</option>
          <option value="brownian">Brownian Walk</option>
          <option value="instant">Instant (Static)</option>
        </select>
      </div>
    </div>
  );
};
