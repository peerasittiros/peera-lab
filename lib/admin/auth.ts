// Admin login: one account from environment variables, a signed session cookie, no database.
//   ADMIN_USERNAME        the login name
//   ADMIN_PASSWORD_HASH   scrypt:<salt hex>:<hash hex>, made by `npm run admin:setup`
//   ADMIN_SECRET          random string (≥ 32 chars) that signs the session cookie
//   ADMIN_FORCE_ENABLE=1  explicitly enable the admin on Vercel (local-only by default)
// Every admin page and every admin Server Action checks availability before doing any work.
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

export const SESSION_COOKIE = 'pl_admin';
const SESSION_HOURS = 8;

/** The admin writes to disk, so it is unavailable on Vercel unless explicitly overridden. */
export function adminAvailable(): boolean {
  return process.env.VERCEL !== '1' || process.env.ADMIN_FORCE_ENABLE === '1';
}

interface AdminConfig {
  username: string;
  passwordHash: string;
  secret: string;
}

/** Null when the admin is not configured; the login page then explains how to set it up. */
export function adminConfig(): AdminConfig | null {
  const username = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const secret = process.env.ADMIN_SECRET;
  if (!username || !passwordHash?.startsWith('scrypt:') || !secret || secret.length < 32) return null;
  return { username, passwordHash, secret };
}

function safeEqual(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && timingSafeEqual(a, b);
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  return `scrypt:${salt.toString('hex')}:${scryptSync(password, salt, 64).toString('hex')}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [, saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, 'hex');
  return safeEqual(scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length), expected);
}

/** Checks both fields with constant-time comparisons, so a wrong username takes as long as a wrong password. */
export function checkCredentials(username: string, password: string): boolean {
  const config = adminConfig();
  if (!config) return false;
  const userOk = safeEqual(
    createHmac('sha256', config.secret).update(username).digest(),
    createHmac('sha256', config.secret).update(config.username).digest(),
  );
  const passOk = verifyPassword(password, config.passwordHash);
  return userOk && passOk;
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

/** Token: `<expiry ms>.<signature of expiry + username>`. Changing ADMIN_SECRET or the username logs everyone out. */
export function createSessionToken(): string {
  const config = adminConfig();
  if (!config) throw new Error('admin is not configured');
  const expires = Date.now() + SESSION_HOURS * 3600_000;
  return `${expires}.${sign(`${expires}.${config.username}`, config.secret)}`;
}

function validToken(token: string | undefined): boolean {
  const config = adminConfig();
  if (!config || !token) return false;
  const [expires, signature] = token.split('.');
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return safeEqual(Buffer.from(signature), Buffer.from(sign(`${expires}.${config.username}`, config.secret)));
}

export async function setSessionCookie() {
  (await cookies()).set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/admin',
    maxAge: SESSION_HOURS * 3600,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete({ name: SESSION_COOKIE, path: '/admin' });
}

export async function isAdmin(): Promise<boolean> {
  return validToken((await cookies()).get(SESSION_COOKIE)?.value);
}

/** Use at the top of every admin page and Server Action. */
export async function requireAdmin() {
  if (!adminAvailable()) notFound();
  if (!(await isAdmin())) redirect('/admin/login');
}
