'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useChartStore } from '../store/useChartStore';
import { Plus, Trash2, Wand2, Sliders, Type, Sparkles, Layers, Activity } from 'lucide-react';

interface VerticalSliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
}

const VerticalSlider: React.FC<VerticalSliderProps> = ({
  label,
  value,
  min = 0,
  max = 100,
  onChange,
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const calculateFromClientY = useCallback(
    (clientY: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const relativeY = clientY - rect.top;
      const clampedY = Math.max(0, Math.min(rect.height, relativeY));
      const percentage = 1 - clampedY / rect.height;
      const computedValue = Math.round(min + percentage * (max - min));
      onChange(computedValue);
    },
    [min, max, onChange]
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    calculateFromClientY(e.clientY);

    const onMouseMove = (moveEvent: MouseEvent) => {
      calculateFromClientY(moveEvent.clientY);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) return;
    calculateFromClientY(e.touches[0].clientY);

    const onTouchMove = (moveEvent: TouchEvent) => {
      if (moveEvent.touches.length > 0) {
        calculateFromClientY(moveEvent.touches[0].clientY);
      }
    };

    const onTouchEnd = () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };

    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
  };

  const percent = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className="flex flex-col items-center gap-1.5 select-none">
      <span className="text-[11px] font-medium text-slate-400">{label}</span>

      {/* Vertical Slider Track */}
      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="relative w-4 h-28 bg-[#182030] rounded-full cursor-pointer flex justify-center py-1 hover:bg-[#1C263A] transition border border-[#1E293B]"
      >
        {/* Track Fill */}
        <div
          className="absolute bottom-0 w-1.5 bg-indigo-500/60 rounded-full"
          style={{ height: `${percent}%` }}
        />

        {/* Glowing Thumb Handle */}
        <div
          className="absolute w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_8px_rgba(139,92,246,0.8)] border border-indigo-500 transition-transform -translate-y-1/2"
          style={{ bottom: `calc(${percent}% - 7px)` }}
        />
      </div>

      {/* Numerical Value */}
      <span className="text-xs font-mono font-bold text-slate-300">{value}</span>
    </div>
  );
};

export const ControlsPanel: React.FC = () => {
  const {
    candles,
    overlays,
    settings,
    builderMode,
    revealAnimation,
    addCandle,
    removeLastCandle,
    clearAllCandles,
    addGroupCandles,
    addZigZagLegs,
    updateSettings,
    setRevealAnimation,
    addOverlay,
  } = useChartStore();

  const [activeTab, setActiveTab] = useState<'ohlc' | 'text'>('ohlc');

  // 4 Vertical OHLC Slider Values (0-100 normalized matching screenshot)
  const [openVal, setOpenVal] = useState<number>(35);
  const [highVal, setHighVal] = useState<number>(80);
  const [lowVal, setLowVal] = useState<number>(20);
  const [closeVal, setCloseVal] = useState<number>(65);

  // Group Candle (Pro) State
  const [groupCount, setGroupCount] = useState<number>(5);
  const [groupDirection, setGroupDirection] = useState<'bullish' | 'bearish' | 'range'>('bullish');
  const [groupMomentum, setGroupMomentum] = useState<'high' | 'moderate' | 'grind'>('high');

  // ZigZag Candle (Creator) State
  const [leg1Price, setLeg1Price] = useState<number>(4148.0);
  const [leg2Price, setLeg2Price] = useState<number>(4132.0);
  const [leg3Price, setLeg3Price] = useState<number>(4162.0);

  // Auto-adjust constraints for OHLC
  const handleOpenChange = (val: number) => {
    setOpenVal(val);
    if (val > highVal) setHighVal(val);
    if (val < lowVal) setLowVal(val);
  };

  const handleCloseChange = (val: number) => {
    setCloseVal(val);
    if (val > highVal) setHighVal(val);
    if (val < lowVal) setLowVal(val);
  };

  const handleHighChange = (val: number) => {
    const minHigh = Math.max(openVal, closeVal);
    setHighVal(Math.max(minHigh, val));
  };

  const handleLowChange = (val: number) => {
    const maxLow = Math.min(openVal, closeVal);
    setLowVal(Math.min(maxLow, val));
  };

  // Convert 0-100 OHLC to actual XAUUSD Market Gold price ($4,129.00 range)
  const handleAddCandleToCanvas = () => {
    const lastPrice = candles.length > 0 ? candles[candles.length - 1].close : 4129.0;
    const priceScale = 0.15; // $0.15 per percentage point for realistic Gold volatility

    const deltaClose = (closeVal - openVal) * priceScale;
    const finalClose = Math.round((lastPrice + deltaClose) * 100) / 100;
    const bodyTop = Math.max(lastPrice, finalClose);
    const bodyBottom = Math.min(lastPrice, finalClose);

    const deltaHigh = Math.max(0.4, (highVal - Math.max(openVal, closeVal)) * priceScale);
    const deltaLow = Math.max(0.4, (Math.min(openVal, closeVal) - lowVal) * priceScale);

    const finalHigh = Math.round((bodyTop + deltaHigh) * 100) / 100;
    const finalLow = Math.round((bodyBottom - deltaLow) * 100) / 100;

    addCandle({
      open: lastPrice,
      high: finalHigh,
      low: finalLow,
      close: finalClose,
    });
  };

  const isBullish = closeVal >= openVal;
  const candleColor = isBullish ? settings.bullishColor : settings.bearishColor;

  return (
    <div className="w-[310px] bg-[#0B0F19] border-r border-[#1E293B] flex flex-col h-full text-slate-200 select-none overflow-y-auto">
      {/* Tab Switcher: OHLC Controls vs English Typography */}
      <div className="flex border-b border-[#1E293B] bg-[#0E1422] p-1.5 gap-1">
        <button
          onClick={() => setActiveTab('ohlc')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'ohlc'
              ? 'bg-[#182030] text-indigo-400 border border-indigo-500/30 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>OHLC Controls</span>
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'text'
              ? 'bg-[#182030] text-amber-400 border border-amber-500/30 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Text & Fonts (EN)</span>
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-4">
        {activeTab === 'ohlc' ? (
          <>
            {builderMode === 'single' && (
              <>
                {/* OHLC CONTROLS Card */}
                <div className="bg-[#101726] border border-[#1E293B] rounded-2xl p-4 shadow-lg">
                  <div className="mb-3">
                    <h2 className="text-xs font-bold tracking-wider text-slate-300 uppercase">
                      OHLC CONTROLS
                    </h2>
                    <p className="text-[10px] text-slate-500 mt-0.5">↕ Drag any slider to reshape</p>
                  </div>

                  {/* Sliders Container + Live Candle Preview */}
                  <div className="bg-[#0B0F19] rounded-xl p-3 border border-[#1E293B] flex items-center justify-between">
                    {/* 4 Vertical Sliders */}
                    <div className="flex items-center gap-2.5">
                      <VerticalSlider
                        label="Open"
                        value={openVal}
                        onChange={handleOpenChange}
                      />
                      <VerticalSlider
                        label="High"
                        value={highVal}
                        onChange={handleHighChange}
                      />
                      <VerticalSlider
                        label="Low"
                        value={lowVal}
                        onChange={handleLowChange}
                      />
                      <VerticalSlider
                        label="Close"
                        value={closeVal}
                        onChange={handleCloseChange}
                      />
                    </div>

                    {/* Live Candle Preview */}
                    <div className="flex flex-col items-center justify-center pl-3 border-l border-[#1E293B]/70">
                      <span className="text-[10px] text-slate-500 font-mono mb-1">Preview</span>
                      <div className="relative w-9 h-28 bg-[#131B2A] rounded-lg border border-[#1E293B] flex items-center justify-center overflow-hidden">
                        {/* Upper and Lower Wick */}
                        <div
                          className="absolute w-[2px] transition-all"
                          style={{
                            backgroundColor: candleColor,
                            top: `${100 - highVal}%`,
                            bottom: `${lowVal}%`,
                          }}
                        />

                        {/* Candle Body */}
                        <div
                          className="absolute w-5 rounded-sm transition-all shadow-[0_0_6px_currentColor]"
                          style={{
                            backgroundColor: candleColor,
                            color: candleColor,
                            top: `${100 - Math.max(openVal, closeVal)}%`,
                            height: `${Math.max(4, Math.abs(closeVal - openVal))}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Primary Add Candle Button */}
                  <button
                    onClick={handleAddCandleToCanvas}
                    className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition active:scale-[0.98]"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>+ Add Candle to Canvas</span>
                  </button>
                </div>

                {/* GAP, WIDTH, WICK SIZE Sliders */}
                <div className="bg-[#101726] border border-[#1E293B] rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
                  {/* GAP */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">GAP</span>
                    <div className="flex items-center gap-2 flex-1 ml-4">
                      <input
                        type="range"
                        min="4"
                        max="36"
                        value={settings.candleGap}
                        onChange={(e) => updateSettings({ candleGap: Number(e.target.value) })}
                        className="flex-1 accent-indigo-500 h-1.5 bg-[#182030] rounded cursor-pointer"
                      />
                      <span className="w-7 text-right font-mono text-[11px] text-slate-400">
                        {settings.candleGap}px
                      </span>
                    </div>
                  </div>

                  {/* WIDTH */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">WIDTH</span>
                    <div className="flex items-center gap-2 flex-1 ml-4">
                      <input
                        type="range"
                        min="10"
                        max="46"
                        value={settings.candleWidth}
                        onChange={(e) => updateSettings({ candleWidth: Number(e.target.value) })}
                        className="flex-1 accent-indigo-500 h-1.5 bg-[#182030] rounded cursor-pointer"
                      />
                      <span className="w-7 text-right font-mono text-[11px] text-slate-400">
                        {settings.candleWidth}px
                      </span>
                    </div>
                  </div>

                  {/* WICK SIZE */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">WICK SIZE</span>
                    <div className="flex items-center gap-2 flex-1 ml-4">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="0.5"
                        value={settings.wickWidth}
                        onChange={(e) => updateSettings({ wickWidth: Number(e.target.value) })}
                        className="flex-1 accent-indigo-500 h-1.5 bg-[#182030] rounded cursor-pointer"
                      />
                      <span className="w-7 text-right font-mono text-[11px] text-slate-400">
                        {settings.wickWidth}px
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reveal Animation Switch & Delete Actions */}
                <div className="bg-[#101726] border border-[#1E293B] rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>✨ Reveal Animation</span>
                    </div>
                    {/* Toggle Switch */}
                    <button
                      onClick={() => setRevealAnimation(!revealAnimation)}
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                        revealAnimation ? 'bg-indigo-600' : 'bg-[#182030] border border-[#1E293B]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                          revealAnimation ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="pt-2 border-t border-[#1E293B] flex gap-2">
                    <button
                      onClick={removeLastCandle}
                      disabled={candles.length === 0}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#141B28] hover:bg-[#1E293B] text-slate-400 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition disabled:opacity-40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Last</span>
                    </button>
                    <button
                      onClick={clearAllCandles}
                      disabled={candles.length === 0}
                      className="py-2 px-3 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 text-xs font-medium border border-rose-900/30 transition disabled:opacity-40"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* GROUP CANDLE BUILDER (PRO) */}
            {builderMode === 'group' && (
              <div className="bg-[#101726] border border-indigo-500/40 rounded-2xl p-4 flex flex-col gap-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    Group Candle Builder
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    PRO
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Candle Count</span>
                    <span className="font-mono text-indigo-400 font-bold">{groupCount} candles</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="15"
                    value={groupCount}
                    onChange={(e) => setGroupCount(Number(e.target.value))}
                    className="accent-indigo-500 h-1.5 bg-[#182030] rounded cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-slate-300">Market Direction</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['bullish', 'bearish', 'range'] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setGroupDirection(d)}
                        className={`py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                          groupDirection === d
                            ? d === 'bullish'
                              ? 'bg-emerald-600 text-white'
                              : d === 'bearish'
                              ? 'bg-rose-600 text-white'
                              : 'bg-indigo-600 text-white'
                            : 'bg-[#182030] text-slate-400 hover:text-white'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-slate-300">Momentum</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['high', 'moderate', 'grind'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setGroupMomentum(m)}
                        className={`py-1.5 rounded-lg text-[11px] font-semibold capitalize transition ${
                          groupMomentum === m
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'bg-[#182030] text-slate-400 hover:text-white'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() =>
                    addGroupCandles({
                      count: groupCount,
                      direction: groupDirection,
                      momentum: groupMomentum,
                    })
                  }
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30 transition mt-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add {groupCount} Group Candles</span>
                </button>
              </div>
            )}

            {/* ZIGZAG CANDLE BUILDER (CREATOR) */}
            {builderMode === 'zigzag' && (
              <div className="bg-[#101726] border border-amber-500/40 rounded-2xl p-4 flex flex-col gap-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    ZigZag Wave Builder
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    CREATOR
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Leg 1 Target (HH):</span>
                    <input
                      type="number"
                      step="0.5"
                      value={leg1Price}
                      onChange={(e) => setLeg1Price(Number(e.target.value))}
                      className="w-24 bg-[#182030] border border-[#1E293B] rounded px-2 py-1 text-right font-mono text-amber-300 font-bold"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Leg 2 Target (HL):</span>
                    <input
                      type="number"
                      step="0.5"
                      value={leg2Price}
                      onChange={(e) => setLeg2Price(Number(e.target.value))}
                      className="w-24 bg-[#182030] border border-[#1E293B] rounded px-2 py-1 text-right font-mono text-amber-300 font-bold"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Leg 3 Target (BOS):</span>
                    <input
                      type="number"
                      step="0.5"
                      value={leg3Price}
                      onChange={(e) => setLeg3Price(Number(e.target.value))}
                      className="w-24 bg-[#182030] border border-[#1E293B] rounded px-2 py-1 text-right font-mono text-amber-300 font-bold"
                    />
                  </div>
                </div>

                <button
                  onClick={() =>
                    addZigZagLegs([
                      { targetPrice: leg1Price, candleCount: 4, label: 'Leg 1 (HH)' },
                      { targetPrice: leg2Price, candleCount: 3, label: 'Leg 2 (HL)' },
                      { targetPrice: leg3Price, candleCount: 5, label: 'Leg 3 (Expansion)' },
                    ])
                  }
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-600/30 transition mt-2"
                >
                  <Activity className="w-4 h-4" />
                  <span>+ Generate Multi-Leg ZigZag</span>
                </button>
              </div>
            )}
          </>
        ) : (
          /* TEXT & FONTS (EN) CUSTOMIZER */
          <div className="space-y-4">
            <div className="bg-[#101726] border border-[#1E293B] rounded-2xl p-4 space-y-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                English Hook Banner
              </span>
              <textarea
                rows={3}
                value={settings.bannerHook || ''}
                onChange={(e) => updateSettings({ bannerHook: e.target.value })}
                placeholder="ENTER HOOK TEXT..."
                className="w-full bg-[#182030] border border-[#1E293B] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition resize-none font-semibold"
              />

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] text-slate-400">Banner Font</span>
                <div className="grid grid-cols-3 gap-1">
                  {['Montserrat', 'Bebas Neue', 'Inter'].map((f) => (
                    <button
                      key={f}
                      onClick={() => updateSettings({ fontFamily: f })}
                      className={`py-1 px-2 rounded text-[11px] font-bold transition ${
                        settings.fontFamily === f
                          ? 'bg-amber-500 text-black shadow-sm'
                          : 'bg-[#182030] text-slate-400 hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Font Size</span>
                <input
                  type="range"
                  min="10"
                  max="20"
                  value={settings.bannerFontSize}
                  onChange={(e) => updateSettings({ bannerFontSize: Number(e.target.value) })}
                  className="w-28 accent-amber-500 h-1.5 bg-[#182030] rounded cursor-pointer"
                />
                <span className="font-mono text-amber-400 text-[11px]">
                  {settings.bannerFontSize}px
                </span>
              </div>
            </div>

            {/* Fair Value Gap Quick Injector */}
            <button
              onClick={() => {
                if (candles.length < 3) return;
                const lastIdx = candles.length - 1;
                const p1 = candles[lastIdx - 2]?.high || 4125;
                const p2 = candles[lastIdx]?.low || 4138;
                addOverlay({
                  type: 'FVG',
                  startCandleIndex: Math.max(0, lastIdx - 2),
                  endCandleIndex: lastIdx,
                  priceStart: Math.min(p1, p2),
                  priceEnd: Math.max(p1, p2),
                  color: '#00F5A0',
                  opacity: 0.25,
                  label: `M15 FAIR VALUE GAP [${Math.min(p1, p2).toFixed(1)} - ${Math.max(p1, p2).toFixed(1)}]`,
                });
              }}
              className="w-full py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>+ Add Bullish FVG Overlay</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
