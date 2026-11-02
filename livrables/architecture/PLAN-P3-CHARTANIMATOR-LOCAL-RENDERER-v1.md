# PLAN — P3 ChartAnimator Local Renderer

- Plan ID: `PLAN-P3-CHARTANIMATOR-LOCAL-RENDERER-v1`
- Status: `PLANNING_ONLY / NO_RUNTIME_AUTHORITY`
- Date: `2026-11-02`
- Primary spec: `G:\Other computers\My Computer\Project\chart\livrables\specs\SPEC-P3-CHARTANIMATOR-LOCAL-RENDERER-v1.md`
- Canonical authority: `C:\Users\Admin\youtube\docs\SPEC-CHARTANIMATOR-HERMES-CROSS-REPO-INTEGRATION-v1.1-PLANNING.md`

## 1. Operating model

```text
Alan / Cockpit
  → authorizes exact phase
Hermes / Brain
  → reconciles authority, creates Run Record, freezes work order
Claude Code / Workshop
  → edits one isolated ChartAnimator worktree
Hermes parent verifier
  → runs tests and runtime probes itself
Independent auditor
  → adversarially maps acceptance to evidence
Alan / Cockpit
  → accepts or rejects local fixture outcome
```

No two builders edit the same worktree. Telegram/chat is not canonical state. Every handoff uses files, hashes and a run-bound evidence directory.

## 2. Why an isolated worktree is the default

The current chart worktree contains unrelated modified source and fails full typecheck. P3 should not touch or hide those changes. The smoothest path is a separately authorized P3 worktree from a frozen repository revision, with:

- exact base commit recorded;
- zero dependency on current modified Hermes chat/sidebar files;
- only P3 allowlisted edits;
- scoped before/after manifest;
- no merge/cutover until local closure and human review.

If the frozen base lacks a required owned renderer capability, stop and identify the exact missing commit/file; do not copy unreviewed dirty files wholesale.

## 3. Phase sequence

### P3-0 — Authority, disk and baseline preflight

Owner: Hermes.

Inputs:

- chart `AGENTS.md`, `CLAUDE.md`;
- P3 spec/plan/brief/debate;
- canonical cross-repo spec;
- live disk and git state.

Actions after separate authorization:

1. Create validator-compatible P3 Run Record with No Five fields.
2. Recheck C/G/selected scratch free bytes.
3. Require 10 GiB on each relevant volume or an approved relocated scratch/output contract.
4. Record current chart base commit and dirty paths without modifying them.
5. Create isolated P3 worktree only if authorized.
6. Capture source/test before-hash manifest.
7. Confirm Chrome/Edge and FFmpeg/ffprobe paths.
8. Inspect the proposed Playwright package metadata, license, lifecycle behavior and browser-download behavior before install.

Exit gate:

- authority aligned;
- disk gate passed;
- isolated baseline identified;
- no collision;
- dependency plan approved.

Otherwise: `BLOCKED`, no source edit.

### P3-1 — Contract and fixture slice

Owner: Claude builder; Hermes verifies.

Inputs:

- canonical `chart-directive/1.0` shape;
- frozen synthetic Liquidity Sweep profile;
- exact negative fixture list.

Outputs:

- ChartAnimator directive types/validator;
- positive fixture;
- wrong-channel, invalid-OHLC, bad-overlay, missing-watermark, hash-mismatch, unknown-field and unsafe-path negatives;
- deterministic normalized projection.

Rules:

- no browser;
- no server;
- no package install;
- no importer/manual UI;
- no network;
- no external action.

Exit gate:

- all contract negatives fail closed;
- exact directive bytes/hash preserved;
- parent focused tests pass;
- independent source review finds no silent defaults that fabricate truth.

### P3-2 — Render surface

Owner: Claude builder; Hermes verifies in browser.

Outputs:

- `/render` surface;
- `HeadlessRenderSurface`;
- stable `<canvas id="chart-render-canvas">`;
- one atomic directive-to-store load method;
- `window.chartAnimatorBridge` with canonical statuses;
- loopback-only runtime contract.

Rules:

- no manual modal automation;
- no `/api/hermes/scripts` use;
- no newest-file selection;
- no arbitrary path in query string;
- no provider call;
- one supported fixture profile only.

Exit gate:

- browser opens exact fixture surface;
- Canvas dimensions/state/watermark verified;
- invalid directive never reaches `CANVAS_READY`;
- backward/unknown status transitions rejected.

### P3-3 — Recorder and supervised browser bridge

Owner: Claude builder for source; Hermes owns execution.

Outputs:

- recorder completion/error contract;
- Python supervisor using an existing installed Chrome or Edge executable;
- retained server/browser handles;
- stdout/stderr/status evidence;
- timeout/cancel/kill/reap behavior;
- intermediate browser media capture.

Dependency policy:

- use `py -3.12 -m pip`, never bare `pip`;
- no global install;
- install only in the approved isolated environment/cache;
- do not run `playwright install` or download a browser when system Chrome/Edge is approved and available;
- any lifecycle/binary/network behavior outside reviewed metadata stops the phase.

Exit gate:

- single fixture reaches `RECORDED` under supervision;
- timeout path kills only owned processes;
- duplicate terminal callback is prevented;
- no orphaned port/process remains.

### P3-4 — Normalize, validate and seal media

Owner: Hermes supervisor.

Actions:

1. Detect actual MediaRecorder MIME.
2. Preserve intermediate file until output verification.
3. Normalize to H.264/yuv420p MP4 through frozen FFmpeg arguments.
4. Export PNG at the frozen frame.
5. Run ffprobe and parse technical receipt.
6. Hash all required members.
7. Write render manifest.
8. Perform human visual review with reasons.
9. Clean only verified owned temp files.

Exit gate:

- 1920x1080;
- 30 FPS;
- 15.0 ± 0.5 seconds;
- H.264/yuv420p;
- PNG 1920x1080 at 8 seconds;
- mandatory watermark visible;
- manifest byte/hash/ffprobe agreement;
- `external_actions: NONE`.

### P3-5 — Determinism and negative runtime probes

Owner: Hermes verifier + independent auditor.

Probes:

- same directive twice;
- conflicting bytes under same identity;
- wrong channel;
- missing watermark;
- invalid candle/overlay;
- server readiness timeout;
- Canvas readiness timeout;
- browser capture failure;
- FFmpeg failure;
- corrupt/missing output;
- retry after partial run;
- attempt to supply local path/remote URL;
- attempt to bind non-loopback server.

Exit gate:

- semantic/key-frame determinism passes tolerance;
- every failure is fail-closed;
- diagnostics retained;
- no external side effect.

### P3-6 — Independent closure audit

Owner: separate read-only auditor.

Inputs:

- P3 spec;
- acceptance-to-evidence map;
- exact source delta;
- test/runtime output;
- render manifest and media receipt;
- baseline failure ledger.

Auditor returns:

```text
Facts
Evidence
Defects
Unobserved criteria
Verdict: SAFE_FOR_LOCAL_FIXTURE_CLOSE | NOT_SAFE
```

Hermes independently re-runs targeted checks for every reported fix. Green tests alone do not close reproduced defects.

## 4. Rhythm and handoff discipline

To keep execution smooth:

1. One phase owner at a time.
2. One immutable work order and run ID.
3. Builder never executes external action.
4. Parent runs tests/runtime; builder does not self-certify.
5. Every phase emits one concise terminal report:
   - target;
   - state;
   - evidence path;
   - failures/missing outputs;
   - next owner.
6. Do not start the next phase until the current exit gate passes.
7. Do not mix contract work, browser work and workflow wiring in one edit batch.
8. Keep current dirty worktree untouched; compare scoped deltas only.
9. Preserve the same fixture identity throughout P3.
10. Never infer approval from a PASS.

## 5. Owner/input/output/KPI map

| Phase | Owner | Input | Output | KPI | Next owner |
|---|---|---|---|---|---|
| P3-0 | Hermes | authority/disk/git | approved preflight packet | zero unauthorized action | Claude builder |
| P3-1 | Claude | schema/fixtures | validator + tests | all contract negatives fail | Hermes verifier |
| P3-2 | Claude | validated fixture | render surface/status API | exact Canvas state/readiness | Hermes browser verifier |
| P3-3 | Claude + Hermes | render surface | supervised capture | no orphan, one terminal result | Hermes media verifier |
| P3-4 | Hermes | intermediate media | MP4/PNG/manifest | profile/hash/read-back match | Independent auditor |
| P3-5 | Hermes + auditor | current implementation | negative/determinism evidence | fail closed, stable semantics | Closure auditor |
| P3-6 | Auditor | acceptance evidence | narrow verdict | all P3 criteria observed | Alan |

## 6. Evidence layout

```text
livrables/p3_renderer/<run_id>/
livrables/test_reports/p3_renderer/<run_id>/
  preflight.json
  before-manifest.json
  dependency-review.md
  focused-tests.txt
  typecheck.txt
  browser-status.jsonl
  ffmpeg-command.json
  ffprobe.json
  render-manifest.json
  negative-probes.json
  acceptance-map.md
  independent-audit.md
  final-verdict.md
```

Credentials, tokens and unrelated local paths are prohibited in evidence.

## 7. Baseline treatment

Current planning baseline is not green:

- `npm test`: 113 passed, 3 failed;
- typecheck: syntax errors in pre-existing modified chat/sidebar files.

P3 may not repair these unrelated paths. The future isolated worktree baseline must be exercised and recorded. If clean-base full tests still fail, list exact failures and establish a scoped P3 regression set; never summarize a partial suite as all tests passing.

## 8. Rollback

P3 is isolated and not wired. Rollback means:

- stop owned server/browser processes;
- preserve evidence and failed outputs;
- remove only the separately approved P3 worktree/output after Alan selects cleanup;
- never reset/clean/stash the active chart worktree;
- no YouTube rollback is needed because P3 does not touch YouTube state.

## 9. Final gate

P3 can close only as:

```text
LOCAL_FIXTURE_RENDERER_VERIFIED
```

It cannot claim:

```text
WF22_WIRED
EDITOR_READY
PRODUCTION_READY
PUBLISHED
RETENTION_IMPROVED
```

Those require later milestones and separate human decisions.
