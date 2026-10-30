import { Candle, Overlay, AspectRatio, RevealAnimationType, ScriptSubtitle, ExecutionOrder } from '../types/chart';

export interface ChartTemplate {
  id: string;
  title: string;
  strategy: 'SMC' | 'ICT' | 'Wyckoff' | 'Elliott Wave' | 'Price Action';
  tier: 'Free' | 'Pro' | 'Creator';
  aspectRatio: AspectRatio;
  duration: number;
  revealMode: RevealAnimationType;
  description: string;
  candles: Candle[];
  overlays: Overlay[];
  spotlightEnabled?: boolean;
  headlineText?: string;
  sublineText?: string;
  badges?: [string, string, string] | string[];
  showCalloutPin?: boolean;
  calloutPinText?: string;
  calloutCandleIndex?: number;
  showPipCounter?: boolean;
  targetPips?: number;
  showExecutionBadge?: boolean;
  executionOrder?: ExecutionOrder;
  scriptSubtitles?: ScriptSubtitle[];
}

export const TEMPLATES: ChartTemplate[] = [
  {
    id: 'pp0023-institutional-candle-reading',
    title: '[Thực Chiến] 3 Cây Nến Tiết Lộ Dòng Tiền Lớn (PP-0023)',
    strategy: 'SMC',
    tier: 'Creator',
    aspectRatio: '9:16',
    duration: 12.0,
    revealMode: 'sequential',
    description: 'Kịch bản triệu view giải quyết nỗi đau PP-0023 (824 comment không biết đọc nến): Cách bắt bài bộ 3 cây nến tổ chức, quét râu đỉnh 4,138, FVG và Retest 50% Consequent Encroachment.',
    headlineText: '3 CÂY NẾN TIẾT LỘ DÒNG TIỀN LỚN',
    sublineText: 'Dừng đọc chart kiểu đoán mò. Bắt bài dấu chân Big Boys.',
    badges: ['1. LOSS $10', '2. SL 20 PIPS', '3. LOT 0.05'],
    showCalloutPin: true,
    calloutPinText: '🎯 50% FVG C.E. RETEST ($4,132.50)',
    calloutCandleIndex: 2,
    showPipCounter: true,
    targetPips: 75,
    showExecutionBadge: true,
    executionOrder: {
      type: 'SELL',
      entry: 4132.5,
      sl: 4134.5,
      tp: 4125.0,
      lot: 0.05,
      risk: 10,
    },
    scriptSubtitles: [
      { timePercent: 0.0, text: 'DỪNG ĐỌC CHART KIỂU ĐOÁN MÒ! 3 CÂY NẾN TIẾT LỘ DÒNG TIỀN LỚN.', stageName: 'Hook' },
      { timePercent: 0.28, text: 'Bạn thấy nến xanh dài liền vội vã bấm BUY? Đó là lúc các quỹ lớn xả hàng vào đầu bạn!', stageName: 'Trap' },
      { timePercent: 0.58, text: 'Cây 1 quét đỉnh rút râu, cây 2 tạo FVG, hãy đợi cây 3 hồi đúng 50% FVG tại $4,132.50 để vào lệnh!', stageName: 'Setup' },
      { timePercent: 0.82, text: 'Khóa rủi ro đúng 10 đô! Đặt Stop Loss 20 pips tại $4,134.50, size 0.05 lot, target $4,125.00.', stageName: 'Execution' },
    ],
    spotlightEnabled: true,
    candles: [
      { id: 'c-pp1', index: 0, open: 4130.0, high: 4138.0, low: 4129.0, close: 4134.0 }, // Cây 1: Râu nến quét đỉnh $4,138 rồi rút chân
      { id: 'c-pp2', index: 1, open: 4134.0, high: 4134.5, low: 4127.0, close: 4128.0 }, // Cây 2: Displacement FVG dump
      { id: 'c-pp3', index: 2, open: 4128.0, high: 4132.5, low: 4124.0, close: 4125.0 }, // Cây 3: Retest đúng 50% FVG rồi xả mạnh
    ],
    overlays: [
      {
        id: 'ov-sweep-peak',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 0,
        endCandleIndex: 2,
        priceStart: 4138.0,
        priceEnd: 4138.0,
        color: '#F43F5E',
        opacity: 0.9,
        label: 'BSL Sweep Peak ($4,138.00)',
      },
      {
        id: 'ov-fvg-ce',
        type: 'FVG',
        startCandleIndex: 1,
        endCandleIndex: 2,
        priceStart: 4129.0,
        priceEnd: 4134.0,
        color: '#F59E0B',
        opacity: 0.35,
        label: 'Bearish FVG 50% C.E. ($4,132.50)',
      },
      {
        id: 'ov-rr-pp0023',
        type: 'LONG_SHORT',
        startCandleIndex: 2,
        endCandleIndex: 2,
        priceStart: 4132.5,
        priceEnd: 4125.0,
        color: '#00F5A0',
        opacity: 0.35,
        label: 'SELL 0.05 lot @ $4,132.50 (1:3.75 RR)',
      },
    ],
  },
  {
    id: 'hexagold-asia-sweep',
    title: '[TikTok Viral] Hexagold: Bẫy Quét Đỉnh Á XAUUSD',
    strategy: 'SMC',
    tier: 'Creator',
    aspectRatio: '9:16',
    duration: 6.0,
    revealMode: 'sequential',
    description: 'Video TikTok phong cách Hexagold: Giá phá vỡ đỉnh Á tạo bẫy Bull Trap dụ Retail BUY, xuất hiện nến rút râu quét SL rồi sập mạnh +240 pips.',
    headlineText: 'TẠI SAO BẠN THUA LỖ KHI BUY GOLD TẠI ĐỈNH?',
    sublineText: 'Bẫy Liquidity Sweep M15 & Điểm vào lệnh chuẩn SMC',
    badges: ['1. LOSS $30', '2. SL 20 PIPS', '3. LOT 0.05'],
    showCalloutPin: true,
    calloutPinText: '🎯 BẪY DỤ BUY QUÉT ĐỈNH',
    calloutCandleIndex: 2,
    showPipCounter: true,
    targetPips: 240,
    showExecutionBadge: true,
    executionOrder: {
      type: 'SELL',
      entry: 4136.0,
      sl: 4142.0,
      tp: 4112.0,
      lot: 0.05,
      risk: 30,
    },
    scriptSubtitles: [
      { timePercent: 0.0, text: 'Rất nhiều trader thấy cây nến xanh lớn liền vội vàng BUY đuổi...', stageName: 'Hook' },
      { timePercent: 0.28, text: 'Nhưng đây là cái bẫy thanh khoản của Market Maker dụ Retail Trader!', stageName: 'Trap' },
      { timePercent: 0.58, text: 'Nến rút râu để lại Bearish FVG M15 & MSS. Đây là dấu chân Big Boys!', stageName: 'Setup' },
      { timePercent: 0.82, text: 'Đặt SL 20 pips ($30 Risk), chốt lời +240 pips tại đáy cũ (1:4 R:R).', stageName: 'Execution' },
    ],
    spotlightEnabled: true,
    candles: [
      { id: 'c-1', index: 0, open: 4130.0, high: 4135.0, low: 4128.0, close: 4134.0 }, // Asian Range
      { id: 'c-2', index: 1, open: 4134.0, high: 4138.0, low: 4132.0, close: 4137.5 }, // Approaching Asia High
      { id: 'c-3', index: 2, open: 4137.5, high: 4146.0, low: 4135.0, close: 4136.0 }, // Bull Trap Wick (Liquidity Sweep)
      { id: 'c-4', index: 3, open: 4136.0, high: 4137.0, low: 4122.0, close: 4123.5 }, // Displacement Dump & MSS
      { id: 'c-5', index: 4, open: 4123.5, high: 4132.0, low: 4121.0, close: 4131.0 }, // Retest Bearish FVG [4126 - 4135]
      { id: 'c-6', index: 5, open: 4131.0, high: 4131.5, low: 4115.0, close: 4116.0 }, // Selloff continuation
      { id: 'c-7', index: 6, open: 4116.0, high: 4117.0, low: 4099.0, close: 4102.0 }, // TP Hit +240 pips
    ],
    overlays: [
      {
        id: 'asia-high-line',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 0,
        endCandleIndex: 3,
        priceStart: 4138.0,
        priceEnd: 4138.0,
        color: '#F59E0B',
        opacity: 0.9,
        label: 'Đỉnh Phiên Á (Asia High - 4,138.00)',
      },
      {
        id: 'fvg-bear',
        type: 'FVG',
        startCandleIndex: 3,
        endCandleIndex: 5,
        priceStart: 4126.0,
        priceEnd: 4135.0,
        color: '#FF3366',
        opacity: 0.25,
        label: 'Bearish FVG M15 [4126 - 4135]',
      },
      {
        id: 'rr-setup',
        type: 'LONG_SHORT',
        startCandleIndex: 4,
        endCandleIndex: 6,
        priceStart: 4131.0,
        priceEnd: 4102.0,
        color: '#00F5A0',
        opacity: 0.25,
        label: 'SELL XAUUSD +240 Pips (1:4 RR)',
      },
    ],
  },
  {
    id: 'hexagold-cpi-dump',
    title: '[TikTok Viral] Hexagold: Giật Râu Nến CPI & Đảo Chiều 350 Pips',
    strategy: 'ICT',
    tier: 'Pro',
    aspectRatio: '9:16',
    duration: 6.0,
    revealMode: 'sequential',
    description: 'Video phân tích tin tức CPI giật bấc Judas Swing 130 pips gom thanh khoản phe mua rồi sập gãy cấu trúc MSS.',
    headlineText: 'ĐỪNG GIAO DỊCH KHI TIN CPI VỪA RA!',
    sublineText: 'Chờ Judas Swing quét sạch thanh khoản rồi Retest FVG',
    badges: ['1. CHỜ SWEEP', '2. RETEST FVG', '3. RR 1:3.5'],
    showCalloutPin: true,
    calloutPinText: '⚡ JUDAS SWEEP 4,155.00',
    calloutCandleIndex: 2,
    showPipCounter: true,
    targetPips: 350,
    showExecutionBadge: true,
    executionOrder: {
      type: 'SELL',
      entry: 4128.0,
      sl: 4138.0,
      tp: 4093.0,
      lot: 0.05,
      risk: 30,
    },
    scriptSubtitles: [
      { timePercent: 0.0, text: 'Tin CPI vừa ra, bạn vội bấm lệnh theo cây nến giật?', stageName: 'Hook' },
      { timePercent: 0.28, text: 'Judas Swing giật 130 pips chỉ để gom thanh khoản của phe mua!', stageName: 'Trap' },
      { timePercent: 0.58, text: 'Sập gãy cấu trúc MSS tạo Imbalance FVG cực lớn.', stageName: 'Setup' },
      { timePercent: 0.82, text: 'Chờ giá retest 50% FVG mới vào lệnh SELL, SL trên đỉnh râu nến.', stageName: 'Execution' },
    ],
    spotlightEnabled: true,
    candles: [
      { id: 'c-1', index: 0, open: 4138.0, high: 4144.0, low: 4136.0, close: 4142.0 },
      { id: 'c-2', index: 1, open: 4142.0, high: 4145.0, low: 4140.0, close: 4143.5 },
      { id: 'c-3', index: 2, open: 4143.5, high: 4155.0, low: 4138.0, close: 4140.0 }, // Judas Wick
      { id: 'c-4', index: 3, open: 4140.0, high: 4141.0, low: 4112.0, close: 4114.0 }, // Dump
      { id: 'c-5', index: 4, open: 4114.0, high: 4120.0, low: 4104.0, close: 4106.0 },
      { id: 'c-6', index: 5, open: 4106.0, high: 4130.0, low: 4105.0, close: 4128.0 }, // Retest FVG
      { id: 'c-7', index: 6, open: 4128.0, high: 4129.0, low: 4093.0, close: 4095.0 }, // Dump TP
    ],
    overlays: [
      {
        id: 'news-sweep',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 1,
        endCandleIndex: 3,
        priceStart: 4145.0,
        priceEnd: 4145.0,
        color: '#FF3366',
        opacity: 0.9,
        label: 'CPI Sweep Wick ($4,155.00)',
      },
      {
        id: 'bear-fvg',
        type: 'FVG',
        startCandleIndex: 3,
        endCandleIndex: 6,
        priceStart: 4120.0,
        priceEnd: 4138.0,
        color: '#FF3366',
        opacity: 0.25,
        label: 'Bearish FVG [4120 - 4138]',
      },
    ],
  },
  {
    id: 'hexagold-risk-first-30',
    title: '[TikTok Viral] Hexagold: Bí Quyết Đặt SL $30 Của Azzam Master',
    strategy: 'Price Action',
    tier: 'Creator',
    aspectRatio: '9:16',
    duration: 5.5,
    revealMode: 'sequential',
    description: 'Quy tắc vàng sống còn: Xác định Risk Budget $30 trước, SL 20 pips, tính ra Size 0.05 lot rồi mới ấn lệnh.',
    headlineText: 'THE STOP LOSS CAME FIRST',
    sublineText: 'Quy tắc vàng sống còn: Risk Budget trước Entry',
    badges: ['1. LOSS $30', '2. SL 20 PIPS', '3. LOT 0.05'],
    showCalloutPin: true,
    calloutPinText: '🛡️ $30 RISK BUDGET LOCKED',
    calloutCandleIndex: 5,
    showPipCounter: true,
    targetPips: 220,
    showExecutionBadge: true,
    executionOrder: {
      type: 'BUY',
      entry: 4138.0,
      sl: 4131.0,
      tp: 4160.0,
      lot: 0.05,
      risk: 30,
    },
    scriptSubtitles: [
      { timePercent: 0.0, text: 'Đa số trader hỏi: "Kèo này ăn được bao nhiêu tiền?"', stageName: 'Hook' },
      { timePercent: 0.28, text: 'Nhưng Pro Trader luôn hỏi: "Nếu sai, mình chấp nhận mất bao nhiêu?"', stageName: 'Trap' },
      { timePercent: 0.58, text: 'Xác định Risk $30 trước, đo SL 20 pips -> Tính ra Lot 0.05.', stageName: 'Setup' },
      { timePercent: 0.82, text: 'Tâm lý thoải mái, gồng lãi 1:3.5 R:R về đích an toàn (+220 pips).', stageName: 'Execution' },
    ],
    spotlightEnabled: true,
    candles: [
      { id: 'c-1', index: 0, open: 4125.0, high: 4132.5, low: 4123.0, close: 4130.0 },
      { id: 'c-2', index: 1, open: 4130.0, high: 4138.0, low: 4128.5, close: 4136.5 },
      { id: 'c-3', index: 2, open: 4136.5, high: 4139.0, low: 4126.0, close: 4127.5 },
      { id: 'c-4', index: 3, open: 4127.5, high: 4148.0, low: 4126.0, close: 4145.0 },
      { id: 'c-5', index: 4, open: 4145.0, high: 4154.0, low: 4143.0, close: 4152.5 },
      { id: 'c-6', index: 5, open: 4152.5, high: 4153.5, low: 4136.0, close: 4138.0 },
      { id: 'c-7', index: 6, open: 4138.0, high: 4162.0, low: 4137.0, close: 4160.0 },
    ],
    overlays: [
      {
        id: 'fvg-gold',
        type: 'FVG',
        startCandleIndex: 3,
        endCandleIndex: 6,
        priceStart: 4129.0,
        priceEnd: 4143.0,
        color: '#00F5A0',
        opacity: 0.22,
        label: 'Bullish FVG [4129 - 4143]',
      },
    ],
  },
  {
    id: 'xauusd-london-asia-sweep',
    title: 'XAUUSD: London Asia Low Sweep & NY Expansion',
    strategy: 'ICT',
    tier: 'Pro',
    aspectRatio: '9:16',
    duration: 5.5,
    revealMode: 'sequential',
    description: 'Chiến thuật Vàng thực chiến 2026: Phiên Á đi ngang (4122 - 4130), London quét bấc thủng đáy Á xuống 4114 (chạm H1 OB) rồi New York bùng nổ lên 4148.50.',
    headlineText: 'LONDON QUÉT ĐÁY Á & NEW YORK BÙNG NỔ',
    sublineText: 'Cú rũ bỏ bẫy Bear Trap chạm H1 Bullish Order Block',
    badges: ['1. LOSS $30', '2. SL 20 PIPS', '3. LOT 0.05'],
    showCalloutPin: true,
    calloutPinText: '🎯 QUÉT ĐÁY Á 4,114.00 (H1 OB)',
    calloutCandleIndex: 2,
    showPipCounter: true,
    targetPips: 265,
    showExecutionBadge: true,
    executionOrder: {
      type: 'BUY',
      entry: 4132.0,
      sl: 4124.0,
      tp: 4158.5,
      lot: 0.05,
      risk: 30,
    },
    scriptSubtitles: [
      { timePercent: 0.0, text: 'Phiên Á đi ngang tích lũy biên độ hẹp, đám đông vội Buy Breakout...', stageName: 'Hook' },
      { timePercent: 0.28, text: 'London mở cửa quét thủng đáy Á 4,122 dụ Retail bán tháo chạm H1 Order Block!', stageName: 'Trap' },
      { timePercent: 0.58, text: 'Phiên Mỹ New York bùng nổ phá vỡ cấu trúc đỉnh Á, để lại Bullish FVG.', stageName: 'Setup' },
      { timePercent: 0.82, text: 'Canh BUY khi giá hồi về 50% FVG, SL 20 pips, chốt lời +265 pips (1:4.5 RR).', stageName: 'Execution' },
    ],
    spotlightEnabled: true,
    candles: [
      { id: 'c-1', index: 0, open: 4126.0, high: 4130.0, low: 4124.0, close: 4128.5 }, // Asia High 4130
      { id: 'c-2', index: 1, open: 4128.5, high: 4129.0, low: 4122.0, close: 4123.0 }, // Asia Low 4122
      { id: 'c-3', index: 2, open: 4123.0, high: 4125.0, low: 4114.0, close: 4116.5 }, // London Sweep wick into H1 OB
      { id: 'c-4', index: 3, open: 4116.5, high: 4136.0, low: 4115.0, close: 4135.0 }, // NY Open Displacement
      { id: 'c-5', index: 4, open: 4135.0, high: 4148.0, low: 4133.0, close: 4146.0 }, // BOS of Asia High 4130
      { id: 'c-6', index: 5, open: 4146.0, high: 4147.0, low: 4138.0, close: 4139.0 },
      { id: 'c-7', index: 6, open: 4139.0, high: 4140.0, low: 4129.5, close: 4132.0 }, // Retest into Bullish FVG [4125 - 4133]
      { id: 'c-8', index: 7, open: 4132.0, high: 4152.0, low: 4131.0, close: 4150.0 }, // Expansion rally
      { id: 'c-9', index: 8, open: 4150.0, high: 4162.0, low: 4149.0, close: 4158.5 }, // Target TP
    ],
    overlays: [
      {
        id: 'asia-high',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 0,
        endCandleIndex: 5,
        priceStart: 4130.0,
        priceEnd: 4130.0,
        color: '#F59E0B',
        opacity: 0.85,
        label: 'Asia High Liquidity (4,130.00)',
      },
      {
        id: 'asia-low-sweep',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 1,
        endCandleIndex: 3,
        priceStart: 4122.0,
        priceEnd: 4122.0,
        color: '#FF3366',
        opacity: 0.85,
        label: 'Asia Low Sweep ($$$) - 4,122.00',
      },
      {
        id: 'h1-ob',
        type: 'ORDER_BLOCK',
        startCandleIndex: 2,
        endCandleIndex: 4,
        priceStart: 4114.0,
        priceEnd: 4118.0,
        color: '#6366F1',
        opacity: 0.25,
        label: 'H1 Bullish Order Block [4114 - 4118]',
      },
      {
        id: 'bull-fvg',
        type: 'FVG',
        startCandleIndex: 3,
        endCandleIndex: 7,
        priceStart: 4125.0,
        priceEnd: 4133.0,
        color: '#00F5A0',
        opacity: 0.22,
        label: 'NY Bullish FVG [4125.00 - 4133.00]',
      },
      {
        id: 'rr-long',
        type: 'LONG_SHORT',
        startCandleIndex: 6,
        endCandleIndex: 8,
        priceStart: 4132.0, // Entry
        priceEnd: 4158.5, // TP (+265 pips)
        color: '#00F5A0',
        opacity: 0.2,
        label: 'Long XAUUSD +265 Pips (1:4.5 RR)',
      },
    ],
  },
  {
    id: 'xauusd-cpi-spike-reversal',
    title: 'XAUUSD: US CPI News Spike & Bearish FVG Inversion',
    strategy: 'SMC',
    tier: 'Pro',
    aspectRatio: '9:16',
    duration: 5.0,
    revealMode: 'brownian',
    description: 'Tin CPI Mỹ: Cú giật bấc Judas Swing 130 pips lên 4155 rồi sập gãy cấu trúc (MSS) về 4105 tạo Bearish FVG lớn.',
    headlineText: 'BẪY GIẬT BẤC TIN CPI & ĐẢO CHIỀU 300 PIPS',
    sublineText: 'Cú đâm Judas Swing quét thanh khoản phe Mua',
    badges: ['1. CHỜ SWEEP', '2. RETEST FVG', '3. RR 1:3.3'],
    showCalloutPin: true,
    calloutPinText: '⚡ BẪY QUÉT THANH KHOẢN CPI',
    calloutCandleIndex: 2,
    showPipCounter: true,
    targetPips: 300,
    showExecutionBadge: true,
    executionOrder: {
      type: 'SELL',
      entry: 4128.0,
      sl: 4137.0,
      tp: 4098.0,
      lot: 0.05,
      risk: 30,
    },
    scriptSubtitles: [
      { timePercent: 0.0, text: 'Tin CPI vừa công bố, bạn thấy nến xanh giật mạnh liền vội bấm BUY?', stageName: 'Hook' },
      { timePercent: 0.28, text: 'Judas Swing đâm râu lên 4,155.00 gom sạch thanh khoản phe Mua!', stageName: 'Trap' },
      { timePercent: 0.58, text: 'Nến đỏ nhấn chìm sập gãy cấu trúc MSS tạo vùng Bearish FVG cực lớn.', stageName: 'Setup' },
      { timePercent: 0.82, text: 'Vào lệnh SELL khi giá hồi về mép FVG, SL trên đỉnh râu, TP +300 pips (1:3.3 RR).', stageName: 'Execution' },
    ],
    spotlightEnabled: true,
    candles: [
      { id: 'c-1', index: 0, open: 4138.0, high: 4144.0, low: 4136.0, close: 4142.0 }, // Pre-news
      { id: 'c-2', index: 1, open: 4142.0, high: 4145.0, low: 4140.0, close: 4143.5 }, // Equal Highs
      { id: 'c-3', index: 2, open: 4143.5, high: 4155.0, low: 4138.0, close: 4140.0 }, // CPI Spike Wick
      { id: 'c-4', index: 3, open: 4140.0, high: 4141.0, low: 4112.0, close: 4114.0 }, // Massive red dump candle
      { id: 'c-5', index: 4, open: 4114.0, high: 4120.0, low: 4104.0, close: 4106.0 }, // Sell-off
      { id: 'c-6', index: 5, open: 4106.0, high: 4130.0, low: 4105.0, close: 4128.0 }, // Pullback into Bearish FVG [4120 - 4138]
      { id: 'c-7', index: 6, open: 4128.0, high: 4129.0, low: 4098.0, close: 4100.0 }, // Full dump continuation
    ],
    overlays: [
      {
        id: 'news-sweep',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 1,
        endCandleIndex: 3,
        priceStart: 4145.0,
        priceEnd: 4145.0,
        color: '#FF3366',
        opacity: 0.9,
        label: 'CPI Liquidity Sweep Wick (4,155.00)',
      },
      {
        id: 'bear-fvg',
        type: 'FVG',
        startCandleIndex: 3,
        endCandleIndex: 6,
        priceStart: 4120.0,
        priceEnd: 4138.0,
        color: '#FF3366',
        opacity: 0.25,
        label: 'Bearish FVG [4120.00 - 4138.00]',
      },
      {
        id: 'mss-gold',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 0,
        endCandleIndex: 4,
        priceStart: 4136.0,
        priceEnd: 4136.0,
        color: '#38BDF8',
        opacity: 0.8,
        label: 'MSS (Market Structure Shift) - 4,136.00',
      },
    ],
  },
  {
    id: 'xauusd-4150-round-level',
    title: 'XAUUSD: $4,150 Psychological Round Level Liquidity Grab',
    strategy: 'ICT',
    tier: 'Creator',
    aspectRatio: '16:9',
    duration: 6.0,
    revealMode: 'sequential',
    description: 'Vùng số tròn tâm lý $4,150.00: Đám đông đặt buy-stop breakout bị bẫy thanh khoản (Institutional Trap), giá đảo chiều 350 pips về 4115.',
    headlineText: 'CẢN TÂM LÝ SỐ TRÒN $4,150.00: ĐỪNG BUY ĐUỔI',
    sublineText: 'Bẫy phân phối tổ chức khiến retail trader kẹt lệnh',
    badges: ['1. LOSS $30', '2. SL 20 PIPS', '3. LOT 0.05'],
    showCalloutPin: true,
    calloutPinText: '🛑 CẢN TÂM LÝ $4,150.00',
    calloutCandleIndex: 2,
    showPipCounter: true,
    targetPips: 220,
    showExecutionBadge: true,
    executionOrder: {
      type: 'SELL',
      entry: 4136.0,
      sl: 4142.0,
      tp: 4114.0,
      lot: 0.05,
      risk: 30,
    },
    scriptSubtitles: [
      { timePercent: 0.0, text: 'Đám đông hào hứng đặt lệnh BUY khi giá vượt qua mốc số tròn $4,150...', stageName: 'Hook' },
      { timePercent: 0.28, text: 'Nhưng các tổ chức tài chính dùng mức giá này để khớp thanh khoản Bán!', stageName: 'Trap' },
      { timePercent: 0.58, text: 'Nến rút râu tạo Institutional Supply Block, giá đảo chiều sập mạnh.', stageName: 'Setup' },
      { timePercent: 0.82, text: 'Chờ nhịp test 4,138 để vào SELL, SL 20 pips, chốt lời +220 pips (1:3.6 RR).', stageName: 'Execution' },
    ],
    spotlightEnabled: true,
    candles: [
      { id: 'c-1', index: 0, open: 4135.0, high: 4142.0, low: 4134.0, close: 4141.0 },
      { id: 'c-2', index: 1, open: 4141.0, high: 4148.0, low: 4139.0, close: 4147.5 }, // Approaching 4150
      { id: 'c-3', index: 2, open: 4147.5, high: 4155.5, low: 4146.0, close: 4148.0 }, // Trap wick tapping 4155.50
      { id: 'c-4', index: 3, open: 4148.0, high: 4149.0, low: 4130.0, close: 4132.0 }, // Sharp decline
      { id: 'c-5', index: 4, open: 4132.0, high: 4134.0, low: 4121.0, close: 4122.5 }, // Breakdown
      { id: 'c-6', index: 5, open: 4122.5, high: 4138.0, low: 4121.0, close: 4136.0 }, // Retest 4138 mitigation
      { id: 'c-7', index: 6, open: 4136.0, high: 4137.0, low: 4112.0, close: 4114.0 }, // Target $4114
    ],
    overlays: [
      {
        id: 'round-number',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 0,
        endCandleIndex: 4,
        priceStart: 4150.0,
        priceEnd: 4150.0,
        color: '#EAB308',
        opacity: 0.95,
        label: 'Key Level: $4,150.00 Major Psychological Barrier',
      },
      {
        id: 'ob-bear',
        type: 'ORDER_BLOCK',
        startCandleIndex: 2,
        endCandleIndex: 6,
        priceStart: 4146.0,
        priceEnd: 4154.0,
        color: '#FF3366',
        opacity: 0.28,
        label: 'Institutional Supply Block (4146 - 4154)',
      },
    ],
  },
  {
    id: 'xauusd-m15-scalp-fvg',
    title: 'XAUUSD: High R:R Gold Scalp - M15 FVG Retest',
    strategy: 'SMC',
    tier: 'Free',
    aspectRatio: '9:16',
    duration: 4.5,
    revealMode: 'sequential',
    description: 'Thiết lập Scalp Vàng M15 tại vùng giá 4,129: Rủi ro 20 pips, lợi nhuận 80 pips (R:R 1:4.0). Canh mua tại 50% Consequent Encroachment.',
    headlineText: 'BÍ QUYẾT SCALP VÀNG M15 TẠI 50% FVG C.E.',
    sublineText: 'Rủi ro 20 pips, chốt lời 80-210 pips với tỷ lệ 1:4.0 RR',
    badges: ['1. LOSS $30', '2. 50% FVG C.E.', '3. RR 1:4.0'],
    showCalloutPin: true,
    calloutPinText: '🎯 CHẠM 50% FVG C.E. (4131.5)',
    calloutCandleIndex: 3,
    showPipCounter: true,
    targetPips: 210,
    showExecutionBadge: true,
    executionOrder: {
      type: 'BUY',
      entry: 4133.0,
      sl: 4127.0,
      tp: 4154.0,
      lot: 0.05,
      risk: 30,
    },
    scriptSubtitles: [
      { timePercent: 0.0, text: 'Scalp Vàng khung M15: Không vào lệnh ở mép hộp FVG ngẫu nhiên!', stageName: 'Hook' },
      { timePercent: 0.28, text: 'Cây nến đẩy cực mạnh tạo Imbalance giữa nến 1 và nến 3.', stageName: 'Trap' },
      { timePercent: 0.58, text: 'Chờ giá kiên nhẫn hồi về đúng 50% Consequent Encroachment (C.E.).', stageName: 'Setup' },
      { timePercent: 0.82, text: 'Nhấn BUY ngay khi nến rút chân, SL 20 pips, gồng lãi 1:4.0 RR về đỉnh.', stageName: 'Execution' },
    ],
    spotlightEnabled: true,
    candles: [
      { id: 'c-1', index: 0, open: 4122.0, high: 4126.0, low: 4120.0, close: 4125.0 },
      { id: 'c-2', index: 1, open: 4125.0, high: 4140.0, low: 4124.0, close: 4139.0 }, // Strong M15 expansion candle
      { id: 'c-3', index: 2, open: 4139.0, high: 4148.0, low: 4137.0, close: 4146.0 },
      { id: 'c-4', index: 3, open: 4146.0, high: 4147.0, low: 4131.5, close: 4133.0 }, // Retest 50% CE (4131.5)
      { id: 'c-5', index: 4, open: 4133.0, high: 4156.0, low: 4132.0, close: 4154.0 }, // Profit target hit
    ],
    overlays: [
      {
        id: 'scalp-fvg',
        type: 'FVG',
        startCandleIndex: 1,
        endCandleIndex: 4,
        priceStart: 4126.0,
        priceEnd: 4137.0,
        color: '#00F5A0',
        opacity: 0.25,
        label: 'XAUUSD M15 FVG [4126.00 - 4137.00]',
      },
      {
        id: 'scalp-rr',
        type: 'LONG_SHORT',
        startCandleIndex: 3,
        endCandleIndex: 4,
        priceStart: 4133.0, // Entry
        priceEnd: 4154.0, // TP (+210 pips)
        color: '#00F5A0',
        opacity: 0.22,
        label: 'Scalp Entry at 50% CE (1:4.2 RR)',
      },
    ],
  },
  {
    id: 'xauusd-break-retest-support',
    title: 'XAUUSD: Breakout & Resistance-Turned-Support Retest',
    strategy: 'Price Action',
    tier: 'Pro',
    aspectRatio: '16:9',
    duration: 6.0,
    revealMode: 'sequential',
    description: 'Mô hình Break & Retest kinh điển: Nến Marubozu phá thủng kháng cự $4,132.00, nến sau kiểm định lại cản cũ thành hỗ trợ mới và bật tăng mạnh 240 pips.',
    headlineText: 'BREAKOUT & RETEST: KHÁNG CỰ HÓA HỖ TRỢ',
    sublineText: 'Nến Marubozu phá cản $4,132.00 và nhịp kiểm định hoàn hảo',
    badges: ['1. LOSS $30', '2. SL 20 PIPS', '3. LOT 0.05'],
    showCalloutPin: true,
    calloutPinText: '🚀 PHÁ CẢN THÀNH HỖ TRỢ $4,132',
    calloutCandleIndex: 3,
    showPipCounter: true,
    targetPips: 210,
    showExecutionBadge: true,
    executionOrder: {
      type: 'BUY',
      entry: 4134.0,
      sl: 4128.0,
      tp: 4155.0,
      lot: 0.05,
      risk: 30,
    },
    scriptSubtitles: [
      { timePercent: 0.0, text: 'Đừng vội mua đuổi ngay khi cây nến xanh phá vỡ mức kháng cự $4,132!', stageName: 'Hook' },
      { timePercent: 0.28, text: 'Market Maker luôn tạo nhịp hồi kiểm định xem phe Bán còn lực không.', stageName: 'Trap' },
      { timePercent: 0.58, text: 'Cây nến Hammer rút râu kiểm định hoàn hảo cản cũ biến thành hỗ trợ mới.', stageName: 'Setup' },
      { timePercent: 0.82, text: 'Vào lệnh BUY tại $4,134, SL sau râu nến chỉ 20 pips, chốt lời +210 pips.', stageName: 'Execution' },
    ],
    spotlightEnabled: true,
    candles: [
      { id: 'c-1', index: 0, open: 4125.0, high: 4132.0, low: 4123.0, close: 4130.0 },
      { id: 'c-2', index: 1, open: 4130.0, high: 4132.5, low: 4127.0, close: 4131.0 },
      { id: 'c-3', index: 2, open: 4131.0, high: 4145.0, low: 4130.5, close: 4144.0 }, // Big breakout bar
      { id: 'c-4', index: 3, open: 4144.0, high: 4144.5, low: 4132.0, close: 4134.0 }, // Retest bar hitting $4132
      { id: 'c-5', index: 4, open: 4134.0, high: 4140.0, low: 4132.0, close: 4139.5 }, // Confirmation hammer
      { id: 'c-6', index: 5, open: 4139.5, high: 4156.0, low: 4138.0, close: 4155.0 }, // Expansion rally
    ],
    overlays: [
      {
        id: 'res-support-line',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 0,
        endCandleIndex: 5,
        priceStart: 4132.0,
        priceEnd: 4132.0,
        color: '#38BDF8',
        opacity: 0.9,
        label: 'Broken Resistance Turned Support: $4,132.00',
      },
      {
        id: 'breakout-rr',
        type: 'LONG_SHORT',
        startCandleIndex: 4,
        endCandleIndex: 5,
        priceStart: 4134.0,
        priceEnd: 4155.0,
        color: '#00F5A0',
        opacity: 0.25,
        label: 'Retest Entry | 1:3.5 RR',
      },
    ],
  },
  {
    id: 'xauusd-h1-supply-distribution',
    title: 'XAUUSD: H1 Supply Zone Institutional Distribution',
    strategy: 'SMC',
    tier: 'Creator',
    aspectRatio: '1:1',
    duration: 5.5,
    revealMode: 'sequential',
    description: 'Khối cung H1 Supply Zone $4,148.00: Đám đông FOMO mua đỉnh bị các tổ chức tài chính phân phối lệnh Short đảo chiều 320 pips về $4,116.',
    headlineText: 'KHỐI CUNG H1 PHÂN PHỐI: BẪY FOMO MUA ĐỈNH',
    sublineText: 'Tổ chức tài chính phân phối lệnh Short đảo chiều 330 pips',
    badges: ['1. LOSS $30', '2. H1 SUPPLY', '3. RR 1:4.0'],
    showCalloutPin: true,
    calloutPinText: '🏛️ H1 SUPPLY ZONE PHÂN PHỐI',
    calloutCandleIndex: 2,
    showPipCounter: true,
    targetPips: 330,
    showExecutionBadge: true,
    executionOrder: {
      type: 'SELL',
      entry: 4149.0,
      sl: 4153.0,
      tp: 4116.0,
      lot: 0.05,
      risk: 30,
    },
    scriptSubtitles: [
      { timePercent: 0.0, text: 'Thấy giá tăng liên tục chạm vùng $4,150, bạn nghĩ nó sẽ bay tiếp?', stageName: 'Hook' },
      { timePercent: 0.28, text: 'Đây là H1 Premium Supply Zone - nơi các tổ chức chốt lời và đảo hàng!', stageName: 'Trap' },
      { timePercent: 0.58, text: 'Xuất hiện nến Rejection Pinbar từ chối giá quyết liệt.', stageName: 'Setup' },
      { timePercent: 0.82, text: 'SELL ngay tại vùng cung, SL chặt 20 pips, chốt lời 330 pips (1:4.0 RR).', stageName: 'Execution' },
    ],
    spotlightEnabled: true,
    candles: [
      { id: 'c-1', index: 0, open: 4138.0, high: 4145.0, low: 4136.0, close: 4144.0 },
      { id: 'c-2', index: 1, open: 4144.0, high: 4150.0, low: 4143.0, close: 4149.0 }, // Tapping supply zone
      { id: 'c-3', index: 2, open: 4149.0, high: 4150.5, low: 4138.0, close: 4139.0 }, // Rejection pinbar
      { id: 'c-4', index: 3, open: 4139.0, high: 4141.0, low: 4125.0, close: 4126.0 }, // Heavy sell-off
      { id: 'c-5', index: 4, open: 4126.0, high: 4132.0, low: 4124.0, close: 4130.0 }, // Low volume retest
      { id: 'c-6', index: 5, open: 4130.0, high: 4131.0, low: 4115.0, close: 4116.0 }, // Profit target hit
    ],
    overlays: [
      {
        id: 'h1-supply-box',
        type: 'ORDER_BLOCK',
        startCandleIndex: 0,
        endCandleIndex: 3,
        priceStart: 4144.0,
        priceEnd: 4150.5,
        color: '#EF4444',
        opacity: 0.28,
        label: 'H1 Premium Supply Zone [4144 - 4150]',
      },
      {
        id: 'short-rr',
        type: 'LONG_SHORT',
        startCandleIndex: 2,
        endCandleIndex: 5,
        priceStart: 4149.0,
        priceEnd: 4116.0,
        color: '#EF4444',
        opacity: 0.22,
        label: 'Institutional Short Target: 330 Pips (1:4.0 RR)',
      },
    ],
  },
  {
    id: 'xauusd-risk-first-3steps',
    title: 'XAUUSD: Azzam Risk-First 3-Step Execution Model',
    strategy: 'Price Action',
    tier: 'Pro',
    aspectRatio: '9:16',
    duration: 5.0,
    revealMode: 'sequential',
    description: 'Quy tắc vàng @azzammastertradinggold: Bước 1: Khóa lỗ $30. Bước 2: SL 20 pips tại $4,128. Bước 3: Size lệnh $1.50/pip. Cắt lỗ đi trước, điểm vào đi sau.',
    headlineText: '3 BƯỚC VÀO LỆNH SỐNG CÒN CỦA AZZAM MASTER',
    sublineText: 'Xác định số tiền chấp nhận mất trước khi bấm nút Mua',
    badges: ['1. LOSS $30', '2. SL 20 PIPS', '3. LOT 0.05'],
    showCalloutPin: true,
    calloutPinText: '🛡️ HỖ TRỢ $4,128 (SL 20 PIPS)',
    calloutCandleIndex: 4,
    showPipCounter: true,
    targetPips: 210,
    showExecutionBadge: true,
    executionOrder: {
      type: 'BUY',
      entry: 4129.0,
      sl: 4125.0,
      tp: 4150.0,
      lot: 0.05,
      risk: 30,
    },
    scriptSubtitles: [
      { timePercent: 0.0, text: 'Quy tắc bất biến: Cắt lỗ đi trước, điểm vào lệnh đi sau!', stageName: 'Hook' },
      { timePercent: 0.28, text: 'Bước 1: Khóa chặt ngân sách rủi ro tối đa $30 cho mỗi lần vào lệnh.', stageName: 'Trap' },
      { timePercent: 0.58, text: 'Bước 2: Tìm vùng hỗ trợ kỹ thuật $4,128, đo khoảng cách SL 20 pips.', stageName: 'Setup' },
      { timePercent: 0.82, text: 'Bước 3: Tính ra size lệnh 0.05 lot. Tâm lý vững vàng, gồng lãi 1:3.5 RR.', stageName: 'Execution' },
    ],
    spotlightEnabled: true,
    candles: [
      { id: 'c-1', index: 0, open: 4120.0, high: 4132.0, low: 4119.0, close: 4130.0 },
      { id: 'c-2', index: 1, open: 4130.0, high: 4132.0, low: 4125.0, close: 4126.0 },
      { id: 'c-3', index: 2, open: 4126.0, high: 4142.0, low: 4124.0, close: 4140.0 }, // Impulse up
      { id: 'c-4', index: 3, open: 4140.0, high: 4141.0, low: 4128.0, close: 4129.0 }, // Pullback into support $4,128
      { id: 'c-5', index: 4, open: 4129.0, high: 4136.0, low: 4127.5, close: 4135.0 }, // Defensible bounce
      { id: 'c-6', index: 5, open: 4135.0, high: 4152.0, low: 4134.0, close: 4150.0 }, // Target 1:3.5 RR
    ],
    overlays: [
      {
        id: 'risk-first-line',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 1,
        endCandleIndex: 4,
        priceStart: 4128.0,
        priceEnd: 4128.0,
        color: '#38BDF8',
        opacity: 0.9,
        label: 'Defensible Support: $4,128.00 (SL: 20 pips)',
      },
      {
        id: 'risk-first-box',
        type: 'LONG_SHORT',
        startCandleIndex: 4,
        endCandleIndex: 5,
        priceStart: 4129.0,
        priceEnd: 4150.0,
        color: '#00F5A0',
        opacity: 0.25,
        label: 'Budget $30 | 20p SL | 1:3.5 RR',
      },
    ],
  },
  {
    id: 'xauusd-wyckoff-spring',
    title: 'XAUUSD: Wyckoff Phase C Spring & Shakeout',
    strategy: 'Wyckoff',
    tier: 'Creator',
    aspectRatio: '16:9',
    duration: 6.5,
    revealMode: 'sequential',
    description: 'Pha C Wyckoff: Đợt rũ bỏ cuối cùng (Spring) đâm thủng hỗ trợ 4120 rồi nhanh chóng phục hồi rút chân mạnh mẽ, xác nhận dòng tiền thông minh gom hàng xong.',
    headlineText: 'WYCKOFF PHA C: CÚ RŨ BỎ SPRING NGOẠN MỤC',
    sublineText: 'Cá mập đâm thủng hỗ trợ 4,120 gom hàng xong',
    badges: ['1. LOSS $30', '2. WYCKOFF C', '3. RR 1:3.5'],
    showCalloutPin: true,
    calloutPinText: '💎 WYCKOFF SPRING RŨ BỎ 4,112',
    calloutCandleIndex: 2,
    showPipCounter: true,
    targetPips: 190,
    showExecutionBadge: true,
    executionOrder: {
      type: 'BUY',
      entry: 4126.0,
      sl: 4120.0,
      tp: 4145.0,
      lot: 0.05,
      risk: 30,
    },
    scriptSubtitles: [
      { timePercent: 0.0, text: 'Khi vùng hỗ trợ đi ngang bị đâm thủng, đa số trader vội vã cắt lỗ...', stageName: 'Hook' },
      { timePercent: 0.28, text: 'Đó chính là cú Spring kinh điển của phương pháp Wyckoff để rũ bỏ nhỏ lẻ!' },
      { timePercent: 0.58, text: 'Giá phục hồi thần tốc rút chân mạnh mẽ xác nhận Big Boys đã gom đủ hàng.' },
      { timePercent: 0.82, text: 'Vào lệnh Test sau Spring tại 4,126, SL dưới đáy Spring, TP +190 pips.' },
    ],
    spotlightEnabled: true,
    candles: [
      { id: 'c-1', index: 0, open: 4130.0, high: 4132.0, low: 4120.0, close: 4121.0 }, // Range support test
      { id: 'c-2', index: 1, open: 4121.0, high: 4127.0, low: 4120.0, close: 4126.0 },
      { id: 'c-3', index: 2, open: 4126.0, high: 4127.0, low: 4112.0, close: 4118.0 }, // Spring wash-out below support!
      { id: 'c-4', index: 3, open: 4118.0, high: 4132.0, low: 4117.0, close: 4131.0 }, // Strong reclaim
      { id: 'c-5', index: 4, open: 4131.0, high: 4134.0, low: 4124.0, close: 4126.0 }, // Test after spring
      { id: 'c-6', index: 5, open: 4126.0, high: 4146.0, low: 4125.0, close: 4145.0 }, // Sign of Strength (SOS)
    ],
    overlays: [
      {
        id: 'trading-range-support',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 0,
        endCandleIndex: 4,
        priceStart: 4120.0,
        priceEnd: 4120.0,
        color: '#F59E0B',
        opacity: 0.85,
        label: 'Trading Range Support ($4,120.00)',
      },
      {
        id: 'spring-reclaim',
        type: 'LONG_SHORT',
        startCandleIndex: 4,
        endCandleIndex: 5,
        priceStart: 4126.0,
        priceEnd: 4145.0,
        color: '#00F5A0',
        opacity: 0.25,
        label: 'Spring Test Entry (SOS Target $4,145)',
      },
    ],
  },
];
