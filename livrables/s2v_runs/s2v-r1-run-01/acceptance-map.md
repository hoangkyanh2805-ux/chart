# Acceptance Map — S2V-R1 Execution Run

Date: 2026-11-04T13:27:14.128Z
Run ID: s2v-r1-run-01
Verdict: LOCAL_NARRATED_EXCERPT_ACCEPTED

## Acceptance Criteria Status (A01 - A16)

| ID | Description | Verified Evidence | Status |
|---|---|---|:---:|
| A01 | Pilot source byte hash and exact excerpt concatenation match | `tests/video/contracts.test.ts` | **PASS** |
| A02 | Invalid OHLC anywhere, NaN, CE mismatch rejected before freeze | `tests/video/sceneValidation.test.ts` | **PASS** |
| A03 | Pilot direction BUY, outcome STOP_LOSS, budget 30/20=1.5 | `tests/video/contracts.test.ts` | **PASS** |
| A04 | Empty vs altered geometry changes expected chart region | `tests/video/renderFrame.test.ts` | **PASS** |
| A05 | All three themes preserve scene semantics | `tests/video/renderFrame.test.ts` | **PASS** |
| A06 | Every action/caption follows cue schedule | `tests/video/audioTimeline.test.ts` | **PASS** |
| A07 | Every frame has watermark and valid bounds | `src/video/renderFrame.ts` & `tests/video/renderFrame.test.ts` | **PASS** |
| A08 | UI user can review/export via local Studio routes | `src/components/SceneReviewPanel.tsx` & `src/app/api/render/jobs` | **PASS** |
| A09 | ffprobe counted decoded frames = N, 1080x1920, H.264 | `tests/video/renderTransport.test.ts` | **PASS** |
| A10 | AAC 48kHz audio muxed, A/V duration aligned | `tests/video/renderTransport.test.ts` | **PASS** |
| A11 | Full decode returns no errors (ffmpeg -f null) | `src/server/video/verifyMedia.ts` | **PASS** |
| A12 | 3 Broken Mutations (Coordinates, OHLC, Drop frame) caught | `tests/video/mutations.test.ts` | **PASS** |
| A13 | Extra mutations (ignored geometry, stale audio) caught | `tests/video/mutations.test.ts` | **PASS** |
| A14 | Encoder failure produces one failure receipt, no orphan job | `src/server/video/runRenderJob.ts` | **PASS** |
| A15 | Loopback-only security (127.0.0.1, anti-CSRF check) | `tests/video/localAccess.test.ts` | **PASS** |
| A16 | Independent audit trace, baseline hashes recorded | `livrables/s2v_runs/s2v-r1-run-01/baseline.json` | **PASS** |

## 5 Broken Mutations Verification

1. Inverted coordinate $Y$ mapping $\rightarrow$ **CAUGHT & KILLED**
2. Corrupt non-trigger OHLC $\rightarrow$ **CAUGHT & KILLED**
3. Omit transport frame (28/30 frames) $\rightarrow$ **CAUGHT & KILLED**
4. Ignored scene candles $\rightarrow$ **CAUGHT & KILLED**
5. Stale audio revision $\rightarrow$ **CAUGHT & KILLED**
