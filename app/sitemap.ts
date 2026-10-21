import type { MetadataRoute } from 'next';
import { getItems, kindHref, type Kind } from '@/lib/collections';
import { defaultLocale, locales } from '@/lib/i18n';
import { absoluteUrl } from '@/lib/site-url';

function localizedEntry(path: (locale: (typeof locales)[number]) => string): MetadataRoute.Sitemap[number][] {
  const languages = {
    en: absoluteUrl(path('en')),
    th: absoluteUrl(path('th')),
    'x-default': absoluteUrl(path(defaultLocale)),
  };
  return locales.map((locale) => ({
    url: absoluteUrl(path(locale)),
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    ...localizedEntry((locale) => `/${locale}`),
    ...localizedEntry((locale) => `/${locale}/products`),
    ...localizedEntry((locale) => `/${locale}/projects`),
    ...localizedEntry((locale) => `/${locale}/contact`),
  ];

  for (const kind of ['products', 'projects'] as const satisfies readonly Kind[]) {
    for (const item of getItems(kind)) {
      entries.push(...localizedEntry((locale) => kindHref(kind, locale, item.slug)));
    }
  }

  return entries;
}
