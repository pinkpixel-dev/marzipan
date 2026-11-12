// npm run dev: one clean build, then rebuild the bundle and the .d.ts files as you edit.
// Vite and tsc both write into dist/, so the watching Vite build must not empty it.
import { spawn, spawnSync } from 'node:child_process';

const shell = process.platform === 'win32';
const npx = (args, env = {}) =>
  spawn('npx', args, { stdio: 'inherit', shell, env: { ...process.env, ...env } });

const first = spawnSync('npx', ['vite', 'build'], { stdio: 'inherit', shell });
if (first.status !== 0) process.exit(first.status ?? 1);

const watchers = [
  npx(['vite', 'build', '--watch'], { MARZIPAN_WATCH: '1' }),
  npx(['tsc', '-p', 'tsconfig.build.json', '--watch', '--preserveWatchOutput']),
];

let stopping = false;
const stop = (code = 0) => {
  if (stopping) return;
  stopping = true;
  for (const child of watchers) child.kill();
  process.exit(code);
};

process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
for (const child of watchers) {
  child.on('exit', (code) => {
    if (!stopping) stop(code ?? 1);
  });
}
