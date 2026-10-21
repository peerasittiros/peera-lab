'use client';

import { useState } from 'react';
import { STATUS, cx, type ProductStatus } from '@/lib/design';
import { t, ts, type Locale, type Localized } from '@/lib/i18n';
import type { Product } from '@/lib/content';
import { ProductCard } from './ProductCard';

const strings = {
  filter: { en: 'Filter by status', th: 'กรองตามสถานะ' },
  all: { en: 'All', th: 'ทั้งหมด' },
} satisfies Record<string, Localized>;

function shownText(count: number, total: number, locale: Locale): string {
  return locale === 'th' ? `แสดง ${count} จาก ${total} รายการ` : `Showing ${count} of ${total}`;
}

export interface ProductLabProps {
  /** Already sorted. Every product is numbered by its place in this list, so P-0n stays stable while filtering. */
  products: Product[];
  locale: Locale;
  /** List route, such as `/th/products`; each card links to `{base}/{slug}`. */
  base: string;
  /** Letter for the P-0n index. Without it, cards are not numbered (projects). */
  indexPrefix?: string;
  /** Shown when there are no items. */
  empty: Localized;
}

/**
 * The Products page Lab: status filter chips above the grid. Chips are offered only for statuses
 * that have products, so a filter never comes up empty. Without JavaScript every product shows.
 */
export function ProductLab({ products, locale, base, indexPrefix, empty }: ProductLabProps) {
  const [status, setStatus] = useState<ProductStatus | null>(null);

  const order = Object.keys(STATUS) as ProductStatus[];
  const counts = new Map<ProductStatus, number>();
  for (const product of products) counts.set(product.status, (counts.get(product.status) ?? 0) + 1);
  const statuses = order.filter((s) => counts.has(s));

  const numbered = products.map((product, i) => ({ product, index: i + 1 }));
  const shown = status ? numbered.filter(({ product }) => product.status === status) : numbered;

  const chip = (value: ProductStatus | null, label: Localized, count: number) => {
    const pressed = status === value;
    return (
      <li key={value ?? 'all'}>
        <button
          type="button"
          className={cx('pl-chip', ts('label', locale), pressed && 'is-current')}
          aria-pressed={pressed}
          onClick={() => setStatus(value)}
        >
          {t(label, locale)}
          <span className="pl-chip-count">{count}</span>
        </button>
      </li>
    );
  };

  return (
    <div className="pl-root pl-lab" lang={locale}>
      {statuses.length > 1 ? (
        <div role="group" aria-label={t(strings.filter, locale)}>
          <ul className="pl-chips">
            {chip(null, strings.all, products.length)}
            {statuses.map((s) => chip(s, STATUS[s], counts.get(s) ?? 0))}
          </ul>
        </div>
      ) : null}
      {products.length === 0 ? <p className={cx(ts('body-lg', locale), 'pl-lab-empty')}>{t(empty, locale)}</p> : null}
      <p className="pl-sr-only" aria-live="polite">
        {shownText(shown.length, products.length, locale)}
      </p>
      <div className="pl-grid">
        {shown.map(({ product, index }) => (
          <ProductCard
            key={product.slug}
            product={product}
            locale={locale}
            href={`${base}/${product.slug}`}
            index={indexPrefix ? index : undefined}
            indexPrefix={indexPrefix}
            level={2}
          />
        ))}
      </div>
    </div>
  );
}
