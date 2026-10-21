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
    description: 'Chiến thuật Vàng kinh điển: Phiên Á đi ngang (2642 - 2650), London quét thủng đáy Á xuống 2634 (chạm H1 Order Block) rồi New York bùng nổ lên 2678.',
    spotlightEnabled: true,
    candles: [
      { id: 'c-1', index: 0, open: 2646.0, high: 2650.0, low: 2644.0, close: 2648.5 }, // Asia High
      { id: 'c-2', index: 1, open: 2648.5, high: 2649.0, low: 2642.0, close: 2643.0 }, // Asia Low
      { id: 'c-3', index: 2, open: 2643.0, high: 2645.0, low: 2634.0, close: 2636.5 }, // London Sweep wick into H1 OB
      { id: 'c-4', index: 3, open: 2636.5, high: 2656.0, low: 2635.0, close: 2655.0 }, // NY Open Displacement
      { id: 'c-5', index: 4, open: 2655.0, high: 2668.0, low: 2653.0, close: 2666.0 }, // BOS of Asia High 2650
      { id: 'c-6', index: 5, open: 2666.0, high: 2667.0, low: 2658.0, close: 2659.0 },
      { id: 'c-7', index: 6, open: 2659.0, high: 2660.0, low: 2649.5, close: 2652.0 }, // Retest into Bullish FVG [2645 - 2653]
      { id: 'c-8', index: 7, open: 2652.0, high: 2672.0, low: 2651.0, close: 2670.0 }, // Expansion rally
      { id: 'c-9', index: 8, open: 2670.0, high: 2682.0, low: 2669.0, close: 2678.5 }, // Target TP
    ],
    overlays: [
      {
        id: 'asia-high',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 0,
        endCandleIndex: 5,
        priceStart: 2650.0,
        priceEnd: 2650.0,
        color: '#F59E0B',
        opacity: 0.85,
        label: 'Asia High Liquidity (2650.00)',
      },
      {
        id: 'asia-low-sweep',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 1,
        endCandleIndex: 3,
        priceStart: 2642.0,
        priceEnd: 2642.0,
        color: '#FF3366',
        opacity: 0.85,
        label: 'Asia Low Sweep ($$$) - 2642.00',
      },
      {
        id: 'h1-ob',
        type: 'ORDER_BLOCK',
        startCandleIndex: 2,
        endCandleIndex: 4,
        priceStart: 2634.0,
        priceEnd: 2638.0,
        color: '#6366F1',
        opacity: 0.25,
        label: 'H1 Bullish Order Block [2634 - 2638]',
      },
      {
        id: 'bull-fvg',
        type: 'FVG',
        startCandleIndex: 3,
        endCandleIndex: 7,
        priceStart: 2645.0,
        priceEnd: 2653.0,
        color: '#00F5A0',
        opacity: 0.22,
        label: 'NY Bullish FVG [2645.00 - 2653.00]',
      },
      {
        id: 'rr-long',
        type: 'LONG_SHORT',
        startCandleIndex: 6,
        endCandleIndex: 8,
        priceStart: 2652.0, // Entry
        priceEnd: 2678.5, // TP (+265 pips)
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
    description: 'Tin CPI Mỹ ra lúc 8:30 AM: Cú quét bấc giật 120 pips lên 2694 rồi đổ sập phá vỡ cấu trúc về 2645 (Bearish Displacement).',
    spotlightEnabled: true,
    candles: [
      { id: 'c-1', index: 0, open: 2678.0, high: 2684.0, low: 2676.0, close: 2682.0 }, // Pre-news
      { id: 'c-2', index: 1, open: 2682.0, high: 2685.0, low: 2680.0, close: 2683.5 }, // Equal Highs resistance
      { id: 'c-3', index: 2, open: 2683.5, high: 2695.0, low: 2678.0, close: 2680.0 }, // CPI News Wick (Judas Swing)
      { id: 'c-4', index: 3, open: 2680.0, high: 2681.0, low: 2652.0, close: 2654.0 }, // Massive red dump candle
      { id: 'c-5', index: 4, open: 2654.0, high: 2660.0, low: 2644.0, close: 2646.0 }, // Sell-off
      { id: 'c-6', index: 5, open: 2646.0, high: 2670.0, low: 2645.0, close: 2668.0 }, // Pullback into Bearish FVG [2660 - 2678]
      { id: 'c-7', index: 6, open: 2668.0, high: 2669.0, low: 2638.0, close: 2640.0 }, // Full dump continuation
    ],
    overlays: [
      {
        id: 'news-sweep',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 1,
        endCandleIndex: 3,
        priceStart: 2685.0,
        priceEnd: 2685.0,
        color: '#FF3366',
        opacity: 0.9,
        label: 'CPI Liquidity Sweep Wick (2695.00)',
      },
      {
        id: 'bear-fvg',
        type: 'FVG',
        startCandleIndex: 3,
        endCandleIndex: 6,
        priceStart: 2660.0,
        priceEnd: 2678.0,
        color: '#FF3366',
        opacity: 0.25,
        label: 'Bearish FVG [2660.00 - 2678.00]',
      },
      {
        id: 'mss-gold',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 0,
        endCandleIndex: 4,
        priceStart: 2676.0,
        priceEnd: 2676.0,
        color: '#38BDF8',
        opacity: 0.8,
        label: 'MSS (Market Structure Shift) - 2676.00',
      },
    ],
  },
  {
    id: 'xauusd-2700-round-level',
    title: 'XAUUSD: $2700 Psychological Round Level Liquidity Grab',
    strategy: 'ICT',
    tier: 'Creator',
    aspectRatio: '16:9',
    duration: 6.0,
    revealMode: 'sequential',
    description: 'Vùng số tròn tâm lý 2700.00: Đám đông đặt buy-stop breakout bị bẫy thanh khoản (Institutional Trap), giá đảo chiều 350 pips.',
    spotlightEnabled: true,
    candles: [
      { id: 'c-1', index: 0, open: 2685.0, high: 2692.0, low: 2684.0, close: 2691.0 },
      { id: 'c-2', index: 1, open: 2691.0, high: 2698.0, low: 2689.0, close: 2697.5 }, // Approaching 2700
      { id: 'c-3', index: 2, open: 2697.5, high: 2705.5, low: 2696.0, close: 2698.0 }, // Trap wick tapping 2705.50
      { id: 'c-4', index: 3, open: 2698.0, high: 2699.0, low: 2680.0, close: 2682.0 }, // Sharp decline
      { id: 'c-5', index: 4, open: 2682.0, high: 2684.0, low: 2671.0, close: 2672.5 }, // Breakdown
      { id: 'c-6', index: 5, open: 2672.5, high: 2688.0, low: 2671.0, close: 2686.0 }, // Retest 2688 mitigation
      { id: 'c-7', index: 6, open: 2686.0, high: 2687.0, low: 2660.0, close: 2662.0 }, // Target $2662
    ],
    overlays: [
      {
        id: 'round-number',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 0,
        endCandleIndex: 4,
        priceStart: 2700.0,
        priceEnd: 2700.0,
        color: '#EAB308',
        opacity: 0.95,
        label: 'Key Level: $2,700.00 Major Psychological Barrier',
      },
      {
        id: 'ob-bear',
        type: 'ORDER_BLOCK',
        startCandleIndex: 2,
        endCandleIndex: 6,
        priceStart: 2696.0,
        priceEnd: 2704.0,
        color: '#FF3366',
        opacity: 0.28,
        label: 'Institutional Supply Block (2696 - 2704)',
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
    description: 'Thiết lập Scalp Vàng M15 chuẩn: Rủi ro 20 pips, lợi nhuận 80 pips (R:R 1:4.0). Canh mua tại 50% Consequent Encroachment.',
    spotlightEnabled: true,
    candles: [
      { id: 'c-1', index: 0, open: 2648.0, high: 2652.0, low: 2646.0, close: 2651.0 },
      { id: 'c-2', index: 1, open: 2651.0, high: 2666.0, low: 2650.0, close: 2665.0 }, // Strong M15 expansion candle
      { id: 'c-3', index: 2, open: 2665.0, high: 2674.0, low: 2663.0, close: 2672.0 },
      { id: 'c-4', index: 3, open: 2672.0, high: 2673.0, low: 2657.5, close: 2659.0 }, // Pullback into FVG (50% CE is 2657.5)
      { id: 'c-5', index: 4, open: 2659.0, high: 2682.0, low: 2658.0, close: 2680.0 }, // Profit target hit
    ],
    overlays: [
      {
        id: 'scalp-fvg',
        type: 'FVG',
        startCandleIndex: 1,
        endCandleIndex: 4,
        priceStart: 2652.0,
        priceEnd: 2663.0,
        color: '#00F5A0',
        opacity: 0.25,
        label: 'XAUUSD M15 FVG [2652.00 - 2663.00]',
      },
      {
        id: 'scalp-rr',
        type: 'LONG_SHORT',
        startCandleIndex: 3,
        endCandleIndex: 4,
        priceStart: 2659.0, // Entry
        priceEnd: 2680.0, // TP (+210 pips)
        color: '#00F5A0',
        opacity: 0.22,
        label: 'Scalp Entry at 50% CE (1:4.2 RR)',
      },
    ],
  },
];
