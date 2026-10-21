'use server';

import { redirect } from 'next/navigation';
import { isKind, type Kind } from '@/lib/collections';
import { checkCredentials, clearSessionCookie, requireAdmin, setSessionCookie } from '@/lib/admin/auth';
import { deleteItem, readSite, saveItem, saveSite, type Json, type JsonObject, type SaveState } from '@/lib/admin/store';

// ---- session

export async function login(_: SaveState, formData: FormData): Promise<SaveState> {
  const username = String(formData.get('username') ?? '');
  const password = String(formData.get('password') ?? '');
  if (!checkCredentials(username, password)) {
    // Slows down guessing; the response is the same for a wrong username or a wrong password.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { ok: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
  }
  await setSessionCookie();
  redirect('/admin');
}

export async function logout() {
  await clearSessionCookie();
  redirect('/admin/login');
}

// ---- site wording

/** Sets `value` at a dotted path ("hero.title.th", "nav.0.label.en") inside `target`, only where a string already is. */
function setString(target: JsonObject, dotted: string, value: string) {
  const keys = dotted.split('.');
  let node: Json = target;
  for (const key of keys.slice(0, -1)) {
    if (node === null || typeof node !== 'object') return;
    node = (node as Record<string, Json>)[key];
  }
  const last = keys[keys.length - 1];
  if (node !== null && typeof node === 'object' && typeof (node as Record<string, Json>)[last] === 'string') {
    (node as Record<string, Json>)[last] = value;
  }
}

export async function saveSiteAction(_: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();
  const site = readSite();
  for (const [name, value] of formData.entries()) {
    if (name.startsWith('s.') && typeof value === 'string') setString(site, name.slice(2), value.trim());
  }
  return saveSite(site);
}

// ---- products and projects

function text(formData: FormData, name: string): string {
  return String(formData.get(name) ?? '').trim();
}

/** `{ en, th }` from `<name>.en` / `<name>.th`; undefined when both are empty (optional fields are then left out). */
function localized(formData: FormData, name: string): { en: string; th: string } | undefined {
  const en = text(formData, `${name}.en`);
  const th = text(formData, `${name}.th`);
  return en || th ? { en, th } : undefined;
}

function itemFromForm(formData: FormData): JsonObject | string {
  const item: JsonObject = { slug: text(formData, 'slug') };
  if (formData.get('draft') === 'on') item.draft = true;
  if (formData.get('featured') === 'on') item.featured = true;

  for (const name of ['title', 'tagline', 'category']) item[name] = localized(formData, name) ?? { en: '', th: '' };
  item.status = text(formData, 'status');
  const order = text(formData, 'order');
  if (order) item.order = Number(order);
  for (const name of ['startedAt', 'thumbnail', 'demoUrl', 'repositoryUrl', 'url']) {
    const value = text(formData, name);
    if (value) item[name] = value;
  }
  for (const name of ['description', 'problem', 'value', 'thumbnailAlt']) {
    const value = localized(formData, name);
    if (value) item[name] = value;
  }
  item.technologies = text(formData, 'technologies')
    .split(/[,\n]/)
    .map((tech) => tech.trim())
    .filter(Boolean);
  const preview = text(formData, 'preview');
  if (preview) item.preview = preview;

  // Screenshots and page sections are edited as JSON (their shape varies by section type).
  for (const name of ['screenshots', 'sections']) {
    const raw = text(formData, name);
    if (!raw) continue;
    try {
      item[name] = JSON.parse(raw) as Json;
    } catch {
      return `${name}: JSON ไม่ถูกต้อง`;
    }
  }
  return item;
}

function kindFrom(formData: FormData): Kind {
  const kind = text(formData, 'kind');
  if (!isKind(kind)) throw new Error('bad kind');
  return kind;
}

export async function saveItemAction(_: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();
  const kind = kindFrom(formData);
  const isNew = formData.get('isNew') === '1';
  const item = itemFromForm(formData);
  if (typeof item === 'string') return { ok: false, message: item };
  if (item.slug === 'new') return { ok: false, message: 'slug "new" is reserved' };
  const result = saveItem(kind, item, isNew);
  if (result?.ok && isNew) redirect(`/admin/${kind}/${String(item.slug)}?saved=1`);
  return result;
}

export async function deleteItemAction(_: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();
  const kind = kindFrom(formData);
  const result = deleteItem(kind, text(formData, 'slug'));
  if (result?.ok) redirect(`/admin?deleted=${encodeURIComponent(text(formData, 'slug'))}`);
  return result;
}
