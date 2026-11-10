import { TimedAction, CueAction, Outcome } from './contracts';

export interface WhisperWord {
  word: string;
  startSec: number;
  endSec: number;
}

export interface WordSyncRule {
  keywords: string[];
  action: CueAction;
}

/**
 * Whisper Word-Level Synchronization Engine
 * Maps spoken speech timestamps to exact candlestick & overlay reveal frames.
 */
export function alignWordTimestampsToActions(
  words: WhisperWord[],
  fps: number = 30,
  outcome: Outcome = 'STOP_LOSS'
): TimedAction[] {
  const events: TimedAction[] = [];
  const normalizedWords = words.map((w) => ({
    ...w,
    clean: w.word.toLowerCase().replace(/[^a-zA-Z0-9\u00C0-\u024F\u1EA0-\u1EF9]/g, ''),
  }));

  // Define institutional keyword triggers
  const sweepKeywords = ['sweep', 'quét', 'thanh', 'khoản', 'liquidity', 'trap', 'bẫy'];
  const fvgKeywords = ['fvg', 'gap', 'imbalance', 'khối', 'khoảng', 'trống'];
  const entryKeywords = ['entry', 'vào', 'lệnh', 'retest', 'chạm', 'test', 'mức'];
  const stopKeywords = ['stop', 'loss', 'cắn', 'lỗ', 'hit'];
  const profitKeywords = ['profit', 'lời', 'chốt', 'target', 'đích'];

  let hasSweepFired = false;
  let hasFvgFired = false;
  let hasEntryFired = false;
  let hasOutcomeFired = false;

  for (const w of normalizedWords) {
    const frame = Math.max(0, Math.floor(w.startSec * fps));

    // 1. Detect Sweep
    if (!hasSweepFired && sweepKeywords.some((k) => w.clean.includes(k))) {
      events.push({
        frame,
        action: { kind: 'REVEAL_CANDLES', candleIds: ['c1', 'c2'] },
      });
      events.push({
        frame,
        action: { kind: 'SHOW_TEXT', id: 'txt_sweep', text: 'LIQUIDITY SWEEP' },
      });
      hasSweepFired = true;
      continue;
    }

    // 2. Detect FVG
    if (!hasFvgFired && fvgKeywords.some((k) => w.clean.includes(k))) {
      events.push({
        frame,
        action: { kind: 'REVEAL_CANDLES', candleIds: ['c3'] },
      });
      events.push({
        frame,
        action: { kind: 'SHOW_OVERLAY', overlayId: 'fvg_1' },
      });
      hasFvgFired = true;
      continue;
    }

    // 3. Detect Entry
    if (!hasEntryFired && entryKeywords.some((k) => w.clean.includes(k))) {
      events.push({
        frame,
        action: { kind: 'REVEAL_CANDLES', candleIds: ['c4', 'c5'] },
      });
      events.push({
        frame,
        action: { kind: 'SHOW_BUDGET' },
      });
      hasEntryFired = true;
      continue;
    }

    // 4. Detect Outcome
    if (!hasOutcomeFired) {
      if (outcome === 'TAKE_PROFIT' && profitKeywords.some((k) => w.clean.includes(k))) {
        events.push({
          frame,
          action: { kind: 'REVEAL_CANDLES', candleIds: ['c6'] },
        });
        events.push({
          frame,
          action: { kind: 'MARK_OUTCOME', outcome: 'TAKE_PROFIT' },
        });
        hasOutcomeFired = true;
        continue;
      } else if (outcome === 'STOP_LOSS' && stopKeywords.some((k) => w.clean.includes(k))) {
        events.push({
          frame,
          action: { kind: 'REVEAL_CANDLES', candleIds: ['c6'] },
        });
        events.push({
          frame,
          action: { kind: 'MARK_OUTCOME', outcome: 'STOP_LOSS' },
        });
        hasOutcomeFired = true;
        continue;
      }
    }
  }

  // Sort events chronologically by frame
  events.sort((a, b) => a.frame - b.frame);
  return events;
}
