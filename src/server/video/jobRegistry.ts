import { FrozenScene } from '../../video/contracts';
import { JobReceipt, runRenderJob } from './runRenderJob';

class JobRegistry {
  private jobs = new Map<string, JobReceipt>();
  private activeJobId: string | null = null;

  hasActiveJob(): boolean {
    if (!this.activeJobId) return false;
    const current = this.jobs.get(this.activeJobId);
    return current?.status === 'RENDERING';
  }

  getJob(id: string): JobReceipt | null {
    return this.jobs.get(id) || null;
  }

  async submitJob(scene: FrozenScene): Promise<JobReceipt> {
    if (this.hasActiveJob()) {
      throw new Error('A render job is already actively running');
    }

    const id = `job_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    this.activeJobId = id;

    const initialReceipt: JobReceipt = {
      id,
      sceneSha256: scene.sceneSha256,
      status: 'RENDERING',
      artifactHashes: { sceneSha256: scene.sceneSha256 },
      diagnostics: [],
    };
    this.jobs.set(id, initialReceipt);

    // Asynchronously trigger job
    runRenderJob(scene, { runId: id })
      .then((finalReceipt) => {
        this.jobs.set(id, finalReceipt);
        if (this.activeJobId === id) {
          this.activeJobId = null;
        }
      })
      .catch((err) => {
        this.jobs.set(id, {
          id,
          sceneSha256: scene.sceneSha256,
          status: 'FAILED',
          errorCode: 'UNHANDLED_RUNNER_ERROR',
          artifactHashes: { sceneSha256: scene.sceneSha256 },
          diagnostics: [err.message],
        });
        if (this.activeJobId === id) {
          this.activeJobId = null;
        }
      });

    return initialReceipt;
  }

  cancelJob(id: string): boolean {
    const job = this.jobs.get(id);
    if (!job || job.status !== 'RENDERING') return false;

    job.status = 'CANCELLED';
    if (this.activeJobId === id) {
      this.activeJobId = null;
    }
    return true;
  }
}

export const globalJobRegistry = new JobRegistry();

