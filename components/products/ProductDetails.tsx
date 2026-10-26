import type { CSSProperties } from 'react';
import { STATUS, UI, cx, tx } from '@/lib/design';
import { t, ts, type Locale, type Localized } from '@/lib/i18n';
import type { Product } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { BrowserFrame } from './BrowserFrame';

export interface ProductDetailsProps {
  products: Product[];
  locale: Locale;
  title: Localized;
  lead: Localized;
}

/**
 * Homepage: each product that has a features section, in detail. The screenshot sits beside the copy and the
 * features stack below it. Each feature fades up in turn (`--pl-delay`), and stops under reduced motion (CSS).
 */
export function ProductDetails({ products, locale, title, lead }: ProductDetailsProps) {
  const detailed = products.filter((product) => product.sections?.some((section) => section.type === 'features'));
  if (detailed.length === 0) return null;

  return (
    <div className="pl-pdetails">
      <SectionHeader locale={locale} title={title} lead={lead} />
      {detailed.map((product) => {
        const features = product.sections?.find((section) => section.type === 'features');
        const items = features && features.type === 'features' ? features.items : [];
        const headingId = `pl-pdetail-${product.slug}`;
        return (
          <article key={product.slug} className="pl-pdetail pl-reveal" aria-labelledby={headingId} lang={locale}>
            <div className="pl-pdetail-info">
              <div className="pl-pdetail-head">
                <Eyebrow text={product.category} locale={locale} />
                <StatusBadge status={product.status} locale={locale} />
              </div>
              <h3 className={cx('pl-pdetail-title', ts('headline-md', locale))} id={headingId}>
                {tx(product.title, locale)}
              </h3>
              <p className={cx('pl-pdetail-tagline', ts('body-lg', locale), 'pl-pretty')}>{t(product.tagline, locale)}</p>
              <div className="pl-pdetail-actions">
                <Button href={`/${locale}/products/${product.slug}`} variant="secondary" arrow size="lg">
                  {t(UI.explore, locale)}
                </Button>
              </div>
            </div>
            <div className="pl-pdetail-visual">
              <BrowserFrame
                url={product.url ?? `${product.slug}.peera.dev`}
                tag={t(STATUS[product.status], 'en')}
                src={product.thumbnail}
                alt={product.thumbnailAlt ? t(product.thumbnailAlt, locale) : undefined}
                sizes="(min-width: 1024px) 50vw, 100vw"
                aspect="16 / 10"
              >
                {product.thumbnail ? null : <div className="pl-pdetail-empty" />}
              </BrowserFrame>
            </div>
            <ul className="pl-pdetail-features">
              {items.map((item, i) => (
                <li
                  key={i}
                  className="pl-pdetail-item pl-reveal"
                  style={{ '--pl-delay': `${i * 90}ms` } as CSSProperties}
                >
                  <span className={cx('pl-index', 'label')}>{`0${i + 1}`}</span>
                  <h4 className={cx('pl-pdetail-item-title', ts('ui', locale))}>{t(item.title, locale)}</h4>
                  <p className={cx('pl-pdetail-item-body', ts('body', locale))}>{t(item.body, locale)}</p>
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}
