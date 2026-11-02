# SPEC — P3 ChartAnimator Local Renderer

- Spec ID: `SPEC-P3-CHARTANIMATOR-LOCAL-RENDERER-v1`
- Revision: `v1.0-planning`
- Status: `PLANNING_ONLY / IMPLEMENTATION_NOT_AUTHORIZED`
- Date: `2026-11-02`
- Repository: `G:\Other computers\My Computer\Project\chart`
- Owner: Hermes Orchestrator
- Future builder: Claude Code clean-room builder in an isolated worktree
- Future verifier: Hermes parent + independent read-only auditor
- Human authority: Alan requested the P3 brief/spec/plan/debate packet. This authorizes planning documents only, not source edits, dependency installation, server start, rendering, workflow wiring or external action.
- Canonical cross-repo authority: `C:\Users\Admin\youtube\docs\SPEC-CHARTANIMATOR-HERMES-CROSS-REPO-INTEGRATION-v1.1-PLANNING.md`
- Repository capability manifest: `G:\Other computers\My Computer\Project\chart\livrables\specs\CHARTANIMATOR-BRIDGE-CHART-CAPABILITY-MANIFEST-v1.md`
- Execution plan: `G:\Other computers\My Computer\Project\chart\livrables\architecture\PLAN-P3-CHARTANIMATOR-LOCAL-RENDERER-v1.md`
- Hermes brief: `G:\Other computers\My Computer\Project\chart\livrables\specs\HERMES-CLI-BRIEF-P3-CHARTANIMATOR-LOCAL-RENDERER-v1.md`
- Debate record: `G:\Other computers\My Computer\Project\chart\livrables\architecture\DEBATE-P3-CHARTANIMATOR-LOCAL-RENDERER-v1.md`

> This document is subordinate to the canonical cross-repository specification. It defines only the ChartAnimator-local P3 renderer. It does not redefine YouTube package identity, Aegis approval or WF22 integration.

---

## 1. No Five, No Run

- Workflow ID: `P3-CHART-LOCAL-RENDERER` (local milestone, not a Dagu workflow ID).
- Automation level: future local implementation/render `L2 / S1`; current task is documentation only.
- Primary owner: Hermes Orchestrator; Claude Code is the future source/test builder.
- Human approval: planning packet authorized; build/install/render not authorized; every L3 external action remains separately Aegis-gated.
- Planned output paths: source/tests inside the exact future allowlist; fixture media and evidence under `livrables/p3_renderer/<run_id>/`.

A future build run must create its own run record before any source edit. This planning document is not that run record.

## 2. Goal

Build a local-only, supervised ChartAnimator renderer that accepts one validated immutable chart directive, loads exact Canvas state without the manual importer, renders one 15-second educational XAUUSD illustration at a frozen profile, returns MP4 + PNG + technical manifest, and performs no network send, upload, editor handoff or publication.

## 3. Definition of Done

P3 is complete only when an independently supervised local fixture demonstrates:

```text
validated directive bytes
→ exact Canvas state
→ explicit readiness/status protocol
→ browser capture
→ FFmpeg normalization
→ ffprobe read-back
→ output hashes + manifest
→ human visual review record
```

Completion requires all P3 acceptance criteria in section 15. A green unit shard, a Blob download, an existing MP4, or a builder's prose does not close P3.

## 4. P3 mapping to the canonical roadmap

This packet groups the ChartAnimator-local slices of the canonical roadmap:

- canonical M1 consumer slice: directive schema/fixture validation inside ChartAnimator;
- canonical M2: local `/render` surface and stable browser API;
- canonical M3: supervised Playwright capture, FFmpeg/ffprobe and local fixture receipt.

It explicitly excludes canonical M4 WF22 wiring and M5 human/editor/external pilot.

## 5. Verified current capability

Observed in the owned repository:

- Next.js 14, React 18, TypeScript, Zustand and Canvas are present.
- `src/types/chart.ts` defines Candle, Overlay, reveal modes and aspect ratios.
- `src/utils/hermesEngine.ts` produces educational Candle/Overlay sequences.
- `src/components/StageCanvas.tsx` renders Canvas and an `ILLUSTRATION` label.
- `src/utils/recorder.ts` uses `canvas.captureStream()` and `MediaRecorder`.
- `src/components/ExportModal.tsx` exports manually by selecting the first Canvas and triggering browser download.
- PNG export exists through Canvas `toDataURL`.
- Google Chrome and Microsoft Edge executables are already installed locally.
- FFmpeg/ffprobe are available through the installed FFmpeg toolchain.

Not implemented:

- `/render` route;
- exact directive validator;
- atomic directive-to-store adapter;
- stable render Canvas identity;
- `window.chartAnimatorBridge` status API;
- supervised Playwright process;
- media technical manifest and output hash receipt;
- deterministic key-frame acceptance.

## 6. Current baseline and blockers

Observed on `2026-11-02 10:49 +07:00`:

### Disk

- C free: `9.60 GiB` (`10,304,217,088 bytes`).
- G free: `4.36 GiB` (`4,685,336,576 bytes`).
- Both exceed the hard stop of 3 GiB, but neither satisfies the preferred pilot target of 10 GiB on each relevant volume.

P3 build/install/render remains blocked until either:

1. C and G each have at least 10 GiB free; or
2. a later approved work order selects another measured scratch/output volume and proves all browser/cache/temp/output writes and cleanup there.

### Repository baseline

The chart worktree is dirty before P3:

- modified `livrables/specs/SPEC-TK-8899-gi-ng---c.md`;
- modified `src/components/HermesChatModal.tsx`;
- modified `src/components/HermesSidebarPanel.tsx`.

P3 must not edit, reset, clean, stash or roll back these paths.

### Baseline tests

`npm test` was exercised during planning:

- 18 test files total;
- 15 passed, 3 failed;
- 116 tests total;
- 113 passed, 3 failed.

Failures:

- `azzamOpsLive.test.ts`: localhost API unavailable on port 3000;
- `youtubeAuditLive.test.ts`: localhost API unavailable on port 3000;
- `dashboardLive.test.ts`: stale hard-coded expected registry total `62`, observed `72`.

These failures are not P3 evidence and are not authorized P3 repairs.

`node node_modules/typescript/bin/tsc --noEmit` was exercised and failed on syntax errors in the two pre-existing modified component files above. P3 cannot claim full-repository typecheck green while that baseline remains unresolved.

### Dependency

- Python Playwright is absent from default `python` and `py -3.12`.
- No installation is authorized by this planning packet.
- A future dependency gate must reuse installed Chrome/Edge and prohibit Playwright browser download unless Alan separately approves it.

## 7. Scope

### In scope after separate build authorization

- exact directive validation inside ChartAnimator;
- local-only render surface bound to loopback;
- stable Canvas selector/ID;
- atomic validated directive load into the existing Zustand/Canvas model;
- explicit browser bridge status;
- fixture video and PNG export;
- supervised Playwright client using an existing installed browser;
- FFmpeg H.264/yuv420p normalization;
- ffprobe technical validation;
- SHA-256 and render manifest;
- fixture-only tests, supervision tests and independent audit.

### Out of scope

- WF22/Dagu integration;
- YouTube repository edits;
- real content package ingestion;
- title, thumbnail, SEO, hook or retention utilities;
- `youtube-agent-skill` runtime dependency;
- Gemini/provider calls;
- arbitrary local file loading from browser URL;
- Drive, Telegram, Sheets, Cloudflare, CapCut or YouTube action;
- editor handoff;
- publication;
- third-party REA or decompiled source review;
- changing current HermesChatModal/HermesSidebarPanel work;
- fixing unrelated test/typecheck baseline failures.

## 8. Frozen pilot profile

P3 uses one synthetic local fixture only:

- channel ID: `UCBZ7LaffmEPv91sWcfroJdQ`;
- symbol: `XAUUSD`;
- strategy: `LIQUIDITY_SWEEP`;
- truth class: `EDUCATIONAL_ILLUSTRATION`;
- synthetic sequence: `true`;
- market data source: `NONE`;
- ratio: `16:9`;
- exact output dimensions: `1920x1080`;
- FPS: `30`;
- target duration: `15.0 seconds`;
- video: H.264 MP4, pixel format `yuv420p`, no required audio stream;
- thumbnail: PNG at `8.0 seconds`;
- mandatory visible watermark: `EDUCATIONAL ILLUSTRATION — NOT FINANCIAL ADVICE`;
- one case ID: `case1-liquidity-sweep`.

No real price feed, account balance, trade result, profit, win rate or live signal may appear.

## 9. Input contract

P3 consumes a local fixture conforming to `chart-directive/1.0` from the canonical spec. Required stable identity:

```text
(content_item_id, artifact_version, case_id, directive_sha256)
```

P3 fixture identity is explicitly synthetic and must use a test namespace, for example:

```text
content_item_id = TEST-P3-LIQUIDITY-SWEEP-001
package_id = TEST-P3-PACKAGE-001
artifact_version = 1
case_id = case1-liquidity-sweep
```

Validation fails closed for:

- wrong owned channel ID;
- unknown top-level field;
- missing source/script/package hash;
- malformed or non-contiguous candle indexes;
- invalid OHLC bounds;
- overlay outside candle range;
- unsupported strategy/reveal mode;
- missing or altered watermark;
- non-illustration truth class without a supported source adapter;
- duration/FPS/profile outside frozen values;
- NaN/Infinity or unsafe numeric input;
- path/URL fields not explicitly allowed.

The browser receives a validated object or safe directive ID. It never receives an arbitrary filesystem path through the query string.

## 10. Proposed local architecture

```text
fixture directive bytes
→ Python/TS schema validation
→ safe local render request
→ /render surface
→ atomic directive-to-store adapter
→ <canvas id="chart-render-canvas">
→ window.chartAnimatorBridge
→ MediaRecorder intermediate output
→ Playwright download collection
→ FFmpeg normalized MP4
→ ffprobe receipt
→ SHA-256 + render-manifest.json
```

### Browser API

Required owned API:

```text
window.chartAnimatorBridge.loadDirective(validatedDirective)
window.chartAnimatorBridge.getStatus()
window.chartAnimatorBridge.startRender()
window.chartAnimatorBridge.exportThumbnail()
window.chartAnimatorBridge.cancel()
```

Required statuses:

```text
CREATED
LOADING
CANVAS_READY
RECORDING
RECORDED
TRANSCODING
VALIDATING
COMPLETE
FAILED
CANCELLED
TIMED_OUT
```

Unknown transitions fail. Terminal callback is idempotent and emitted once.

## 11. Determinism model

Exact MP4 byte equality is not required because media container metadata and browser encoding may vary. P3 determinism is established through:

- exact directive bytes/hash;
- exact normalized store projection;
- exact dimensions/profile;
- frozen ChartAnimator source snapshot identifier;
- key-frame PNG perceptual/pixel-tolerance comparison;
- ffprobe stream/profile comparison;
- semantic state/overlay equality;
- stable manifest fields excluding explicitly listed volatile timestamps/container metadata.

The current `setTimeout` + React-state frame loop is not assumed deterministic. The builder must prove paint completion at each required frame or introduce the smallest owned render-step synchronization needed for the fixture.

## 12. Process supervision

The P3 supervisor must retain:

- exact server process handle;
- exact browser process/context handle;
- content/case identity;
- started time and current state;
- stdout/stderr/log paths;
- output/temp paths;
- hard wall-clock limit.

Proposed budgets for the single 15-second fixture:

- server readiness: 120 seconds;
- Canvas readiness: 60 seconds;
- capture + download: 180 seconds;
- FFmpeg + ffprobe: 120 seconds;
- total supervised run: 600 seconds.

These are hard limits, not ETA promises. On timeout, terminate only the owned server/browser/process tree, write terminal evidence once and preserve diagnostics.

## 13. Proposed future edit allowlist

The exact build work order may narrow this list; it may not widen it silently.

### New files

- `src/app/render/page.tsx`
- `src/components/HeadlessRenderSurface.tsx`
- `src/types/chartDirective.ts`
- `src/utils/chartDirectiveValidator.ts`
- `src/utils/chartRenderBridge.ts`
- `src/utils/renderStatus.ts`
- `scripts/p3_render_fixture.py`
- `tests/chartDirective.test.ts`
- `tests/renderStatus.test.ts`
- `tests/fixtures/p3_renderer/**`
- `livrables/p3_renderer/**`
- `livrables/test_reports/p3_renderer/**`

### Existing files that may require minimal edits

- `src/components/StageCanvas.tsx` — stable Canvas identity/headless display contract only;
- `src/store/useChartStore.ts` — one atomic validated directive load method only;
- `src/utils/recorder.ts` — deterministic completion/error/diagnostic contract only;
- `MAP.md` — document approved new paths.

### Explicitly prohibited existing files

- `src/components/HermesChatModal.tsx`
- `src/components/HermesSidebarPanel.tsx`
- `src/components/BriefImporterModal.tsx`
- `src/components/ExportModal.tsx`
- `src/app/api/hermes/scripts/route.ts`
- current unrelated spec/ticket files
- root workflow, credential, provider or external integration files

No package/lock edit is permitted until the dependency selection gate is separately approved.

## 14. Output contract

Fixture output root:

```text
livrables/p3_renderer/<run_id>/
```

Required files:

```text
input.directive.json
input.directive.sha256
case1-liquidity-sweep.intermediate.webm  # only if browser emits WebM
case1-liquidity-sweep.mp4
case1-liquidity-sweep.thumb.png
case1-liquidity-sweep.render-manifest.json
ffprobe.json
browser-status.jsonl
stdout.log
stderr.log
human-visual-review.md
```

Intermediate files are cleaned only after normalized output and evidence are verified. Cleanup is scoped to the exact run directory.

The manifest binds:

- directive ID/hash;
- fixture/package/content/version/case identity;
- source snapshot/dirty-baseline identifier;
- browser executable/version;
- actual MediaRecorder MIME;
- output profile and observed ffprobe fields;
- output byte sizes and SHA-256;
- watermark/compliance status;
- state timestamps and terminal status;
- diagnostics paths;
- `external_actions: NONE`.

## 15. Acceptance criteria

### Contract

- `P3-01`: Valid fixture is accepted and normalized without changing semantic fields.
- `P3-02`: Wrong channel, invalid OHLC, bad overlay, unknown field, missing watermark and source/hash mismatch fixtures are rejected before browser start.
- `P3-03`: Directive bytes and SHA-256 are retained in output manifest.

### Render surface

- `P3-04`: `/render` loads without manual modal interaction and exposes exactly one stable render Canvas.
- `P3-05`: Valid directive produces the expected normalized Candle/Overlay/store projection.
- `P3-06`: Status transitions follow the canonical state machine; invalid/backward transitions fail.
- `P3-07`: Local server binds loopback only and no arbitrary local path is accepted.

### Media

- `P3-08`: Browser output is collected under the exact run/case identity.
- `P3-09`: FFmpeg output is MP4/H.264/yuv420p, 1920x1080, 30 FPS, duration `15.0 ± 0.5 seconds`.
- `P3-10`: PNG is 1920x1080 at the frozen 8-second frame.
- `P3-11`: Watermark is visible in the rendered PNG/video and human visual review records PASS/FAIL with reasons.
- `P3-12`: ffprobe receipt and output hashes exactly match manifest members.

### Supervision and failure

- `P3-13`: Server/browser/capture/transcode timeout paths terminate owned processes and emit one terminal result.
- `P3-14`: Retry with the same directive is idempotent; conflicting bytes under the same identity are rejected.
- `P3-15`: Failed or partial render never reports COMPLETE and never deletes diagnostics.
- `P3-16`: No network provider call, upload, send, workflow write or external action occurs.

### Determinism and regression

- `P3-17`: Two runs of the same fixture have equal semantic store state and key-frame images within the frozen tolerance.
- `P3-18`: Existing focused coordinates/Hermes engine tests remain green in the isolated P3 worktree.
- `P3-19`: Independent auditor maps every P3 criterion to evidence and returns `SAFE_FOR_LOCAL_FIXTURE_CLOSE` or `NOT_SAFE`.
- `P3-20`: Parent verifies actual files, commands and outputs; builder self-report is not accepted as closure.

## 16. Verification commands

### Exercised planning baseline

```text
npm test
→ 113 passed, 3 failed; exit 1

node node_modules/typescript/bin/tsc --noEmit
→ syntax errors in pre-existing modified files; exit 2
```

### Future proposed P3 commands

The exact focused test names and CLI flags are not yet implemented and therefore are not advertised as working commands. The future builder must add them and the parent must execute them directly. Existing safe candidate commands after source implementation include:

```text
npm test
node node_modules/typescript/bin/tsc --noEmit
```

P3 closure must report baseline failures separately from P3-introduced failures. It may use an isolated worktree to obtain a clean source baseline, but may not rewrite the current dirty worktree.

## 17. Security and compliance

- Bind server to `127.0.0.1`; reject non-loopback listen configuration.
- No credentials, OAuth, provider keys or user secrets.
- No Gemini/LLM call inside renderer.
- No file URL/path from untrusted directive input.
- No REA or decompiled third-party source.
- Renderer cannot write canonical YouTube state.
- Fixture is synthetic and carries the mandatory educational watermark.
- No profit claim, live signal, real account or fabricated result.
- External actions remain blocked and require separate exact Aegis approval.

## 18. Stop conditions

Stop and report `BLOCKED` before source edits or runtime if:

- repository authority does not explicitly authorize P3 build;
- disk target is unmet and no approved alternate volume exists;
- target path collides with unreviewed user work;
- isolated baseline cannot be established;
- dependency requires browser/binary download or lifecycle scripts not approved;
- exact fixture/schema is missing;
- any requested change crosses into WF22, Dagu, external action or unrelated dirty files.

## 19. Maturity and handoff

Current maturity:

```text
SPECIFIED (planning)
NOT CONTRACT_COMPLETE
NOT WORKFLOW_WIRED
NOT ARTIFACT_RENDERED
NOT RUNTIME_VERIFIED
NOT EXTERNAL_DEPLOYED
```

Next authorized action, if Alan chooses it later: read-only Claude Code review of this packet, followed by an independent spec audit. Build authorization remains a separate decision after blockers are resolved.
