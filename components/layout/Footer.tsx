import { UI, cx } from '@/lib/design';
import { t, ts, type Locale, type Localized } from '@/lib/i18n';

export interface FooterLink {
  label: Localized;
  href: string;
}

export interface FooterProps {
  locale: Locale;
  /** Wordmark name before "/ Lab". */
  name?: string;
  /** Wordmark link target. */
  homeHref?: string;
  /** Repeats the site's main links. */
  links?: FooterLink[];
  /** Copyright holder, shown after the year. */
  owner?: string;
  /** Current year, passed in so the render is deterministic. */
  year: number;
}

/**
 * Site footer on `inverse-surface`, the second inverted band after ContactBlock. Not in the
 * bundle; built from DESIGN.md's tokens and the SiteNav wordmark. Carries no `h1` and no heading.
 */
export function Footer({ locale, name = 'Peera', homeHref = '#', links = [], owner = 'Peera', year }: FooterProps) {
  return (
    <footer className={cx('pl-root', 'pl-footer', 'pl-inverse')} lang={locale}>
      <div className="pl-footer-inner">
        <a className="pl-footer-wordmark" href={homeHref} aria-label={`${name} Lab — home`}>
          <span>{name}</span>
          <span className="pl-footer-slash" aria-hidden="true">
            /
          </span>
          <span className="pl-footer-lab">Lab</span>
        </a>
        {links.length ? (
          <nav className="pl-footer-links" aria-label={t(UI.mainNav, locale)}>
            {links.map((l) => (
              <a key={l.href} className="pl-footer-link" href={l.href}>
                {t(l.label, locale)}
              </a>
            ))}
          </nav>
        ) : null}
        <p className={cx('pl-footer-copy', ts('label', locale))}>{`© ${year} ${owner}`}</p>
      </div>
    </footer>
  );
}
