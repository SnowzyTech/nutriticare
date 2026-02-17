import { execSync } from 'child_process';

console.log('Regenerating pnpm-lock.yaml...');
execSync('pnpm install --no-frozen-lockfile', {
  cwd: '/vercel/share/v0-project',
  stdio: 'inherit',
});
console.log('Done! pnpm-lock.yaml has been regenerated.');
