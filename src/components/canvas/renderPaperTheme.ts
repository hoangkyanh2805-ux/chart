/**
 * REA + JEV Clean-Room Reproduction of YouTube Short:
 * URL: https://youtube.com/shorts/2W7MgNk3Wss
 * Channel: @marketanalysis-13
 * 
 * Strict replica of the parchment paper style, candlestick setup,
 * animated stylus pen, kinetic typography, FVG box, sweep circle,
 * long position tool, and branding.
 */

import { Candle, Overlay } from '../../types/chart';

export interface PaperThemeOptions {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  progress: number; // 0.0 to 1.0
  currentTime: number;
  duration: number;
  candles?: Candle[];
  overlays?: Overlay[];
  headlineText?: string;
  sublineText?: string;
}

// 17 exact sequence candles reconstructed frame-by-frame from 2W7MgNk3Wss
export const REA_ORIGINAL_CANDLES: Array<{
  open: number;
  high: number;
  low: number;
  close: number;
  phase: number; // when it appears (0.0 - 1.0)
}> = [
  // 1-5: Initial drop towards Daily Low
  { open: 4134.0, high: 4135.5, low: 4132.5, close: 4135.0, phase: 0.02 }, // Bullish
  { open: 4135.0, high: 4136.5, low: 4134.5, close: 4136.0, phase: 0.05 }, // Bullish
  { open: 4136.0, high: 4136.2, low: 4132.0, close: 4132.5, phase: 0.08 }, // Bearish
  { open: 4132.5, high: 4133.0, low: 4130.0, close: 4130.5, phase: 0.12 }, // Bearish
  { open: 4130.5, high: 4131.0, low: 4128.0, close: 4128.0, phase: 0.18 }, // Bearish touching Daily Low
  // 6: The Sweep Candle (wick pierces below Daily Low 4128)
  { open: 4128.0, high: 4129.0, low: 4125.2, close: 4127.2, phase: 0.28 }, // Sweep Low
  // 7-9: Reclaim back above Daily Low
  { open: 4127.2, high: 4129.6, low: 4127.0, close: 4129.5, phase: 0.38 }, // Reclaim green
  { open: 4129.5, high: 4130.8, low: 4129.2, close: 4130.5, phase: 0.44 }, // Small green
  { open: 4130.5, high: 4131.0, low: 4130.2, close: 4130.8, phase: 0.50 }, // Small base
  // 10-11: Market Structure Shift (MSS) impulse breaking Recent High
  { open: 4130.8, high: 4135.5, low: 4130.5, close: 4135.0, phase: 0.58 }, // Big MSS green
  { open: 4135.0, high: 4136.8, low: 4134.5, close: 4136.2, phase: 0.64 }, // Bullish follow-through
  // 12-13: Pullback into FVG zone
  { open: 4136.2, high: 4136.5, low: 4133.5, close: 4134.0, phase: 0.70 }, // Pullback red
  { open: 4134.0, high: 4134.5, low: 4132.0, close: 4132.5, phase: 0.74 }, // Pullback red into FVG
  // 14: Retest Sniper Candle (closes bullish rejection)
  { open: 4132.5, high: 4135.2, low: 4132.0, close: 4134.8, phase: 0.80 }, // Retest bounce green
  // 15-17: Bullish expansion to Daily High Target
  { open: 4134.8, high: 4138.0, low: 4134.5, close: 4137.5, phase: 0.86 }, // Green impulse
  { open: 4137.5, high: 4138.0, low: 4136.5, close: 4137.0, phase: 0.90 }, // Pause red
  { open: 4137.0, high: 4141.0, low: 4136.8, close: 4140.5, phase: 0.95 }, // Target blast green
];

/**
 * Draws the realistic floating Stylus Marker Pen
 * exactly as seen throughout 2W7MgNk3Wss
 */
function drawStylusPen(
  ctx: CanvasRenderingContext2D,
  tipX: number,
  tipY: number,
  angleRad: number = -0.75
) {
  ctx.save();
  ctx.translate(tipX, tipY);
  ctx.rotate(angleRad);

  // Pen Shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.28)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 4;

  // Pen Nib (Graphite Black, pointing at 0, 0)
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(3.5, 9);
  ctx.lineTo(-3.5, 9);
  ctx.closePath();
  ctx.fill();

  // Metallic Collar / Ferrule
  ctx.fillStyle = '#94A3B8';
  ctx.fillRect(-3.8, 9, 7.6, 5);

  // Pen Barrel (Dark Forest Green Stylus)
  ctx.fillStyle = '#143525';
  ctx.beginPath();
  ctx.roundRect(-4.5, 14, 9, 28, [0, 0, 4, 4]);
  ctx.fill();

  // Subtle highlight ridge on barrel
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.fillRect(-1.5, 15, 2.5, 24);

  ctx.restore();
  ctx.restore();
}

/**
 * Main Paper Theme Canvas Renderer for 2W7MgNk3Wss
 */
export function renderPaperTheme(opts: PaperThemeOptions) {
  const {
    ctx,
    width,
    height,
    progress,
    headlineText,
    sublineText,
  } = opts;

  // 1. Parchment Background (#E5C293 / #E6C191)
  ctx.fillStyle = '#E6C191';
  ctx.fillRect(0, 0, width, height);

  // Subtle center circular watermark
  const centerWatermarkY = height * 0.48;
  const watermarkRadius = width * 0.42;

  ctx.save();
  ctx.beginPath();
  ctx.arc(width / 2, centerWatermarkY, watermarkRadius, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(224, 185, 134, 0.45)';
  ctx.fill();

  // Faint logo watermark inside circle
  ctx.font = '900 24px Montserrat, sans-serif';
  ctx.fillStyle = 'rgba(210, 168, 115, 0.35)';
  ctx.textAlign = 'center';
  ctx.fillText('MARKET   ANALYSIS', width / 2, centerWatermarkY + 80);

  // 6 Faint candlestick bars in watermark
  const wmcX = width / 2;
  const wmHeights = [40, 50, 90, 45, 65, 40];
  const wmOffsets = [-35, -21, -7, 7, 21, 35];
  ctx.fillStyle = 'rgba(210, 168, 115, 0.3)';
  for (let i = 0; i < 6; i++) {
    const h = wmHeights[i];
    ctx.fillRect(wmcX + wmOffsets[i] - 4, centerWatermarkY - h / 2, 8, h);
  }
  ctx.restore();

  // 2. Top Header & Branding (Exact Candlestick Logo + MARKET ANALYSIS)
  ctx.save();
  const logoCenterX = width / 2;
  const logoY = 22;

  // 6 Candlestick bars: Red, Green, Center Tall Green, Red, Green, Red
  const logoBars = [
    { x: logoCenterX - 30, y: logoY + 12, w: 7, h: 30, col: '#DC2626' }, // 1: Red
    { x: logoCenterX - 18, y: logoY + 4, w: 7, h: 28, col: '#16A34A' }, // 2: Green
    { x: logoCenterX - 6, y: logoY - 10, w: 7, h: 68, col: '#10B981' }, // 3: Center tall green
    { x: logoCenterX + 6, y: logoY + 10, w: 7, h: 26, col: '#DC2626' }, // 4: Red
    { x: logoCenterX + 18, y: logoY + 2, w: 7, h: 36, col: '#16A34A' }, // 5: Green
    { x: logoCenterX + 30, y: logoY + 8, w: 7, h: 28, col: '#DC2626' }, // 6: Red
  ];

  logoBars.forEach((bar) => {
    ctx.fillStyle = bar.col;
    ctx.fillRect(bar.x, bar.y, bar.w, bar.h);
  });

  // White zig-zag line connecting candles with vertex dots
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(logoBars[0].x + 3.5, logoBars[0].y + 15);
  ctx.lineTo(logoBars[1].x + 3.5, logoBars[1].y + 6);
  ctx.lineTo(logoBars[2].x + 3.5, logoBars[2].y + 22);
  ctx.lineTo(logoBars[3].x + 3.5, logoBars[3].y + 18);
  ctx.lineTo(logoBars[4].x + 3.5, logoBars[4].y + 8);
  ctx.lineTo(logoBars[5].x + 3.5, logoBars[5].y + 12);
  ctx.stroke();

  // Dots at vertices
  ctx.fillStyle = '#FFFFFF';
  [
    { x: logoBars[0].x + 3.5, y: logoBars[0].y + 15 },
    { x: logoBars[1].x + 3.5, y: logoBars[1].y + 6 },
    { x: logoBars[2].x + 3.5, y: logoBars[2].y + 22 },
    { x: logoBars[3].x + 3.5, y: logoBars[3].y + 18 },
    { x: logoBars[4].x + 3.5, y: logoBars[4].y + 8 },
    { x: logoBars[5].x + 3.5, y: logoBars[5].y + 12 },
  ].forEach((pt) => {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
    ctx.fill();
  });

  // Text: MARKET | ANALYSIS
  ctx.font = '900 13px Montserrat, sans-serif';
  ctx.fillStyle = '#164E33';
  ctx.textAlign = 'right';
  ctx.fillText('MARKET', logoCenterX - 10, logoY + 70);

  ctx.textAlign = 'left';
  ctx.fillText('ANALYSIS', logoCenterX + 10, logoY + 70);
  ctx.restore();

  // 3. Kinetic 2-Line Headlines (Centered, Navy Line 1, Deep Blue Line 2)
  ctx.save();
  let line1 = 'BREAKOUT';
  let line2 = 'ENTRY?';

  // Check if user provided custom text
  const isCustomText =
    headlineText &&
    headlineText !== 'BREAKOUT TRAP: DONT BE LIQUIDITY' &&
    headlineText !== 'THE STOP LOSS CAME FIRST' &&
    headlineText !== 'BREAKOUT';

  if (isCustomText) {
    line1 = headlineText.toUpperCase();
    line2 = (sublineText || '').toUpperCase();
  } else {
    // Exact timeline progression from 2W7MgNk3Wss
    if (progress < 0.08) {
      line1 = 'BREAKOUT';
      line2 = 'ENTRY?';
    } else if (progress < 0.16) {
      line1 = 'LIQUIDITY';
      line2 = 'SWEEP.';
    } else if (progress < 0.24) {
      line1 = 'SAVE FOR';
      line2 = 'LATER.';
    } else if (progress < 0.36) {
      line1 = 'DAILY';
      line2 = 'HIGH + LOW.';
    } else if (progress < 0.48) {
      line1 = '15-MINUTE';
      line2 = 'WAIT.';
    } else if (progress < 0.58) {
      line1 = 'WAIT FOR';
      line2 = 'RECLAIM.';
    } else if (progress < 0.68) {
      line1 = 'MARKET STRUCTURE';
      line2 = 'SHIFT.';
    } else if (progress < 0.78) {
      line1 = 'FVG';
      line2 = 'ENTRY?';
    } else if (progress < 0.88) {
      line1 = 'RETEST.';
      line2 = 'BULLISH CLOSE.';
    } else {
      line1 = 'COMMENT';
      line2 = 'MSS OR FVG?';
    }
  }

  const headlineY = 120;
  ctx.textAlign = 'center';
  ctx.font = '900 20px Montserrat, sans-serif';

  // Line 1: Dark Slate / Black
  ctx.fillStyle = '#0F172A';
  ctx.fillText(line1, width / 2, headlineY);

  // Line 2: Deep Blue
  if (line2) {
    ctx.fillStyle = '#1D4ED8';
    ctx.fillText(line2, width / 2, headlineY + 26);

    // Blue Underline with Stylus Pen at the end
    const line2Metrics = ctx.measureText(line2);
    const underlineW = Math.min(width - 60, line2Metrics.width + 16);
    const underlineX1 = (width - underlineW) / 2;
    const underlineX2 = underlineX1 + underlineW;
    const underlineY = headlineY + 33;

    ctx.strokeStyle = '#1D4ED8';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(underlineX1, underlineY);
    ctx.lineTo(underlineX2, underlineY);
    ctx.stroke();

    // Stylus pen pointing at underline end when at start or end
    if (progress < 0.12 || progress > 0.9) {
      drawStylusPen(ctx, underlineX2 + 2, underlineY, -0.6);
    }
  }
  ctx.restore();

  // 4. Chart Geometry & Structural Levels
  const chartLeft = 38;
  const chartRight = width - 40;
  const yDailyHigh = height * 0.44; // ~280px
  const yDailyLow = height * 0.68; // ~435px
  const yRecentHigh = height * 0.58; // ~370px
  const ySweepLow = height * 0.73; // ~467px
  const yFvgTop = height * 0.60;
  const yFvgBottom = height * 0.65;
  const yEntry = yFvgBottom;

  // 4a. DAILY HIGH Line (Blue/Navy line + text on left)
  ctx.save();
  if (progress >= 0.24) {
    ctx.strokeStyle = '#1E3A5F';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(chartLeft, yDailyHigh);
    ctx.lineTo(chartRight, yDailyHigh);
    ctx.stroke();

    ctx.font = '900 11.5px Montserrat, sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'left';
    ctx.fillText('DAILY HIGH', chartLeft, yDailyHigh - 7);

    // If in Daily High reveal phase, show pen drawing the line
    if (progress >= 0.24 && progress <= 0.35) {
      const drawX = chartLeft + ((progress - 0.24) / 0.11) * (chartRight - chartLeft);
      drawStylusPen(ctx, drawX, yDailyHigh, -0.7);
    }
  }

  // 4b. DAILY LOW Line (Blue/Navy line + text on right)
  ctx.strokeStyle = '#1E3A5F';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(chartLeft, yDailyLow);
  ctx.lineTo(chartRight, yDailyLow);
  ctx.stroke();

  ctx.font = '900 11.5px Montserrat, sans-serif';
  ctx.fillStyle = '#0F172A';
  ctx.textAlign = 'right';
  ctx.fillText('DAILY LOW', chartRight, yDailyLow + 16);

  // Early Sell Trap in Phase 0.00 - 0.22
  if (progress <= 0.22) {
    const earlySellY = yDailyLow + 20;
    const earlySlY = yDailyLow - 14;

    // Red horizontal line
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(width * 0.58, earlySellY);
    ctx.lineTo(width * 0.82, earlySellY);
    ctx.stroke();

    ctx.font = '900 9.5px Montserrat, sans-serif';
    ctx.fillStyle = '#DC2626';
    ctx.textAlign = 'center';
    ctx.fillText('EARLY SELL', width * 0.70, earlySellY + 12);

    // Red dashed SL line
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(width * 0.60, earlySlY);
    ctx.lineTo(width * 0.84, earlySlY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillText('SL', width * 0.77, earlySlY - 4);
    drawStylusPen(ctx, width * 0.84, earlySlY, -0.65);
  }

  // 4c. RECENT HIGH Line (Appears around 0.48 for Market Structure Shift)
  if (progress >= 0.48) {
    ctx.strokeStyle = '#1D4ED8';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(chartLeft + 35, yRecentHigh);
    ctx.lineTo(chartLeft + 180, yRecentHigh);
    ctx.stroke();

    ctx.font = '900 10px Montserrat, sans-serif';
    ctx.fillStyle = '#1D4ED8';
    ctx.textAlign = 'left';
    ctx.fillText('RECENT HIGH', chartLeft + 40, yRecentHigh - 6);
  }

  // 4d. Sweep Wick Circle & STOP Line (When sweep candle appears)
  const sweepCandleX = chartLeft + 5 * ((chartRight - chartLeft) / 18) + 7;
  if (progress >= 0.36) {
    // Circle around lower wick
    ctx.strokeStyle = '#1E3A5F';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(sweepCandleX, ySweepLow - 4, 11, 0, Math.PI * 2);
    ctx.stroke();

    // Red horizontal line to the right
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(sweepCandleX + 11, ySweepLow - 4);
    ctx.lineTo(chartRight, ySweepLow - 4);
    ctx.stroke();

    // Bold red STOP text
    ctx.font = '900 11px Montserrat, sans-serif';
    ctx.fillStyle = '#DC2626';
    ctx.textAlign = 'center';
    ctx.fillText('STOP', sweepCandleX, ySweepLow + 18);
  }

  // 4e. FVG Box (Amber box between candle 1 high and candle 3 low)
  if (progress >= 0.68) {
    const fvgStartX = chartLeft + 9 * ((chartRight - chartLeft) / 18);
    const fvgWidth = chartRight - fvgStartX;
    const fvgH = yFvgBottom - yFvgTop;

    ctx.fillStyle = 'rgba(224, 160, 60, 0.28)';
    ctx.fillRect(fvgStartX, yFvgTop, fvgWidth, fvgH);

    ctx.strokeStyle = '#B47A2B';
    ctx.lineWidth = 1.8;
    ctx.strokeRect(fvgStartX, yFvgTop, fvgWidth, fvgH);

    ctx.font = '900 14px Montserrat, sans-serif';
    ctx.fillStyle = '#92400E';
    ctx.textAlign = 'right';
    ctx.fillText('FVG', chartRight - 12, yFvgTop + fvgH / 2 + 5);

    if (progress >= 0.68 && progress <= 0.76) {
      drawStylusPen(ctx, chartRight - 6, yFvgTop + 10, -0.7);
    }
  }

  // 4f. Long Position Tool (Profit Target & Entry Pill)
  if (progress >= 0.78) {
    const posStartX = chartLeft + 12 * ((chartRight - chartLeft) / 18);
    const posWidth = chartRight - posStartX;

    // Green Profit Box
    ctx.fillStyle = 'rgba(22, 163, 74, 0.25)';
    ctx.fillRect(posStartX, yDailyHigh, posWidth, yEntry - yDailyHigh);

    // Red Risk Box
    ctx.fillStyle = 'rgba(220, 38, 38, 0.22)';
    ctx.fillRect(posStartX, yEntry, posWidth, ySweepLow - 4 - yEntry);

    // Green Entry Line
    ctx.strokeStyle = '#15803D';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(posStartX, yEntry);
    ctx.lineTo(chartRight, yEntry);
    ctx.stroke();

    // Dark Green ENTRY Pill
    const pillW = 46;
    const pillH = 18;
    const pillX = chartRight - pillW - 6;
    const pillY = yEntry - pillH / 2;

    ctx.fillStyle = '#15803D';
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 4);
    ctx.fill();

    ctx.font = '900 9.5px Montserrat, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('ENTRY', pillX + pillW / 2, pillY + 12.5);

    // TARGET text above Daily High
    ctx.font = '900 13px Montserrat, sans-serif';
    ctx.fillStyle = '#15803D';
    ctx.textAlign = 'right';
    ctx.fillText('TARGET', chartRight, yDailyHigh - 9);

    if (progress >= 0.84 && progress <= 0.92) {
      drawStylusPen(ctx, pillX, yEntry, -0.65);
    }
  }
  ctx.restore();

  // 5. Candlesticks (Rendered based on progress)
  ctx.save();
  const candleSpacing = (chartRight - chartLeft) / 18;
  const candleWidth = 13;

  // Price conversion bounds
  const minPrice = 4125.0;
  const maxPrice = 4141.5;
  const priceRange = maxPrice - minPrice;
  const toY = (p: number) => ySweepLow + 4 - ((p - minPrice) / priceRange) * (ySweepLow + 4 - yDailyHigh);

  REA_ORIGINAL_CANDLES.forEach((c, idx) => {
    if (progress < c.phase) return;

    const cx = chartLeft + (idx + 1) * candleSpacing;
    const isBull = c.close >= c.open;
    const color = isBull ? '#16A34A' : '#DC2626';

    const highY = toY(c.high);
    const lowY = toY(c.low);
    const openY = toY(c.open);
    const closeY = toY(c.close);

    const bodyTop = Math.min(openY, closeY);
    const bodyHeight = Math.max(3.5, Math.abs(closeY - openY));

    // Wick
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(cx, highY);
    ctx.lineTo(cx, lowY);
    ctx.stroke();

    // Solid Body
    ctx.fillStyle = color;
    ctx.fillRect(cx - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
  });
  ctx.restore();

  // 6. Bottom Watermark: YouTube Icon + @marketanalysis-13
  ctx.save();
  const wmY = height - 42;
  const wmCenterX = width / 2;

  // Red YouTube Rounded Play Button
  const ytW = 32;
  const ytH = 22;
  const ytX = wmCenterX - 78;
  const ytY = wmY - 15;

  ctx.fillStyle = '#FF0000';
  ctx.beginPath();
  ctx.roundRect(ytX, ytY, ytW, ytH, 6);
  ctx.fill();

  // White play triangle inside
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(ytX + 12, ytY + 6);
  ctx.lineTo(ytX + 22, ytY + 11);
  ctx.lineTo(ytX + 12, ytY + 16);
  ctx.closePath();
  ctx.fill();

  // Username: @marketanalysis-13
  ctx.font = '700 13px Montserrat, sans-serif';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2.5;
  ctx.strokeText('@marketanalysis-13', wmCenterX - 36, wmY);

  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('@marketanalysis-13', wmCenterX - 36, wmY);
  ctx.restore();
}
