# ChartAnimator Repository Capability Manifest — Hermes Headless Bridge

- Manifest ID: `CHARTANIMATOR-BRIDGE-CHART-CAPABILITY-MANIFEST-v1`
- Status: `PLANNING_ONLY / IMPLEMENTATION_NOT_AUTHORIZED`
- Repository: `G:\Other computers\My Computer\Project\chart`
- Canonical integration spec: `C:\Users\Admin\youtube\docs\SPEC-CHARTANIMATOR-HERMES-CROSS-REPO-INTEGRATION-v1.1-PLANNING.md`
- Peer manifest: `C:\Users\Admin\youtube\docs\CHARTANIMATOR-BRIDGE-YOUTUBE-CAPABILITY-MANIFEST-v1.md`
- Authority: Alan authorized this planning-only document; no source/build/render/install/external action.

> This file inventories ChartAnimator only. It does not redefine the cross-repository contract.

## 1. Repository role

ChartAnimator is the owned local rendering engine. It receives a validated, immutable educational chart directive and converts it into Canvas state, animation, browser capture and technical output.

It must not select the content item, infer approval, choose the newest script, upload media or publish anything.

## 2. Read order for Hermes/CLI workers

1. `G:\Other computers\My Computer\Project\chart\AGENTS.md`
2. `G:\Other computers\My Computer\Project\chart\CLAUDE.md`
3. Canonical integration spec linked above
4. This manifest
5. `SPEC.md` and `PLAN.md` as product history
6. `src\types\chart.ts`
7. `src\store\useChartStore.ts`
8. `src\utils\hermesEngine.ts`
9. `src\components\BriefImporterModal.tsx`
10. `src\components\StageCanvas.tsx`
11. `src\utils\recorder.ts`
12. `src\components\ExportModal.tsx`
13. `src\app\api\hermes\scripts\route.ts`

For this owned bridge, do not read or use decompiled third-party files in `sources/` and do not run REA against ChartAnimator.io. Normal owned-source review is sufficient.

## 3. Capability inventory

| Capability | Status | Evidence | Bridge relevance |
|---|---|---|---|
| Next.js/React app | IMPLEMENTED | `package.json`, `src/app/page.tsx` | Host for local render surface |
| Zustand chart/timeline state | IMPLEMENTED | `src/store/useChartStore.ts` | Directive target state |
| Candle/overlay types | IMPLEMENTED | `src/types/chart.ts` | Base render model |
| 9:16, 16:9, 1:1 settings | IMPLEMENTED in store/UI | `AspectRatio`, `StageCanvas.tsx` | v1 uses 9:16/16:9 |
| Candle and overlay generation | IMPLEMENTED | `hermesEngine.ts` | Educational setup generation |
| Manual Hermes script import | IMPLEMENTED | `BriefImporterModal.tsx` | Current manual path only |
| Recent-script API | IMPLEMENTED but UNSUITABLE for durable identity | `/api/hermes/scripts` | Absolute path/newest-first/top-15 behavior |
| Canvas render | IMPLEMENTED | `StageCanvas.tsx`, `ChartCanvas.tsx` | Main visual engine |
| Illustration label | IMPLEMENTED | `StageCanvas.tsx` | Partial compliance surface |
| Canvas video recorder | IMPLEMENTED | `src/utils/recorder.ts` | Uses captureStream/MediaRecorder |
| Manual video export | IMPLEMENTED | `ExportModal.tsx` | Human click path only |
| Manual PNG export | IMPLEMENTED | `Header.tsx` | Uses Canvas data URL |
| Headless `/render` route | NOT IMPLEMENTED | App has no render page | M2 gap |
| Stable Canvas selector | NOT IMPLEMENTED | Canvas has ref/class, no stable ID | M2 gap |
| Browser bridge/status API | NOT IMPLEMENTED | No `window.chartAnimatorBridge` | M2 gap |
| JSON directive validator | NOT IMPLEMENTED | Markdown parser is current input | M1/M2 gap |
| Output manifest/hash/read-back | NOT IMPLEMENTED | No manifest code | M3 gap |
| ffprobe validation | NOT IMPLEMENTED | No technical receipt | M3 gap |

## 4. Current input behavior

### Hermes native path

`BriefImporterModal.tsx`:

```text
GET /api/hermes/scripts
→ choose a recent script
→ executeHermesDirective(content, filename)
→ candles/overlays/headline/badges
→ Zustand store
→ Canvas
```

This is useful proof that the renderer can consume Hermes-derived state, but it is not an acceptable bridge contract because:

- script identity is filename-based;
- API reads an absolute YouTube folder;
- files are sorted newest-first and limited to 15;
- Markdown is parsed with regex and defaults;
- no source hash/package version is supplied;
- no validation receipt is returned.

The headless bridge must accept a validated directive by stable identity and exact bytes. It must not automate this modal.

## 5. Current rendering model

`src/types/chart.ts` defines:

- `Candle`: ID, index, OHLC and optional timestamp;
- `Overlay`: type, candle range, price range, color/opacity/label;
- reveal modes: instant, sequential, wick-then-body, brownian;
- aspect ratios: 16:9, 9:16, 1:1.

`hermesEngine.ts` generates six-candle educational sequences for multiple strategies. Those values are synthetic illustrations unless a later source-backed adapter explicitly proves otherwise.

The current engine and importer both contain setup-generation logic. A future builder must choose one canonical mapping and test it; duplicated business logic must not silently diverge.

## 6. Current export behavior

`recorder.ts`:

- calls `canvas.captureStream(fps)`;
- selects MP4/H.264 MIME when the browser reports support;
- otherwise selects VP9/WebM or WebM;
- records at requested FPS with an 8 Mbps target;
- advances frames using `setTimeout` and a caller-provided timeline callback;
- returns a Blob and generated timestamp filename.

`ExportModal.tsx`:

- calls `document.querySelector('canvas')`;
- changes React timeline state;
- triggers an `<a download>` click;
- reports success after Blob creation/download trigger.

This proves a viable browser-capture primitive. It does not yet prove:

- the correct canvas was selected;
- React painted every requested frame before capture;
- exact FPS or duration;
- H.264 output rather than WebM fallback;
- a valid MP4 playable by CapCut/Premiere;
- deterministic key frames;
- headless-browser compatibility;
- source/package binding.

## 7. Required future render surface

Planning contract only:

- local route or harness bound to `127.0.0.1`;
- no arbitrary directive file path in URL;
- stable render canvas identity;
- validated object load into one canonical store adapter;
- mandatory watermark enforcement in renderer policy;
- explicit readiness and terminal status;
- safe API callable by Playwright;
- video Blob download plus PNG frame output;
- actual MIME and dimensions reported;
- no network/provider/Gemini requirement;
- no external send or upload.

Proposed API/status semantics live only in the canonical integration spec.

## 8. Compliance observations

Fact:

- `StageCanvas.tsx` draws an `ILLUSTRATION` pill.
- `/api/hermes/chat` prompt text asks for `EDUCATIONAL ILLUSTRATION — NOT A TRADE RECOMMENDATION`.

Gap:

- the canonical bridge requires the exact mandatory watermark policy from the integration spec;
- prompt text is not runtime enforcement;
- output validation does not currently prove the watermark appears in every rendered media profile.

Generated charts must never be represented as real executed trades, measured profits or future guarantees.

## 9. Test and verifier observations

Current package scripts expose `test`, `test:watch`, `test:mutation` and `verify:goal`. Tests exist for coordinates, Hermes engine and course/painpoint mapping.

`verify_goal.js` currently:

- runs Vitest;
- prints git status but does not fail for unrelated dirty files;
- marks an unreachable dev server as `PASS (Offline / Dev)`;
- can exit success without runtime server verification.

Therefore it is supporting evidence only. A future bridge work order must add focused contract, browser, media and supervision checks and compare only scoped deltas against the already dirty baseline.

No tests/build/server/render were run during this planning task.

## 10. Repository and environment constraints

Current chart worktree already contains modified/untracked files. Future work must retain before hashes and never clean/reset/stash unrelated work.

At authoring time:

- G free: `1.61 GiB`;
- C free: `1.69 GiB`;
- FFmpeg exists on C;
- Python Playwright is not installed in the checked interpreters.

No package installation or browser download is permitted until a separately authorized preflight passes the canonical disk/dependency gate.

## 11. Clean-room boundary for this bridge

The bridge integrates source owned by the project. It does not require REA or inspection of a paid third-party product.

Future builder rules:

- read only the allowed owned files and approved specs;
- do not inspect `sources/` decompiled bundles;
- do not reverse engineer ChartAnimator.io;
- do not copy third-party implementation;
- preserve existing project provenance;
- treat old REA-derived docs as out of scope unless Alan separately authorizes a clean-room review.

## 12. Current blockers

1. No implementation authority.
2. Unsafe disk capacity.
3. No canonical directive validator/adapter.
4. No headless render route/status API.
5. No stable canvas selector.
6. No supervised Playwright client.
7. No technical media manifest/read-back.
8. Current recorder is not proven deterministic under headless React rendering.
9. No approved fixture or frozen render profile.

## 13. Future milestone handoff

A future M1/M2 work order must provide:

- exact edit allowlist;
- before hashes for dirty targets;
- exact JSON Schemas and fixtures;
- builder/reviewer separation;
- test assertions mapped to the canonical spec;
- no installs/build/server unless the milestone explicitly authorizes them;
- no Dagu/external action;
- one terminal verdict with real evidence.

This manifest remains an inventory, not a build instruction.
