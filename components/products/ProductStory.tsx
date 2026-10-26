import Image from 'next/image';
import { STATUS, UI, cx, tx } from '@/lib/design';
import { t, ts, type Locale } from '@/lib/i18n';
import type { Product } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BrowserFrame } from './BrowserFrame';
import { StoryScroller } from './StoryScroller';

export interface ProductStoryProps {
  product: Product;
  locale: Locale;
}

/** The product's desktop (16:10) screenshots, or its thumbnail when it has none. Phone shots go to DeviceStack. */
export function productShots(product: Product) {
  const desktop = product.screenshots?.filter((shot) => shot.device !== 'phone') ?? [];
  if (desktop.length) return desktop;
  return product.thumbnail ? [{ src: product.thumbnail, alt: product.thumbnailAlt ?? product.title }] : [];
}

/**
 * Homepage: the featured product told in steps (its features section). ≥1024 one sticky frame changes screenshot as
 * each step passes the middle of the viewport; below 1024 each step carries its own frame (DESIGN.md › Product
 * visuals). Falls back to FeaturedProduct-like content when the product has no features.
 */
export function ProductStory({ product, locale }: ProductStoryProps) {
  const headingId = `pl-story-${product.slug}`;
  const features = product.sections?.find((section) => section.type === 'features');
  const items = features && features.type === 'features' ? features.items : [];
  const shots = productShots(product);
  const url = product.url ?? `${product.slug}.peera.dev`;
  const tag = t(STATUS[product.status], 'en');
  const shotOf = (i: number) => (shots.length ? i % shots.length : -1);

  return (
    <section className="pl-root pl-story pl-reveal" lang={locale} aria-labelledby={headingId}>
      <div className="pl-story-head">
        <div className="pl-story-head-main">
          <div className="pl-story-meta">
            <Eyebrow text={UI.featured} locale={locale} />
            <StatusBadge status={product.status} locale={locale} />
          </div>
          <h2 className={cx('pl-story-title', ts('display-lg', locale), 'pl-balance')} id={headingId}>
            {tx(product.title, locale)}
          </h2>
        </div>
        <div className="pl-story-head-side">
          <p className={cx('pl-story-tagline', ts('body-lg', locale), 'pl-pretty')}>{t(product.tagline, locale)}</p>
          <div className="pl-story-actions">
            <Button href={`/${locale}/products/${product.slug}`} variant="primary" arrow size="lg">
              {t(UI.explore, locale)}
            </Button>
            {product.demoUrl ? (
              <Button href={`/${locale}/products/${product.slug}/demo`} variant="secondary" arrow size="lg">
                {t(UI.demo, locale)}
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {items.length ? (
        <StoryScroller className="pl-story-body">
          {shots.length ? (
            <div className="pl-story-visual">
              <BrowserFrame size="lg" url={url} tag={tag}>
                {shots.map((shot, i) => (
                  <div key={shot.src} className={cx('pl-story-shot', i === 0 && 'is-current')} data-shot={i}>
                    <Image src={shot.src} alt={t(shot.alt, locale)} fill sizes="(min-width: 1024px) 55vw, 0px" />
                  </div>
                ))}
              </BrowserFrame>
            </div>
          ) : null}
          <ol className="pl-story-steps">
            {items.map((item, i) => {
              const shot = shotOf(i);
              return (
                <li key={i} className={cx('pl-story-step', i === 0 && 'is-current')} data-shot={shot}>
                  {shot >= 0 ? (
                    <div className="pl-story-step-shot">
                      <BrowserFrame
                        url={url}
                        tag={tag}
                        src={shots[shot].src}
                        alt={t(shots[shot].alt, locale)}
                        sizes="(min-width: 1024px) 0px, 100vw"
                      />
                    </div>
                  ) : null}
                  <span className={cx('pl-story-step-index', 'label')}>{`0${i + 1}`}</span>
                  <h3 className={cx('pl-story-step-title', ts('headline-sm', locale))}>{t(item.title, locale)}</h3>
                  <p className={cx('pl-story-step-body', ts('body-lg', locale), 'pl-pretty')}>{t(item.body, locale)}</p>
                </li>
              );
            })}
          </ol>
        </StoryScroller>
      ) : null}
    </section>
  );
}
