import { Candle, Overlay, ExecutionOrder, ScriptSubtitle } from '../types/chart';

export interface RawKline {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
}

export interface RealMarketCaseStudy {
  symbol: string;
  currentPrice: number;
  timeframe: string;
  headlineText: string;
  sublineText: string;
  badges: [string, string, string];
  calloutPinText: string;
  calloutCandleIndex: number;
  showPipCounter: boolean;
  targetPips: number;
  showExecutionBadge: boolean;
  executionOrder: ExecutionOrder;
  scriptSubtitles: ScriptSubtitle[];
  candles: Candle[];
  overlays: Overlay[];
}

/**
 * Convert raw array klines [time, open, high, low, close, vol, ...] into Candle[]
 */
export function formatKlinesToCandles(rawKlines: any[]): Candle[] {
  return rawKlines.map((k, index) => {
    // Standard Binance kline format
    const open = typeof k[1] === 'string' ? parseFloat(k[1]) : k.open;
    const high = typeof k[2] === 'string' ? parseFloat(k[2]) : k.high;
    const low = typeof k[3] === 'string' ? parseFloat(k[3]) : k.low;
    const close = typeof k[4] === 'string' ? parseFloat(k[4]) : k.close;

    return {
      id: `c-real-${index + 1}`,
      index,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
    };
  });
}

/**
 * Analyze real candlesticks and generate an Educational Case Study setup
 */
export function buildRealMarketCaseStudy(candles: Candle[], symbol: string = 'XAUUSD'): RealMarketCaseStudy {
  if (!candles || candles.length < 3) {
    throw new Error('Cần tối thiểu 3 cây nến để xây dựng Case Study thực chiến.');
  }

  const currentPrice = candles[candles.length - 1].close;
  const startPrice = candles[0].open;
  const netDrift = currentPrice - startPrice;

  // Find Session High and Low
  let highestHigh = -Infinity;
  let highestIndex = 0;
  let lowestLow = Infinity;
  let lowestIndex = 0;

  candles.forEach((c, i) => {
    if (c.high > highestHigh) {
      highestHigh = c.high;
      highestIndex = i;
    }
    if (c.low < lowestLow) {
      lowestLow = c.low;
      lowestIndex = i;
    }
  });

  // Decide whether today's primary educational case is a Bullish Bounce (from low) or Bearish Drop (from high)
  const isSelloff = netDrift <= 0 || highestIndex < candles.length - 1;

  let executionOrder: ExecutionOrder;
  let calloutPinText: string;
  let calloutCandleIndex: number;
  let headlineText: string;
  let sublineText: string;
  let overlays: Overlay[] = [];
  let scriptSubtitles: ScriptSubtitle[] = [];
  let targetPips: number;

  if (isSelloff) {
    // Case Study: Bearish Liquidity Sweep / Selloff
    calloutCandleIndex = highestIndex;
    calloutPinText = `🎯 ĐỈNH PHIÊN $${highestHigh.toFixed(1)} (QUÉT THANH KHOẢN)`;
    headlineText = `BÀI HỌC VÀNG THỰC CHIẾN HÔM NAY: BẪY ĐỈNH $${highestHigh.toFixed(0)}`;
    sublineText = `Thực tế thị trường vừa diễn ra: Quét đỉnh rồi sập gãy cấu trúc MSS`;
    
    const entry = Number((highestHigh - 3.0).toFixed(2));
    const sl = Number((highestHigh + 2.0).toFixed(2)); // SL 20 pips above highest wick
    const slDist = sl - entry;
    const tpDist = slDist * 3.5;
    const tp = Number((entry - tpDist).toFixed(2));
    targetPips = Math.round(tpDist * 10);

    executionOrder = {
      type: 'SELL',
      entry,
      sl,
      tp,
      lot: 0.05,
      risk: 30,
    };

    overlays = [
      {
        id: 'real-session-high',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 0,
        endCandleIndex: Math.min(highestIndex + 2, candles.length - 1),
        priceStart: highestHigh,
        priceEnd: highestHigh,
        color: '#F59E0B',
        opacity: 0.9,
        label: `Đỉnh Phiên Thực Tế ($${highestHigh.toFixed(2)})`,
      },
      {
        id: 'real-rr-setup',
        type: 'LONG_SHORT',
        startCandleIndex: highestIndex,
        endCandleIndex: candles.length - 1,
        priceStart: entry,
        priceEnd: tp,
        color: '#FF3366',
        opacity: 0.25,
        label: `SELL Case Study +${targetPips} Pips (1:3.5 RR)`,
      },
    ];

    scriptSubtitles = [
      { timePercent: 0.0, text: `Nhìn vào diễn biến nến thật hôm nay: Khi giá đẩy lên $${highestHigh.toFixed(1)}...`, stageName: 'Hook' },
      { timePercent: 0.28, text: `Rất nhiều trader vội vàng bấm BUY đuổi theo cây nến xanh lớn!`, stageName: 'Trap' },
      { timePercent: 0.58, text: `Nhưng đây là cú quét đỉnh thanh khoản của Big Boys trước khi đảo chiều.`, stageName: 'Setup' },
      { timePercent: 0.82, text: `Nếu bạn không khóa trước SL 20 pips ($30 Risk), tài khoản sẽ phải trả giá đắt.`, stageName: 'Execution' },
    ];
  } else {
    // Case Study: Bullish Liquidity Sweep / Bounce
    calloutCandleIndex = lowestIndex;
    calloutPinText = `🎯 ĐÁY PHIÊN $${lowestLow.toFixed(1)} (RÚT CHÂN HỖ TRỢ)`;
    headlineText = `BÀI HỌC VÀNG THỰC CHIẾN HÔM NAY: RŨ BỎ ĐÁY $${lowestLow.toFixed(0)}`;
    sublineText = `Thực tế thị trường vừa diễn ra: Quét sạch phe bán rồi bật tăng mạnh`;

    const entry = Number((lowestLow + 3.0).toFixed(2));
    const sl = Number((lowestLow - 2.0).toFixed(2)); // SL 20 pips below lowest wick
    const slDist = entry - sl;
    const tpDist = slDist * 3.5;
    const tp = Number((entry + tpDist).toFixed(2));
    targetPips = Math.round(tpDist * 10);

    executionOrder = {
      type: 'BUY',
      entry,
      sl,
      tp,
      lot: 0.05,
      risk: 30,
    };

    overlays = [
      {
        id: 'real-session-low',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 0,
        endCandleIndex: Math.min(lowestIndex + 2, candles.length - 1),
        priceStart: lowestLow,
        priceEnd: lowestLow,
        color: '#38BDF8',
        opacity: 0.9,
        label: `Đáy Phiên Thực Tế ($${lowestLow.toFixed(2)})`,
      },
      {
        id: 'real-rr-setup',
        type: 'LONG_SHORT',
        startCandleIndex: lowestIndex,
        endCandleIndex: candles.length - 1,
        priceStart: entry,
        priceEnd: tp,
        color: '#00F5A0',
        opacity: 0.25,
        label: `BUY Case Study +${targetPips} Pips (1:3.5 RR)`,
      },
    ];

    scriptSubtitles = [
      { timePercent: 0.0, text: `Nhìn vào diễn biến nến thật hôm nay: Khi giá đâm thủng đáy $${lowestLow.toFixed(1)}...`, stageName: 'Hook' },
      { timePercent: 0.28, text: `Đám đông hoảng loạn bán tháo cắt lỗ, nhưng Big Boys bắt đầu gom hàng!`, stageName: 'Trap' },
      { timePercent: 0.58, text: `Nến rút râu tạo mô hình kiểm định hỗ trợ then chốt.`, stageName: 'Setup' },
      { timePercent: 0.82, text: `Áp dụng công thức Risk $30, SL 20 pips để gồng lãi 1:3.5 RR về đỉnh cũ.`, stageName: 'Execution' },
    ];
  }

  return {
    symbol,
    currentPrice,
    timeframe: 'M15',
    headlineText,
    sublineText,
    badges: ['1. LOSS $30', '2. SL 20 PIPS', '3. LOT 0.05'],
    calloutPinText,
    calloutCandleIndex,
    showPipCounter: true,
    targetPips,
    showExecutionBadge: true,
    executionOrder,
    scriptSubtitles,
    candles,
    overlays,
  };
}

