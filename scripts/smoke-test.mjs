import http from 'node:http';
import https from 'node:https';

const target = process.argv[2];

if (!target) {
  console.error('Usage: node scripts/smoke-test.mjs <url>');
  process.exit(1);
}

const client = target.startsWith('https') ? https : http;

function request(path) {
  return new Promise((resolve, reject) => {
    const req = client.get(new URL(path, target), (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        resolve({ status: res.statusCode ?? 0, body: Buffer.concat(chunks).toString('utf8') });
      });
    });

    req.on('error', reject);
  });
}

try {
  const health = await request('/health');
  if (health.status !== 200) {
    throw new Error(`Health check failed with status ${health.status}`);
  }

  const tools = await request('/tools');
  if (tools.status !== 200) {
    throw new Error(`Tools endpoint failed with status ${tools.status}`);
  }

  console.log('Smoke tests passed. Service is reachable.');
} catch (error) {
  console.error('Smoke tests failed:', error);
  process.exit(1);
}
