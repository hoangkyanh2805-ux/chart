import { SceneDraft, Issue, Gap } from './contracts';
import { hashText } from './canonicalHash';
import { verifySource } from './verifySource';
import { validateCandleOHLC } from './semantics';

export function validateDraft(draft: SceneDraft): Issue[] {
  const issues: Issue[] = [];

  if (!draft || typeof draft !== 'object') {
    return [{ code: 'INVALID_DRAFT', path: 'draft', message: 'Draft must be a valid object', severity: 'error' }];
  }

  if (draft.schema !== 'scene-draft/1') {
    issues.push({ code: 'INVALID_SCHEMA', path: 'schema', message: 'Schema must be scene-draft/1', severity: 'error' });
  }

  if (draft.truthClass !== 'EDUCATIONAL_ILLUSTRATION') {
    issues.push({ code: 'INVALID_TRUTH_CLASS', path: 'truthClass', message: 'truthClass must be EDUCATIONAL_ILLUSTRATION', severity: 'error' });
  }

  // 1. Source verification
  const sourceCheck = verifySource(draft.source);
  if (!sourceCheck.ok) {
    issues.push(...sourceCheck.issues);
  }

  // 2. Narration integrity
  if (!Array.isArray(draft.narration) || draft.narration.length === 0) {
    issues.push({ code: 'EMPTY_NARRATION', path: 'narration', message: 'Narration cues must not be empty', severity: 'error' });
  } else {
    let expectedOffset = 0;
    const joinedText = draft.narration.map((c) => c.text).join('');

    if (draft.source && joinedText !== draft.source.selectedText) {
      issues.push({
        code: 'NARRATION_TEXT_MISMATCH',
        path: 'narration',
        message: 'Concatenated narration text must equal source selectedText byte-for-byte',
        severity: 'error',
      });
    }

    draft.narration.forEach((cue, idx) => {
      if (cue.span.startUtf16 !== expectedOffset) {
        issues.push({
          code: 'DISCONTIGUOUS_SPAN',
          path: `narration[${idx}].span`,
          message: `Cue span start ${cue.span.startUtf16} does not match expected offset ${expectedOffset}`,
          severity: 'error',
        });
      }
      expectedOffset = cue.span.endUtf16;

      if (cue.audio) {
        const expectedTranscriptHash = hashText(cue.text);
        if (cue.audio.transcriptSha256 !== expectedTranscriptHash) {
          issues.push({
            code: 'AUDIO_TRANSCRIPT_MISMATCH',
            path: `narration[${idx}].audio.transcriptSha256`,
            message: `Audio transcript hash does not match current cue text`,
            severity: 'error',
          });
        }
        if (cue.audio.sampleRate !== 48000 || cue.audio.channels !== 1) {
          issues.push({
            code: 'INVALID_AUDIO_FORMAT',
            path: `narration[${idx}].audio`,
            message: 'Audio must be 48000Hz mono PCM',
            severity: 'error',
          });
        }
        if (cue.audio.sampleCount <= 0) {
          issues.push({
            code: 'INVALID_SAMPLE_COUNT',
            path: `narration[${idx}].audio.sampleCount`,
            message: 'Audio sampleCount must be strictly positive',
            severity: 'error',
          });
        }
      }
    });
  }

  // 3. Candle validation
  if (!Array.isArray(draft.candles) || draft.candles.length === 0) {
    issues.push({ code: 'EMPTY_CANDLES', path: 'candles', message: 'Candles array must not be empty', severity: 'error' });
  } else {
    draft.candles.forEach((c, idx) => {
      if (c.index !== idx) {
        issues.push({
          code: 'CANDLE_INDEX_MISMATCH',
          path: `candles[${idx}].index`,
          message: `Candle index ${c.index} does not match array position ${idx}`,
          severity: 'error',
        });
      }
      issues.push(...validateCandleOHLC(c, idx));
    });
  }

  // 4. Budget & Position Unit checks
  if (draft.budget) {
    const { riskUsd, slPips, usdPerPip } = draft.budget;
    if (riskUsd <= 0 || slPips <= 0) {
      issues.push({
        code: 'INVALID_BUDGET_VALUES',
        path: 'budget',
        message: 'Budget riskUsd and slPips must be positive',
        severity: 'error',
      });
    } else {
      const expectedUsdPerPip = riskUsd / slPips;
      if (Math.abs(usdPerPip - expectedUsdPerPip) > 1e-4) {
        issues.push({
          code: 'BUDGET_CALCULATION_MISMATCH',
          path: 'budget.usdPerPip',
          message: `usdPerPip ${usdPerPip} does not match riskUsd/slPips (${expectedUsdPerPip})`,
          severity: 'error',
        });
      }
    }
  }

  // 5. Order logic validation
  if (draft.order) {
    const { direction, entry, sl, tp } = draft.order;
    if (direction === 'BUY') {
      if (entry <= sl) {
        issues.push({
          code: 'ORDER_PRICE_INCONSISTENCY',
          path: 'order',
          message: 'BUY order entry must be strictly greater than stop loss',
          severity: 'error',
        });
      }
      if (tp !== null && tp <= entry) {
        issues.push({
          code: 'ORDER_PRICE_INCONSISTENCY',
          path: 'order.tp',
          message: 'BUY order TP must be strictly greater than entry',
          severity: 'error',
        });
      }
    } else if (direction === 'SELL') {
      if (entry >= sl) {
        issues.push({
          code: 'ORDER_PRICE_INCONSISTENCY',
          path: 'order',
          message: 'SELL order entry must be strictly less than stop loss',
          severity: 'error',
        });
      }
      if (tp !== null && tp >= entry) {
        issues.push({
          code: 'ORDER_PRICE_INCONSISTENCY',
          path: 'order.tp',
          message: 'SELL order TP must be strictly less than entry',
          severity: 'error',
        });
      }
    }
  }

  // 6. FVG Consequent Encroachment validation
  if (draft.entryBasis === 'FVG_CE') {
    if (!draft.entryOverlayId) {
      issues.push({
        code: 'MISSING_ENTRY_OVERLAY_ID',
        path: 'entryOverlayId',
        message: 'entryOverlayId is required when entryBasis is FVG_CE',
        severity: 'error',
      });
    } else {
      const fvg = draft.overlays.find((o) => o.id === draft.entryOverlayId && o.kind === 'FVG') as Gap | undefined;
      if (!fvg) {
        issues.push({
          code: 'FVG_NOT_FOUND',
          path: 'entryOverlayId',
          message: `Overlay ${draft.entryOverlayId} not found or is not kind FVG`,
          severity: 'error',
        });
      } else if (!draft.order) {
        issues.push({
          code: 'MISSING_ORDER_FOR_FVG',
          path: 'order',
          message: 'Order must be defined when entryBasis is FVG_CE',
          severity: 'error',
        });
      } else {
        const expectedCe = (fvg.low + fvg.high) / 2;
        if (Math.abs(draft.order.entry - expectedCe) > 1e-4) {
          issues.push({
            code: 'FVG_CE_ENTRY_MISMATCH',
            path: 'order.entry',
            message: `Entry ${draft.order.entry} does not match FVG 50% CE (${expectedCe})`,
            severity: 'error',
          });
        }
      }
    }
  }

  // 7. Storyboard & Outcome validation
  if (!Array.isArray(draft.storyboard) || draft.storyboard.length === 0) {
    issues.push({ code: 'EMPTY_STORYBOARD', path: 'storyboard', message: 'Storyboard must not be empty', severity: 'error' });
  } else {
    const intentIdsInNarration = new Set(draft.narration.map((c) => c.intentId));
    draft.storyboard.forEach((sb, sIdx) => {
      if (!intentIdsInNarration.has(sb.intentId)) {
        issues.push({
          code: 'UNKNOWN_STORYBOARD_INTENT',
          path: `storyboard[${sIdx}].intentId`,
          message: `Storyboard intent ${sb.intentId} does not exist in narration cues`,
          severity: 'error',
        });
      }

      sb.actions.forEach((act, aIdx) => {
        if (act.kind === 'MARK_OUTCOME') {
          if (act.outcome !== draft.outcome) {
            issues.push({
              code: 'OUTCOME_ACTION_MISMATCH',
              path: `storyboard[${sIdx}].actions[${aIdx}].outcome`,
              message: `Action outcome ${act.outcome} contradicts draft outcome ${draft.outcome}`,
              severity: 'error',
            });
          }
        } else if (act.kind === 'REVEAL_CANDLES') {
          for (const cId of act.candleIds) {
            if (!draft.candles.some((c) => c.id === cId)) {
              issues.push({
                code: 'UNKNOWN_CANDLE_ID',
                path: `storyboard[${sIdx}].actions[${aIdx}]`,
                message: `Referenced candle ${cId} does not exist in candles array`,
                severity: 'error',
              });
            }
          }
        } else if (act.kind === 'SHOW_OVERLAY') {
          if (!draft.overlays.some((o) => o.id === act.overlayId)) {
            issues.push({
              code: 'UNKNOWN_OVERLAY_ID',
              path: `storyboard[${sIdx}].actions[${aIdx}]`,
              message: `Referenced overlay ${act.overlayId} does not exist in overlays array`,
              severity: 'error',
            });
          }
        }
      });
    });
  }

  // 8. Profile bounds
  if (
    draft.profile.width !== 1080 ||
    draft.profile.height !== 1920 ||
    draft.profile.fps !== 30 ||
    draft.profile.maxDurationSec !== 120
  ) {
    issues.push({
      code: 'UNSUPPORTED_PROFILE',
      path: 'profile',
      message: 'Profile must be 1080x1920, 30fps, maxDurationSec 120',
      severity: 'error',
    });
  }

  return issues;
}

