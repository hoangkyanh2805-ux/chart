import { describe, it, expect } from 'vitest';
import { generateDynamicScriptSubtitles } from '../src/utils/dynamicScriptNarrator';

describe('Dynamic Script & Voice Narrator Engine (No Hardcoding)', () => {
  it('should generate custom 4-stage subtitles for Stop Loss script', () => {
    const subs = generateDynamicScriptSubtitles({
      title: 'Stop Loss Bị Hit 3 Rule',
      direction: 'SELL',
      entryPrice: 4128.0,
      riskAmount: 10,
    });

    expect(subs.length).toBe(4);
    expect(subs[0].stageName).toBe('Hook');
    expect(subs[0].text).toContain('STOP LOSS');
    expect(subs[1].stageName).toBe('Trap');
    expect(subs[2].stageName).toBe('Setup');
    expect(subs[3].stageName).toBe('Execution');
    expect(subs[3].text).toContain('4128.0');
    expect(subs[3].text).toContain('10 đô');
  });

  it('should generate custom 4-stage subtitles for 3 Cây Nến (PP-0023)', () => {
    const subs = generateDynamicScriptSubtitles({
      title: '3 Cây Nến Tiết Lộ Dòng Tiền Lớn (PP-0023)',
      direction: 'SELL',
      entryPrice: 4132.5,
      riskAmount: 10,
    });

    expect(subs.length).toBe(4);
    expect(subs[0].text).toContain('3 CÂY NẾN TIẾT LỘ DÒNG TIỀN LỚN');
    expect(subs[2].text).toContain('50% FVG');
    expect(subs[2].text).toContain('4132.5');
  });

  it('should generate custom 4-stage subtitles for Beginners 5 Sai Lầm', () => {
    const subs = generateDynamicScriptSubtitles({
      title: 'Beginners 5 Sai Lầm Giết Tài Khoản',
      direction: 'SELL',
      entryPrice: 4128.0,
    });

    expect(subs.length).toBe(4);
    expect(subs[0].text).toContain('TRADER MỚI');
    expect(subs[1].text).toContain('chiến lược scalping');
  });

  it('should dynamically localize subtitles to English when requested', () => {
    const subsEn = generateDynamicScriptSubtitles({
      title: 'CPI Judas Dump',
      direction: 'SELL',
      entryPrice: 4140.0,
      riskAmount: 30,
      language: 'en',
    });

    expect(subsEn.length).toBe(4);
    expect(subsEn[0].text).toContain('CPI NEWS');
    expect(subsEn[3].text).toContain('$30 risk');
    expect(subsEn[3].text).toContain('SELL');
  });
});

