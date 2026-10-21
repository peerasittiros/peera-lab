import type { ReactNode } from 'react';
import { cx } from '@/lib/design';
import { t, ts, type Locale, type Localized } from '@/lib/i18n';

export interface SpecRow {
  label: Localized;
  /** Plain text value. Ignored when `node` is given. */
  value?: Localized;
  /** Rich value, such as a TagList. */
  node?: ReactNode;
}

export interface SpecListProps {
  rows: SpecRow[];
  locale: Locale;
}

/** Key–value metadata rows (problem, value, stack, status, started) with hairline separators. */
export function SpecList({ rows, locale }: SpecListProps) {
  return (
    <dl className={cx('pl-root', 'pl-spec')} lang={locale}>
      {rows.map((r, i) => (
        <div key={i} className="pl-spec-row">
          <dt className={ts('label', locale)}>{t(r.label, locale)}</dt>
          <dd className={ts('body-sm', locale)}>{r.node ?? (r.value ? t(r.value, locale) : null)}</dd>
        </div>
      ))}
    </dl>
  );
}
