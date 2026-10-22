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
      rad.addColorStop(0, 'rgba(99, 102, 241, 0.08)');
      rad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = rad;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Top Watermark Header
    ctx.save();
    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = isWhite ? 'rgba(0, 0, 0, 0.35)' : 'rgba(255, 255, 255, 0.35)';
    ctx.fillText(`${settings.symbol || 'XAUUSD'} · GOLD SPOT`, 32, 38);

    ctx.textAlign = 'right';
    ctx.fillText('LIQUIDITY SWEEP SETUP', width - 32, 38);
    ctx.restore();

    // 3. Animated Candlestick Liquidity Sweep Graphic
    const centerX = width / 2;
    const stageCenterY = height * 0.44;

    // Candlestick base parameters
    const candleWidth = 36;
    const spacing = 46;
    const c1X = centerX - spacing;
    const c2X = centerX + spacing - candleWidth;

    // Phase 1: Bullish Candle (grows from t = 0.0 to 0.35)
    const c1Progress = Math.min(1, progress / 0.35);
    const c1BodyHeight = 90 * c1Progress;
    const c1TopY = stageCenterY - 20 - c1BodyHeight * 0.5;
    const c1BottomY = c1TopY + c1BodyHeight;

    if (c1Progress > 0) {
      ctx.save();
      const bullColor = isWhite ? '#48BB78' : '#10B981';

      // Candle 1 Wick
      ctx.strokeStyle = bullColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(c1X + candleWidth / 2, c1TopY - 24 * c1Progress);
      ctx.lineTo(c1X + candleWidth / 2, c1BottomY + 16 * c1Progress);
      ctx.stroke();

      // Candle 1 Body
      ctx.fillStyle = bullColor;
      ctx.shadowColor = bullColor;
      ctx.shadowBlur = isWhite ? 0 : 8;
      ctx.fillRect(c1X, c1TopY, candleWidth, c1BodyHeight);
      ctx.restore();
    }

    // Phase 2 & 3: Sweep & Rejection Candle (emerges from t = 0.30 to 1.0)
    if (progress > 0.3) {
      const c2Progress = Math.min(1, (progress - 0.3) / 0.65);
      const bearColor = isWhite ? '#18181B' : '#EF4444';

      // Sweep Wick (rises fast to pierce above Candle 1's high)
      const sweepApexY = c1TopY - 50;
      const c2CurrentHigh = c1TopY + 20 - (70 * Math.min(1, c2Progress * 1.5));
      const c2BodyTop = stageCenterY - 10;
      const c2BodyHeight = Math.max(4, 100 * Math.max(0, (c2Progress - 0.3) / 0.7));

      ctx.save();
      // Candle 2 High Wick (The Liquidity Sweep)
      ctx.strokeStyle = isWhite ? '#09090B' : '#F43F5E';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(c2X + candleWidth / 2, c2CurrentHigh);
      ctx.lineTo(c2X + candleWidth / 2, c2BodyTop + c2BodyHeight + 18);
      ctx.stroke();

      // Candle 2 Body (Bearish Rejection downwards)
      if (c2Progress > 0.25) {
        ctx.fillStyle = bearColor;
        ctx.shadowColor = bearColor;
        ctx.shadowBlur = isWhite ? 0 : 8;
        ctx.fillRect(c2X, c2BodyTop, candleWidth, c2BodyHeight);
      }

      // Horizontal Dashed Sweep Level Line (Triggered when high is pierced)
      if (c2Progress > 0.35) {
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(c1X - 30, c1TopY - 24);
        ctx.lineTo(c2X + candleWidth + 50, c1TopY - 24);
        ctx.stroke();
        ctx.setLineDash([]);

        // "LIQUIDITY SWEPT" Tag Banner
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

    // 4. Headline Typography (Entering smoothly)
    ctx.save();
    const activeFont = settings.fontFamily || 'Montserrat';
    const headline = (headlineText || 'YOU STOP WATCHING THE SWEEP').toUpperCase();

    ctx.font = `900 ${width < 450 ? 18 : 24}px "${activeFont}", sans-serif`;
    ctx.textAlign = 'center';

    // Typing / Fade reveal for Headline
    const headlineProgress = Math.min(1, progress / 0.5);
    const charsToShow = Math.ceil(headline.length * headlineProgress);
    const displayedHeadline = headline.substring(0, charsToShow);

    ctx.fillStyle = isWhite ? '#09090B' : '#FFFFFF';
    ctx.fillText(displayedHeadline, centerX, height * 0.82);

    // 5. Subline Typography
    if (progress > 0.35) {
      const subline = sublineText || 'You start watching what happens after it';
      const subProgress = Math.min(1, (progress - 0.35) / 0.5);
      const subChars = Math.ceil(subline.length * subProgress);
      const displayedSubline = subline.substring(0, subChars);

      ctx.font = `500 ${width < 450 ? 12 : 14}px "${activeFont}", sans-serif`;
      ctx.fillStyle = isWhite ? '#4B5563' : '#94A3B8';
      ctx.fillText(displayedSubline, centerX, height * 0.89);
    }
    ctx.restore();

  }, [stageTheme, headlineText, sublineText, currentTime, duration, settings]);

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
