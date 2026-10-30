import { ScriptSubtitle } from '../types/chart';

export interface DynamicScriptParams {
  title: string;
  topic?: string;
  strategy?: string;
  direction?: 'BUY' | 'SELL';
  entryPrice?: number;
  slPrice?: number;
  tpPrice?: number;
  slPips?: number;
  targetPips?: number;
  riskAmount?: number;
  lotSize?: number | string;
  rrRatio?: number;
  language?: 'vi' | 'en';
}

/**
 * Dynamically generates a context-aware, authentic 4-stage video script & subtitles
 * for ANY XAUUSD trading setup. Guarantees 100% semantic alignment between what is
 * shown on the chart banner and what the voice speaks.
 */
export function generateDynamicScriptSubtitles(params: DynamicScriptParams): ScriptSubtitle[] {
  const {
    title,
    topic,
    strategy = 'Price Action',
    direction = 'SELL',
    entryPrice = 4128.0,
    slPips = 20,
    targetPips = 70,
    riskAmount = 10,
    lotSize = '0.05 lot',
    rrRatio = 3.5,
    language,
  } = params;

  const t = (title || '').trim();
  const sub = (topic || '').trim();
  const lotStr = typeof lotSize === 'number' ? `${lotSize} lot` : lotSize;

  // Auto-detect language: If no Vietnamese diacritics and has English letters, treat as English
  const hasVietnameseAccent = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(`${t} ${sub}`);
  const isEn = language === 'en' || (language !== 'vi' && !hasVietnameseAccent && /[a-z]/i.test(t));

  // 1. Stage 1: Hook (0.0s - 3.0s) - MUST directly incorporate the Headline so voice matches banner
  let hook = '';
  if (/3 cây nến|cây nến|candle|đọc nến|pp-0023/i.test(t)) {
    hook = isEn
      ? `${t.toUpperCase()}! 3 CANDLES REVEAL INSTITUTIONAL FLOW.`
      : `${t.toUpperCase()}! DỪNG ĐỌC CHART KIỂU ĐOÁN MÒ, BẮT BÀI DÒNG TIỀN LỚN.`;
  } else if (/stop loss|sl|dời sl|hit sl/i.test(t)) {
    hook = isEn
      ? `${t.toUpperCase()}! STOP MOVING YOUR STOP LOSS, 3 SURVIVAL RULES.`
      : `${t.toUpperCase()}! STOP DỜI STOP LOSS, 3 QUY TẮC SỐNG CÒN.`;
  } else if (/sai lầm|mistake|giet|chay|blow/i.test(t)) {
    hook = isEn
      ? `${t.toUpperCase()}! WHY 80% OF BEGINNERS BLOW ACCOUNTS.`
      : `${t.toUpperCase()}! TẠI SAO 80% TRADER MỚI ĐỐT CHÁY TÀI KHOẢN KHI GIAO DỊCH VÀNG?`;
  } else if (/cpi|news|tin tức|judas|spike/i.test(t)) {
    hook = isEn
      ? `${t.toUpperCase()}! NEVER TRADE CPI NEWS IMMEDIATELY, WAIT FOR THE SWEEP.`
      : `${t.toUpperCase()}! ĐỪNG ĐUỔI THEO TIN CPI, BẮT BÀI CÚ QUÉT JUDAS SWEEP.`;
  } else if (sub) {
    hook = `${t}! ${sub}`;
  } else {
    hook = isEn
      ? `${t}: DEFINE YOUR LOSS BEFORE ENTRY!`
      : `${t}: KHÓA RỦI RO TRƯỚC KHI NHÌN BIỂU ĐỒ!`;
  }

  // 2. Stage 2: Trap / Audience Pain Point (3.0s - 6.0s)
  let trap = '';
  if (/cpi|news|tin tức|judas|spike/i.test(`${t} ${sub} ${strategy}`)) {
    trap = isEn
      ? 'During news spikes, retail traders FOMO enter early, becoming instant exit liquidity for institutional sweeps!'
      : 'Vào thời điểm tin tức giật mạnh, trader nôn nóng nhảy vào đuổi theo giá, biến mình thành thanh khoản cho Big Boys quét sạch!';
  } else if (/stop loss|sl|dời sl|hit sl/i.test(`${t} ${sub} ${strategy}`)) {
    trap = isEn
      ? 'Retail traders widen their SL when price goes against them, turning a small 1R risk into account destruction!'
      : 'Đám đông liên tục nới rộng SL khi giá đi ngược, biến khoản lỗ nhỏ 1R thành thảm họa cháy tài khoản!';
  } else if (/sai lầm|mistake|giet|chay|blow/i.test(`${t} ${sub} ${strategy}`)) {
    trap = isEn
      ? 'Beginners trade without a fixed risk budget, jumping between scalping strategies with no sample size!'
      : 'Người mới đổi liên tục các chiến lược scalping khác nhau mà không có hạn mức rủi ro cố định!';
  } else if (/fvg|fair value|khoảng trống/i.test(`${t} ${sub} ${strategy}`)) {
    trap = isEn
      ? 'An imbalance FVG appears on the chart, but impatient traders FOMO enter too early before liquidity is swept!'
      : 'Thị trường tạo khoảng trống giá FVG nhưng trader nôn nóng nhảy vào quá sớm khi chưa có xác nhận từ chối giá!';
  } else {
    trap = isEn
      ? `Retail traders rush to ${direction === 'SELL' ? 'BUY the breakout' : 'SELL the dump'}, right into institutional distribution!`
      : `Đám đông vội vã bấm ${direction === 'SELL' ? 'BUY đuổi theo nến xanh' : 'SELL tháo đáy'}, đúng vào thời điểm các quỹ lớn xả hàng!`;
  }

  // 3. Stage 3: The Institutional Setup (6.0s - 9.0s)
  let setupStage = '';
  if (/3 cây nến|cây nến|candle|pp-0023/i.test(`${t} ${sub} ${strategy}`)) {
    setupStage = isEn
      ? `Candle 1 sweeps liquidity, Candle 2 creates FVG, wait for Candle 3 to retest 50% FVG at $${entryPrice.toFixed(1)}!`
      : `Cây 1 quét đỉnh rút râu, cây 2 tạo FVG, hãy đợi cây 3 hồi đúng 50% FVG tại $${entryPrice.toFixed(1)} để kích hoạt lệnh!`;
  } else if (/cpi|judas|spike/i.test(`${t} ${sub} ${strategy}`)) {
    setupStage = isEn
      ? `Wait for the Judas liquidity sweep to clear stops, confirming rejection at $${entryPrice.toFixed(1)}!`
      : `Đợi cú quét Judas Swing lấy sạch thanh khoản 2 đầu, xác nhận nến rút râu tại vùng $${entryPrice.toFixed(1)}!`;
  } else if (/fvg/i.test(`${t} ${sub} ${strategy}`)) {
    setupStage = isEn
      ? `Be patient until price pulls back to the 50% Consequent Encroachment at $${entryPrice.toFixed(1)} with rejection confirmation!`
      : `Kiên nhẫn chờ giá hồi về chạm đúng 50% Consequent Encroachment tại $${entryPrice.toFixed(1)} và xác nhận rút chân!`;
  } else {
    setupStage = isEn
      ? `Smart money sweeps liquidity, leaving rejection wicks and displacement confirming entry at $${entryPrice.toFixed(1)}!`
      : `Dòng tiền lớn quét sạch thanh khoản, để lại nến rút râu xác nhận điểm vào lệnh ${direction} chuẩn SMC tại $${entryPrice.toFixed(1)}!`;
  }

  // 4. Stage 4: Risk-First Execution (9.0s - 12.0s)
  const exec = isEn
    ? `Risk-First execution: Enter ${direction} ${lotStr} @ $${entryPrice.toFixed(1)}, fixed ${slPips} pips SL ($${riskAmount} risk), Target +${targetPips} pips (1:${rrRatio} R:R).`
    : `Công thức Risk-First: Vào lệnh ${direction} ${lotStr} tại $${entryPrice.toFixed(1)}, SL cố định ${slPips} pips (${riskAmount} đô), chốt lời +${targetPips} pips (1:${rrRatio} R:R).`;

  return [
    { timePercent: 0.0, text: hook, stageName: 'Hook' },
    { timePercent: 0.28, text: trap, stageName: 'Trap' },
    { timePercent: 0.58, text: setupStage, stageName: 'Setup' },
    { timePercent: 0.82, text: exec, stageName: 'Execution' },
  ];
}
