# Plan — Competitor remake to trading short v1

> Documentation only. The user asked for brainstorm, plan and spec, and said not to build code. Every box below is open. Nothing in this file was executed.

**Goal:** One owned XAUUSD short, 1080×1920, whose measured duration is ≤ 48.00s, whose candles obey OHLC and Risk-First, and whose words are not the competitor's words.

**Architecture:** A competitor URL becomes a shot manifest. Hermes rules rewrite that into a trading-short script. The existing canvas renders a ChartSpec. Local ffmpeg muxes frames and voice. CapCut is a later human door, not the candle engine.

**Spec:** `../specs/SPEC-AI-COMPETITOR-REMAKE-TO-TRADING-SHORT-v1.md` (v1.1.0).
**Debate:** `DEBATE-AI-COMPETITOR-REMAKE-TO-TRADING-SHORT-v1.md`.

## Global constraints

- Do not vendor hypit, openmontage, MoneyPrinterTurbo, purffle-shorts, short-video-maker, video-shotcraft, or a Remotion app into this repo during these tasks.
- Do not re-upload competitor footage, captions, or thumbnails.
- Do not add YouTube, TikTok, or Instagram upload.
- Do not present illustration prices as a live fill.
- Burn `ILLUSTRATION / NOT FINANCIAL ADVICE` inside the safe area.
- State Risk Budget $30 before entry. SL 20 pips, size 0.05 lot, R:R ≥ 1:3.5.
- Export profile: 1080×1920, 30 fps, H.264 yuv420p, AAC 48 kHz, duration ≤ 48.00s.
- Safe area: content y from 0.15 to 0.80 of the frame. This is stricter than the 120px bottom inset in `.claude/skills/video_pipeline.md`.
- S2V-R1 files stay on their own milestone. A remake task must not redefine the recovery pilot.
- "Done" for a future build means a shell check printed in that task. This plan's own done-state is the three documents on disk.

## Dependency graph

```text
T0 decision record (this turn, docs only)
        → T1 deconstruct fixture
        → T2 script compiler + compliance gate
                → T3 ChartSpec from the approved script
                → T4 voice + word timestamps
                        T3 + T4 → T5 ffmpeg MP4 gate
                                    → T6 optional CapCut draft
                                    → T7 one owned pilot
```

T3 and T4 can be specified in parallel after T2's JSON is frozen. One integrator owns T5.

## Task 0 — Decision record

**Files:** this plan, the debate, spec v1.1.0, `MAP.md`.

- [x] Record tool decisions for the user brief, including purffle-shorts through CapCut AI Template Generator.
- [x] Correct spec v1.0.0 where it named missing files or a stock-footage muxer.
- [ ] User reviews and either accepts v1.1.0 or sends it back.

**Exit:** the three livrables exist and name each other. No application file changes.

## Task 1 — Deconstruct contract, offline

**Create later:** `src/video/remake/deconstruct.ts`, `tests/fixtures/remake/competitor.manifest.json`, `tests/video/deconstruct.test.ts`.

**Interface:** `parseDeconstruct(input: unknown): CompetitorDeconstructSchema` as in spec §4.1.

- [ ] Author one fixture by hand from a public video the channel has the right to study. Store URL, durations, scene types and a short paraphrase. Do not store the competitor's full transcript as the script we will speak.
- [ ] Reject overlapping scenes, unknown scene types, and a hook window that does not sit inside the first scene.
- [ ] Shell the future test with `npx vitest run tests/video/deconstruct.test.ts`.

**Exit:** fixture parses. The test does not call the network.

**Out of scope:** installing yt-dlp, rea-video, or claude-video. Those installs are a separate approval after the fixture shape is stable.

## Task 2 — Script compiler and the 48-second writing gate

**Create later:** `src/video/remake/compileTradingShort.ts`, `tests/video/tradingShort.spec.test.ts`.

**Interface:** `compileTradingShort(manifest, brief): Result<TradingShortScriptSchema>`.

- [ ] Map Hook → Context → Mechanism → Twist onto HOOK, TRAP, SETUP, EXECUTION.
- [ ] On-screen hook ≤ 6 words, uppercase.
- [ ] Word band 110–120 is a target. Estimated speech that cannot fit in 48s is an error, not a stretch.
- [ ] Fail closed on profit promises, a missing disclaimer, entry named before the $30 budget, R:R < 3.5, SL other than 20 pips, lot other than 0.05, BUY with a falling book, SELL with a rising book.
- [ ] CTA is one Telegram destination inside EXECUTION.
- [ ] Three mutations must fail the suite: reversed TP/SL, hook longer than 6 words, word count that estimates over 48s.

**Exit:** `npx vitest run tests/video/tradingShort.spec.test.ts` passes on the honest fixture and fails the three mutations.

## Task 3 — ChartSpec from the approved script

**Create later:** `src/video/remake/chartSpecFromScript.ts`. Reuse `src/video/semantics.ts` and `src/video/validateDraft.ts`. Do not import 007Sancheti source.

- [ ] Emit `ChartSpecTimelineSchema` at 1080×1920, 30 fps, `WICK_THEN_BODY`.
- [ ] Sweep candle wick ≥ 30% of that candle's high-low range.
- [ ] FVG C.E. equals the midpoint of the gap, within one price tick.
- [ ] BUY: TP = entry + 7.0, SL = entry − 2.0. SELL: SL = entry + 2.0, TP = entry − 7.0. (20 pips = 2.0 in XAU price, 70 pips = 7.0 at R:R 3.5.)
- [ ] Overlay appear-times fall inside the SETUP or EXECUTION windows.
- [ ] Mutation: `high < low` must be rejected. Mutation: Y axis flipped must fail a coordinate test already owned by `tests/coordinates.test.ts` or a new remake test that calls the same mapper.

**Exit:** `npx vitest run tests/video/chartSpecFromScript.test.ts tests/coordinates.test.ts`.

## Task 4 — Voice and word timestamps

**Interface:** a provider port `synthesize(script) -> { wav, words: { text, start, end }[] }`. v1 provider is unspecified between Kokoro and Edge-TTS. The port is the contract. Pexels is not a provider.

- [ ] Word timestamps cover every spoken word in order.
- [ ] Sum of leading silence, speech and trailing silence ≤ 48.00s or the take is rejected.
- [ ] Caption cues do not drop words to "make it fit".
- [ ] Changing the script invalidates the wav hash. Do not reuse the previous take.

**Exit:** a fixture wav's duration and word list satisfy the contract under ffprobe. Network TTS is an explicit human action, not an import-time side effect.

## Task 5 — MP4 gate

**Reuse:** `src/server/video/runRenderJob.ts`, `src/server/video/verifyMedia.ts`.

- [ ] Render the frozen chart at 30 fps to H.264 and mux the Task 4 wav.
- [ ] `ffprobe` reports width 1080, height 1920, duration ≤ 48.00.
- [ ] `ffmpeg -v error -i out.mp4 -f null -` returns no errors.
- [ ] FVG or entry overlay appears within ±0.15s of the word timestamp that names it.
- [ ] Disclaimer is inside y 0.15–0.80.
- [ ] Frame drop mutation: a runner that skips an index must fail the frame-count check.

**Exit:** one local MP4 plus the ffprobe JSON stored under `livrables/s2v_runs/` only after MAP.md reserves the new run folder. Do not mix this run into `s2v-r1-run-01`.

## Task 6 — Optional CapCut draft

**Blocked by:** a passing Task 5 MP4. The draft is a convenience copy, not a second source of truth.

- [ ] Specify a draft that places the rendered chart, the wav, and caption cues on separate tracks.
- [ ] Candidate adapter, to be read for license and schema only when this task starts: Hao0321/video-autopilot-kit (user snapshot: MIT).
- [ ] video-shotcraft stays out of v1.
- [ ] Opening the draft in CapCut and exporting again is a human check. It does not replace the Task 5 ffprobe gate.

## Task 7 — One owned pilot

- [ ] Pick one pain already in the Hermes material (PP-0023 or PP-0039). Write the script from that pain. The competitor manifest may set pacing only.
- [ ] Human watches muted: the sweep, the FVG and the $30 budget are still visible.
- [ ] Human listens: no profit promise, budget before entry, one CTA.
- [ ] Record the pilot id in `livrables/test_reports/` when it exists. Do not claim a pilot in this plan.

## What this turn did not do

- Did not clone a repository.
- Did not install ffmpeg wrappers, MCP servers, or Python video tools.
- Did not render a short.
- Did not verify star counts or licenses against the GitHub API.
- Did not watch the tutorial list.
