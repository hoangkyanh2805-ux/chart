import { Candle, Overlay } from '../types/chart';

export interface HermesDirectorDirective {
  title: string;
  hookHeadline: string;
  hookSubline: string;
  angle: string;
  goldenHour: string;
  painpoint: string;
  strategy: string;
  basePrice: number;
  riskBudget: number;
  slPips: number;
  lotSize: string;
  rrRatio: number;
  badges: [string, string, string];
  outline: { step: number; timestamp: string; mainIdea: string; chartNeed: string }[];
  candles: Candle[];
  overlays: Overlay[];
}

export function executeHermesDirective(content: string, filename: string): HermesDirectorDirective {
  // 1. Extract Title
  let title = filename.replace(/\.md$/, '').replace(/^(?:script|prompt_package)_\d{4}-\d{2}-\d{2}_/, '');
  const boldTitleMatch = content.match(/###?\s*1\.\s*TITLE[^\r\n]*\r?\n+[\s\S]*?^\*\*([^*]+)\*\*/im);
  const quoteTitleMatch = content.match(/>\s*([^\r\n]+)/);
  const titleBlockMatch = content.match(/(?:1\.\s*TITLE\s*CUỐI|###?\s*1\.\s*TITLE)[^\r\n]*\r?\n+([^\r\n]+)/i);

  if (boldTitleMatch && boldTitleMatch[1]) {
    title = boldTitleMatch[1].trim();
  } else if (quoteTitleMatch && quoteTitleMatch[1] && !quoteTitleMatch[1].startsWith('>') && quoteTitleMatch[1].length > 10) {
    title = quoteTitleMatch[1].trim();
  } else if (titleBlockMatch && titleBlockMatch[1]) {
    const clean = titleBlockMatch[1].replace(/^\*\*|\*\*$/g, '').trim();
    if (clean && !clean.startsWith('───') && !clean.startsWith('===')) {
      title = clean;
    }
  }
  title = title.replace(/\s*\(\d+\s*ký tự.*$/, '').replace(/\s*\(\d+\s*chars.*$/, '').trim();

  // 2. Extract Hook Short (Hermes Native Hook)
  let rawHook = '';
  const shortCutoffMatch = content.match(/Short hook cutoff:\s*["“]?([^"”\r\n]+)["”]?/i);
  const hookShortExplicit = content.match(/Hook\s*(?:≤\s*\d+\s*từ\s*(?:nếu\s*cắt\s*Short)?)?:\s*["“]([^"”\r\n]+)["”]/i);
  const hookQuotedMatch = content.match(/Hook\s*Short[^\r\n]*?:\s*["“]?([^"”\r\n]+)["”]?/i);

  if (shortCutoffMatch && shortCutoffMatch[1]) {
    rawHook = shortCutoffMatch[1].trim();
  } else if (hookShortExplicit && hookShortExplicit[1]) {
    rawHook = hookShortExplicit[1].trim();
  } else if (hookQuotedMatch && hookQuotedMatch[1]) {
    rawHook = hookQuotedMatch[1].trim();
  } else {
    rawHook = 'A PDF will not keep you alive. A loss limit will.';
  }

  // Split into Headline & Subline
  let hookHeadline = '';
  let hookSubline = '';

  const sentenceParts = rawHook.split(/[.?!]/).map((s) => s.trim()).filter(Boolean);
  if (sentenceParts.length >= 2) {
    hookHeadline = sentenceParts[0];
    hookSubline = sentenceParts.slice(1).join('. ') + '.';
  } else if (sentenceParts.length === 1) {
    hookHeadline = sentenceParts[0];
    hookSubline = 'Decided before you enter. That is the whole video.';
  }

  // Cap words strictly for 9:16 mobile canvas
  const headWords = hookHeadline.split(/\s+/).filter(Boolean);
  if (headWords.length > 7) {
    hookHeadline = headWords.slice(0, 6).join(' ');
  }

  const subWords = hookSubline.split(/\s+/).filter(Boolean);
  if (subWords.length > 10) {
    hookSubline = subWords.slice(0, 10).join(' ') + '...';
  }

  // 3. Extract Painpoint & Metadata
  let painpoint = 'Săn PDF chén thánh thay vì cài đặt mức lỗ tối đa';
  const painMatch = content.match(/Painpoint:\s*([^\r\n]+)/i);
  if (painMatch && painMatch[1]) painpoint = painMatch[1].trim();

  let angle = 'risk_first';
  const angleMatch = content.match(/Angle:\s*([^\r\n]+)/i);
  if (angleMatch && angleMatch[1]) angle = angleMatch[1].trim();

  let goldenHour = '00:00 VN (avg 40,393 views)';
  const ghMatch = content.match(/Golden hour:\s*([^\r\n]+)/i);
  if (ghMatch && ghMatch[1]) goldenHour = ghMatch[1].trim();

  // 4. Extract Numbers & Math
  let basePrice = 4128.0;
  let riskBudget = 30;
  let slPips = 20;
  let lotSize = '$1.50/pip';
  let rrRatio = 3.5;

  // Extract risk budget: e.g. $10 = 1R, $30 budget, LOSS = $30, define $30
  const budgetDirectMatch = content.match(/(?:LOSS\s*=\s*\$|define\s*\$|\$)\s*(\d+)\s*(?:=|đúng)?\s*(?:1R|budget|risk|loss|trước)/i)
    || content.match(/\$(\d+)\s*(?:=|đúng)?\s*(?:1R|budget|risk|loss)/i);
  if (budgetDirectMatch) {
    const val = parseInt(budgetDirectMatch[1], 10);
    if (val > 0 && val < 2000) riskBudget = val;
  }

  // Extract pips: e.g. 20 pips
  const pipsMatch = content.match(/(\d+)\s*pips?/i);
  if (pipsMatch) slPips = parseInt(pipsMatch[1], 10);

  // Extract lot size: e.g. 0.05 lot or $1.50/pip
  const lotDirectMatch = content.match(/(\d+(?:\.\d+)?)\s*lots?/i);
  const lotPerPipMatch = content.match(/\$(\d+(?:\.\d+)?)\s*\/\s*pip/i);
  if (lotDirectMatch) {
    lotSize = `${lotDirectMatch[1]} lot`;
  } else if (lotPerPipMatch) {
    lotSize = `$${lotPerPipMatch[1]}/pip`;
  }

  // Extract RR
  const rrMatch = content.match(/1\s*:\s*(\d+(?:\.\d+)?)/i);
  if (rrMatch) {
    const rVal = parseFloat(rrMatch[1]);
    if (rVal <= 10) rrRatio = rVal;
  }

  // Extract price around Gold range 4000-4500 if present
  const goldPriceMatch = content.match(/\$?(4[0-9]{3}(?:\.\d{1,2})?)/);
  if (goldPriceMatch) {
    basePrice = parseFloat(goldPriceMatch[1]);
  } else {
    basePrice = 4128.0;
  }

  // 5. Extract 8-part Outline
  const outline: { step: number; timestamp: string; mainIdea: string; chartNeed: string }[] = [];
  const outlineTableMatches = content.matchAll(/\|\s*(\d+)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|/g);

  for (const m of outlineTableMatches) {
    const stepNum = parseInt(m[1].trim(), 10);
    if (!isNaN(stepNum) && stepNum >= 1 && stepNum <= 8) {
      outline.push({
        step: stepNum,
        timestamp: m[2].trim(),
        mainIdea: m[3].trim(),
        chartNeed: m[4].trim(),
      });
    }
  }

  // 6. Strategy Detection
  let strategy = 'Predefined Loss Limit (Risk-First Pullback)';
  if (/sweep|liquidity|bsl|quét thanh khoản/i.test(content) || /sweep/i.test(filename)) {
    strategy = 'Liquidity Sweep & Institutional Reversal';
  } else if (/fvg|imbalance|fair value gap/i.test(content) || /fvg/i.test(filename)) {
    strategy = 'M15 Fair Value Gap (50% CE Retest)';
  } else if (/chart-reading|read a chart/i.test(content) || /chart-reading/i.test(filename)) {
    strategy = '3-Skill Chart Reading (Market Structure)';
  } else if (/break (?:and|&) retest|bos/i.test(content)) {
    strategy = 'Breakout & Retest Confirmation';
  }

  // 7. Dynamic Badges following Hermes 3-Step Framework
  const badges: [string, string, string] = [
    `1. LOSS $${riskBudget}`,
    `2. ENTRY SL ${slPips}p`,
    `3. SIZE ${lotSize.replace(' lot', 'L')}`,
  ];

  // 8. Generate Authentic Candlesticks & Overlays strictly following Hermes
  let candles: Candle[] = [];
  let overlays: Overlay[] = [];

  if (strategy.includes('Liquidity Sweep')) {
    candles = [
      { id: 'c-1', index: 0, open: basePrice, high: basePrice + 6.0, low: basePrice - 1.0, close: basePrice + 5.0 },
      { id: 'c-2', index: 1, open: basePrice + 5.0, high: basePrice + 14.0, low: basePrice + 4.0, close: basePrice + 13.0 },
      { id: 'c-3', index: 2, open: basePrice + 13.0, high: basePrice + 14.5, low: basePrice + 9.0, close: basePrice + 10.0 },
      { id: 'c-4', index: 3, open: basePrice + 10.0, high: basePrice + 21.0, low: basePrice + 6.0, close: basePrice + 7.0 },
      { id: 'c-5', index: 4, open: basePrice + 7.0, high: basePrice + 7.5, low: basePrice - 4.0, close: basePrice - 3.0 },
      { id: 'c-6', index: 5, open: basePrice - 3.0, high: basePrice - 2.5, low: basePrice - 12.0, close: basePrice - 10.0 },
    ];
    overlays = [
      {
        id: 'bsl-sweep-line',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 1,
        endCandleIndex: 3,
        priceStart: basePrice + 14.0,
        priceEnd: basePrice + 14.0,
        color: '#F59E0B',
        label: `BSL Sweep Level ($${(basePrice + 14.0).toFixed(2)})`,
      },
      {
        id: 'sweep-rr-box',
        type: 'LONG_SHORT',
        startCandleIndex: 3,
        endCandleIndex: 5,
        priceStart: basePrice + 7.0,
        priceEnd: basePrice - 10.0,
        color: '#EF4444',
        label: `Short Entry | TP: +1:${rrRatio} RR`,
      },
    ];
  } else if (strategy.includes('Chart Reading')) {
    candles = [
      { id: 'c-1', index: 0, open: basePrice - 10, high: basePrice - 2, low: basePrice - 12, close: basePrice - 4 },
      { id: 'c-2', index: 1, open: basePrice - 4, high: basePrice + 8, low: basePrice - 5, close: basePrice + 6 },
      { id: 'c-3', index: 2, open: basePrice + 6, high: basePrice + 7, low: basePrice - 1, close: basePrice },
      { id: 'c-4', index: 3, open: basePrice, high: basePrice + 16, low: basePrice - 0.5, close: basePrice + 15 },
      { id: 'c-5', index: 4, open: basePrice + 15, high: basePrice + 15.5, low: basePrice + 6, close: basePrice + 7 },
      { id: 'c-6', index: 5, open: basePrice + 7, high: basePrice + 24, low: basePrice + 6.5, close: basePrice + 22 },
    ];
    overlays = [
      {
        id: 'hh-hl-line',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 1,
        endCandleIndex: 4,
        priceStart: basePrice + 6.0,
        priceEnd: basePrice + 6.0,
        color: '#38BDF8',
        label: `HH/HL Structure Level ($${(basePrice + 6.0).toFixed(2)})`,
      },
    ];
  } else {
    // Hermes Risk-First Pullback Setup (Matching Section 5 Example: HTF Uptrend + LTF Pullback to Support + Rejection Wick)
    candles = [
      { id: 'c-1', index: 0, open: basePrice - 8.0, high: basePrice + 4.0, low: basePrice - 9.0, close: basePrice + 2.0 }, // HTF Uptrend Start
      { id: 'c-2', index: 1, open: basePrice + 2.0, high: basePrice + 3.0, low: basePrice - 5.0, close: basePrice - 3.5 }, // Minor Pullback
      { id: 'c-3', index: 2, open: basePrice - 3.5, high: basePrice + 14.0, low: basePrice - 4.0, close: basePrice + 12.0 }, // Higher High Wave
      { id: 'c-4', index: 3, open: basePrice + 12.0, high: basePrice + 13.0, low: basePrice, close: basePrice + 1.0 }, // LTF Pullback to Support ($4,128)
      { id: 'c-5', index: 4, open: basePrice + 1.0, high: basePrice + 8.0, low: basePrice - 2.0, close: basePrice + 6.5 }, // Rejection Wick Hammer Trigger
      { id: 'c-6', index: 5, open: basePrice + 6.5, high: basePrice + 20.0, low: basePrice + 5.5, close: basePrice + 18.0 }, // Clean Expansion to Target
    ];
    overlays = [
      {
        id: 'hermes-support',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 1,
        endCandleIndex: 4,
        priceStart: basePrice,
        priceEnd: basePrice,
        color: '#38BDF8',
        label: `Support: $${basePrice.toFixed(2)} (SL: ${slPips} pips)`,
      },
      {
        id: 'hermes-risk-rr',
        type: 'LONG_SHORT',
        startCandleIndex: 4,
        endCandleIndex: 5,
        priceStart: basePrice,
        priceEnd: basePrice + 7.0,
        color: '#00F5A0',
        label: `Budget $${riskBudget} (1R) | Size: ${lotSize} | 1:${rrRatio} RR`,
      },
    ];
  }

  return {
    title,
    hookHeadline: hookHeadline.toUpperCase(),
    hookSubline,
    angle,
    goldenHour,
    painpoint,
    strategy,
    basePrice,
    riskBudget,
    slPips,
    lotSize,
    rrRatio,
    badges,
    outline,
    candles,
    overlays,
  };
}
