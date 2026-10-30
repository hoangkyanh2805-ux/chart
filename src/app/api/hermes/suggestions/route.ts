import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface SuggestionItem {
  id: string;
  label: string;
  prompt: string;
  category: 'scripts' | 'painpoints' | 'courses' | 'live';
  badge?: string;
  meta?: Record<string, any>;
}

export interface HermesSuggestionsResponse {
  timestamp: string;
  activeCounts: {
    scripts: number;
    painpoints: number;
    courses: number;
    live: number;
  };
  categories: {
    scripts: SuggestionItem[];
    painpoints: SuggestionItem[];
    courses: SuggestionItem[];
    live: SuggestionItem[];
  };
}

const SCRIPTS_DIR = 'C:\\Users\\Admin\\youtube\\video_scripts';
const BRAIN_FILE = 'C:\\Users\\Admin\\youtube\\channel-brain-v3.md';
const COURSES_DIR = path.resolve(process.cwd(), 'knowledge/azzam_courses');

function getLiveScripts(): SuggestionItem[] {
  const suggestions: SuggestionItem[] = [];
  try {
    if (fs.existsSync(SCRIPTS_DIR)) {
      const allFiles = fs.readdirSync(SCRIPTS_DIR)
        .filter((f) => f.endsWith('.md') && (f.startsWith('script_') || f.startsWith('prompt_package_')))
        .map((f) => {
          const fullPath = path.join(SCRIPTS_DIR, f);
          const stat = fs.statSync(fullPath);
          return { name: f, fullPath, mtime: stat.mtimeMs };
        })
        .sort((a, b) => b.mtime - a.mtime);

      const seenBases = new Set<string>();

      for (const file of allFiles) {
        const baseKey = file.name.replace(/-[a-f0-9]{8}\.md$/, '.md');
        if (seenBases.has(baseKey)) continue;
        seenBases.add(baseKey);

        try {
          const content = fs.readFileSync(file.fullPath, 'utf8');
          const dateMatch = file.name.match(/\d{4}-\d{2}-\d{2}/);
          const dateStr = dateMatch ? dateMatch[0].slice(5) : 'LIVE';

          let label = `🎬 [${dateStr}]: `;
          let prompt = '';

          if (file.name.includes('learning-order')) {
            label += 'How to Learn Gold Trading in Order';
            prompt = `Lên setup biểu đồ cho kịch bản ${dateStr} 'How to Learn Gold Trading in Order': Vốn $1,000, Risk $10 (1%), SL 20 pips, R:R 1:3.5`;
          } else if (file.name.includes('fear-of-losing-money')) {
            label += 'Fear of Losing Money — Khóa $50 Risk';
            prompt = `Lên setup biểu đồ kịch bản ${dateStr} 'Fear of Losing Money': Tài khoản $5k, Risk $50 (1%), SL 20 pips, size 0.25 lot, R:R 1:3.5`;
          } else if (file.name.includes('pp0023') || file.name.includes('institutional-candle')) {
            label += 'Đọc Nến Tổ Chức (Giải quyết PP-0023)';
            prompt = `Lên setup nến rút chân tổ chức giải quyết nỗi đau PP-0023 cho người mới: SL 20 pips, R:R 1:3.5`;
          } else if (file.name.includes('book-pdf') || file.name.includes('loss-limit')) {
            label += 'Bẫy Đọc 44 Sách PDF vs Risk $30 Thật';
            prompt = `Lên video vạch trần bẫy 44 sách PDF nhưng không biết khóa rủi ro $30 trước khi trade (Risk-First)`;
          } else if (file.name.includes('stop-loss-bi-hit')) {
            label += '3 Quy Tắc Sống Còn Khi Stop Loss Bị Hit';
            prompt = `Lên video 3 quy tắc sống còn khi bị hit Stop Loss 20 pips: Không trả thù, tắt chart và bảo toàn vốn`;
          } else {
            const cleanTitle = file.name
              .replace(/\.md$/, '')
              .replace(/^(?:script|prompt_package)_\d{4}-\d{2}-\d{2}_/, '')
              .replace(/-/g, ' ');
            label += cleanTitle.slice(0, 38);
            prompt = `Lên setup nến kịch bản ${dateStr} '${cleanTitle}': SL 20 pips, R:R 1:3.5, quản lý vốn Risk-First`;
          }

          suggestions.push({
            id: `script_${file.name}`,
            label,
            prompt,
            category: 'scripts',
            badge: `${dateStr}`,
          });

          if (suggestions.length >= 5) break;
        } catch {
          // ignore single file error
        }
      }
    }
  } catch (err) {
    console.warn('Failed reading scripts directory:', err);
  }

  // Resilient defaults if empty
  if (suggestions.length === 0) {
    suggestions.push(
      {
        id: 'script_2026-10-28_learning_order',
        label: '🎬 [28/10]: How to Learn Gold Trading in Order',
        prompt: 'Lên setup biểu đồ cho kịch bản 28/10: R:R 1:3.5, SL 20 pips, quản lý vốn Risk-First $30',
        category: 'scripts',
        badge: '28/10',
      },
      {
        id: 'script_2026-10-28_fear_losing_money',
        label: '🎬 [28/10]: Fear of Losing Money — Khóa $50 Risk',
        prompt: 'Lên setup biểu đồ kịch bản 28/10: Tài khoản $5k, Risk $50, SL 20 pips, size 0.25 lot, R:R 1:3.5',
        category: 'scripts',
        badge: '28/10',
      },
      {
        id: 'script_2026-10-27_pp0023',
        label: '🎬 [27/10]: Đọc Nến Tổ Chức (Giải quyết PP-0023)',
        prompt: 'Lên setup nến rút chân tổ chức giải quyết nỗi đau PP-0023 cho người mới: SL 20 pips, R:R 1:3.5',
        category: 'scripts',
        badge: '27/10',
      }
    );
  }

  return suggestions.slice(0, 5);
}

function getPainpointSuggestions(): SuggestionItem[] {
  return [
    {
      id: 'pp_education_gap_pp0023',
      label: '📊 [488 người]: Không biết đọc cấu trúc nến (PP-0023)',
      prompt: 'Lên video và setup nến giải quyết nỗi đau 488 người: Không biết đọc cấu trúc nến, bẫy rút râu từ chối giá hỗ trợ (PP-0023)',
      category: 'painpoints',
      badge: '488 comments',
      meta: { code: 'PP-0023', category: 'education_gap' },
    },
    {
      id: 'pp_scalping_pp0040',
      label: '📊 [Scalping 1m]: Thử 6 chiến lược vẫn liên tục bị quét Stop Loss (PP-0040)',
      prompt: 'Lên video giải quyết nỗi đau Scalping 1m hay bị quét SL: Kỹ thuật đặt Stop Loss an toàn sau cản M15 (PP-0040)',
      category: 'painpoints',
      badge: 'PP-0040',
      meta: { code: 'PP-0040', category: 'entry_timing' },
    },
    {
      id: 'pp_liquidity_sweep_pp0002',
      label: '📊 [1,791 likes]: Bẫy quét râu Liquidity Sweep giả phá đỉnh (PP-0002)',
      prompt: 'Lên video bẫy quét râu đỉnh BSL dụ retail mua rồi sập (PP-0002 Liquidity Sweep)',
      category: 'painpoints',
      badge: '1,791 likes',
      meta: { code: 'PP-0002', category: 'strategy_rules' },
    },
    {
      id: 'pp_chase_green_pp0050',
      label: '📊 [Đuổi nến xanh]: Mua FOMO đỉnh thay vì đợi kiểm tra hỗ trợ (PP-0050)',
      prompt: 'Lên video cảnh tỉnh bẫy mua đuổi nến xanh: Đợi nến rút chân tại hỗ trợ mới vào lệnh (PP-0050)',
      category: 'painpoints',
      badge: '90 likes',
      meta: { code: 'PP-0050', category: 'psychology' },
    },
    {
      id: 'pp_fvg_50ce_pp0090',
      label: '📊 [Fair Value Gap]: Kỹ thuật bắt điểm 50% Consequent Encroachment (PP-0090)',
      prompt: 'Lên setup nến Smart Money Concepts: 50% FVG Consequent Encroachment, SL 20 pips, R:R 1:3.5',
      category: 'painpoints',
      badge: '72 likes',
      meta: { code: 'PP-0090', category: 'education_gap' },
    },
    {
      id: 'pp_stop_loss_pp0103',
      label: '📊 [Stop Loss]: Đặt SL quá gần cản bị cắn râu trước khi bay (PP-0103)',
      prompt: 'Lên video 3 quy tắc sống còn khi bị hit Stop Loss 20 pips: Không trả thù, tắt chart và bảo toàn vốn',
      category: 'painpoints',
      badge: 'PP-0103',
      meta: { code: 'PP-0103', category: 'risk_management' },
    },
    {
      id: 'pp_structure_pp0138',
      label: '📊 [Cấu trúc M15]: Đánh ngược xu hướng vì không biết đọc Swing High/Low (PP-0138)',
      prompt: 'Lên video 3 bước đọc Swing High và BOS cấu trúc thị trường (OPT 4 / PP-0138)',
      category: 'painpoints',
      badge: 'PP-0138',
      meta: { code: 'PP-0138', category: 'strategy_rules' },
    },
    {
      id: 'pp_overload_pp0009',
      label: '📊 [Người mới]: Quá tải thuật ngữ FVG, Order Block, kiệt sức vì chart (PP-0009)',
      prompt: 'Lên video tối giản cho người mới: Chỉ nhìn cản hỗ trợ và nến rút chân từ chối giá',
      category: 'painpoints',
      badge: '121 likes',
      meta: { code: 'PP-0009', category: 'education_gap' },
    },
    {
      id: 'pp_order_block_pp0178',
      label: '📊 [Order Block]: Vào Buy ngay vùng Bearish Order Block xả hàng (PP-0178)',
      prompt: 'Lên setup nhận diện vùng Bearish Order Block tổ chức xả hàng, Sell theo cấu trúc',
      category: 'painpoints',
      badge: 'PP-0178',
      meta: { code: 'PP-0178', category: 'strategy_rules' },
    },
    {
      id: 'pp_pdf_trap_pp0039',
      label: '📊 [275 người]: Cái bẫy săn 44 sách PDF thay vì kỷ luật rủi ro (PP-0039)',
      prompt: 'Lên video vạch trần bẫy 44 sách PDF nhưng không biết khóa rủi ro $30 trước khi trade (PP-0039)',
      category: 'painpoints',
      badge: '275 comments',
      meta: { code: 'PP-0039', category: 'risk_management' },
    },
  ];
}

function getCourseSuggestions(): SuggestionItem[] {
  return [
    {
      id: 'course_opt3_smc',
      label: '🎓 [OPT 3 SMC]: Kỹ thuật vào lệnh 50% FVG C.E.',
      prompt: 'Lên setup nến Smart Money Concepts: 50% FVG Consequent Encroachment, SL 20 pips, R:R 1:3.5',
      category: 'courses',
      badge: 'OPT 3',
      meta: { course: 'OPT 3', concept: 'FVG 50% C.E.' },
    },
    {
      id: 'course_opt11_risk',
      label: '🎓 [OPT 11 Risk-First]: Công thức quản lý vốn ($30 Budget)',
      prompt: 'Lên video công thức Risk Budget $30 trước khi nhìn chart: SL 20 pips, Size 0.15 lot',
      category: 'courses',
      badge: 'OPT 11',
      meta: { course: 'OPT 11', concept: 'Risk-First Position Sizing' },
    },
    {
      id: 'course_opt9_breakout',
      label: '🎓 [OPT 9 Bẫy Breakout]: Quét râu BSL dụ retail đu đỉnh',
      prompt: 'Lên setup nến quét râu BSL $4,142.00 dụ retail mua đỉnh rồi đảo chiều (OPT 9 Breakout Trap)',
      category: 'courses',
      badge: 'OPT 9',
      meta: { course: 'OPT 9', concept: 'BSL Liquidity Sweep' },
    },
    {
      id: 'course_opt4_structure',
      label: '🎓 [OPT 4 Cấu Trúc]: 3 bước đọc Swing High & BOS',
      prompt: 'Lên video 3 bước đọc Swing High và BOS cấu trúc thị trường theo khóa OPT 4',
      category: 'courses',
      badge: 'OPT 4',
      meta: { course: 'OPT 4', concept: 'Swing High & Break of Structure' },
    },
    {
      id: 'course_opt1_mtf',
      label: '🎓 [OPT 1 Đa Khung]: Phân tích hợp lưu H1 Bias & M15 Entry',
      prompt: 'Lên video phân tích hợp lưu xu hướng H1 và điểm vào lệnh M15 (OPT 1 Multiple Timeframe)',
      category: 'courses',
      badge: 'OPT 1',
      meta: { course: 'OPT 1', concept: 'Multiple Timeframe Theory' },
    },
    {
      id: 'course_opt8_daytrading',
      label: '🎓 [OPT 8 Day Trading]: Bẫy thanh khoản phiên London & NY',
      prompt: 'Lên setup quét thanh khoản mở phiên London và New York (OPT 8 Day Trading Scalping)',
      category: 'courses',
      badge: 'OPT 8',
      meta: { course: 'OPT 8', concept: 'Session Liquidity' },
    },
  ];
}

function getLiveMarketSuggestions(): SuggestionItem[] {
  const currentSpot = 4129.09;
  return [
    {
      id: 'live_bsl_sweep',
      label: `🔴 [LIVE SPOT $${Math.floor(currentSpot)}]: Bẫy quét râu đỉnh phiên Mỹ ($4,142)`,
      prompt: `Lên setup nến Vàng phiên Mỹ hiện tại $${Math.floor(currentSpot)}: Quét đỉnh BSL $4,142.00, Sell pullback về $4,114.50`,
      category: 'live',
      badge: 'LIVE SPOT',
      meta: { price: currentSpot, action: 'SELL_BSL_SWEEP' },
    },
    {
      id: 'live_support_bounce',
      label: `🔴 [LIVE SPOT $${Math.floor(currentSpot)}]: Rút chân kiểm tra hỗ trợ $4,128.00`,
      prompt: `Lên setup nến Vàng hiện tại $${Math.floor(currentSpot)}: Rejection wick tại hỗ trợ $4,128.00, Buy lướt lên $4,142.00`,
      category: 'live',
      badge: 'LIVE SPOT',
      meta: { price: currentSpot, action: 'BUY_SUPPORT_REJECTION' },
    },
    {
      id: 'live_fvg_retest',
      label: `🔴 [LIVE SPOT $${Math.floor(currentSpot)}]: Retest vùng FVG 50% ($4,132.50)`,
      prompt: `Lên setup nến Vàng retest FVG 50% tại $4,132.50: SL 20 pips, R:R 1:3.5`,
      category: 'live',
      badge: 'LIVE SPOT',
      meta: { price: currentSpot, action: 'FVG_RETEST' },
    },
    {
      id: 'live_asia_sweep',
      label: `🔴 [LIVE SPOT $${Math.floor(currentSpot)}]: Quét thanh khoản đáy Á ($4,122.00)`,
      prompt: `Lên setup nến Vàng quét sạch Stop Loss đáy phiên Á $4,122.00 rồi bật tăng mạnh mẽ`,
      category: 'live',
      badge: 'LIVE SPOT',
      meta: { price: currentSpot, action: 'ASIA_LOW_SWEEP' },
    },
    {
      id: 'live_break_retest',
      label: `🔴 [LIVE SPOT $${Math.floor(currentSpot)}]: Phá cản & Retest then chốt ($4,136.00)`,
      prompt: `Lên setup nến Vàng Break & Retest cản $4,136.00: SL 20 pips, R:R 1:3.5`,
      category: 'live',
      badge: 'LIVE SPOT',
      meta: { price: currentSpot, action: 'BREAK_RETEST' },
    },
  ];
}

export async function GET(req: NextRequest) {
  const scripts = getLiveScripts();
  const painpoints = getPainpointSuggestions();
  const courses = getCourseSuggestions();
  const live = getLiveMarketSuggestions();

  const response: HermesSuggestionsResponse = {
    timestamp: new Date().toISOString(),
    activeCounts: {
      scripts: scripts.length,
      painpoints: painpoints.length,
      courses: courses.length,
      live: live.length,
    },
    categories: {
      scripts,
      painpoints,
      courses,
      live,
    },
  };

  return NextResponse.json(response);
}
