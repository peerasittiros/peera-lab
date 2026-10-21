import { cx } from '@/lib/design';
import type { Locale } from '@/lib/i18n';
import type { Product } from '@/lib/content';
import { ProductCard } from './ProductCard';

export interface ProductGridProps {
  /** Already sorted and filtered by the page. */
  products: Product[];
  locale: Locale;
  /** Index of the first card, so P-0n numbering continues after the featured product. */
  startIndex?: number;
}

/**
 * The Product Lab grid: 3 / 2 / 1 columns at ≥1280 / ≥768 / below (CSS in `.pl-grid`).
 * Works for 1 or 40 items. Status filter chips sit above it on the Products page.
 */
export function ProductGrid({ products, locale, startIndex = 1 }: ProductGridProps) {
  return (
    <div className={cx('pl-root', 'pl-grid')}>
      {products.map((product, i) => (
        <ProductCard key={product.slug} product={product} locale={locale} index={startIndex + i} />
      ))}
    </div>
  );
}
