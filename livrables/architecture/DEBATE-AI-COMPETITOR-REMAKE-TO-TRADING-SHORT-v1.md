# Debate record — Competitor remake to trading short v1

Date: 2026-11-10. Status: PARENT_BRAINSTORM_COMPLETE / NO_CODE / USER_REVIEW_PENDING.

## Participation truth

The user asked for brainstorm, plan and spec, and said not to build code. This file is the parent's decision record. No repo was cloned, no GitHub API was called in this turn, and no renderer was executed.

The star counts, licenses and push dates in the user brief are a user-supplied snapshot. This debate does not re-certify them. A license or star figure below is only as strong as that snapshot until a later shell check records the GitHub API response.

## Problem

Produce a 9:16 XAUUSD short for `@azzammastertradinggold` from a competitor URL:

URL → structure only → owned script ≤ 48s → owned OHLC chart → MP4 or a CapCut draft a human can finish.

Three constraints bind every option:

1. Clean-room: learn structure, redraw every pixel and rewrite every word with channel data.
2. Financial integrity: real OHLC rules, SMC overlays, Risk Budget $30 before entry, SL 20 pips, 0.05 lot, R:R ≥ 1:3.5, label `ILLUSTRATION / NOT FINANCIAL ADVICE`.
3. Clock: `ffprobe` duration ≤ 48.00s. A writing target of 110–120 words does not override the clock.

## Evidence already in this repo

- Spec v1.0.0 (`livrables/specs/SPEC-AI-COMPETITOR-REMAKE-TO-TRADING-SHORT-v1.md`) already drew the five-stage pipeline and named MoneyPrinterTurbo as a muxer and `write_script_5step.py` as the script engine.
- `write_script_5step.py` is not in the tree. The script rules that do exist are the Hermes skills: `hermes-director`, `hermes-hook-retention`, `hermes-smc-verifier`, `hermes-funnel-architect`.
- The brief says the channel already has skills `youtube-short-renderer` and `capcut-mcp-video-pipeline`. A search of this repo and of `SKILL.md` files under the user profile did not find those names. This plan does not depend on them.
- Chart and export code that does exist: `src/components/StageCanvas.tsx`, `src/components/ChartCanvas.tsx`, `src/components/canvas/renderPaperTheme.ts`, `src/video/renderFrame.ts`, `src/server/video/runRenderJob.ts` (PNG frames piped to local ffmpeg).
- `.claude/skills/video_pipeline.md` still describes `canvas.captureStream(60)` and MediaRecorder. The recovery debate already selected awaited PNG frames plus ffmpeg for the first reliable export. This remake spec follows that export path.
- S2V recovery is a different milestone (narrated lesson, loss outcome allowed, duration ≤ 120s). This remake milestone does not redefine S2V-R1.

## D1 — Copy the competitor file, or copy the structure?

| Option | Benefit | Risk | Decision |
|---|---|---|---|
| hypit-ai/hypit | One command clones footage, captions, B-roll, effects; word-level sync via WhisperX | User snapshot: license `NOASSERTION` / Hypit Open Source, not MIT. Clones the other video's pixels. | Rejected for this channel |
| slm/openmontage | Transcript, pacing, scenes, concepts, cost | User snapshot: AGPL-3.0. Large surface (12 pipelines). | Rejected as a dependency |
| rea-video + claude-video | Shot list, what is camera / AI / code, transcript and frames for the agent | Two extra tools to install later. Output is a plan, not a video. | Selected for Stage 1 |

Hypit tutorial links stay in the study appendix. They are not an install step.

Counterargument: Hypit is the strongest "remake" product in the brief. Resolution: the channel needs a new trading short, not a face-swap of someone else's edit. Apache-2.0 rea-video and MIT claude-video are enough to steal the rhythm on paper.

## D2 — Reframe their pixels, or draw ours?

| Option | What it actually does | Decision |
|---|---|---|
| open-clip-studio, autoclip, Anil-matcha/AI-Youtube-Shorts-Generator, purffle-shorts `clip` | Cut or vertical-crop an existing file | Rejected as the producer |
| ChartAnimator.io paid export | Native OHLC, FVG, order block, 16:9 and 9:16 | Product we are rebuilding. Not a runtime dependency |
| 007Sancheti/candlestick-animator | Pattern animation and a ChartSpec JSON | Schema reference only. Do not vendor the repo |
| Remotion UI candlestick, reactvideoeditor template | Wick-then-body stagger | Timing reference only |
| In-repo canvas + `runRenderJob.ts` | OHLC, overlays, deterministic frames, ffmpeg | Selected chart and MP4 path |

purffle-shorts (user snapshot: MIT, ffmpeg, no GPU, no API key, MCP verbs `plan` / `make` / `clip`) is a useful shape for a future local MCP. Its `clip` verb cuts a long video. That verb is out of this pipeline.

## D3 — Who may fetch stock footage?

MoneyPrinterTurbo, gyoridavid/short-video-maker, itsPremkumar/Automated-Video-Generator, SaarD00/AI-Youtube-Shorts-Generator and thestepnoob/shorts-automation all fetch or lay background footage (Pexels or a background file) under a generated script.

Selected: no stock-footage fetch on the trading-short path. A stock clip of a city or a typed "candlestick" is not an OHLC series. The chart layer is the canvas. Music, if used, comes from a file the channel already has the right to use.

Patterns worth keeping, without taking the pipeline:

- short-video-maker: Kokoro TTS, then Whisper word timestamps, exposed over MCP.
- SaarD00: narrative shape Hook → Context → Mechanism → Twist. Map it onto the four subtitle stages already required by `.claude/rules/semantic_validation.md`.
- MoneyPrinterTurbo: batch CLI and a WebUI exist. They are not the muxer for this spec. Spec v1.0.0 named it as the muxer; v1.1.0 withdraws that.

## D4 — How long is "under 50 seconds"?

| Rule | Result at a normal read |
|---|---|
| User gate | under 50 seconds |
| thestepnoob/shorts-automation | script required to be 50–55s and 110–120 words |
| Spec v1.0.0 | ≤ 48.00s, and a 1.05–1.10 time-stretch if TTS runs long |

Selected clock: container duration ≤ 48.00s by ffprobe, so a slow encode or a trailer frame cannot cross 50s.

Selected words: aim 110–120 words. If the measured voice plus pauses exceeds 48.00s, delete words and synthesize again. v1 does not time-stretch. Stretch changes the voice and breaks word timestamps.

thestepnoob's 50–55s floor is rejected. The 110–120 word band is kept as a writing target only.

120 words at 150 words per minute is exactly 48 seconds with zero silence. Silence for the sweep and the entry card means the safe script is nearer 110 words until a real take is measured.

## D5 — What is a scene?

Semantic rule: four stages of the whole video, not five stacked acts.

| Stage | Share of the 48s | Job |
|---|---|---|
| HOOK | 0–25% (0–12s). First 3s carry the hook | ≤ 6 on-screen words, all caps. Tension in the first sentence |
| TRAP | 25–55% | Liquidity sweep. Wick ≥ 30% of that candle |
| SETUP | 55–80% | FVG, order block, or break-and-retest. C.E. is the 50% of the gap |
| EXECUTION | 80–100% | Risk $30, then entry, SL 20 pips, R:R ≥ 1:3.5, one Telegram line |

The Telegram line sits inside EXECUTION. It is not a fifth scene with its own budget.

Direction: BUY requires TP > entry > SL and a rising close after the trigger. SELL requires SL > entry > TP and a falling close. Illustration prices stay labeled illustration. This spec does not freeze a live XAUUSD print.

## D6 — CapCut now, or after the chart is true?

| Option | Decision |
|---|---|
| video-shotcraft as the editor | Rejected for v1. User snapshot: Apache-2.0, 124–152 shot cards, needs Chromium and `--concurrency=1` on a laptop. It does not own OHLC |
| video-autopilot-kit | Candidate for a later CapCut draft adapter. Not vendored in this turn |
| CapCut AI Template Generator and CapCut trading templates | Allowed as a human step after our frames exist. They must not invent the candles |
| Shipped artifact of v1 | MP4 from local ffmpeg. CapCut draft is Stage 5, optional, and does not block the MP4 gate |

## D7 — Upload from the pipeline?

purffle-shorts, shorts-automation and SaarD00 can post to YouTube or run on a cron. Selected: v1 stops at a verified local MP4 and a title suggestion. No upload, no cron, no account tokens.

## D8 — What v1.0.0 got wrong

| v1.0.0 claim | v1.1.0 correction |
|---|---|
| MoneyPrinterTurbo / remotion-shorts-skill mux the final video | ffmpeg image2pipe muxes picture and voice. remotion-shorts-skill contributes the idea of a duration self-check, tightened from 59s to 48s |
| `write_script_5step.py` writes the script | No such file. A future `compileTradingShort` is specified, not written |
| `src/components/canvas/` is the NLE | Paper theme lives there. The short uses StageCanvas, ChartCanvas, `src/video/renderFrame.ts` and `runRenderJob.ts` |
| Skills `youtube-short-renderer` and `capcut-mcp-video-pipeline` are in the repo | Not found. Do not call them |
| Time-stretch 1.05–1.10 to pass 48s | Cut copy and re-synthesize |
| Gantt starts 2026-11-11 | Dates were a sketch. The plan has unordered-until-approved tasks and no start date |

## Study appendix (not install steps)

User-supplied, not watched in this turn:

- Hypit: `https://www.youtube.com/watch?v=XPZ-m6F_YNU`, `https://www.youtube.com/watch?v=WhZ90Fn_058`, `https://www.youtube.com/watch?v=9Zpq00hfAd4`
- ChartAnimator workflow: `https://www.youtube.com/watch?v=-ag-BZYrsnc`
- Taiwan stock Remotion write-up: `https://ziyu4huang.github.io/blogs/posts/2026-04-08-remotion-claude-code-taiwan-stock-video/`
- MoneyPrinterTurbo: `https://www.youtube.com/watch?v=Qp73G0MPZ2c`, `https://www.youtube.com/watch?v=ctd5SQHaGKw`
- video-shotcraft: `https://www.youtube.com/watch?v=RIJ2rnAIyYA`
- CapCut: `https://www.youtube.com/watch?v=1ztkeAUDLMY`

## Decision in one line

Deconstruct with rea-video and claude-video, rewrite with the Hermes skills under a 48-second clock, draw the chart in the local canvas, mux with ffmpeg, and leave CapCut as an optional human pass.
