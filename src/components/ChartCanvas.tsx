'use client';

import React, { useRef, useEffect } from 'react';
import { useChartStore } from '../store/useChartStore';
import { priceToCanvasY, indexToCanvasX } from '../math/coordinates';
import { Candle, Overlay } from '../types/chart';

export const ChartCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { candles, overlays, settings, currentTime, duration, revealMode } = useChartStore();

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

    // 1. Clear background
    ctx.fillStyle = '#0B0E14';
    ctx.fillRect(0, 0, width, height);

    // 2. Render Subtle Background Grid
    if (settings.showGrid) {
      ctx.strokeStyle = '#141B28';
      ctx.lineWidth = 1;
      const gridStep = 45;
      for (let x = 0; x < width; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    if (candles.length === 0) return;

    // Calculate dynamic price range with 5% padding
    const allPrices = candles.flatMap((c) => [c.high, c.low]);
    const minPrice = Math.min(...allPrices) * 0.97;
    const maxPrice = Math.max(...allPrices) * 1.03;

    // Determine how many candles to reveal based on currentTime and revealMode
    let visibleCount = candles.length;
    if (duration > 0) {
      const progress = Math.min(1, Math.max(0, currentTime / duration));
      visibleCount = Math.max(1, Math.ceil(progress * candles.length));
    }
    const visibleCandles = candles.slice(0, visibleCount);

    // 3. Render Overlays (FVG, Order Block, Liquidity Lines, Long/Short)
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
          ctx.font = 'bold 10px monospace';
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
          ctx.font = 'bold 10px sans-serif';
          ctx.fillStyle = overlay.color || '#00F5A0';
          ctx.globalAlpha = 0.9;
          ctx.fillText(overlay.label, startX + 6, boxY + 14);
          ctx.font = '9px monospace';
          ctx.fillText('50% C.E.', startX + 6, midY - 3);
        }
      } else if (overlay.type === 'LONG_SHORT') {
        // Risk:Reward Ratio Overlay (Target green, Risk red)
        const entryY = priceToCanvasY(overlay.priceStart, minPrice, maxPrice, height);
        const targetY = priceToCanvasY(overlay.priceEnd, minPrice, maxPrice, height);
        const slPrice = overlay.priceStart - (overlay.priceEnd - overlay.priceStart) / 3; // default 1:3 RR
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

        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('ENTRY', startX + 6, entryY - 4);
        ctx.fillStyle = '#00F5A0';
        ctx.fillText('TARGET (TP) - 1:3.0 R:R', startX + 6, Math.min(entryY, targetY) + 14);
        ctx.fillStyle = '#FF3366';
        ctx.fillText('STOP LOSS (SL)', startX + 6, Math.max(entryY, slY) - 4);
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
          ctx.font = 'bold 10px sans-serif';
          ctx.fillStyle = overlay.color || '#6366F1';
          ctx.fillText(overlay.label, startX + 6, boxY + 14);
        }
      }

      ctx.restore();
    });

    // 4. Render Candlesticks
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

    // 5. Render Spotlight Mode (if enabled)
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
  }, [candles, overlays, settings, currentTime, duration, revealMode]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center p-4 bg-[#080A0F] rounded-xl overflow-hidden border border-[#1E293B]"
    >
      <div
        className={`relative transition-all duration-300 shadow-2xl rounded-lg overflow-hidden border border-[#1E293B] ${
          settings.aspectRatio === '9:16'
            ? 'w-[360px] h-[640px]'
            : settings.aspectRatio === '1:1'
            ? 'w-[540px] h-[540px]'
            : 'w-full max-w-[960px] h-[540px]'
        }`}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </div>
  );
};
