import { getSite } from '@/lib/content';
import { isLocale, t } from '@/lib/i18n';
import { ogSize } from '@/lib/og';
import { ogImage } from '@/components/seo/OgImage';

export const alt = 'Peera Lab';
export const size = ogSize;
export const contentType = 'image/png';

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : 'th';
  const site = getSite();
  return ogImage({
    locale,
    title: t(site.hero.title, locale),
    lead: t(site.hero.lead, locale),
    label: t(site.collections.products.title, locale),
  });
}
