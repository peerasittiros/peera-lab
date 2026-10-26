import { cx, pad } from '@/lib/design';
import { t, ts, type Locale } from '@/lib/i18n';
import type { Product } from '@/lib/content';
import { Arrow } from '@/components/ui/Arrow';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TagList } from '@/components/ui/TechTag';
import { AppSkeleton } from './AppSkeleton';
import { BrowserFrame } from './BrowserFrame';

export interface ProductCardProps {
  product: Product;
  locale: Locale;
  /** Shown as P-02 style index. */
  index?: number;
  /** Letter before the index. Defaults to P (products). */
  indexPrefix?: string;
  /** Route to the product page. Defaults to `/{locale}/products/{slug}`. */
  href?: string;
  /** Heading level of the name. 3 under a section h2 (default); 2 when the grid sits right under the page h1. */
  level?: 2 | 3;
}

/**
 * A product in the Lab: index, category, status, visual, name, tagline, and up to three tags.
 * The whole card is one link. Hover or focus lifts the frame and turns the arrow accent.
 */
export function ProductCard({ product, locale, index, indexPrefix = 'P', href, level = 3 }: ProductCardProps) {
  const Heading = level === 2 ? 'h2' : 'h3';
  const idx = index != null ? `${indexPrefix}-${pad(index)}` : undefined;
  const target = href ?? `/${locale}/products/${product.slug}`;
  const title = t(product.title, locale);
  const url = product.url ?? (product.slug ? `${product.slug}.peera.dev` : undefined);
  const hasThumb = Boolean(product.thumbnail);

  return (
    <article className={cx('pl-root', 'pl-card')} lang={locale}>
      <a className="pl-card-link" href={target}>
        <div className="pl-card-meta">
          <Eyebrow index={idx} text={product.category} locale={locale} />
          <StatusBadge status={product.status} locale={locale} />
        </div>
        <BrowserFrame
          url={url}
          src={product.thumbnail}
          alt={product.thumbnailAlt ? t(product.thumbnailAlt, locale) : undefined}
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          aspect="16 / 10"
          transitionName={product.slug ? `pl-frame-${product.slug}` : undefined}
        >
          {hasThumb ? null : (
            <AppSkeleton
              kind={product.preview}
              label={`${title} — ${locale === 'th' ? 'ภาพตัวอย่างหน้าจอ' : 'interface preview'}`}
            />
          )}
        </BrowserFrame>
        <div className="pl-card-body">
          <Heading className={cx('pl-card-title', ts('headline-sm', locale))}>
            <span>{title}</span>
            <Arrow />
          </Heading>
          <p className={cx('pl-card-tagline', ts('body-sm', locale), 'pl-pretty')}>{t(product.tagline, locale)}</p>
          <TagList items={product.technologies} max={3} />
        </div>
      </a>
    </article>
  );
}
