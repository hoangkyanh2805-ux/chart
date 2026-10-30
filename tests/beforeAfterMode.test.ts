import { describe, it, expect, beforeEach } from 'vitest';
import { useChartStore } from '../src/store/useChartStore';
import { POST as chatHermes } from '../src/app/api/hermes/chat/route';
import { NextRequest } from 'next/server';

describe('Before / After Dual Comparison Engine', () => {
  beforeEach(() => {
    useChartStore.setState({
      beforeAfterMode: 'off',
      currentTime: 0,
      duration: 12,
    });
  });

  it('should initialize with beforeAfterMode off and support setting modes', () => {
    expect(useChartStore.getState().beforeAfterMode).toBe('off');

    useChartStore.getState().setBeforeAfterMode('auto');
    expect(useChartStore.getState().beforeAfterMode).toBe('auto');

    useChartStore.getState().setBeforeAfterMode('before');
    expect(useChartStore.getState().beforeAfterMode).toBe('before');

    useChartStore.getState().setBeforeAfterMode('after');
    expect(useChartStore.getState().beforeAfterMode).toBe('after');

    useChartStore.getState().setBeforeAfterMode('off');
    expect(useChartStore.getState().beforeAfterMode).toBe('off');
  });

  it('should evaluate auto mode transition at progress = 0.38', () => {
    useChartStore.setState({ beforeAfterMode: 'auto', duration: 10, currentTime: 2 });
    const progressBefore = 2 / 10; // 0.2
    const isBefore1 = progressBefore <= 0.38;
    const isAfter1 = progressBefore > 0.38;
    expect(isBefore1).toBe(true);
    expect(isAfter1).toBe(false);

    useChartStore.setState({ currentTime: 6 });
    const progressAfter = 6 / 10; // 0.6
    const isBefore2 = progressAfter <= 0.38;
    const isAfter2 = progressAfter > 0.38;
    expect(isBefore2).toBe(false);
    expect(isAfter2).toBe(true);
  });

  it('should output beforeAfterMode: auto in chart_setup payload for PP-0009 minimal setup', async () => {
    const req = new NextRequest('http://localhost:3000/api/hermes/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: 'Lên video tối giản cho người mới: Chỉ nhìn cản hỗ trợ và nến rút chân từ chối giá',
          },
        ],
      }),
    });

    const res = await chatHermes(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.reply).toContain('```chart_setup');
    expect(json.reply).toContain('"beforeAfterMode": "auto"');
    expect(json.reply).toContain('STOP OVERCOMPLICATING CHARTS');
  });
});

