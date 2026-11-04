import { FrozenScene, FrameReceipt } from './contracts';
import { renderFrame } from './renderFrame';

export interface RenderBridge {
  loadScene(scene: FrozenScene): Promise<{ ok: boolean }>;
  renderFrame(index: number): Promise<{ receipt: FrameReceipt }>;
  getStatus(): { loaded: boolean; frameCount: number };
}

export class HeadlessRenderBridge implements RenderBridge {
  private activeScene: FrozenScene | null = null;
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  async loadScene(scene: FrozenScene): Promise<{ ok: boolean }> {
    this.activeScene = scene;
    return { ok: true };
  }

  async renderFrame(index: number): Promise<{ receipt: FrameReceipt }> {
    if (!this.activeScene) {
      throw new Error('No scene loaded');
    }
    const receipt = renderFrame(this.ctx, this.activeScene, index);
    return { receipt };
  }

  getStatus(): { loaded: boolean; frameCount: number } {
    return {
      loaded: !!this.activeScene,
      frameCount: this.activeScene?.frameCount || 0,
    };
  }
}

