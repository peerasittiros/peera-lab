import { UI, cx, tx } from '@/lib/design';
import { t, ts, type Locale, type Localized } from '@/lib/i18n';
import type { Product } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { productShots } from './ProductStory';
import { DeviceStack, phoneShot } from './DeviceStack';

export interface ProductDetailsProps {
  products: Product[];
  locale: Locale;
  title: Localized;
  lead: Localized;
  /** Left out, usually the featured product, which ProductStory already tells in steps. */
  exclude?: string;
}

const screensLabel: Localized = { en: 'Screens', th: 'หน้าจอ' };

/**
 * Homepage feature bento: each product with a features section (except `exclude`). The screenshot tile spans 2 × 2
 * and the features fill the rest, 4 → 2 → 1 columns; rows alternate sides. On phones the screenshots scroll
 * sideways with scroll-snap. The tiles enter one `--stagger` apart (`.pl-stagger`).
 */
export function ProductDetails({ products, locale, title, lead, exclude }: ProductDetailsProps) {
  const detailed = products.filter(
    (product) => product.slug !== exclude && product.sections?.some((section) => section.type === 'features'),
  );
  if (detailed.length === 0) return null;

  return (
    <div className="pl-bentos">
      <SectionHeader locale={locale} title={title} lead={lead} />
      {detailed.map((product) => {
        const features = product.sections?.find((section) => section.type === 'features');
        const items = features && features.type === 'features' ? features.items : [];
        const shots = productShots(product);
        const name = t(product.title, locale);
        const headingId = `pl-bento-${product.slug}`;
        return (
          <article key={product.slug} className="pl-root pl-bento pl-reveal" aria-labelledby={headingId} lang={locale}>
            <div className="pl-bento-head">
              <div className="pl-bento-head-text">
                <div className="pl-bento-meta">
                  <Eyebrow text={product.category} locale={locale} />
                  <StatusBadge status={product.status} locale={locale} />
                </div>
                <h3 className={cx('pl-bento-title', ts('headline-md', locale))} id={headingId}>
                  {tx(product.title, locale)}
                </h3>
                <p className={cx('pl-bento-tagline', ts('body-lg', locale), 'pl-pretty')}>{t(product.tagline, locale)}</p>
              </div>
              <Button href={`/${locale}/products/${product.slug}`} variant="secondary" arrow size="lg">
                {t(UI.explore, locale)}
              </Button>
            </div>
            <div className="pl-bento-grid pl-stagger">
              {shots.length ? (
                <div
                  className="pl-bento-shots"
                  role="region"
                  aria-label={`${name} — ${t(screensLabel, locale)}`}
                  tabIndex={0}
                >
                  {shots.map((shot, i) => (
                    <div key={shot.src} className="pl-bento-shot">
                      {/* The first shot pairs with the phone, so each product shows it works on both. */}
                      <DeviceStack
                        locale={locale}
                        desktop={shot}
                        phone={i === 0 ? phoneShot(product) : undefined}
                        sizes="(min-width: 1024px) 50vw, 90vw"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
              {items.map((item, i) => (
                <div key={i} className="pl-bento-tile">
                  <span className={cx('pl-bento-tile-index', 'label')}>{`0${i + 1}`}</span>
                  <h4 className={cx('pl-bento-tile-title', ts('ui', locale))}>{t(item.title, locale)}</h4>
                  <p className={cx('pl-bento-tile-body', ts('body', locale), 'pl-pretty')}>{t(item.body, locale)}</p>
                </div>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
