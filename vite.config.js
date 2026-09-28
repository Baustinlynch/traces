import { execSync } from 'node:child_process';
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

function buildId() {
  const fromEnv = process.env.VERCEL_GIT_COMMIT_SHA || process.env.BUILD_ID;
  if (fromEnv) return String(fromEnv).slice(0, 7);
  try {
    return execSync('git rev-parse --short HEAD', {
      stdio: ['ignore', 'pipe', 'ignore']
    })
      .toString()
      .trim();
  } catch {
    return 'dev';
  }
}

export default defineConfig({
  plugins: [sveltekit()],
  define: {
    __BUILD_ID__: JSON.stringify(buildId())
  }
});
