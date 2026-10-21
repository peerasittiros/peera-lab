// Sets the admin login in .env.local: ADMIN_USERNAME, ADMIN_PASSWORD_HASH (scrypt) and ADMIN_SECRET.
// Usage: npm run admin:setup                       (asks for username and password)
//        npm run admin:setup -- <username> <password>
// Restart the server afterwards. Running it again changes the password and logs out every session.
import { randomBytes, scryptSync } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';

let [username, password] = process.argv.slice(2);
if (!username || !password) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  username = (await rl.question('Admin username: ')).trim();
  password = await rl.question('Admin password (at least 12 characters): ');
  rl.close();
}
if (!/^[A-Za-z0-9._-]{3,}$/.test(username ?? '')) {
  console.error('admin:setup: username must be 3+ characters: letters, digits, . _ -');
  process.exit(1);
}
if (!password || password.length < 12) {
  console.error('admin:setup: password must be at least 12 characters');
  process.exit(1);
}

const salt = randomBytes(16);
const values = {
  ADMIN_USERNAME: username,
  // Hex only, so Next's .env variable expansion ($) never touches it.
  ADMIN_PASSWORD_HASH: `scrypt:${salt.toString('hex')}:${scryptSync(password, salt, 64).toString('hex')}`,
  ADMIN_SECRET: randomBytes(32).toString('hex'),
};

const file = path.join(process.cwd(), '.env.local');
const lines = existsSync(file) ? readFileSync(file, 'utf8').split(/\r?\n/) : [];
// Drops the old values, and the test-login note left by the setup session, if any.
const kept = lines.filter(
  (line) => !line.startsWith('# ADMIN test login') && !Object.keys(values).some((key) => line.startsWith(`${key}=`)),
);
while (kept.length && kept[kept.length - 1] === '') kept.pop();
const out = [...kept, ...Object.entries(values).map(([key, value]) => `${key}=${value}`)].join('\n');
writeFileSync(file, `${out}\n`, 'utf8');

console.log(`Saved the admin login for "${username}" to .env.local (git-ignored). Restart the server, then open /admin.`);
