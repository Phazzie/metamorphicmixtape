#!/usr/bin/env node

const baseUrl = process.argv[2];

if (!baseUrl) {
  console.error('Usage: smoke-test.ts <base-url>');
  process.exit(1);
}

async function checkHealth() {
  const response = await fetch(new URL('/health', baseUrl));
  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }
  const body = await response.json();
  if (body.status !== 'ok') {
    throw new Error('Health check did not return ok status');
  }
}

async function checkTools() {
  const response = await fetch(new URL('/tools', baseUrl));
  if (!response.ok) {
    throw new Error(`Tools endpoint failed with status ${response.status}`);
  }
  const body = await response.json();
  if (!Array.isArray(body) || body.length === 0) {
    throw new Error('Tools endpoint returned no contracts');
  }
}

async function main() {
  await checkHealth();
  await checkTools();
  console.log('Smoke tests passed. Adapter is reachable.');
}

main().catch((error) => {
  console.error('Smoke test failed:', error);
  process.exit(1);
});
