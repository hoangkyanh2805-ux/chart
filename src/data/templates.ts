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
    id: 'xauusd-london-asia-sweep',
    title: 'XAUUSD: London Asia Low Sweep & NY Expansion',
    strategy: 'ICT',
    tier: 'Pro',
    aspectRatio: '9:16',
    duration: 5.5,
    revealMode: 'sequential',
    description: 'Chiến thuật Vàng thực chiến 2026: Phiên Á đi ngang (4122 - 4130), London quét bấc thủng đáy Á xuống 4114 (chạm H1 OB) rồi New York bùng nổ lên 4148.50.',
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
];
