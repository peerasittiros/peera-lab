import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function contentHash(directory = join(process.cwd(), 'content')) {
  const hash = createHash('sha256');
  for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      hash.update(contentHash(path));
    } else {
      hash.update(entry.name);
      hash.update(readFileSync(path));
    }
  }
  return hash.digest('hex');
}

async function checkServer(label, env, checks) {
  const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3101'], {
    cwd: process.cwd(),
    env: { ...process.env, ...env },
    stdio: 'ignore',
    windowsHide: true,
  });

  try {
    let ready = false;
    for (let attempt = 0; attempt < 80; attempt += 1) {
      if (server.exitCode !== null) throw new Error(`Server exited with ${server.exitCode}`);
      try {
        await fetch('http://localhost:3101/robots.txt');
        ready = true;
        break;
      } catch {
        await wait(500);
      }
    }
    if (!ready) throw new Error('Server did not start');

    for (const [path, method, headers, body, expected] of checks) {
      const response = await fetch(`http://localhost:3101${path}`, {
        method,
        headers,
        body,
        redirect: 'manual',
      });
      console.log(`${label} ${method} ${path}: ${response.status} (expected ${expected})`);
      if (response.status !== expected) throw new Error(`Unexpected status for ${method} ${path}`);
    }
  } finally {
    server.kill();
    await wait(500);
  }
}

(async () => {
  const contentBeforeVercelRequests = contentHash();
  await checkServer('vercel', { VERCEL: '1' }, [
    ['/admin', 'GET', {}, undefined, 404],
    ['/admin/login', 'GET', {}, undefined, 404],
    ['/admin/site', 'POST', { 'content-type': 'text/plain', 'next-action': 'invalid' }, '[]', 404],
  ]);
  if (contentHash() !== contentBeforeVercelRequests) throw new Error('Content files changed during Vercel requests');
  console.log('vercel admin requests: content files unchanged');
  await checkServer('local', {}, [
    ['/admin/login', 'GET', {}, undefined, 200],
    ['/admin', 'GET', {}, undefined, 307],
  ]);
  await checkServer('force-enabled', { VERCEL: '1', ADMIN_FORCE_ENABLE: '1' }, [
    ['/admin/login', 'GET', {}, undefined, 200],
    ['/admin', 'GET', {}, undefined, 307],
  ]);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});