'use client';

import { useParams } from 'next/navigation';
import { cx } from '@/lib/design';
import type { Site } from '@/lib/content';
import { isLocale, t, ts, type Locale } from '@/lib/i18n';
import { footerLinks, navItems } from '@/lib/nav';
import { SiteNav } from '@/components/navigation/SiteNav';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';

/**
 * not-found.tsx gets no params, so this client view takes the locale from the URL.
 * The language switch goes to each locale's home page, since the missing path has no twin.
 */
export function NotFoundView({ site }: { site: Site }) {
  const params = useParams<{ locale?: string }>();
  const locale: Locale = params.locale && isLocale(params.locale) ? params.locale : 'th';
  const brand = site.name.split(' ')[0];
  const copy = site.notFound;
  return (
    <>
      <SiteNav
        locale={locale}
        items={navItems(site, locale)}
        homeHref={`/${locale}`}
        name={brand}
        localeHrefs={{ en: '/en', th: '/th' }}
      />
      <main>
        <section className="pl-root pl-home-section pl-notfound" lang={locale}>
          <p className={cx('pl-notfound-code', 'label')}>404</p>
          <h1 className={cx(ts('headline-lg', locale), 'pl-balance')}>{t(copy.title, locale)}</h1>
          <p className={cx(ts('body-lg', locale), 'pl-notfound-body', 'pl-pretty')}>{t(copy.body, locale)}</p>
          <div>
            <Button variant="secondary" href={`/${locale}`} arrow>
              {t(copy.home, locale)}
            </Button>
          </div>
        </section>
      </main>
      <Footer
        locale={locale}
        name={brand}
        homeHref={`/${locale}`}
        links={footerLinks(site, locale)}
        owner={site.name}
        year={new Date().getFullYear()}
      />
    </>
  );
}
