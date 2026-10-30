import { describe, it, expect } from 'vitest';
import { POST } from '../src/app/api/feedback/route';
import { NextRequest } from 'next/server';

describe('Team Ticket & Feedback API', () => {
  it('should validate required fields and return 400 when missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/feedback', {
      method: 'POST',
      body: JSON.stringify({ problem: '', desired: '' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it('should generate structured clean-room SPEC markdown upon valid ticket submission', async () => {
    const req = new NextRequest('http://localhost:3000/api/feedback', {
      method: 'POST',
      body: JSON.stringify({
        ticketId: 'TK-8899',
        category: 'Giọng đọc',
        problem: 'Chữ phụ đề chạy hơi nhanh so với nến',
        desired: 'Kéo dài thời gian đọc Stage 3 thêm 1.5 giây',
        author: 'Trader Tuấn',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.success).toBe(true);
    expect(data.ticketId).toBe('TK-8899');
    expect(data.formattedSummary).toContain('[TICKET FEEDBACK TK-8899]');
    expect(data.formattedSummary).toContain('- Phần cần sửa: Giọng đọc');
    expect(data.formattedSummary).toContain('- Vấn đề gặp phải: Chữ phụ đề chạy hơi nhanh so với nến');
    expect(data.formattedSummary).toContain('- Mong muốn: Kéo dài thời gian đọc Stage 3 thêm 1.5 giây');
    expect(data.specMarkdown).toContain('# SPEC: [TK-8899]');
    expect(data.specMarkdown).toContain('## 1. Vấn Đề Gặp Phải (User Problem)');
    expect(data.specMarkdown).toContain('## 2. Kết Quả Mong Muốn (Desired Outcome / Behavior)');
  });
});
