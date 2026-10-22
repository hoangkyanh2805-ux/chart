'use client';

import React, { useRef, useEffect } from 'react';
import { useChartStore } from '../store/useChartStore';

// Clean text auto-wrapping utility
function wrapTextLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

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

    // 2. Top Watermark & Compliance Pill (NO COLLISION - SPATIAL SEPARATION)
    ctx.save();
    // Left: Asset Tag
    ctx.font = 'bold 10px monospace';
    ctx.fillStyle = isWhite ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)';
    ctx.fillText(`${settings.symbol || 'XAUUSD'} · M15`, 20, 26);

    // Right: Compact Compliance Pill
    const pillW = 86;
    const pillH = 17;
    const pillX = width - pillW - 20;
    const pillY = 14;

    ctx.fillStyle = isWhite ? '#FEF3C7' : 'rgba(245, 158, 11, 0.15)';
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 4);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 8.5px monospace';
    ctx.fillStyle = isWhite ? '#92400E' : '#FBBF24';
    ctx.textAlign = 'center';
    ctx.fillText('ILLUSTRATION', pillX + pillW / 2, pillY + 12);
    ctx.restore();

    // 3. Headline & Subline Typography with Auto-Wrapping (NO CLIPPING)
    ctx.save();
    const activeFont = settings.fontFamily || 'Montserrat';
    const rawHeadline = (headlineText || 'THE STOP LOSS CAME FIRST').toUpperCase();

    // Responsive font scaling
    const isLongHeadline = rawHeadline.length > 32;
    const headFontSize = isLongHeadline ? 15 : 17;
    const headLineHeight = headFontSize + 5;
    ctx.font = `900 ${headFontSize}px "${activeFont}", sans-serif`;

    const maxTextWidth = width - 40;
    const headlineLines = wrapTextLines(ctx, rawHeadline, maxTextWidth).slice(0, 2); // Max 2 lines for punchy video

    // Typing / Reveal animation for Headline
    const totalChars = headlineLines.join(' ').length;
    const headlineProgress = Math.min(1, progress / 0.35);
    const charsToShow = Math.ceil(totalChars * headlineProgress);

    let charCounter = 0;
    const startY = 48;
    ctx.textAlign = 'center';
    ctx.fillStyle = isWhite ? '#09090B' : '#FFFFFF';

    headlineLines.forEach((line, lineIdx) => {
      const lineY = startY + lineIdx * headLineHeight;
      const remainingChars = Math.max(0, charsToShow - charCounter);
      const displayedLine = line.substring(0, remainingChars);
      ctx.fillText(displayedLine, width / 2, lineY);
      charCounter += line.length + 1;
    });

    // Subline
    const sublineStartY = startY + headlineLines.length * headLineHeight + 4;
    const rawSubline = sublineText || 'The entry came second. That order is the whole video.';
    ctx.font = `600 11px "${activeFont}", sans-serif`;
    const sublineLines = wrapTextLines(ctx, rawSubline, maxTextWidth).slice(0, 2);

    if (progress > 0.15) {
      ctx.fillStyle = isWhite ? '#4B5563' : '#94A3B8';
      sublineLines.forEach((sLine, sIdx) => {
        ctx.fillText(sLine, width / 2, sublineStartY + sIdx * 15);
      });
    }
    ctx.restore();

    // 4. MAIN VISUAL STAGE: Candlestick Setup Animation
    const hasStoreCandles = candles && candles.length > 2;

    if (hasStoreCandles) {
      // DYNAMIC MULTI-CANDLE WALK (Risk-First setup from Brief)
      const chartTop = sublineStartY + sublineLines.length * 15 + 18;
      const chartBottom = height - 52;
      const chartHeight = chartBottom - chartTop;
      const chartLeft = 32;
      const chartRight = width - 32;
      const chartWidth = chartRight - chartLeft;

      // Price bounds
      const allPrices = candles.flatMap((c) => [c.high, c.low]);
      const minP = Math.min(...allPrices) - 1.5;
      const maxP = Math.max(...allPrices) + 2.5;
      const priceRange = maxP - minP;

      const toY = (p: number) => chartBottom - ((p - minP) / priceRange) * chartHeight;

      const totalCandles = candles.length;
      const revealedCount = Math.max(1, Math.ceil(progress * totalCandles));
      const activeCandles = candles.slice(0, revealedCount);

      const candleSpacing = chartWidth / (totalCandles + 1);
      const cWidth = Math.min(22, candleSpacing * 0.65);

      // Previous High Support Line ($4,128.00)
      const supportPrice = 4128.0;
      const supportY = toY(supportPrice);

      ctx.save();
      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(chartLeft, supportY);
      ctx.lineTo(chartRight, supportY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Non-overlapping Support Pill Label on the Left Margin
      const supPillW = 100;
      const supPillH = 15;
      ctx.fillStyle = isWhite ? '#0284C7' : '#0369A1';
      ctx.beginPath();
      ctx.roundRect(chartLeft, supportY - 16, supPillW, supPillH, 3);
      ctx.fill();

      ctx.font = 'bold 8.5px monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.fillText('Support $4,128.00', chartLeft + 5, supportY - 5);
      ctx.restore();

      // Render Candles
      activeCandles.forEach((c, i) => {
        const x = chartLeft + (i + 1) * candleSpacing - cWidth / 2;
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
        ctx.shadowBlur = isWhite ? 0 : 5;
        ctx.fillRect(x, bodyTop, cWidth, bodyHeight);
        ctx.restore();
      });

      // Render Risk-First 1:3.5 RR Overlay when entry candle (#5) is reached
      if (revealedCount >= 5) {
        const entryIdx = 4;
        const entryX = chartLeft + (entryIdx + 1) * candleSpacing + cWidth / 2 + 4;
        const boxWidth = Math.min(105, chartRight - entryX);

        const entryY = toY(4128.0);
        const tpY = toY(4135.0);
        const slY = toY(4126.0);

        ctx.save();
        // Target Profit Zone (Green)
        ctx.fillStyle = isWhite ? 'rgba(16, 185, 129, 0.22)' : 'rgba(0, 245, 160, 0.22)';
        ctx.fillRect(entryX, tpY, boxWidth, entryY - tpY);

        // Risk Zone (Red)
        ctx.fillStyle = isWhite ? 'rgba(239, 68, 68, 0.22)' : 'rgba(255, 51, 102, 0.22)';
        ctx.fillRect(entryX, entryY, boxWidth, slY - entryY);

        // Entry Horizontal Line
        ctx.strokeStyle = isWhite ? '#18181B' : '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(entryX, entryY);
        ctx.lineTo(entryX + boxWidth, entryY);
        ctx.stroke();

        // Text inside boxes
        ctx.font = 'bold 8.5px monospace';
        ctx.fillStyle = isWhite ? '#065F46' : '#6EE7B7';
        ctx.fillText('TP: $4,135 (1:3.5)', entryX + 4, tpY + 12);

        ctx.fillStyle = isWhite ? '#991B1B' : '#FCA5A5';
        ctx.fillText('SL: $4,126 ($30)', entryX + 4, slY - 4);
        ctx.restore();
      }

      // Bottom 3-Step Stepper Badges (COMPACT, NO SMASHING, NO OVERLAP)
      ctx.save();
      const badgeY = height - 38;
      const availWidth = width - 40;
      const badgeW = Math.floor(availWidth / 3);

      const steps = [
        { label: '1. LOSS $30', col: '#EF4444', active: progress >= 0.1 },
        { label: '2. ENTRY SL', col: '#0284C7', active: progress >= 0.4 },
        { label: '3. SIZE $1.5', col: '#10B981', active: progress >= 0.7 },
      ];

      steps.forEach((s, idx) => {
        const bx = 20 + idx * badgeW;
        const bw = badgeW - 6;

        ctx.fillStyle = s.active ? (isWhite ? '#F1F5F9' : '#131B2A') : (isWhite ? '#F8FAFC' : '#0A0E17');
        ctx.strokeStyle = s.active ? s.col : '#334155';
        ctx.lineWidth = s.active ? 1.5 : 1;

        ctx.beginPath();
        ctx.roundRect(bx, badgeY, bw, 22, 5);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 8.5px monospace';
        ctx.fillStyle = s.active ? (isWhite ? '#0F172A' : '#FFFFFF') : '#64748B';
        ctx.textAlign = 'center';
        ctx.fillText(s.label, bx + bw / 2, badgeY + 14);
      });
      ctx.restore();

    } else {
      // CLASSIC 2-CANDLE LIQUIDITY SWEEP
      const centerX = width / 2;
      const stageCenterY = height * 0.48;

      const candleWidth = 32;
      const spacing = 42;
      const c1X = centerX - spacing;
      const c2X = centerX + spacing - candleWidth;

      const c1Progress = Math.min(1, progress / 0.35);
      const c1BodyHeight = 85 * c1Progress;
      const c1TopY = stageCenterY - 15 - c1BodyHeight * 0.5;
      const c1BottomY = c1TopY + c1BodyHeight;

      if (c1Progress > 0) {
        ctx.save();
        const bullColor = isWhite ? '#10B981' : '#00F5A0';
        ctx.strokeStyle = bullColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(c1X + candleWidth / 2, c1TopY - 20 * c1Progress);
        ctx.lineTo(c1X + candleWidth / 2, c1BottomY + 15 * c1Progress);
        ctx.stroke();

        ctx.fillStyle = bullColor;
        ctx.fillRect(c1X, c1TopY, candleWidth, c1BodyHeight);
        ctx.restore();
      }

      if (progress > 0.3) {
        const c2Progress = Math.min(1, (progress - 0.3) / 0.65);
        const bearColor = isWhite ? '#18181B' : '#FF3366';

        const c2CurrentHigh = c1TopY + 15 - (60 * Math.min(1, c2Progress * 1.5));
        const c2BodyTop = stageCenterY - 5;
        const c2BodyHeight = Math.max(4, 90 * Math.max(0, (c2Progress - 0.3) / 0.7));

        ctx.save();
        ctx.strokeStyle = isWhite ? '#09090B' : '#F43F5E';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(c2X + candleWidth / 2, c2CurrentHigh);
        ctx.lineTo(c2X + candleWidth / 2, c2BodyTop + c2BodyHeight + 15);
        ctx.stroke();

        if (c2Progress > 0.25) {
          ctx.fillStyle = bearColor;
          ctx.fillRect(c2X, c2BodyTop, candleWidth, c2BodyHeight);
        }

        if (c2Progress > 0.35) {
          ctx.strokeStyle = '#F59E0B';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([5, 4]);
          ctx.beginPath();
          ctx.moveTo(c1X - 25, c1TopY - 20);
          ctx.lineTo(c2X + candleWidth + 40, c1TopY - 20);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = '#FEF3C7';
          ctx.strokeStyle = '#F59E0B';
          ctx.lineWidth = 1;
          const tagX = c2X + candleWidth + 4;
          const tagY = c1TopY - 32;
          ctx.fillRect(tagX, tagY, 105, 18);
          ctx.strokeRect(tagX, tagY, 105, 18);

          ctx.font = 'bold 8px monospace';
          ctx.fillStyle = '#92400E';
          ctx.fillText('⚡ LIQUIDITY PURGED', tagX + 5, tagY + 12);
        }
        ctx.restore();
      }
    }

  }, [stageTheme, headlineText, sublineText, currentTime, duration, settings, candles, overlays]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 select-none overflow-hidden">
      {/* Central Canvas Container with 9:16 (360x640) Aspect Ratio */}
      <div
        className={`relative transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden border flex items-center justify-center ${
          isWhite
            ? 'bg-white border-slate-200 shadow-slate-300/40'
            : 'bg-[#080C16] border-[#1E293B] shadow-indigo-950/30'
        } ${
          settings.aspectRatio === '9:16'
            ? 'w-[360px] h-[640px]'
            : settings.aspectRatio === '1:1'
            ? 'w-[520px] h-[520px]'
            : 'w-full max-w-[860px] h-[480px]'
        }`}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Quick Text Editor Bar below canvas */}
      <div className="w-full max-w-[560px] flex items-center gap-2 mt-2.5 bg-[#0E1422] border border-[#1E293B] rounded-xl px-3 py-1.5 shadow-sm">
        <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Hook:</span>
        <input
          type="text"
          value={headlineText}
          onChange={(e) => setHeadlineText(e.target.value)}
          placeholder="ENTER HOOK..."
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
