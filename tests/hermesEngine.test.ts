import { describe, it, expect } from 'vitest';
import { executeHermesDirective, generateStrategySetup } from '../src/utils/hermesEngine';
import fs from 'fs';

describe('Hermes Native Engine', () => {
  it('correctly extracts and executes Hermes script directives', () => {
    const filePath = 'C:/Users/Admin/youtube/video_scripts/script_2026-10-19_xauusd-risk-first-define-loss-before-entry.md';
    if (!fs.existsSync(filePath)) {
      console.log('Skipping file read on environment without scripts folder');
      return;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const directive = executeHermesDirective(content, 'script_2026-10-19_xauusd-risk-first-define-loss-before-entry.md');

    expect(directive.hookHeadline).toBe('THE STOP LOSS CAME FIRST');
    expect(directive.hookSubline).toContain('The entry came second');
    expect(directive.riskBudget).toBe(30);
    expect(directive.slPips).toBe(20);
    expect(directive.lotSize).toBe('$1.50/pip');
    expect(directive.candles.length).toBe(6);
    expect(directive.overlays.length).toBeGreaterThan(0);
  });

  it('correctly executes 2026-10-21 PDF hunter script', () => {
    const filePath = 'C:/Users/Admin/youtube/video_scripts/script_2026-10-21_xauusd-beginner-roadmap-other-question-or-pain-general.md';
    if (!fs.existsSync(filePath)) return;

    const content = fs.readFileSync(filePath, 'utf-8');
    const directive = executeHermesDirective(content, 'script_2026-10-21_xauusd-beginner-roadmap-other-question-or-pain-general.md');

    expect(directive.title).toBe('1 Predefined Loss Limit Keeps New XAUUSD Traders Alive');
    expect(directive.hookHeadline).toBe('A PDF WILL NOT KEEP YOU ALIVE');
    expect(directive.hookSubline).toContain('A loss limit will');
    expect(directive.riskBudget).toBe(10);
    expect(directive.lotSize).toBe('0.05 lot');
    expect(directive.goldenHour).toContain('00:00 VN');
    expect(directive.painpoint).toContain('lucian');
  });

  it('generates distinct authentic candle structures and overlays per strategy', () => {
    const fvg = generateStrategySetup('Fair Value Gap', 4125, 10, 20, '0.05 lot', 3.5);
    expect(fvg.overlays.some((o) => o.type === 'FVG')).toBe(true);
    expect(fvg.candles.length).toBe(6);

    const sweep = generateStrategySetup('Liquidity Sweep', 4140, 30, 20, '$1.50/pip', 3.2);
    expect(sweep.overlays.some((o) => o.label.includes('BSL'))).toBe(true);
    // Candle 3 should have a high sweep wick
    expect(sweep.candles[3].high).toBeGreaterThan(sweep.candles[1].high);

    const breakRetest = generateStrategySetup('Break & Retest', 4130, 20, 15, '0.1 lot', 3.0);
    expect(breakRetest.overlays.some((o) => o.label.includes('Break & Retest'))).toBe(true);

    const supply = generateStrategySetup('Supply Zone', 4150, 25, 20, '0.08 lot', 3.0);
    expect(supply.overlays.some((o) => o.label.includes('Supply Zone'))).toBe(true);

    const pullback = generateStrategySetup('Risk-First Pullback', 4128, 10, 20, '0.05 lot', 3.5);
    expect(pullback.overlays.some((o) => o.label.includes('Support'))).toBe(true);
  });
});
