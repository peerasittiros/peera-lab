// Products and projects work the same way: one JSON file per item (same schema), a list page with a status
// filter, an item page and a demo page. Their copy lives in content/site.json (`collections`).
import { getProducts, getProjects, getSite, type Product, type Site } from '@/lib/content';
import type { Locale, Localized } from '@/lib/i18n';

export const kindList = ['products', 'projects'] as const;
export type Kind = (typeof kindList)[number];

export function isKind(value: string): value is Kind {
  return (kindList as readonly string[]).includes(value);
}

/** Products are numbered P-01 …; projects are not. */
export const indexPrefix: Record<Kind, string | undefined> = { products: 'P', projects: undefined };

export type KindCopy = Site['collections'][Kind];

export function kindCopy(kind: Kind): KindCopy {
  return getSite().collections[kind];
}

/** Fills `{name}` in a copy template with an item's title, per locale. */
export function withName(template: Localized, name: Localized): Localized {
  return { en: template.en.replaceAll('{name}', name.en), th: template.th.replaceAll('{name}', name.th) };
}

export function getItems(kind: Kind): Product[] {
  return kind === 'products' ? getProducts() : getProjects();
}

/** `/th/projects`, `/th/projects/<slug>`, `/th/projects/<slug>/demo` … */
export function kindHref(kind: Kind, locale: Locale, slug?: string, demo?: boolean): string {
  return `/${locale}/${kind}${slug ? `/${slug}` : ''}${demo ? '/demo' : ''}`;
}
