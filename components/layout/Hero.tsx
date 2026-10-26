import type { CSSProperties, ReactNode } from 'react';
import { pad, cx, tx, type ProductStatus } from '@/lib/design';
import { t, ts, type Locale, type Localized } from '@/lib/i18n';
import { Button, type ButtonProps } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { StatusBadge } from '@/components/ui/StatusBadge';

export interface HeroProps {
  locale: Locale;
  /** Index shown before the eyebrow, such as "00". */
  index?: string;
  /** Name — role, city. */
  eyebrow?: Localized;
  /** Thai titles may contain `|` phrase markers. */
  title: Localized;
  lead?: Localized;
  /** The first action is primary by default; the rest are secondary. */
  actions?: { label: Localized; href: string; variant?: ButtonProps['variant'] }[];
  /** Product visual on the right ≥1024 and below the message on smaller screens (the home uses DeviceStack). */
  visual?: ReactNode;
  /** "Now building" list, so products are visible in the first viewport. */
  building?: {
    label: Localized;
    items: { name: Localized; status: ProductStatus; href?: string }[];
  };
}

/** `--i` orders the load entrance (`.pl-enter`, one `--stagger` apart). */
const step = (i: number) => ({ '--i': i }) as CSSProperties;

/**
 * Identity block: what the lab makes, and a direct path to the products. h1 of the home page.
 * Split ≥1024: the message on the left; the product visual (desktop and phone) and "Now building" on the right.
 * The h1 never animates (it is the LCP); the lead, actions and frames enter once on load (DESIGN.md › Motion).
 */
export function Hero({ locale, index, eyebrow, title, lead, actions, visual, building }: HeroProps) {
  return (
    <section className={cx('pl-root', 'pl-hero')} lang={locale}>
      <div className="pl-hero-copy">
        {index != null || eyebrow ? (
          <div className="pl-hero-meta">
            <Eyebrow index={index} text={eyebrow} locale={locale} />
          </div>
        ) : null}
        <h1 className={cx(ts('display-xl', locale), 'pl-hero-title', 'pl-balance')}>{tx(title, locale)}</h1>
        {lead ? (
          <p className={cx(ts('body-lg', locale), 'pl-hero-lead', 'pl-pretty', 'pl-enter')} style={step(0)}>
            {t(lead, locale)}
          </p>
        ) : null}
        {actions ? (
          <div className="pl-hero-actions pl-enter" style={step(1)}>
            {actions.map((a, i) => (
              <Button
                key={i}
                variant={a.variant ?? (i ? 'secondary' : 'primary')}
                href={a.href}
                arrow={i === 0}
                size="lg"
              >
                {t(a.label, locale)}
              </Button>
            ))}
          </div>
        ) : null}
      </div>
      {visual || building ? (
        <div className="pl-hero-side">
          {visual ? (
            <div className="pl-hero-stack pl-enter" style={step(2)}>
              {visual}
            </div>
          ) : null}
          {building ? (
            <div className="pl-hero-building pl-enter" style={step(3)}>
              <p className={cx(ts('label', locale), 'text-ink-muted mb-1')}>{t(building.label, locale)}</p>
              <ul>
                {building.items.map((item, i) => (
                  <li key={i}>
                    <a className="pl-hero-building-row" href={item.href ?? '#'}>
                      <span className={cx('pl-index', 'label')}>{`P-${pad(i + 1)}`}</span>
                      <span className={cx('pl-hero-building-name', ts('ui', locale))}>{t(item.name, locale)}</span>
                      <StatusBadge status={item.status} locale={locale} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
