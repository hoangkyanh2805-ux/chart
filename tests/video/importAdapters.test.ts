import { describe, it, expect } from 'vitest';
import { toDraft } from '../../src/video/importAdapters';
import { SourceDocument } from '../../src/video/contracts';
import { hashText } from '../../src/video/canonicalHash';

describe('Script-to-Draft Canonical Import Adapters (Task 7)', () => {
  const sampleText =
    'Define the loss first. Picture XAUUSD. Define your budget: 30 dollars. Hits the stop. You lose thirty dollars. Done.';
  const sampleSource: SourceDocument = {
    id: 'test-source',
    revision: 1,
    sourceSha256: hashText(sampleText),
    selection: 'EXCERPT',
    selectedText: sampleText,
    selectedTextSha256: hashText(sampleText),
    language: 'en',
  };

  it('converts brief input into valid SceneDraft matching source spans', () => {
    const res = toDraft(
      {
        kind: 'brief',
        payload: {
          text: sampleText,
          riskBudgetUsd: 30,
          slPips: 20,
          direction: 'BUY',
          outcome: 'STOP_LOSS',
        },
      },
      sampleSource
    );

    expect(res.ok).toBe(true);
    if (res.ok) {
      const draft = res.value;
      expect(draft.narration.map((c) => c.text).join('')).toBe(sampleText);
      expect(draft.budget).toEqual({ riskUsd: 30, slPips: 20, usdPerPip: 1.5 });
      expect(draft.outcome).toBe('STOP_LOSS');
    }
  });

  it('converts chat input with setup into equal semantic projection', () => {
    const res = toDraft(
      {
        kind: 'chat',
        payload: {
          message: sampleText,
          setup: { riskBudgetUsd: 30, slPips: 20, outcome: 'STOP_LOSS' },
        },
      },
      sampleSource
    );

    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.value.outcome).toBe('STOP_LOSS');
      expect(res.value.budget?.usdPerPip).toBe(1.5);
    }
  });

  it('rejects input text that does not match source text', () => {
    const res = toDraft(
      {
        kind: 'brief',
        payload: {
          text: 'Completely different text that does not match source',
        },
      },
      sampleSource
    );

    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.issues.some((i) => i.code === 'SOURCE_TEXT_MISMATCH')).toBe(true);
    }
  });
});

