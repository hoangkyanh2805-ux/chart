import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/dashboard/route';

describe('Live Azzam Dashboard API Integration', () => {
  it('should return complete live dashboard payload with ops, content-package, and script registry', async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);

    // 1. Verify URLs
    expect(data.urls.dashboard).toBe('https://dashboard.azzamedu.com');
    expect(data.urls.ops).toBe('https://dashboard.azzamedu.com/ops');
    expect(data.urls.contentPackage).toBe('https://dashboard.azzamedu.com/content-package');

    // 2. Verify Channel Metrics
    expect(data.channel.title).toBe('Azzam Master Trading');
    expect(data.channel.channelId).toBe('UCBZ7LaffmEPv91sWcfroJdQ');
    expect(data.channel.subs).toBeGreaterThanOrEqual(2000);

    // 3. Verify Ops & 8 Blindspots
    expect(data.ops.uniqueComments).toBe(7169);
    expect(data.ops.painPoints).toBe(2244);
    expect(data.ops.blindspots.length).toBe(8);
    expect(data.ops.blindspots[0].severity).toBe('CRITICAL');
    expect(data.ops.blindspots[0].title).toContain('bot');

    // 4. Verify Content Package: The 30-Day Roadmap
    expect(data.contentPackage.packageId).toBe('roadmap-review-v1');
    expect(data.contentPackage.canonicalId).toBe('LONG-20261013-30DAY-XAUUSD-ROADMAP');
    expect(data.contentPackage.segments.length).toBe(8);
    expect(data.contentPackage.segments[0].chartSetup.candles.length).toBeGreaterThan(0);
    expect(data.contentPackage.segments[0].chartSetup.overlays.length).toBeGreaterThan(0);

    // 5. Verify Script Registry (62 scripts)
    expect(data.scriptRegistry.total).toBe(62);
    expect(data.scriptRegistry.items.length).toBe(62);
    expect(data.scriptRegistry.longCount).toBeGreaterThan(0);
    expect(data.scriptRegistry.shortCount).toBeGreaterThan(0);

    // 6. Verify Competitors
    expect(data.competitors.total).toBeGreaterThanOrEqual(5);
  });
});

