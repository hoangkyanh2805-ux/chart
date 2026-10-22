'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useChartStore } from '../store/useChartStore';
import { priceToCanvasY, indexToCanvasX } from '../math/coordinates';
import { Candle, Overlay } from '../types/chart';
import { InteractiveTimeline } from './InteractiveTimeline';
import { BuilderModeBar } from './BuilderModeBar';
import { Edit3, Check, Type } from 'lucide-react';

export const ChartCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const {
    candles,
    overlays,
    settings,
    currentTime,
    duration,
    revealMode,
    headlineText,
    sublineText,
    badges,
    setHeadlineText,
    setSublineText,
    activeWorkspaceTab,
    setActiveWorkspaceTab,
  } = useChartStore();

  const [isEditingInline, setIsEditingInline] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const priceAxisWidth = 65;
    const chartWidth = width - priceAxisWidth;
    const activeFont = settings.fontFamily || 'Montserrat';

    // 1. Clear background
    ctx.fillStyle = '#0B0F19';
    ctx.fillRect(0, 0, width, height);

    // Helper: Draw signature ▲ LIMIT and ▼ LIMIT boundary dashed lines
    const drawLimitLines = () => {
      ctx.save();
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.45)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);

      // Top Limit Line
      const topLimitY = 32;
      ctx.beginPath();
      ctx.moveTo(12, topLimitY);
      ctx.lineTo(chartWidth, topLimitY);
      ctx.stroke();

      ctx.font = 'bold 9px monospace';
      ctx.fillStyle = '#818CF8';
      ctx.textAlign = 'right';
      ctx.fillText('▲ LIMIT', chartWidth - 8, topLimitY - 6);

      // Bottom Limit Line
      const bottomLimitY = height - 32;
      ctx.beginPath();
      ctx.moveTo(12, bottomLimitY);
      ctx.lineTo(chartWidth, bottomLimitY);
      ctx.stroke();

      ctx.fillText('▼ LIMIT', chartWidth - 8, bottomLimitY + 14);
      ctx.textAlign = 'left';
      ctx.restore();
    };

    if (candles.length === 0) {
      drawLimitLines();

      // Empty State: Dashed circle + prompt matching ChartAnimator
      ctx.save();
      const centerX = chartWidth / 2;
      const centerY = height / 2;

      ctx.strokeStyle = '#222F43';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(centerX, centerY - 18, 22, 0, Math.PI * 2);
      ctx.stroke();

      // Plus sign
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(centerX - 7, centerY - 18);
      ctx.lineTo(centerX + 7, centerY - 18);
      ctx.moveTo(centerX, centerY - 25);
      ctx.lineTo(centerX, centerY - 11);
      ctx.stroke();

      // Prompt text
      ctx.font = `500 11px "${activeFont}", sans-serif`;
      ctx.fillStyle = '#64748B';
      ctx.textAlign = 'center';
      ctx.fillText(
        'Adjust the OHLC sliders and click Add Candle, then edit Gap, Width or Wick Size',
        centerX,
        centerY + 24
      );
      ctx.restore();
      return;
    }

    // Calculate dynamic price range with 4% padding
    const allPrices = candles.flatMap((c) => [c.high, c.low]);
    const minPrice = Math.min(...allPrices) * 0.995;
    const maxPrice = Math.max(...allPrices) * 1.005;

    // 2. Render Subtle Background Grid & Price Axis Levels
    if (settings.showGrid) {
      ctx.strokeStyle = '#141B28';
      ctx.lineWidth = 1;

      // Price grid lines & axis labels
      const priceSteps = 6;
      const priceDiff = (maxPrice - minPrice) / priceSteps;

      for (let i = 0; i <= priceSteps; i++) {
        const p = minPrice + i * priceDiff;
        const y = priceToCanvasY(p, minPrice, maxPrice, height);

        ctx.strokeStyle = '#141B28';
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(chartWidth, y);
        ctx.stroke();

        // Right Price Axis text
        ctx.font = '10px monospace';
        ctx.fillStyle = '#64748B';
        ctx.fillText(p.toFixed(2), chartWidth + 6, y + 3);
      }

      // Vertical time grid lines
      const gridStepX = 50;
      for (let x = 0; x < chartWidth; x += gridStepX) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    }

    // Draw Limit Lines on active chart
    drawLimitLines();

    // 3. Watermark: XAUUSD · Timeframe
    ctx.save();
    ctx.font = `bold 22px "${activeFont}", sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillText(`${settings.symbol || 'XAUUSD'} · ${settings.timeframe || 'M15'}`, 24, 42);

    // 3b. High-Impact Video Hook Banner (Custom English text for Shorts/TikTok)
    const effectiveBanner = headlineText || settings.bannerHook;
    if (effectiveBanner) {
      const bannerText = effectiveBanner.toUpperCase();
      const fontSize = settings.bannerFontSize || 12;
      ctx.font = `900 ${fontSize}px "${activeFont}", sans-serif`;
      
      const metrics = ctx.measureText(bannerText);
      const textWidth = metrics.width;
      const paddingX = 16;
      const pillWidth = Math.min(chartWidth - 24, textWidth + paddingX * 2);
      const bannerX = (chartWidth - pillWidth) / 2;
      const bannerY = 16;
      const pillHeight = fontSize + 16;

      // Banner Pill Container
      ctx.fillStyle = settings.bannerBgColor || 'rgba(15, 23, 42, 0.94)';
      ctx.strokeStyle = '#EAB308';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = 'rgba(234, 179, 8, 0.25)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.roundRect(bannerX, bannerY, pillWidth, pillHeight, 8);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow

      // Banner Text (Centered)
      ctx.fillStyle = settings.bannerTextColor || '#FDE047';
      ctx.textAlign = 'center';
      ctx.fillText(bannerText, bannerX + pillWidth / 2, bannerY + pillHeight / 2 + fontSize * 0.35);

      // Subline Text directly under Banner
      if (sublineText) {
        ctx.font = `600 10.5px "${activeFont}", sans-serif`;
        ctx.fillStyle = '#94A3B8';
        ctx.fillText(sublineText, chartWidth / 2, bannerY + pillHeight + 14);
      }
      ctx.textAlign = 'left'; // reset alignment
    }
    ctx.restore();

    // 3c. Bottom 3-Step Stepper Badges (#1 LOSS $30 | #2 ENTRY | #3 SIZE)
    if (badges && badges.length > 0) {
      ctx.save();
      const badgeY = height - 25;
      const availWidth = Math.min(380, chartWidth - 24);
      const startBadgeX = (chartWidth - availWidth) / 2;
      const bWidth = Math.floor(availWidth / 3);

      badges.forEach((bText, idx) => {
        const bx = startBadgeX + idx * bWidth;
        const bw = bWidth - 4;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = idx === 0 ? '#EF4444' : idx === 1 ? '#0284C7' : '#10B981';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(bx, badgeY, bw, 18, 4);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 8.5px monospace';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(bText, bx + bw / 2, badgeY + 12);
      });
      ctx.restore();
    }

    // Determine how many candles to reveal based on currentTime and revealMode
    let visibleCount = candles.length;
    if (duration > 0) {
      const progress = Math.min(1, Math.max(0, currentTime / duration));
      visibleCount = Math.max(1, Math.ceil(progress * candles.length));
    }
    const visibleCandles = candles.slice(0, visibleCount);

    // 4. Render Overlays (FVG, Order Block, Liquidity Lines, Long/Short)
    overlays.forEach((overlay: Overlay) => {
      if (overlay.startCandleIndex >= visibleCount) return;

      const effectiveEndIndex = Math.min(overlay.endCandleIndex, visibleCount - 1);
      const startX = indexToCanvasX(overlay.startCandleIndex, settings.candleWidth, settings.candleGap);
      const endX =
        indexToCanvasX(effectiveEndIndex, settings.candleWidth, settings.candleGap) + settings.candleWidth;
      const yTop = priceToCanvasY(overlay.priceEnd, minPrice, maxPrice, height);
      const yBottom = priceToCanvasY(overlay.priceStart, minPrice, maxPrice, height);

      const boxY = Math.min(yTop, yBottom);
      const boxHeight = Math.abs(yBottom - yTop);
      const boxWidth = Math.max(settings.candleWidth, endX - startX);

      ctx.save();

      if (overlay.type === 'LIQUIDITY_LINE') {
        // Crisp dashed structural level line (BOS, CHoCH, Liquidity Pool)
        const yLine = priceToCanvasY(overlay.priceStart, minPrice, maxPrice, height);
        ctx.strokeStyle = overlay.color || '#F59E0B';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(startX, yLine);
        ctx.lineTo(endX, yLine);
        ctx.stroke();
        ctx.setLineDash([]); // reset

        // Level tag
        if (overlay.label) {
          ctx.font = `bold 10px "${activeFont}", monospace`;
          ctx.fillStyle = overlay.color || '#F59E0B';
          ctx.fillText(overlay.label, startX, yLine - 6);
        }
      } else if (overlay.type === 'FVG') {
        // Fair Value Gap Box
        ctx.fillStyle = overlay.color || '#00F5A0';
        ctx.globalAlpha = overlay.opacity || 0.18;
        ctx.fillRect(startX, boxY, boxWidth, boxHeight);

        // Border
        ctx.strokeStyle = overlay.color || '#00F5A0';
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = 0.7;
        ctx.strokeRect(startX, boxY, boxWidth, boxHeight);

        // 50% Consequent Encroachment (C.E.) Midpoint Line (ICT Standard)
        const midY = boxY + boxHeight / 2;
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startX, midY);
        ctx.lineTo(startX + boxWidth, midY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label + C.E. text
        if (overlay.label) {
          ctx.font = `bold 10px "${activeFont}", sans-serif`;
          ctx.fillStyle = overlay.color || '#00F5A0';
          ctx.globalAlpha = 0.9;
          ctx.fillText(overlay.label, startX + 6, boxY + 14);
          ctx.font = `9px "${activeFont}", monospace`;
          ctx.fillText('50% C.E.', startX + 6, midY - 3);
        }
      } else if (overlay.type === 'LONG_SHORT') {
        // Risk:Reward Ratio Overlay (Target green, Risk red)
        const entryY = priceToCanvasY(overlay.priceStart, minPrice, maxPrice, height);
        const targetY = priceToCanvasY(overlay.priceEnd, minPrice, maxPrice, height);
        const slPrice = overlay.priceStart - (overlay.priceEnd - overlay.priceStart) / 3.5;
        const slY = priceToCanvasY(slPrice, minPrice, maxPrice, height);

        // Profit Zone (Green)
        ctx.fillStyle = '#00F5A0';
        ctx.globalAlpha = 0.18;
        ctx.fillRect(startX, Math.min(entryY, targetY), boxWidth, Math.abs(targetY - entryY));

        // Risk Zone (Red)
        ctx.fillStyle = '#FF3366';
        ctx.globalAlpha = 0.18;
        ctx.fillRect(startX, Math.min(entryY, slY), boxWidth, Math.abs(slY - entryY));

        // Entry Line (White)
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.moveTo(startX, entryY);
        ctx.lineTo(startX + boxWidth, entryY);
        ctx.stroke();

        ctx.font = `bold 10px "${activeFont}", monospace`;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`ENTRY: $${overlay.priceStart.toFixed(2)}`, startX + 6, entryY - 4);
        ctx.fillStyle = '#00F5A0';
        ctx.fillText(`TP: $${overlay.priceEnd.toFixed(2)} (1:3.5 RR)`, startX + 6, Math.min(entryY, targetY) + 14);
        ctx.fillStyle = '#FF3366';
        ctx.fillText(`SL: $${slPrice.toFixed(2)}`, startX + 6, Math.max(entryY, slY) - 4);
      } else {
        // Standard Order Block
        ctx.fillStyle = overlay.color || '#6366F1';
        ctx.globalAlpha = overlay.opacity || 0.22;
        ctx.fillRect(startX, boxY, boxWidth, boxHeight);

        ctx.strokeStyle = overlay.color || '#6366F1';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.8;
        ctx.strokeRect(startX, boxY, boxWidth, boxHeight);

        if (overlay.label) {
          ctx.font = `bold 10px "${activeFont}", sans-serif`;
          ctx.fillStyle = overlay.color || '#6366F1';
          ctx.fillText(overlay.label, startX + 6, boxY + 14);
        }
      }

      ctx.restore();
    });

    // 5. Render Candlesticks
    visibleCandles.forEach((candle: Candle) => {
      const isBullish = candle.close >= candle.open;
      const color = isBullish ? settings.bullishColor : settings.bearishColor;
      const x = indexToCanvasX(candle.index, settings.candleWidth, settings.candleGap);
      const centerX = x + settings.candleWidth / 2;

      const yHigh = priceToCanvasY(candle.high, minPrice, maxPrice, height);
      const yLow = priceToCanvasY(candle.low, minPrice, maxPrice, height);
      const yOpen = priceToCanvasY(candle.open, minPrice, maxPrice, height);
      const yClose = priceToCanvasY(candle.close, minPrice, maxPrice, height);

      // Draw Wick (High to Low)
      ctx.strokeStyle = color;
      ctx.lineWidth = settings.wickWidth;
      ctx.beginPath();
      ctx.moveTo(centerX, yHigh);
      ctx.lineTo(centerX, yLow);
      ctx.stroke();

      // Draw Body (Open to Close)
      const bodyTop = Math.min(yOpen, yClose);
      const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

      ctx.fillStyle = color;
      ctx.fillRect(x, bodyTop, settings.candleWidth, bodyHeight);

      // Glow effect for crypto/forex aesthetic
      ctx.shadowColor = color;
      ctx.shadowBlur = 4;
      ctx.strokeRect(x, bodyTop, settings.candleWidth, bodyHeight);
      ctx.shadowBlur = 0; // reset
    });

    // 6. Current Price Tag (on Right Axis)
    if (visibleCandles.length > 0) {
      const lastCandle = visibleCandles[visibleCandles.length - 1];
      const curY = priceToCanvasY(lastCandle.close, minPrice, maxPrice, height);
      const isBull = lastCandle.close >= lastCandle.open;
      const curColor = isBull ? settings.bullishColor : settings.bearishColor;

      // Price marker background
      ctx.fillStyle = curColor;
      ctx.fillRect(chartWidth + 2, curY - 9, priceAxisWidth - 4, 18);

      ctx.font = 'bold 10px monospace';
      ctx.fillStyle = '#0B0E14';
      ctx.fillText(lastCandle.close.toFixed(2), chartWidth + 6, curY + 4);

      // Dotted horizontal guide line to current candle
      ctx.save();
      ctx.strokeStyle = curColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(0, curY);
      ctx.lineTo(chartWidth, curY);
      ctx.stroke();
      ctx.restore();
    }

    // 7. Render Spotlight Mode (if enabled)
    if (settings.spotlightEnabled && visibleCandles.length > 0) {
      const lastCandle = visibleCandles[visibleCandles.length - 1];
      const spotX =
        indexToCanvasX(lastCandle.index, settings.candleWidth, settings.candleGap) + settings.candleWidth / 2;
      const spotY = priceToCanvasY(lastCandle.close, minPrice, maxPrice, height);

      ctx.save();
      const radialGradient = ctx.createRadialGradient(spotX, spotY, 50, spotX, spotY, 320);
      radialGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      radialGradient.addColorStop(1, 'rgba(11, 14, 20, 0.88)');
      ctx.fillStyle = radialGradient;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  }, [candles, overlays, settings, currentTime, duration, revealMode, headlineText, sublineText, badges]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col bg-[#080C14] rounded-2xl overflow-hidden border border-[#1E293B] shadow-2xl"
    >
      {/* Workspace Header Bar: Canvas | Timeline & Counter & LIVE Badge */}
      <div className="h-12 px-5 bg-[#0C101B] border-b border-[#1E293B] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-1.5 bg-[#121826] p-1 rounded-xl border border-[#1E293B]">
          <button
            onClick={() => setActiveWorkspaceTab('canvas')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeWorkspaceTab === 'canvas'
                ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-600/30 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Canvas
          </button>
          <button
            onClick={() => setActiveWorkspaceTab('timeline')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeWorkspaceTab === 'timeline'
                ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-600/30 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Timeline
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400">
            {candles.length} candle{candles.length !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E1B4B] border border-indigo-500/40 text-indigo-300 text-xs font-bold font-mono shadow-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            LIVE
          </span>
        </div>
      </div>

      {/* Builder Mode Bar directly under the Header matching ChartAnimator */}
      <BuilderModeBar />

      {/* Main Workspace Body */}
      <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center p-4">
        {activeWorkspaceTab === 'canvas' ? (
          <div
            onDoubleClick={() => setIsEditingInline(true)}
            className={`relative transition-all duration-300 shadow-2xl rounded-xl overflow-hidden border border-[#1E293B] ${
              settings.aspectRatio === '9:16'
                ? 'w-[360px] h-[640px]'
                : settings.aspectRatio === '1:1'
                ? 'w-[540px] h-[540px]'
                : 'w-full max-w-[960px] h-[540px]'
            }`}
          >
            <canvas ref={canvasRef} className="w-full h-full block cursor-pointer" />

            {/* Quick Sửa Chữ Trực Tiếp Floating Button */}
            <button
              type="button"
              onClick={() => setIsEditingInline(!isEditingInline)}
              title="Nhấp đúp vào canvas hoặc bấm đây để sửa chữ trực tiếp"
              className={`absolute top-3 right-3 z-30 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition shadow-lg backdrop-blur-md border ${
                isEditingInline
                  ? 'bg-amber-500 text-black border-amber-400'
                  : 'bg-black/50 hover:bg-black/80 text-slate-300 hover:text-white border-white/10'
              }`}
            >
              {isEditingInline ? (
                <>
                  <Check className="w-3 h-3 text-black" />
                  <span>Xong</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3 h-3 text-amber-400" />
                  <span>Sửa Chữ Trực Tiếp</span>
                </>
              )}
            </button>

            {/* In-Place Direct Text Editor Overlay */}
            {isEditingInline && (
              <div className="absolute top-8 inset-x-4 z-20 bg-black/90 backdrop-blur-md border border-amber-500/60 rounded-xl p-3.5 shadow-2xl flex flex-col gap-2.5 animate-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between text-[10px] font-mono text-amber-400 font-bold border-b border-white/10 pb-1">
                  <span className="flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5" />
                    <span>TRÌNH SỬA CHỮ TRỰC TIẾP TRÊN CANVAS</span>
                  </span>
                  <span className="text-slate-400 text-[9px]">Esc để thoát</span>
                </div>

                <div>
                  <span className="text-[9px] font-mono text-slate-400 block mb-0.5 font-bold">
                    TIÊU ĐỀ HOOK BANNER:
                  </span>
                  <textarea
                    value={headlineText}
                    autoFocus
                    onChange={(e) => setHeadlineText(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setIsEditingInline(false);
                    }}
                    rows={2}
                    className="w-full bg-[#141B29] border border-amber-500/50 rounded-lg p-2 text-xs font-black text-amber-300 uppercase focus:outline-none focus:border-amber-400 resize-none font-sans"
                  />
                </div>

                <div>
                  <span className="text-[9px] font-mono text-slate-400 block mb-0.5 font-bold">
                    PHỤ ĐỀ GIẢI THÍCH (SUBLINE):
                  </span>
                  <input
                    type="text"
                    value={sublineText}
                    onChange={(e) => setSublineText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === 'Escape') setIsEditingInline(false);
                    }}
                    className="w-full bg-[#141B29] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-sans"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 mt-0.5">
                  <button
                    type="button"
                    onClick={() => setIsEditingInline(false)}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold text-[10px] rounded-lg shadow-md transition"
                  >
                    ✓ Hoàn Tất & Lưu Lên Video
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <InteractiveTimeline />
        )}
      </div>
    </div>
  );
};
