import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Azzam Ops Live Intelligence Ingestion & Setup Verification', () => {
  const YOUTUBE_DIR = 'C:\\Users\\Admin\\youtube';
  const PAINPOINTS_CSV_PATH = path.join(YOUTUBE_DIR, 'outputs', 'painpoints', 'master', 'painpoints_master.csv');
  const EVERGREEN_MAP_PATH = path.join(YOUTUBE_DIR, 'outputs', 'strategy', 'EVERGREEN_PAINPOINT_MAP.json');

  it('should locate live YouTube master database files', () => {
    expect(fs.existsSync(PAINPOINTS_CSV_PATH)).toBe(true);
    expect(fs.existsSync(EVERGREEN_MAP_PATH)).toBe(true);
  });

  it('should have 24 evergreen topics mapped in strategy/EVERGREEN_PAINPOINT_MAP.json', () => {
    const raw = fs.readFileSync(EVERGREEN_MAP_PATH, 'utf8');
    const data = JSON.parse(raw);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(24);

    data.forEach((item: any) => {
      expect(item.topic).toBeDefined();
      expect(item.painpoint_id).toMatch(/^PP-\d{4}$/);
      expect(item.score).toBeGreaterThan(0);
      expect(item.quote.length).toBeGreaterThan(5);
    });
  });

  it('should parse master painpoints CSV with over 1,000 comments', () => {
    const raw = fs.readFileSync(PAINPOINTS_CSV_PATH, 'utf8');
    const lines = raw.split('\n').filter((l) => l.trim().length > 0);
    expect(lines.length).toBeGreaterThan(1000);

    // Verify top painpoint is PP-0001 (score 12.563, $1000 capital)
    const header = lines[0];
    expect(header).toContain('painpoint_id');
    expect(header).toContain('score');

    const topItem = lines[1];
    expect(topItem).toContain('PP-0001');
    expect(topItem).toContain('12.563');
  });

  it('should verify live API endpoint /api/ops/painpoints output structure', async () => {
    const res = await fetch('http://localhost:3000/api/ops/painpoints');
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(body.counts.total).toBeGreaterThanOrEqual(24);
    expect(body.counts.painPoints).toBeGreaterThanOrEqual(10);
    expect(body.counts.backlog).toBe(24);

    // Check individual items
    body.items.forEach((item: any) => {
      expect(item.id).toBeDefined();
      expect(['pain_point', 'backlog']).toContain(item.type);
      expect(item.hookTitle.length).toBeGreaterThan(5);
      expect(item.painQuote.length).toBeGreaterThan(5);
      expect(item.recommendedSetup.candles.length).toBeGreaterThanOrEqual(4);

      // Verify OHLC candle integrity
      item.recommendedSetup.candles.forEach((c: any) => {
        expect(c.high).toBeGreaterThanOrEqual(c.low);
        expect(c.high).toBeGreaterThanOrEqual(c.open);
        expect(c.high).toBeGreaterThanOrEqual(c.close);
        expect(c.low).toBeLessThanOrEqual(c.open);
        expect(c.low).toBeLessThanOrEqual(c.close);
        expect(c.low).toBeGreaterThan(4000);
        expect(c.high).toBeLessThan(4300);
      });
    });
  }, 15000);
});

