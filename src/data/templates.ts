import { Candle, Overlay, AspectRatio, RevealAnimationType } from '../types/chart';

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
}

export const TEMPLATES: ChartTemplate[] = [
  {
    id: 'smc-setup-breakdown',
    title: 'SMC Setup - Full Breakdown (BOS + OB + FVG)',
    strategy: 'SMC',
    tier: 'Pro',
    aspectRatio: '9:16',
    duration: 5.5,
    revealMode: 'sequential',
    description: 'Mô hình chuẩn Smart Money: Phá vỡ cấu trúc (BOS), tạo Fair Value Gap (FVG) và hồi quy về Order Block kích hoạt sóng tăng mạnh.',
    spotlightEnabled: true,
    candles: [
      { id: 'c-1', index: 0, open: 110, high: 113, low: 108, close: 109 },
      { id: 'c-2', index: 1, open: 109, high: 111, low: 104, close: 105 },
      { id: 'c-3', index: 2, open: 105, high: 107, low: 98, close: 100 }, // Order Block base
      { id: 'c-4', index: 3, open: 100, high: 118, low: 99, close: 117 }, // Strong displacement candle
      { id: 'c-5', index: 4, open: 117, high: 132, low: 116, close: 130 }, // BOS candle
      { id: 'c-6', index: 5, open: 130, high: 134, low: 125, close: 126 },
      { id: 'c-7', index: 6, open: 126, high: 127, low: 114, close: 115 }, // Retest into FVG & OB
      { id: 'c-8', index: 7, open: 115, high: 138, low: 114, close: 136 }, // Massive expansion rally
      { id: 'c-9', index: 8, open: 136, high: 148, low: 135, close: 147 },
    ],
    overlays: [
      {
        id: 'ob-1',
        type: 'ORDER_BLOCK',
        startCandleIndex: 2,
        endCandleIndex: 7,
        priceStart: 98,
        priceEnd: 105,
        color: '#6366F1',
        opacity: 0.28,
        label: 'Bullish Order Block (OB)',
      },
      {
        id: 'fvg-1',
        type: 'FVG',
        startCandleIndex: 3,
        endCandleIndex: 6,
        priceStart: 107,
        priceEnd: 116,
        color: '#00F5A0',
        opacity: 0.22,
        label: 'Fair Value Gap (FVG)',
      },
      {
        id: 'liq-1',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 0,
        endCandleIndex: 5,
        priceStart: 113,
        priceEnd: 113,
        color: '#F59E0B',
        opacity: 0.8,
        label: 'BOS (Break of Structure)',
      },
    ],
  },
  {
    id: 'ict-liquidity-sweep',
    title: 'ICT Liquidity Sweep & Judas Swing Reversal',
    strategy: 'ICT',
    tier: 'Pro',
    aspectRatio: '9:16',
    duration: 5.0,
    revealMode: 'brownian',
    description: 'Quét sạch thanh khoản đỉnh (BSL - Buy Side Liquidity) trong phiên London/NY, sau đó đảo chiều giảm sốc về vùng chiết khấu.',
    spotlightEnabled: true,
    candles: [
      { id: 'c-1', index: 0, open: 120, high: 128, low: 119, close: 127 },
      { id: 'c-2', index: 1, open: 127, high: 131, low: 124, close: 129 },
      { id: 'c-3', index: 2, open: 129, high: 131, low: 126, close: 128 }, // Equal Highs resistance
      { id: 'c-4', index: 3, open: 128, high: 142, low: 127, close: 132 }, // Sweep wick (Judas Swing)
      { id: 'c-5', index: 4, open: 132, high: 133, low: 118, close: 119 }, // Market Structure Shift (MSS)
      { id: 'c-6', index: 5, open: 119, high: 122, low: 112, close: 113 },
      { id: 'c-7', index: 6, open: 113, high: 120, low: 111, close: 119 }, // Mitigation
      { id: 'c-8', index: 7, open: 119, high: 120, low: 101, close: 102 }, // Full sell-off
    ],
    overlays: [
      {
        id: 'liq-sweep',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 1,
        endCandleIndex: 4,
        priceStart: 131,
        priceEnd: 131,
        color: '#FF3366',
        opacity: 0.9,
        label: 'BSL Liquidity Sweep ($$$)',
      },
      {
        id: 'fvg-bear',
        type: 'FVG',
        startCandleIndex: 4,
        endCandleIndex: 7,
        priceStart: 122,
        priceEnd: 131,
        color: '#FF3366',
        opacity: 0.25,
        label: 'Bearish FVG Mitigation',
      },
    ],
  },
  {
    id: 'wyckoff-accumulation-spring',
    title: 'Wyckoff Accumulation Phase C: Spring & SOS',
    strategy: 'Wyckoff',
    tier: 'Creator',
    aspectRatio: '16:9',
    duration: 6.0,
    revealMode: 'sequential',
    description: 'Mô hình tích lũy kinh điển Wyckoff: Cú rũ bỏ cuối cùng (Spring) kiểm định vùng hỗ trợ trước khi bùng nổ Sign of Strength (SOS).',
    spotlightEnabled: false,
    candles: [
      { id: 'c-1', index: 0, open: 140, high: 142, low: 122, close: 123 }, // Selling Climax (SC)
      { id: 'c-2', index: 1, open: 123, high: 136, low: 121, close: 135 }, // Automatic Rally (AR)
      { id: 'c-3', index: 2, open: 135, high: 137, low: 125, close: 128 },
      { id: 'c-4', index: 3, open: 128, high: 130, low: 122, close: 124 }, // Secondary Test (ST)
      { id: 'c-5', index: 4, open: 124, high: 126, low: 114, close: 116 }, // THE SPRING (Phase C)
      { id: 'c-6', index: 5, open: 116, high: 132, low: 115, close: 131 }, // Sharp recovery back in range
      { id: 'c-7', index: 6, open: 131, high: 145, low: 130, close: 144 }, // Sign of Strength (SOS)
      { id: 'c-8', index: 7, open: 144, high: 146, low: 139, close: 141 }, // LPS (Last Point of Support)
      { id: 'c-9', index: 8, open: 141, high: 158, low: 140, close: 157 }, // Mark Up expansion
    ],
    overlays: [
      {
        id: 'wyck-spring',
        type: 'ORDER_BLOCK',
        startCandleIndex: 4,
        endCandleIndex: 6,
        priceStart: 114,
        priceEnd: 122,
        color: '#F59E0B',
        opacity: 0.3,
        label: 'Wyckoff Spring (Phase C)',
      },
      {
        id: 'range-tr',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 0,
        endCandleIndex: 7,
        priceStart: 122,
        priceEnd: 122,
        color: '#6366F1',
        opacity: 0.7,
        label: 'Trading Range Support (TR)',
      },
    ],
  },
  {
    id: 'elliott-wave-impulse',
    title: 'Elliott Wave 1-2-3-4-5 Bullish Impulse',
    strategy: 'Elliott Wave',
    tier: 'Pro',
    aspectRatio: '16:9',
    duration: 5.5,
    revealMode: 'wick-then-body',
    description: 'Sóng đẩy 5 nhịp hoàn hảo theo lý thuyết sóng Elliott: Sóng 3 mở rộng mạnh nhất, sóng 4 hồi không vi phạm đỉnh sóng 1.',
    spotlightEnabled: false,
    candles: [
      { id: 'c-1', index: 0, open: 100, high: 112, low: 98, close: 110 }, // Wave 1 start
      { id: 'c-2', index: 1, open: 110, high: 116, low: 109, close: 115 }, // Wave 1 peak
      { id: 'c-3', index: 2, open: 115, high: 116, low: 104, close: 106 }, // Wave 2 retest
      { id: 'c-4', index: 3, open: 106, high: 128, low: 105, close: 126 }, // Wave 3 breakout
      { id: 'c-5', index: 4, open: 126, high: 145, low: 125, close: 144 }, // Wave 3 extension peak
      { id: 'c-6', index: 5, open: 144, high: 145, low: 133, close: 135 }, // Wave 4 correction
      { id: 'c-7', index: 6, open: 135, high: 154, low: 134, close: 152 }, // Wave 5 target reached
    ],
    overlays: [
      {
        id: 'w1-peak',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 1,
        endCandleIndex: 6,
        priceStart: 115,
        priceEnd: 115,
        color: '#38BDF8',
        opacity: 0.6,
        label: 'Wave 1 High (W4 Invalidation Level)',
      },
      {
        id: 'w3-rally',
        type: 'FVG',
        startCandleIndex: 3,
        endCandleIndex: 5,
        priceStart: 116,
        priceEnd: 133,
        color: '#00F5A0',
        opacity: 0.2,
        label: 'Wave 3 Extension Zone',
      },
    ],
  },
  {
    id: 'fvg-inversion-retest',
    title: 'Fair Value Gap (FVG) Retest & High R:R Entry',
    strategy: 'SMC',
    tier: 'Free',
    aspectRatio: '9:16',
    duration: 4.5,
    revealMode: 'sequential',
    description: 'Thiết lập vào lệnh mẫu mực: Chờ đợi nến hồi về lấp 50% vùng FVG (Consequent Encroachment) rồi bứt phá.',
    spotlightEnabled: true,
    candles: [
      { id: 'c-1', index: 0, open: 100, high: 105, low: 98, close: 104 },
      { id: 'c-2', index: 1, open: 104, high: 122, low: 103, close: 121 }, // Explosive candle
      { id: 'c-3', index: 2, open: 121, high: 130, low: 120, close: 128 },
      { id: 'c-4', index: 3, open: 128, high: 129, low: 113, close: 114 }, // Retest 50% of gap
      { id: 'c-5', index: 4, open: 114, high: 138, low: 113, close: 137 }, // Take profit target
    ],
    overlays: [
      {
        id: 'fvg-box',
        type: 'FVG',
        startCandleIndex: 1,
        endCandleIndex: 4,
        priceStart: 105,
        priceEnd: 120,
        color: '#00F5A0',
        opacity: 0.25,
        label: 'FVG Consequent Encroachment (50%)',
      },
    ],
  },
];
