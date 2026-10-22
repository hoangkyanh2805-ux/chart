'use client';

import React, { useRef, useEffect } from 'react';
import { useChartStore } from '../store/useChartStore';

export const StageCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const {
    stageTheme,
    headlineText,
    sublineText,
    setHeadlineText,
    setSublineText,
    currentTime,
    duration,
    settings,
    candles,
    overlays,
  } = useChartStore();

  const isWhite = stageTheme === 'white';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI Retina display support
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Animation progress 0.0 -> 1.0
    const progress = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 1;

    // 1. Draw Background
    if (isWhite) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = '#080C16';
      ctx.fillRect(0, 0, width, height);

      // Subtle radial glow in center
      const rad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width * 0.6);
      rad.addColorStop(0, 'rgba(99, 102, 241, 0.09)');
      rad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = rad;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Top Watermark & Compliance Notice Header
    ctx.save();
    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = isWhite ? 'rgba(0, 0, 0, 0.45)' : 'rgba(255, 255, 255, 0.45)';
    ctx.fillText(`${settings.symbol || 'XAUUSD'} · GOLD SPOT`, 32, 34);

    ctx.textAlign = 'right';
    ctx.fillStyle = isWhite ? '#B45309' : '#FBBF24';
    ctx.fillText('ILLUSTRATION · NOT FINANCIAL ADVICE', width - 32, 34);
    ctx.restore();

    // 3. Headline & Subline Typography (Top Section)
    ctx.save();
    const activeFont = settings.fontFamily || 'Montserrat';
    const headline = (headlineText || 'THE STOP LOSS CAME FIRST').toUpperCase();

    ctx.font = `900 ${width < 450 ? 18 : 22}px "${activeFont}", sans-serif`;
    ctx.textAlign = 'center';

    // Typing reveal for Headline
    const headlineProgress = Math.min(1, progress / 0.35);
    const charsToShow = Math.ceil(headline.length * headlineProgress);
    const displayedHeadline = headline.substring(0, charsToShow);

    ctx.fillStyle = isWhite ? '#09090B' : '#FFFFFF';
    ctx.fillText(displayedHeadline, width / 2, 72);

    // Subline
    const subline = sublineText || 'The entry came second. That order is the whole video.';
    const subProgress = Math.min(1, Math.max(0, (progress - 0.15) / 0.4));
    const subChars = Math.ceil(subline.length * subProgress);
    const displayedSubline = subline.substring(0, subChars);

    ctx.font = `600 ${width < 450 ? 11 : 13}px "${activeFont}", sans-serif`;
    ctx.fillStyle = isWhite ? '#4B5563' : '#94A3B8';
    ctx.fillText(displayedSubline, width / 2, 94);
    ctx.restore();

    // 4. MAIN VISUAL STAGE: Candlestick Setup Animation
    // Check if we have specific candles in store (e.g. from Brief or Builder)
    const hasStoreCandles = candles && candles.length > 2;

    if (hasStoreCandles) {
      // DYNAMIC MULTI-CANDLE WALK (e.g. XAUUSD Risk-First setup from Brief)
      const chartTop = 120;
      const chartBottom = height - 70;
      const chartHeight = chartBottom - chartTop;
      const chartLeft = 50;
      const chartRight = width - 50;
      const chartWidth = chartRight - chartLeft;

      // Price bounds
      const allPrices = candles.flatMap((c) => [c.high, c.low]);
      const minP = Math.min(...allPrices) - 2.0;
      const maxP = Math.max(...allPrices) + 3.0;
      const priceRange = maxP - minP;

      const toY = (p: number) => chartBottom - ((p - minP) / priceRange) * chartHeight;

      // Determine how many candles are revealed based on timeline
      const totalCandles = candles.length;
      const revealedCount = Math.max(1, Math.ceil(progress * totalCandles));
      const activeCandles = candles.slice(0, revealedCount);

      const candleSpacing = chartWidth / (totalCandles + 1);
      const cWidth = Math.min(26, candleSpacing * 0.65);

      // Draw Previous High Support Line ($4,128.00)
      const supportPrice = 4128.0;
      const supportY = toY(supportPrice);

      ctx.save();
      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(chartLeft, supportY);
      ctx.lineTo(chartRight, supportY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = 'bold 10px monospace';
      ctx.fillStyle = '#0284C7';
      ctx.fillText('Previous High Support ($4,128.00)', chartLeft + 8, supportY - 6);
      ctx.restore();

      // Render Candles
      activeCandles.forEach((c, i) => {
        const x = chartLeft + (i + 1) * candleSpacing;
        const centerX = x + cWidth / 2;

        const isBull = c.close >= c.open;
        const bullCol = isWhite ? '#10B981' : '#00F5A0';
        const bearCol = isWhite ? '#EF4444' : '#FF3366';
        const col = isBull ? bullCol : bearCol;

        const yHigh = toY(c.high);
        const yLow = toY(c.low);
        const yOpen = toY(c.open);
        const yClose = toY(c.close);

        const bodyTop = Math.min(yOpen, yClose);
        const bodyHeight = Math.max(3, Math.abs(yClose - yOpen));

        ctx.save();
        // Wick
        ctx.strokeStyle = col;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, yHigh);
        ctx.lineTo(centerX, yLow);
        ctx.stroke();

        // Body
        ctx.fillStyle = col;
        ctx.shadowColor = col;
        ctx.shadowBlur = isWhite ? 0 : 6;
        ctx.fillRect(x, bodyTop, cWidth, bodyHeight);
        ctx.restore();

        // Special tag on Rejection Entry Candle (Candle #5)
        if (i === 4 && revealedCount >= 5) {
          ctx.save();
          const badgeX = x - 20;
          const badgeY = yLow + 8;

          ctx.fillStyle = '#FEF3C7';
          ctx.strokeStyle = '#F59E0B';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(badgeX, badgeY, 130, 22, 6);
          ctx.fill();
          ctx.stroke();

          ctx.font = 'bold 9px monospace';
          ctx.fillStyle = '#92400E';
          ctx.fillText('ENTRY TRIGGER (SL: 20 pips)', badgeX + 6, badgeY + 14);
          ctx.restore();
        }
      });

      // Render Risk-First 1:3.5 RR Overlay when entry candle is reached
      if (revealedCount >= 5) {
        const entryIdx = 4;
        const entryX = chartLeft + (entryIdx + 1) * candleSpacing;
        const boxWidth = candleSpacing * 2.5;

        const entryY = toY(4134.5);
        const tpY = toY(4148.0);
        const slY = toY(4126.0);

        ctx.save();
        // Target Profit Zone (Green)
        ctx.fillStyle = isWhite ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0, 245, 160, 0.2)';
        ctx.fillRect(entryX, Math.min(entryY, tpY), boxWidth, Math.abs(tpY - entryY));

        // Risk Zone (Red)
        ctx.fillStyle = isWhite ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 51, 102, 0.2)';
        ctx.fillRect(entryX, Math.min(entryY, slY), boxWidth, Math.abs(slY - entryY));

        // Entry Horizontal Line
        ctx.strokeStyle = isWhite ? '#18181B' : '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(entryX, entryY);
        ctx.lineTo(entryX + boxWidth, entryY);
        ctx.stroke();

        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = isWhite ? '#065F46' : '#6EE7B7';
        ctx.fillText('TP: $4,148.00 (+1:3.5 RR)', entryX + 6, Math.min(entryY, tpY) + 14);

        ctx.fillStyle = isWhite ? '#991B1B' : '#FCA5A5';
        ctx.fillText('SL: $4,126.00 ($30 Budget)', entryX + 6, Math.max(entryY, slY) - 4);
        ctx.restore();
      }

      // Bottom 3-Step Badges matching Brief
      ctx.save();
      const badgeY = height - 42;
      const badgeW = (width - 80) / 3;

      const steps = [
        { label: '1. DEFINE LOSS ($30)', col: '#EF4444', active: progress >= 0.1 },
        { label: '2. FIND ENTRY (RESPECT SL)', col: '#38BDF8', active: progress >= 0.4 },
        { label: '3. SIZE ($1.50/PIP)', col: '#10B981', active: progress >= 0.7 },
      ];

      steps.forEach((s, idx) => {
        const bx = 40 + idx * badgeW;
        ctx.fillStyle = s.active ? (isWhite ? '#F3F4F6' : '#131B2A') : (isWhite ? '#F9FAFB' : '#0A0E17');
        ctx.strokeStyle = s.active ? s.col : '#334155';
        ctx.lineWidth = s.active ? 1.5 : 1;

        ctx.beginPath();
        ctx.roundRect(bx + 4, badgeY, badgeW - 8, 26, 6);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = s.active ? (isWhite ? '#0F172A' : '#FFFFFF') : '#64748B';
        ctx.textAlign = 'center';
        ctx.fillText(s.label, bx + badgeW / 2, badgeY + 16);
      });
      ctx.restore();

    } else {
      // CLASSIC 2-CANDLE LIQUIDITY SWEEP ANIMATION
      const centerX = width / 2;
      const stageCenterY = height * 0.46;

      const candleWidth = 36;
      const spacing = 46;
      const c1X = centerX - spacing;
      const c2X = centerX + spacing - candleWidth;

      // Phase 1: Bullish Candle
      const c1Progress = Math.min(1, progress / 0.35);
      const c1BodyHeight = 90 * c1Progress;
      const c1TopY = stageCenterY - 20 - c1BodyHeight * 0.5;
      const c1BottomY = c1TopY + c1BodyHeight;

      if (c1Progress > 0) {
        ctx.save();
        const bullColor = isWhite ? '#48BB78' : '#10B981';

        ctx.strokeStyle = bullColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(c1X + candleWidth / 2, c1TopY - 24 * c1Progress);
        ctx.lineTo(c1X + candleWidth / 2, c1BottomY + 16 * c1Progress);
        ctx.stroke();

        ctx.fillStyle = bullColor;
        ctx.shadowColor = bullColor;
        ctx.shadowBlur = isWhite ? 0 : 8;
        ctx.fillRect(c1X, c1TopY, candleWidth, c1BodyHeight);
        ctx.restore();
      }

      // Phase 2: Sweep & Rejection Candle
      if (progress > 0.3) {
        const c2Progress = Math.min(1, (progress - 0.3) / 0.65);
        const bearColor = isWhite ? '#18181B' : '#EF4444';

        const c2CurrentHigh = c1TopY + 20 - (70 * Math.min(1, c2Progress * 1.5));
        const c2BodyTop = stageCenterY - 10;
        const c2BodyHeight = Math.max(4, 100 * Math.max(0, (c2Progress - 0.3) / 0.7));

        ctx.save();
        ctx.strokeStyle = isWhite ? '#09090B' : '#F43F5E';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(c2X + candleWidth / 2, c2CurrentHigh);
        ctx.lineTo(c2X + candleWidth / 2, c2BodyTop + c2BodyHeight + 18);
        ctx.stroke();

        if (c2Progress > 0.25) {
          ctx.fillStyle = bearColor;
          ctx.shadowColor = bearColor;
          ctx.shadowBlur = isWhite ? 0 : 8;
          ctx.fillRect(c2X, c2BodyTop, candleWidth, c2BodyHeight);
        }

        if (c2Progress > 0.35) {
          ctx.strokeStyle = '#F59E0B';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([5, 4]);
          ctx.beginPath();
          ctx.moveTo(c1X - 30, c1TopY - 24);
          ctx.lineTo(c2X + candleWidth + 50, c1TopY - 24);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = '#FEF3C7';
          ctx.strokeStyle = '#F59E0B';
          ctx.lineWidth = 1;
          const tagX = c2X + candleWidth + 8;
          const tagY = c1TopY - 36;
          ctx.fillRect(tagX, tagY, 115, 20);
          ctx.strokeRect(tagX, tagY, 115, 20);

          ctx.font = 'bold 9px monospace';
          ctx.fillStyle = '#92400E';
          ctx.fillText('⚡ LIQUIDITY PURGED', tagX + 6, tagY + 14);
        }
        ctx.restore();
      }
    }

  }, [stageTheme, headlineText, sublineText, currentTime, duration, settings, candles, overlays]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 select-none overflow-hidden">
      {/* Central Canvas Container with 9:16 or 16:9 Aspect Ratio */}
      <div
        className={`relative transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden border flex items-center justify-center ${
          isWhite
            ? 'bg-white border-slate-200 shadow-slate-300/40'
            : 'bg-[#080C16] border-[#1E293B] shadow-indigo-950/30'
        } ${
          settings.aspectRatio === '9:16'
            ? 'w-[360px] h-[580px]'
            : settings.aspectRatio === '1:1'
            ? 'w-[520px] h-[520px]'
            : 'w-full max-w-[860px] h-[480px]'
        }`}
      >
        {/* Real HTML5 Canvas Element - Captured by Video Recorder! */}
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Quick Text Editor Bar below canvas for convenience */}
      <div className="w-full max-w-[560px] flex items-center gap-2 mt-3 bg-[#0E1422] border border-[#1E293B] rounded-xl px-3 py-1.5 shadow-sm">
        <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Headline:</span>
        <input
          type="text"
          value={headlineText}
          onChange={(e) => setHeadlineText(e.target.value)}
          placeholder="ENTER HEADLINE..."
          className="flex-1 bg-transparent text-xs text-white font-semibold focus:outline-none focus:text-indigo-300"
        />
        <span className="text-slate-600">|</span>
        <input
          type="text"
          value={sublineText}
          onChange={(e) => setSublineText(e.target.value)}
          placeholder="Enter subline..."
          className="flex-1 bg-transparent text-xs text-slate-300 focus:outline-none focus:text-indigo-300"
        />
      </div>
    </div>
  );
};
