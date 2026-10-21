import type { Metadata } from 'next';
import { getItems, kindHref, type Kind } from '@/lib/collections';
import { getSite, type Product } from '@/lib/content';
import { STATUS } from '@/lib/design';
import { defaultLocale, formatPhone, locales, plain, t, type Locale } from '@/lib/i18n';
import { absoluteUrl } from '@/lib/site-url';

export function languageAlternates(path: (locale: Locale) => string, locale: Locale): NonNullable<Metadata['alternates']> {
  return {
    canonical: absoluteUrl(path(locale)),
    languages: {
      en: absoluteUrl(path('en')),
      th: absoluteUrl(path('th')),
      'x-default': absoluteUrl(path(defaultLocale)),
    },
  };
}

export function localizedOpenGraph(locale: Locale, title: string, description: string, path: string): Metadata['openGraph'] {
  return {
    type: 'website',
    locale: locale === 'th' ? 'th_TH' : 'en_US',
    alternateLocale: locales.filter((entry) => entry !== locale).map((entry) => entry === 'th' ? 'th_TH' : 'en_US'),
    url: absoluteUrl(path),
    title,
    description,
  };
}

/**
 * Title, description, canonical + hreflang and Open Graph for one page. `|` phrase markers are removed.
 * `brand: 'absolute'` is for the home page, which the layout's "%s | Peera Lab" template does not reach.
 */
export function pageMetadata(locale: Locale, path: string, rawTitle: string, description: string, brand?: 'absolute'): Metadata {
  const title = plain(rawTitle);
  return {
    title: brand === 'absolute' ? { absolute: `${title} | Peera Lab` } : title,
    description,
    alternates: languageAlternates((language) => path.replace(`/${locale}`, `/${language}`), locale),
    openGraph: localizedOpenGraph(locale, `${title} | Peera Lab`, description, path),
    twitter: { card: 'summary_large_image', title: `${title} | Peera Lab`, description },
  };
}

export function collectionMetadata(locale: Locale, kind: Kind): Metadata {
  const site = getSite();
  const copy = site.collections[kind];
  const path = `/${locale}/${kind}`;
  const title = plain(t(copy.title, locale));
  const description = t(copy.lead, locale);
  return {
    ...pageMetadata(locale, path, title, description),
    alternates: languageAlternates((language) => `/${language}/${kind}`, locale),
    openGraph: localizedOpenGraph(locale, `${title} | Peera Lab`, description, path),
  };
}

/** Demo pages: localized title and lead, alternates, but never indexed (a preview, or someone else's app in a frame). */
export function demoMetadata(locale: Locale, kind: Kind, slug: string): Metadata {
  const product = getItems(kind).find((item) => item.slug === slug);
  const demo = getSite().demo;
  if (!product) return notFoundMetadata;
  const title = `${plain(t(product.title, locale))} — ${t(demo.label, locale)}`;
  const description = t(product.demoUrl ? demo.liveLead : demo.previewLead, locale);
  return {
    ...pageMetadata(locale, kindHref(kind, locale, slug, true), title, description),
    alternates: languageAlternates((language) => kindHref(kind, language, slug, true), locale),
    robots: { index: false, follow: true },
  };
}

/**
 * Metadata for 404s: not-found.tsx and every route that can call notFound(). Next renders a 404 as an error shell
 * and builds the page on the client from the route's own metadata, so the route must carry the 404 title too.
 */
export const notFoundMetadata: Metadata = {
  title: { absolute: 'ไม่พบหน้านี้ · Page not found | Peera Lab' },
  robots: { index: false, follow: false },
};

export function itemMetadata(locale: Locale, kind: Kind, slug: string): Metadata {
  const product = getItems(kind).find((item) => item.slug === slug);
  if (!product) return notFoundMetadata;
  const title = `${plain(t(product.title, locale))} — ${t(product.tagline, locale)}`;
  const description = t(product.description ?? product.tagline, locale);
  const path = kindHref(kind, locale, slug);
  return {
    ...pageMetadata(locale, path, title, description),
    alternates: languageAlternates((language) => kindHref(kind, language, slug), locale),
    openGraph: localizedOpenGraph(locale, `${title} | Peera Lab`, description, path),
  };
}

export function productJsonLd(product: Product, locale: Locale) {
  const site = getSite();
  const title = t(product.title, locale);
  const status = t(STATUS[product.status], locale);
  const description = `${t(product.description ?? product.tagline, locale)} ${locale === 'th' ? `สถานะ: ${status}` : `Status: ${status}.`}`;
  const url = absoluteUrl(`/${locale}/products/${product.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: plain(title),
    description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url,
    creator: {
      '@type': 'Person',
      name: t(site.contact.person.name, locale),
      url: absoluteUrl(`/${locale}`),
    },
  };
}

export function personJsonLd(locale: Locale) {
  const site = getSite();
  const url = absoluteUrl(`/${locale}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${absoluteUrl('/')}#person`,
    name: t(site.contact.person.name, locale),
    jobTitle: t(site.contact.person.role, locale),
    url,
    email: site.contact.email,
    // International format (+66 …), as the page's tel: link uses.
    telephone: formatPhone(site.contact.phone, 'en'),
  };
}

/** Avoid terminating an inline JSON-LD script if content contains HTML-like text. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
