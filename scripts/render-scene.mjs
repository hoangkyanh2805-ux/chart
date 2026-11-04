import fs from 'node:fs';
import path from 'node:path';
import { runRenderJob, createDeterministicSolidPng } from '../src/server/video/runRenderJob.js';

// CLI script: node scripts/render-scene.mjs --scene <sceneJsonPath> --run-id <runId>
async function main() {
  const args = process.argv.slice(2);
  let scenePath = '';
  let runId = `cli_run_${Date.now()}`;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--scene' && args[i + 1]) {
      scenePath = args[i + 1];
    } else if (args[i] === '--run-id' && args[i + 1]) {
      runId = args[i + 1];
    }
  }

  if (!scenePath || !fs.existsSync(scenePath)) {
    console.error(`Error: --scene path not provided or does not exist: ${scenePath}`);
    process.exit(1);
  }

  const sceneJson = JSON.parse(fs.readFileSync(scenePath, 'utf8'));
  console.log(`Starting render job ${runId} for scene ${sceneJson.sceneSha256}...`);

  const receipt = await runRenderJob(sceneJson, {
    runId,
    frameSource: async (idx) => createDeterministicSolidPng(1080, 1920, idx),
  });

  console.log(`Job finished with status: ${receipt.status}`);
  if (receipt.status !== 'MEDIA_VERIFIED') {
    console.error('Job diagnostics:', receipt.diagnostics);
    process.exit(1);
  } else {
    console.log(`Verified MP4 SHA-256: ${receipt.artifactHashes.mp4Sha256}`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

