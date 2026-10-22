import { NextRequest, NextResponse } from 'next/server';

interface CandleData {
  id: string;
  index: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface OverlayData {
  id: string;
  type: 'FVG' | 'LIQUIDITY_LINE' | 'LONG_SHORT' | 'ORDER_BLOCK';
  startCandleIndex: number;
  endCandleIndex: number;
  priceStart: number;
  priceEnd: number;
  color?: string;
  label?: string;
}

interface SeniorTraderAnalysisResponse {
  headline: string;
  subline: string;
  strategy: string;
  seniorTraderRationale: string;
  symbol: string;
  basePrice: number;
  candles: CandleData[];
  overlays: OverlayData[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { briefText, customApiKey } = body;

    if (!briefText || typeof briefText !== 'string') {
      return NextResponse.json({ error: 'Nội dung briefText không hợp lệ' }, { status: 400 });
    }

    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    // Prompt chuyên gia Senior Trader
    const systemPrompt = `You are an Elite Senior Hedge Fund Trader & Financial Video Director specializing in XAUUSD Gold, SMC (Smart Money Concepts), ICT, Price Action, and high-retention short-form video creation.
Analyze the user's trading brief/script and generate a professional, mathematically accurate, and visually compelling candlestick setup for a 9:16 / 16:9 trading video.

STRICT RULES:
1. "headline": Punchy hook title, strictly 3 to 6 words. 0% AI-smell, high tension (e.g. "THE STOP LOSS CAME FIRST", "YOU STOP WATCHING THE SWEEP", "THE 50% C.E. SECRET").
2. "subline": Explanatory subtitle, strictly 7 to 11 words (e.g. "The entry came second. That order is the whole video.").
3. "strategy": One of ["Risk-First Support Bounce", "Liquidity Sweep & Rejection", "Fair Value Gap (FVG) Retest", "Break & Retest (BOS)", "Bearish Supply Zone"].
4. "seniorTraderRationale": A concise 1-2 sentence breakdown in Vietnamese explaining the institutional trading logic behind this setup.
5. "symbol": Trading asset, default "XAUUSD".
6. "basePrice": Key technical price level around current Gold market (~4128.00).
7. "candles": Exactly 6 sequential candlesticks simulating this specific strategy. MUST be strictly valid OHLC: low <= min(open, close) and high >= max(open, close). Open of candle[i] must equal close of candle[i-1].
8. "overlays": 1-2 technical overlays matching the strategy:
   - For Support: LIQUIDITY_LINE at support price.
   - For FVG: FVG overlay with priceStart and priceEnd.
   - For Risk: LONG_SHORT overlay with entry, TP (1:3+ RR), and SL (20-30 pips).

OUTPUT FORMAT: Return raw JSON matching this schema:
{
  "headline": string,
  "subline": string,
  "strategy": string,
  "seniorTraderRationale": string,
  "symbol": string,
  "basePrice": number,
  "candles": [
    { "id": "c-1", "index": 0, "open": number, "high": number, "low": number, "close": number }
  ],
  "overlays": [
    {
      "id": "overlay-1",
      "type": "LIQUIDITY_LINE" | "FVG" | "LONG_SHORT" | "ORDER_BLOCK",
      "startCandleIndex": number,
      "endCandleIndex": number,
      "priceStart": number,
      "priceEnd": number,
      "color": string,
      "label": string
    }
  ]
}`;

    if (apiKey) {
      try {
        // Call Google Gemini API (gemini-flash-lite-latest / gemini-2.5-flash-lite)
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey}`;

        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(12000),
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: systemPrompt },
                  { text: `BRIEF CỦA EDITOR:\n\n${briefText.substring(0, 4000)}` },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json',
            },
          }),
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText) as SeniorTraderAnalysisResponse;
            return NextResponse.json({ ...parsed, provider: 'Google Gemini 2.5 Flash' });
          }
        } else {
          const errText = await geminiRes.text();
          console.warn('Gemini API returned error status:', geminiRes.status, errText);
        }
      } catch (err: any) {
        console.warn('Gemini API call failed, falling back to local Senior Trader engine:', err.message);
      }
    }

    // Built-in Senior Trader Heuristic Engine (Fallback when API key is pending)
    const localAnalysis = generateLocalSeniorTraderAnalysis(briefText);
    return NextResponse.json({ ...localAnalysis, provider: 'Senior Trader Native Engine' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi xử lý brief' }, { status: 500 });
  }
}

// Senior Trader Knowledge Heuristic
function generateLocalSeniorTraderAnalysis(text: string): SeniorTraderAnalysisResponse {
  const isSweep = /sweep|liquidity|bsl|ssl|purge|stop watching|fakeout|trap/i.test(text);
  const isFVG = /fvg|imbalance|fair value gap|consequent encroachment|50%/i.test(text);
  const isBreakRetest = /break (?:and|&) retest|retest|bos|break of structure/i.test(text);
  const isSupply = /bearish|short|dump|sell|supply|distribution/i.test(text);

  let strategy = 'Risk-First Support Bounce';
  let headline = 'THE STOP LOSS CAME FIRST';
  let subline = 'The entry came second. That order is the whole video.';
  let seniorTraderRationale =
    'Kịch bản tập trung vào tư duy Risk-First của quỹ: Ấn định ngân sách rủi ro $30 trước khi nhìn chart, bắt nhịp rút râu tại hỗ trợ $4,128.00 đạt chuẩn 1:3.5 RR.';
  let basePrice = 4128.0;

  if (isSweep) {
    strategy = 'Liquidity Sweep & Rejection';
    headline = 'YOU STOP WATCHING THE SWEEP';
    subline = 'You start watching what happens after it.';
    seniorTraderRationale =
      'Bẫy thanh khoản kinh điển của Smart Money: Nến xanh đẩy giá tạo cảm giác breakout, nến sau vọt râu quét sạch Stop Loss bên BSL rồi lập tức xả hàng đảo chiều.';
    basePrice = 4140.0;
  } else if (isFVG) {
    strategy = 'Fair Value Gap (FVG) Retest';
    headline = 'THE 50% C.E. SECRET ENTRY';
    subline = 'Fair Value Gaps are institutional price magnets.';
    seniorTraderRationale =
      'Khai thác vùng mất cân bằng thanh khoản (FVG): Cú displacement tạo khoảng trống giữa nến 1 và 3, giá hồi về đúng 50% Consequent Encroachment rồi tiếp diễn xu hướng.';
    basePrice = 4125.0;
  } else if (isBreakRetest) {
    strategy = 'Break & Retest (BOS)';
    headline = 'CLEAN BREAK & RETEST ONLY';
    subline = 'Patience pays 1:3.5 Risk-to-Reward.';
    seniorTraderRationale =
      'Chiến thuật Phá vỡ Cấu trúc (BOS): Nến Marubozu bứt phá kháng cự, nến sau kiểm tra lại vùng cản cũ (chuyển thành hỗ trợ) trước khi tiếp tục chuỗi sóng tăng.';
    basePrice = 4132.0;
  } else if (isSupply) {
    strategy = 'Bearish Supply Zone';
    headline = 'SUPPLY ZONE REJECTION';
    subline = 'When retail buys the top, institutions distribute.';
    seniorTraderRationale =
      'Phát hiện vùng phân phối của tay to: Giá hồi phục yếu ớt vào khối Supply Zone (Order Block giảm), xuất hiện nến từ chối râu trên và bị xả hàng mạnh mẽ.';
    basePrice = 4145.0;
  }

  // Hook Short override
  const hookMatch = text.match(/Hook(?:\s*Short)?(?:\s*\([^)]*\))?:\s*["“]?([^"”\r\n]+)["”]?/i);
  if (hookMatch && hookMatch[1]) {
    const parts = hookMatch[1].split(/[.?!]/).map((s) => s.trim()).filter(Boolean);
    if (parts[0]) headline = parts[0];
    if (parts[1]) subline = parts[1] + '.';
  }

  // Cap words
  const headWords = headline.split(/\s+/).filter(Boolean);
  if (headWords.length > 7) headline = headWords.slice(0, 6).join(' ');
  const subWords = subline.split(/\s+/).filter(Boolean);
  if (subWords.length > 12) subline = subWords.slice(0, 10).join(' ') + '...';

  // Generate dynamic candles
  let candles: CandleData[] = [];
  let overlays: OverlayData[] = [];

  if (strategy === 'Liquidity Sweep & Rejection') {
    candles = [
      { id: 'c-1', index: 0, open: basePrice, high: basePrice + 6.0, low: basePrice - 1.0, close: basePrice + 5.0 },
      { id: 'c-2', index: 1, open: basePrice + 5.0, high: basePrice + 14.0, low: basePrice + 4.0, close: basePrice + 13.0 },
      { id: 'c-3', index: 2, open: basePrice + 13.0, high: basePrice + 14.5, low: basePrice + 9.0, close: basePrice + 10.0 },
      { id: 'c-4', index: 3, open: basePrice + 10.0, high: basePrice + 21.0, low: basePrice + 6.0, close: basePrice + 7.0 },
      { id: 'c-5', index: 4, open: basePrice + 7.0, high: basePrice + 7.5, low: basePrice - 4.0, close: basePrice - 3.0 },
      { id: 'c-6', index: 5, open: basePrice - 3.0, high: basePrice - 2.5, low: basePrice - 12.0, close: basePrice - 10.0 },
    ];
    overlays = [
      {
        id: 'bsl-sweep',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 1,
        endCandleIndex: 3,
        priceStart: basePrice + 14.0,
        priceEnd: basePrice + 14.0,
        color: '#F59E0B',
        label: `BSL Sweep Level ($${(basePrice + 14.0).toFixed(2)})`,
      },
    ];
  } else if (strategy === 'Fair Value Gap (FVG) Retest') {
    candles = [
      { id: 'c-1', index: 0, open: basePrice - 5.0, high: basePrice, low: basePrice - 6.0, close: basePrice - 1.0 },
      { id: 'c-2', index: 1, open: basePrice - 1.0, high: basePrice + 15.0, low: basePrice - 1.5, close: basePrice + 14.0 },
      { id: 'c-3', index: 2, open: basePrice + 14.0, high: basePrice + 19.0, low: basePrice + 9.0, close: basePrice + 18.0 },
      { id: 'c-4', index: 3, open: basePrice + 18.0, high: basePrice + 18.5, low: basePrice + 5.0, close: basePrice + 6.0 },
      { id: 'c-5', index: 4, open: basePrice + 6.0, high: basePrice + 8.0, low: basePrice + 4.5, close: basePrice + 7.5 },
      { id: 'c-6', index: 5, open: basePrice + 7.5, high: basePrice + 24.0, low: basePrice + 7.0, close: basePrice + 23.0 },
    ];
    overlays = [
      {
        id: 'fvg-gap',
        type: 'FVG',
        startCandleIndex: 1,
        endCandleIndex: 4,
        priceStart: basePrice,
        priceEnd: basePrice + 9.0,
        color: '#00F5A0',
        label: `M15 Bullish FVG [${basePrice.toFixed(1)} - ${(basePrice + 9.0).toFixed(1)}]`,
      },
    ];
  } else {
    // Risk-First
    candles = [
      { id: 'c-1', index: 0, open: basePrice - 8.0, high: basePrice + 4.0, low: basePrice - 9.0, close: basePrice + 2.0 },
      { id: 'c-2', index: 1, open: basePrice + 2.0, high: basePrice + 3.0, low: basePrice - 5.0, close: basePrice - 3.5 },
      { id: 'c-3', index: 2, open: basePrice - 3.5, high: basePrice + 14.0, low: basePrice - 4.0, close: basePrice + 12.0 },
      { id: 'c-4', index: 3, open: basePrice + 12.0, high: basePrice + 13.0, low: basePrice, close: basePrice + 1.0 },
      { id: 'c-5', index: 4, open: basePrice + 1.0, high: basePrice + 8.0, low: basePrice - 2.0, close: basePrice + 6.5 },
      { id: 'c-6', index: 5, open: basePrice + 6.5, high: basePrice + 20.0, low: basePrice + 5.5, close: basePrice + 18.0 },
    ];
    overlays = [
      {
        id: 'support-line',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 1,
        endCandleIndex: 4,
        priceStart: basePrice,
        priceEnd: basePrice,
        color: '#38BDF8',
        label: `Previous High Support ($${basePrice.toFixed(2)})`,
      },
      {
        id: 'risk-rr',
        type: 'LONG_SHORT',
        startCandleIndex: 4,
        endCandleIndex: 5,
        priceStart: basePrice,
        priceEnd: basePrice + 7.0,
        color: '#00F5A0',
        label: 'Risk Budget: $30 | 1:3.5 RR',
      },
    ];
  }

  return {
    headline: headline.toUpperCase(),
    subline,
    strategy,
    seniorTraderRationale,
    symbol: 'XAUUSD',
    basePrice,
    candles,
    overlays,
  };
}
