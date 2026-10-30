import { Candle, Overlay, ExecutionOrder, ScriptSubtitle, SetupValidationReport } from '../types/chart';

/**
 * Gate 1: Extract Semantic Intent from Title and Brief text
 */
export function extractSemanticIntent(title: string, briefText: string = ''): 'BUY' | 'SELL' | 'NEUTRAL' {
  const combined = (title + ' ' + briefText).toUpperCase();

  const buyKeywords = [
    'BUY', 'LONG', 'QUÉT ĐÁY', 'QUET DAY', 'HỖ TRỢ', 'HO TRO', 'SPRING',
    'BẬT TĂNG', 'BAT TANG', 'BÙNG NỔ', 'BUNG NO', 'RECLAIM', 'BULLISH',
    'DISPLACEMENT BUY', 'TĂNG', 'TANG TRUONG', 'CANH MUA', 'GOM HÀNG'
  ];

  const sellKeywords = [
    'SELL', 'SHORT', 'QUÉT ĐỈNH', 'QUET DINH', 'KHÁNG CỰ', 'KHANG CU', 'SUPPLY ZONE',
    'SẬP', 'SAP', 'DUMP', 'CPI GIẬT', 'JUDAS', 'PHÂN PHỐI', 'PHAN PHOI',
    'BEARISH', 'DISPLACEMENT DUMP', 'GIẢM', 'GIAM GIA', 'CANH BAN', 'XẢ HÀNG'
  ];

  let buyHits = 0;
  let sellHits = 0;

  for (const kw of buyKeywords) {
    if (combined.includes(kw)) buyHits++;
  }
  for (const kw of sellKeywords) {
    if (combined.includes(kw)) sellHits++;
  }

  if (buyHits > sellHits) return 'BUY';
  if (sellHits > buyHits) return 'SELL';
  return 'NEUTRAL';
}

/**
 * Gate 2: Candle Geometry & Wick Analysis
 */
export function validateCandleGeometry(
  candles: Candle[],
  expectedDir: 'BUY' | 'SELL',
  triggerIndex: number = 0
): {
  isDriftValid: boolean;
  isTriggerWickValid: boolean;
  drift: number;
  triggerWickRatio: number;
  details: string;
} {
  if (!candles || candles.length < 2) {
    return {
      isDriftValid: false,
      isTriggerWickValid: false,
      drift: 0,
      triggerWickRatio: 0,
      details: 'Không đủ nến để phân tích hình học.',
    };
  }

  const startPrice = candles[0].open;
  const endPrice = candles[candles.length - 1].close;
  const drift = endPrice - startPrice;

  const isDriftValid = expectedDir === 'BUY' ? drift > 0 : drift < 0;

  const safeIndex = Math.min(Math.max(0, triggerIndex), candles.length - 1);
  const triggerCandle = candles[safeIndex];
  const totalRange = triggerCandle.high - triggerCandle.low;

  let triggerWickRatio = 0;
  if (totalRange > 0) {
    if (expectedDir === 'SELL') {
      // Sweeping high: Upper wick must be significant
      const upperWick = triggerCandle.high - Math.max(triggerCandle.open, triggerCandle.close);
      triggerWickRatio = upperWick / totalRange;
    } else {
      // Sweeping low: Lower wick must be significant
      const lowerWick = Math.min(triggerCandle.open, triggerCandle.close) - triggerCandle.low;
      triggerWickRatio = lowerWick / totalRange;
    }
  }

  // Minimum 30% wick required for a valid rejection/sweep bar
  const isTriggerWickValid = triggerWickRatio >= 0.3;

  return {
    isDriftValid,
    isTriggerWickValid,
    drift,
    triggerWickRatio,
    details: `Drift: ${drift.toFixed(2)}, Wick ratio: ${(triggerWickRatio * 100).toFixed(1)}%`,
  };
}

/**
 * Gate 3: Risk-First Mathematical Enforcer
 */
export function enforceRiskFirstMath(
  entry: number,
  direction: 'BUY' | 'SELL',
  options: {
    riskBudget?: number;
    slPips?: number;
    rrRatio?: number;
  } = {}
): ExecutionOrder {
  const risk = options.riskBudget || 30;
  const slPips = options.slPips || 20; // 2.0 gold points
  const rrRatio = options.rrRatio || 3.5;

  const slDelta = slPips * 0.1; // 20 pips = 2.0 points
  const tpDelta = slDelta * rrRatio; // 2.0 * 3.5 = 7.0 points (70 pips)

  const lot = 0.05; // Azzam Gold M15 default sizing for $30 risk

  if (direction === 'BUY') {
    return {
      type: 'BUY',
      entry: Number(entry.toFixed(2)),
      sl: Number((entry - slDelta).toFixed(2)),
      tp: Number((entry + tpDelta).toFixed(2)),
      lot,
      risk,
    };
  } else {
    return {
      type: 'SELL',
      entry: Number(entry.toFixed(2)),
      sl: Number((entry + slDelta).toFixed(2)),
      tp: Number((entry - tpDelta).toFixed(2)),
      lot,
      risk,
    };
  }
}

/**
 * Gate 4 & Core Validator: Full Pipeline Verification & Auto-Normalization
 */
export function validateAndNormalizeSetup(input: {
  title: string;
  candles: Candle[];
  overlays?: Overlay[];
  executionOrder?: ExecutionOrder | null;
  calloutPinText?: string;
  calloutCandleIndex?: number;
  scriptSubtitles?: ScriptSubtitle[];
  briefText?: string;
  badges?: [string, string, string];
}): SetupValidationReport {
  const warnings: string[] = [];
  let score = 100;

  // Extract custom risk, sl, and lot if available from badges or title
  let customRisk = 30;
  let customSlPips = 20;
  let customLot = 0.05;

  if (input.badges && input.badges[0]) {
    const riskMatch = input.badges[0].match(/\$(\d+)/);
    if (riskMatch) customRisk = parseInt(riskMatch[1], 10);
  } else {
    const titleRiskMatch = input.title.match(/risk\s*\$(\d+)/i) || input.title.match(/\$(\d+)\s*(?:risk|budget|loss)/i);
    if (titleRiskMatch) customRisk = parseInt(titleRiskMatch[1], 10);
  }

  if (input.badges && input.badges[1]) {
    const slMatch = input.badges[1].match(/(\d+)\s*p/i);
    if (slMatch) customSlPips = parseInt(slMatch[1], 10);
  }

  if (input.badges && input.badges[2]) {
    const cleanBadge = input.badges[2].replace(/^[0-9]+\.\s*/, '');
    const lotMatch = cleanBadge.match(/(\d+(?:\.\d+)?)/);
    if (lotMatch) customLot = parseFloat(lotMatch[1]);
  } else if (customRisk && customSlPips) {
    customLot = Math.max(0.01, parseFloat((customRisk / (customSlPips * 10)).toFixed(2)));
  }

  // 1. Detect expected direction
  let expectedDirection = extractSemanticIntent(input.title, input.briefText);
  if (expectedDirection === 'NEUTRAL') {
    // Fallback: First infer from physical candle drift in the scene (avoids inheriting dirty order type)
    if (input.candles && input.candles.length > 1) {
      const net = input.candles[input.candles.length - 1].close - input.candles[0].open;
      expectedDirection = net >= 0 ? 'BUY' : 'SELL';
    } else if (input.executionOrder) {
      expectedDirection = input.executionOrder.type;
    } else {
      expectedDirection = 'BUY';
    }
  }

  // 2. Validate Order Direction
  let titleDirectionMatch = true;
  if (input.executionOrder) {
    if (input.executionOrder.type !== expectedDirection) {
      titleDirectionMatch = false;
      warnings.push(`Lệch hướng: Tiêu đề là ${expectedDirection} nhưng thẻ lệnh lại là ${input.executionOrder.type}.`);
      score -= 30;
    }
  } else {
    warnings.push('Chưa có thẻ lệnh ExecutionOrder được khai báo.');
    score -= 10;
  }

  // 3. Validate Candle Geometry
  const triggerIdx = input.calloutCandleIndex ?? 2;
  const geometry = validateCandleGeometry(input.candles, expectedDirection, triggerIdx);

  let candleDriftMatch = geometry.isDriftValid;
  if (!candleDriftMatch) {
    warnings.push(`Độ dốc nến ngược chiều: Kịch bản ${expectedDirection} nhưng nến kết thúc không tạo biên độ lợi nhuận.`);
    score -= 25;
  }

  let triggerWickValid = geometry.isTriggerWickValid;
  if (!triggerWickValid) {
    warnings.push(`Râu nến tại điểm kích hoạt (nến #${triggerIdx}) quá ngắn (${(geometry.triggerWickRatio * 100).toFixed(0)}% < 30%).`);
    score -= 15;
  }

  // 4. Validate Risk/Reward Math
  let riskRewardValid = true;
  if (input.executionOrder) {
    const o = input.executionOrder;
    if (o.type === 'BUY') {
      if (o.tp <= o.entry || o.entry <= o.sl) {
        riskRewardValid = false;
        warnings.push('Cấu trúc giá lệnh BUY không hợp lệ (cần TP > Entry > SL).');
        score -= 20;
      } else {
        const rr = (o.tp - o.entry) / (o.entry - o.sl);
        if (rr < 2.8) {
          riskRewardValid = false;
          warnings.push(`Tỷ lệ R:R quá thấp (${rr.toFixed(1)} < 1:3.0).`);
          score -= 15;
        }
      }
    } else {
      if (o.sl <= o.entry || o.entry <= o.tp) {
        riskRewardValid = false;
        warnings.push('Cấu trúc giá lệnh SELL không hợp lệ (cần SL > Entry > TP).');
        score -= 20;
      } else {
        const rr = (o.entry - o.tp) / (o.sl - o.entry);
        if (rr < 2.8) {
          riskRewardValid = false;
          warnings.push(`Tỷ lệ R:R quá thấp (${rr.toFixed(1)} < 1:3.0).`);
          score -= 15;
        }
      }
    }
  }

  // 5. Validate Subtitles
  let subtitlesAligned = true;
  if (!input.scriptSubtitles || input.scriptSubtitles.length < 3) {
    subtitlesAligned = false;
    warnings.push('Thiếu phụ đề 4 bước khớp với dòng thời gian video.');
    score -= 10;
  }

  // Bound score 0 -> 100
  score = Math.max(0, Math.min(100, score));
  const isValid = score >= 80;

  // 6. Generate Auto-Normalized Setup if needed
  const basePrice = input.candles && input.candles.length > 0 ? input.candles[triggerIdx]?.close || input.candles[0].open : 4130.0;
  const normalizedOrder = enforceRiskFirstMath(basePrice, expectedDirection, {
    riskBudget: customRisk,
    slPips: customSlPips,
    rrRatio: 3.5,
  });
  normalizedOrder.lot = customLot;

  const targetPips = Math.round(customSlPips * 3.5);

  const normalizedSetup = {
    executionOrder: normalizedOrder,
    calloutPinText:
      expectedDirection === 'BUY'
        ? `🎯 RÚT CHÂN QUÉT ĐÁY HỖ TRỢ ($${basePrice.toFixed(0)})`
        : `🎯 BẪY DỤ BUY QUÉT ĐỈNH ($${basePrice.toFixed(0)})`,
    calloutCandleIndex: triggerIdx,
    targetPips,
    scriptSubtitles:
      expectedDirection === 'BUY'
        ? [
            { timePercent: 0.0, text: `Khóa rủi ro 1R ($${customRisk}) trước khi nhìn chart!`, stageName: 'Hook' as const },
            { timePercent: 0.28, text: 'Cú rút chân quét đáy thanh khoản chạm vùng Hỗ trợ then chốt!', stageName: 'Trap' as const },
            { timePercent: 0.58, text: `Nến đảo chiều xác nhận. Chuẩn bị vào BUY ${customLot} lot.`, stageName: 'Setup' as const },
            { timePercent: 0.82, text: `Đặt lệnh BUY, SL ${customSlPips} pips ($${customRisk}), chốt lời +${targetPips} pips (1:3.5 RR).`, stageName: 'Execution' as const },
          ]
        : [
            { timePercent: 0.0, text: `Khóa rủi ro 1R ($${customRisk}) trước khi nhìn chart!`, stageName: 'Hook' as const },
            { timePercent: 0.28, text: 'Đây là cái bẫy quét thanh khoản đỉnh của Market Maker dụ Retail!', stageName: 'Trap' as const },
            { timePercent: 0.58, text: `Nến rút râu để lại Bearish FVG. Chuẩn bị vào SELL ${customLot} lot.`, stageName: 'Setup' as const },
            { timePercent: 0.82, text: `Đặt lệnh SELL, SL ${customSlPips} pips ($${customRisk}), chốt lời +${targetPips} pips (1:3.5 RR).`, stageName: 'Execution' as const },
          ],
  };

  return {
    isValid,
    score,
    expectedDirection,
    checks: {
      titleDirectionMatch,
      candleDriftMatch,
      triggerWickValid,
      riskRewardValid,
      subtitlesAligned,
    },
    warnings,
    normalizedSetup,
  };
}

