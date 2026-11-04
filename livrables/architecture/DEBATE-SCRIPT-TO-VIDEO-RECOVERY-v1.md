# Debate record — Script-to-video recovery v1

Date: 2026-11-04. Status: PARENT_DESIGN_REVIEW_COMPLETE / INDEPENDENT_DESIGN_REVIEW_PENDING.

## Participation truth

User requested agents, skills, brainstorming, debate, plan and spec. Parent dispatched:
- script_contract_audit: scene contract and import architecture;
- review_export: media architecture and deterministic export;
- build_spec_qa: skeptical acceptance/mutation review.

All three design turns errored due to the usage limit. They did not deliver a new design verdict. Prior completed audit findings from script_contract_audit and review_export remain evidence, not votes for this design. The questions/objections below are the parent's explicit self-debate. No independent consensus or approval is claimed.

Skills applied: brainstorming (architectural design), writing-plans (task/file/test handoff), agent-os-designer (roles/loops/permissions), anti-entropy-governance (one semantic owner and bounded retirement), project Hermes Director/Setup Verifier/Video Pipeline as requirements to reconcile with actual source intent.

## Problem framed from evidence

The current renderer can ignore imported geometry, importer can replace narration with generic four lines, validator accepts some contradictory states, and export omits narration. Exact citations and reproducible probes are in the deep audit and ledger. These are verified code-level defects; aesthetics and throughput are not yet measured. [E1]

New read-back of the actual source matters: selected example says “Hits the stop. You lose thirty dollars.” and “one dollar and fifty cents per pip.” The pilot fixture preserves that text. Converting it into a winning 1:3.5 setup or 1.5 lots is an incorrect adaptation. [E2]

## D1 — Patch each path, build a shared scene, or replace the whole app?

| Option | Benefit | Cost/risk | Decision |
|---|---|---|---|
| Patch importer, paper, JEV and recorder independently | Small initial diffs | Leaves competing price/order/timing authorities; another branch can regress | Rejected as complete solution; baseline syntax fix only |
| Introduce one immutable scene + canonical adapters + shared renderer | Auditable source→scene→frame identity; preserves editor investments | Requires coordinated contracts/migration | Selected |
| Rewrite app into a new video platform | Clean architecture without legacy seams | Delays first correct video, new UI/platform scope, duplicates existing tools | Rejected |

Counterargument: adding SceneDraft may create another source of truth. Resolution: old semantic setters do not remain authoritative on the verified path. Adapters produce drafts, compiler produces a frozen value, renderers only consume it. Legacy controls must edit a draft or remain explicitly draft-only. No dual-write synchronization loop.

## D2 — MediaRecorder, WebCodecs or frame stream + FFmpeg?

| Option | Benefit | Risk for current project | Decision |
|---|---|---|---|
| MediaRecorder real-time with audio mixing | Browser-native, quick to prototype | Wall-clock scheduling/paint and frame counts difficult to prove; current implementation already fails | Not accepted export path |
| WebCodecs + muxer | Explicit timestamps and browser export | Codec/mux/audio support matrix and new integration burden | Deferred |
| Await Canvas PNG per frame, pipe to installed FFmpeg | Straightforward indexed frame contract and audio mux; inspect count/decode | Local-only browser/process supervision; slower PNG transport | Selected for first reliable local product slice |

Counterargument: thousands of PNG files fill disk. Resolution: stream with backpressure, at most two queued frames; retain only cue keyframes and logs. Do not dump full sequence by default. Throughput is a measurement during build, not a claim of faster-than-real-time rendering.

Counterargument: a CLI does not help the editor. Resolution: the same runner is exposed through loopback job routes and ExportModal; Task6 E2E must demonstrate normal UI use. A standalone command output cannot close A08.

Local ffmpeg help confirmed image2pipe and libx264 on this machine. This confirms feature availability only, not renderer performance or output quality. Browser evaluation reference: [Playwright Page.evaluate](https://playwright.dev/docs/api/class-page#page-evaluate).

## D3 — Fixed 12 seconds, forced alignment, or measured segment audio?

Selected: exact transcript spans + segment WAVs/TTS + measured sample counts. A 48kHz/30fps frame contains 1600 samples; pad <1 frame per narration segment. Frame/caption/action timing derives from that schedule.

Rejected: automatically force any script into12s; predict speech duration from word count and call it synchronized; use Web Speech as an export asset; infer actual voice correctness solely from matching text hash.

Counterargument: uploading multiple WAVs adds friction. Resolution: preserve optional per-segment TTS from existing provider as an explicit user action; audio upload keeps acceptance offline and removes provider availability as a hidden prerequisite. First pilot requires real speech. Tone/silence or mock metadata proves plumbing only.

Counterargument: a long cue will overflow captions. Resolution: editor-visible split into consecutive sentence spans, maintaining seven narrative scene intents. Regenerate/rebind affected speech; never replace narration or shorten text silently.

## D4 — Always force RR≥3.5 and SL20, or preserve lesson intent?

Selected: preserve explicit script, validate typed semantics and show unresolved contradictions. The pilot is a loss-budget example, not a trade target. Budget30/SL20/USD-per-pip1.5 is meaningful without lots or TP. Order=null, outcome STOP_LOSS.

Risk-first and SMC skills inform checks, but their inconsistent defaults cannot override the source. Separate strategy fixtures test CE/order/RR when those concepts actually exist. No claim about current gold price, broker contract specification or live entry is needed.

Counterargument: losing charts fail existing drift validators. Resolution: define consistency with intended outcome, not global rising/declining net drift or guaranteed profit. Tests must include loss, no-trade and open outcomes. Mandated math errors are hard blockers, not score deductions.

## D5 — Clone ChartAnimator or copy one reference video?

Selected: reusable editor/render behavior for arbitrary owned scene input. Paper is a visual theme; a fixed reference video is a named preset, never hidden renderer authority.

REA's legitimate future role: inspect permitted behavior in an isolated audit session, produce behavioral specs and fixtures, then clean-room builder consumes those specs. REA configuration or comment labels are not parity evidence. This recovery uses owned code and does not require raw third-party sources, new REA installation or a fresh target-site scan.

JEV's legitimate role: structured preflight checks with explicit severity; it is not a visual auditor merely because a variable is named collisionSafeGate. Actual bounds/pixels/media require separate tests.

## D6 — Complete P3 / WF22 now, or recover local editor first?

Selected: distinct S2V-R1 local narrated excerpt milestone. Historical P3 is silent15s/16:9 and planning-only. Its authority and profile are not silently redefined. S2V has different authorized planning scope, affected files and acceptance.

Counterargument: two specs can conflict. Resolution: S2V local implementation work order explicitly names S2V only. It cannot claim cross-repo/P3 completion. Later bridge work adapts the reviewed frozen scene contract into the upstream identity model; no second publisher or content registry.

## D7 — How much “first video” proves enough?

One narrated exact-source pilot proves the end-to-end route. A second distinctly different geometric fixture, plus ignored-input mutation, proves the renderer did not just hardcode the pilot. Only the narrated pilot is an accepted editorial artifact; the synthetic control does not need to invent a second marketed video.

Required negative coverage: inverted coordinates, invalid OHLC at non-trigger index, missing transport frame, ignored input geometry and wrong-revision audio. Test actual production paths, not detached broken helper functions. Output must be decoded/read back; preview trace alone does not prove MP4 contents.

Human listening/visual review is distinct from technical verification. Another agent must independently reconcile evidence for final A16. Usage-limit failure in this design turn remains visible; parent self-review is not relabeled as independent review.

## Decision summary and residual risks

Selected design: shared scene, loss-preserving source fixture, explicit audio identity, deterministic frame stream, local editor export, semantic + media + human gates.

Residual risks to measure during build: real speech asset availability; selected excerpt total audio duration; installed browser automation compatibility; PNG throughput/RSS; font consistency; Windows process cleanup; broad input-adapter migration. Each has a specific task/gate in the plan. No unresolved architectural alternative is hidden behind “automatic fallback”.

## Evidence

[E1] `../test_reports/script_to_video_audit_2026-11-04.md`, exact source ledger and offline probe JSONs. Baseline Git SHA `a7a63e5af22c32daddd31238aa34dac8ea567b59`.
[E2] `../specs/script-to-video-pilot-v1.json`, source path and SHA-256 `1c760aa109ce721119ab2ac0636669420689b13c41061d022251185eb0f90016`; excerpt SHA-256 `885309ad8e4b64d90e594d48db39bee2dee444ff44982098828293faf495edac`. Quoted phrases above are exact substrings of the stored source excerpt; this establishes textual provenance, not independent truth of financial/audience claims.
