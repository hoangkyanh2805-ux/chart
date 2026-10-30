import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      category = 'Kịch bản',
      problem = '',
      desired = '',
      author = 'Team Member',
      image = null,
      ticketId = `TK-${Date.now().toString().slice(-4)}`,
    } = body;

    if (!problem.trim() || !desired.trim()) {
      return NextResponse.json(
        { error: 'Vui lòng nhập đầy đủ vấn đề gặp phải và kết quả mong muốn.' },
        { status: 400 }
      );
    }

    // Format clean-room SPEC markdown
    const specMarkdown = `# SPEC: [${ticketId}] Yêu Cầu Chỉnh Sửa & Feedback Team
**Ngày tạo:** ${new Date().toLocaleString('vi-VN')}
**Người gửi:** ${author}
**Phân loại:** ${category}

---

## 1. Vấn Đề Gặp Phải (User Problem)
> "${problem.trim()}"

## 2. Kết Quả Mong Muốn (Desired Outcome / Behavior)
> "${desired.trim()}"

## 3. Quy Chuẩn Kỹ Thuật & Bất Biến (Financial & System Invariants)
- **Tỷ lệ Risk:Reward:** Tối thiểu 1:3.5.
- **Quản trị Rủi ro (Risk Budget):** Cố định $10 hoặc $30 cho mã XAUUSD M15.
- **Bố cục hiển thị:** An toàn Safe-Zone 9:16 (không đè Dynamic Island Notch, không đè hộp phụ đề).
- **Âm thanh & Phụ đề:** Khớp chuẩn pha thoại và nến hoạt họa.

## 4. Tiêu Chí Nghiệm Thu (Acceptance Criteria)
- [ ] Vấn đề "${problem.trim().slice(0, 60)}..." được giải quyết hoàn toàn.
- [ ] Bộ kiểm thử \`npm test\` (114 bài test) PASS 100%.
- [ ] Giao diện hoạt động mượt mà trên môi trường Web Vercel.

---
*Tự động sinh bởi ChartAnimator Ticket System & Hermes Native Orchestrator.*
`;

    // Attempt to save to livrables/specs/ if accessible on filesystem
    try {
      const specsDir = path.join(process.cwd(), 'livrables', 'specs');
      if (!fs.existsSync(specsDir)) {
        fs.mkdirSync(specsDir, { recursive: true });
      }
      const safeCategory = category.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      const fileName = `SPEC-${ticketId}-${safeCategory}.md`;
      const filePath = path.join(specsDir, fileName);
      fs.writeFileSync(filePath, specMarkdown, 'utf8');
    } catch (fsErr) {
      // In serverless read-only filesystem environments, continue gracefully
      console.warn('Filesystem write skipped in serverless environment:', fsErr);
    }

    return NextResponse.json({
      success: true,
      ticketId,
      specMarkdown,
      formattedSummary: `[TICKET FEEDBACK ${ticketId}]
- Phần cần sửa: ${category}
- Vấn đề gặp phải: ${problem}
- Mong muốn: ${desired}
- Người gửi: ${author}`,
    });
  } catch (error: any) {
    console.error('Feedback submission error:', error);
    return NextResponse.json(
      { error: error.message || 'Lỗi xử lý ticket' },
      { status: 500 }
    );
  }
}
