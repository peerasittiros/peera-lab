import type { ReactNode } from 'react';
import { getSite } from '@/lib/content';
import type { Locale } from '@/lib/i18n';
import { footerLinks, navItems } from '@/lib/nav';
import { SiteNav } from '@/components/navigation/SiteNav';
import { Footer } from '@/components/layout/Footer';

/**
 * Nav, main and footer for every page except home (which scrolls to its own sections).
 * `path` is the route after the locale, so the language switch stays on this page.
 */
export function Shell({
  active,
  locale,
  path,
  children,
}: {
  active?: string;
  locale: Locale;
  path: string;
  children: ReactNode;
}) {
  const site = getSite();
  const brand = site.name.split(' ')[0];
  return (
    <>
      <SiteNav
        locale={locale}
        active={active}
        items={navItems(site, locale)}
        homeHref={`/${locale}`}
        name={brand}
        localeHrefs={{ en: `/en${path}`, th: `/th${path}` }}
      />
      <main>{children}</main>
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
