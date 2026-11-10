import { FrozenScene, FrameReceipt, Candle, Gap } from './contracts';
import { PROFILE_WIDTH, PROFILE_HEIGHT, SAFE_ZONES, priceToY } from './layout';
import { THEMES } from './themes';

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  scene: FrozenScene,
  frameIndex: number
): FrameReceipt {
  if (!Number.isInteger(frameIndex) || frameIndex < 0 || frameIndex >= scene.frameCount) {
    throw new Error(`Frame index ${frameIndex} out of bounds [0, ${scene.frameCount})`);
  }

  const theme = THEMES[scene.draft.theme] || THEMES.paper;
  const visibleIds: string[] = [];
  const bounds: { id: string; x: number; y: number; width: number; height: number }[] = [];

  // 1. Clear background
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, PROFILE_WIDTH, PROFILE_HEIGHT);

  // 2. Identify active narration cue
  const activeCue = scene.cues.find(
    (c) => frameIndex >= c.startFrame && frameIndex < c.endFrame
  ) || scene.cues[scene.cues.length - 1];

  if (activeCue) {
    visibleIds.push(`cue:${activeCue.id}`);
  }

  // 3. Accumulate active events fired up to this frame
  const visibleCandleIds = new Set<string>();
  const visibleOverlayIds = new Set<string>();
  let activeText: string | null = null;
  let showBudget = false;
  let currentOutcome: string | null = null;

  for (const event of scene.events) {
    if (event.frame <= frameIndex) {
      const act = event.action;
      if (act.kind === 'REVEAL_CANDLES') {
        act.candleIds.forEach((id) => visibleCandleIds.add(id));
      } else if (act.kind === 'SHOW_OVERLAY') {
        visibleOverlayIds.add(act.overlayId);
      } else if (act.kind === 'SHOW_TEXT') {
        activeText = act.text;
      } else if (act.kind === 'SHOW_BUDGET') {
        showBudget = true;
      } else if (act.kind === 'MARK_OUTCOME') {
        currentOutcome = act.outcome;
      }
    }
  }

  // 4. Draw Headline Zone (y = 160..340)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = theme.textPrimary;
  ctx.font = '900 48px sans-serif';
  const headline = (scene.draft.headline || 'RISK-FIRST XAUUSD').toUpperCase();
  ctx.fillText(headline, PROFILE_WIDTH / 2, 230);

  ctx.fillStyle = theme.textSecondary;
  ctx.font = '700 32px sans-serif';
  const subline = (scene.draft.subline || 'DEFINE LOSS BEFORE ENTRY').toUpperCase();
  ctx.fillText(subline, PROFILE_WIDTH / 2, 290);
  ctx.restore();
  bounds.push({ id: 'headline', x: SAFE_ZONES.horizontal.left, y: 160, width: SAFE_ZONES.horizontal.width, height: 180 });

  // 5. Draw Chart Zone (y = 390..1160)
  const visibleCandles: Candle[] = scene.draft.candles.filter((c) => visibleCandleIds.has(c.id));
  visibleCandles.forEach((c) => visibleIds.push(`candle:${c.id}`));
  visibleOverlayIds.forEach((id) => visibleIds.push(`overlay:${id}`));

  if (visibleCandles.length > 0) {
    let minPrice = Math.min(...visibleCandles.map((c) => c.low));
    let maxPrice = Math.max(...visibleCandles.map((c) => c.high));

    // Include overlay prices in range if visible
    for (const ov of scene.draft.overlays) {
      if (visibleOverlayIds.has(ov.id)) {
        if (ov.kind === 'LEVEL') {
          minPrice = Math.min(minPrice, ov.price - 1.0);
          maxPrice = Math.max(maxPrice, ov.price + 1.0);
        } else if (ov.kind === 'FVG') {
          minPrice = Math.min(minPrice, ov.low - 1.0);
          maxPrice = Math.max(maxPrice, ov.high + 1.0);
        }
      }
    }

    // Add 10% breathing room
    const padding = Math.max(1.0, (maxPrice - minPrice) * 0.15);
    const box = {
      top: SAFE_ZONES.chart.top + 40,
      bottom: SAFE_ZONES.chart.bottom - 40,
      min: minPrice - padding,
      max: maxPrice + padding,
    };

    // Draw Overlays first (behind candles)
    for (const ov of scene.draft.overlays) {
      if (visibleOverlayIds.has(ov.id)) {
        if (ov.kind === 'LEVEL') {
          const yLvl = priceToY(ov.price, box);
          ctx.save();
          ctx.strokeStyle = theme.supportLevel;
          ctx.lineWidth = 3;
          ctx.setLineDash([8, 6]);
          ctx.beginPath();
          ctx.moveTo(SAFE_ZONES.chart.left, yLvl);
          ctx.lineTo(SAFE_ZONES.chart.right, yLvl);
          ctx.stroke();

          ctx.font = '700 24px sans-serif';
          ctx.fillStyle = theme.supportLevel;
          ctx.textAlign = 'left';
          ctx.fillText(ov.label, SAFE_ZONES.chart.left + 16, yLvl - 10);
          ctx.restore();
        } else if (ov.kind === 'FVG') {
          const gap = ov as Gap;
          const yTop = priceToY(gap.high, box);
          const yBottom = priceToY(gap.low, box);
          const fvgH = yBottom - yTop;
          ctx.save();
          ctx.fillStyle = theme.fvgBoxFill;
          ctx.fillRect(SAFE_ZONES.chart.left, yTop, SAFE_ZONES.chart.right - SAFE_ZONES.chart.left, fvgH);
          ctx.strokeStyle = theme.fvgBoxStroke;
          ctx.lineWidth = 2;
          ctx.strokeRect(SAFE_ZONES.chart.left, yTop, SAFE_ZONES.chart.right - SAFE_ZONES.chart.left, fvgH);

          ctx.font = '900 24px sans-serif';
          ctx.fillStyle = theme.fvgBoxStroke;
          ctx.textAlign = 'right';
          ctx.fillText('FVG 50% C.E.', SAFE_ZONES.chart.right - 16, yTop + fvgH / 2 + 8);
          ctx.restore();
        }
      }
    }

    // Draw Candles
    const totalSlots = Math.max(6, scene.draft.candles.length);
    const slotWidth = SAFE_ZONES.horizontal.width / (totalSlots + 1);
    const bodyWidth = Math.min(48, slotWidth * 0.65);

    visibleCandles.forEach((c) => {
      const cx = SAFE_ZONES.chart.left + (c.index + 1) * slotWidth;
      const yOpen = priceToY(c.open, box);
      const yClose = priceToY(c.close, box);
      const yHigh = priceToY(c.high, box);
      const yLow = priceToY(c.low, box);

      const isBullish = c.close >= c.open;
      const color = isBullish ? theme.bullishCandle : theme.bearishCandle;

      // Draw wick
      ctx.save();
      ctx.strokeStyle = theme.candleWick;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, yHigh);
      ctx.lineTo(cx, yLow);
      ctx.stroke();

      // Draw body
      const bodyTop = Math.min(yOpen, yClose);
      const bodyHeight = Math.max(4, Math.abs(yClose - yOpen));

      ctx.fillStyle = color;
      ctx.fillRect(cx - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight);
      ctx.strokeStyle = theme.candleWick;
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight);
      ctx.restore();

      bounds.push({
        id: `candle:${c.id}`,
        x: cx - bodyWidth / 2,
        y: yHigh,
        width: bodyWidth,
        height: yLow - yHigh,
      });
    });
  }

  // 6. Draw Teaching / Budget Zone (y = 1190..1330)
  if (showBudget || scene.draft.budget) {
    ctx.save();
    const budgetY = 1250;
    const badgeW = 260;
    const badgeH = 70;
    const startX = PROFILE_WIDTH / 2 - (badgeW * 3 + 40) / 2;

    const b1 = `1. RISK $${scene.draft.budget?.riskUsd ?? 30}`;
    const b2 = `2. SL ${scene.draft.budget?.slPips ?? 20} PIPS`;
    const b3 = `3. $${scene.draft.budget?.usdPerPip ?? 1.5}/PIP`;

    [b1, b2, b3].forEach((txt, idx) => {
      const bx = startX + idx * (badgeW + 20);
      ctx.fillStyle = theme.badgeBg;
      ctx.beginPath();
      ctx.roundRect(bx, budgetY - badgeH / 2, badgeW, badgeH, 12);
      ctx.fill();

      ctx.fillStyle = theme.badgeText;
      ctx.font = '800 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(txt, bx + badgeW / 2, budgetY + 8);
    });
    ctx.restore();
  }

  if (currentOutcome === 'STOP_LOSS') {
    visibleIds.push('outcome:STOP_LOSS');
    ctx.save();
    ctx.fillStyle = '#DC2626';
    ctx.font = '900 32px sans-serif';
    ctx.textAlign = 'center';
    const lossUsd = scene.draft.budget?.riskUsd ?? 30;
    ctx.fillText(`❌ STOP LOSS HIT (-$${lossUsd.toFixed(2)})`, PROFILE_WIDTH / 2, 1320);
    ctx.restore();
  } else if (currentOutcome === 'TAKE_PROFIT') {
    visibleIds.push('outcome:TAKE_PROFIT');
    ctx.save();
    ctx.fillStyle = '#10B981';
    ctx.font = '900 32px sans-serif';
    ctx.textAlign = 'center';
    const profitUsd =
      scene.draft.order?.tp && scene.draft.order?.entry && scene.draft.budget
        ? (Math.abs(scene.draft.order.tp - scene.draft.order.entry) * 10 * scene.draft.budget.usdPerPip).toFixed(2)
        : '105.00';
    ctx.fillText(`🎯 TAKE PROFIT HIT (+$${profitUsd})`, PROFILE_WIDTH / 2, 1320);
    ctx.restore();
  } else if (currentOutcome === 'NO_TRADE') {
    visibleIds.push('outcome:NO_TRADE');
    ctx.save();
    ctx.fillStyle = '#F59E0B';
    ctx.font = '900 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚠️ LIQUIDITY TRAP — NO TRADE', PROFILE_WIDTH / 2, 1320);
    ctx.restore();
  }

  // 7. Draw Caption Zone (y = 1360..1510)
  if (activeCue) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = theme.textPrimary;
    ctx.font = '700 34px sans-serif';

    // Simple 2-line word wrapping
    const words = activeCue.text.trim().split(/\s+/);
    let line = '';
    const lines: string[] = [];
    const maxLineWidth = SAFE_ZONES.horizontal.width - 40;

    for (const w of words) {
      const testLine = line ? `${line} ${w}` : w;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxLineWidth && line) {
        lines.push(line);
        line = w;
      } else {
        line = testLine;
      }
    }
    if (line) lines.push(line);

    // Limit to max 3 lines per spec
    const displayLines = lines.slice(0, 3);
    const startY = 1400;
    displayLines.forEach((l, idx) => {
      ctx.fillText(l, PROFILE_WIDTH / 2, startY + idx * 42);
    });
    ctx.restore();
  }

  // 8. Draw Mandatory Watermark Zone (y = 1540..1600)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = theme.watermarkText;
  ctx.font = '700 26px sans-serif';
  ctx.fillText(scene.watermark, PROFILE_WIDTH / 2, 1575);
  ctx.restore();
  visibleIds.push('watermark');
  bounds.push({ id: 'watermark', x: SAFE_ZONES.horizontal.left, y: 1540, width: SAFE_ZONES.horizontal.width, height: 60 });

  return {
    frame: frameIndex,
    sceneSha256: scene.sceneSha256,
    visibleIds,
    bounds,
  };
}

