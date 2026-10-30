import { describe, it, expect } from 'vitest';
import { GET as getSuggestions } from '../src/app/api/hermes/suggestions/route';
import { POST as chatHermes } from '../src/app/api/hermes/chat/route';
import { NextRequest } from 'next/server';

describe('Hermes Dynamic Live Suggestions & Grounded Retrieval Protocol', () => {
  it('should return live suggestions grouped into 4 distinct categories with counts', async () => {
    const req = new NextRequest('http://localhost:3000/api/hermes/suggestions');
    const res = await getSuggestions(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('activeCounts');
    expect(data.activeCounts.scripts).toBeGreaterThan(0);
    expect(data.activeCounts.painpoints).toBeGreaterThan(0);
    expect(data.activeCounts.courses).toBeGreaterThan(0);
    expect(data.activeCounts.live).toBeGreaterThan(0);

    expect(data.categories.scripts.length).toBeGreaterThan(0);
    expect(data.categories.painpoints.length).toBeGreaterThan(0);
    expect(data.categories.courses.length).toBeGreaterThan(0);
    expect(data.categories.live.length).toBeGreaterThan(0);

    // Verify scripts items contain title/labels
    const scriptFirst = data.categories.scripts[0];
    expect(scriptFirst.label).toContain('🎬');
    expect(scriptFirst.prompt.length).toBeGreaterThan(10);

    // Verify painpoint items reflect real audience data
    const painFirst = data.categories.painpoints[0];
    expect(painFirst.label).toContain('📊');
    expect(painFirst.label).toContain('người');

    // Verify courses items
    const courseFirst = data.categories.courses[0];
    expect(courseFirst.label).toContain('🎓');

    // Verify live items
    const liveFirst = data.categories.live[0];
    expect(liveFirst.label).toContain('🔴');
  });

  it('should return grounded citation with Sources Ledger when querying a YouTube script suggestion', async () => {
    const req = new NextRequest('http://localhost:3000/api/hermes/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: "Lên setup biểu đồ cho kịch bản 28/10 'How to Learn Gold Trading in Order': Vốn $1,000, Risk $10 (1%), SL 20 pips, R:R 1:3.5",
          },
        ],
      }),
    });

    const res = await chatHermes(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.reply).toContain('```chart_setup');
    expect(json.reply).toContain('[1]');
    expect(json.reply).toContain('Sources & Citations Ledger');
  });

  it('should return grounded citation when querying an audience pain point suggestion', async () => {
    const req = new NextRequest('http://localhost:3000/api/hermes/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: 'Lên video và setup nến giải quyết nỗi đau 488 người: Không biết đọc cấu trúc nến, bẫy rút râu từ chối giá hỗ trợ',
          },
        ],
      }),
    });

    const res = await chatHermes(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.reply).toContain('```chart_setup');
    expect(json.reply).toContain('channel-brain-v3.md');
    expect(json.reply).toContain("Damn, that's cool. Anyways how do I read a chart?");
    expect(json.reply).toContain('Sources & Citations Ledger');
  });

  it('should dynamically calculate correct math for custom capital ($5k, risk 1%, SL 20p)', async () => {
    const req = new NextRequest('http://localhost:3000/api/hermes/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: 'Lên setup Vàng cho tài khoản $5k, risk 1%, SL 20 pips, R:R 1:3.5',
          },
        ],
      }),
    });

    const res = await chatHermes(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.reply).toContain('$5.000');
    expect(json.reply).toContain('$50.00');
    expect(json.reply).toContain('0.25 lot');
    expect(json.reply).toContain('+70 pips');
    expect(json.reply).toContain('```chart_setup');
  });
});
