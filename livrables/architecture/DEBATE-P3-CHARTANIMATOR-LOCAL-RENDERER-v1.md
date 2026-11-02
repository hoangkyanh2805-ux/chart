# DEBATE DECISION RECORD — P3 ChartAnimator Local Renderer

- Debate ID: `DEBATE-P3-CHARTANIMATOR-LOCAL-RENDERER-v1`
- Status: `ADJUDICATED_FOR_PLANNING / NOT_BUILD_AUTHORITY`
- Date: `2026-11-02`
- Parent adjudicator: Hermes Orchestrator
- Delegation evidence: `deleg_694ccbb0`
- Roles: YouTube Operations Architect, ChartAnimator/Media Systems Architect, Independent Governance Auditor
- Primary spec: `G:\Other computers\My Computer\Project\chart\livrables\specs\SPEC-P3-CHARTANIMATOR-LOCAL-RENDERER-v1.md`

> Subagent outputs are advisory self-reports. The parent reconciled their common findings against the previously read owned source, canonical spec and live environment. This record captures decisions, not independent runtime verification.

## 1. Question

How should Hermes coordinate P3 so ChartAnimator produces a local renderer result smoothly without duplicating the YouTube operating system, weakening approval, fabricating trading truth or contaminating dirty worktrees?

## 2. Shared facts

All roles agreed:

- `youtube-agent-skill` is a prompt/micro-utility pack, not a renderer or control plane.
- ChartAnimator already owns Canvas/Candle/Overlay/MediaRecorder capabilities.
- ChartAnimator lacks a headless render surface, stable status API, supervised capture and technical media receipt.
- The YouTube repository already owns content identity, package version/hash, approval and external handoff.
- Synthetic candle sequences must remain `EDUCATIONAL_ILLUSTRATION`.
- Local test/render success cannot substitute for Alan's Aegis approval.
- P3 must remain local and unwired.

## 3. Role positions

### Position A — YouTube Operations Architect

Recommendation:

- extract only small QA/authoring patterns from `youtube-agent-skill`;
- do not install the full skill pack or create eleven agents;
- keep Hermes/WF22 as the only brain/state/approval owner;
- treat hook/title/retention/EDL utilities as advisory and item-bound;
- do not place those utilities in the critical media render path.

Primary concern:

- agent sprawl and source-of-truth split would create more operational risk than value.

### Position B — ChartAnimator/Media Systems Architect

Recommendation:

- define a deterministic handoff from validated chart directive to Canvas and media;
- use Playwright only as a supervisor around the owned render surface;
- separate speech EDL from visual cut list;
- keep timing basis explicit;
- bind all outputs to directive/source/package hashes;
- use FFmpeg/ffprobe and manifest read-back.

Primary concern:

- a prompt such as `[ON SCREEN: chart]` is not sufficient to define OHLC, overlays, reveal mode, timing or truth class.

### Position C — Governance Auditor

Recommendation:

- no direct production integration;
- one canonical state and one approval system;
- local renderer writes only to a sandbox/output directory;
- exact source/commit/dependency/output binding;
- fail closed for missing watermark, source, rights, hash or approval;
- preserve dirty work and avoid a second publish path.

Primary concern:

- renderer success is easily overstated as workflow/video/publish success.

## 4. Disagreements and adjudication

### 4.1 Should `youtube-agent-skill` be part of P3 runtime?

- Operations: only selected utility logic is useful.
- Media: its visual-intent pattern is upstream, not rendering.
- Governance: runtime dependency creates supply-chain/state overlap.

Decision:

```text
REJECT as P3 runtime dependency.
```

P3 consumes a canonical fixture directive only. Visual-plan, hook, title, EDL and Shorts utilities belong to other milestones.

### 4.2 Should P3 automate the existing manual importer/export modal?

- Media: selector/click automation is fragile and unbound.
- Governance: newest-file/manual UI selection weakens identity.

Decision:

```text
REJECT manual UI automation.
```

Create an owned local `/render` surface with a stable Canvas/API after separate build authorization.

### 4.3 Should exact MP4 hashes be deterministic across runs?

- Media: browser/container metadata may vary.
- Governance: approval still needs exact output bytes for a given run.

Decision:

- each produced media file is hashed and approval binds those exact bytes;
- cross-run determinism is judged by semantic store equality, technical profile and key-frame image tolerance;
- no claim of cross-run byte-identical MP4 unless evidence later proves it.

### 4.4 Should P3 fix unrelated repository failures first?

- Smooth operation needs a reliable baseline.
- Current failures are in unrelated live tests and modified chat/sidebar source.

Decision:

```text
Do not fix them under P3.
Use an authorized isolated worktree from a frozen base.
If the clean base is not viable, stop and report the exact blocker.
```

### 4.5 Should P3 start now because disks exceed 3 GiB?

- Hard stop threshold is passed.
- Preferred pilot target is not passed: C 9.60 GiB, G 4.36 GiB.

Decision:

```text
NO runtime start under this packet.
Require 10 GiB on each relevant volume or an approved relocated scratch/output contract.
```

### 4.6 Should P3 include WF22 wiring and Alan approval UX?

Decision:

```text
NO.
```

P3 stops at local fixture renderer verification. Package attachment, Aegis payload and editor handoff are later milestones.

## 5. Locked architecture decisions

1. Hermes remains the orchestrator.
2. Claude Code is the future Chart source/test builder.
3. P3 runs in an isolated worktree, not the current dirty worktree.
4. P3 uses one frozen synthetic Liquidity Sweep fixture.
5. Render profile: 1920x1080, 30 FPS, 15 seconds, PNG at 8 seconds.
6. Mandatory watermark: `EDUCATIONAL ILLUSTRATION — NOT FINANCIAL ADVICE`.
7. Local server binds `127.0.0.1` only.
8. Existing Chrome/Edge is reused; browser download is not implicitly authorized.
9. Playwright supervises; it does not select content or infer chart truth.
10. MediaRecorder output is normalized with FFmpeg and read back with ffprobe.
11. Each output receives exact SHA-256 and manifest binding.
12. Human visual review is separate from technical QA.
13. No WF22/Dagu/external action in P3.
14. No REA/decompiled third-party source.
15. Highest closure state is `LOCAL_FIXTURE_RENDERER_VERIFIED`.

## 6. Rejected architecture

- install the entire `youtube-agent-skill` pack;
- one agent per skill;
- read newest Markdown from the YouTube folder;
- pass local filesystem path in `/render?directive=...`;
- automate BriefImporterModal/ExportModal clicks;
- let LLM invent candle data without deterministic validation;
- treat chart illustration as a historical trade;
- use prompt confirmation as approval;
- render directly into canonical YouTube registry;
- upload/send/publish from ChartAnimator;
- broad reset/clean/stash of either repository;
- call unit-test PASS production readiness.

## 7. Risk register

### Critical

- synthetic chart shown as real result;
- changed bytes after approval;
- second source of truth/approval path;
- wrong channel identity;
- unapproved external action.

### High

- dirty-worktree contamination;
- dependency/browser download without review;
- nondeterministic React/MediaRecorder timing;
- orphan server/browser process;
- hash/manifest mismatch;
- retry duplicates or overwrites another case.

### Medium

- beautiful render but no editor-time/retention benefit;
- font/asset variation across machines;
- false claim that P3 completes the whole video pipeline;
- local output folder growth and temp leakage.

Mitigations are encoded in the P3 spec and plan.

## 8. Open decisions deferred beyond P3

- real WF22 fixture/content family;
- Visual Plan and Editor Cut List cross-repo schemas;
- exact package re-digest implementation;
- Drive/Telegram preview destination;
- CapCut handoff format;
- editor acceptance/measurement procedure;
- production cadence impact;
- public/publish path.

These do not block a synthetic local P3 fixture and must not be invented inside P3.

## 9. Debate verdict

```text
CONDITIONAL GO FOR P3 PLANNING AND READ-ONLY REVIEW.
NO-GO FOR BUILD/INSTALL/RENDER UNTIL:
- explicit build authority exists;
- disk/scratch preflight passes;
- isolated baseline is established;
- dependency gate is approved.
```

The packet is suitable for a bounded read-only Hermes/Claude review. It is not runtime acceptance and does not authorize implementation.
