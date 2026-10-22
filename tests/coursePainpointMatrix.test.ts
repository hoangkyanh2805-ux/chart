import { describe, it, expect } from 'vitest';
import { COURSE_PAINPOINT_PRESETS } from '../src/data/coursePainpointMatrix';

describe('Course & Pain Point Matrix Engine', () => {
  it('should have all defined course presets mapped to knowledge courses', () => {
    expect(COURSE_PAINPOINT_PRESETS.length).toBeGreaterThanOrEqual(5);

    const courseIds = COURSE_PAINPOINT_PRESETS.map((p) => p.courseId);
    expect(courseIds).toContain('OPT 3');
    expect(courseIds).toContain('OPT 11');
    expect(courseIds).toContain('OPT 4');
    expect(courseIds).toContain('OPT 9');
    expect(courseIds).toContain('OPT 1');
  });

  it('should enforce strict OHLC integrity on every preset candle', () => {
    COURSE_PAINPOINT_PRESETS.forEach((preset) => {
      expect(preset.candles.length).toBeGreaterThanOrEqual(4);

      preset.candles.forEach((c, idx) => {
        expect(c.index).toBe(idx);
        expect(c.high).toBeGreaterThanOrEqual(c.low);
        expect(c.high).toBeGreaterThanOrEqual(c.open);
        expect(c.high).toBeGreaterThanOrEqual(c.close);
        expect(c.low).toBeLessThanOrEqual(c.open);
        expect(c.low).toBeLessThanOrEqual(c.close);

        // Realistic Gold Range (~$4,100 - $4,200)
        expect(c.low).toBeGreaterThan(4000);
        expect(c.high).toBeLessThan(4300);
      });
    });
  });

  it('should provide full 4-stage retention script for video creation', () => {
    COURSE_PAINPOINT_PRESETS.forEach((preset) => {
      expect(preset.script.hook.length).toBeGreaterThan(10);
      expect(preset.script.tension.length).toBeGreaterThan(20);
      expect(preset.script.payoff.length).toBeGreaterThan(20);
      expect(preset.script.cta.length).toBeGreaterThan(10);
      expect(preset.badges.length).toBe(3);

      // Hook headline word count standard (concise punchy hook)
      const words = preset.hookHeadline.split(/\s+/);
      expect(words.length).toBeLessThanOrEqual(8);
    });
  });

  it('should ensure overlays are bounded within candle count and valid prices', () => {
    COURSE_PAINPOINT_PRESETS.forEach((preset) => {
      const maxIndex = preset.candles.length - 1;

      preset.overlays.forEach((ov) => {
        expect(ov.startCandleIndex).toBeGreaterThanOrEqual(0);
        expect(ov.startCandleIndex).toBeLessThanOrEqual(maxIndex);
        expect(ov.endCandleIndex).toBeGreaterThanOrEqual(ov.startCandleIndex);
        expect(ov.priceStart).toBeGreaterThan(4000);
        expect(ov.priceEnd).toBeGreaterThan(4000);
      });
    });
  });
});
