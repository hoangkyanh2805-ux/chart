import { describe, it, expect } from 'vitest';

describe('YouTube Live Channel Audit & Diagnostic API', () => {
  it('should fetch live channel stats and segment videos via /api/youtube/channel', async () => {
    const res = await fetch('http://localhost:3000/api/youtube/channel');
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.status).toBe('ok');

    // Channel metadata
    expect(body.channel.title).toContain('Azzam');
    expect(body.channel.customUrl).toBe('@azzammastertradinggold');
    expect(body.channel.subscribers).toBeGreaterThanOrEqual(1000);
    expect(body.channel.totalVideos).toBeGreaterThan(100);

    // Summary counts
    expect(body.summary.totalAnalyzed).toBeGreaterThanOrEqual(10);
    expect(body.summary.shortsCount).toBeGreaterThan(0);
    expect(body.summary.liveCount).toBeGreaterThan(0);

    // Diagnosis
    expect(body.diagnosis.strengths.length).toBeGreaterThan(0);
    expect(body.diagnosis.bottlenecks.length).toBeGreaterThan(0);
    expect(body.diagnosis.actionPlan.length).toBeGreaterThan(0);

    // Proposed videos
    expect(body.proposedVideos.length).toBeGreaterThanOrEqual(3);
    body.proposedVideos.forEach((prop: any) => {
      expect(prop.hookHeadline.length).toBeGreaterThan(5);
      expect(prop.hookSubline.length).toBeGreaterThan(5);
      expect(prop.strategy).toBeDefined();
      expect(prop.riskBudget).toBeGreaterThan(0);
      expect(prop.slPips).toBe(20);
      expect(prop.badges.length).toBe(3);
    });
  }, 15000);
});

