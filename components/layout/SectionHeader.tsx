import { cx, tx } from '@/lib/design';
import { t, ts, type Locale, type Localized } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';

export interface SectionHeaderProps {
  locale: Locale;
  /** Index such as "02", shown in the eyebrow. */
  index?: string;
  eyebrow?: Localized;
  /** Thai titles may contain `|` phrase markers. */
  title: Localized;
  lead?: Localized;
  /** "View all" style ghost link, at the end of the header. */
  action?: { label: Localized; href: string };
  /** Heading level. The page owns the single h1; sections use h2 by default. */
  as?: 'h1' | 'h2' | 'h3';
  /** `md` (headline-md) is for sections inside a product page. */
  size?: 'lg' | 'md';
  id?: string;
}

/** Section title block: eyebrow, headline, optional lead, and an optional ghost action. */
export function SectionHeader({ locale, index, eyebrow, title, lead, action, as = 'h2', size = 'lg', id }: SectionHeaderProps) {
  const Tag = as;
  return (
    <div className={cx('pl-root', 'pl-section-head')} lang={locale}>
      <div className="pl-section-head-text">
        <Eyebrow index={index} text={eyebrow} locale={locale} />
        <Tag className={cx(ts(`headline-${size}`, locale), 'pl-balance')} id={id}>
          {tx(title, locale)}
        </Tag>
        {lead ? <p className={cx(ts('body', locale), 'pl-section-head-lead', 'pl-pretty')}>{t(lead, locale)}</p> : null}
      </div>
      {action ? (
        <Button variant="ghost" href={action.href} arrow>
          {t(action.label, locale)}
        </Button>
      ) : null}
    </div>
  );
}
