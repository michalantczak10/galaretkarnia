import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = resolve(process.cwd());
const sourceDir = resolve(projectRoot, 'client', 'dist');
const targetDir = resolve(projectRoot, 'dist');

if (!existsSync(sourceDir)) {
  console.error('[VERCEL] Missing build output:', sourceDir);
  process.exit(1);
}

if (existsSync(targetDir)) {
  rmSync(targetDir, { recursive: true, force: true });
}

mkdirSync(targetDir, { recursive: true });

function copyRecursive(src, dest) {
  const entries = readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = resolve(src, entry.name);
    const destPath = resolve(dest, entry.name);

    if (entry.isDirectory()) {
      mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath);
      continue;
    }

    if (entry.isFile()) {
      copyFileSync(srcPath, destPath);
    }
  }
}

copyRecursive(sourceDir, targetDir);

console.log('[VERCEL] Synced client/dist -> dist');
