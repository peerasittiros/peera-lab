import { STATUS, cx, type ProductStatus } from '@/lib/design';
import { t, type Locale, type Localized } from '@/lib/i18n';

export interface StatusBadgeProps {
  status: ProductStatus;
  locale: Locale;
  /** Overrides the built-in label. */
  label?: Localized;
  className?: string;
}

/**
 * One honest word for where a product stands. Each status differs by word and dot shape,
 * not only by color. Live dots pulse, which stops under prefers-reduced-motion.
 */
export function StatusBadge({ status, locale, label, className }: StatusBadgeProps) {
  // Unknown statuses fall back to concept, as in the bundle.
  const s: ProductStatus = status in STATUS ? status : 'concept';
  return (
    <span className={cx('pl-status', `pl-status-${s}`, className)} lang={locale}>
      <span className="pl-status-dot" aria-hidden="true" />
      {t(label ?? STATUS[s], locale)}
    </span>
  );
}
