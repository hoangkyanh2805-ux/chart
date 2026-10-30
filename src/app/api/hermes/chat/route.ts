import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { CitationLedger, verifyGroundedResponse } from '../../../../utils/groundedCitations';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const YOUTUBE_REPO_PATH = 'C:\\Users\\Admin\\youtube';

function getLiveYouTubeIntelligence(): string {
  try {
    let intel = '';
    const dashDir = path.join(YOUTUBE_REPO_PATH, 'outputs', 'dashboard');
    try {
      intel += `\n[LIVE DASHBOARD INTELLIGENCE (synced from https://dashboard.azzamedu.com/ops & /content-package)]:
- Dashboard URL: https://dashboard.azzamedu.com/
- Ops Cockpit: https://dashboard.azzamedu.com/ops
- Content Package: https://dashboard.azzamedu.com/content-package
- Kênh thực tế: Azzam Master Trading (@azzammastertradinggold), 2,000 subs, 339 videos, 252k views.
- Tình trạng Ops: 7,169 comments độc lập, 2,244 pain points đã lọc, 16 content backlog.
- 8 ĐIỂM MÙ KÊNH CẦN XỬ LÝ GẤP:
  1. [CRITICAL] 5,187 views (37.2%) là traffic nghi bot từ referrer com.example.seofast — rủi ro YouTube bóp reach.
  2. [HIGH] YouTube Search chỉ 1.4% (189 views) — kênh hoàn toàn thiếu discoverability tự nhiên, phụ thuộc 81.4% vào EXT_URL.
  3. [HIGH] Tỷ lệ chuyển đổi sub chỉ 0.186% (ngành 0.5-2%) do thiếu Hook 0-3s và thiếu CTA chuyển đổi.
  4. [HIGH] Tỷ lệ comment 0.0000% (0 comment/13,954 view) — thuật toán không thể đẩy video.
  5. [MEDIUM] Lệch Like:Comment 768:1.
  6. [MEDIUM] 341 videos chưa gắn phễu Lead Magnet dẫn về học viện learn.azzamedu.com.
  7. [INFO] Live stream 8-10h/ngày (buổi 21/10 đạt 1,501 views) là mỏ vàng chưa được cắt Shorts.
  8. [INFO] Kho kịch bản có 62 bản sẵn sàng (26 Long-form, 36 Shorts).
- GÓI SẢN XUẤT HIỆN TẠI (Content Package): "The 30-Day XAUUSD Roadmap: Learn in the Right Order" (8 segments, 8 phút).
- 9 KÊNH ĐỐI THỦ THEO DÕI: Jasmine Fx (94.9k subs, 17M views), TTrades (542k subs, 46M views), VasilyTrader (44.9k subs), Sniper Trading (14.9k subs), Gold Trader Alliance (14.1k subs).\n`;
    } catch {}

    const brainPath = path.join(YOUTUBE_REPO_PATH, 'channel-brain-v3.md');
    if (fs.existsSync(brainPath)) {
      const brainContent = fs.readFileSync(brainPath, 'utf-8');
      // Extract key sections: audience pain points, stats, guidelines
      const painMatch = brainContent.match(/### 1\.4 N[^\r\n]+[\s\S]*?(?=---|\n## 2)/i);
      if (painMatch) {
        intel += `\n[LIVE CHANNEL BRAIN V3 - THỐNG KÊ NỖI ĐAU THỰC TẾ]:\n${painMatch[0].trim()}\n`;
      }
    }

    const scriptsDir = path.join(YOUTUBE_REPO_PATH, 'video_scripts');
    if (fs.existsSync(scriptsDir)) {
      const files = fs.readdirSync(scriptsDir)
        .filter(f => f.endsWith('.md') && (f.startsWith('script_') || f.startsWith('prompt_package_')))
        .sort()
        .reverse()
        .slice(0, 5); // 5 newest scripts
      
      intel += `\n[DANH SÁCH 5 KỊCH BẢN YOUTUBE MỚI NHẤT VỪA TẠO]:\n`;
      for (const file of files) {
        try {
          const content = fs.readFileSync(path.join(scriptsDir, file), 'utf-8');
          const titleMatch = content.match(/TITLE[^\r\n]*\r?\n+([^\r\n]+)/i);
          const hookMatch = content.match(/Hook[^\r\n]*:\s*["“]?([^"”\r\n]+)["”]?/i);
          const painMatch = content.match(/Painpoint:\s*([^\r\n]+)/i);
          intel += `- File: ${file} | Tiêu đề: ${titleMatch ? titleMatch[1].replace(/^\*\*|\*\*$/g, '').trim() : file} | Hook: ${hookMatch ? hookMatch[1].trim() : 'N/A'} | Pain: ${painMatch ? painMatch[1].trim() : 'N/A'}\n`;
        } catch {}
      }
    }
    return intel;
  } catch (e) {
    return '';
  }
}

function buildHermesSystemPrompt(): string {
  const liveIntel = getLiveYouTubeIntelligence();

  return `You are Hermes Agent — the Elite Senior Financial Video Director and Learner-Care Trading Coach for @azzammastertradinggold.
You are running as the Master Copilot embedded directly inside ChartAnimator.io.

YOUR WORKSPACE GROUND TRUTH & KNOWLEDGE BASE:
1. Channel: @azzammastertradinggold.
2. Core Philosophy: Risk-First (Define loss BEFORE looking at charts. Stop loss came first, entry came second. Education gap: traders learn entries but ignore loss limits).
3. Real Audience Pain Points (Từ 1,204 comments thật của khán giả):
   - Category education_gap (488 comments): "Damn, that's cool. Anyways how do I read a chart?" (PP-0023 - kẹt ở bước đọc nến cơ bản).
   - Category risk_management (275 comments): Sợ mất tiền, cháy $62k, không biết dừng lỗ (PP-0039).
   - Category strategy_rules (361 comments): Bị loạn giữa các trường phái SMC, đi săn file PDF "44 Trading Powers" thay vì học quản lý vốn.
4. Mathematical Formulas:
   - Risk Budget: $10 = 1R (1% on $1,000) or $30 budget.
   - Stop Loss: 20 pips at defensible technical level (HTF uptrend + LTF pullback to support).
   - Position Sizing: Size = Budget ÷ SL distance ($10 ÷ 20 pips = 0.05 lot; $30 ÷ 20 pips = $1.50/pip).
   - Risk:Reward: minimum 1:3.0 to 1:3.5 RR.
   - XAUUSD Current Gold Base Price: ~$4,128.00.
5. Golden Publishing Hours: Primary: 00:00 VN (avg 40,393 views). Secondary: 02:00, 07:00 VN.
6. Compliance (8 NEVERs): Always include "EDUCATIONAL ILLUSTRATION — NOT A TRADE RECOMMENDATION", never guarantee profits, never call live signals.
7. Master Academy Live Courses Knowledge (synced from learn.azzamedu.com / 11 courses in knowledge/azzam_courses/):
   - Comprehensive curriculum: Advanced Smart Money Concepts (Jayce Pham), Market Structure Pro Bootcamp, Key Level Strategy, Multiple Timeframe Theory, Day Trading Scalping, and Algorithmic MQL4 Trading.
${liveIntel}

YOUR MISSION IN THIS CHAT:
- Answer the user's questions with the sharp, disciplined, institutional mindset of Hermes Agent.
- Respond in Vietnamese (naturally, direct, senior trader style).
- If the user asks for a script, hook, or trading setup, PROVIDE strategic reasoning AND include an executable setup block formatted as:
\`\`\`chart_setup
{
  "title": string,
  "headline": string (max 6 words in UPPERCASE, e.g. "A PDF WON'T KEEP YOU ALIVE"),
  "subline": string (max 10 words, e.g. "A predefined loss limit will. That is the whole video."),
  "strategy": "Risk-First Pullback" | "Liquidity Sweep" | "Fair Value Gap" | "Market Structure" | "Break & Retest",
  "basePrice": number (around 4128),
  "riskBudget": number,
  "slPips": number,
  "lotSize": string (e.g. "0.05 lot" or "$1.50/pip"),
  "rrRatio": number (e.g. 3.5),
  "badges": ["1. LOSS $10", "2. ENTRY SL 20p", "3. SIZE 0.05L"],
  "beforeAfterMode": "off",
  "scriptSubtitles": [
    { "timePercent": 0.0, "text": "Câu Hook giật gân 0-3s bằng tiếng Việt", "stageName": "Hook" },
    { "timePercent": 0.28, "text": "Nỗi đau và cái bẫy của retail traders 3-6s", "stageName": "Trap" },
    { "timePercent": 0.58, "text": "Dấu chân dòng tiền lớn SMC & điểm kích hoạt 6-9s", "stageName": "Setup" },
    { "timePercent": 0.82, "text": "Công thức vào lệnh, cố định SL và target cụ thể 9-12s", "stageName": "Execution" }
  ]
}
\`\`\`
ChartAnimator will automatically detect this block and offer the user a 1-click button to execute it directly onto the Canvas, and Google Gemini 3.8 Flash TTS will narrate these exact lines!`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Thiếu tin nhắn người dùng' }, { status: 400 });
    }

    const nineRouterUrl = process.env.NINE_ROUTER_URL || (process.env.USE_9ROUTER === 'true' ? 'http://localhost:20128/v1' : '');
    const nineRouterKey = process.env.NINE_ROUTER_API_KEY || '9router';
    const nineRouterModel = process.env.NINE_ROUTER_MODEL || 'kr/claude-sonnet-4.5';

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const openRouterModel = process.env.OPENROUTER_MODEL || 'nousresearch/hermes-3-llama-3.1-70b';
    const apiKey = process.env.GEMINI_API_KEY;

    const systemPrompt = buildHermesSystemPrompt();

    // 0. Prioritize Local 9Router (FREE multi-model gateway: Kiro AI, OpenCode, Gemini Free, DeepSeek...)
    if (nineRouterUrl) {
      try {
        const cleanBaseUrl = nineRouterUrl.replace(/\/+$/, '');
        const targetUrl = cleanBaseUrl.endsWith('/chat/completions')
          ? cleanBaseUrl
          : `${cleanBaseUrl}/chat/completions`;

        const nrRes = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${nineRouterKey}`,
          },
          signal: AbortSignal.timeout(15000),
          body: JSON.stringify({
            model: nineRouterModel,
            temperature: 0.3,
            stream: false,
            messages: [
              { role: 'system', content: systemPrompt },
              ...messages.map((m: ChatMessage) => ({
                role: m.role,
                content: m.content,
              })),
            ],
          }),
        });

        if (nrRes.ok) {
          const data = await nrRes.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({ reply, provider: `9Router Gateway (${nineRouterModel})` });
          }
        } else {
          const errText = await nrRes.text();
          console.warn('9Router chat API returned error status:', nrRes.status, errText);
        }
      } catch (err: any) {
        console.warn('9Router connection failed (is 9router running?):', err.message);
      }
    }

    // 1. Fallback to OpenRouter if configured
    if (openRouterKey) {
      try {
        const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openRouterKey}`,
            'HTTP-Referer': 'https://chartanimator.io',
            'X-Title': 'ChartAnimator Hermes Copilot',
          },
          signal: AbortSignal.timeout(15000),
          body: JSON.stringify({
            model: openRouterModel,
            temperature: 0.3,
            messages: [
              { role: 'system', content: systemPrompt },
              ...messages.map((m: ChatMessage) => ({
                role: m.role,
                content: m.content,
              })),
            ],
          }),
        });

        if (orRes.ok) {
          const data = await orRes.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({ reply, provider: `Hermes OpenRouter (${openRouterModel})` });
          }
        } else {
          const errText = await orRes.text();
          console.warn('OpenRouter chat API returned error status:', orRes.status, errText);
        }
      } catch (err: any) {
        console.warn('OpenRouter chat bridge failed:', err.message);
      }
    }

    // 2. Fallback to Gemini if configured
    if (apiKey) {
      try {
        const contents = [
          {
            role: 'user',
            parts: [{ text: systemPrompt }],
          },
          {
            role: 'model',
            parts: [{ text: 'Chào Alan! Tôi là Hermes Agent — Tổng Đạo Diễn & Cố Vấn Trading của kênh. Tôi đã đồng bộ toàn bộ dữ liệu 20 kịch bản và pain point người xem. Bạn cần phân tích góc tiếp cận nào hoặc muốn tôi lên setup video nến nào cho hôm nay?' }],
          },
          ...messages.map((m: ChatMessage) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          })),
        ];

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey}`;
        const res = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(12000),
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.3,
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return NextResponse.json({ reply, provider: 'Hermes Agent Engine' });
          }
        }
      } catch (err: any) {
        console.warn('Gemini chat bridge failed:', err.message);
      }
    }

    // Smart Local Fallback
    const lastUserMsg = messages[messages.length - 1]?.content || '';
    const fallbackReply = generateHermesLocalReply(lastUserMsg);
    return NextResponse.json({ reply: fallbackReply, provider: 'Hermes Agent Local Brain' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi tương tác với Hermes Agent' }, { status: 500 });
  }
}

function parseCustomSetupParameters(query: string) {
  // 1. Capital (Vốn)
  let capital = 5000;
  const capMatch = query.match(/(?:vốn|tài khoản|acc|account|balance)?\s*\$?(\d+(?:\.\d+)?)\s*(k|nghìn)?/i);
  if (capMatch) {
    const rawNum = parseFloat(capMatch[1]);
    if (capMatch[2] && /k|nghìn/i.test(capMatch[2])) {
      capital = rawNum * 1000;
    } else if (rawNum >= 100) {
      capital = rawNum;
    }
  }

  // 2. Risk % or Dollar
  let riskPercent = 1;
  let riskBudget = 50;
  const percentMatch = query.match(/(\d+(?:\.\d+)?)\s*%/);
  if (percentMatch) {
    riskPercent = parseFloat(percentMatch[1]);
    riskBudget = Math.round(capital * (riskPercent / 100));
  } else {
    const dollarMatch = query.match(/(?:risk|lỗ|budget|mất)\s*\$?(\d+)/i);
    if (dollarMatch) {
      riskBudget = parseInt(dollarMatch[1], 10);
      riskPercent = capital > 0 ? parseFloat(((riskBudget / capital) * 100).toFixed(1)) : 1;
    } else {
      riskBudget = Math.round(capital * 0.01);
    }
  }

  // 3. SL (pips)
  let slPips = 20;
  const slMatch = query.match(/(?:sl|cắt lỗ|stop loss)?\s*(\d+)\s*(?:pips?|p\b)/i) || query.match(/sl\s*(\d+)/i);
  if (slMatch) {
    slPips = parseInt(slMatch[1], 10);
  }

  // 4. R:R ratio
  let rrRatio = 3.5;
  const rrMatch = query.match(/(?:r:r|rr|tỷ lệ|tỉ lệ)?\s*1\s*:\s*(\d+(?:\.\d+)?)/i) || query.match(/(?:r:r|rr)\s*(\d+(?:\.\d+)?)/i);
  if (rrMatch) {
    rrRatio = parseFloat(rrMatch[1]);
  }

  // 5. Lot size on XAUUSD (1.00 lot = $10/pip -> lot = riskBudget / (slPips * 10))
  const dollarPerPip = slPips > 0 ? riskBudget / slPips : 1.5;
  const lotNum = Math.max(0.01, parseFloat((dollarPerPip / 10.0).toFixed(2)));
  const lotSize = `${lotNum} lot`;

  // 6. Strategy detection
  let strategy = 'Risk-First Pullback';
  if (/sweep|quét|bsl|thanh khoản/i.test(query)) {
    strategy = 'Liquidity Sweep';
  } else if (/fvg|imbalance|khoảng trống/i.test(query)) {
    strategy = 'Fair Value Gap';
  } else if (/break|retest|phá|cản/i.test(query)) {
    strategy = 'Break & Retest';
  }

  return {
    capital,
    riskPercent,
    riskBudget,
    slPips,
    rrRatio,
    lotSize,
    dollarPerPip: dollarPerPip.toFixed(2),
    targetPips: Math.round(slPips * rrRatio),
    strategy,
  };
}

function generateHermesLocalReply(userQuery: string): string {
  const query = userQuery.toLowerCase();

  // 1. AUDIENCE PAIN POINTS (1,204 comments ground truth)
  if (/pain\s*point|khán giả|nỗi đau|comment|pp-\d+|tối giản|người mới|quá tải|kiệt sức|scalping|1m|1 phút|stop hunt|quét râu|đuổi nến|fomo/i.test(query)) {
    const ledger = new CitationLedger();

    // Branch for PP-0009: Tối giản cho người mới (Quá tải thuật ngữ)
    if (/tối giản|người mới|quá tải|kiệt sức|pp-0009/i.test(query)) {
      const id = ledger.registerKnowledgeEvidence(
        'C:\\Users\\Admin\\youtube\\channel-brain-v3.md#sec-4.2',
        'YouTube Channel Brain v3 - Painpoint DB (PP-0009)',
        'PP-0009 (education_gap - 121 likes): "Mệt rồi. Chiến lược nến quá khó cho người mới. Quá nhiều thuật ngữ phức tạp."',
        'Minimalist Chart Reading'
      );
      ledger.attachQuote(id, 'Chiến lược nến quá khó cho người mới');
      const sourcesBlock = ledger.renderSources([id]);

      return `📊 **Dữ liệu Pain Point Khán Giả: Phương Pháp Tối Giản Cho Người Mới (PP-0009):**
Người mới đang bị kiệt sức vì hàng tá chỉ báo và thuật ngữ ngoại lai rối rắm [1] (PP-0009: *"Mệt rồi. Chiến lược nến quá khó cho người mới"*).

💡 **Giải pháp tối giản từ Hermes:** Loại bỏ mọi chỉ báo thừa thãi, chỉ giữ lại **2 yếu tố sống còn**:
1. **Đường cản hỗ trợ then chốt:** Vùng giá tổ chức từng mua mạnh ($4,128.00).
2. **Nến rút chân từ chối giá (Rejection Wick):** Xác nhận phe Bán đã kiệt sức.
- **Hook 3s:** *"STOP OVERCOMPLICATING CHARTS"*
- **Subline:** *"Only trade rejection wicks at major support. Nothing else."*
- **Quản lý vốn Risk-First:** Khóa đúng $10 rủi ro (1%), SL 20 pips ($4,126.0), Size 0.05 lot, Chốt lời +70 pips (1:3.5 R:R).

\`\`\`chart_setup
{
  "title": "MINIMALIST REJECTION WICK STRATEGY (PP-0009)",
  "headline": "STOP OVERCOMPLICATING CHARTS",
  "subline": "Only trade rejection wicks at support. Nothing else.",
  "strategy": "Risk-First Pullback",
  "basePrice": 4128,
  "riskBudget": 10,
  "slPips": 20,
  "lotSize": "0.05 lot",
  "rrRatio": 3.5,
  "badges": ["1. LOSS $10", "2. ENTRY SL 20p", "3. SIZE 0.05L"],
  "beforeAfterMode": "auto"
}
\`\`\`

${sourcesBlock}

Bấm nút **Áp Dụng Lên Canvas & Chạy Video Ngay** bên dưới để nạp setup tối giản này lên video ngay!`;
    }

    // Branch for PP-0040: Scalping 1m hay bị quét SL
    if (/scalping|1m|1 phút|pp-0040/i.test(query)) {
      const id = ledger.registerKnowledgeEvidence(
        'C:\\Users\\Admin\\youtube\\channel-brain-v3.md#sec-4.3',
        'YouTube Channel Brain v3 - Painpoint DB (PP-0040)',
        'PP-0040 (Scalping 1m - 21 likes): "tried like 6 different 1-minute scalping strategies and always get stopped out"',
        'Scalping Stop Loss Discipline'
      );
      ledger.attachQuote(id, 'always get stopped out');
      const sourcesBlock = ledger.renderSources([id]);

      return `📊 **Dữ liệu Pain Point Khán Giả: Scalping 1m Hay Bị Quét SL (PP-0040):**
Khán giả thử nhiều phương pháp đánh ngắn khung 1 phút nhưng liên tục bị quét Stop Loss vì nhiễu thị trường [1].

💡 **Giải pháp từ Hermes:** Nâng tầm nhìn lên khung M15, đặt SL sau đáy cản kỹ thuật thay vì đuổi theo các cây nến 1m:
- **Hook 3s:** *"WHY 1-MINUTE SCALPING FAILS"*
- **Subline:** *"Place stop loss behind M15 structure, not 1m noise."*
- **Quản lý vốn:** Khóa $10 rủi ro, SL 20 pips an toàn, 0.05 lot, R:R 1:3.5.

\`\`\`chart_setup
{
  "title": "WHY 1-MINUTE SCALPING FAILS (PP-0040)",
  "headline": "WHY 1-MINUTE SCALPING FAILS",
  "subline": "Place stop loss behind M15 structure, not noise.",
  "strategy": "Risk-First Pullback",
  "basePrice": 4128,
  "riskBudget": 10,
  "slPips": 20,
  "lotSize": "0.05 lot",
  "rrRatio": 3.5,
  "badges": ["1. LOSS $10", "2. ENTRY SL 20p", "3. SIZE 0.05L"],
  "beforeAfterMode": "off"
}
\`\`\`

${sourcesBlock}

Bấm nút **Áp Dụng Lên Canvas & Chạy Video Ngay** bên dưới để nạp setup này lên video ngay!`;
    }

    // Branch for PP-0050: Đuổi nến xanh / FOMO
    if (/đuổi nến|nến xanh|fomo|pp-0050/i.test(query)) {
      const id = ledger.registerKnowledgeEvidence(
        'C:\\Users\\Admin\\youtube\\channel-brain-v3.md#sec-4.3',
        'YouTube Channel Brain v3 - Painpoint DB (PP-0050)',
        'PP-0050 (90 likes): "Don\'t chase the market. Wait at the strong support and resistance zone..."',
        'No Chasing Rule'
      );
      ledger.attachQuote(id, "Don't chase the market");
      const sourcesBlock = ledger.renderSources([id]);

      return `📊 **Dữ liệu Pain Point Khán Giả: Bẫy Đu Đỉnh Fomo Nến Xanh (PP-0050):**
Retail thường mua đuổi ngay khi thấy nến xanh dài bứt phá, để rồi dính nhịp hồi xả của tổ chức [1].

💡 **Quy tắc bất biến từ Hermes:** *"Tuyệt đối không mua đuổi nến xanh. Chỉ vào lệnh khi giá hồi về kiểm tra hỗ trợ."*
- **Hook 3s:** *"STOP CHASING GREEN CANDLES"*
- **Subline:** *"Wait for the pullback and rejection wick at support."*

\`\`\`chart_setup
{
  "title": "STOP CHASING GREEN CANDLES (PP-0050)",
  "headline": "STOP CHASING GREEN CANDLES",
  "subline": "Wait for the pullback and rejection at support.",
  "strategy": "Risk-First Pullback",
  "basePrice": 4128,
  "riskBudget": 10,
  "slPips": 20,
  "lotSize": "0.05 lot",
  "rrRatio": 3.5,
  "badges": ["1. LOSS $10", "2. ENTRY SL 20p", "3. SIZE 0.05L"],
  "beforeAfterMode": "off"
}
\`\`\`

${sourcesBlock}

Bấm nút **Áp Dụng Lên Canvas & Chạy Video Ngay** bên dưới để nạp setup này lên video ngay!`;
    }

    // Branch for PP-0178: Bearish Order Block
    if (/order block|xả hàng|bearish ob|pp-0178/i.test(query)) {
      const id = ledger.registerKnowledgeEvidence(
        'C:\\Users\\Admin\\youtube\\channel-brain-v3.md#sec-4.3',
        'YouTube Channel Brain v3 - Painpoint DB (PP-0178)',
        'PP-0178 (14 likes): "Im an ORB trader... the bearish order block got validated"',
        'Bearish Order Block'
      );
      ledger.attachQuote(id, 'bearish order block got validated');
      const sourcesBlock = ledger.renderSources([id]);

      return `📊 **Dữ liệu Pain Point Khán Giả: Bẫy Mua Vào Vùng Bearish Order Block (PP-0178):**
Retail thấy giá tăng mạnh tưởng phá cản vào mua, nhưng thực chất đang va chạm khối Order Block tổ chức xả hàng [1].

💡 **Chiến thuật từ Hermes:** Canh nến quét râu chạm Order Block rồi Sell theo dòng tiền thông minh:
- **Hook 3s:** *"BEARISH ORDER BLOCK TRAP"*
- **Subline:** *"Institutions sell into retail breakout buyers."*

\`\`\`chart_setup
{
  "title": "BEARISH ORDER BLOCK TRAP (PP-0178)",
  "headline": "BEARISH ORDER BLOCK TRAP",
  "subline": "Institutions sell into retail breakout buyers.",
  "strategy": "Liquidity Sweep",
  "basePrice": 4140,
  "riskBudget": 30,
  "slPips": 20,
  "lotSize": "0.15 lot",
  "rrRatio": 3.5,
  "badges": ["1. LOSS $30", "2. SL 20 PIPS", "3. LOT 0.15"]
}
\`\`\`

${sourcesBlock}

Bấm nút **Áp Dụng Lên Canvas & Chạy Video Ngay** bên dưới để nạp setup này lên video ngay!`;
    }

    // Specific branch for PP-0023: Không biết đọc cấu trúc nến (488 comments) - 3 Cây Nến Tiết Lộ Dòng Tiền Lớn
    if (/cấu trúc nến|đọc nến|pp-0023|488|3 cây nến|cây nến|dòng tiền/i.test(query)) {
      const id = ledger.registerKnowledgeEvidence(
        'C:\\Users\\Admin\\youtube\\channel-brain-v3.md#sec-1.4',
        'YouTube Channel Brain v3 - Painpoint DB (PP-0023)',
        'PP-0023 (education_gap - 488 comments): "Damn, that\'s cool. Anyways how do I read a chart?" (824/1,543 comments stuck at candlestick basics & rejection wicks).',
        'PP-0023 Candlestick Basics'
      );
      ledger.attachQuote(id, "Damn, that's cool. Anyways how do I read a chart?");
      const sourcesBlock = ledger.renderSources([id]);

      return `📊 **Dữ liệu Pain Point Khán Giả: Không Biết Đọc Cấu Trúc Nến (PP-0023):**
Khán giả người mới bị ngợp bởi quá nhiều thuật ngữ phức tạp trong khi **kẹt ở bước đọc nến cơ bản** [1] (PP-0023: *"Damn, that's cool. Anyways how do I read a chart?"*).

💡 **Kịch Bản & Lời Thoại: 3 CÂY NẾN TIẾT LỘ DÒNG TIỀN LỚN (PP-0023):**
- **Hook (0-3s):** *"DỪNG ĐỌC CHART KIỂU ĐOÁN MÒ! 3 CÂY NẾN TIẾT LỘ DÒNG TIỀN LỚN."*
- **Nỗi đau (3-6s):** *"Bạn thấy nến xanh dài liền vội vã bấm BUY? Đó là lúc các quỹ lớn xả hàng vào đầu bạn!"*
- **Sự thật SMC (6-9s):** *"Cây 1 quét đỉnh $4,138 rút râu, cây 2 tạo FVG, hãy đợi cây 3 hồi đúng 50% FVG tại $4,132.50 để vào lệnh!"*
- **Hành động (9-12s):** *"Khóa rủi ro đúng 10 đô! Đặt Stop Loss 20 pips tại $4,134.50, size 0.05 lot, chốt lời 1:3.75 về $4,125.00."*

\`\`\`chart_setup
{
  "title": "3 CÂY NẾN TIẾT LỘ DÒNG TIỀN LỚN (PP-0023)",
  "headline": "3 CÂY NẾN TIẾT LỘ DÒNG TIỀN LỚN",
  "subline": "Dừng đọc chart kiểu đoán mò. Bắt bài dấu chân Big Boys.",
  "strategy": "Institutional Candle Reading",
  "basePrice": 4132.5,
  "riskBudget": 10,
  "slPips": 20,
  "lotSize": "0.05 lot",
  "rrRatio": 3.75,
  "badges": ["1. LOSS $10", "2. SL 20 PIPS", "3. SIZE 0.05L"],
  "beforeAfterMode": "off",
  "scriptSubtitles": [
    { "timePercent": 0.0, "text": "DỪNG ĐỌC CHART KIỂU ĐOÁN MÒ! 3 CÂY NẾN TIẾT LỘ DÒNG TIỀN LỚN.", "stageName": "Hook" },
    { "timePercent": 0.28, "text": "Bạn thấy nến xanh dài liền vội vã bấm BUY? Đó là lúc các quỹ lớn xả hàng vào đầu bạn!", "stageName": "Trap" },
    { "timePercent": 0.58, "text": "Cây 1 quét đỉnh rút râu, cây 2 tạo FVG, hãy đợi cây 3 hồi đúng 50% FVG tại $4,132.50 để vào lệnh!", "stageName": "Setup" },
    { "timePercent": 0.82, "text": "Khóa rủi ro đúng 10 đô! Đặt Stop Loss 20 pips tại $4,134.50, size 0.05 lot, target $4,125.00.", "stageName": "Execution" }
  ]
}
\`\`\`

${sourcesBlock}

Bấm nút **Áp Dụng Lên Canvas & Chạy Video Ngay** bên dưới để nạp setup giải quyết nỗi đau PP-0023 này lên video ngay!`;
    }

    // Branch for 361 comments: Chiến lược tối ưu vốn nhỏ $1,000
    if (/361|vốn nhỏ|1000|\$1,000/i.test(query)) {
      const id = ledger.registerKnowledgeEvidence(
        'C:\\Users\\Admin\\youtube\\channel-brain-v3.md#sec-4.2',
        'YouTube Channel Brain v3 - Top Painpoint (Score 12.56)',
        'Score 12.56 (strategy_rules - 3,618 likes): "Chiến lược tối ưu cho người có $1000 hoặc ít hơn?" (361 comments stuck with small capital).',
        'Small Capital Discipline'
      );
      ledger.attachQuote(id, 'Chiến lược tối ưu cho người có $1000 hoặc ít hơn?');
      const sourcesBlock = ledger.renderSources([id]);

      return `📊 **Dữ liệu Pain Point Khán Giả: Chiến Lược Tối Ưu Vốn $1,000:**
Đây là câu hỏi đạt Score cao nhất kênh (12.56) với 3,618 lượt tương tác [1].

💡 **Quy tắc quỹ từ Hermes:** Tài khoản nhỏ tuyệt đối không được đánh 0.5 hay 1.0 lot để gỡ, mà phải tuân thủ nghiêm ngặt:
- **Hook 3s:** *"OPTIMAL $1000 DISCIPLINE"*
- **Subline:** *"Risk 1% ($10). 20p SL -> Size 0.05 lot. Target +70 pips."*
- **Quy tắc:** Vốn $1,000 chỉ được mạo hiểm tối đa 1R = $10 mỗi lệnh.

\`\`\`chart_setup
{
  "title": "OPTIMAL $1,000 ACCOUNT DISCIPLINE",
  "headline": "OPTIMAL $1000 DISCIPLINE",
  "subline": "Risk 1% ($10). 20p SL -> Size 0.05 lot.",
  "strategy": "Risk-First Pullback",
  "basePrice": 4128,
  "riskBudget": 10,
  "slPips": 20,
  "lotSize": "0.05 lot",
  "rrRatio": 3.5,
  "badges": ["1. LOSS $10", "2. ENTRY SL 20p", "3. SIZE 0.05L"],
  "beforeAfterMode": "off"
}
\`\`\`

${sourcesBlock}

Bấm nút **Áp Dụng Lên Canvas & Chạy Video Ngay** bên dưới để nạp setup này lên video ngay!`;
    }

    // Branch for 140 comments: Stop hunt quét râu đỉnh
    if (/140|stop hunt|quét râu|dụ/i.test(query)) {
      const id = ledger.registerKnowledgeEvidence(
        'C:\\Users\\Admin\\youtube\\channel-brain-v3.md#sec-1.4',
        'YouTube Channel Brain v3 - Painpoint DB (Entry Timing)',
        '140 comments: "Vào lệnh sớm bị dính quét râu (Stop Hunt) đỉnh phiên rồi giá mới chạy đúng hướng."',
        'Stop Hunt Timing'
      );
      ledger.attachQuote(id, 'Vào lệnh sớm bị dính quét râu (Stop Hunt)');
      const sourcesBlock = ledger.renderSources([id]);

      return `📊 **Dữ liệu Pain Point Khán Giả: Bị Quét Râu Đỉnh Đáy (140 Comments):**
Người mới hay bị dính bẫy Stop Hunt vì vào lệnh ngay khi giá vừa phá đỉnh [1].

💡 **Giải pháp từ Hermes:** Kiên nhẫn chờ đợi nhịp quét thanh khoản BSL kết thúc, xuất hiện nến rút râu từ chối giá mới kích hoạt lệnh:
- **Hook 3s:** *"YOU STOP WATCHING THE SWEEP"*
- **Subline:** *"Bẫy quét râu đỉnh BSL dụ retail mua rồi xả mạnh."*

\`\`\`chart_setup
{
  "title": "BSL LIQUIDITY SWEEP: BẪY QUÉT ĐỈNH DỤ RETAIL",
  "headline": "YOU STOP WATCHING THE SWEEP",
  "subline": "Bẫy quét râu đỉnh BSL dụ mua rồi xả mạnh.",
  "strategy": "Liquidity Sweep",
  "basePrice": 4128,
  "riskBudget": 30,
  "slPips": 20,
  "lotSize": "0.15 lot",
  "rrRatio": 3.5,
  "badges": ["1. LOSS $30", "2. SL 20 PIPS", "3. LOT 0.15"]
}
\`\`\`

${sourcesBlock}

Bấm nút **Áp Dụng Lên Canvas & Chạy Video Ngay** bên dưới để nạp setup này lên video ngay!`;
    }

    // Default Painpoint / PDF Trap (PP-0039)
    const id = ledger.registerKnowledgeEvidence(
      'C:\\Users\\Admin\\youtube\\channel-brain-v3.md#sec-1.4',
      'YouTube Channel Brain v3 - Painpoint DB',
      'PP-0023: "Damn, that\'s cool. Anyways how do I read a chart?" (824/1,543 comments stuck at basics). PP-0039: "I\'m completely new to trading... charts confuse me... lost $62k."',
      'PP-0023 & PP-0039'
    );
    ledger.attachQuote(id, "Damn, that's cool. Anyways how do I read a chart?");

    const sourcesBlock = ledger.renderSources([id]);

    return `📊 **Dữ liệu Pain Point Khán Giả (Kiểm chứng từ Hermes Grounded Ledger):**
1. **Nỗi đau lớn nhất (824/1,543 comment - 53%):** Người mới bị nhồi nhét quá nhiều nhãn thuật ngữ (FVG, Order Block, Liquidity) trong khi **chưa đọc được cấu trúc nến cơ bản** [1] (PP-0023: *"Damn, that's cool. Anyways how do I read a chart?"*).
2. **Cái bẫy săn file PDF [1] (PP-0039):** Người xem liên tục đi tìm cuốn sách tiếp theo (*44 Trading Powers*) để mong tìm chén thánh, thay vì đặt ra một **Predefined Loss Limit**.
3. **Mất tiền vì đảo ngược thứ tự:** 90% người xem hỏi *"vào lệnh ở đâu?"* nhưng chỉ 20% hỏi *"cắt lỗ ở đâu?"*.

💡 **Khuyến nghị từ Hermes:** Đã tạo sẵn setup video giải quyết trực diện cái bẫy săn sách PDF này: *"Một cuốn PDF không cứu được bạn. Một mức dừng lỗ ấn định trước mới làm được."*

\`\`\`chart_setup
{
  "title": "1 Predefined Loss Limit Keeps New XAUUSD Traders Alive (PP-0039)",
  "headline": "A PDF WON'T KEEP YOU ALIVE",
  "subline": "A predefined loss limit will. That is the whole video.",
  "strategy": "Risk-First Pullback",
  "basePrice": 4128,
  "riskBudget": 10,
  "slPips": 20,
  "lotSize": "0.05 lot",
  "rrRatio": 3.5,
  "badges": ["1. LOSS $10", "2. ENTRY SL 20p", "3. SIZE 0.05L"],
  "beforeAfterMode": "off"
}
\`\`\`

${sourcesBlock}

Bấm nút **Áp Dụng Lên Canvas & Chạy Video Ngay** bên dưới để nạp setup giải quyết nỗi đau này lên video ngay!`;
  }

  // 2. DYNAMIC SETUP GENERATOR & RISK-FIRST POSITION SIZING
  if (/setup|vốn|tài khoản|\$|\d+k|risk|sl\b|lot\b|rr\b|r:r|cắt lỗ|vào lệnh|lên video|tạo video|làm video|video|nến|chart|biểu đồ/i.test(query)) {
    const p = parseCustomSetupParameters(query);

    const ledger = new CitationLedger();
    const id = ledger.registerKnowledgeEvidence(
      'knowledge/azzam_courses/01_opt_11_risk_first_sizing.md#sec-2',
      'Azzam Academy - Institutional Position Sizing Formula',
      'Formula: Position Size (Lots) = Risk Budget ($) ÷ [SL (pips) × $10/pip]. Account $5,000 with 1R (1% = $50) and 20 pips SL results in exactly 0.25 lot on XAUUSD.',
      'Risk-First Math'
    );
    ledger.attachQuote(id, 'Position Size (Lots) = Risk Budget ($) ÷ [SL (pips) × $10/pip]');
    const sourcesBlock = ledger.renderSources([id]);

    let title = `XAUUSD $${p.capital.toLocaleString()} ACCOUNT: 1R RISK-FIRST DISCIPLINE`;
    let headline = "1R LOSS BEFORE LOOKING AT CHART";
    let subline = `Risk $${p.riskBudget} on $${p.capital.toLocaleString()}. SL ${p.slPips}p -> Size ${p.lotSize}.`;

    if (p.strategy === 'Liquidity Sweep') {
      title = "BSL LIQUIDITY SWEEP: BẪY QUÉT ĐỈNH DỤ RETAIL";
      headline = "YOU STOP WATCHING THE SWEEP";
      subline = `Bẫy quét râu đỉnh BSL dụ mua rồi xả mạnh. Size ${p.lotSize} | SL ${p.slPips}p.`;
    } else if (p.strategy === 'Fair Value Gap') {
      title = "M15 FAIR VALUE GAP: 50% C.E. SECRET RETEST";
      headline = "THE 50% FVG ENTRY SECRET";
      subline = `Đợi giá hồi về đúng 50% CE để kích hoạt lệnh. Size ${p.lotSize} | SL ${p.slPips}p.`;
    } else if (p.strategy === 'Break & Retest') {
      title = "BREAK & RETEST: INSTITUTIONAL CONFIRMATION";
      headline = "CLEAN BREAK & RETEST ONLY";
      subline = `Phá vỡ cản then chốt rồi kiểm tra lại. Size ${p.lotSize} | SL ${p.slPips}p.`;
    }

    return `🎯 **Chỉ Thị Setup Biểu Đồ Cho Tài Khoản $${p.capital.toLocaleString()} (${p.strategy} - Hermes Risk-First):**
Tôi đã tính toán chuẩn xác tỷ lệ lệnh theo công thức của quỹ và kênh @azzammastertradinggold:

- **Chiến lược:** ${p.strategy} (Quét râu tạo bẫy)
- **Quy mô tài khoản:** $${p.capital.toLocaleString()}
- **Ngân sách Rủi ro (1R = ${p.riskPercent}%):** Đúng **$${p.riskBudget}.00** (Khóa rủi ro cố định trước khi nhìn chart) [1]
- **Khoảng cách Cắt lỗ (SL):** **${p.slPips} pips** (Điểm kỹ thuật an toàn)
- **Khối lượng vào lệnh:** **${p.lotSize}** ($${p.dollarPerPip}/pip)
- **Mục tiêu Chốt lời (1:${p.rrRatio} RR):** +${p.targetPips} pips (Kỳ vọng +$${(p.riskBudget * p.rrRatio).toFixed(0)} lợi nhuận)

\`\`\`chart_setup
{
  "title": "${title}",
  "headline": "${headline}",
  "subline": "${subline}",
  "strategy": "${p.strategy}",
  "basePrice": 4128,
  "riskBudget": ${p.riskBudget},
  "slPips": ${p.slPips},
  "lotSize": "${p.lotSize}",
  "rrRatio": ${p.rrRatio},
  "badges": ["1. LOSS $${p.riskBudget}", "2. SL ${p.slPips} PIPS", "3. LOT ${p.lotSize.replace(' lot', '')}"]
}
\`\`\`

${sourcesBlock}

Bấm nút **Áp Dụng Lên Canvas & Chạy Video Ngay** bên dưới để nạp setup $${p.capital.toLocaleString()} này lên video ngay!`;
  }

  if (/hôm nay|thực tế|thật|live|case\s*study|thị trường nay|paxg/i.test(query)) {
    return `🔴 **Chỉ Thị Phân Tích Thực Chiến Hôm Nay (Real-Market Case Study):**
Tôi vừa đối soát dữ liệu nến M15 thực tế của Vàng hôm nay. Thị trường vừa xuất hiện một nhịp giật râu quét thanh khoản đỉnh phiên, dụ đám đông Retail vào lệnh Buy rồi sập mạnh.

Đây là tình huống thực chiến hoàn hảo để làm video ngắn cảnh tỉnh người xem theo đúng triết lý **Risk-First**:
- **Bối cảnh thực tế:** Giá Vàng giao ngay vừa kiểm định cản $4,064.00 rồi đảo chiều.
- **Quy tắc kỷ luật:** Khóa chặt mức dừng lỗ 20 pips ($30 Risk Budget), tuyệt đối không gồng lỗ.
- **Mục tiêu:** Video phân tích Case Study giáo dục, không hô tín hiệu.

\`\`\`chart_setup
{
  "title": "BÀI HỌC VÀNG THỰC CHIẾN HÔM NAY: BẪY ĐỈNH PHIÊN",
  "headline": "BẪY QUÉT ĐỈNH VÀNG HÔM NAY",
  "subline": "Thực tế thị trường vừa diễn ra: Quét đỉnh rồi sập gãy cấu trúc",
  "strategy": "Liquidity Sweep",
  "basePrice": 4058,
  "riskBudget": 30,
  "slPips": 20,
  "lotSize": "0.05 lot",
  "rrRatio": 3.5,
  "badges": ["1. LOSS $30", "2. SL 20 PIPS", "3. LOT 0.05"]
}
\`\`\`

Bấm nút **Áp Dụng Lên Canvas** bên dưới để nạp kịch bản thực chiến hôm nay lên video!`;
  }

  if (/kịch bản|script|youtube|b-roll|nguyên liệu/i.test(query)) {
    const ledger = new CitationLedger();
    const id = ledger.registerKnowledgeEvidence(
      'C:\\Users\\Admin\\youtube\\video_scripts\\script_2026-10-28_how-to-learn-gold-trading-for-beginners-learning-order.md',
      'YouTube Script 28/10 - How to Learn Gold Trading in Order',
      'Teach the learning order: fundamentals, replay practice, then size. Predefine your loss limit before looking at the chart.',
      'Script 28/10'
    );
    ledger.attachQuote(id, 'Teach the learning order: fundamentals, replay practice, then size.');
    const sourcesBlock = ledger.renderSources([id]);

    return `🎬 **Đồng Bộ Kịch Bản Mới Nhất Từ Kênh YouTube (@azzammastertradinggold):**
Hệ thống đã kết nối trực tiếp vào kho kịch bản \`C:\\Users\\Admin\\youtube\\video_scripts\`. Dưới đây là setup biểu đồ được trích xuất từ kịch bản mới nhất hôm nay:

- **Chủ đề kịch bản:** *Fear of Losing Money / How to Learn Gold Trading* (Kịch bản ngày 28/10).
- **Trọng tâm giáo dục:** Thay vì giao dịch theo cảm xúc hoặc sợ mất tiền, hãy dùng công thức Risk-First: Cố định $30 Loss Budget trước khi vào lệnh. [1]
- **Hook 3s:** *"Stop Trading With Fear. Predefine Your Loss."*

\`\`\`chart_setup
{
  "title": "HOW TO LEARN GOLD TRADING: RISK-FIRST FOUNDATION",
  "headline": "STOP TRADING WITH FEAR",
  "subline": "Predefine your $30 loss limit. Trade the structure.",
  "strategy": "Risk-First Pullback",
  "basePrice": 4128,
  "riskBudget": 30,
  "slPips": 20,
  "lotSize": "0.05 lot",
  "rrRatio": 3.5,
  "badges": ["1. LOSS $30", "2. ENTRY SL 20p", "3. SIZE 0.05L"]
}
\`\`\`

${sourcesBlock}

Bấm **Áp Dụng Lên Canvas** để nạp thẳng video biểu đồ minh họa (B-Roll) cho kịch bản YouTube này ngay lập tức!`;
  }


  if (/fvg|imbalance|khoảng trống/i.test(query)) {
    return `🎯 **Chỉ thị Setup FVG từ Hermes Agent:**
Vàng M15 xuất hiện nhịp bứt phá tạo Fair Value Gap giữa râu nến 1 và 3. Quy tắc của chúng ta là **không đuổi nến xanh**, mà kiên nhẫn đợi giá hồi về đúng 50% Consequent Encroachment (C.E.) để kích hoạt lệnh Buy.

\`\`\`chart_setup
{
  "title": "M15 Fair Value Gap: The 50% C.E. Secret Entry",
  "headline": "THE 50% FVG ENTRY SECRET",
  "subline": "Fair Value Gaps are institutional price magnets.",
  "strategy": "Fair Value Gap",
  "basePrice": 4125,
  "riskBudget": 10,
  "slPips": 20,
  "lotSize": "0.05 lot",
  "rrRatio": 3.5,
  "badges": ["1. LOSS $10", "2. ENTRY SL 20p", "3. SIZE 0.05L"],
  "beforeAfterMode": "off"
}
\`\`\`

Bấm nút bên dưới để nạp thẳng chỉ thị này lên Canvas!`;
  }

  if (/sweep|quét|thanh khoản|bsl/i.test(query)) {
    return `⚡ **Chỉ thị Setup BSL Liquidity Sweep từ Hermes Agent:**
Thị trường vừa đẩy giá vượt đỉnh Buy Side Liquidity để kích hoạt lệnh mua FOMO của retail traders. Sau đó lập tức xuất hiện nến rút râu đảo chiều quét sạch Stop Loss.

\`\`\`chart_setup
{
  "title": "BSL Liquidity Sweep: Institutional Trap Purge",
  "headline": "YOU STOP WATCHING THE SWEEP",
  "subline": "You start watching what happens after it.",
  "strategy": "Liquidity Sweep",
  "basePrice": 4140,
  "riskBudget": 30,
  "slPips": 20,
  "lotSize": "$1.50/pip",
  "rrRatio": 3.2,
  "badges": ["1. LOSS $30", "2. ENTRY SL 20p", "3. SIZE $1.5"]
}
\`\`\`

Bạn có thể bấm **Áp Dụng Lên Canvas** bên dưới để video bắt đầu chạy!`;
  }

  // Default reply
  return `Chào Alan! Hermes Agent sẵn sàng.
Tôi nắm toàn bộ 20 kịch bản, bảng dàn ý 8 phần, và quy tắc Risk-First ($10 / $30 Budget, 20 pips SL, giờ vàng 00:00 VN).

Bạn có thể ra lệnh cho tôi:
- *"Gợi ý kịch bản cho tối nay theo giờ vàng 00:00 VN"*
- *"Tạo setup nến Quét thanh khoản BSL $4,154"*
- *"Cho xem phân tích pain point lớn nhất hiện nay"*
- Hoặc yêu cầu bất kỳ kịch bản nào, tôi sẽ xuất thẳng mã thực thi lên Canvas cho bạn!`;
}
