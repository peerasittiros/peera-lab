import { STATUS, UI, cx, tx } from '@/lib/design';
import { t, ts, type Locale, type Localized } from '@/lib/i18n';
import type { Product } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TagList } from '@/components/ui/TechTag';
import { AppSkeleton } from './AppSkeleton';
import { BrowserFrame } from './BrowserFrame';
import { SpecList, type SpecRow } from './SpecList';

export interface FeaturedProductProps {
  product: Product;
  locale: Locale;
  /** Overrides the default actions (Explore product, plus Open live demo to the demo route when demoUrl is set). */
  actions?: { label: Localized; href: string; variant?: 'primary' | 'secondary' | 'ghost'; external?: boolean }[];
  /** Product pages use h1; the homepage uses h2. */
  as?: 'h1' | 'h2';
  /** Item pages (`as="h1"`) show `P-0n — category` (projects: just the category) instead of "Featured product". */
  index?: string;
  /** Overrides the default spec rows (problem, value, stack). */
  rows?: SpecRow[];
}

/** Problem, value and stack rows, each only when the product has it. */
export function productSpecRows(product: Product): SpecRow[] {
  const rows: SpecRow[] = [];
  if (product.problem) rows.push({ label: UI.problem, value: product.problem });
  if (product.value) rows.push({ label: UI.value, value: product.value });
  if (product.technologies.length) rows.push({ label: UI.stack, node: <TagList items={product.technologies} /> });
  return rows;
}

/**
 * The homepage's one big product: a mini landing page, not a card.
 * Info beside a large frame on desktop; the visual comes first below 1024px (CSS in `.pl-featured`).
 */
export function FeaturedProduct({ product, locale, actions, as: Heading = 'h2', index, rows: rowsProp }: FeaturedProductProps) {
  const headingId = `pl-feat-${product.slug}`;
  const title = t(product.title, locale);

  const rows = rowsProp ?? productSpecRows(product);

  const defaultActions: NonNullable<FeaturedProductProps['actions']> = [
    { label: UI.explore, href: `/${locale}/products/${product.slug}`, variant: 'primary' },
    ...(product.demoUrl
      ? [{ label: UI.demo, href: `/${locale}/products/${product.slug}/demo`, variant: 'secondary' as const }]
      : []),
  ];
  const resolved = actions ?? defaultActions;

  return (
    <section className={cx('pl-root', 'pl-featured', Heading === 'h1' && 'pl-featured-page')} lang={locale} aria-labelledby={headingId}>
      <div className="pl-featured-info">
        <div className="pl-featured-head">
          {Heading === 'h1' ? (
            <Eyebrow index={index} text={product.category} locale={locale} />
          ) : (
            <Eyebrow text={UI.featured} locale={locale} />
          )}
          <StatusBadge status={product.status} locale={locale} />
        </div>
        <Heading className={cx('pl-featured-title', ts('display-lg', locale))} id={headingId}>
          {tx(product.title, locale)}
        </Heading>
        <p className={cx('pl-featured-tagline', ts('body-lg', locale), 'pl-pretty')}>{t(product.tagline, locale)}</p>
        <SpecList rows={rows} locale={locale} />
        <div className="pl-featured-actions">
          {resolved.map((a, i) => (
            <Button
              key={i}
              variant={a.variant ?? 'secondary'}
              href={a.href}
              arrow
              external={a.external}
              size="lg"
            >
              {t(a.label, locale)}
            </Button>
          ))}
        </div>
      </div>
      <div className="pl-featured-visual">
        <BrowserFrame
          size="lg"
          url={product.url ?? `${product.slug}.peera.dev`}
          tag={t(STATUS[product.status], 'en')}
          src={product.thumbnail}
          alt={product.thumbnailAlt ? t(product.thumbnailAlt, locale) : undefined}
          sizes="(min-width: 1024px) 58vw, 100vw"
          aspect="16 / 10"
          priority={Heading === 'h1'}
          transitionName={Heading === 'h1' ? `pl-frame-${product.slug}` : undefined}
        >
          {product.thumbnail ? null : <AppSkeleton kind={product.preview} label={title} />}
        </BrowserFrame>
      </div>
    </section>
  );
}
