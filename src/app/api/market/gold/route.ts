import { NextRequest, NextResponse } from 'next/server';
import { formatKlinesToCandles, buildRealMarketCaseStudy } from '@/utils/realMarketFeed';

export async function GET(req: NextRequest) {
  try {
    const klinesUrl = 'https://api.binance.com/api/v3/klines?symbol=PAXGUSDT&interval=15m&limit=10';
    
    let rawKlines: any[] = [];
    let dataSource = 'LIVE_BINANCE_PAXGUSDT';

    try {
      const res = await fetch(klinesUrl, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(5000), // 5s timeout
        cache: 'no-store',
      });

      if (res.ok) {
        rawKlines = await res.json();
      }
    } catch (netErr: any) {
      console.warn('Live gold market fetch fallback:', netErr.message);
    }

    // High quality offline fallback snapshot if network is restricted
    if (!rawKlines || rawKlines.length < 3) {
      dataSource = 'LOCAL_GOLD_SNAPSHOT';
      rawKlines = [
        [1730120400000, '4055.20', '4058.50', '4054.10', '4057.80', '124.5', 1730121299999],
        [1730121300000, '4057.80', '4062.00', '4056.50', '4061.20', '210.8', 1730122199999],
        [1730122200000, '4061.20', '4064.50', '4059.00', '4060.10', '350.2', 1730123099999], // High wick
        [1730123100000, '4060.10', '4060.50', '4052.00', '4053.40', '420.1', 1730123999999], // Displacement
        [1730124000000, '4053.40', '4057.00', '4051.80', '4055.50', '180.4', 1730124899999], // Retest
        [1730124900000, '4055.50', '4056.00', '4046.00', '4047.20', '290.7', 1730125799999], // Drop
        [1730125800000, '4047.20', '4048.00', '4038.50', '4040.00', '315.6', 1730126699999], // Target
      ];
    }

    const candles = formatKlinesToCandles(rawKlines);
    const caseStudy = buildRealMarketCaseStudy(candles, 'XAUUSD');

    return NextResponse.json({
      success: true,
      dataSource,
      symbol: 'XAUUSD (Spot Gold)',
      timeframe: 'M15',
      updatedAt: new Date().toISOString(),
      caseStudy,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi lấy dữ liệu thị trường Vàng' },
      { status: 500 }
    );
  }
}

