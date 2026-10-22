'use client';

import React, { useRef, useEffect } from 'react';
import { useChartStore } from '../store/useChartStore';
import { Play, Pause, SkipBack, SkipForward, Download, Monitor, Smartphone, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';

interface NleTimelineProps {
  onOpenExport: () => void;
}

export const NleTimeline: React.FC<NleTimelineProps> = ({ onOpenExport }) => {
  const {
    currentTime,
    duration,
    isPlaying,
    setCurrentTime,
    setIsPlaying,
    settings,
    updateSettings,
    headlineText,
    sublineText,
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

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const newTime = (x / rect.width) * duration;
    setCurrentTime(Math.round(newTime * 100) / 100);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Format time as 0:26.26
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = (sec % 60).toFixed(2);
    return `${mins}:${Number(remainder) < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="h-44 bg-[#090D16] border-t border-[#1E293B] flex flex-col text-slate-200 select-none z-30 flex-shrink-0">
      {/* Top Transport & Action Controls Bar */}
      <div className="h-10 px-6 bg-[#0D121F] border-b border-[#1E293B] flex items-center justify-between">
        {/* Playback Transport */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTime(Math.max(0, currentTime - 1))}
            className="p-1 text-slate-400 hover:text-white transition"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              if (currentTime >= duration) setCurrentTime(0);
              setIsPlaying(!isPlaying);
            }}
            className="w-7 h-7 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white transition shadow-md shadow-indigo-600/30"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={() => setCurrentTime(Math.min(duration, currentTime + 1))}
            className="p-1 text-slate-400 hover:text-white transition"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Timecode 0:26.26 / 0:52.26 */}
          <div className="text-xs font-mono font-bold tracking-wider text-slate-300 ml-2">
            <span className="text-white">{formatTime(currentTime)}</span>
            <span className="text-slate-500"> / {formatTime(duration)}</span>
          </div>
        </div>

        {/* Right Side: Aspect Ratio & Glowing Purple EXPORT Button */}
        <div className="flex items-center gap-3">
          {/* Aspect Ratio Switcher */}
          <div className="flex items-center gap-1 bg-[#121927] p-0.5 rounded-lg border border-[#1E293B]">
            <button
              onClick={() => updateSettings({ aspectRatio: '9:16' })}
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 transition ${
                settings.aspectRatio === '9:16'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>9:16</span>
            </button>
            <button
              onClick={() => updateSettings({ aspectRatio: '16:9' })}
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 transition ${
                settings.aspectRatio === '16:9'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3 h-3" />
              <span>16:9</span>
            </button>
          </div>

          {/* EXPORT Button (Matching the purple glowing pill in screenshot) */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white text-xs font-black tracking-wider shadow-lg shadow-purple-600/30 border border-purple-400/40 transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>EXPORT</span>
            <span className="text-[9px] bg-purple-900/60 text-purple-200 px-1 py-0.2 rounded font-mono">
              PRO
            </span>
          </button>
        </div>
      </div>

      {/* Multi-Track Sequencer Container */}
      <div className="flex-1 flex flex-col px-6 py-2 overflow-hidden relative">
        {/* Time Ruler (10s, 20s, 30s, 40s, 50s, 1m) */}
        <div
          onClick={handleSeek}
          className="relative h-5 cursor-pointer flex justify-between text-[10px] font-mono text-slate-500 border-b border-[#1E293B]/70 select-none"
        >
          {['0s', '10s', '20s', '30s', '40s', '50s', '1m'].map((m, i) => (
            <span key={m} className="flex flex-col items-center">
              <span>{m}</span>
              <span className="w-[1px] h-1.5 bg-slate-700 mt-0.5" />
            </span>
          ))}

          {/* Playhead Scrubbing Pin */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-indigo-400 z-30 pointer-events-none"
            style={{ left: `${progressPercent}%` }}
          >
            <div className="w-3 h-3 bg-indigo-500 rounded-full -ml-[5px] -mt-0.5 border border-white shadow-md shadow-indigo-500/80" />
          </div>
        </div>

        {/* Tracks Sequencer Rows */}
        <div
          onClick={handleSeek}
          className="flex-1 flex flex-col justify-center gap-1.5 relative cursor-pointer pt-1"
        >
          {/* Vertical Playhead Cursor Line Spanning Across All Tracks */}
          <div
            className="absolute top-0 bottom-0 w-[1.5px] bg-indigo-400/90 z-20 pointer-events-none shadow-[0_0_8px_#818CF8]"
            style={{ left: `${progressPercent}%` }}
          />

          {/* Row 1: Headline Track (Txt #1) */}
          <div className="relative h-6 bg-[#121927] rounded-md border border-[#1E293B] overflow-hidden flex items-center">
            <div
              className="absolute h-full rounded bg-gradient-to-r from-sky-600/70 to-blue-600/70 border border-sky-400/50 flex items-center px-2 text-[10px] font-bold text-white shadow-sm truncate"
              style={{ left: '15%', width: '65%' }}
            >
              <span>Txt #1: {headlineText || 'YOU STOP WATCHING THE SWEEP'}</span>
            </div>
          </div>

          {/* Row 2: Subline Track */}
          <div className="relative h-6 bg-[#121927] rounded-md border border-[#1E293B] overflow-hidden flex items-center">
            <div
              className="absolute h-full rounded bg-gradient-to-r from-teal-600/70 to-emerald-600/70 border border-teal-400/50 flex items-center px-2 text-[10px] font-bold text-white shadow-sm truncate"
              style={{ left: '30%', width: '55%' }}
            >
              <span>Subtext: {sublineText || 'It’s Not A Tell Problem'}</span>
            </div>
          </div>

          {/* Row 3: Candlestick Sweep Animation Graphic Track */}
          <div className="relative h-6 bg-[#121927] rounded-md border border-[#1E293B] overflow-hidden flex items-center">
            <div
              className="absolute h-full rounded bg-gradient-to-r from-indigo-600/70 to-purple-600/70 border border-indigo-400/50 flex items-center px-2 text-[10px] font-bold text-white shadow-sm truncate"
              style={{ left: '20%', width: '70%' }}
            >
              <span>Chart: Candlestick Liquidity Sweep Animation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
