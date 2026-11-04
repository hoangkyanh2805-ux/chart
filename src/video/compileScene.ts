import { SceneDraft, FrozenScene, Result, TimedAction } from './contracts';
import { validateDraft } from './validateDraft';
import { scheduleCues } from './audioTimeline';
import { hashCanonical } from './canonicalHash';
import { deepFreeze } from './semantics';

export function compileScene(draft: SceneDraft): Result<FrozenScene> {
  // 1. Hard validate draft
  const draftIssues = validateDraft(draft);
  if (draftIssues.length > 0) {
    return { ok: false, issues: draftIssues };
  }

  // 2. Schedule audio and timeline
  const scheduleResult = scheduleCues(draft.narration);
  if (!scheduleResult.ok) {
    return { ok: false, issues: scheduleResult.issues };
  }

  const { cues: scheduledCues, frameCount, audioSampleCount } = scheduleResult.value;

  // 3. Map storyboard cues to timed events
  const timedEvents: TimedAction[] = [];
  const cueMap = new Map(scheduledCues.map((c) => [c.id, c]));

  for (const sb of draft.storyboard) {
    // Find matching scheduled cue by intentId
    const matchingNarrationCues = draft.narration.filter((n) => n.intentId === sb.intentId);
    if (matchingNarrationCues.length === 0) continue;

    const firstCueId = matchingNarrationCues[0].id;
    const scheduled = cueMap.get(firstCueId);
    const startFrame = scheduled ? scheduled.startFrame : 0;

    for (const action of sb.actions) {
      timedEvents.push({
        frame: startFrame,
        action,
      });
    }
  }

  // Sort timed events deterministically by frame index
  timedEvents.sort((a, b) => a.frame - b.frame);

  // 4. Create detached frozen snapshot of draft
  const draftClone = JSON.parse(JSON.stringify(draft)) as SceneDraft;
  const frozenDraft = deepFreeze(draftClone);
  const draftSha256 = hashCanonical(frozenDraft);

  // 5. Construct partial scene for canonical hashing
  const partialScene = {
    schema: 'frozen-scene/1' as const,
    draftSha256,
    draft: frozenDraft,
    cues: scheduledCues,
    events: timedEvents,
    frameCount,
    audioSampleCount,
    watermark: 'EDUCATIONAL ILLUSTRATION — NOT FINANCIAL ADVICE' as const,
  };

  const sceneSha256 = hashCanonical(partialScene, new Set(['sceneSha256']));

  const frozenScene: FrozenScene = deepFreeze({
    ...partialScene,
    sceneSha256,
  });

  return {
    ok: true,
    value: frozenScene,
    issues: [],
  };
}

