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
    description: 'Thiết lập chuẩn Smart Money: Phá vỡ cấu trúc (BOS), để lại khoảng trống giá FVG và retest đúng 50% Consequent Encroachment.',
    spotlightEnabled: true,
    candles: [
      { id: 'c-1', index: 0, open: 110, high: 113, low: 108, close: 109 },
      { id: 'c-2', index: 1, open: 109, high: 111, low: 104, close: 105 },
      { id: 'c-3', index: 2, open: 105, high: 107, low: 98, close: 100 }, // Bullish OB base
      { id: 'c-4', index: 3, open: 100, high: 118, low: 99, close: 117 }, // Displacement
      { id: 'c-5', index: 4, open: 117, high: 132, low: 116, close: 130 }, // BOS of high 113
      { id: 'c-6', index: 5, open: 130, high: 134, low: 124, close: 125 },
      { id: 'c-7', index: 6, open: 125, high: 126, low: 111, close: 113 }, // Retest into FVG (50% CE is 111.5)
      { id: 'c-8', index: 7, open: 113, high: 138, low: 112, close: 136 }, // Rally
      { id: 'c-9', index: 8, open: 136, high: 148, low: 135, close: 147 }, // Take profit
    ],
    overlays: [
      {
        id: 'bos-line',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 0,
        endCandleIndex: 5,
        priceStart: 113,
        priceEnd: 113,
        color: '#F59E0B',
        opacity: 0.8,
        label: 'BOS (Break of Structure) - 113.00',
      },
      {
        id: 'fvg-bull',
        type: 'FVG',
        startCandleIndex: 3,
        endCandleIndex: 7,
        priceStart: 107,
        priceEnd: 116,
        color: '#00F5A0',
        opacity: 0.22,
        label: 'Bullish FVG [107.00 - 116.00]',
      },
      {
        id: 'rr-position',
        type: 'LONG_SHORT',
        startCandleIndex: 6,
        endCandleIndex: 8,
        priceStart: 113, // Entry
        priceEnd: 147, // Target TP
        color: '#00F5A0',
        opacity: 0.2,
        label: 'Long Position 1:3.4 RR',
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
    description: 'Quét sạch thanh khoản đỉnh (BSL - Buy Side Liquidity) bằng bấc nến Judas Swing, sau đó xuất hiện Market Structure Shift (MSS) phá vỡ đáy.',
    spotlightEnabled: true,
    candles: [
      { id: 'c-1', index: 0, open: 120, high: 128, low: 119, close: 127 },
      { id: 'c-2', index: 1, open: 127, high: 131, low: 124, close: 129 }, // Equal Highs
      { id: 'c-3', index: 2, open: 129, high: 131, low: 126, close: 128 }, // Equal Highs resistance at 131
      { id: 'c-4', index: 3, open: 128, high: 142, low: 127, close: 130 }, // Judas Swing sweep wick
      { id: 'c-5', index: 4, open: 130, high: 131, low: 116, close: 117 }, // MSS break of swing low 124
      { id: 'c-6', index: 5, open: 117, high: 121, low: 110, close: 112 },
      { id: 'c-7', index: 6, open: 112, high: 125, low: 111, close: 118 }, // Retest into Bearish FVG [121 - 127]
      { id: 'c-8', index: 7, open: 118, high: 119, low: 101, close: 102 }, // Full sell-off expansion
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
        label: 'BSL Liquidity Pool (Equal Highs) - 131.00',
      },
      {
        id: 'mss-line',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 2,
        endCandleIndex: 5,
        priceStart: 124,
        priceEnd: 124,
        color: '#38BDF8',
        opacity: 0.8,
        label: 'MSS (Market Structure Shift) - 124.00',
      },
      {
        id: 'fvg-bear',
        type: 'FVG',
        startCandleIndex: 4,
        endCandleIndex: 7,
        priceStart: 121,
        priceEnd: 127,
        color: '#FF3366',
        opacity: 0.25,
        label: 'Bearish FVG [121.00 - 127.00]',
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
    description: 'Mô hình tích lũy kinh điển Richard Wyckoff: Cú rũ bỏ cuối cùng (Spring Phase C) quét đáy hỗ trợ TR trước khi bùng nổ Sign of Strength (SOS).',
    spotlightEnabled: false,
    candles: [
      { id: 'c-1', index: 0, open: 140, high: 142, low: 122, close: 123 }, // Selling Climax (SC)
      { id: 'c-2', index: 1, open: 123, high: 136, low: 121, close: 135 }, // Automatic Rally (AR)
      { id: 'c-3', index: 2, open: 135, high: 137, low: 125, close: 128 },
      { id: 'c-4', index: 3, open: 128, high: 130, low: 122, close: 124 }, // Secondary Test (ST)
      { id: 'c-5', index: 4, open: 124, high: 126, low: 114, close: 118 }, // THE SPRING (Phase C)
      { id: 'c-6', index: 5, open: 118, high: 132, low: 117, close: 131 }, // Recovery into Trading Range
      { id: 'c-7', index: 6, open: 131, high: 146, low: 130, close: 145 }, // Sign of Strength (SOS)
      { id: 'c-8', index: 7, open: 145, high: 146, low: 137, close: 140 }, // Last Point of Support (LPS)
      { id: 'c-9', index: 8, open: 140, high: 158, low: 139, close: 157 }, // Mark Up expansion
    ],
    overlays: [
      {
        id: 'range-res',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 1,
        endCandleIndex: 7,
        priceStart: 136,
        priceEnd: 136,
        color: '#FF3366',
        opacity: 0.7,
        label: 'TR Resistance (AR) - 136.00',
      },
      {
        id: 'range-sup',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 0,
        endCandleIndex: 6,
        priceStart: 122,
        priceEnd: 122,
        color: '#6366F1',
        opacity: 0.7,
        label: 'TR Support (SC / ST) - 122.00',
      },
      {
        id: 'wyck-spring',
        type: 'ORDER_BLOCK',
        startCandleIndex: 4,
        endCandleIndex: 6,
        priceStart: 114,
        priceEnd: 122,
        color: '#F59E0B',
        opacity: 0.28,
        label: 'Phase C: The Spring (Trap Zone)',
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
    description: 'Sóng đẩy 5 nhịp tuân thủ nghiêm ngặt 3 định luật Elliott: Sóng 3 mở rộng mạnh nhất (40 điểm), sóng 4 không vi phạm đỉnh sóng 1 (116).',
    spotlightEnabled: false,
    candles: [
      { id: 'c-1', index: 0, open: 100, high: 112, low: 98, close: 110 }, // Wave 1 start
      { id: 'c-2', index: 1, open: 110, high: 116, low: 109, close: 115 }, // Wave 1 peak (116)
      { id: 'c-3', index: 2, open: 115, high: 116, low: 106, close: 108 }, // Wave 2 retracement (62.5% Fib)
      { id: 'c-4', index: 3, open: 108, high: 130, low: 107, close: 128 }, // Wave 3 breakout
      { id: 'c-5', index: 4, open: 128, high: 146, low: 127, close: 145 }, // Wave 3 extension peak (146)
      { id: 'c-6', index: 5, open: 145, high: 146, low: 132, close: 134 }, // Wave 4 correction (132 > 116)
      { id: 'c-7', index: 6, open: 134, high: 155, low: 133, close: 154 }, // Wave 5 target reached (155)
    ],
    overlays: [
      {
        id: 'w1-peak',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 1,
        endCandleIndex: 6,
        priceStart: 116,
        priceEnd: 116,
        color: '#38BDF8',
        opacity: 0.7,
        label: 'Wave 1 High (116.00) - Invalidation Boundary',
      },
      {
        id: 'w3-ext',
        type: 'ORDER_BLOCK',
        startCandleIndex: 3,
        endCandleIndex: 5,
        priceStart: 116,
        priceEnd: 146,
        color: '#00F5A0',
        opacity: 0.15,
        label: 'Wave (3) Extension [161.8% Projection]',
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
    description: 'Thiết lập vào lệnh mẫu mực: Chờ đợi nến hồi về lấp đúng 50% Consequent Encroachment của FVG (112.50) rồi bứt phá.',
    spotlightEnabled: true,
    candles: [
      { id: 'c-1', index: 0, open: 100, high: 105, low: 98, close: 104 }, // C1: High 105
      { id: 'c-2', index: 1, open: 104, high: 122, low: 103, close: 121 }, // C2: Displacement
      { id: 'c-3', index: 2, open: 121, high: 130, low: 120, close: 128 }, // C3: Low 120 -> FVG [105 - 120]
      { id: 'c-4', index: 3, open: 128, high: 129, low: 112, close: 114 }, // C4: Retest touches 112 (50% CE is 112.5)
      { id: 'c-5', index: 4, open: 114, high: 138, low: 113, close: 137 }, // C5: Take profit target
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
        label: 'Bullish FVG [105.00 - 120.00]',
      },
      {
        id: 'long-entry',
        type: 'LONG_SHORT',
        startCandleIndex: 3,
        endCandleIndex: 4,
        priceStart: 114,
        priceEnd: 137,
        color: '#00F5A0',
        opacity: 0.22,
        label: 'Long Entry at 50% C.E.',
      },
    ],
  },
];
