import { STATUS } from '@/lib/design';
import { getItems, type Kind } from '@/lib/collections';
import { getSite } from '@/lib/content';
import { isLocale, t } from '@/lib/i18n';
import { ogSize } from '@/lib/og';
import { ogImage } from './OgImage';

export const size = ogSize;
export const contentType = 'image/png';

/** OG image for a product or project page: name, tagline, category, and a frame with its URL and status. */
export async function productOpenGraphImage({ params, kind }: { params: Promise<{ locale: string; slug: string }>; kind: Kind }) {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? raw : 'th';
  const item = getItems(kind).find((entry) => entry.slug === slug);
  const site = getSite();
  if (!item) {
    return ogImage({ locale, title: t(site.hero.title, locale), lead: t(site.hero.lead, locale), label: '' });
  }
  return ogImage({
    locale,
    title: t(item.title, locale),
    lead: t(item.tagline, locale),
    label: t(item.category, locale),
    // Same as the page's BrowserFrame: product URL and the English status word.
    frame: { url: item.url ? new URL(item.url).host : `${item.slug}.peera.dev`, tag: t(STATUS[item.status], 'en').toUpperCase() },
  });
}
