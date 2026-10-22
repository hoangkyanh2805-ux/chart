'use client';

import React, { useState } from 'react';
import { useChartStore } from '../store/useChartStore';
import { Plus, Trash2, Wand2, Sliders, Layers, Type, Sparkles, Palette, Activity, TrendingUp, TrendingDown, ArrowDownUp } from 'lucide-react';

export const ControlsPanel: React.FC = () => {
  const {
    candles,
    overlays,
    settings,
    addCandle,
    removeLastCandle,
    clearAllCandles,
    generateRandomWalk,
    addGroupCandles,
    addZigZagLegs,
    updateSettings,
    addOverlay,
    updateOverlayLabel,
  } = useChartStore();

  const [activeTab, setActiveTab] = useState<'candles' | 'text'>('candles');
  const [builderMode, setBuilderMode] = useState<'single' | 'group' | 'zigzag'>('single');

  // Single Candle State
  const lastClose = candles.length > 0 ? candles[candles.length - 1].close : 4129.0;
  const [open, setOpen] = useState(lastClose);
  const [high, setHigh] = useState(Math.round((lastClose + 5.5) * 10) / 10);
  const [low, setLow] = useState(Math.round((lastClose - 3.0) * 10) / 10);
  const [close, setClose] = useState(Math.round((lastClose + 4.0) * 10) / 10);

  // Group Candle State (Pro)
  const [groupCount, setGroupCount] = useState<number>(5);
  const [groupDirection, setGroupDirection] = useState<'bullish' | 'bearish' | 'range'>('bullish');
  const [groupMomentum, setGroupMomentum] = useState<'high' | 'moderate' | 'grind'>('high');

  // ZigZag Candle State (Creator)
  const [leg1Price, setLeg1Price] = useState<number>(4148.0);
  const [leg2Price, setLeg2Price] = useState<number>(4132.0);
  const [leg3Price, setLeg3Price] = useState<number>(4162.0);

  const handleAddSingle = () => {
    addCandle({
      open: Number(open),
      high: Number(high),
      low: Number(low),
      close: Number(close),
    });
    const nextO = Number(close);
    setOpen(nextO);
    setHigh(Math.round((nextO + 4.5) * 10) / 10);
    setLow(Math.round((nextO - 3.5) * 10) / 10);
    setClose(Math.round((nextO + 2.5) * 10) / 10);
  };

  const handleAddGroup = () => {
    addGroupCandles({
      count: groupCount,
      direction: groupDirection,
      momentum: groupMomentum,
    });
  };

  const handleAddZigZag = () => {
    addZigZagLegs([
      { targetPrice: leg1Price, candleCount: 4, label: 'Leg 1 (HH)' },
      { targetPrice: leg2Price, candleCount: 3, label: 'Leg 2 (HL)' },
      { targetPrice: leg3Price, candleCount: 5, label: 'Leg 3 (Expansion)' },
    ]);
  };

  const handleAddFVG = () => {
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
  };

  const quickHooks = [
    'HOW TO TRADE XAUUSD LIKE BANKS (ICT SETUP)',
    'THIS 1 TRADE WIPED OUT MY ENTIRE ACCOUNT',
    'WHY 90% OF GOLD TRADERS GET TRAPPED HERE',
    'DELETE THESE 5 INDICATORS RIGHT NOW!',
    'DO NOT BUY GOLD UNTIL YOU SEE THIS SETUP',
  ];

  return (
    <div className="w-80 bg-[#0F141C] border-l border-[#1E293B] flex flex-col h-full text-slate-200">
      {/* Tab Switcher: Candles vs Text/Typography */}
      <div className="flex border-b border-[#1E293B] bg-[#0B0E14] p-1.5 gap-1">
        <button
          onClick={() => setActiveTab('candles')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'candles'
              ? 'bg-[#1E293B] text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-[#161F2E]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-primary" /> Builders
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'text'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow'
              : 'text-slate-400 hover:text-white hover:bg-[#161F2E]'
          }`}
        >
          <Type className="w-3.5 h-3.5 text-amber-400" /> Text & Fonts (EN)
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {activeTab === 'candles' ? (
          <>
            {/* 3-Mode Builder Switcher (Matching ChartAnimator.io) */}
            <div className="flex flex-col gap-1.5">
              <div className="grid grid-cols-3 gap-1 bg-[#121824] p-1 rounded-xl border border-[#1E293B]">
                <button
                  onClick={() => setBuilderMode('single')}
                  className={`py-1.5 rounded-lg text-[11px] font-bold transition flex flex-col items-center justify-center ${
                    builderMode === 'single'
                      ? 'bg-primary text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Single</span>
                  <span className="text-[9px] opacity-70">Free</span>
                </button>
                <button
                  onClick={() => setBuilderMode('group')}
                  className={`py-1.5 rounded-lg text-[11px] font-bold transition flex flex-col items-center justify-center ${
                    builderMode === 'group'
                      ? 'bg-amber-500 text-black shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Group</span>
                  <span className="text-[9px] uppercase font-mono font-black text-amber-400">PRO</span>
                </button>
                <button
                  onClick={() => setBuilderMode('zigzag')}
                  className={`py-1.5 rounded-lg text-[11px] font-bold transition flex flex-col items-center justify-center ${
                    builderMode === 'zigzag'
                      ? 'bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>ZigZag</span>
                  <span className="text-[9px] uppercase font-mono font-black text-cyan-300">CREATOR</span>
                </button>
              </div>
            </div>

            {/* MODE 1: SINGLE CANDLE BUILDER */}
            {builderMode === 'single' && (
              <div className="flex flex-col gap-3 bg-[#131A26] p-3 rounded-lg border border-[#1E293B]">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span className="font-semibold text-white">Single Candle OHLC</span>
                  <span className={close >= open ? 'text-bullish font-bold' : 'text-bearish font-bold'}>
                    {close >= open ? 'BULLISH' : 'BEARISH'}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Open</span>
                      <span className="font-mono text-white">${open.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="4080"
                      max="4220"
                      step="0.5"
                      value={open}
                      onChange={(e) => setOpen(Number(e.target.value))}
                      className="w-full accent-primary h-1.5 bg-[#1E293B] rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">High</span>
                      <span className="font-mono text-white">${high.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="4080"
                      max="4220"
                      step="0.5"
                      value={high}
                      onChange={(e) => setHigh(Number(e.target.value))}
                      className="w-full accent-primary h-1.5 bg-[#1E293B] rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Low</span>
                      <span className="font-mono text-white">${low.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="4080"
                      max="4220"
                      step="0.5"
                      value={low}
                      onChange={(e) => setLow(Number(e.target.value))}
                      className="w-full accent-primary h-1.5 bg-[#1E293B] rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Close</span>
                      <span className="font-mono text-white">${close.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="4080"
                      max="4220"
                      step="0.5"
                      value={close}
                      onChange={(e) => setClose(Number(e.target.value))}
                      className="w-full accent-primary h-1.5 bg-[#1E293B] rounded cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddSingle}
                  className="mt-1 w-full py-2 bg-primary hover:bg-primary/90 text-white rounded font-medium text-xs flex items-center justify-center gap-2 transition"
                >
                  <Plus className="w-4 h-4" /> Add 1 Candle to Canvas
                </button>
              </div>
            )}

            {/* MODE 2: GROUP CANDLE BUILDER (PRO) */}
            {builderMode === 'group' && (
              <div className="flex flex-col gap-3 bg-[#131A26] p-3 rounded-lg border border-amber-500/30">
                <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Group Candle Builder
                  </span>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
                    PRO BATCH
                  </span>
                </div>

                {/* Direction */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-400">Trend Direction:</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => setGroupDirection('bullish')}
                      className={`py-1 rounded text-xs font-semibold flex items-center justify-center gap-1 transition ${
                        groupDirection === 'bullish'
                          ? 'bg-bullish text-black font-bold'
                          : 'bg-[#1C2638] text-slate-300'
                      }`}
                    >
                      <TrendingUp className="w-3 h-3" /> Bullish
                    </button>
                    <button
                      onClick={() => setGroupDirection('bearish')}
                      className={`py-1 rounded text-xs font-semibold flex items-center justify-center gap-1 transition ${
                        groupDirection === 'bearish'
                          ? 'bg-bearish text-white font-bold'
                          : 'bg-[#1C2638] text-slate-300'
                      }`}
                    >
                      <TrendingDown className="w-3 h-3" /> Bearish
                    </button>
                    <button
                      onClick={() => setGroupDirection('range')}
                      className={`py-1 rounded text-xs font-semibold flex items-center justify-center gap-1 transition ${
                        groupDirection === 'range'
                          ? 'bg-sky-400 text-black font-bold'
                          : 'bg-[#1C2638] text-slate-300'
                      }`}
                    >
                      Range
                    </button>
                  </div>
                </div>

                {/* Candle Count */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Number of Candles:</span>
                    <span className="font-mono text-white font-bold">{groupCount} Candles</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    value={groupCount}
                    onChange={(e) => setGroupCount(Number(e.target.value))}
                    className="w-full accent-amber-400 h-1.5 bg-[#1E293B] rounded cursor-pointer"
                  />
                </div>

                {/* Momentum */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-slate-400">Impulse Momentum:</label>
                  <select
                    value={groupMomentum}
                    onChange={(e) => setGroupMomentum(e.target.value as any)}
                    className="bg-[#0B0E14] border border-[#1E293B] rounded p-1.5 text-xs text-white"
                  >
                    <option value="high">High Momentum (News & Expansion)</option>
                    <option value="moderate">Moderate Trend (Standard Wave)</option>
                    <option value="grind">Slow Grind (Consolidation)</option>
                  </select>
                </div>

                <button
                  onClick={handleAddGroup}
                  className="mt-1 w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-black font-bold text-xs rounded shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add +{groupCount} Candle Group
                </button>
              </div>
            )}

            {/* MODE 3: ZIGZAG BUILDER (CREATOR) */}
            {builderMode === 'zigzag' && (
              <div className="flex flex-col gap-3 bg-[#131A26] p-3 rounded-lg border border-cyan-500/30">
                <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <ArrowDownUp className="w-3.5 h-3.5" /> ZigZag Wave Builder
                  </span>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                    CREATOR 4K
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Tự động sinh chuỗi nến tự nhiên bám sát theo 3 nhịp sóng Đỉnh/Đáy (Swing High & Low):
                </p>

                {/* Leg 1 Target */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Leg 1: Swing High (HH)</span>
                    <span className="font-mono text-cyan-300 font-bold">${leg1Price.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="4130"
                    max="4190"
                    step="0.5"
                    value={leg1Price}
                    onChange={(e) => setLeg1Price(Number(e.target.value))}
                    className="w-full accent-cyan-400 h-1 bg-[#1E293B] rounded cursor-pointer"
                  />
                </div>

                {/* Leg 2 Target */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Leg 2: Pullback Low (HL)</span>
                    <span className="font-mono text-amber-300 font-bold">${leg2Price.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="4110"
                    max="4150"
                    step="0.5"
                    value={leg2Price}
                    onChange={(e) => setLeg2Price(Number(e.target.value))}
                    className="w-full accent-amber-400 h-1 bg-[#1E293B] rounded cursor-pointer"
                  />
                </div>

                {/* Leg 3 Target */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Leg 3: Expansion Surge</span>
                    <span className="font-mono text-bullish font-bold">${leg3Price.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="4140"
                    max="4220"
                    step="0.5"
                    value={leg3Price}
                    onChange={(e) => setLeg3Price(Number(e.target.value))}
                    className="w-full accent-bullish h-1 bg-[#1E293B] rounded cursor-pointer"
                  />
                </div>

                <button
                  onClick={handleAddZigZag}
                  className="mt-1 w-full py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-white font-bold text-xs rounded shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Activity className="w-4 h-4" /> Generate 3-Leg ZigZag Wave
                </button>
              </div>
            )}

            {/* Quick Actions & Canvas Clear */}
            <div className="flex gap-2">
              <button
                onClick={removeLastCandle}
                disabled={candles.length === 0}
                className="flex-1 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded font-medium text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-40"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove Last
              </button>
              <button
                onClick={clearAllCandles}
                className="px-3 py-1.5 bg-[#1E293B] hover:bg-[#2B384E] text-slate-400 hover:text-white rounded text-xs transition"
              >
                Clear All
              </button>
            </div>

            {/* Overlays Add */}
            <div className="flex flex-col gap-2.5 bg-[#131A26] p-3 rounded-lg border border-[#1E293B]">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Layers className="w-3.5 h-3.5 text-cyan-400" /> Quick Smart Money Tools
              </div>
              <button
                onClick={handleAddFVG}
                className="w-full py-1.5 bg-[#1C2638] hover:bg-[#25334D] text-cyan-300 text-xs rounded border border-cyan-500/20 transition font-mono"
              >
                + Add Fair Value Gap (FVG)
              </button>
            </div>
          </>
        ) : (
          /* TAB 2: TEXT & TYPOGRAPHY EDITOR (ENGLISH) */
          <div className="flex flex-col gap-4">
            {/* Section 1: Hook Banner */}
            <div className="flex flex-col gap-2.5 bg-[#131A26] p-3 rounded-lg border border-[#1E293B]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Viral Hook Banner (English)
                </span>
                <button
                  onClick={() => updateSettings({ bannerHook: '' })}
                  className="text-[10px] text-slate-500 hover:text-red-400"
                >
                  Clear
                </button>
              </div>

              <textarea
                rows={2}
                value={settings.bannerHook || ''}
                onChange={(e) => updateSettings({ bannerHook: e.target.value })}
                placeholder="Type your English hook title..."
                className="w-full bg-[#0B0E14] border border-[#1E293B] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-400 uppercase font-bold"
              />

              {/* Quick Preset Hooks */}
              <div className="flex flex-col gap-1.5 mt-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Quick English Hooks:
                </span>
                <div className="flex flex-col gap-1">
                  {quickHooks.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => updateSettings({ bannerHook: h })}
                      className="text-left text-[11px] p-1.5 rounded bg-[#1C2638]/60 hover:bg-[#25334D] text-slate-300 hover:text-amber-300 line-clamp-1 transition"
                    >
                      • {h}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2: Font Family & Size */}
            <div className="flex flex-col gap-3 bg-[#131A26] p-3 rounded-lg border border-[#1E293B]">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-primary" /> Typography & Font Choice
              </span>

              {/* Font Family */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-slate-400">Font Family:</label>
                <select
                  value={settings.fontFamily || 'Montserrat'}
                  onChange={(e) => updateSettings({ fontFamily: e.target.value })}
                  className="bg-[#0B0E14] border border-[#1E293B] rounded-lg p-1.5 text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="Montserrat">Montserrat (Modern Bold - Recommended)</option>
                  <option value="Inter">Inter (Clean Geometric)</option>
                  <option value="Bebas Neue">Bebas Neue (Viral Shorts Condensed)</option>
                  <option value="monospace">Courier / Monospace (Terminal Style)</option>
                </select>
              </div>

              {/* Font Size */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Banner Font Size</span>
                  <span className="font-mono text-white">{settings.bannerFontSize || 13}px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="18"
                  value={settings.bannerFontSize || 13}
                  onChange={(e) => updateSettings({ bannerFontSize: Number(e.target.value) })}
                  className="w-full accent-primary h-1 bg-[#1E293B] rounded cursor-pointer"
                />
              </div>

              {/* Banner Color Palette */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] text-slate-400">Banner Accent Color:</span>
                <div className="flex items-center gap-2">
                  {[
                    { name: 'Yellow', color: '#FDE047' },
                    { name: 'Cyan', color: '#38BDF8' },
                    { name: 'Green', color: '#00F5A0' },
                    { name: 'Red', color: '#FF3366' },
                    { name: 'White', color: '#FFFFFF' },
                  ].map((c) => (
                    <button
                      key={c.name}
                      onClick={() => updateSettings({ bannerTextColor: c.color })}
                      className={`w-6 h-6 rounded-full border-2 transition ${
                        settings.bannerTextColor === c.color ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Direct Editing of Overlay Labels */}
            <div className="flex flex-col gap-2.5 bg-[#131A26] p-3 rounded-lg border border-[#1E293B]">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-cyan-400" /> Active Chart Labels ({overlays.length})
              </span>
              <p className="text-[10px] text-slate-400">Edit the text that appears on your chart markers directly:</p>

              <div className="flex flex-col gap-2 mt-1">
                {overlays.map((ov, index) => (
                  <div key={ov.id} className="flex flex-col gap-1 bg-[#0B0E14] p-2 rounded border border-[#1E293B]">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                      <span className="uppercase font-bold" style={{ color: ov.color || '#38BDF8' }}>
                        {ov.type}
                      </span>
                      <span>#{index + 1}</span>
                    </div>
                    <input
                      type="text"
                      value={ov.label || ''}
                      onChange={(e) => updateOverlayLabel(ov.id, e.target.value)}
                      placeholder="e.g. M15 FAIR VALUE GAP"
                      className="w-full bg-[#161F2E] border border-[#232F42] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
