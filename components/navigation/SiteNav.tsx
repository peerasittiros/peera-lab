'use client';

import { useState } from 'react';
import { UI, cx } from '@/lib/design';
import { t, type Locale } from '@/lib/i18n';
import { LangSwitch } from './LangSwitch';

export interface NavItem {
  key: string;
  en: string;
  th: string;
  href: string;
}

/** Default navigation: anchors on the one-page home. Pages with real routes pass `items`. */
export const defaultNavItems: NavItem[] = [
  { key: 'products', en: 'Products', th: 'ผลิตภัณฑ์', href: '#products' },
  { key: 'projects', en: 'Projects', th: 'โปรเจกต์', href: '/projects' },
  { key: 'contact', en: 'Contact', th: 'ติดต่อ', href: '#contact' },
];

export interface SiteNavProps {
  locale: Locale;
  /** `key` of the current item; it gets `aria-current="page"`. */
  active?: string;
  items?: NavItem[];
  /** Wordmark link target. */
  homeHref?: string;
  /** Wordmark name before "/ Lab". */
  name?: string;
  /** Route for each locale. The LangSwitch uses links when given, otherwise calls onLocaleChange. */
  localeHrefs?: { en: string; th: string };
  onLocaleChange?: (locale: Locale) => void;
  /** Starts with the mobile menu open. Mainly for previews and tests. */
  defaultOpen?: boolean;
}

/**
 * Site header: wordmark, nav links, language switch. Under 768px the links move into a
 * toggle menu. The header has no h1; each page provides its own.
 */
export function SiteNav({
  locale,
  active,
  items = defaultNavItems,
  homeHref = '#',
  name = 'Peera',
  localeHrefs,
  onLocaleChange,
  defaultOpen = false,
}: SiteNavProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <header className={cx('pl-root', 'pl-nav', open && 'is-open')} lang={locale}>
      <div className="pl-nav-inner">
        <a className="pl-wordmark" href={homeHref} aria-label="Peera Lab — home">
          <span>{name}</span>
          <span className="pl-wordmark-slash" aria-hidden="true">
            /
          </span>
          <span className="pl-wordmark-lab">Lab</span>
        </a>
        <nav className="pl-nav-links" aria-label={t(UI.mainNav, locale)} id="pl-nav-links">
          {items.map((item) => {
            const current = item.key === active;
            return (
              <a
                key={item.key}
                href={item.href}
                className={cx('pl-nav-link', current && 'is-active')}
                aria-current={current ? 'page' : undefined}
              >
                {t(item, locale)}
              </a>
            );
          })}
        </nav>
        <div className="pl-nav-end">
          <LangSwitch locale={locale} hrefs={localeHrefs} onChange={onLocaleChange} />
          <button
            type="button"
            className="pl-nav-toggle"
            aria-expanded={open}
            aria-controls="pl-nav-links"
            aria-label={t(open ? UI.menuClose : UI.menuOpen, locale)}
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
