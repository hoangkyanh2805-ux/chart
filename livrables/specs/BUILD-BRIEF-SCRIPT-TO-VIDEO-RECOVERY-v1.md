# Build brief — S2V-R1

Status: READY_FOR_USER_DESIGN_REVIEW; no implementation in this packet. Independent design debate pending because delegated design agents hit usage limits.

## Read in order

1. AGENTS.md and CLAUDE.md.
2. `livrables/test_reports/script_to_video_audit_2026-11-04.md` and ledger/probes.
3. `livrables/specs/SPEC-SCRIPT-TO-VIDEO-RECOVERY-v1.md`.
4. `livrables/specs/script-to-video-pilot-v1.json`.
5. `livrables/architecture/DEBATE-SCRIPT-TO-VIDEO-RECOVERY-v1.md`.
6. `livrables/architecture/PLAN-SCRIPT-TO-VIDEO-RECOVERY-v1.md`.

Do not treat old P3 planning documents or green unit tests as implementation/acceptance of this request. No decompiled/raw third-party source is needed.

## Concrete work order for a future approved build

Build S2V-R1 task-by-task in an isolated worktree, preserving the current dirty versions. Done means A01–A16 all have direct evidence and the editor can export/download the selected narrated excerpt with the STOP_LOSS outcome. Deliver only LOCAL_NARRATED_EXCERPT_ACCEPTED; do not claim complete clone parity, full source-script video, WF22 integration or publication.

Source ownership: exact selected script spans remain immutable; scene storyboard prices are visibly synthetic, not invented source facts. The initial example uses $30,20p,$1.50/pip with no lots/TP. Measured audio drives timing. Missing audio does not permit silent substitute footage.

## Agent contracts

| Role | Inputs | Loop/tools | Output/check | Stop |
|---|---|---|---|---|
| Hermes orchestrator | User scope, spec, baseline hashes | Read → isolate → assign one task → inspect diff → run checks | Run record, task receipts, exact acceptance map | Scope conflict, baseline drift, missing evidence |
| Clean-room builder | Owned specs/code, frozen task interface | Failing test → minimal implementation → scoped test → review diff | Code/tests and individual command exit codes | Unknown contract, unintended source edits |
| Script/scene reviewer | Exact source text, draft and frozen scene | Compare spans, units, outcome, cue order | SOURCE_SCENE_PASS or explicit discrepancies | Text loss, invented lot/TP, ambiguous input |
| Media verifier | Frozen scene, audio, output file, runner logs | Render → ffprobe → full decode → inspect keyframes/listen | Technical receipt and human review request | Dropped/duplicate frames, wrong audio/hash/profile |
| Mutation QA / independent reviewer | Baseline, isolated mutants, output evidence | Baseline pass → inject actual mutation → assert fail → restore | Mutation kill map and A01–A16 reconciliation | Surviving mutant or missing independent evidence |
| REA/spec auditor, optional later | Authorized target behavior | Isolated observations → behavior-only spec | Parity fixtures, no feature code | Need unauthorized access or raw source sharing |

JEV is a runtime validation module, not another autonomous agent. Hook/funnel skills are not run to rewrite a source during this recovery. Hermes Director and SMC checks must respect explicit lesson type and units.

## Permissions for implementation, after user chooses execution

- Read owned source/specs; write scoped source/tests/docs inside authorized isolated workspace.
- Run hermetic tests and local media checks; preserve exact run/output directories.
- Review dependency changes and browser reuse; no browser download implied. No paid TTS unless explicitly requested/configured by user action.
- No Telegram/email/Drive/YouTube send, no public tunnel deployment, no WF22/Dagu edit, no credentials in output, no source script overwrite.
- No broad reset/clean/stash, no recursive output deletion, no bypass of failed evidence gates.

## Build handoff and review cadence

Recommended execution: one fresh builder and one fresh reviewer per task, parent integration, optional parallel renderer/audio tasks only after interfaces freeze. If agent quota is unavailable, user can choose inline implementation; independent acceptance remains pending until a reviewer is available.

Task output format: target; files changed; source snapshot; tests with exit codes; artifacts; findings; next owner. All code claims cite baseline/file lines using existing ledger discipline. Every false success path is a blocker.

Two unsuccessful repair attempts for the same failure trigger diagnosis of its contract/assumptions; no endless fallback accumulation. Dependency/browser/disk blockers are reported with actual observed state, not historical numbers.

## Evidence required at finish

- frozen source, scene and audio receipts;
- usable editor-flow proof;
- MP4 and frame/audio review;
- ffprobe/decode/frame-sequence evidence;
- all five mutation results;
- before/after scoped hashes and source revision;
- independent verdict and parent verification.

Current packet supplies documentation and source fixture only. It contains no speech asset, built renderer, rendered MP4 or independent design approval.
