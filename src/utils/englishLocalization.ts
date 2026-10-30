import { ScriptSubtitle, Overlay } from '@/types/chart';

export interface EnglishSetupPayload {
  headlineText: string;
  sublineText: string;
  calloutPinText: string;
  badges: [string, string, string];
  scriptSubtitles: ScriptSubtitle[];
  overlays: Overlay[];
}

// Institutional English dictionary for trading terminology
const PHRASE_MAPPINGS: Array<[RegExp, string]> = [
  // Hooks & Titles
  [/tại sao bạn thua lỗ khi buy gold tại đỉnh\??/i, 'WHY RETAIL TRADERS LOSE BUYING HIGHS'],
  [/tại sao đánh breakout vàng cứ chạm sl là bay\??/i, 'WHY BREAKOUT TRADERS GET STOPPED OUT'],
  [/đừng sợ hãi, hãy tính toán/i, 'STOP FEARING, START CALCULATING'],
  [/đừng vào lệnh khi giá vàng chạm \$?4,?128/i, 'DO NOT TRADE WHEN GOLD HITS $4,128'],
  [/pha quét râu \$?4,?155 vừa lừa hàng loạt trader/i, 'THE $4,155 LIQUIDITY SWEEP TRAP'],
  [/3 nguyên tắc stop loss sống còn/i, '3 SURVIVAL RULES FOR STOP LOSS'],
  [/3 cây nến dòng tiền lớn fvg/i, '3 CANDLES REVEALING BIG-MONEY FVG'],
  [/lộ trình 30 ngày/i, 'THE 30-DAY XAUUSD ROADMAP'],
  [/nến rút chân hỗ trợ/i, 'SUPPORT REJECTION WICK'],
  [/bẫy quét sl đỉnh/i, 'BUY-SIDE LIQUIDITY SWEEP'],
  [/bẫy quét sl đáy/i, 'SELL-SIDE LIQUIDITY SWEEP'],

  // Sublines
  [/bẫy liquidity sweep m15 & điểm vào lệnh chuẩn smc/i, 'M15 Liquidity Sweep & Institutional SMC Entry'],
  [/định nghĩa mức lỗ trước khi nhìn chart/i, 'Define your loss before you look at the chart.'],
  [/quản trị rủi ro cố định/i, 'Fixed Risk Budgeting Protocol.'],

  // Callouts
  [/🎯\s*rút chân hỗ trợ\s*\(?\$?([0-9,.]+)\)?/i, '🎯 SUPPORT REJECTION ($$$1)'],
  [/🎯\s*bẫy dụ buy quét đỉnh\s*\(?\$?([0-9,.]+)\)?/i, '🎯 BUY-SIDE LIQUIDITY SWEEP ($$$1)'],
  [/🎯\s*bẫy dụ sell quét đáy\s*\(?\$?([0-9,.]+)\)?/i, '🎯 SELL-SIDE LIQUIDITY SWEEP ($$$1)'],
  [/🎯\s*vào lệnh buy\s*\(?\$?([0-9,.]+)\)?/i, '🎯 INSTITUTIONAL BUY ($$$1)'],
  [/🎯\s*vào lệnh sell\s*\(?\$?([0-9,.]+)\)?/i, '🎯 INSTITUTIONAL SELL ($$$1)'],

  // Overlays
  [/sl an toàn dưới râu quét/i, 'Safe SL Under Sweep Wick'],
  [/bẫy thanh khoản đỉnh/i, 'Buy-Side Liquidity Sweep (BSL)'],
  [/bẫy thanh khoản đáy/i, 'Sell-Side Liquidity Sweep (SSL)'],
  [/vùng cầu hỗ trợ 50% fvg c\.e\./i, 'Demand Zone 50% FVG C.E.'],
  [/vùng cung kháng cự 50% fvg c\.e\./i, 'Supply Zone 50% FVG C.E.'],
  [/điểm vào lệnh tối ưu/i, 'Optimal Trade Entry (OTE)'],
];

export function translateTradingTextToEnglish(text: string): string {
  if (!text) return '';
  let result = text;
  for (const [pattern, replacement] of PHRASE_MAPPINGS) {
    if (pattern.test(result)) {
      result = result.replace(pattern, replacement);
    }
  }

  // Common keyword replacements
  result = result
    .replace(/quét râu/gi, 'liquidity sweep')
    .replace(/hỗ trợ/gi, 'support')
    .replace(/kháng cự/gi, 'resistance')
    .replace(/chốt lời/gi, 'take profit')
    .replace(/dừng lỗ/gi, 'stop loss')
    .replace(/vào lệnh/gi, 'execution')
    .replace(/đám đông/gi, 'retail traders')
    .replace(/quản lý vốn/gi, 'risk management');

  return result;
}

export function generateEnglishSubtitles(orderType: 'BUY' | 'SELL', riskBudget: number, slPips: number, lotSize: string, targetPips: number, rrRatio: number): ScriptSubtitle[] {
  const dir = orderType;
  return [
    {
      timePercent: 0.0,
      text: `Define your 1R loss limit ($${riskBudget}) before you even look at the chart!`,
      stageName: 'Hook',
    },
    {
      timePercent: 0.28,
      text: `Market sweeps key liquidity level, trapping impatient retail traders.`,
      stageName: 'Trap',
    },
    {
      timePercent: 0.58,
      text: `Rejection wick confirms institutional reversal. Executing ${dir} ${lotSize}.`,
      stageName: 'Setup',
    },
    {
      timePercent: 0.82,
      text: `SL locked at ${slPips} pips ($${riskBudget}). Target +${targetPips} pips (1:${rrRatio} R:R).`,
      stageName: 'Execution',
    },
  ];
}

export function convertStateToEnglish(currentState: {
  headlineText: string;
  sublineText: string;
  calloutPinText: string;
  badges: [string, string, string];
  scriptSubtitles: ScriptSubtitle[];
  overlays: Overlay[];
  executionOrder?: any;
}): EnglishSetupPayload {
  const isSell = currentState.executionOrder?.type === 'SELL';
  const risk = currentState.executionOrder?.risk || 10;
  const slPips = 20;
  const lot = currentState.executionOrder?.lot ? `${currentState.executionOrder.lot} lot` : '0.05 lot';
  const targetPips = currentState.executionOrder?.pips || 70;
  const rr = currentState.executionOrder?.reward ? (currentState.executionOrder.reward / risk).toFixed(1) : '3.5';

  // 1. Headline
  let enHeadline = translateTradingTextToEnglish(currentState.headlineText);
  if (enHeadline === currentState.headlineText && !/^[A-Z0-9\s:,.?!'$ -]+$/.test(enHeadline)) {
    // If not translated and contains non-English chars, provide institutional fallback
    enHeadline = isSell ? 'STOP PLACING SL AT LIQUIDITY' : 'STOP FEARING, START CALCULATING';
  }

  // 2. Subline
  let enSubline = translateTradingTextToEnglish(currentState.sublineText);
  if (enSubline === currentState.sublineText && /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(enSubline)) {
    enSubline = 'Define your loss before you even look at the chart.';
  }

  // 3. Callout Pin
  let enCallout = translateTradingTextToEnglish(currentState.calloutPinText);
  if (enCallout === currentState.calloutPinText && /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(enCallout)) {
    enCallout = isSell ? '🎯 LIQUIDITY SWEEP ($4,143)' : '🎯 SUPPORT REJECTION ($4,128)';
  }

  // 4. Badges (English Stepper)
  const enBadges: [string, string, string] = [
    `1. LOSS $${risk}`,
    `2. ENTRY SL ${slPips}p`,
    `3. SIZE ${lot.toUpperCase()}`,
  ];

  // 5. Subtitles
  const enSubtitles = generateEnglishSubtitles(isSell ? 'SELL' : 'BUY', risk, slPips, lot, targetPips, parseFloat(rr));

  // 6. Overlays
  const enOverlays = currentState.overlays.map((o) => {
    let lbl = o.label || '';
    lbl = translateTradingTextToEnglish(lbl);
    if (/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(lbl)) {
      lbl = o.type === 'LIQUIDITY_LINE' ? `Liquidity Sweep Level ($${o.priceStart.toFixed(0)})` : `Demand Zone 50% FVG C.E.`;
    }
    return {
      ...o,
      label: lbl,
    };
  });

  return {
    headlineText: enHeadline.toUpperCase(),
    sublineText: enSubline,
    calloutPinText: enCallout,
    badges: enBadges,
    scriptSubtitles: enSubtitles,
    overlays: enOverlays,
  };
}
