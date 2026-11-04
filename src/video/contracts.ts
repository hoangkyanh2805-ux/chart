export type Direction = 'BUY' | 'SELL';
export type Outcome = 'STOP_LOSS' | 'TAKE_PROFIT' | 'OPEN' | 'NO_TRADE';
export type Span = { startUtf16: number; endUtf16: number }; // half-open in selectedText

export type SourceDocument = {
  id: string;
  revision: number;
  sourceSha256: string;
  selection: 'FULL' | 'EXCERPT';
  selectedText: string;
  selectedTextSha256: string;
  language: 'en' | 'vi';
};

export type Issue = {
  code: string;
  path: string;
  message: string;
  severity: 'error' | 'warning';
};

export type Result<T> =
  | { ok: true; value: T; issues: Issue[] }
  | { ok: false; issues: Issue[] };

export type AudioReceipt = {
  assetId: string;
  sha256: string;
  transcriptSha256: string;
  sampleRate: 48000;
  channels: 1;
  sampleCount: number;
  origin: 'USER_UPLOAD' | 'TTS';
  review: 'UNREVIEWED' | 'MATCHED' | 'REJECTED';
};

export type NarrationCue = {
  id: string;
  intentId: string;
  span: Span;
  text: string;
  audio: AudioReceipt | null;
};

export type Candle = {
  id: string;
  index: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type Budget = {
  riskUsd: number;
  slPips: number;
  usdPerPip: number;
};

export type Order = {
  direction: Direction;
  entry: number;
  sl: number;
  tp: number | null;
};

export type Gap = {
  id: string;
  kind: 'FVG';
  candleIds: [string, string, string];
  low: number;
  high: number;
};

export type Overlay =
  | Gap
  | { id: string; kind: 'LEVEL'; price: number; label: string };

export type CueAction =
  | { kind: 'REVEAL_CANDLES'; candleIds: string[] }
  | { kind: 'SHOW_OVERLAY'; overlayId: string }
  | { kind: 'SHOW_TEXT'; id: string; text: string }
  | { kind: 'SHOW_BUDGET' }
  | { kind: 'MARK_OUTCOME'; outcome: Outcome };

export type StoryboardCue = {
  intentId: string;
  actions: CueAction[];
};

export type SceneDraft = {
  schema: 'scene-draft/1';
  source: SourceDocument;
  truthClass: 'EDUCATIONAL_ILLUSTRATION';
  language: 'en' | 'vi';
  direction: Direction | null;
  outcome: Outcome;
  candles: Candle[];
  overlays: Overlay[];
  budget: Budget | null;
  order: Order | null;
  chartPriceOrigin: 'SYNTHETIC' | 'SOURCE';
  entryBasis: 'NONE' | 'EXPLICIT' | 'FVG_CE';
  entryOverlayId: string | null;
  narration: NarrationCue[];
  storyboard: StoryboardCue[];
  profile: {
    width: 1080;
    height: 1920;
    fps: 30;
    maxDurationSec: 120;
  };
  theme: 'paper' | 'dark' | 'white';
};

export type ScheduledCue = {
  id: string;
  text: string;
  startSample: number;
  endSample: number;
  startFrame: number;
  endFrame: number;
  audioAssetId: string;
};

export type TimedAction = {
  frame: number;
  action: CueAction;
};

export type FrozenScene = {
  schema: 'frozen-scene/1';
  sceneSha256: string;
  draftSha256: string;
  draft: Readonly<SceneDraft>;
  cues: ScheduledCue[];
  events: TimedAction[];
  frameCount: number;
  audioSampleCount: number;
  watermark: 'EDUCATIONAL ILLUSTRATION — NOT FINANCIAL ADVICE';
};

export type FrameReceipt = {
  frame: number;
  sceneSha256: string;
  visibleIds: string[];
  bounds: { id: string; x: number; y: number; width: number; height: number }[];
};

