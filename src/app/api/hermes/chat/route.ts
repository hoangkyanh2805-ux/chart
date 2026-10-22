import { NextRequest, NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const HERMES_KNOWLEDGE_SYSTEM_PROMPT = `You are Hermes Agent — the Elite Senior Financial Video Director and Learner-Care Trading Coach for @azzammastertradinggold.
You are running as the Master Copilot embedded directly inside ChartAnimator.io.

YOUR WORKSPACE GROUND TRUTH & KNOWLEDGE BASE:
1. Channel: @azzammastertradinggold.
2. Core Philosophy: Risk-First (Define loss BEFORE looking at charts. Stop loss came first, entry came second. Education gap: traders learn entries but ignore loss limits).
3. Database of Audience Pain Points:
   - PP-0023: "Damn, that's cool. Anyways how do I read a chart?" (824/1,543 comments stuck at basics).
   - PP-0039: "I'm completely new to trading... charts confuse me... lost $62k."
   - PP-0020: "recorded charts... easy when you already know where it moves."
   - PDF Trap: Traders collecting 44 Trading Powers by Lucian thinking the next PDF saves them, instead of writing a predefined loss limit.
4. Mathematical Formulas:
   - Risk Budget: $10 = 1R (1% on $1,000) or $30 budget.
   - Stop Loss: 20 pips at defensible technical level (HTF uptrend + LTF pullback to support).
   - Position Sizing: Size = Budget ÷ SL distance ($10 ÷ 20 pips = 0.05 lot; $30 ÷ 20 pips = $1.50/pip).
   - Risk:Reward: minimum 1:3.0 to 1:3.5 RR.
   - XAUUSD Current Gold Base Price: ~$4,128.00.
5. Golden Publishing Hours: Primary: 00:00 VN (avg 40,393 views). Secondary: 02:00, 07:00 VN.
6. Compliance (8 NEVERs): Always include "EDUCATIONAL ILLUSTRATION — NOT A TRADE RECOMMENDATION", never guarantee profits, never call live signals.

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
  "badges": ["1. LOSS $10", "2. ENTRY SL 20p", "3. SIZE 0.05L"]
}
\`\`\`
ChartAnimator will automatically detect this block and offer the user a 1-click button to execute it directly onto the Canvas!`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Thiếu tin nhắn người dùng' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Convert messages to Gemini format
    const contents = [
      {
        role: 'user',
        parts: [{ text: HERMES_KNOWLEDGE_SYSTEM_PROMPT }],
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

    if (apiKey) {
      try {
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

function generateHermesLocalReply(userQuery: string): string {
  const query = userQuery.toLowerCase();

  if (/pain\s*point|khán giả|nỗi đau|comment/i.test(query)) {
    return `📊 **Dữ liệu Pain Point Khán Giả (Từ Master Database của Hermes):**
1. **Nỗi đau lớn nhất (824/1,543 comment - 53%):** Người mới bị nhồi nhét quá nhiều nhãn thuật ngữ (FVG, Order Block, Liquidity) trong khi **chưa đọc được cấu trúc nến cơ bản** (PP-0023: *"Damn, that's cool. Anyways how do I read a chart?"*).
2. **Cái bẫy săn file PDF (PP-0039):** Người xem liên tục đi tìm cuốn sách tiếp theo (*44 Trading Powers*) để mong tìm chén thánh, thay vì đặt ra một **Predefined Loss Limit**.
3. **Mất tiền vì đảo ngược thứ tự:** 90% người xem hỏi *"vào lệnh ở đâu?"* nhưng chỉ 20% hỏi *"cắt lỗ ở đâu?"*.

💡 **Khuyến nghị từ Hermes:** Đã tạo sẵn setup video giải quyết trực diện nỗi đau lớn nhất này: *"Một cuốn PDF không cứu được bạn. Một mức dừng lỗ ấn định trước mới làm được."*

\`\`\`chart_setup
{
  "title": "1 Predefined Loss Limit Keeps New XAUUSD Traders Alive (PP-0023)",
  "headline": "A PDF WON'T KEEP YOU ALIVE",
  "subline": "A predefined loss limit will. That is the whole video.",
  "strategy": "Risk-First Pullback",
  "basePrice": 4128,
  "riskBudget": 10,
  "slPips": 20,
  "lotSize": "0.05 lot",
  "rrRatio": 3.5,
  "badges": ["1. LOSS $10", "2. ENTRY SL 20p", "3. SIZE 0.05L"]
}
\`\`\`

Bấm nút **Áp Dụng Lên Canvas** bên dưới để nạp setup giải quyết nỗi đau này lên video ngay!`;
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
  "badges": ["1. LOSS $10", "2. ENTRY SL 20p", "3. SIZE 0.05L"]
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
