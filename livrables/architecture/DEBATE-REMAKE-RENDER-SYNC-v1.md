# Debate — Remake render-sync claims v1

Date: 2026-11-10. Status: PARENT_DEBATE_COMPLETE / NO_CODE.

The review under debate says a competitor remake already maps 1:1 onto `src/video/` and that a render will match voice, candles, FVG and the 48-second gate. This record checks those sentences against the current files. No feature code was written.

## Verdict

The frame clock is real. The remake adapter is not. A script of 110–120 words cannot become a synced XAUUSD short by calling the functions that exist today.

Use `scheduleCues` and `compileScene` as the clock when a later build attaches real audio and a real storyboard. Do not describe that path as already closed.

## What the code already does

`audioTimeline.ts` fixes the clock at 48 kHz and 30 fps:

```ts
export const SAMPLE_RATE = 48000;
export const FPS = 30;
export const SAMPLES_PER_FRAME = SAMPLE_RATE / FPS; // 1600
```

Each cue with an `AudioReceipt` occupies `Math.ceil(sampleCount / 1600)` frames. The next cue starts on that frame boundary. `compileScene.ts` places every storyboard action of an `intentId` on the `startFrame` of the first narration cue with that same `intentId`.

`layout.ts` publishes the rectangles the review quoted:

```ts
export const SAFE_ZONES = {
  horizontal: { left: 72, right: 936, width: 864 },
  vertical: { top: 160, bottom: 1600, height: 1440 },
  headline: { top: 160, bottom: 340, height: 180 },
  chart: { top: 390, bottom: 1160, height: 770, left: 72, right: 936 },
  teaching: { top: 1190, bottom: 1330, height: 140 },
  caption: { top: 1360, bottom: 1510, height: 150 },
  watermark: { top: 1540, bottom: 1600, height: 60 },
};
```

`priceToY` is linear. A higher price gets a smaller canvas Y. `renderFrame.ts` draws an FVG rectangle from `priceToY(gap.high)` to `priceToY(gap.low)` across the full chart width. Because the map is linear, the vertical center of that rectangle is the price midpoint. The function draws the label `FVG 50% C.E.` eight pixels below that center. It does not read `candle_1.high` or `candle_3.low`.

`renderFrame.ts` paints the watermark `scene.watermark` at y = 1575. `FrozenScene.watermark` is `EDUCATIONAL ILLUSTRATION — NOT FINANCIAL ADVICE`.

Profile on `SceneDraft` is 1080×1920 at 30 fps.

## D1 — Is `kind: 'competitor_remake'` a fourth adapter?

Rejected as a description of current code. `AdapterInput` has three members: `brief`, `chat`, `template`. There is no `competitor_remake` branch.

`toDraft` always emits the same six synthetic candles, `overlays: []`, `order: null`, and `audio: null`. Intent ids come from this list:

```ts
const defaultIntents = ['disclosure', 'context', 'budget', 'pullback', 'sizing', 'stop-hit', 'lesson'];
```

The ids `hook-tension`, `market-trap`, `smc-fvg`, `risk-budget`, and `tele-cta` are not produced.

The storyboard action for every intent except `stop-hit` is `SHOW_TEXT` whose text is the intent id in uppercase. `stop-hit` gets `MARK_OUTCOME`. Nothing in `toDraft` emits `REVEAL_CANDLES` or `SHOW_OVERLAY`.

`renderFrame.ts` draws a candle only after `REVEAL_CANDLES`. With the current storyboard the chart area stays empty. `compileScene` never runs on a `toDraft` result anyway: `scheduleCues` returns `AUDIO_MISSING` while `audio` is null.

The spec's `CompetitorRemakePayload` is a proposal. It is not an implemented port.

## D2 — Does the syllable "FVG" light the box on that frame?

Rejected. The clock is per cue, not per word.

`AudioReceipt` stores `sampleCount` for the whole cue. It has no word list. `compileScene` stamps the action at the start frame of the first cue that shares the intent. If the word "FVG" sits in the middle of a sentence, the box appears when that sentence starts, which can be many frames earlier.

`startFrame` of cue *i* is the sum of `ceil(sampleCount / 1600)` over the previous cues. That formula in the review matches the code. The inference "the syllable and the box share one frame" does not.

Caption drawing uses the whole cue text, wrapped to three lines. `activeText` is assigned from `SHOW_TEXT` and never read. The headline painted at y = 230 is the constant `RISK-FIRST XAUUSD`, not the six-word hook of the script.

## D3 — Does the FVG box stick to wick c1 and wick c3?

Only the Y axis can do that, and only when the overlay's `high` and `low` were set to those prices. `renderFrame.ts` uses `gap.high` and `gap.low`. The current adapter never creates that gap.

The rectangle spans `SAFE_ZONES.chart.left` to `SAFE_ZONES.chart.right`. It is not clipped to the x of candle c1 and candle c3.

The worked numbers in the review match the hardcoded candles: c1 high is 4132.0 and c3 low is 4124.0. Those two prices overlap. They are not a gap. A bullish FVG needs candle-1 high below candle-3 low. Pinning a box to that pair would paint an overlap, not an FVG.

## D4 — Do the safe zones survive a TikTok chrome?

The constants match the review, and `renderFrame.ts` uses those y bands for headline, chart, caption, and watermark. That is a layout contract, not a measured pass over a TikTok or Shorts overlay.

The right gutter is 144 px (1080 − 936), about 13% of the width. The top inset is 160/1920. The bottom inset below y = 1600 is 320 px. The review's "15–20% right" and "25% bottom" are larger than these constants.

The budget row is not clamped to x = 72..936. Three badges of 260 px start at x = 130 and the third ends at x = 950, which is past the right gutter of 936. `showBudget || scene.draft.budget` draws that row whenever a budget object exists, which `toDraft` always sets. `SHOW_BUDGET` is not the switch.

## D5 — Does the 48-second gate, or a 1.05× stretch, exist?

Rejected. `scheduleCues` rejects a timeline outside `(0, 120]` seconds:

```ts
if (totalDurationSec <= 0 || totalDurationSec > 120) {
```

A 55-second take is inside that range. `SceneDraft.profile.maxDurationSec` is `120`. No function in `src/video/` time-stretches audio. Spec §6, which says a duration over 48s triggers a 1.05× stretch, describes a mechanism this tree does not contain.

The 48.00s ceiling stays a remake requirement for a future check. It is not the S2V clock. Do not tighten `scheduleCues` inside this debate. S2V-R1 still allows a narrated lesson up to 120s.

## D6 — Is the CapCut bridge already a second export?

Rejected as implemented behavior. The spec describes four tracks and `draft_content.json`. This repo has no writer for that file. `runRenderJob.ts` can pipe PNG frames to ffmpeg. That is the MP4 path. Sound effects stay a human step after a verified MP4, and they are not a second source of candle truth.

## D7 — Compliance gate

`truthClass: 'EDUCATIONAL_ILLUSTRATION'` and the frozen watermark string are real. `toDraft` defaults risk to 30 USD and SL to 20 pips, then sets `usdPerPip` to `riskUsd / slPips` (1.5 when those defaults hold). It does not read a lot size. It does not scan the script for profit promises. It will accept whatever `selectedText` the source already contains, including a copied competitor line, as long as the narration joins back to that same text.

Default `outcome` in `toDraft` is `STOP_LOSS`. The review's sample storyboard ends on a stop hit. That matches the S2V lesson shape. It is the wrong ending for a remake whose direction is BUY and whose book must close above entry.

## Resolution for the spec

| Claim in the review | Status |
| :--- | :--- |
| 1600 samples per frame, actions on cue `startFrame` | True of the compiler, once every cue has audio |
| Fourth adapter `competitor_remake` | Proposal only |
| Intent ids and `REVEAL_CANDLES` / `SHOW_OVERLAY` listed in spec §3.1 | Not emitted by `toDraft` |
| Syllable-accurate FVG | False. Cue-start accuracy only |
| FVG pinned to c1 high and c3 low | False for current candles and for current `renderFrame` inputs |
| Safe-zone constants 72..936 and the listed y bands | True as constants. Badge row overflows x = 936. No device-chrome test is in this debate |
| Duration ≤ 48s and 1.05× time-stretch | False in code. Stretch stays rejected |
| CapCut `draft_content.json` | Unbuilt |
| "Khớp 100%" | Withdraw |

A later build may add `competitor_remake` only as a new adapter that fills `SceneDraft` version `scene-draft/1`: owned narration, per-cue 48 kHz audio, storyboard actions that name real candle ids and a real FVG gap, and a remake-specific duration check of 48s that does not change the S2V 120s function. Until those fields exist, render output will not follow the competitor script.
