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

export const AZZAM_OPS_ITEMS: AzzamPainPointItem[] = [
  {
    id: 'pain-1-orb-trap',
    type: 'pain_point',
    rank: 1,
    category: 'strategy_rules | education_gap',
    score: 11.086,
    hookTitle: 'Vì sao đánh Vàng theo ORB toàn bị dính Trap?',
    painQuote: 'Tho ORB is useless most of the time you never get the retracement you want or when you get it price reverses...',
    solutionSummary: 'Giải quyết nỗi đau ORB thất bại: Giải thích nến quét đỉnh phiên Á (Liquidity Sweep) bẫy trader mua đuổi rồi sập về FVG thực sự.',
    ctaText: "Comment 'ROADMAP' để nhận lộ trình chuẩn hóa setup",
    recommendedSetup: {
      title: 'XAUUSD: ORB Fakeout & Liquidity Sweep Mitigation',
      aspectRatio: '9:16',
      duration: 5.0,
      revealMode: 'sequential',
      bannerHook: 'VÌ SAO ĐÁNH VÀNG THEO ORB TOÀN BỊ TRAP?',
      candles: [
        { id: 'c-1', index: 0, open: 4126.0, high: 4130.0, low: 4124.0, close: 4129.0 },
        { id: 'c-2', index: 1, open: 4129.0, high: 4138.0, low: 4127.0, close: 4137.0 }, // ORB High Breakout (Trap)
        { id: 'c-3', index: 2, open: 4137.0, high: 4145.0, low: 4128.0, close: 4129.0 }, // Judas Swing Trap wick
        { id: 'c-4', index: 3, open: 4129.0, high: 4130.0, low: 4114.0, close: 4116.0 }, // Violent MSS dump
        { id: 'c-5', index: 4, open: 4116.0, high: 4125.0, low: 4115.0, close: 4124.0 }, // Retest into Bearish FVG
        { id: 'c-6', index: 5, open: 4124.0, high: 4125.0, low: 4104.0, close: 4105.0 }, // Target drop
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
  {
    id: 'backlog-3-chay-tai-khoan',
    type: 'backlog',
    rank: 3,
    category: 'risk_management | cháy tài khoản',
    score: 380,
    hookTitle: '1 Lệnh này xoá sạch tài khoản Vàng của bạn',
    painQuote: 'I was seriously considering deleting all my trading apps... down to my last bit of savings... still losing...',
    solutionSummary: 'Minh họa cú thả Stop Loss dính tin tức giật râu quét 130 pips: Hậu quả của gồng lỗ và cách bảo toàn vốn.',
    ctaText: "Comment 'RISK' để nhận Risk Calculator chuẩn XAUUSD",
    recommendedSetup: {
      title: 'XAUUSD: News Spike Liquidity Grab ($4,155)',
      aspectRatio: '9:16',
      duration: 5.5,
      revealMode: 'brownian',
      bannerHook: '1 LỆNH NÀY XOÁ SẠCH TÀI KHOẢN VÀNG',
      candles: [
        { id: 'c-1', index: 0, open: 4138.0, high: 4144.0, low: 4136.0, close: 4142.0 },
        { id: 'c-2', index: 1, open: 4142.0, high: 4145.0, low: 4140.0, close: 4143.5 },
        { id: 'c-3', index: 2, open: 4143.5, high: 4155.0, low: 4138.0, close: 4140.0 }, // News Spike Wick
        { id: 'c-4', index: 3, open: 4140.0, high: 4141.0, low: 4112.0, close: 4114.0 }, // Dump
        { id: 'c-5', index: 4, open: 4114.0, high: 4120.0, low: 4104.0, close: 4106.0 },
        { id: 'c-6', index: 5, open: 4106.0, high: 4130.0, low: 4105.0, close: 4128.0 },
        { id: 'c-7', index: 6, open: 4128.0, high: 4129.0, low: 4098.0, close: 4100.0 },
      ],
      overlays: [
        {
          id: 'news-sweep-line',
          type: 'LIQUIDITY_LINE',
          startCandleIndex: 1,
          endCandleIndex: 3,
          priceStart: 4155.0,
          priceEnd: 4155.0,
          color: '#FF3366',
          opacity: 0.95,
          label: '❌ Thả SL bị quét râu tại $4,155.00 (-130 Pips)',
        },
        {
          id: 'fvg-ob-sell',
          type: 'FVG',
          startCandleIndex: 3,
          endCandleIndex: 6,
          priceStart: 4120.0,
          priceEnd: 4138.0,
          color: '#FF3366',
          opacity: 0.25,
          label: 'Bearish FVG [4,120.00 - 4,138.00]',
        },
      ],
    },
  },
  {
    id: 'backlog-5-xoa-5-indicator',
    type: 'backlog',
    rank: 5,
    category: 'overcomplicating | strategy quá phức tạp',
    score: 360,
    hookTitle: 'Xoá ngay 5 Indicator này nếu muốn có lợi nhuận',
    painQuote: 'I swear I’ve tried every timeframe and pattern out there. Nothing feels consistent, every time I found setup the market flips...',
    solutionSummary: 'Gỡ bỏ RSI, MACD, Bollinger Bands gây nhiễu. Chỉ giữ lại biểu đồ Vàng sạch (Clean Chart) với 50% Consequent Encroachment.',
    ctaText: "Comment 'SIMPLE' để nhận template 1-Setup duy nhất",
    recommendedSetup: {
      title: 'XAUUSD: Clean Chart 50% C.E. Retest Entry',
      aspectRatio: '9:16',
      duration: 4.5,
      revealMode: 'sequential',
      bannerHook: 'XOÁ NGAY 5 INDICATOR NÀY!',
      candles: [
        { id: 'c-1', index: 0, open: 4122.0, high: 4126.0, low: 4120.0, close: 4125.0 },
        { id: 'c-2', index: 1, open: 4125.0, high: 4140.0, low: 4124.0, close: 4139.0 },
        { id: 'c-3', index: 2, open: 4139.0, high: 4148.0, low: 4137.0, close: 4146.0 },
        { id: 'c-4', index: 3, open: 4146.0, high: 4147.0, low: 4131.5, close: 4133.0 }, // 50% CE tap
        { id: 'c-5', index: 4, open: 4133.0, high: 4156.0, low: 4132.0, close: 4154.0 }, // Win TP
      ],
      overlays: [
        {
          id: 'clean-fvg',
          type: 'FVG',
          startCandleIndex: 1,
          endCandleIndex: 4,
          priceStart: 4126.0,
          priceEnd: 4137.0,
          color: '#00F5A0',
          opacity: 0.25,
          label: 'Chỉ 1 Vùng FVG [4,126 - 4,137]',
        },
        {
          id: 'clean-rr',
          type: 'LONG_SHORT',
          startCandleIndex: 3,
          endCandleIndex: 4,
          priceStart: 4133.0,
          priceEnd: 4154.0,
          color: '#00F5A0',
          opacity: 0.22,
          label: 'Entry tại 50% CE (SL: $2, TP: $21)',
        },
      ],
    },
  },
  {
    id: 'pain-8-timeframe-conflict',
    type: 'pain_point',
    rank: 8,
    category: 'strategy_rules | timeframe_conflict',
    score: 8.532,
    hookTitle: 'Đừng học ICT khi chưa biết bí mật đa khung thời gian',
    painQuote: '1H, 15M, 5M nothing ever feels consistent. Every time I think I found the setup, the market flips on me...',
    solutionSummary: 'Giải quyết xung đột khung thời gian: Quy tắc H1 Order Block đóng vai trò định hướng, chỉ canh tìm FVG trên M15 khi H1 đã kích hoạt.',
    ctaText: "Comment 'ROADMAP' để nhận tài liệu Đa Khung Thời Gian",
    recommendedSetup: {
      title: 'XAUUSD: H1 Order Block + M15 FVG Confirmation',
      aspectRatio: '9:16',
      duration: 5.5,
      revealMode: 'sequential',
      bannerHook: 'ĐỪNG HỌC ICT KHI CHƯA BIẾT CÁI NÀY',
      candles: [
        { id: 'c-1', index: 0, open: 4126.0, high: 4130.0, low: 4124.0, close: 4128.5 },
        { id: 'c-2', index: 1, open: 4128.5, high: 4129.0, low: 4122.0, close: 4123.0 },
        { id: 'c-3', index: 2, open: 4123.0, high: 4125.0, low: 4114.0, close: 4116.5 }, // H1 Key OB
        { id: 'c-4', index: 3, open: 4116.5, high: 4136.0, low: 4115.0, close: 4135.0 },
        { id: 'c-5', index: 4, open: 4135.0, high: 4148.0, low: 4133.0, close: 4146.0 },
        { id: 'c-6', index: 5, open: 4146.0, high: 4147.0, low: 4138.0, close: 4139.0 },
        { id: 'c-7', index: 6, open: 4139.0, high: 4140.0, low: 4129.5, close: 4132.0 },
        { id: 'c-8', index: 7, open: 4132.0, high: 4152.0, low: 4131.0, close: 4150.0 },
        { id: 'c-9', index: 8, open: 4150.0, high: 4162.0, low: 4149.0, close: 4158.5 },
      ],
      overlays: [
        {
          id: 'h1-ob-zone',
          type: 'ORDER_BLOCK',
          startCandleIndex: 2,
          endCandleIndex: 4,
          priceStart: 4114.0,
          priceEnd: 4120.0,
          color: '#6366F1',
          opacity: 0.3,
          label: 'H1 Higher Timeframe Order Block [4,114 - 4,120]',
        },
        {
          id: 'm15-fvg-entry',
          type: 'FVG',
          startCandleIndex: 3,
          endCandleIndex: 7,
          priceStart: 4125.0,
          priceEnd: 4133.0,
          color: '#00F5A0',
          opacity: 0.22,
          label: 'M15 Execution FVG [4,125.00 - 4,133.00]',
        },
      ],
    },
  },
];
