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
  /** "Now building" list, so products are visible in the first viewport. */
  building?: {
    label: Localized;
    items: { name: Localized; status: ProductStatus; href?: string }[];
  };
}

/**
 * Identity block: who Peera is, what he builds, and a direct path to the products.
 * h1 of the home page. No portrait, skills cloud or years counter (Hero README).
 */
export function Hero({ locale, index, eyebrow, title, lead, actions, building }: HeroProps) {
  return (
    <section className={cx('pl-root', 'pl-hero')} lang={locale}>
      {index != null || eyebrow ? (
        <div className="pl-hero-meta">
          <Eyebrow index={index} text={eyebrow} locale={locale} />
        </div>
      ) : null}
      <h1 className={cx(ts('display-xl', locale), 'pl-hero-title', 'pl-balance')}>{tx(title, locale)}</h1>
      {lead ? <p className={cx(ts('body-lg', locale), 'pl-hero-lead', 'pl-pretty')}>{t(lead, locale)}</p> : null}
      {actions ? (
        <div className="pl-hero-actions">
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
      {building ? (
        <div className="pl-hero-building">
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
    </section>
  );
}
