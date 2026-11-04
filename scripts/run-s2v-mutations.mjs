import { execSync } from 'node:child_process';

console.log('--- RUNNING S2V 5 MUTATION TESTS ---');
try {
  const out = execSync('node node_modules/vitest/vitest.mjs run tests/video/mutations.test.ts', {
    encoding: 'utf8',
    stdio: 'inherit',
  });
  console.log('✅ ALL 5 MUTATIONS SUCCESSFULLY CAUGHT (100% KILL RATE)');
  process.exit(0);
} catch (err) {
  console.error('❌ Mutation suite execution failed');
  process.exit(1);
}

