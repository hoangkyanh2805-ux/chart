import { describe, it, expect } from 'vitest';
import { createAudioBindingRequest, isAudioBindingValid } from '../../src/video/audioIdentity';
import { makePilotDraft } from '../fixtures/s2v/factories';

describe('Stale-Response Audio Isolation (Task 4)', () => {
  it('accepts audio response when sourceId, revision, and transcriptSha256 all match', () => {
    const draft = makePilotDraft();
    const cue = draft.narration[0];
    const req = createAudioBindingRequest(draft.source.id, draft.source.revision, cue);

    const valid = isAudioBindingValid(req, draft.source.id, draft.source.revision, cue);
    expect(valid).toBe(true);
  });

  it('discards audio response if text changed while request was in-flight', () => {
    const draft = makePilotDraft();
    const cue = draft.narration[0];
    const req = createAudioBindingRequest(draft.source.id, draft.source.revision, cue);

    // User edits cue text in draft
    const editedCue = { ...cue, text: cue.text + ' (edited)' };
    const valid = isAudioBindingValid(req, draft.source.id, draft.source.revision, editedCue);
    expect(valid).toBe(false);
  });

  it('discards audio response if revision bumped', () => {
    const draft = makePilotDraft();
    const cue = draft.narration[0];
    const req = createAudioBindingRequest(draft.source.id, draft.source.revision, cue);

    // Source revision bumped from 1 to 2
    const valid = isAudioBindingValid(req, draft.source.id, draft.source.revision + 1, cue);
    expect(valid).toBe(false);
  });

  it('discards audio response if sourceId changed', () => {
    const draft = makePilotDraft();
    const cue = draft.narration[0];
    const req = createAudioBindingRequest(draft.source.id, draft.source.revision, cue);

    const valid = isAudioBindingValid(req, 'different-source-id', draft.source.revision, cue);
    expect(valid).toBe(false);
  });
});

