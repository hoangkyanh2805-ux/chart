# HERMES CLI BRIEF — P3 ChartAnimator Local Renderer

- Brief ID: `HERMES-CLI-BRIEF-P3-CHARTANIMATOR-LOCAL-RENDERER-v1`
- Status: `PLANNING_ONLY / DO_NOT_BUILD`
- Target repository: `G:\Other computers\My Computer\Project\chart`
- Orchestrator: Hermes CLI
- Future source builder: Claude Code
- Human owner: Alan
- Primary spec: `livrables/specs/SPEC-P3-CHARTANIMATOR-LOCAL-RENDERER-v1.md`
- Plan: `livrables/architecture/PLAN-P3-CHARTANIMATOR-LOCAL-RENDERER-v1.md`
- Debate: `livrables/architecture/DEBATE-P3-CHARTANIMATOR-LOCAL-RENDERER-v1.md`

## 1. Mission

Prepare and, only after a separate explicit build authorization, supervise P3: a local-only ChartAnimator renderer for one frozen synthetic Liquidity Sweep fixture. The renderer must output one 15-second 1920x1080/30 FPS educational MP4, one 1920x1080 PNG and one hash-bound technical manifest, with no WF22 wiring or external action.

## 2. Current instruction

For the current session:

```text
READ AND ACKNOWLEDGE THE PACKET ONLY.
DO NOT EDIT PRODUCT SOURCE.
DO NOT INSTALL DEPENDENCIES.
DO NOT START SERVER/BROWSER.
DO NOT RENDER.
DO NOT MODIFY WORKFLOWS.
DO NOT SEND OR PUBLISH.
```

A later instruction to build must reconcile repository authority and create a P3 Run Record before any source change.

## 3. Mandatory read order

1. `G:\Other computers\My Computer\Project\chart\AGENTS.md`
2. `G:\Other computers\My Computer\Project\chart\CLAUDE.md`
3. `C:\Users\Admin\youtube\docs\SPEC-CHARTANIMATOR-HERMES-CROSS-REPO-INTEGRATION-v1.1-PLANNING.md`
4. `G:\Other computers\My Computer\Project\chart\livrables\specs\CHARTANIMATOR-BRIDGE-CHART-CAPABILITY-MANIFEST-v1.md`
5. `G:\Other computers\My Computer\Project\chart\livrables\specs\SPEC-P3-CHARTANIMATOR-LOCAL-RENDERER-v1.md`
6. `G:\Other computers\My Computer\Project\chart\livrables\architecture\PLAN-P3-CHARTANIMATOR-LOCAL-RENDERER-v1.md`
7. `G:\Other computers\My Computer\Project\chart\livrables\architecture\DEBATE-P3-CHARTANIMATOR-LOCAL-RENDERER-v1.md`
8. Only then inspect the exact owned source files listed in the future allowlist.

Do not inspect `sources/` decompiled bundles or reverse engineer ChartAnimator.io. This integration uses owned source only.

## 4. Current verified state to retain

- C free: 9.60 GiB.
- G free: 4.36 GiB.
- Preferred pilot target: at least 10 GiB on each relevant volume.
- Chrome and Edge executables exist.
- FFmpeg exists.
- Python Playwright is absent.
- Port 3000 was not listening during planning.
- Current chart worktree has unrelated modified files.
- `npm test`: 113 passed, 3 failed.
- Typecheck fails in pre-existing modified Hermes chat/sidebar files.

Do not report the repository baseline as green. Do not fix unrelated failures under P3.

## 5. No Five, No Run template

Before a future build, create a run record containing at least:

```text
Workflow ID: P3-CHART-LOCAL-RENDERER
Automation level: L2 / S1
Owner: Hermes; source builder Claude Code
Human approval: P3 local build authorization status
Output paths: exact worktree, source allowlist, fixture/evidence paths
```

Also record:

- base commit;
- dirty paths and before hashes;
- selected scratch/output volumes;
- dependency decision;
- fixture identity/hash;
- prohibited actions;
- verifier/auditor identities;
- terminal outcome.

## 6. Future orchestration sequence

When and only when Alan explicitly authorizes P3 build:

```text
Hermes preflight
→ isolated worktree
→ Claude contract/fixture implementation
→ Hermes focused tests
→ Claude render surface implementation
→ Hermes browser verification
→ Claude supervision/recorder implementation
→ Hermes fixture render + FFmpeg/ffprobe
→ Hermes negative/determinism probes
→ independent audit
→ Alan local review
```

Do not ask the builder to edit the active dirty worktree. Do not let the builder self-certify tests or runtime.

## 7. Frozen fixture/profile

```text
content_item_id: TEST-P3-LIQUIDITY-SWEEP-001
package_id: TEST-P3-PACKAGE-001
version: 1
case_id: case1-liquidity-sweep
channel_id: UCBZ7LaffmEPv91sWcfroJdQ
symbol: XAUUSD
truth_class: EDUCATIONAL_ILLUSTRATION
synthetic_sequence: true
market_data_source: NONE
ratio: 16:9
resolution: 1920x1080
fps: 30
duration: 15 seconds
thumbnail_time: 8 seconds
watermark: EDUCATIONAL ILLUSTRATION — NOT FINANCIAL ADVICE
video: MP4/H.264/yuv420p
external_actions: NONE
```

Any change to this profile requires a new spec revision or explicit work-order decision before build.

## 8. Future builder scope

Claude Code may receive only the exact allowlist from the P3 spec. It must not touch:

- current modified Hermes chat/sidebar files;
- manual importer/export UI;
- `/api/hermes/scripts`;
- YouTube repo;
- Dagu/WF22;
- credentials/providers;
- Drive/Telegram/Sheets/Cloudflare/CapCut/YouTube;
- unrelated tests/specs;
- decompiled third-party source.

Builder returns:

```text
Files changed
Contract choices
Tests added
Known limitations
Unverified criteria
Permission denials/errors
```

Builder claims are advisory until Hermes inspects the actual delta and runs checks.

## 9. Dependency gate

Do not install Playwright during planning.

For a future approved install:

1. Inspect exact package version, license and metadata.
2. Confirm no unapproved lifecycle/binary behavior.
3. Use an isolated Python 3.12 environment/cache.
4. Use `py -3.12 -m pip`, not bare `pip`.
5. Reuse approved installed Chrome/Edge.
6. Do not run `playwright install` or download a browser without separate approval.
7. Record package version/hash and interpreter path.

If these conditions cannot be met, stop with `DEPENDENCY_GATE_BLOCKED`.

## 10. Supervisor rules

- Retain exact server/browser process handles.
- Bind handles to fixture run ID.
- Persist stdout/stderr/status before reporting RUNNING.
- Use hard limits from the plan; do not promise ETA.
- Kill/reap only the owned process tree on timeout.
- Emit exactly one terminal result.
- Verify no listener/process remains.
- Preserve diagnostics on failure.
- Never interpret process start as renderer success.

## 11. Required response format from Hermes

### Read-only acknowledgement

```text
Target: P3 ChartAnimator local renderer
Mode: PLANNING_ONLY
Authority: build not authorized
Current blocker: disk target and dirty/broken baseline
Primary spec: <path>
Next action requiring Alan: explicit P3 build authorization after blockers/preflight
External actions: NONE
```

### Future runtime status

```text
Target
Run ID
State
Current step
Elapsed / hard limit
Fixture identity
Existing outputs
Missing/failed outputs
Approval status
Evidence path
Next owner
```

## 12. Stop conditions

Stop immediately if:

- authority remains planning-only;
- disk/preflight target fails;
- active dirty files would be overwritten;
- dependency needs unapproved download/script;
- target files already contain unreviewed user work;
- source tuple/schema is ambiguous;
- server would bind beyond loopback;
- a request crosses into WF22/external action;
- a prompt asks to mark synthetic chart as real performance;
- an agent proposes auto-approval or a second publish path.

## 13. Success boundary

The highest P3 claim allowed after successful future execution is:

```text
LOCAL_FIXTURE_RENDERER_VERIFIED
```

Never claim production integration, editor readiness, publication or retention improvement from P3.

## 14. Copy-paste read-only goal for Hermes CLI

```text
/goal Read and reconcile the P3 ChartAnimator Local Renderer packet in this order: AGENTS.md, CLAUDE.md, the canonical cross-repo spec, the Chart capability manifest, SPEC-P3-CHARTANIMATOR-LOCAL-RENDERER-v1.md, PLAN-P3-CHARTANIMATOR-LOCAL-RENDERER-v1.md and DEBATE-P3-CHARTANIMATOR-LOCAL-RENDERER-v1.md. Confirm existing capabilities, current disk/git/test/typecheck blockers, exact future source allowlist, fixture profile, acceptance criteria and stop conditions. Do not edit source, install, start a server/browser, render, modify workflows or perform external actions. Done means a read-only acknowledgement names the exact primary spec, current blockers, build authority status, proposed next gated action and external_actions=NONE.
```
