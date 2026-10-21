'use client';

import React, { useState } from 'react';
import { useChartStore } from '../store/useChartStore';
import { Plus, Trash2, Wand2, Sliders, Layers } from 'lucide-react';

export const ControlsPanel: React.FC = () => {
  const {
    candles,
    settings,
    addCandle,
    removeLastCandle,
    generateRandomWalk,
    updateSettings,
    addOverlay,
  } = useChartStore();

  // Local state for single candle builder (Calibrated for XAUUSD Gold ~4,129.00)
  const lastClose = candles.length > 0 ? candles[candles.length - 1].close : 4129.0;
  const [open, setOpen] = useState(lastClose);
  const [high, setHigh] = useState(Math.round((lastClose + 5.5) * 10) / 10);
  const [low, setLow] = useState(Math.round((lastClose - 3.0) * 10) / 10);
  const [close, setClose] = useState(Math.round((lastClose + 4.0) * 10) / 10);

  const handleAddCandle = () => {
    addCandle({
      open: Number(open),
      high: Number(high),
      low: Number(low),
      close: Number(close),
    });
    // Set next defaults based on this close
    const nextO = Number(close);
    setOpen(nextO);
    setHigh(Math.round((nextO + 4.5) * 10) / 10);
    setLow(Math.round((nextO - 3.5) * 10) / 10);
    setClose(Math.round((nextO + 2.5) * 10) / 10);
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
      label: `XAUUSD FVG [${Math.min(p1, p2).toFixed(1)} - ${Math.max(p1, p2).toFixed(1)}]`,
    });
  };

  return (
    <div className="w-80 bg-[#0F141C] border-l border-[#1E293B] p-4 flex flex-col gap-5 overflow-y-auto h-full text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
        <h2 className="text-sm font-semibold flex items-center gap-2 text-white">
          <Sliders className="w-4 h-4 text-primary" /> Candle Builder
        </h2>
        <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary font-mono">
          {candles.length} Candles
        </span>
      </div>

      {/* OHLC Sliders */}
      <div className="flex flex-col gap-3 bg-[#131A26] p-3 rounded-lg border border-[#1E293B]">
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>OHLC Manual Tuning</span>
          <span className={close >= open ? 'text-bullish font-bold' : 'text-bearish font-bold'}>
            {close >= open ? 'BULLISH' : 'BEARISH'}
          </span>
        </div>

        {/* Open */}
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

        {/* High */}
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

        {/* Low */}
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

        {/* Close */}
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

        {/* Button: Add Candle */}
        <button
          onClick={handleAddCandle}
          className="mt-2 w-full py-2 bg-primary hover:bg-primary/90 text-white rounded font-medium text-xs flex items-center justify-center gap-2 transition"
        >
          <Plus className="w-4 h-4" /> Add Candle to Canvas
        </button>

        {/* Button: Delete Last */}
        <button
          onClick={removeLastCandle}
          disabled={candles.length === 0}
          className="w-full py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded font-medium text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-40"
        >
          <Trash2 className="w-3.5 h-3.5" /> Remove Last Candle
        </button>
      </div>

      {/* Generative GBM Simulation (XAUUSD Gold Price Walk) */}
      <div className="flex flex-col gap-2.5 bg-[#131A26] p-3 rounded-lg border border-[#1E293B]">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <Wand2 className="w-3.5 h-3.5 text-amber-400" /> Mô phỏng Giá Vàng (XAUUSD)
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Tạo ngẫu nhiên sóng nến Vàng theo độ biến động thực tế (Brownian Walk).
        </p>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <button
            onClick={() => generateRandomWalk(5, 0.002, 0.005)}
            className="py-1.5 px-2 bg-[#1C2638] hover:bg-[#25334D] text-bullish text-xs rounded border border-bullish/20 transition text-center font-mono"
          >
            +50 Pips Rally
          </button>
          <button
            onClick={() => generateRandomWalk(5, -0.002, 0.005)}
            className="py-1.5 px-2 bg-[#1C2638] hover:bg-[#25334D] text-bearish text-xs rounded border border-bearish/20 transition text-center font-mono"
          >
            -50 Pips Drop
          </button>
        </div>
      </div>

      {/* SMC & Trading Overlays */}
      <div className="flex flex-col gap-2.5 bg-[#131A26] p-3 rounded-lg border border-[#1E293B]">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <Layers className="w-3.5 h-3.5 text-cyan-400" /> Smart Money Overlays
        </div>
        <button
          onClick={handleAddFVG}
          className="w-full py-1.5 bg-[#1C2638] hover:bg-[#25334D] text-cyan-300 text-xs rounded border border-cyan-500/20 transition"
        >
          + Mark Fair Value Gap (FVG)
        </button>
      </div>

      {/* Canvas Dimensions & Gap Controls */}
      <div className="flex flex-col gap-3 bg-[#131A26] p-3 rounded-lg border border-[#1E293B]">
        <span className="text-xs font-semibold text-slate-300">Visual Styling</span>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Candle Width</span>
            <span className="font-mono">{settings.candleWidth}px</span>
          </div>
          <input
            type="range"
            min="12"
            max="48"
            value={settings.candleWidth}
            onChange={(e) => updateSettings({ candleWidth: Number(e.target.value) })}
            className="w-full accent-primary h-1 bg-[#1E293B] rounded cursor-pointer"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Candle Gap</span>
            <span className="font-mono">{settings.candleGap}px</span>
          </div>
          <input
            type="range"
            min="6"
            max="32"
            value={settings.candleGap}
            onChange={(e) => updateSettings({ candleGap: Number(e.target.value) })}
            className="w-full accent-primary h-1 bg-[#1E293B] rounded cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
