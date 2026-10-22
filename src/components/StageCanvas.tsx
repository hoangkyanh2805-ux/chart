'use client';

import React, { useRef, useEffect } from 'react';
import { useChartStore } from '../store/useChartStore';
import { priceToCanvasY, indexToCanvasX } from '../math/coordinates';

export const StageCanvas: React.FC = () => {
  const {
    stageTheme,
    headlineText,
    sublineText,
    setHeadlineText,
    setSublineText,
    candles,
    overlays,
    settings,
    currentTime,
    duration,
  } = useChartStore();

  const isWhite = stageTheme === 'white';
  const progress = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 1;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 select-none overflow-hidden">
      {/* Central Canvas Stage Box (Matching the white/dark canvas in screenshot) */}
      <div
        className={`relative transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden border flex flex-col items-center justify-between p-8 ${
          isWhite
            ? 'bg-white text-slate-900 border-slate-200 shadow-slate-300/40'
            : 'bg-[#0B0F19] text-white border-[#1E293B] shadow-indigo-950/20'
        } ${
          settings.aspectRatio === '9:16'
            ? 'w-[360px] h-[580px]'
            : settings.aspectRatio === '1:1'
            ? 'w-[520px] h-[520px]'
            : 'w-full max-w-[860px] h-[480px]'
        }`}
      >
        {/* Top Watermark / Symbol */}
        <div className="w-full flex items-center justify-between text-[11px] font-mono opacity-40 font-bold uppercase tracking-widest">
          <span>{settings.symbol || 'XAUUSD'} · GOLD SPOT</span>
          <span>LIQUIDITY SWEEP SETUP</span>
        </div>

        {/* Center Graphic: Liquidity Sweep Candlesticks Formation */}
        <div className="flex-1 flex flex-col items-center justify-center my-4 relative">
          <div className="relative flex items-end gap-3 h-48 w-64 justify-center">
            {/* Bullish Candle (Green) */}
            <div className="relative flex flex-col items-center">
              {/* Wick */}
              <div
                className={`w-[2.5px] h-32 absolute top-0 ${
                  isWhite ? 'bg-emerald-600' : 'bg-emerald-400'
                }`}
              />
              {/* Body */}
              <div
                className={`w-10 h-24 rounded-sm z-10 mt-5 transition-all shadow-md ${
                  isWhite ? 'bg-[#7BB38E] border border-emerald-700/30' : 'bg-emerald-500'
                }`}
              />
            </div>

            {/* Sweep & Rejection Candle (Black/Dark with High Wick Sweeping the Peak) */}
            <div className="relative flex flex-col items-center">
              {/* Sweep Wick (Reaches Higher Than Green Candle to Purge Liquidity!) */}
              <div
                className={`w-[3px] h-44 absolute -top-8 ${
                  isWhite ? 'bg-slate-900' : 'bg-rose-400'
                }`}
              >
                {/* Liquidity Sweep Tag */}
                <div
                  className={`absolute -top-6 -right-16 text-[9px] font-mono font-black px-1.5 py-0.5 rounded border whitespace-nowrap ${
                    isWhite
                      ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  ⚡ LIQUIDITY PURGED
                </div>
              </div>

              {/* Body (Rejection Down) */}
              <div
                className={`w-10 h-28 rounded-sm z-10 mt-12 transition-all shadow-md ${
                  isWhite ? 'bg-[#18181B] border border-black' : 'bg-rose-600'
                }`}
              />
            </div>

            {/* Horizontal Dashed Sweep Level Line */}
            <div
              className={`absolute top-4 left-6 right-6 h-[1px] border-t border-dashed z-20 ${
                isWhite ? 'border-slate-400' : 'border-indigo-400/60'
              }`}
            />
          </div>
        </div>

        {/* Bottom Headline & Subline Typography (Editable) */}
        <div className="w-full flex flex-col items-center text-center gap-2 mt-auto">
          {/* Main Headline */}
          <input
            type="text"
            value={headlineText}
            onChange={(e) => setHeadlineText(e.target.value)}
            className={`w-full text-center font-black tracking-tight text-xl md:text-2xl bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none transition uppercase ${
              isWhite ? 'text-black' : 'text-white'
            }`}
            placeholder="HEADLINE TEXT..."
          />

          {/* Subline */}
          <input
            type="text"
            value={sublineText}
            onChange={(e) => setSublineText(e.target.value)}
            className={`w-full text-center font-medium text-xs md:text-sm bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none transition ${
              isWhite ? 'text-slate-600' : 'text-slate-300'
            }`}
            placeholder="Subline text explaining the setup..."
          />
        </div>
      </div>
    </div>
  );
};
