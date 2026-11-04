import { SceneDraft, Candle, Overlay, NarrationCue, StoryboardCue } from '../../../src/video/contracts';
import { hashText } from '../../../src/video/canonicalHash';
import pilotSource from './pilot.source.json';

export function makePilotDraft(): SceneDraft {
  const candles: Candle[] = [
    { id: 'c1', index: 0, open: 4120.0, high: 4132.0, low: 4119.0, close: 4130.0 },
    { id: 'c2', index: 1, open: 4130.0, high: 4131.0, low: 4123.0, close: 4124.5 },
    { id: 'c3', index: 2, open: 4124.5, high: 4142.0, low: 4124.0, close: 4140.0 },
    { id: 'c4', index: 3, open: 4140.0, high: 4141.0, low: 4128.0, close: 4129.0 },
    { id: 'c5', index: 4, open: 4129.0, high: 4136.0, low: 4126.0, close: 4134.5 },
    { id: 'c6', index: 5, open: 4134.5, high: 4135.0, low: 4124.0, close: 4125.0 },
  ];

  const overlays: Overlay[] = [
    { id: 'lvl-support', kind: 'LEVEL', price: 4128.0, label: 'Previous High Support ($4,128.00)' },
  ];

  const narration: NarrationCue[] = pilotSource.segments.map((s) => ({
    id: s.id,
    intentId: s.intentId,
    span: { startUtf16: s.startUtf16, endUtf16: s.endUtf16 },
    text: s.text,
    audio: null,
  }));

  const storyboard: StoryboardCue[] = [
    {
      intentId: 'disclosure',
      actions: [{ kind: 'SHOW_TEXT', id: 'txt-disclosure', text: 'EDUCATIONAL MECHANICS' }],
    },
    {
      intentId: 'context',
      actions: [
        { kind: 'REVEAL_CANDLES', candleIds: ['c1', 'c2', 'c3'] },
        { kind: 'SHOW_OVERLAY', overlayId: 'lvl-support' },
      ],
    },
    {
      intentId: 'budget',
      actions: [{ kind: 'SHOW_BUDGET' }],
    },
    {
      intentId: 'pullback',
      actions: [{ kind: 'REVEAL_CANDLES', candleIds: ['c4', 'c5'] }],
    },
    {
      intentId: 'sizing',
      actions: [{ kind: 'SHOW_TEXT', id: 'txt-sizing', text: 'SIZE: $1.50 / PIP' }],
    },
    {
      intentId: 'stop-hit',
      actions: [
        { kind: 'REVEAL_CANDLES', candleIds: ['c6'] },
        { kind: 'MARK_OUTCOME', outcome: 'STOP_LOSS' },
      ],
    },
    {
      intentId: 'lesson',
      actions: [{ kind: 'SHOW_TEXT', id: 'txt-lesson', text: 'TOTAL LOSS: $30. DONE.' }],
    },
  ];

  return {
    schema: 'scene-draft/1',
    source: {
      id: pilotSource.id,
      revision: 1,
      sourceSha256: pilotSource.sourceSha256,
      selection: 'EXCERPT',
      selectedText: pilotSource.excerpt,
      selectedTextSha256: pilotSource.excerptSha256,
      language: 'en',
    },
    truthClass: 'EDUCATIONAL_ILLUSTRATION',
    language: 'en',
    direction: 'BUY',
    outcome: 'STOP_LOSS',
    candles,
    overlays,
    budget: { riskUsd: 30, slPips: 20, usdPerPip: 1.5 },
    order: null,
    chartPriceOrigin: 'SYNTHETIC',
    entryBasis: 'NONE',
    entryOverlayId: null,
    narration,
    storyboard,
    profile: {
      width: 1080,
      height: 1920,
      fps: 30,
      maxDurationSec: 120,
    },
    theme: 'paper',
  };
}

export function makeAudioReadyPilot(): SceneDraft {
  const draft = makePilotDraft();
  draft.narration.forEach((cue) => {
    cue.audio = {
      assetId: `asset-${cue.id}`,
      sha256: hashText(`mock-audio-${cue.id}`),
      transcriptSha256: hashText(cue.text),
      sampleRate: 48000,
      channels: 1,
      sampleCount: 48000 * 2, // 2s per cue for mock test
      origin: 'USER_UPLOAD',
      review: 'MATCHED',
    };
  });
  return draft;
}

export function makeFvgDraft(): SceneDraft {
  const draft = makePilotDraft();
  draft.candles = [
    { id: 'c1', index: 0, open: 4125.0, high: 4128.0, low: 4124.0, close: 4127.0 },
    { id: 'c2', index: 1, open: 4127.0, high: 4136.0, low: 4126.5, close: 4135.5 },
    { id: 'c3', index: 2, open: 4138.0, high: 4140.0, low: 4137.0, close: 4139.0 },
  ];
  draft.overlays = [
    { id: 'fvg-1', kind: 'FVG', candleIds: ['c1', 'c2', 'c3'], low: 4128.0, high: 4137.0 },
  ];
  draft.entryBasis = 'FVG_CE';
  draft.entryOverlayId = 'fvg-1';
  draft.order = {
    direction: 'BUY',
    entry: 4132.5, // 50% CE of [4128, 4137]
    sl: 4125.0,
    tp: 4150.0,
  };
  draft.storyboard = [
    {
      intentId: 'disclosure',
      actions: [{ kind: 'SHOW_TEXT', id: 'txt-disclosure', text: 'FVG STRATEGY' }],
    },
    {
      intentId: 'context',
      actions: [
        { kind: 'REVEAL_CANDLES', candleIds: ['c1', 'c2', 'c3'] },
        { kind: 'SHOW_OVERLAY', overlayId: 'fvg-1' },
      ],
    },
    {
      intentId: 'budget',
      actions: [{ kind: 'SHOW_BUDGET' }],
    },
    {
      intentId: 'pullback',
      actions: [{ kind: 'SHOW_TEXT', id: 'txt-pullback', text: 'PULLBACK TO 50% CE' }],
    },
    {
      intentId: 'sizing',
      actions: [{ kind: 'SHOW_TEXT', id: 'txt-sizing', text: 'SIZING READY' }],
    },
    {
      intentId: 'stop-hit',
      actions: [{ kind: 'MARK_OUTCOME', outcome: 'STOP_LOSS' }],
    },
    {
      intentId: 'lesson',
      actions: [{ kind: 'SHOW_TEXT', id: 'txt-lesson', text: 'LESSON COMPLETE' }],
    },
  ];
  return draft;
}
