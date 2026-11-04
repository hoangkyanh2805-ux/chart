import fs from 'node:fs';
import path from 'node:path';
import { probeAndVerifyMedia } from '../src/server/video/verifyMedia.js';

// CLI script: node scripts/verify-render.mjs --run-id <runId>
async function main() {
  const args = process.argv.slice(2);
  let runId = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--run-id' && args[i + 1]) {
      runId = args[i + 1];
    }
  }

  if (!runId) {
    console.error('Error: --run-id must be provided');
    process.exit(1);
  }

  const runDir = path.resolve(process.cwd(), `livrables/s2v_runs/${runId}`);
  const scenePath = path.resolve(runDir, 'frozen-scene.json');
  const mp4Path = path.resolve(runDir, 'output.mp4');

  if (!fs.existsSync(scenePath)) {
    console.error(`Error: Scene file not found: ${scenePath}`);
    process.exit(1);
  }

  if (!fs.existsSync(mp4Path)) {
    console.error(`Error: Output MP4 not found: ${mp4Path}`);
    process.exit(1);
  }

  const scene = JSON.parse(fs.readFileSync(scenePath, 'utf8'));
  const probe = probeAndVerifyMedia(mp4Path, scene.frameCount, 30);

  if (!probe.valid) {
    console.error('Media verification failed:', probe.errors);
    process.exit(1);
  } else {
    console.log(`Media verified successfully! ${probe.frameCount} frames, 1080x1920, duration ${probe.videoDurationSec.toFixed(2)}s`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

