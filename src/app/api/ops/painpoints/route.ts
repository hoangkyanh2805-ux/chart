import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { AzzamPainPointItem } from '@/data/azzamOps';
import { Candle, Overlay } from '@/types/chart';

const YOUTUBE_DIR = 'C:\\Users\\Admin\\youtube';
const PAINPOINTS_CSV_PATH = path.join(YOUTUBE_DIR, 'outputs', 'painpoints', 'master', 'painpoints_master.csv');
const EVERGREEN_MAP_PATH = path.join(YOUTUBE_DIR, 'outputs', 'strategy', 'EVERGREEN_PAINPOINT_MAP.json');

// Reusable institutional setup generators for Gold XAUUSD
function generateSetupForTopic(topic: string, code: string, category: string): {
  bannerHook: string;
  title: string;
  candles: Candle[];
  overlays: Overlay[];
} {
  const basePrice = 4128.0;

  if (/stop\s*loss|sl|quét/i.test(topic) || /risk/i.test(category)) {
    return {
      bannerHook: '3 NGUYÊN TẮC STOP LOSS SỐNG CÒN',
      title: `XAUUSD: ${code} - Kỹ Thuật Đặt SL An Toàn 20 Pips`,
      candles: [
        { id: 'c-1', index: 0, open: basePrice, high: basePrice + 4.0, low: basePrice - 3.0, close: basePrice + 2.5 },
        { id: 'c-2', index: 1, open: basePrice + 2.5, high: basePrice + 8.0, low: basePrice + 1.0, close: basePrice + 6.0 },
        { id: 'c-3', index: 2, open: basePrice + 6.0, high: basePrice + 7.0, low: basePrice - 6.0, close: basePrice - 1.0 }, // Sweep rejection wick
        { id: 'c-4', index: 3, open: basePrice - 1.0, high: basePrice + 12.0, low: basePrice - 2.0, close: basePrice + 11.0 }, // Big expansion
        { id: 'c-5', index: 4, open: basePrice + 11.0, high: basePrice + 18.0, low: basePrice + 10.0, close: basePrice + 17.5 },
      ],
      overlays: [
        {
          id: 'safe-sl-line',
          type: 'LIQUIDITY_LINE',
          startCandleIndex: 2,
          endCandleIndex: 4,
          priceStart: basePrice - 6.0,
          priceEnd: basePrice - 6.0,
          color: '#FF3366',
          opacity: 0.9,
          label: 'SL An Toàn Dưới Râu Quét ($4,122.00 - 20 Pips)',
        },
        {
          id: 'rr-box',
          type: 'LONG_SHORT',
          startCandleIndex: 2,
          endCandleIndex: 4,
          priceStart: basePrice - 1.0,
          priceEnd: basePrice + 17.5,
          color: '#00F5A0',
          opacity: 0.25,
          label: 'Entry $4,127.0 | TP $4,145.5 (+70 Pips R:R 1:3.5)',
        },
      ],
    };
  }

  if (/orb|sweep|liquidity|thanh khoản/i.test(topic) || /sweep/i.test(category)) {
    return {
      bannerHook: 'BẪY QUÉT THANH KHOẢN PHIÊN Á (LIQUIDITY TRAP)',
      title: `XAUUSD: ${code} - Quét Đỉnh BSL Rồi Sập FVG`,
      candles: [
        { id: 'c-1', index: 0, open: basePrice - 2.0, high: basePrice + 2.0, low: basePrice - 4.0, close: basePrice + 1.0 },
        { id: 'c-2', index: 1, open: basePrice + 1.0, high: basePrice + 10.0, low: basePrice, close: basePrice + 9.0 }, // ORB High
        { id: 'c-3', index: 2, open: basePrice + 9.0, high: basePrice + 16.0, low: basePrice + 4.0, close: basePrice + 5.0 }, // Trap wick
        { id: 'c-4', index: 3, open: basePrice + 5.0, high: basePrice + 6.0, low: basePrice - 10.0, close: basePrice - 8.0 }, // MSS dump
        { id: 'c-5', index: 4, open: basePrice - 8.0, high: basePrice - 2.0, low: basePrice - 9.0, close: basePrice - 3.0 }, // FVG Retest
        { id: 'c-6', index: 5, open: basePrice - 3.0, high: basePrice - 2.0, low: basePrice - 22.0, close: basePrice - 20.0 }, // Expansion dump
      ],
      overlays: [
        {
          id: 'trap-line',
          type: 'LIQUIDITY_LINE',
          startCandleIndex: 1,
          endCandleIndex: 3,
          priceStart: basePrice + 10.0,
          priceEnd: basePrice + 10.0,
          color: '#FF3366',
          opacity: 0.9,
          label: 'ORB High Bẫy Mua Đuổi ($4,138.00)',
        },
        {
          id: 'bearish-fvg',
          type: 'FVG',
          startCandleIndex: 3,
          endCandleIndex: 5,
          priceStart: basePrice - 8.0,
          priceEnd: basePrice - 2.0,
          color: '#FF3366',
          opacity: 0.28,
          label: 'Bearish FVG [4,120 - 4,126]',
        },
      ],
    };
  }

  if (/fvg|order block|ict/i.test(topic) || /education/i.test(category)) {
    return {
      bannerHook: 'ICT CƠ BẢN: ĐIỂM VÀO 50% FVG',
      title: `XAUUSD: ${code} - Consequent Encroachment 50% FVG`,
      candles: [
        { id: 'c-1', index: 0, open: basePrice - 5.0, high: basePrice - 2.0, low: basePrice - 7.0, close: basePrice - 3.0 },
        { id: 'c-2', index: 1, open: basePrice - 3.0, high: basePrice + 12.0, low: basePrice - 4.0, close: basePrice + 11.0 }, // Displacement
        { id: 'c-3', index: 2, open: basePrice + 11.0, high: basePrice + 18.0, low: basePrice + 9.0, close: basePrice + 16.0 },
        { id: 'c-4', index: 3, open: basePrice + 16.0, high: basePrice + 17.0, low: basePrice + 4.0, close: basePrice + 5.5 }, // Retest 50% CE
        { id: 'c-5', index: 4, open: basePrice + 5.5, high: basePrice + 24.0, low: basePrice + 4.5, close: basePrice + 23.0 }, // TP Run
      ],
      overlays: [
        {
          id: 'fvg-ce-zone',
          type: 'FVG',
          startCandleIndex: 1,
          endCandleIndex: 4,
          priceStart: basePrice - 2.0,
          priceEnd: basePrice + 9.0,
          color: '#00F5A0',
          opacity: 0.25,
          label: 'Bullish FVG 50% C.E. Retest [4,126 - 4,137]',
        },
      ],
    };
  }

  if (/vốn\s*1000|vốn nhỏ|tài khoản nhỏ/i.test(topic) || /1000/i.test(topic)) {
    return {
      bannerHook: 'VỐN $1,000 CHỈ ĐƯỢC PHÉP ĐÁNH 1-SETUP NÀY',
      title: `XAUUSD: ${code} - Chiến Lược Khóa Rủi Ro $10 (1%)`,
      candles: [
        { id: 'c-1', index: 0, open: basePrice - 1.0, high: basePrice + 2.0, low: basePrice - 3.0, close: basePrice + 1.0 },
        { id: 'c-2', index: 1, open: basePrice + 1.0, high: basePrice + 3.0, low: basePrice - 2.0, close: basePrice },
        { id: 'c-3', index: 2, open: basePrice, high: basePrice + 1.0, low: basePrice - 5.0, close: basePrice - 0.5 }, // Rejection wick
        { id: 'c-4', index: 3, open: basePrice - 0.5, high: basePrice + 9.0, low: basePrice - 1.0, close: basePrice + 8.0 },
        { id: 'c-5', index: 4, open: basePrice + 8.0, high: basePrice + 15.0, low: basePrice + 7.0, close: basePrice + 14.5 },
      ],
      overlays: [
        {
          id: 'risk-budget-line',
          type: 'SUPPORT_RESISTANCE',
          startCandleIndex: 0,
          endCandleIndex: 4,
          priceStart: basePrice - 2.0,
          priceEnd: basePrice - 2.0,
          color: '#38BDF8',
          opacity: 0.9,
          label: 'Hỗ Trợ M15: Khóa Rủi Ro 20 Pips ($10 / 0.05 Lot)',
        },
        {
          id: 'rr-box',
          type: 'LONG_SHORT',
          startCandleIndex: 2,
          endCandleIndex: 4,
          priceStart: basePrice - 0.5,
          priceEnd: basePrice + 14.5,
          color: '#00F5A0',
          opacity: 0.25,
          label: 'Khóa Lỗ $10 | Chốt Lời $35 (R:R 1:3.5)',
        },
      ],
    };
  }

  // Default Clean Price Action Pullback
  return {
    bannerHook: `${topic.toUpperCase()} — CHIẾN LƯỢC THỰC CHIẾN`,
    title: `XAUUSD: ${code} - ${topic}`,
    candles: [
      { id: 'c-1', index: 0, open: basePrice - 2.0, high: basePrice + 1.0, low: basePrice - 4.0, close: basePrice },
      { id: 'c-2', index: 1, open: basePrice, high: basePrice + 8.0, low: basePrice - 1.0, close: basePrice + 7.0 },
      { id: 'c-3', index: 2, open: basePrice + 7.0, high: basePrice + 8.0, low: basePrice + 1.0, close: basePrice + 2.0 }, // Pullback
      { id: 'c-4', index: 3, open: basePrice + 2.0, high: basePrice + 14.0, low: basePrice + 1.5, close: basePrice + 13.0 },
    ],
    overlays: [
      {
        id: 'support-line',
        type: 'SUPPORT_RESISTANCE',
        startCandleIndex: 0,
        endCandleIndex: 3,
        priceStart: basePrice + 1.0,
        priceEnd: basePrice + 1.0,
        color: '#00F5A0',
        opacity: 0.85,
        label: 'Vùng Hỗ Trợ M15 ($4,129.00)',
      },
    ],
  };
}

function parseCsvLine(text: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur.trim());
  return result;
}

export async function GET() {
  const painPoints: AzzamPainPointItem[] = [];
  const backlogItems: AzzamPainPointItem[] = [];

  try {
    // 1. Read EVERGREEN_PAINPOINT_MAP.json (24 topics)
    if (fs.existsSync(EVERGREEN_MAP_PATH)) {
      const rawMap = fs.readFileSync(EVERGREEN_MAP_PATH, 'utf8');
      const evergreenData = JSON.parse(rawMap);

      evergreenData.forEach((item: any, index: number) => {
        const rank = index + 1;
        const setup = generateSetupForTopic(item.topic, item.painpoint_id, item.category);

        backlogItems.push({
          id: `backlog-${item.painpoint_id.toLowerCase()}-${rank}`,
          type: 'backlog',
          rank,
          category: item.category || 'strategy_rules',
          score: typeof item.score === 'number' ? Number(item.score.toFixed(2)) : item.score,
          hookTitle: item.topic,
          painQuote: item.quote?.trim() || 'No quote available',
          solutionSummary: `Giải quyết chủ đề '${item.topic}': Setup nến chuẩn XAUUSD, Risk-First $30 Budget, SL 20 pips, R:R 1:3.5.`,
          ctaText: `Comment '${item.topic.split(' ')[0]?.toUpperCase() || 'ROADMAP'}' để nhận lộ trình setup`,
          recommendedSetup: {
            title: setup.title,
            aspectRatio: '9:16',
            duration: 6.0,
            revealMode: 'sequential',
            bannerHook: setup.bannerHook,
            candles: setup.candles,
            overlays: setup.overlays,
          },
        });
      });
    }

    // 2. Read Top Pain Points from painpoints_master.csv (1,204 comments)
    if (fs.existsSync(PAINPOINTS_CSV_PATH)) {
      const csvContent = fs.readFileSync(PAINPOINTS_CSV_PATH, 'utf8');
      const lines = csvContent.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

      // Top scored entries from CSV
      let rank = 1;
      for (let i = 1; i < lines.length && painPoints.length < 15; i++) {
        const line = lines[i];
        const cols = parseCsvLine(line);
        if (cols.length >= 5) {
          const ppId = cols[0];
          const score = parseFloat(cols[1]);
          const categories = cols[2];
          const comment = (cols[4] || '').slice(0, 180);

          if (!ppId.startsWith('PP-')) continue;

          let hookTitle = '';
          if (ppId === 'PP-0001') hookTitle = 'Vốn $1,000 bắt đầu như thế nào để không bị cháy?';
          else if (ppId === 'PP-0002') hookTitle = 'Vì sao đánh Vàng theo ORB toàn bị dính Trap?';
          else if (ppId === 'PP-0003') hookTitle = 'Daily Bias: Bí mật vào lệnh theo giá mở cửa ngày';
          else if (ppId === 'PP-0004') hookTitle = 'Không có Chén Thánh: 3 bài học đắt giá trong Price Action';
          else if (ppId === 'PP-0005') hookTitle = 'Sao biết vào lệnh Pullback khi giá không chạm Demand?';
          else if (ppId === 'PP-0008') hookTitle = 'Chiến lược 5 bước: Đa khung H1 + M15 chuẩn tổ chức';
          else if (ppId === 'PP-0009') hookTitle = 'Xoá ngay biểu đồ rối rắm: Chỉ nhìn cản hỗ trợ và nến rút chân';
          else if (ppId === 'PP-0010') hookTitle = 'Bẫy Liquidity Sweep: Quét Stop Loss 15 pips rồi bay vụt';
          else if (ppId === 'PP-0013') hookTitle = 'Đặt Stop Loss ở đâu cũng bị cắn: Kỹ thuật đệm an toàn';
          else if (ppId === 'PP-0016') hookTitle = 'Quản lý vốn tài khoản nhỏ: 1 Lệnh tối đa $30 rủi ro';
          else if (ppId === 'PP-0017') hookTitle = 'Nến vừa chạm Order Block là giật râu hit SL: Lỗi do đâu?';
          else if (ppId === 'PP-0023') hookTitle = 'Không biết đọc cấu trúc nến: Bắt đầu từ 2 loại nến này';
          else {
            hookTitle = `Giải mã nỗi đau ${ppId}: ${comment.slice(0, 45)}...`;
          }

          const setup = generateSetupForTopic(hookTitle, ppId, categories);

          painPoints.push({
            id: `pain-${ppId.toLowerCase()}-${rank}`,
            type: 'pain_point',
            rank,
            category: categories.replace(/\|/g, ' • '),
            score: isNaN(score) ? '8.5' : Number(score.toFixed(2)),
            hookTitle,
            painQuote: comment,
            solutionSummary: `Khắc phục triệt để nỗi đau ${ppId}: Chiến lược vào lệnh nến chuẩn xác, SL 20 pips, R:R 1:3.5.`,
            ctaText: "Comment 'ROADMAP' để nhận tài liệu giải pháp",
            recommendedSetup: {
              title: setup.title,
              aspectRatio: '9:16',
              duration: 6.0,
              revealMode: 'sequential',
              bannerHook: setup.bannerHook,
              candles: setup.candles,
              overlays: setup.overlays,
            },
          });
          rank++;
        }
      }
    }
  } catch (err) {
    console.error('Error loading live YouTube pain points:', err);
  }

  // Combine items
  const allItems: AzzamPainPointItem[] = [...painPoints, ...backlogItems];

  return NextResponse.json({
    status: 'ok',
    source: 'C:\\Users\\Admin\\youtube\\outputs',
    counts: {
      total: allItems.length,
      painPoints: painPoints.length,
      backlog: backlogItems.length,
    },
    items: allItems,
  });
}
