// Reads and writes the content JSON for the admin. Every write is validated with the same Zod schemas the site
// builds with, so the admin can't save something that would break the site.
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { productSchema, siteSchema } from '@/lib/content';
import type { Kind } from '@/lib/collections';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const SLUG = /^[a-z0-9-]+$/;

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
export type JsonObject = { [key: string]: Json };

/** Save result shown by the admin forms. */
export type SaveState = { ok: boolean; message: string } | null;

export function isSlug(value: string): boolean {
  return SLUG.test(value);
}

function readJson(file: string): JsonObject {
  return JSON.parse(readFileSync(file, 'utf8')) as JsonObject;
}

/** Writes through a temp file and a rename, so a crash never leaves half a file. */
function writeJson(file: string, data: JsonObject) {
  mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.tmp`;
  writeFileSync(temp, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  renameSync(temp, file);
}

function itemFile(kind: Kind, slug: string): string {
  if (!isSlug(slug)) throw new Error(`bad slug: ${slug}`);
  return path.join(CONTENT_DIR, kind, `${slug}.json`);
}

/** The site's pages are prerendered; this makes every page pick up the new content on its next visit. */
function refreshSite() {
  revalidatePath('/', 'layout');
  revalidatePath('/[locale]', 'layout');
}

function issues(error: z.ZodError): string {
  return error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`).join('\n');
}

// ---- site.json

export function readSite(): JsonObject {
  return readJson(path.join(CONTENT_DIR, 'site.json'));
}

export function saveSite(data: JsonObject): SaveState {
  const result = siteSchema.safeParse(data);
  if (!result.success) return { ok: false, message: issues(result.error) };
  writeJson(path.join(CONTENT_DIR, 'site.json'), data);
  refreshSite();
  return { ok: true, message: 'saved' };
}

// ---- products and projects

/** Every item, drafts included, as stored (not the parsed form), in list order. */
export function listItems(kind: Kind): JsonObject[] {
  const dir = path.join(CONTENT_DIR, kind);
  if (!existsSync(dir)) return [];
  const rank = (item: JsonObject) => (typeof item.order === 'number' ? item.order : Number.MAX_SAFE_INTEGER);
  return readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => readJson(path.join(dir, file)))
    .sort((a, b) => rank(a) - rank(b) || String(a.slug).localeCompare(String(b.slug)));
}

export function readItem(kind: Kind, slug: string): JsonObject | null {
  const file = itemFile(kind, slug);
  return existsSync(file) ? readJson(file) : null;
}

/** Products need exactly one published featured item, or the site build fails. */
function featuredProblem(items: JsonObject[]): string | null {
  const count = items.filter((item) => item.featured === true && item.draft !== true).length;
  return count === 1 ? null : `exactly one published product must be featured (this change would leave ${count})`;
}

/**
 * Validates and saves one item. `isNew` refuses to overwrite an existing slug.
 * Marking a product featured un-features the others, so there is always exactly one.
 */
export function saveItem(kind: Kind, data: JsonObject, isNew: boolean): SaveState {
  const slug = String(data.slug ?? '');
  if (!isSlug(slug)) return { ok: false, message: 'slug: lowercase letters, digits and hyphens only' };
  if (isNew && existsSync(itemFile(kind, slug))) return { ok: false, message: `slug "${slug}" already exists` };

  const result = productSchema.safeParse(data);
  if (!result.success) return { ok: false, message: issues(result.error) };

  if (kind === 'products') {
    const others = listItems('products').filter((item) => item.slug !== slug);
    const unfeatured = data.featured === true ? others.map((item) => ({ ...item, featured: false })) : others;
    const problem = featuredProblem([...unfeatured, data]);
    if (problem) return { ok: false, message: problem };
    if (data.featured === true) {
      for (const item of others.filter((other) => other.featured === true)) {
        const rest = { ...item };
        delete rest.featured;
        writeJson(itemFile('products', String(item.slug)), rest);
      }
    }
  } else {
    delete data.featured;
  }

  writeJson(itemFile(kind, slug), data);
  refreshSite();
  return { ok: true, message: 'saved' };
}

/** Moves the file to content/_deleted/<kind>/<slug>.<timestamp>.json, so a delete can be undone by moving it back. */
export function deleteItem(kind: Kind, slug: string): SaveState {
  const file = itemFile(kind, slug);
  if (!existsSync(file)) return { ok: false, message: 'not found' };
  if (kind === 'products') {
    const problem = featuredProblem(listItems('products').filter((item) => item.slug !== slug));
    if (problem) return { ok: false, message: `${problem}. Feature another product first.` };
  }
  const trash = path.join(CONTENT_DIR, '_deleted', kind);
  mkdirSync(trash, { recursive: true });
  renameSync(file, path.join(trash, `${slug}.${new Date().toISOString().replace(/[:.]/g, '-')}.json`));
  refreshSite();
  return { ok: true, message: 'deleted' };
}

/** Starting point for a new item: a draft, last in the list, with both locales stubbed. */
export function newItemTemplate(kind: Kind): JsonObject {
  const orders = listItems(kind)
    .map((item) => item.order)
    .filter((order): order is number => typeof order === 'number');
  return {
    slug: '',
    draft: true,
    title: { en: '', th: '' },
    tagline: { en: '', th: '' },
    category: { en: '', th: '' },
    status: 'concept',
    order: orders.length ? Math.max(...orders) + 1 : 1,
    startedAt: new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Bangkok' }),
    technologies: [],
    preview: 'dashboard',
  };
}
