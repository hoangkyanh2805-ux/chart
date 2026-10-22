import { describe, it, expect } from 'vitest';
import { executeHermesDirective } from '../src/utils/hermesEngine';
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
});
