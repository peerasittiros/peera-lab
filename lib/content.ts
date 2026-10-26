// Loads and validates the JSON in content/ with Zod. Runs at build time (static generation).
// Any invalid file throws, so the build fails with the file name and the problem.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export const productStatuses = [
  'concept',
  'prototype',
  'in-development',
  'live-demo',
  'live',
  'coming-soon',
  'archived',
] as const;

/**
 * Both locales are written in the source. A missing or empty `th` falls back to `en` and logs a warning
 * (bilingual.md: "a missing th falls back to en and is flagged at build time").
 */
const localized = z
  .object({ en: z.string().min(1), th: z.string().optional() })
  .transform(({ en, th }) => {
    if (!th) {
      console.warn(`[content] missing "th", using "en": ${en.slice(0, 60)}`);
      return { en, th: en };
    }
    return { en, th };
  });

const slug = z.string().regex(/^[a-z0-9-]+$/, 'slug must be lowercase letters, digits and hyphens');
const step = z.object({ title: localized, body: localized });

export const productSectionSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('overview'), body: localized }),
  z.object({ type: z.literal('problem'), body: localized }),
  z.object({ type: z.literal('solution'), body: localized }),
  z.object({ type: z.literal('features'), items: z.array(step) }),
  z.object({ type: z.literal('gallery'), screenshots: z.array(z.string().min(1)) }),
  z.object({ type: z.literal('how-it-works'), steps: z.array(step) }),
  z.object({
    type: z.literal('architecture'),
    diagram: z.string().min(1),
    stack: z.array(z.string().min(1)),
    body: localized.optional(),
  }),
  z.object({ type: z.literal('demo'), url: z.url(), note: localized.optional() }),
  z.object({ type: z.literal('status'), body: localized }),
  z.object({ type: z.literal('roadmap'), items: z.array(localized) }),
]);

export const productSchema = z.object({
  slug,
  title: localized,
  tagline: localized,
  description: localized.optional(),
  category: localized,
  status: z.enum(productStatuses),
  featured: z.boolean().optional(),
  /** Work in progress: validated, but left out of every page until removed. */
  draft: z.boolean().optional(),
  order: z.number().int().optional(),
  startedAt: z.iso.date().optional(),
  problem: localized.optional(),
  value: localized.optional(),
  technologies: z.array(z.string().min(1)),
  thumbnail: z.string().min(1).optional(),
  thumbnailAlt: localized.optional(),
  preview: z.enum(['table', 'calendar', 'board', 'dashboard']).optional(),
  screenshots: z
    .array(z.object({ src: z.string().min(1), alt: localized, caption: localized.optional() }))
    .optional(),
  demoUrl: z.url().optional(),
  repositoryUrl: z.url().optional(),
  url: z.url().optional(),
  sections: z.array(productSectionSchema).optional(),
})
  // A screenshot needs alt text in both languages (README › Accessibility), so a thumbnail needs thumbnailAlt.
  // A gallery lists screenshot paths; each must be in `screenshots`, which holds its alt text.
  .superRefine((product, ctx) => {
    if (product.thumbnail && !product.thumbnailAlt) {
      ctx.addIssue({ code: 'custom', path: ['thumbnailAlt'], message: 'a thumbnail needs thumbnailAlt { en, th }' });
    }
    const known = new Set((product.screenshots ?? []).map((shot) => shot.src));
    (product.sections ?? []).forEach((section, i) => {
      if (section.type !== 'gallery') return;
      for (const src of section.screenshots) {
        if (!known.has(src)) {
          ctx.addIssue({ code: 'custom', path: ['sections', i, 'screenshots'], message: `"${src}" is not in screenshots` });
        }
      }
    });
  });


const action = z.object({ label: localized, href: z.string().min(1) });

const collectionCopy = z.object({
  title: localized,
  lead: localized,
  empty: localized,
  more: localized,
  all: localized,
  request: localized,
  contactTitle: localized,
});

export const siteSchema = z.object({
  name: z.string().min(1),
  nav: z.array(z.object({ key: z.string().min(1), label: localized, href: z.string().min(1) })),
  hero: z.object({ eyebrow: localized.optional(), title: localized, lead: localized, actions: z.array(action) }),
  contact: z.object({
    title: localized,
    lead: localized,
    /** Who the visitor is writing to. All personal details live here, in the Contact band only. */
    person: z.object({ name: localized, role: localized, body: localized.optional() }),
    email: z.email(),
    phone: z.string().min(1),
    actions: z.array(action),
  }),
  /** Home page copy that is not in hero or contact. */
  home: z.object({
    building: localized,
    lab: z.object({ title: localized, lead: localized, all: localized }),
    details: z.object({ title: localized, lead: localized }),
  }),
  /** Copy for the Products and Projects pages. `contactTitle` may contain {name}, replaced by the item's title. */
  collections: z.object({ products: collectionCopy, projects: collectionCopy }),
  demo: z.object({ label: localized, previewLead: localized, liveLead: localized, newTab: localized, back: localized }),
  contactPage: z.object({ title: localized, lead: localized }),
  notFound: z.object({ title: localized, body: localized, home: localized }),
});

export type Product = z.output<typeof productSchema>;
export type ProductSection = z.output<typeof productSectionSchema>;
export type Site = z.output<typeof siteSchema>;

function parse<S extends z.ZodType>(schema: S, data: unknown, label: string): z.output<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`[content] invalid ${label}:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

function readJson(file: string): unknown {
  return JSON.parse(readFileSync(path.join(CONTENT_DIR, file), 'utf8'));
}

/** Reads every *.json in a content folder (none if the folder doesn't exist). The file name must match the `slug` inside. */
function readCollection<S extends z.ZodType<{ slug: string }>>(folder: string, schema: S): z.output<S>[] {
  const dir = path.join(CONTENT_DIR, folder);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .sort()
    .map((file) => {
      const item = parse(schema, readJson(path.join(folder, file)), `${folder}/${file}`);
      if (`${item.slug}.json` !== file) {
        throw new Error(`[content] ${folder}/${file}: slug "${item.slug}" must match the file name`);
      }
      return item;
    });
}

/** Published products (drafts left out), in Lab order: `order` ascending, then slug. Exactly one must be `featured`. */
export function getProducts(): Product[] {
  const products = readCollection('products', productSchema).filter((product) => !product.draft);
  const featured = products.filter((product) => product.featured).length;
  if (featured !== 1) {
    throw new Error(`[content] exactly one product must be featured, found ${featured}`);
  }
  return inOrder(products);
}

/** Published projects: same file format as products (content/projects/<slug>.json), same order. `featured` is ignored. */
export function getProjects(): Product[] {
  return inOrder(readCollection('projects', productSchema).filter((project) => !project.draft));
}

/** `order` ascending (items without one go last), then slug. */
function inOrder(items: Product[]): Product[] {
  const rank = (item: Product) => item.order ?? Number.MAX_SAFE_INTEGER;
  return items.sort((a, b) => rank(a) - rank(b) || a.slug.localeCompare(b.slug));
}

export function getProduct(slug: string): Product | undefined {
  return getProducts().find((product) => product.slug === slug);
}

export function getFeaturedProduct(): Product {
  const featured = getProducts().find((product) => product.featured);
  if (!featured) throw new Error('[content] no featured product');
  return featured;
}

export function getSite(): Site {
  return parse(siteSchema, readJson('site.json'), 'site.json');
}
