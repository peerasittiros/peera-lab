import { cx } from '@/lib/design';
import { t, ts, type Locale, type Localized } from '@/lib/i18n';

export interface EyebrowProps {
  /** Index such as "01" or "P-01", shown in accent mono. */
  index?: string;
  text?: Localized;
  locale: Locale;
}

/** Mono label line above a heading: index, a dash, then the text. */
export function Eyebrow({ index, text, locale }: EyebrowProps) {
  if (index == null && !text) return null;
  return (
    <span className={cx('pl-eyebrow', ts('label', locale))}>
      {index != null ? <span className="pl-index label">{index}</span> : null}
      {index != null && text ? <span aria-hidden="true">—</span> : null}
      {text ? <span>{t(text, locale)}</span> : null}
    </span>
  );
}
