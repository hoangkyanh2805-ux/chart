/**
 * Standalone Verifier for Grounded Citations & Ledger Invariants
 * Enforces Hermes v0.20 Grounded Citations Protocol
 */

const { execSync } = require('child_process');

console.log('====================================================');
console.log('🔍 VERIFYING HERMES GROUNDED CITATIONS INVARIANTS');
console.log('====================================================\n');

try {
  const output = execSync('node ./node_modules/vitest/vitest.mjs run tests/groundedCitations.test.ts --pool=forks', {
    encoding: 'utf-8',
    stdio: 'pipe',
  });
  console.log(output.trim());
  console.log('\n✅ [Grounded Citations & 3 Broken Mutations] 100% VERIFIED\n');
  process.exit(0);
} catch (err) {
  console.error('❌ Grounded Citations Verification FAILED:');
  if (err.stdout) console.error(err.stdout.toString().trim());
  if (err.stderr) console.error(err.stderr.toString().trim());
  process.exit(1);
}

