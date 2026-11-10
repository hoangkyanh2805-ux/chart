import {
  SceneDraft,
  SourceDocument,
  Result,
  NarrationCue,
  StoryboardCue,
  Candle,
  Overlay,
  Order,
  Direction,
  Outcome,
  Issue,
} from './contracts';
import { validateDraft } from './validateDraft';
import { choreographInstitutionalSetup } from './dynamicCandleChoreographer';

export interface BriefPayload {
  text: string;
  headline?: string;
  subline?: string;
  riskBudgetUsd?: number;
  slPips?: number;
  direction?: Direction;
  outcome?: Outcome;
  candles?: Candle[];
  overlays?: Overlay[];
  order?: Order | null;
  entryBasis?: 'NONE' | 'EXPLICIT' | 'FVG_CE';
  entryOverlayId?: string | null;
}

export interface CompetitorRemakePayload extends BriefPayload {
  sourceVideoUrl?: string;
  originalTranscript?: string;
}

export type AdapterInput =
  | { kind: 'brief'; payload: BriefPayload }
  | { kind: 'chat'; payload: { message: string; setup?: Partial<BriefPayload> } }
  | { kind: 'template'; payload: { templateId: string; title: string } }
  | { kind: 'competitor_remake'; payload: CompetitorRemakePayload };

export function toDraft(input: AdapterInput, source: SourceDocument): Result<SceneDraft> {
  const issues: Issue[] = [];

  let text = '';
  let headline: string | undefined;
  let subline: string | undefined;
  let riskBudgetUsd = 30;
  let slPips = 20;
  let direction: Direction = 'BUY';
  let outcome: Outcome = 'STOP_LOSS';
  let customCandles: Candle[] | undefined;
  let customOverlays: Overlay[] | undefined;
  let customOrder: Order | null | undefined;
  let entryBasis: 'NONE' | 'EXPLICIT' | 'FVG_CE' = 'NONE';
  let entryOverlayId: string | null = null;

  if (input.kind === 'brief' || input.kind === 'competitor_remake') {
    text = input.payload.text || source.selectedText;
    headline = input.payload.headline;
    subline = input.payload.subline;
    if (input.payload.riskBudgetUsd) riskBudgetUsd = input.payload.riskBudgetUsd;
    if (input.payload.slPips) slPips = input.payload.slPips;
    if (input.payload.direction) direction = input.payload.direction;
    if (input.payload.outcome) outcome = input.payload.outcome;
    if (input.payload.candles) customCandles = input.payload.candles;
    if (input.payload.overlays) customOverlays = input.payload.overlays;
    if (input.payload.order !== undefined) customOrder = input.payload.order;
    if (input.payload.entryBasis) entryBasis = input.payload.entryBasis;
    if (input.payload.entryOverlayId) entryOverlayId = input.payload.entryOverlayId;
  } else if (input.kind === 'chat') {
    text = input.payload.message || source.selectedText;
    headline = input.payload.setup?.headline;
    subline = input.payload.setup?.subline;
    if (input.payload.setup?.riskBudgetUsd) riskBudgetUsd = input.payload.setup.riskBudgetUsd;
    if (input.payload.setup?.slPips) slPips = input.payload.setup.slPips;
    if (input.payload.setup?.direction) direction = input.payload.setup.direction;
    if (input.payload.setup?.outcome) outcome = input.payload.setup.outcome;
    if (input.payload.setup?.candles) customCandles = input.payload.setup.candles;
  } else if (input.kind === 'template') {
    text = source.selectedText;
  }

  // Check if text matches source
  if (text !== source.selectedText) {
    issues.push({
      code: 'SOURCE_TEXT_MISMATCH',
      path: 'text',
      message: 'Provided input text must match source.selectedText exactly',
      severity: 'error',
    });
  }

  // Segment text by sentence boundaries into contiguous spans
  const sentences = splitIntoSentences(text);
  let currentOffset = 0;
  const narration: NarrationCue[] = [];
  const storyboard: StoryboardCue[] = [];

  sentences.forEach((sentence, idx) => {
    const start = currentOffset;
    const end = start + sentence.length;
    currentOffset = end;

    const intentId = getIntentForIndex(idx, sentences.length);
    const cueId = `cue_${idx + 1}`;

    narration.push({
      id: cueId,
      intentId,
      span: { startUtf16: start, endUtf16: end },
      text: sentence,
      audio: null,
    });
  });

  // Unique storyboard cues per intentId
  const uniqueIntents = Array.from(new Set(narration.map((n) => n.intentId)));
  uniqueIntents.forEach((intentId) => {
    storyboard.push({
      intentId,
      actions:
        intentId === 'stop-hit'
          ? [{ kind: 'MARK_OUTCOME', outcome }]
          : [{ kind: 'SHOW_TEXT', id: `txt_${intentId}`, text: intentId.toUpperCase() }],
    });
  });

  const usdPerPip = Number((riskBudgetUsd / slPips).toFixed(4));

  // Dynamic candle selection: use custom candles if provided, otherwise choreograph setup
  let candles: Candle[];
  let overlays: Overlay[] = customOverlays || [];
  let order: Order | null = customOrder !== undefined ? customOrder : null;

  if (customCandles && customCandles.length > 0) {
    candles = customCandles;
  } else if (input.kind === 'competitor_remake') {
    const choreographed = choreographInstitutionalSetup({
      direction,
      outcome,
      basePrice: 4130.0,
    });
    candles = choreographed.candles;
    if (!customOverlays || customOverlays.length === 0) {
      overlays = choreographed.overlays;
    }
    if (customOrder === undefined) {
      order = choreographed.order;
    }
    entryBasis = choreographed.entryBasis;
    entryOverlayId = choreographed.entryOverlayId;
  } else {
    // Default fallback pilot candles
    candles = [
      { id: 'c1', index: 0, open: 4120.0, high: 4132.0, low: 4119.0, close: 4130.0 },
      { id: 'c2', index: 1, open: 4130.0, high: 4131.0, low: 4123.0, close: 4124.5 },
      { id: 'c3', index: 2, open: 4124.5, high: 4142.0, low: 4124.0, close: 4140.0 },
      { id: 'c4', index: 3, open: 4140.0, high: 4141.0, low: 4128.0, close: 4129.0 },
      { id: 'c5', index: 4, open: 4129.0, high: 4136.0, low: 4126.0, close: 4134.5 },
      { id: 'c6', index: 5, open: 4134.5, high: 4135.0, low: 4124.0, close: 4125.0 },
    ];
  }

  const draft: SceneDraft = {
    schema: 'scene-draft/1',
    source,
    headline,
    subline,
    truthClass: 'EDUCATIONAL_ILLUSTRATION',
    language: source.language,
    direction,
    outcome,
    candles,
    overlays,
    budget: { riskUsd: riskBudgetUsd, slPips, usdPerPip },
    order,
    chartPriceOrigin: 'SYNTHETIC',
    entryBasis,
    entryOverlayId,
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

  const validationIssues = validateDraft(draft);
  issues.push(...validationIssues);

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  return { ok: true, value: draft, issues: [] };
}

function splitIntoSentences(text: string): string[] {
  // Regex to split on sentence boundaries keeping delimiters and trailing spaces
  const parts = text.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g);
  return parts || [text];
}

function getIntentForIndex(index: number, total: number): string {
  const defaultIntents = ['disclosure', 'context', 'budget', 'pullback', 'sizing', 'stop-hit', 'lesson'];
  if (index < defaultIntents.length) {
    return defaultIntents[index];
  }
  return `step_${index + 1}`;
}
