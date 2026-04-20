#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = fileURLToPath(new URL('.', import.meta.url));
const webRoot = join(currentDir, '..');
const angularConfigPath = join(webRoot, 'angular.json');

async function hasLintTarget() {
  const raw = await readFile(angularConfigPath, 'utf-8');
  const angularConfig = JSON.parse(raw);
  const projects = angularConfig?.projects ?? {};

  return Object.values(projects).some((project) =>
    Boolean(project?.architect?.lint ?? project?.targets?.lint)
  );
}

function runNgLint() {
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['ng', 'lint'], { cwd: webRoot, stdio: 'inherit' });
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`ng lint exited with code ${code ?? 'unknown'}`));
      }
    });
    child.on('error', reject);
  });
}

async function main() {
  if (!(await hasLintTarget())) {
    console.log('No Angular lint target configured in angular.json; skipping lint.');
    return;
  }

  await runNgLint();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
