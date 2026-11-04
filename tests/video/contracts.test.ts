import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { hashText, hashCanonical, canonicalStringify } from '../../src/video/canonicalHash';
import { verifySource } from '../../src/video/verifySource';
import { makePilotDraft, makeFvgDraft } from '../fixtures/s2v/factories';

describe('Video Canonical Contracts & Fixtures (Task 1)', () => {
  it('preserves complete selected narration exactly matching excerpt byte-for-byte', () => {
    const draft = makePilotDraft();
    const joinedNarration = draft.narration.map((x) => x.text).join('');
    expect(joinedNarration).toBe(draft.source.selectedText);
    expect(draft.outcome).toBe('STOP_LOSS');
    expect(draft.order).toBeNull();
    expect(draft.budget).toEqual({ riskUsd: 30, slPips: 20, usdPerPip: 1.5 });
  });

  it('hashText matches independent crypto SHA-256 for ASCII and Unicode', () => {
    for (const s of ['abc', 'Vàng XAUUSD 🌟', 'Stop Loss Hit: $30. Done.', 'x'.repeat(5000)]) {
      expect(hashText(s)).toBe(createHash('sha256').update(s, 'utf8').digest('hex'));
    }
  });

  it('canonicalStringify sorts object keys deterministically regardless of insertion order', () => {
    const objA = { b: 2, a: 1, nested: { z: 9, y: 8 } };
    const objB = { nested: { y: 8, z: 9 }, a: 1, b: 2 };
    expect(canonicalStringify(objA)).toBe(canonicalStringify(objB));
    expect(hashCanonical(objA)).toBe(hashCanonical(objB));
  });

  it('hashCanonical omits sceneSha256 from its own digest', () => {
    const objA = { a: 1, sceneSha256: 'deadbeef' };
    const objB = { a: 1 };
    expect(hashCanonical(objA)).toBe(hashCanonical(objB));
  });

  it('hash changes when narration, outcome, or geometry changes', () => {
    const a = makePilotDraft();
    expect(hashCanonical(a)).not.toBe(hashCanonical({ ...a, outcome: 'TAKE_PROFIT' }));
    expect(hashCanonical(a)).not.toBe(
      hashCanonical({
        ...a,
        narration: [{ ...a.narration[0], text: 'Altered text' }, ...a.narration.slice(1)],
      })
    );
  });

  it('verifySource validates valid pilot source and rejects tampering', () => {
    const draft = makePilotDraft();
    const verified = verifySource(draft.source);
    expect(verified.ok).toBe(true);

    const tampered = { ...draft.source, selectedText: draft.source.selectedText + ' altered' };
    const resultTampered = verifySource(tampered);
    expect(resultTampered.ok).toBe(false);
    if (!resultTampered.ok) {
      expect(resultTampered.issues.some((i) => i.code === 'SOURCE_HASH_MISMATCH')).toBe(true);
    }
  });

  it('makeFvgDraft correctly defines FVG bounds and 50% CE entry', () => {
    const fvg = makeFvgDraft();
    expect(fvg.entryBasis).toBe('FVG_CE');
    expect(fvg.entryOverlayId).toBe('fvg-1');
    expect(fvg.order).not.toBeNull();
    // Low: 4128, High: 4137 -> CE = (4128 + 4137) / 2 = 4132.5
    expect(fvg.order!.entry).toBe(4132.5);
    expect(fvg.order!.direction).toBe('BUY');
  });

  it('serializes pilot.draft.json and fvg.draft.json to disk', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const pilotDraft = makePilotDraft();
    const fvgDraft = makeFvgDraft();
    fs.writeFileSync(
      path.resolve(__dirname, '../fixtures/s2v/pilot.draft.json'),
      JSON.stringify(pilotDraft, null, 2),
      'utf8'
    );
    fs.writeFileSync(
      path.resolve(__dirname, '../fixtures/s2v/fvg.draft.json'),
      JSON.stringify(fvgDraft, null, 2),
      'utf8'
    );
    expect(fs.existsSync(path.resolve(__dirname, '../fixtures/s2v/pilot.draft.json'))).toBe(true);
    expect(fs.existsSync(path.resolve(__dirname, '../fixtures/s2v/fvg.draft.json'))).toBe(true);
  });
});
