'use client';

import React from 'react';
import { useChartStore } from '../store/useChartStore';
import { Play, Pause, RotateCcw, FastForward, Clock, Layers, Sparkles, Sliders } from 'lucide-react';

export const InteractiveTimeline: React.FC = () => {
  const {
    candles,
    overlays,
    settings,
    currentTime,
    duration,
    isPlaying,
    revealAnimation,
    setCurrentTime,
    setIsPlaying,
    setRevealAnimation,
    updateSettings,
    resetChart,
  } = useChartStore();

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const newTime = (x / rect.width) * duration;
    setCurrentTime(Math.round(newTime * 100) / 100);
    setIsPlaying(false);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const currentRevealedCandles =
    duration > 0 ? Math.min(candles.length, Math.ceil((currentTime / duration) * candles.length)) : candles.length;

  return (
    <div className="w-full h-full flex flex-col bg-[#0B0F19] p-6 text-slate-200 select-none overflow-y-auto">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between pb-5 border-b border-[#1E293B]/80 mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (currentTime >= duration) setCurrentTime(0);
              setIsPlaying(!isPlaying);
            }}
            className="w-11 h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 flex items-center justify-center text-white font-bold transition shadow-lg shadow-indigo-600/25"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => {
              setCurrentTime(0);
              setIsPlaying(false);
            }}
            title="Reset to 0s"
            className="p-2.5 rounded-xl bg-[#131B2A] hover:bg-[#1E293B] border border-[#1E293B] text-slate-300 hover:text-white transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="flex flex-col ml-1">
            <div className="text-sm font-mono font-bold text-white tracking-wider">
              {currentTime.toFixed(2)}s <span className="text-slate-500 text-xs">/ {duration.toFixed(2)}s</span>
            </div>
            <div className="text-[11px] text-indigo-400 font-medium">
              Revealed: {currentRevealedCandles} of {candles.length} Candles ({Math.round(progressPercent)}%)
            </div>
          </div>
        </div>

        {/* Video Duration Presets & Speed Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#121826] border border-[#1E293B] px-3 py-1.5 rounded-xl">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-300 font-medium mr-1">Duration:</span>
            {[5, 8, 12, 20].map((d) => (
              <button
                key={d}
                onClick={() => {
                  useChartStore.setState({ duration: d });
                  if (currentTime > d) setCurrentTime(d);
                }}
                className={`text-[11px] font-mono px-2 py-0.5 rounded transition ${
                  duration === d
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-[#1E293B]'
                }`}
              >
                {d}s
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-[#121826] border border-[#1E293B] px-3 py-1.5 rounded-xl">
            <span className="text-xs text-slate-300 font-medium">Reveal Speed:</span>
            <input
              type="range"
              min="0.2"
              max="1.5"
              step="0.1"
              value={settings.revealSpeed}
              onChange={(e) => updateSettings({ revealSpeed: Number(e.target.value) })}
              className="w-20 accent-indigo-500 h-1.5 bg-[#1E293B] rounded cursor-pointer"
            />
            <span className="text-[11px] font-mono text-indigo-400 font-bold">{settings.revealSpeed}s/c</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Timeline Scrubber Ruler */}
      <div className="relative mb-6">
        <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-2 px-1">
          {Array.from({ length: 9 }).map((_, i) => {
            const t = (i * (duration / 8)).toFixed(1);
            return (
              <span key={i} className="flex flex-col items-center">
                <span>{t}s</span>
                <span className="h-1.5 w-[1px] bg-slate-700 mt-1"></span>
              </span>
            );
          })}
        </div>

        {/* Scrubber Track */}
        <div
          onClick={handleSeek}
          className="relative h-8 bg-[#101725] rounded-xl border border-[#1E293B] cursor-pointer overflow-hidden group shadow-inner"
        >
          {/* Progress fill */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-indigo-600/40 via-purple-600/40 to-indigo-500/50"
            style={{ width: `${progressPercent}%` }}
          />

          {/* Keyframe tick marks */}
          {candles.map((c, idx) => {
            const candleProgress = ((idx + 1) / candles.length) * 100;
            const isRevealed = (idx + 1) <= currentRevealedCandles;
            return (
              <div
                key={c.id}
                style={{ left: `${candleProgress}%` }}
                className={`absolute top-0 bottom-0 w-[1px] ${
                  isRevealed ? 'bg-indigo-400/80 shadow-[0_0_4px_#818CF8]' : 'bg-[#1E293B]'
                }`}
              />
            );
          })}

          {/* Playhead Pin */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] z-20 pointer-events-none"
            style={{ left: `${progressPercent}%` }}
          >
            <div className="absolute -top-1 -left-1.5 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-indigo-600 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Visual Multi-Track Sequence Editor */}
      <div className="flex-1 flex flex-col gap-3 min-h-[160px]">
        {/* Track 1: Candles Stream */}
        <div className="bg-[#0E1422] rounded-xl p-3 border border-[#1E293B]">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Candlestick Sequence ({candles.length} Items)</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Click any candle to jump playhead</span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-[#1E293B]">
            {candles.length === 0 ? (
              <div className="text-xs text-slate-500 py-4 text-center w-full">
                No candles yet. Switch to Canvas or use the Left OHLC Controls to add candles.
              </div>
            ) : (
              candles.map((candle, idx) => {
                const isBullish = candle.close >= candle.open;
                const isRevealed = idx < currentRevealedCandles;
                const candleTime = ((idx + 1) / candles.length) * duration;

                return (
                  <button
                    key={candle.id}
                    onClick={() => {
                      setCurrentTime(candleTime);
                      setIsPlaying(false);
                    }}
                    className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg border text-left transition-all ${
                      isRevealed
                        ? isBullish
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 shadow-sm'
                          : 'bg-rose-950/40 border-rose-500/50 text-rose-300 shadow-sm'
                        : 'bg-[#121927] border-[#1E293B] text-slate-500 opacity-60'
                    }`}
                  >
                    <div className="text-[10px] font-mono font-bold flex items-center justify-between gap-2">
                      <span>C#{idx + 1}</span>
                      <span>{candleTime.toFixed(1)}s</span>
                    </div>
                    <div className="text-[11px] font-mono font-semibold mt-0.5">
                      ${candle.close.toFixed(1)}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Track 2: Overlays (FVG, Liquidity Line, Order Block) */}
        <div className="bg-[#0E1422] rounded-xl p-3 border border-[#1E293B]">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>SMC Technical Overlays ({overlays.length} Layers)</span>
            </div>
            <span className="text-[10px] text-slate-500">Active Fair Value Gaps, Liquidity Lines & Zones</span>
          </div>

          <div className="flex flex-col gap-1.5">
            {overlays.length === 0 ? (
              <div className="text-xs text-slate-500 py-2">No overlays attached.</div>
            ) : (
              overlays.map((ov) => (
                <div
                  key={ov.id}
                  className="flex items-center justify-between px-3 py-1.5 bg-[#121927] rounded-lg border border-[#1E293B] text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: ov.color || '#6366F1' }}
                    />
                    <span className="font-semibold text-slate-200">{ov.label || ov.type}</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">
                    Candle #{ov.startCandleIndex + 1} $\rightarrow$ #{ov.endCandleIndex + 1}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Track 3: English Hook Banner Banner */}
        <div className="bg-[#0E1422] rounded-xl p-3 border border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-semibold text-slate-300">English Hook Banner:</span>
            <span className="text-xs text-amber-300 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
              {settings.bannerHook || 'No hook set'}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Persistent Header Layer</span>
        </div>
      </div>
    </div>
  );
};
