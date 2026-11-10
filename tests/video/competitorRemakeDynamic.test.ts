import { describe, it, expect, vi } from 'vitest';
import { renderFrame } from '../../src/video/renderFrame';
import { compileScene } from '../../src/video/compileScene';
import { toDraft } from '../../src/video/importAdapters';
import { choreographInstitutionalSetup } from '../../src/video/dynamicCandleChoreographer';
import { alignWordTimestampsToActions } from '../../src/video/whisperWordSync';
import { SourceDocument, SceneDraft } from '../../src/video/contracts';
import { hashText } from '../../src/video/canonicalHash';
import { makeAudioReadyPilot } from '../fixtures/s2v/factories';

function createMockContext(): CanvasRenderingContext2D {
  return {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    font: '',
    textAlign: '',
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    fillText: vi.fn(),
    strokeText: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    roundRect: vi.fn(),
    setLineDash: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    measureText: vi.fn((text: string) => ({ width: text.length * 15 })),
  } as unknown as CanvasRenderingContext2D;
}

describe('Anti-Hardcode Dynamic Competitor Remake & Rendering Suite (MUT-ANTI)', () => {
  it('MUT-ANTI-01: renders dynamic headline on canvas without hardcoded RISK-FIRST default', () => {
    const draft = makeAudioReadyPilot();
    draft.headline = 'BẪY QUÉT THANH KHOẢN Á CHÂU';
    draft.subline = 'KHI ĐÁM ĐÔNG NGHĨ LÀ BREAKOUT';

    const compiled = compileScene(draft);
    expect(compiled.ok).toBe(true);
    if (!compiled.ok) throw new Error('compile failed');

    const scene = compiled.value;
    const mockCtx = createMockContext();

    renderFrame(mockCtx, scene, 0);

    const filledTexts = (mockCtx.fillText as any).mock.calls.map((call: any[]) => call[0]);
    expect(filledTexts).toContain('BẪY QUÉT THANH KHOẢN Á CHÂU');
    expect(filledTexts).toContain('KHI ĐÁM ĐÔNG NGHĨ LÀ BREAKOUT');
    expect(filledTexts).not.toContain('RISK-FIRST XAUUSD');
    expect(filledTexts).not.toContain('DEFINE LOSS BEFORE ENTRY');
  });

  it('MUT-ANTI-02: renders dynamic TAKE_PROFIT outcome with green banner when outcome is TAKE_PROFIT', () => {
    const draft = makeAudioReadyPilot();
    draft.outcome = 'TAKE_PROFIT';
    // Modify last event to mark outcome as TAKE_PROFIT
    const lastEvent = draft.storyboard.find((sb) => sb.intentId === 'stop-hit');
    if (lastEvent) {
      lastEvent.actions = [{ kind: 'MARK_OUTCOME', outcome: 'TAKE_PROFIT' }];
    }

    const compiled = compileScene(draft);
    expect(compiled.ok).toBe(true);
    if (!compiled.ok) throw new Error('compile failed');

    const scene = compiled.value;
    const mockCtx = createMockContext();

    // Render the final frame where outcome is marked
    const finalFrame = scene.frameCount - 1;
    const receipt = renderFrame(mockCtx, scene, finalFrame);

    expect(receipt.visibleIds).toContain('outcome:TAKE_PROFIT');
    expect(receipt.visibleIds).not.toContain('outcome:STOP_LOSS');

    const filledTexts = (mockCtx.fillText as any).mock.calls.map((call: any[]) => call[0]);
    expect(filledTexts.some((txt: string) => txt.includes('TAKE PROFIT HIT'))).toBe(true);
    expect(filledTexts.some((txt: string) => txt.includes('STOP LOSS HIT'))).toBe(false);
  });

  it('MUT-ANTI-03: choreographs realistic institutional SMC candles without static 4120 pilot prices', () => {
    const setup = choreographInstitutionalSetup({
      direction: 'BUY',
      outcome: 'TAKE_PROFIT',
      basePrice: 4150.0,
    });

    expect(setup.candles).toHaveLength(6);
    expect(setup.overlays.length).toBeGreaterThan(0);
    expect(setup.entryBasis).toBe('FVG_CE');
    expect(setup.entryOverlayId).toBe('fvg_1');

    // Verify prices are centered around 4150, not 4120
    const minPrice = Math.min(...setup.candles.map((c) => c.low));
    const maxPrice = Math.max(...setup.candles.map((c) => c.high));
    expect(minPrice).toBeGreaterThan(4130.0);
    expect(maxPrice).toBeGreaterThan(4160.0);

    // Verify OHLC candle validity
    for (const c of setup.candles) {
      expect(c.high).toBeGreaterThanOrEqual(Math.max(c.open, c.close));
      expect(c.low).toBeLessThanOrEqual(Math.min(c.open, c.close));
    }
  });

  it('MUT-ANTI-04: importAdapters competitor_remake produces valid SceneDraft with dynamic parameters', () => {
    const newScript =
      'Bẫy quét thanh khoản đỉnh Á Châu. Nến rút râu quét qua bốn ngàn một trăm năm mươi. Đợi giá hồi về FVG năm mươi phần trăm. Vào lệnh mua. Chốt lời thành công. Hoàn tất.';
    const source: SourceDocument = {
      id: 'src-remake-01',
      revision: 1,
      sourceSha256: hashText(newScript),
      selection: 'EXCERPT',
      selectedText: newScript,
      selectedTextSha256: hashText(newScript),
      language: 'vi',
    };

    const res = toDraft(
      {
        kind: 'competitor_remake',
        payload: {
          text: newScript,
          headline: 'CHIẾN THUẬT QUÉT ĐỈNH Á',
          subline: 'SMC REJECTION 50% CE',
          direction: 'BUY',
          outcome: 'TAKE_PROFIT',
          riskBudgetUsd: 30,
          slPips: 20,
        },
      },
      source
    );

    expect(res.ok).toBe(true);
    if (!res.ok) throw new Error('toDraft failed');

    const draft = res.value;
    expect(draft.headline).toBe('CHIẾN THUẬT QUÉT ĐỈNH Á');
    expect(draft.subline).toBe('SMC REJECTION 50% CE');
    expect(draft.outcome).toBe('TAKE_PROFIT');
    expect(draft.candles.length).toBe(6);
    expect(draft.overlays.some((o) => o.kind === 'FVG')).toBe(true);
  });

  it('MUT-ANTI-05: whisperWordSync synchronizes word triggers to exact frame numbers', () => {
    const words = [
      { word: 'Nhận', startSec: 0.1, endSec: 0.3 },
      { word: 'diện', startSec: 0.3, endSec: 0.5 },
      { word: 'bẫy', startSec: 0.6, endSec: 0.9 },
      { word: 'quét', startSec: 1.0, endSec: 1.3 },
      { word: 'thanh', startSec: 1.3, endSec: 1.5 },
      { word: 'khoản', startSec: 1.5, endSec: 1.8 },
      { word: 'tạo', startSec: 2.0, endSec: 2.2 },
      { word: 'vùng', startSec: 2.3, endSec: 2.5 },
      { word: 'fvg', startSec: 2.6, endSec: 2.9 },
      { word: 'chờ', startSec: 3.0, endSec: 3.2 },
      { word: 'vào', startSec: 3.3, endSec: 3.5 },
      { word: 'lệnh', startSec: 3.5, endSec: 3.8 },
      { word: 'chốt', startSec: 4.0, endSec: 4.2 },
      { word: 'lời', startSec: 4.2, endSec: 4.5 },
    ];

    const events = alignWordTimestampsToActions(words, 30, 'TAKE_PROFIT');
    expect(events.length).toBeGreaterThan(0);

    // Verify sweep trigger fires around word "bẫy/quét" (startSec 0.6s -> frame 18)
    const sweepEvent = events.find((e) => e.action.kind === 'SHOW_TEXT' && (e.action as any).text === 'LIQUIDITY SWEEP');
    expect(sweepEvent).toBeDefined();
    expect(sweepEvent!.frame).toBe(18); // 0.6 * 30

    // Verify FVG trigger fires around word "fvg" (startSec 2.6s -> frame 78)
    const fvgEvent = events.find((e) => e.action.kind === 'SHOW_OVERLAY' && (e.action as any).overlayId === 'fvg_1');
    expect(fvgEvent).toBeDefined();
    expect(fvgEvent!.frame).toBe(78); // 2.6 * 30

    // Verify Take Profit trigger fires around word "chốt lời" (startSec 4.0s -> frame 120)
    const tpEvent = events.find((e) => e.action.kind === 'MARK_OUTCOME');
    expect(tpEvent).toBeDefined();
    expect(tpEvent!.frame).toBe(120); // 4.0 * 30
  });
});
