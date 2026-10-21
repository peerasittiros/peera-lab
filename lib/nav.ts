// Nav and footer links. Every nav key has its own route; on the home page, Products and Contact scroll to their section.
import type { Site } from '@/lib/content';
import type { Locale, Localized } from '@/lib/i18n';
import type { NavItem } from '@/components/navigation/SiteNav';

/** Keys that have their own route. */
const routed = new Set(['products', 'projects', 'contact']);
/** Keys that are also a section of the home page; on the home page they scroll there instead. */
const homeSections = new Set(['products', 'contact']);

export function navHref(key: string, locale: Locale, onHome = false): string {
  if (onHome && homeSections.has(key)) return `#${key}`;
  return routed.has(key) ? `/${locale}/${key}` : `/${locale}#${key}`;
}

export function navItems(site: Site, locale: Locale, onHome = false): NavItem[] {
  return site.nav.map((item) => ({
    key: item.key,
    en: item.label.en,
    th: item.label.th,
    href: navHref(item.key, locale, onHome),
  }));
}

export function footerLinks(site: Site, locale: Locale, onHome = false): { label: Localized; href: string }[] {
  return site.nav.map((item) => ({ label: item.label, href: navHref(item.key, locale, onHome) }));
}
