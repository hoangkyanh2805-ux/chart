import { Candle, Overlay, AspectRatio, RevealAnimationType } from '../types/chart';

export interface AzzamPainPointItem {
  id: string;
  type: 'pain_point' | 'backlog';
  rank: number;
  category: string;
  score: number | string;
  hookTitle: string;
  painQuote: string;
  solutionSummary: string;
  ctaText: string;
  recommendedSetup: {
    title: string;
    aspectRatio: AspectRatio;
    duration: number;
    revealMode: RevealAnimationType;
    candles: Candle[];
    overlays: Overlay[];
    bannerHook?: string;
  };
}

function baseSlCheck(val: number): number {
  return val - 5.0;
}

export const AZZAM_OPS_ITEMS: AzzamPainPointItem[] = [
  // 1. PP-0001: Vốn $1000
  {
    id: 'pain-pp-0001-1',
    type: 'pain_point',
    rank: 1,
    category: 'strategy_rules • vốn nhỏ $1,000',
    score: 12.56,
    hookTitle: 'Vốn $1,000 bắt đầu như thế nào để không bị cháy?',
    painQuote: "What's the optimal strategy for someone with around $1000, or even less, to begin trading cryptocurrencies today?",
    solutionSummary: 'Khóa rủi ro nghiêm ngặt 1% ($10/lệnh), SL 20 pips, size 0.05 lot, chỉ đánh 1 setup rút chân tại cản H1.',
    ctaText: "Comment 'VON1000' để nhận bảng tính Risk Budget",
    recommendedSetup: {
      title: 'XAUUSD: Vốn $1,000 Khóa Rủi Ro $10 (1%)',
      aspectRatio: '9:16',
      duration: 6.0,
      revealMode: 'sequential',
      bannerHook: 'VỐN $1,000: KHÓA RỦI RO $10 (1%)',
      candles: [
        { id: 'c-1', index: 0, open: 4127.0, high: 4130.0, low: 4125.0, close: 4129.0 },
        { id: 'c-2', index: 1, open: 4129.0, high: 4132.0, low: 4126.0, close: 4128.0 },
        { id: 'c-3', index: 2, open: 4128.0, high: 4129.0, low: 4123.0, close: 4127.5 },
        { id: 'c-4', index: 3, open: 4127.5, high: 4137.0, low: 4127.0, close: 4136.0 },
        { id: 'c-5', index: 4, open: 4136.0, high: 4143.0, low: 4135.0, close: 4142.5 },
      ],
      overlays: [
        {
          id: 'risk-line-1',
          type: 'SUPPORT_RESISTANCE',
          startCandleIndex: 0,
          endCandleIndex: 4,
          priceStart: 4126.0,
          priceEnd: 4126.0,
          color: '#38BDF8',
          opacity: 0.9,
          label: 'Hỗ Trợ M15: Khóa SL 20 Pips ($10 / 0.05 Lot)',
        },
        {
          id: 'rr-box-1',
          type: 'LONG_SHORT',
          startCandleIndex: 2,
          endCandleIndex: 4,
          priceStart: 4127.5,
          priceEnd: 4142.5,
          color: '#00F5A0',
          opacity: 0.25,
          label: 'Risk $10 | Reward $35 (R:R 1:3.5)',
        },
      ],
    },
  },

  // 2. PP-0002: ORB Trap
  {
    id: 'pain-pp-0002-2',
    type: 'pain_point',
    rank: 2,
    category: 'strategy_rules • bẫy quét râu',
    score: 11.09,
    hookTitle: 'Vì sao đánh Vàng theo ORB toàn bị dính Trap?',
    painQuote: 'Tho ORB is useless most of the time you never get the retracement you want or when you get it price reverses. Liquidity grabs...',
    solutionSummary: 'Giải thích nến quét đỉnh phiên Á (Liquidity Sweep) bẫy retail mua đuổi tại $4,138 rồi sập về FVG thực sự.',
    ctaText: "Comment 'ROADMAP' để nhận lộ trình chuẩn hóa setup",
    recommendedSetup: {
      title: 'XAUUSD: ORB Fakeout & Liquidity Sweep Mitigation',
      aspectRatio: '9:16',
      duration: 5.0,
      revealMode: 'sequential',
      bannerHook: 'VÌ SAO ĐÁNH VÀNG THEO ORB TOÀN BỊ TRAP?',
      candles: [
        { id: 'c-1', index: 0, open: 4126.0, high: 4130.0, low: 4124.0, close: 4129.0 },
        { id: 'c-2', index: 1, open: 4129.0, high: 4138.0, low: 4127.0, close: 4137.0 },
        { id: 'c-3', index: 2, open: 4137.0, high: 4145.0, low: 4128.0, close: 4129.0 },
        { id: 'c-4', index: 3, open: 4129.0, high: 4130.0, low: 4114.0, close: 4116.0 },
        { id: 'c-5', index: 4, open: 4116.0, high: 4125.0, low: 4115.0, close: 4124.0 },
        { id: 'c-6', index: 5, open: 4124.0, high: 4125.0, low: 4104.0, close: 4105.0 },
      ],
      overlays: [
        {
          id: 'orb-trap-line',
          type: 'LIQUIDITY_LINE',
          startCandleIndex: 1,
          endCandleIndex: 3,
          priceStart: 4138.0,
          priceEnd: 4138.0,
          color: '#FF3366',
          opacity: 0.9,
          label: 'ORB Breakout Trap (Đám đông đu đỉnh tại 4,138.00)',
        },
        {
          id: 'bear-fvg',
          type: 'FVG',
          startCandleIndex: 3,
          endCandleIndex: 5,
          priceStart: 4116.0,
          priceEnd: 4128.0,
          color: '#FF3366',
          opacity: 0.25,
          label: 'Bearish FVG [4,116 - 4,128]',
        },
      ],
    },
  },

  // 3. PP-0003: Daily Bias
  {
    id: 'pain-pp-0003-3',
    type: 'pain_point',
    rank: 3,
    category: 'entry_timing • daily bias',
    score: 10.87,
    hookTitle: 'Daily Bias: Bí mật vào lệnh theo giá mở cửa ngày',
    painQuote: 'Its simple No matter the strategy you are using, just enter a long position below the daily opening price and short above...',
    solutionSummary: 'Xác định xu hướng theo giá mở cửa ngày Daily Open: Canh Long dưới giá mở cửa khi kiểm tra hỗ trợ H1.',
    ctaText: "Comment 'BIAS' để nhận checklist Daily Bias",
    recommendedSetup: {
      title: 'XAUUSD: Daily Bias & Opening Price Expansion',
      aspectRatio: '9:16',
      duration: 5.5,
      revealMode: 'sequential',
      bannerHook: 'DAILY BIAS: QUY TẮC GIÁ MỞ CỬA',
      candles: [
        { id: 'c-1', index: 0, open: 4128.0, high: 4131.0, low: 4126.0, close: 4130.0 },
        { id: 'c-2', index: 1, open: 4130.0, high: 4132.0, low: 4121.0, close: 4122.5 },
        { id: 'c-3', index: 2, open: 4122.5, high: 4124.0, low: 4119.0, close: 4123.0 },
        { id: 'c-4', index: 3, open: 4123.0, high: 4138.0, low: 4122.0, close: 4137.0 },
        { id: 'c-5', index: 4, open: 4137.0, high: 4146.0, low: 4136.0, close: 4145.0 },
      ],
      overlays: [
        {
          id: 'daily-open-line',
          type: 'LIQUIDITY_LINE',
          startCandleIndex: 0,
          endCandleIndex: 4,
          priceStart: 4128.0,
          priceEnd: 4128.0,
          color: '#FBBF24',
          opacity: 0.9,
          label: 'Daily Open Price ($4,128.00)',
        },
      ],
    },
  },

  // 4. PP-0008: 5-Step Strategy
  {
    id: 'pain-pp-0008-4',
    type: 'pain_point',
    rank: 4,
    category: 'entry_timing • strategy_rules',
    score: 9.59,
    hookTitle: 'Chiến lược 5 bước: Đa khung H1 + M15 chuẩn tổ chức',
    painQuote: 'The 5-Step Strategy: 1. Identify Trend Direction: Align the 1-hour and 15-minute time frames 2. Mark Liquidity and POI...',
    solutionSummary: 'H1 xác định POI, M15 chờ quét râu Liquidity Sweep và nến rút chân trước khi vào lệnh.',
    ctaText: "Comment '5BUOC' để nhận sơ đồ 5 bước",
    recommendedSetup: {
      title: 'XAUUSD: 5-Step Strategy Alignment H1 + M15',
      aspectRatio: '9:16',
      duration: 6.0,
      revealMode: 'sequential',
      bannerHook: 'CHIẾN LƯỢC 5 BƯỚC ĐA KHUNG THỜI GIAN',
      candles: [
        { id: 'c-1', index: 0, open: 4125.0, high: 4129.0, low: 4123.0, close: 4127.5 },
        { id: 'c-2', index: 1, open: 4127.5, high: 4128.5, low: 4120.0, close: 4121.0 },
        { id: 'c-3', index: 2, open: 4121.0, high: 4123.0, low: 4115.0, close: 4118.0 },
        { id: 'c-4', index: 3, open: 4118.0, high: 4134.0, low: 4117.0, close: 4133.0 },
        { id: 'c-5', index: 4, open: 4133.0, high: 4145.0, low: 4132.0, close: 4144.0 },
      ],
      overlays: [
        {
          id: 'poi-zone',
          type: 'ORDER_BLOCK',
          startCandleIndex: 1,
          endCandleIndex: 3,
          priceStart: 4115.0,
          priceEnd: 4122.0,
          color: '#6366F1',
          opacity: 0.3,
          label: 'H1 Demand POI Zone [4,115 - 4,122]',
        },
      ],
    },
  },

  // 5. PP-0009: Overcomplicating charts
  {
    id: 'pain-pp-0009-5',
    type: 'pain_point',
    rank: 5,
    category: 'education_gap • overcomplicating',
    score: 9.58,
    hookTitle: 'Xoá ngay biểu đồ rối rắm: Chỉ nhìn cản hỗ trợ và nến rút chân',
    painQuote: 'Candle strategies are too hard for beginners. I’ve watched tons of videos and paid for three courses, but nothing works...',
    solutionSummary: 'Tối giản triệt để biểu đồ: Bỏ toàn bộ chỉ báo rối rắm, chỉ tập trung nến từ chối giá tại ngưỡng hỗ trợ quan trọng.',
    ctaText: "Comment 'CLEAN' để nhận template Clean Chart",
    recommendedSetup: {
      title: 'XAUUSD: Clean Price Action Support Rejection',
      aspectRatio: '9:16',
      duration: 6.0,
      revealMode: 'sequential',
      bannerHook: 'STOP OVERCOMPLICATING CHARTS',
      candles: [
        { id: 'c-1', index: 0, open: 4122.0, high: 4129.0, low: 4120.0, close: 4128.0 },
        { id: 'c-2', index: 1, open: 4128.0, high: 4129.0, low: 4122.0, close: 4123.0 },
        { id: 'c-3', index: 2, open: 4123.0, high: 4132.0, low: 4120.5, close: 4131.0 },
        { id: 'c-4', index: 3, open: 4131.0, high: 4132.0, low: 4125.0, close: 4126.0 },
        { id: 'c-5', index: 4, open: 4126.0, high: 4135.0, low: 4125.5, close: 4134.5 },
        { id: 'c-6', index: 5, open: 4134.5, high: 4148.0, low: 4134.0, close: 4147.0 },
      ],
      overlays: [
        {
          id: 'clean-support',
          type: 'SUPPORT_RESISTANCE',
          startCandleIndex: 1,
          endCandleIndex: 5,
          priceStart: 4126.0,
          priceEnd: 4126.0,
          color: '#38BDF8',
          opacity: 0.9,
          label: 'Hỗ Trợ M15 ($4,126.00)',
        },
      ],
    },
  },

  // 6. PP-0016: Risk management
  {
    id: 'pain-pp-0016-6',
    type: 'pain_point',
    rank: 6,
    category: 'risk_management • bảo toàn vốn',
    score: 8.12,
    hookTitle: 'Quản lý vốn tài khoản nhỏ: 1 Lệnh tối đa $30 rủi ro',
    painQuote: '300 PIPS on lot size 0.1 = 300$ ... risk 1-3% of your capital per day ! not more !!! Your stops sometimes are way to far...',
    solutionSummary: 'Thi hành quy tắc Risk-First: Khóa $30 rủi ro cho mỗi lệnh, SL 20 pips, kích thước 0.15 lot, mục tiêu R:R 1:3.5.',
    ctaText: "Comment 'RISK' để nhận Risk Calculator chuẩn XAUUSD",
    recommendedSetup: {
      title: 'XAUUSD: Khóa Rủi Ro $30 Budget (SL 20 Pips)',
      aspectRatio: '9:16',
      duration: 5.5,
      revealMode: 'sequential',
      bannerHook: '1 LỆNH TỐI ĐA $30 RỦI RO',
      candles: [
        { id: 'c-1', index: 0, open: 4126.0, high: 4130.0, low: 4124.0, close: 4129.0 },
        { id: 'c-2', index: 1, open: 4129.0, high: 4131.0, low: 4122.0, close: 4123.5 },
        { id: 'c-3', index: 2, open: 4123.5, high: 4124.5, low: baseSlCheck(4123.5), close: 4124.0 },
        { id: 'c-4', index: 3, open: 4124.0, high: 4139.0, low: 4123.0, close: 4138.0 },
        { id: 'c-5', index: 4, open: 4138.0, high: 4147.0, low: 4137.0, close: 4146.0 },
      ],
      overlays: [
        {
          id: 'sl-budget-box',
          type: 'LONG_SHORT',
          startCandleIndex: 2,
          endCandleIndex: 4,
          priceStart: 4124.0,
          priceEnd: 4146.0,
          color: '#00F5A0',
          opacity: 0.25,
          label: 'Risk $30 (20p) | TP $105 (+70p R:R 1:3.5)',
        },
      ],
    },
  },

  // 7. PP-0023: Không biết đọc cấu trúc nến
  {
    id: 'pain-pp-0023-7',
    type: 'pain_point',
    rank: 7,
    category: 'education_gap • cấu trúc nến',
    score: 7.44,
    hookTitle: 'Không biết đọc cấu trúc nến: Bắt đầu từ 2 loại nến này',
    painQuote: "Damn, that's cool. Anyways how do I read a chart?",
    solutionSummary: 'Giải thích bản chất nến từ chối giá (Rejection Wick) và nến dẫn hướng (Expansion Candle) tại ngưỡng hỗ trợ quan trọng.',
    ctaText: "Comment 'NEN' để nhận tài liệu đọc nến tổ chức",
    recommendedSetup: {
      title: 'XAUUSD: Đọc Cấu Trúc Nến Rút Chân Tổ Chức',
      aspectRatio: '9:16',
      duration: 6.0,
      revealMode: 'sequential',
      bannerHook: 'ĐỌC CẤU TRÚC NẾN TỔ CHỨC TRONG 45 GIÂY',
      candles: [
        { id: 'c-1', index: 0, open: 4128.0, high: 4131.0, low: 4125.0, close: 4130.0 },
        { id: 'c-2', index: 1, open: 4130.0, high: 4131.0, low: 4122.0, close: 4123.0 },
        { id: 'c-3', index: 2, open: 4123.0, high: 4125.0, low: 4118.0, close: 4124.5 },
        { id: 'c-4', index: 3, open: 4124.5, high: 4139.0, low: 4124.0, close: 4138.0 },
      ],
      overlays: [
        {
          id: 'pinbar-arrow',
          type: 'SUPPORT_RESISTANCE',
          startCandleIndex: 1,
          endCandleIndex: 3,
          priceStart: 4120.0,
          priceEnd: 4120.0,
          color: '#00F5A0',
          opacity: 0.9,
          label: 'Rút Râu Từ Chối Giá Tại Hỗ Trợ ($4,120.00)',
        },
      ],
    },
  },

  // 8. Backlog #1: Stop Loss đúng cách (PP-0103)
  {
    id: 'backlog-pp-0103-1',
    type: 'backlog',
    rank: 1,
    category: 'risk_management',
    score: 5.14,
    hookTitle: 'Stop Loss đúng cách',
    painQuote: 'backtested this on demo account i put my stop loss below resistance the price touched stoploss then made a swing high. how to avoid this problem...',
    solutionSummary: 'Giải quyết nỗi đau quét râu SL: Đặt Stop Loss cách xa râu quét tối thiểu 10-15 pips thay vì để sát cản cứng.',
    ctaText: "Comment 'STOP' để nhận video hướng dẫn đệm SL",
    recommendedSetup: {
      title: 'XAUUSD: PP-0103 - Kỹ Thuật Đặt SL An Toàn 20 Pips',
      aspectRatio: '9:16',
      duration: 6.0,
      revealMode: 'sequential',
      bannerHook: '3 NGUYÊN TẮC STOP LOSS SỐNG CÒN',
      candles: [
        { id: 'c-1', index: 0, open: 4128.0, high: 4132.0, low: 4125.0, close: 4130.5 },
        { id: 'c-2', index: 1, open: 4130.5, high: 4136.0, low: 4129.0, close: 4134.0 },
        { id: 'c-3', index: 2, open: 4134.0, high: 4135.0, low: 4122.0, close: 4127.0 },
        { id: 'c-4', index: 3, open: 4127.0, high: 4140.0, low: 4126.0, close: 4139.0 },
        { id: 'c-5', index: 4, open: 4139.0, high: baseSlCheck(4139.0) + 12.0, low: 4138.0, close: 4146.0 },
      ],
      overlays: [
        {
          id: 'safe-sl',
          type: 'LIQUIDITY_LINE',
          startCandleIndex: 2,
          endCandleIndex: 4,
          priceStart: 4122.0,
          priceEnd: 4122.0,
          color: '#FF3366',
          opacity: 0.9,
          label: 'SL An Toàn Dưới Đáy Quét ($4,122.00)',
        },
      ],
    },
  },

  // 9. Backlog #2: Supply & Demand zone (PP-0113)
  {
    id: 'backlog-pp-0113-2',
    type: 'backlog',
    rank: 2,
    category: 'education_gap',
    score: 5.03,
    hookTitle: 'Supply & Demand zone',
    painQuote: 'The one hour trend with supply and demand has been unbelievably easy to trade I get in and out level to level...',
    solutionSummary: 'Xác định vùng Cung/Cầu H1 chuẩn xác, kết hợp nến xác nhận trên M15 để không bị mua đỉnh bán đáy.',
    ctaText: "Comment 'ZONE' để nhận bản đồ Cung Cầu XAUUSD",
    recommendedSetup: {
      title: 'XAUUSD: Supply & Demand Zone Validation',
      aspectRatio: '9:16',
      duration: 6.0,
      revealMode: 'sequential',
      bannerHook: 'BẢN ĐỒ CUNG CẦU H1 CHUẨN XÁC',
      candles: [
        { id: 'c-1', index: 0, open: 4124.0, high: 4127.0, low: 4122.0, close: 4126.0 },
        { id: 'c-2', index: 1, open: 4126.0, high: 4138.0, low: 4125.0, close: 4137.0 },
        { id: 'c-3', index: 2, open: 4137.0, high: 4138.0, low: 4128.0, close: 4130.0 },
        { id: 'c-4', index: 3, open: 4130.0, high: 4146.0, low: 4129.5, close: 4145.0 },
      ],
      overlays: [
        {
          id: 'demand-zone',
          type: 'ORDER_BLOCK',
          startCandleIndex: 0,
          endCandleIndex: 3,
          priceStart: 4122.0,
          priceEnd: 4128.0,
          color: '#00F5A0',
          opacity: 0.25,
          label: 'H1 Demand Zone [4,122 - 4,128]',
        },
      ],
    },
  },

  // 10. Backlog #11: Scalping 1 phút (PP-0040)
  {
    id: 'backlog-pp-0040-11',
    type: 'backlog',
    rank: 11,
    category: 'education_gap • scalping',
    score: 6.76,
    hookTitle: 'Scalping 1 phút: Bẫy quét Stop Loss liên tục',
    painQuote: 'I’ve tried like 6 different 1-minute scalping strategies and always get stopped out or overtrade...',
    solutionSummary: 'Vì sao Scalping 1 phút làm cháy tài khoản: Độ nhiễu cực cao, phí spread cắn hết lợi nhuận. Chuyển sang M15 để bảo toàn vốn.',
    ctaText: "Comment 'SCALPING' để nhận cẩm nang Scalping M15",
    recommendedSetup: {
      title: 'XAUUSD: Chuyển Dịch Scalping 1m Sang M15',
      aspectRatio: '9:16',
      duration: 5.5,
      revealMode: 'sequential',
      bannerHook: 'DỪNG NGAY SCALPING 1 PHÚT NẾU KHÔNG MUỐN CHÁY',
      candles: [
        { id: 'c-1', index: 0, open: 4127.0, high: 4131.0, low: 4124.0, close: 4129.5 },
        { id: 'c-2', index: 1, open: 4129.5, high: 4130.0, low: 4122.0, close: 4123.0 },
        { id: 'c-3', index: 2, open: 4123.0, high: 4124.0, low: 4118.0, close: 4123.5 },
        { id: 'c-4', index: 3, open: 4123.5, high: 4136.0, low: 4122.5, close: 4135.0 },
      ],
      overlays: [
        {
          id: 'scalp-m15-line',
          type: 'SUPPORT_RESISTANCE',
          startCandleIndex: 1,
          endCandleIndex: 3,
          priceStart: 4122.0,
          priceEnd: 4122.0,
          color: '#38BDF8',
          opacity: 0.9,
          label: 'Hỗ Trợ M15 Đáng Tin Cậy ($4,122.00)',
        },
      ],
    },
  },
];
