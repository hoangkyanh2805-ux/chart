'use client';

import React, { useRef, useEffect } from 'react';
import { useChartStore } from '../store/useChartStore';
import { ShieldCheck, Smartphone, Edit3, Check, Type, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

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
    badges,
    showSafeZones,
    setShowSafeZones,
    showCalloutPin,
    calloutPinText,
    calloutCandleIndex,
    showPipCounter,
    targetPips,
    showExecutionBadge,
    executionOrder,
    scriptSubtitles,
    showPhoneFrame,
    setShowPhoneFrame,
    showTikTokUIOverlay,
    setShowTikTokUIOverlay,
    beforeAfterMode,
    setBeforeAfterMode,
    validationReport,
    validateCurrentSetup,
    applyAutoNormalize,
  } = useChartStore();

  const [isEditingInline, setIsEditingInline] = React.useState<boolean>(false);

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

    // 2. Top Watermark & Compliance Pill (NO COLLISION - DYNAMIC ISLAND SAFE)
    ctx.save();
    // Left: Asset Tag
    ctx.font = 'bold 9.5px monospace';
    ctx.fillStyle = isWhite ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)';
    ctx.fillText(`${settings.symbol || 'XAUUSD'} · M15`, 18, 25);

    // Pre-Flight Semantic Integrity Pill (Positioned on Left side next to Asset tag, leaving center Dynamic Island 100% CLEAR)
    const isVerified = validationReport ? validationReport.isValid : true;
    const vPillW = isVerified ? 74 : 84;
    const vPillX = 105;
    const pillH = 17;
    const pillY = 13;

    ctx.fillStyle = isVerified
      ? (isWhite ? '#ECFDF5' : 'rgba(16, 185, 129, 0.16)')
      : (isWhite ? '#FEF2F2' : 'rgba(239, 68, 68, 0.18)');
    ctx.strokeStyle = isVerified ? '#10B981' : '#EF4444';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(vPillX, pillY, vPillW, pillH, 4);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 8px monospace';
    ctx.fillStyle = isVerified
      ? (isWhite ? '#065F46' : '#34D399')
      : (isWhite ? '#991B1B' : '#F87171');
    ctx.textAlign = 'center';
    ctx.fillText(isVerified ? '✓ VERIFIED' : '⚠️ LỆCH PHA', vPillX + vPillW / 2, pillY + 11.5);

    // Right: Compact Compliance Pill
    const pillW = 86;
    const pillX = width - pillW - 16;

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

      // Render Dynamic Overlays from Store (FVG, Liquidity Line, Long/Short, Order Block)
      overlays.forEach((overlay) => {
        if (overlay.startCandleIndex >= revealedCount) return;

        const effectiveEndIndex = Math.min(overlay.endCandleIndex, revealedCount - 1);
        const startX = chartLeft + (overlay.startCandleIndex + 1) * candleSpacing - cWidth / 2;
        const endX = chartLeft + (effectiveEndIndex + 1) * candleSpacing + cWidth / 2;

        const yTop = toY(Math.max(overlay.priceStart, overlay.priceEnd));
        const yBottom = toY(Math.min(overlay.priceStart, overlay.priceEnd));
        const boxHeight = Math.max(4, yBottom - yTop);
        const boxWidth = Math.max(cWidth * 2, endX - startX + cWidth);

        ctx.save();
        if (overlay.type === 'LIQUIDITY_LINE') {
          // Crisp dashed structural level line (Support / BSL / Retest)
          const yLine = toY(overlay.priceStart);
          ctx.strokeStyle = overlay.color || '#38BDF8';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([5, 4]);
          ctx.beginPath();
          ctx.moveTo(chartLeft, yLine);
          ctx.lineTo(chartRight, yLine);
          ctx.stroke();
          ctx.setLineDash([]);

          // Non-overlapping label pill on the left margin
          if (overlay.label) {
            ctx.font = 'bold 8.5px monospace';
            const metrics = ctx.measureText(overlay.label);
            const pillW = Math.min(130, metrics.width + 10);
            ctx.fillStyle = overlay.color || '#0284C7';
            ctx.beginPath();
            ctx.roundRect(chartLeft, yLine - 16, pillW, 15, 3);
            ctx.fill();

            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'left';
            ctx.fillText(overlay.label, chartLeft + 5, yLine - 5);
          }
        } else if (overlay.type === 'FVG') {
          // Fair Value Gap with 50% Consequent Encroachment (C.E.) Line
          // REA-Enriched: Glow Shimmer Effect when animated
          const fvgPulse = (Math.sin(currentTime * 3.5) + 1) / 2;
          ctx.fillStyle = isWhite
            ? `rgba(16, 185, 129, ${0.16 + fvgPulse * 0.08})`
            : `rgba(0, 245, 160, ${0.18 + fvgPulse * 0.12})`;
          ctx.fillRect(startX, yTop, boxWidth, boxHeight);

          ctx.strokeStyle = '#10B981';
          ctx.lineWidth = 1;
          ctx.strokeRect(startX, yTop, boxWidth, boxHeight);

          // 50% C.E. Dotted Line
          const midY = yTop + boxHeight / 2;
          ctx.setLineDash([4, 3]);
          ctx.strokeStyle = isWhite ? '#059669' : '#00F5A0';
          ctx.beginPath();
          ctx.moveTo(startX, midY);
          ctx.lineTo(startX + boxWidth, midY);
          ctx.stroke();
          ctx.setLineDash([]);

          if (overlay.label) {
            ctx.font = 'bold 8px monospace';
            ctx.fillStyle = isWhite ? '#065F46' : '#6EE7B7';
            ctx.fillText(overlay.label, startX + 4, yTop + 11);
          }
        } else if (overlay.type === 'ORDER_BLOCK') {
          // Order Block / Supply-Demand Zone
          ctx.fillStyle = isWhite ? 'rgba(239, 68, 68, 0.2)' : 'rgba(244, 63, 94, 0.22)';
          ctx.fillRect(startX, yTop, boxWidth, boxHeight);

          ctx.strokeStyle = '#EF4444';
          ctx.lineWidth = 1.2;
          ctx.strokeRect(startX, yTop, boxWidth, boxHeight);

          if (overlay.label) {
            ctx.font = 'bold 8px monospace';
            ctx.fillStyle = isWhite ? '#991B1B' : '#FCA5A5';
            ctx.fillText(overlay.label, startX + 4, yTop + 11);
          }
        } else if (overlay.type === 'LONG_SHORT') {
          // Risk:Reward Target & SL Boxes
          const isLong = overlay.priceEnd >= overlay.priceStart;
          const entryY = toY(overlay.priceStart);
          const tpY = toY(overlay.priceEnd);
          const slDistance = Math.abs(overlay.priceEnd - overlay.priceStart) / 3.5;
          const slPrice = isLong ? overlay.priceStart - slDistance : overlay.priceStart + slDistance;
          const slY = toY(slPrice);

          const rwBoxWidth = Math.min(105, chartRight - startX);

          // Profit Zone (Green)
          ctx.fillStyle = isWhite ? 'rgba(16, 185, 129, 0.22)' : 'rgba(0, 245, 160, 0.22)';
          ctx.fillRect(startX, Math.min(entryY, tpY), rwBoxWidth, Math.abs(tpY - entryY));

          // Risk Zone (Red)
          ctx.fillStyle = isWhite ? 'rgba(239, 68, 68, 0.22)' : 'rgba(255, 51, 102, 0.22)';
          ctx.fillRect(startX, Math.min(entryY, slY), rwBoxWidth, Math.abs(slY - entryY));

          // Entry Line
          ctx.strokeStyle = isWhite ? '#18181B' : '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(startX, entryY);
          ctx.lineTo(startX + rwBoxWidth, entryY);
          ctx.stroke();

          ctx.font = 'bold 8.5px monospace';
          ctx.fillStyle = isWhite ? '#065F46' : '#6EE7B7';
          ctx.fillText(`TP: $${overlay.priceEnd.toFixed(1)} (1:3.5)`, startX + 4, Math.min(entryY, tpY) + 11);

          ctx.fillStyle = isWhite ? '#991B1B' : '#FCA5A5';
          ctx.fillText(`SL: $${slPrice.toFixed(1)}`, startX + 4, Math.max(entryY, slY) - 4);
        }
        ctx.restore();
      });

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

      // 4b. Viral TikTok Callout Pin on Key Candle (e.g. Sweep Wick)
      const isBeforeState =
        beforeAfterMode === 'before' ||
        (beforeAfterMode === 'auto' && progress <= 0.38);

      const isAfterState =
        beforeAfterMode === 'after' ||
        (beforeAfterMode === 'auto' && progress > 0.38);

      // Render Before/After Badges & Messy Indicators
      if (beforeAfterMode && beforeAfterMode !== 'off') {
        ctx.save();
        const baBadgeX = chartLeft + 4;
        const baBadgeY = chartTop + 6;
        const baBadgeH = 22;

        if (isBeforeState) {
          // ❌ BEFORE: 99% RETAIL OVERLOAD BADGE
          const beforeText = '❌ BEFORE: 99% RETAIL OVERLOAD';
          ctx.font = 'bold 9px monospace';
          const bMetrics = ctx.measureText(beforeText);
          const baBadgeW = bMetrics.width + 14;

          ctx.fillStyle = isWhite ? '#FEF2F2' : 'rgba(239, 68, 68, 0.25)';
          ctx.strokeStyle = '#EF4444';
          ctx.lineWidth = 1.2;
          ctx.shadowColor = 'rgba(239, 68, 68, 0.4)';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.roundRect(baBadgeX, baBadgeY, baBadgeW, baBadgeH, 5);
          ctx.fill();
          ctx.stroke();
          ctx.shadowBlur = 0;

          ctx.fillStyle = '#EF4444';
          ctx.textAlign = 'left';
          ctx.fillText(beforeText, baBadgeX + 7, baBadgeY + 14.5);

          // DRAW MESSY INDICATORS (Simulating Cluttered Retail Chart)
          // 1. EMA 20 (Wavy Orange Curve)
          ctx.strokeStyle = '#F97316';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          candles.slice(0, revealedCount).forEach((c, idx) => {
            const cx = chartLeft + (idx + 1) * candleSpacing;
            const cy = toY(c.close + Math.sin(idx * 1.5) * 5);
            if (idx === 0) ctx.moveTo(cx, cy);
            else ctx.lineTo(cx, cy);
          });
          ctx.stroke();

          // 2. EMA 50 (Purple Dashed Curve)
          ctx.strokeStyle = '#A855F7';
          ctx.lineWidth = 1.8;
          ctx.setLineDash([4, 3]);
          ctx.beginPath();
          candles.slice(0, revealedCount).forEach((c, idx) => {
            const cx = chartLeft + (idx + 1) * candleSpacing;
            const cy = toY(c.open - Math.cos(idx * 1.2) * 6);
            if (idx === 0) ctx.moveTo(cx, cy);
            else ctx.lineTo(cx, cy);
          });
          ctx.stroke();
          ctx.setLineDash([]);

          // 3. Confusing FVG Box Overlay
          if (revealedCount >= 3) {
            const fvgX = chartLeft + 1 * candleSpacing;
            const fvgW = 2.5 * candleSpacing;
            const fvgY = toY(candles[1].high + 3);
            const fvgH = Math.max(20, Math.abs(toY(candles[0].low - 2) - fvgY));

            ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
            ctx.lineWidth = 1;
            ctx.strokeRect(fvgX, fvgY, fvgW, fvgH);
            ctx.fillRect(fvgX, fvgY, fvgW, fvgH);

            ctx.font = 'bold 7.5px monospace';
            ctx.fillStyle = '#DC2626';
            ctx.textAlign = 'left';
            ctx.fillText('⚠️ CONFUSING FVG / OVERLOAD', fvgX + 4, fvgY + 12);
          }

          // 4. Overbought Indicator Tag
          const indW = 155;
          const indH = 18;
          const indX = width - indW - 24;
          const indY = chartTop + chartHeight - 24;
          ctx.fillStyle = isWhite ? 'rgba(254, 242, 242, 0.95)' : 'rgba(15, 23, 42, 0.9)';
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(indX, indY, indW, indH, 4);
          ctx.fill();
          ctx.stroke();
          ctx.font = 'bold 7.5px monospace';
          ctx.fillStyle = '#EF4444';
          ctx.textAlign = 'center';
          ctx.fillText('RSI: 78.4 (OB) | MACD: DIVERGENCE', indX + indW / 2, indY + 12);
        } else if (isAfterState) {
          // ✅ AFTER: CLEAN PRICE ACTION BADGE
          const afterText = '✅ AFTER: CLEAN PRICE ACTION';
          ctx.font = 'bold 9px monospace';
          const aMetrics = ctx.measureText(afterText);
          const baBadgeW = aMetrics.width + 14;

          ctx.fillStyle = isWhite ? '#ECFDF5' : 'rgba(16, 185, 129, 0.2)';
          ctx.strokeStyle = '#10B981';
          ctx.lineWidth = 1.2;
          ctx.shadowColor = 'rgba(16, 185, 129, 0.4)';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.roundRect(baBadgeX, baBadgeY, baBadgeW, baBadgeH, 5);
          ctx.fill();
          ctx.stroke();
          ctx.shadowBlur = 0;

          ctx.fillStyle = isWhite ? '#065F46' : '#10B981';
          ctx.textAlign = 'left';
          ctx.fillText(afterText, baBadgeX + 7, baBadgeY + 14.5);
        }
        ctx.restore();
      }

      if (showCalloutPin && candles.length > calloutCandleIndex && calloutCandleIndex < revealedCount && !isBeforeState) {
        const pinCandle = candles[calloutCandleIndex];
        const pinX = chartLeft + (calloutCandleIndex + 1) * candleSpacing;
        const pinY = toY(pinCandle.high);

        ctx.save();
        // Pulsing radar ripple
        const pulse = (Math.sin(currentTime * 5) + 1) / 2; // 0..1
        const ringRadius = 7 + pulse * 8;
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.85 - pulse * 0.45;
        ctx.beginPath();
        ctx.arc(pinX, pinY, ringRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Solid center dot
        ctx.fillStyle = '#F59E0B';
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(pinX, pinY, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Pointer line up & badge pill (Elevated by 40px to prevent colliding with Entry / Risk-Reward labels)
        const pillText = calloutPinText || '🎯 BẪY DỤ BUY QUÉT ĐỈNH';
        ctx.font = 'bold 8.5px monospace';
        const pillMetrics = ctx.measureText(pillText);
        const cpWidth = pillMetrics.width + 16;
        const cpHeight = 20;
        const cpX = Math.max(14, Math.min(width - cpWidth - 14, pinX - cpWidth / 2));
        const cpY = Math.max(68, pinY - 40);

        // Connecting line
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(pinX, pinY - 4);
        ctx.lineTo(cpX + cpWidth / 2, cpY + cpHeight);
        ctx.stroke();

        // Badge container
        ctx.fillStyle = isWhite ? '#FEF3C7' : 'rgba(15, 23, 42, 0.95)';
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1.2;
        ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.roundRect(cpX, cpY, cpWidth, cpHeight, 5);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = isWhite ? '#92400E' : '#FDE047';
        ctx.textAlign = 'center';
        ctx.fillText(pillText, cpX + cpWidth / 2, cpY + 13.5);
        ctx.restore();
      }

      // 4c. Live Pip Counter Badge (Floating top-right inside chart)
      if (showPipCounter && progress > 0.3 && !isBeforeState) {
        ctx.save();
        const pipRatio = Math.min(1, Math.max(0, (progress - 0.3) / 0.7));
        const currentPips = progress >= 0.95 ? (targetPips || 70) : Math.round((targetPips || 70) * pipRatio);

        const badgeW = 92;
        const badgeH = 24;
        const badgeX = width - badgeW - 24;
        const badgeY = chartTop + 6;

        ctx.fillStyle = isWhite ? '#ECFDF5' : 'rgba(15, 23, 42, 0.94)';
        ctx.strokeStyle = '#00F5A0';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = 'rgba(0, 245, 160, 0.4)';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 6);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.font = '900 11px monospace';
        ctx.fillStyle = isWhite ? '#065F46' : '#00F5A0';
        ctx.textAlign = 'center';
        ctx.fillText(`+${currentPips} PIPS 🚀`, badgeX + badgeW / 2, badgeY + 16);
        ctx.restore();
      }

      // 4d. Trade Execution Order Pill (Positioned cleanly right above Subtitle Box - Zero Overlap)
      if (showExecutionBadge && executionOrder && progress > 0.45 && !isBeforeState) {
        ctx.save();
        const isSell = executionOrder.type === 'SELL';
        const badgeW = 155;
        const badgeH = 30;
        const bx = 20;
        const by = height - 78 - badgeH - 4; // Exactly 4px above the subtitle teleprompter box!

        ctx.fillStyle = isWhite ? 'rgba(248, 250, 252, 0.96)' : 'rgba(15, 23, 42, 0.96)';
        ctx.strokeStyle = isSell ? '#FF3366' : '#00F5A0';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(bx, by, badgeW, badgeH, 5);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 8.5px monospace';
        ctx.fillStyle = isSell ? (isWhite ? '#991B1B' : '#FF3366') : (isWhite ? '#065F46' : '#00F5A0');
        ctx.textAlign = 'left';
        ctx.fillText(`${executionOrder.type} ${executionOrder.lot} LOT @ ${executionOrder.entry.toFixed(1)}`, bx + 7, by + 11.5);

        ctx.font = '7.5px monospace';
        ctx.fillStyle = isWhite ? '#475569' : '#94A3B8';
        ctx.fillText(`SL: $${executionOrder.sl.toFixed(1)} ($${executionOrder.risk}) · TP: $${executionOrder.tp.toFixed(1)}`, bx + 7, by + 23);
        ctx.restore();
      }

      // 4e. Dynamic Kinetic Teleprompter Subtitles (Bottom Third Safe Zone)
      if (scriptSubtitles && scriptSubtitles.length > 0) {
        let activeSub = scriptSubtitles[0];
        for (const sub of scriptSubtitles) {
          if (progress >= sub.timePercent) {
            activeSub = sub;
          }
        }

        if (activeSub) {
          ctx.save();
          const subW = width - 40;
          const subH = 34;
          const subX = 20;
          const subY = height - 78;

          ctx.fillStyle = isWhite ? 'rgba(255, 255, 255, 0.95)' : 'rgba(11, 15, 25, 0.92)';
          ctx.strokeStyle = isWhite ? '#CBD5E1' : 'rgba(99, 102, 241, 0.35)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(subX, subY, subW, subH, 6);
          ctx.fill();
          ctx.stroke();

          // Stage tag
          if (activeSub.stageName) {
            ctx.font = 'bold 7px monospace';
            ctx.fillStyle = '#F59E0B';
            ctx.textAlign = 'left';
            ctx.fillText(`[${activeSub.stageName.toUpperCase()}]`, subX + 7, subY + 11);
          }

          // Subtitle text (auto-wrapped)
          ctx.font = `600 9px "${activeFont}", sans-serif`;
          ctx.fillStyle = isWhite ? '#0F172A' : '#F8FAFC';
          ctx.textAlign = 'left';
          const maxTextW = subW - 14;
          const subLines = wrapTextLines(ctx, activeSub.text, maxTextW).slice(0, 2);
          subLines.forEach((l, idx) => {
            ctx.fillText(l, subX + 7, subY + (activeSub.stageName ? 22 : 15) + idx * 10);
          });
          ctx.restore();
        }
      }

      // Bottom 3-Step Stepper Badges (COMPACT, NO SMASHING, NO OVERLAP)
      ctx.save();
      const badgeY = height - 38;
      const availWidth = width - 40;
      const badgeW = Math.floor(availWidth / 3);

      const currentBadges = badges || ['1. LOSS $30', '2. ENTRY SL 20p', '3. SIZE $1.5'];
      const steps = [
        { label: currentBadges[0] || '1. LOSS $30', col: '#EF4444', active: progress >= 0.1 },
        { label: currentBadges[1] || '2. ENTRY SL', col: '#0284C7', active: progress >= 0.4 },
        { label: currentBadges[2] || '3. SIZE $1.5', col: '#10B981', active: progress >= 0.7 },
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

    // 7. Optional 9:16 Safe Zones Overlay (YouTube Shorts / TikTok UI clearance)
    if (showSafeZones && settings.aspectRatio === '9:16') {
      ctx.save();
      ctx.strokeStyle = isWhite ? 'rgba(239, 68, 68, 0.6)' : 'rgba(244, 63, 94, 0.5)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      // Top margin (70px header clearance)
      ctx.beginPath();
      ctx.moveTo(0, 70);
      ctx.lineTo(width, 70);
      ctx.stroke();

      // Bottom margin (100px captions/sound clearance)
      const bottomSafeY = height - 100;
      ctx.beginPath();
      ctx.moveTo(0, bottomSafeY);
      ctx.lineTo(width, bottomSafeY);
      ctx.stroke();

      // Right margin (50px like/comment buttons clearance)
      const rightSafeX = width - 50;
      ctx.beginPath();
      ctx.moveTo(rightSafeX, 70);
      ctx.lineTo(rightSafeX, bottomSafeY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = 'bold 8px monospace';
      ctx.fillStyle = isWhite ? '#DC2626' : '#FB7185';
      ctx.fillText('9:16 SAFE: TOP (70px)', 12, 65);
      ctx.fillText('9:16 SAFE: BOTTOM (100px)', 12, bottomSafeY + 12);
      ctx.restore();
    }

    // 8. Optional TikTok UI Simulation Overlay
    if (showTikTokUIOverlay && settings.aspectRatio === '9:16') {
      ctx.save();
      const rightX = width - 24;
      const startActionY = height * 0.44;

      // Right action rail
      const actions = [
        { icon: '❤️', count: '14.2K' },
        { icon: '💬', count: '382' },
        { icon: '⭐', count: '1.2K' },
        { icon: '↗️', count: '540' },
      ];

      actions.forEach((act, idx) => {
        const itemY = startActionY + idx * 36;
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(act.icon, rightX, itemY);

        ctx.font = 'bold 7px monospace';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(act.count, rightX, itemY + 11);
      });

      // Bottom Author Tag & Audio Title
      ctx.font = 'bold 9.5px Montserrat, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.fillText('@hexagold_vn ✓', 16, height - 98);

      ctx.font = '8px Montserrat, sans-serif';
      ctx.fillStyle = '#CBD5E1';
      ctx.fillText('🎵 Âm thanh gốc - Phân tích Vàng SMC', 16, height - 86);
      ctx.restore();
    }

  }, [
    stageTheme,
    headlineText,
    sublineText,
    currentTime,
    duration,
    settings,
    candles,
    overlays,
    badges,
    showSafeZones,
    showCalloutPin,
    calloutPinText,
    calloutCandleIndex,
    showPipCounter,
    targetPips,
    showExecutionBadge,
    executionOrder,
    scriptSubtitles,
    showTikTokUIOverlay,
  ]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 select-none overflow-hidden">
      {/* Central Canvas Container with 9:16 (360x640) Aspect Ratio */}
      <div
        onDoubleClick={() => setIsEditingInline(true)}
        className={`relative transition-all duration-300 shadow-2xl flex items-center justify-center ${
          settings.aspectRatio === '9:16' && showPhoneFrame
            ? 'w-[368px] h-[648px] rounded-[36px] border-[6px] border-[#242E42] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 p-1 bg-[#05080E]'
            : `rounded-2xl overflow-hidden border ${
                isWhite
                  ? 'bg-white border-slate-200 shadow-slate-300/40'
                  : 'bg-[#080C16] border-[#1E293B] shadow-indigo-950/30'
              } ${
                settings.aspectRatio === '9:16'
                  ? 'w-[360px] h-[640px]'
                  : settings.aspectRatio === '1:1'
                  ? 'w-[520px] h-[520px]'
                  : 'w-full max-w-[860px] h-[480px]'
              }`
        }`}
      >
        {/* Dynamic Island on Phone Bezel */}
        {settings.aspectRatio === '9:16' && showPhoneFrame && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-black/90 rounded-full z-40 flex items-center justify-center gap-2 pointer-events-none border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-[#1E293B]" />
            <div className="w-1 h-1 rounded-full bg-emerald-500/70" />
          </div>
        )}

        <canvas
          ref={canvasRef}
          className={`w-full h-full block cursor-pointer ${
            settings.aspectRatio === '9:16' && showPhoneFrame ? 'rounded-[28px]' : ''
          }`}
        />

        {/* Floating Quick Inline Edit Trigger Button on Canvas (Only shown when not in phone frame to keep frame clean) */}
        {!showPhoneFrame && (
          <button
            type="button"
            onClick={() => setIsEditingInline(!isEditingInline)}
            title="Nhấp đúp chuột vào canvas hoặc bấm đây để sửa chữ trực tiếp"
            className={`absolute top-3 right-3 z-30 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition shadow-lg backdrop-blur-md border ${
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
                <span>Sửa Chữ</span>
              </>
            )}
          </button>
        )}

        {/* Direct In-Place Text Editor Overlay */}
        {isEditingInline && (
          <div className="absolute top-10 inset-x-4 z-20 bg-black/90 backdrop-blur-md border border-amber-500/60 rounded-xl p-3.5 shadow-2xl flex flex-col gap-2.5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between text-[10px] font-mono text-amber-400 font-bold border-b border-white/10 pb-1">
              <span className="flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5" />
                <span>TRÌNH SỬA CHỮ TRỰC TIẾP TRÊN CANVAS</span>
              </span>
              <span className="text-slate-400 text-[9px]">Esc để thoát</span>
            </div>

            <div>
              <span className="text-[9px] font-mono text-slate-400 block mb-0.5 font-bold">
                TIÊU ĐỀ HOOK 0-3S (IN HOA):
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

        {settings.aspectRatio === '9:16' && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => setShowPhoneFrame(!showPhoneFrame)}
              title="Khung viền điện thoại Smartphone 9:16"
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono transition border select-none ${
                showPhoneFrame
                  ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                  : 'bg-black/30 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              <Smartphone className="w-3 h-3 text-indigo-400" />
              <span>Viền ĐT</span>
            </button>

            <button
              type="button"
              onClick={() => setShowTikTokUIOverlay(!showTikTokUIOverlay)}
              title="Mô phỏng icon tương tác TikTok (Like, Share, Audio)"
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono transition border select-none ${
                showTikTokUIOverlay
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-black/30 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              <span>TikTok UI</span>
            </button>

            <button
              type="button"
              onClick={() => setIsEditingInline(!isEditingInline)}
              title="Sửa tiêu đề Hook và mô tả trực tiếp trên canvas (hoặc nhấp đúp vào hình)"
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono transition border select-none ${
                isEditingInline
                  ? 'bg-amber-500 text-black border-amber-400 font-bold'
                  : 'bg-black/30 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              <Edit3 className="w-3 h-3 text-amber-400" />
              <span>Sửa Chữ</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSafeZones(!showSafeZones)}
              title="Bật/Tắt đường căn lề Safe Zones cho TikTok / YouTube Shorts"
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono transition border select-none ${
                showSafeZones
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-black/30 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-rose-400" />
              <span>Safe Zones</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const nextMode: Record<string, 'auto' | 'before' | 'after' | 'off'> = {
                  off: 'auto',
                  auto: 'before',
                  before: 'after',
                  after: 'off',
                };
                setBeforeAfterMode(nextMode[beforeAfterMode || 'off'] || 'auto');
              }}
              title="Chế độ So Sánh Before / After (Bấm để đổi: Auto -> Ép Before -> Ép After -> Tắt)"
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono transition border select-none ${
                beforeAfterMode === 'auto'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                  : beforeAfterMode === 'before'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm'
                  : beforeAfterMode === 'after'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                  : 'bg-black/30 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              <RefreshCw className="w-3 h-3 text-amber-400" />
              <span>
                {beforeAfterMode === 'auto' && '🔄 Auto (B➔A)'}
                {beforeAfterMode === 'before' && '❌ Before'}
                {beforeAfterMode === 'after' && '✅ After'}
                {(!beforeAfterMode || beforeAfterMode === 'off') && '🔄 B/A: Tắt'}
              </span>
            </button>

            <button
              type="button"
              onClick={applyAutoNormalize}
              title="Tự động đối soát và chuẩn hóa SL, TP, hướng lệnh khớp 100% với tiêu đề"
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono transition border select-none bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30 active:scale-95 shadow-sm"
            >
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span>{validationReport?.isValid ? 'Chuẩn 100%' : '⚡ Tự Cân Chỉnh'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
