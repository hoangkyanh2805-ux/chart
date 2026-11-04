# Script-to-video Recovery Implementation Plan

> **For agentic workers:** Use `subagent-driven-development` after the user selects execution, or `executing-plans` for inline execution. Steps use checkboxes. This plan is documentation, not a record of implemented work.

**Goal:** From the selected real script excerpt, produce a locally exported, narrated MP4 whose chart, captions and outcome match the source.

**Architecture:** Compile a reviewed draft plus measured segment audio into one immutable scene. Preview and dedicated render surface share the same frame renderer. A supervised local Node runner streams frames into FFmpeg and verifies the actual file before making it downloadable.

**Tech stack:** Existing TypeScript/React/Zustand/Canvas; Node supervisor; installed FFmpeg/ffprobe and Chrome/Edge; exact `playwright-core` version selected and pinned during authorized preflight, no browser download.

**Spec:** `../specs/SPEC-SCRIPT-TO-VIDEO-RECOVERY-v1.md` (S2V-R1).
**Pilot:** `../specs/script-to-video-pilot-v1.json`.
**Review status:** Parent-authored; independent design review unavailable because all three delegated design turns failed with usage limits. User has requested preparation of spec/plan, not implementation in this turn.

## Global constraints

- Preserve exact selected narration, including its STOP_LOSS outcome and USD/pip unit.
- Export profile: 1080×1920, 30fps, H.264/yuv420p MP4, AAC48kHz, measured duration≤120s.
- All mandatory validator errors block freeze/export; scores cannot override errors.
- No external calls in offline acceptance; no WF22/Dagu/upload/publication changes.
- Work in isolated source snapshot; do not reset, stash, clean or overwrite pre-existing edits.
- No product dependency installation during this documentation task.
- Full-pipeline acceptance requires editor flow, actual media, human listening/visual review and independent evidence review.

## Review focus

1. Missing/ambiguous price, currency or lot unit preserves uncertainty rather than inventing numbers — Task2.
2. Script changed while TTS is pending cannot receive stale audio — Task4.
3. Long multilingual captions must remain readable without losing words — Tasks2/3/4.
4. Valid JSON with contradictory narrative outcome or FVG entry must fail before rendering — Task2.
5. Encoder failure, wrong Origin, changed scene during export and duplicate/missing frames must fail without orphan jobs or false success — Tasks5/6/7.

## Ownership and dependency graph

```text
T0 baseline → T1 contract fixtures → T2 compiler/validation
                              → T3 renderer → T5 supervisor → T6 editor export
                       T2 → T4 narration/time ──────────────┘
                            T6 → T7 migrate inputs → T8 independent acceptance
```

T3 and T4 can be built in separate worktrees after T2 interfaces are frozen; one integrator reconciles before T5. Never have two agents edit useChartStore simultaneously. Every task returns changed files, tests/exit codes, remaining risks and exact next owner. Max two fix/review iterations per repeated failing gate before re-examining the design; do not loop blind patches.

## Task 0 — Establish a buildable owned baseline

**Files:** inspect five pre-existing modified source/tests identified by audit; targeted repairs only in `src/components/canvas/renderPaperTheme.ts`, `src/data/templates.ts`, `src/store/useChartStore.ts`, `tests/breakoutTrapShortVideo.test.ts`, `tests/paperThemeRenderer.test.ts`. Capture `livrables/s2v_runs/<runId>/baseline.json` and scoped diff; register new evidence folder in MAP.md during build.

**Interfaces:** consumes working-tree snapshot; produces a buildable isolated branch with original edits accounted for. Existing reference-video behavior is not acceptance of script fidelity.

- [ ] Read AGENTS, CLAUDE, S2V spec/plan and audit ledger. Record HEAD, dirty file hashes and disk/tool availability.
- [ ] Create an isolated worktree at known HEAD and copy the five dirty versions plus exact required local assets into it without modifying the original tree. Compare hashes; log where copy differs from HEAD. Do not silently drop unfinished user changes.
- [ ] Pin browser executable and FFmpeg versions. Verify `image2pipe`, `libx264`, AAC, ffprobe and 3GiB+job-reserve capacity. Review/pin playwright-core only when needed; no blanket dependency updates.
- [ ] Run parser/typecheck to capture failures, reconcile duplicate declarations/phase-vs-seconds branches in the isolated files. Keep reference sample as a preset and document which duplicate representation is retained; no global replacement based on a guess.
- [ ] Verify `node node_modules/typescript/bin/tsc --noEmit --incremental false`, focused unit shards and `npm run build` separately with individual exit codes. Fix failures in affected code; do not report a final command's success as success of prior commands.
- [ ] Commit only scoped baseline repair in the implementation worktree after review. Preserve failing outside-scope live tests as separate diagnostics; never run feedback tests without mocks.

**Exit:** application builds in isolated branch; snapshot manifest shows no unexplained loss of prior edits. Requirement A16 baseline prerequisite.

## Task 1 — Define source fixtures and canonical contract

**Create:** `src/video/contracts.ts`, `src/video/canonicalHash.ts`, `tests/fixtures/s2v/pilot.source.json`, `tests/fixtures/s2v/pilot.draft.json`, `tests/fixtures/s2v/fvg.draft.json`, `tests/video/contracts.test.ts`.

**Interfaces:** types exactly as spec §4; `hashCanonical(value: unknown): string` SHA-256 canonical JSON; `verifySource(source: SourceDocument): Result<SourceDocument>`; `makePilotDraft()` fixture helper exported by `tests/fixtures/s2v/factories.ts`.

- [ ] Copy the pilot source selection from documentation fixture, retaining source/excerpt hashes. Author an explicit synthetic storyboard for its seven intent IDs; narration segments carry intentId and caption splitting preserves the contiguous intent group; prices are illustration-only, order=null, outcome STOP_LOSS. Describe expected last adverse candle; do not let the same function generate both expected and actual chart.
- [ ] Write failing source identity tests:

```ts
it('preserves complete selected narration', () => {
  const draft = makePilotDraft();
  expect(draft.narration.map(x => x.text).join('')).toBe(draft.source.selectedText);
  expect(draft.outcome).toBe('STOP_LOSS');
  expect(draft.order).toBeNull();
  expect(draft.budget).toEqual({ riskUsd: 30, slPips: 20, usdPerPip: 1.5 });
});
it('hash changes when narration changes', () => {
  const a = makePilotDraft();
  expect(hashCanonical(a)).not.toBe(hashCanonical({ ...a, outcome: 'TAKE_PROFIT' }));
});
```

- [ ] Run `node node_modules/vitest/vitest.mjs run tests/video/contracts.test.ts`; see missing implementation assertion fail, then implement exact hashing/source rules and rerun.
- [ ] Check offsets are integer, half-open, ordered, non-overlapping and concatenate exactly. Reject hash mismatch; missing source is SOURCE_MISMATCH, not fallback to newest file.
- [ ] Review contract with media/QA owners, then commit scoped files. Acceptance A01/A03.

## Task 2 — Compile scenes and hard validation

**Create:** `src/video/validateDraft.ts`, `src/video/compileScene.ts`, `src/video/semantics.ts`, `tests/video/sceneValidation.test.ts`, `tests/video/compileScene.test.ts`.
**Modify:** `src/utils/jevReflexGate.ts` as adapter to structured checks when callers migrate; do not change external shape blindly before migration.

**Consumes:** SceneDraft, AudioReceipt, source fixture. **Produces:** `validateDraft(draft): Issue[]`, `compileScene(draft): Result<FrozenScene>`; formula derivation and event schedule from spec. `makeAudioReadyPilot()` in fixture factories supplies deterministic *test metadata*, clearly not real voice acceptance.

- [ ] Write red tests for invalid non-trigger OHLC, NaN, reversed order, CE mismatch, missing source, unsupported fields, wrong outcome action and explicit unit ambiguity. Use independent known-good FVG candles with high(C1)=4128, low(C3)=4137 and entry=4132.5.

```ts
it('rejects bad OHLC anywhere, not only trigger', () => {
  const d = makeAudioReadyPilot();
  d.candles[0].high = 0;
  const r = compileScene(d);
  expect(r.ok).toBe(false);
  expect(r.issues.some(x => x.code === 'OHLC_BOUNDS')).toBe(true);
});
it('does not turn a loss lesson into a target win', () => {
  const d = makeAudioReadyPilot();
  d.storyboard.at(-1)!.actions = [{ kind: 'MARK_OUTCOME', outcome: 'TAKE_PROFIT' }];
  expect(compileScene(d).ok).toBe(false);
});
```

- [ ] Implement pure compiler, derive every display/order/overlay number from one source, preserve nulls. Return errors without repairs; optional suggested edits are a separate visible draft operation.
- [ ] Test budget 30/20=1.5 with no lot; accept a lesson with no TP/RR. Test wrong CE and RR labels cannot be supplied independently.
- [ ] Test numeric formatting `$4,132.50` and ambiguous `4.132,50` at the import boundary: unambiguous explicit locale parsed; ambiguity requests correction, no guessed4128.
- [ ] Run the two named suites and contract tests; commit. Acceptance A01/A02/A03/A06, review focus1/4.

## Task 3 — One renderer for all themes

**Create:** `src/video/renderFrame.ts`, `src/video/layout.ts`, `src/video/themes.ts`, `src/video/assets.ts`, `tests/video/renderFrame.test.ts`, `tests/browser/videoLayout.spec.ts`.
**Modify:** `src/components/StageCanvas.tsx`, `src/components/canvas/renderPaperTheme.ts`, `src/components/ChartCanvas.tsx`, `src/app/page.tsx`; bundle fonts under `public/fonts/` with documented provenance.

**Consumes:** FrozenScene and frameIndex. **Produces:** `renderFrame(ctx,scene,index): FrameReceipt`, `loadRenderAssets(): Promise<void>` and fixed-dimension canvas.

- [ ] Write failing regression for ignored geometry, backed by historical probe. Assert chart-region changes when a visible candle/overlay changes while headline/time stay equal; use known expected candle price→Y mapping, not just inequality hashes.

```ts
it('maps higher price above lower price', () => {
  const box = { top: 390, bottom: 1160, min: 100, max: 200 };
  expect(priceToY(200, box)).toBe(390);
  expect(priceToY(100, box)).toBe(1160);
});
```

Define `priceToY(price, {top,bottom,min,max})` in layout.ts; reject degenerate ranges. Browser test imports fixture scene and compares `renderFrame` receipts plus captured chart region for original/changed geometry.

- [ ] Implement pure scene drawing. Move paper textures/fonts/colors into theme tokens; reference candles only in reference preset, never in generic renderer.
- [ ] Implement caption/label measurement and collision errors per fixed safe zones. Test long Vietnamese/English text, empty theme assets and missing fonts; no silent truncation.
- [ ] Preview and /render use identical function/assets. Technical chart view may remain separate editing tool but cannot be the accepted export canvas.
- [ ] Repeat same frame twice in same pinned browser and assert raw PNG equality; render all three themes and assert matching semantic visible IDs/outcome, separate approved visual references.
- [ ] Run `node node_modules/vitest/vitest.mjs run tests/video/renderFrame.test.ts`; browser verification uses installed browser only through Task5 runner until Playwright test configuration is ready. Commit. Acceptance A04/A05/A07/A11.

## Task 4 — Narration assets, cue timing and stale-response isolation

**Create:** `src/video/audioTimeline.ts`, `src/video/audioIdentity.ts`, `src/server/video/assetStore.ts`, `src/app/api/render/assets/route.ts`, `tests/video/audioTimeline.test.ts`, `tests/video/audioIdentity.test.ts`.
**Modify:** `src/store/useChartStore.ts`, `src/utils/audioSync.ts`, `src/components/NleTimeline.tsx`, `src/app/api/tts/generate/route.ts` only for exact segment/identity response contract.

**Consumes:** exact cue text and verified asset bytes. **Produces:** WAV asset receipts, `scheduleCues(narration): Result<{cues,frameCount,audioSampleCount}>`, immutable revision assignment. All function/type names match spec.

- [ ] Acquire real pilot speech per segment by user WAV upload or explicitly requested TTS. Record origin and listen to verify text; no provider call embedded in tests or import. If no real speech, stop media acceptance as AUDIO_MISSING while implementing unit-level behavior.
- [ ] Test exact sample/frame quantization:

```ts
it('pads only the fractional final frame', () => {
  const cues = makeAudioReadyPilot().narration.slice(0, 2);
  cues[0].audio!.sampleCount = 48001;
  cues[1].audio!.sampleCount = 48000;
  const r = scheduleCues(cues);
  expect(r.ok).toBe(true);
  if (!r.ok) throw new Error('unexpected failure');
  expect(r.value.cues[1].startFrame).toBe(31);
  expect(r.value.frameCount).toBe(61);
  expect(r.value.audioSampleCount).toBe(97600);
});
```

- [ ] Test old request resolves after source edit: identity mismatch discards result and leaves new cue audio null. Retain a MATCHED receipt only if cue transcript hash and asset hash both match.
- [ ] Schedule audio from measured samples; construct padded PCM segments and concatenate. Track start/end using integer samples. Test >120s rejection, zero-length speech, malformed upload, wrong extension/mime and frame padding.
- [ ] Preview audio clock drives render frame and NLE boundaries; seeking/pause do not duplicate playback or restart unrelated voice. Never let Web Speech mark audio export-ready.
- [ ] Run named two suites plus compileScene tests; commit. Acceptance A06/A10, review focus2/3.

## Task 5 — Deterministic local media supervisor

**Create:** `src/app/render/page.tsx`, `src/components/HeadlessRenderSurface.tsx`, `src/video/renderBridge.ts`, `src/server/video/runRenderJob.ts`, `src/server/video/verifyMedia.ts`, `scripts/render-scene.mjs`, `scripts/verify-render.mjs`, `tests/video/renderTransport.test.ts`, `tests/video/renderStatus.test.ts`, `tests/browser/renderBridge.spec.ts`.
**Modify:** package.json/package-lock only for reviewed pinned browser automation dependency and named verification scripts; MAP.md for actual modules/output paths.

**Consumes:** FrozenScene and confined audio asset mapping. **Produces:** verified MP4, frame receipt log and manifest via `runRenderJob(scene,options): Promise<JobReceipt>`. Define JobReceipt fields: id, sceneSha256, status, artifactHashes, observedMedia, diagnostics, errorCode; statuses exactly spec §8. CLI submits to the same local jobs API from Task6; its end-to-end readiness waits for Task6, no direct TypeScript import or second export implementation.

- [ ] Test ordered transport before encoder: frame0,frame2 fails missing1; frame1 repeated fails; wrong scene hash fails; cancellation closes owned resources once.
- [ ] Implement page bridge with a single stable canvas and explicit asset readiness; await each PNG from `renderFrame(index)`. Worker streams serially with backpressure. No setTimeout-based video cadence or React state mutation for export frames.
- [ ] Implement FFmpeg args from spec, confined job directory, padded WAV input and partial-output rename only after media verification. Capture encoder stderr, exit code and process handle.
- [ ] Verify via `ffprobe -v error -count_frames -show_streams -show_format -of json output.partial.mp4`; require A09/A10 fields. Decode all streams with `ffmpeg -v error -i output.partial.mp4 -f null -` and reject errors.
- [ ] Test encoder nonzero exit, missing executable, stall timeout, disk gate and cancel; no COMPLETE on any failure. Kill only owned handles; retain diagnostics.
- [ ] Run named transport/status suites and one synthetic silent technical transport test explicitly labeled NO_AUDIO_ACCEPTANCE; real narrated acceptance belongs Task8.
- [ ] Commit scoped files. Acceptance A09/A10/A11/A14/A15, review focus5.

## Task 6 — Usable local editor workflow and jobs

**Create:** `src/components/SceneReviewPanel.tsx`, `src/server/video/jobRegistry.ts`, `src/server/video/localAccess.ts`, `src/app/api/render/jobs/route.ts`, `src/app/api/render/jobs/[id]/route.ts`, `src/app/api/render/jobs/[id]/artifact/route.ts`, `tests/video/localAccess.test.ts`, `tests/browser/scriptToVideo.spec.ts`.
**Modify:** `src/components/BriefImporterModal.tsx`, `src/components/ExportModal.tsx`, `src/components/AuditorPanel.tsx`, `src/store/useChartStore.ts`, `src/app/page.tsx`.

**Interfaces:** `applyDraft(draft)` and `freezeForExport(revision)`; jobs API paths/limits/security exactly spec. Registry stores immutable per-job scene and session identity, resumes no orphan job as success after restart.

- [ ] Browser red test uploads pilot source, sees all narration and seven cue intents, attaches exact segment speech, previews stop-hit, exports and downloads without devtools/store manipulation.
- [ ] Review screen distinguishes source facts, synthetic storyboard and unresolved values. Selected excerpt/full-script mode is visible; original text remains accessible.
- [ ] Export calls freeze, rejects errors, submits immutable snapshot and shows truthful progress/terminal state. Editing while export runs affects next revision only. Download available only after MEDIA_VERIFIED; human review remains separate.
- [ ] Unit tests reject wrong Origin/Host/token, arbitrary path/URL, cross-session ID, oversized inputs, invalid UUID and a second concurrent job. Expose runner only with explicit local studio flag.
- [ ] Replace stale validation score with current revision status. Mandatory errors are individually visible; never display PASS100% for score80. Unavailable local renderer yields actionable environment error, no MediaRecorder fallback pretending equivalent.
- [ ] Run access suite and editor E2E using installed browser in localhost mode. Commit. Acceptance A08/A14/A15, review focus5.

## Task 7 — Migrate remaining script entry points

**Create:** `src/video/importAdapters.ts`, `tests/video/importAdapters.test.ts`.
**Modify:** `src/components/HermesChatModal.tsx`, `src/components/HermesSidebarPanel.tsx`, `src/components/ScriptSetupPanel.tsx`, `src/components/AzzamOpsModal.tsx`, `src/utils/hermesEngine.ts`, `src/app/api/ai/parse-brief/route.ts`, `src/utils/dynamicValidator.ts`, `src/utils/jevReflexGate.ts`, store integration. Do not alter unrelated content fetch/API behavior.

**Interfaces:** `toDraft(input: {kind:'brief'|'chat'|'registry'|'ops'|'template'; payload:unknown}, source:SourceDocument): Result<SceneDraft>`. Proposal can return draft with review issues; only compile/freeze permits export.

- [ ] Table-driven tests feed the same explicit structured scenario through all adapter kinds; expect equal scene semantic projections, no preset swap or independent order computation.
- [ ] Test missing source/span mapping or budget ambiguity yields NEEDS_REVIEW; no hardcoded four-subtitle replacement or implicit translation.
- [ ] Sweep direction must be structured (BSL short vs SSL long), not inferred from the word sweep. No `loss|sl` keyword direction classifier remains in verified path.
- [ ] Retire duplicate semantic responsibilities after adapter tests pass; preserve reference presets and unrelated UI. Legacy unsupported inputs are marked draft-only and cannot enter verified export.
- [ ] JEV shows structured errors from canonical validator; visual/media checks are separate actual receipts. Auto-fix becomes a proposed diff requiring explicit apply and revision bump, not silent substitution.
- [ ] Run adapter/contract/compiler tests and the editor E2E for one alternate input. Commit. Acceptance A01–A06/A08.

## Task 8 — Independent media, mutation and source-fidelity acceptance

**Create:** `scripts/verify-s2v.mjs`, `scripts/run-s2v-mutations.mjs`, `tests/video/mutations.test.ts`, `livrables/s2v_runs/<runId>/acceptance-map.md`, `visual-audio-review.md` and manifest evidence.
**Modify:** `.github/workflows/ci.yml` to separate hermetic unit checks from opt-in local media acceptance; scripts/verify_goal.js only if its claim is brought into line with actual gates, otherwise do not use it for closure.

**Consumes:** built branch and real pilot media. **Produces:** acceptance map A01–A16 and independent verdict LOCAL_NARRATED_EXCERPT_ACCEPTED or BLOCKED.

- [ ] Execute real editor path for exact pilot, retain source/scene/audio/media hashes and logs. Listen to all narration and inspect cue transitions including final stop-loss result. No invented victory/TP/lot.
- [ ] Capture PNGs at every cue start, middle, final frame and one before each transition; compare independent expected visible IDs/prices and actual raster. Decode corresponding MP4 frames and inspect caption/watermark/readability.
- [ ] Verify ffprobe count/profile/duration/start times and full decode. Retain AAC encoder-delay allowance; do not assert waveform hashes remain equal after lossy encoding.
- [ ] Run two identical pinned-environment renders; compare scene hashes and raw PNGs exactly. Container MP4 hashes may differ across runs; record each output's own hash.
- [ ] Mutate isolated copies of the actual renderer mapping, scene OHLC input and frame transport. Baseline must pass; each mutant must fail its mapped gate. Also mutate renderer to ignore scene candles and attach wrong-revision speech. Any surviving mutant blocks acceptance. Do not mutate active user workspace.
- [ ] Independent reviewer traces source→scene→image/audio→file and confirms A01–A16. If reviewer is unavailable, verdict stays IMPLEMENTED_PENDING_REVIEW, not accepted.
- [ ] Parent runs verifier and checks generated artifacts exist/hashes match. Final report states exact supported excerpt/profile, human audio status and limitations. No PRODUCTION_READY/WF22_WIRED claim.

## Acceptance coverage and completion commands

| Requirements | Owner tasks |
|---|---|
| A01/A03 | T1/T2/T7/T8 |
| A02 | T2/T7/T8 |
| A04/A05/A07 | T3/T8 |
| A06 | T2/T4/T7/T8 |
| A08 | T6/T7/T8 |
| A09/A10/A11 | T4/T5/T8 |
| A12/A13 | T8 |
| A14/A15 | T5/T6/T8 |
| A16 | T0/T8 |

Proposed commands below must be implemented by their owner tasks before use:

```text
node node_modules/typescript/bin/tsc --noEmit --incremental false
node node_modules/vitest/vitest.mjs run tests/video
npm run build
node scripts/render-scene.mjs --scene <confined-job-scene-json> --run-id <server-generated-id>
node scripts/verify-render.mjs --run-id <server-generated-id>
node scripts/run-s2v-mutations.mjs --run-id <server-generated-id>
node scripts/verify-s2v.mjs --run-id <server-generated-id>
```

The placeholders in command usage are typed CLI arguments, not missing implementation decisions. Implementation commands are not executed in this planning turn. `verify-s2v` must fail if any required artifact/gate/review is absent; it must not bypass runtime or media failures with offline PASS.

## Execution handoff

Recommended method: fresh builder/reviewer per task with one parent integrator. This benefits the source/scene/media boundaries; do not run parallel writes to the same files. If usage limits persist, inline implementation is possible only after the user chooses it, while retaining independent review as an unfulfilled closure gate. No additional permanent agents or skills need installation.

