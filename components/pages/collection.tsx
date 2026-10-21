// The three pages shared by products and projects: list (with status filter), item, and demo.
// Routes under app/[locale]/products and app/[locale]/projects only resolve params and call these.
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/JsonLd';
import { UI, cx, pad, tx } from '@/lib/design';
import { getSite } from '@/lib/content';
import { getItems, indexPrefix, kindCopy, kindHref, withName, type Kind } from '@/lib/collections';
import { formatMonthYear, isLocale, t, ts, type Locale } from '@/lib/i18n';
import { productJsonLd } from '@/lib/seo';
import { Shell } from './shell';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ContactBlock } from '@/components/layout/ContactBlock';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AppSkeleton } from '@/components/products/AppSkeleton';
import { BrowserFrame } from '@/components/products/BrowserFrame';
import { FeaturedProduct, productSpecRows } from '@/components/products/FeaturedProduct';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductLab } from '@/components/products/ProductLab';
import { ProductSections } from '@/components/products/ProductSections';

export type LocaleParams = Promise<{ locale: string }>;
export type ItemParams = Promise<{ locale: string; slug: string }>;

/** `generateStaticParams` for item and demo routes: one page per published item. */
export function itemParams(kind: Kind) {
  return getItems(kind).map((item) => ({ slug: item.slug }));
}

function resolveLocale(raw: string): Locale {
  if (!isLocale(raw)) notFound();
  return raw;
}

/** Every item, with a status filter. The header is the page's only h1. */
export async function CollectionListPage({ kind, params }: { kind: Kind; params: LocaleParams }) {
  const locale = resolveLocale((await params).locale);
  const copy = kindCopy(kind);
  const prefix = indexPrefix[kind];
  return (
    <Shell active={kind} locale={locale} path={`/${kind}`}>
      <div className="pl-home-section">
        <SectionHeader locale={locale} as="h1" title={copy.title} lead={copy.lead} />
        <ProductLab
          products={getItems(kind)}
          locale={locale}
          base={kindHref(kind, locale)}
          indexPrefix={prefix}
          empty={copy.empty}
        />
      </div>
    </Shell>
  );
}

/**
 * Item page, a mini landing page: hero (the page's only h1) → the content sections that exist →
 * contact band → previous and next items in list order.
 */
export async function CollectionItemPage({ kind, params }: { kind: Kind; params: ItemParams }) {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  const copy = kindCopy(kind);
  const prefix = indexPrefix[kind];
  const site = getSite();
  const items = getItems(kind);
  const at = items.findIndex((item) => item.slug === slug);
  if (at < 0) notFound();
  const item = items[at];
  const number = (i: number) => (prefix ? i + 1 : undefined);

  const rows = productSpecRows(item);
  if (item.startedAt) {
    const started = item.startedAt;
    rows.push({ label: UI.started, value: { en: formatMonthYear(started, 'en'), th: formatMonthYear(started, 'th') } });
  }

  const actions = [
    { label: copy.request, href: '#contact', variant: 'primary' as const },
    // Every item has a demo route: the live demo once `demoUrl` is set, an honest preview until then.
    { label: item.demoUrl ? UI.demo : UI.demoPreview, href: kindHref(kind, locale, slug, true), variant: 'secondary' as const },
    ...(item.repositoryUrl
      ? [{ label: UI.code, href: item.repositoryUrl, variant: 'ghost' as const, external: true }]
      : []),
  ];

  // Previous and next wrap around the list. With two items they are the same one, so it shows once.
  const neighbours =
    items.length < 2
      ? []
      : [
          { label: UI.previous, index: (at - 1 + items.length) % items.length },
          { label: UI.next, index: (at + 1) % items.length },
        ].filter((n, i, all) => all.findIndex((m) => m.index === n.index) === i);

  return (
    <Shell active={kind} locale={locale} path={`/${kind}/${slug}`}>
      {kind === 'products' ? <JsonLd data={productJsonLd(item, locale)} /> : null}
      <div className="pl-page-section">
        <FeaturedProduct
          product={item}
          locale={locale}
          as="h1"
          index={prefix ? `${prefix}-${pad(at + 1)}` : undefined}
          rows={rows}
          actions={actions}
        />
        <ProductSections product={item} locale={locale} />
      </div>

      <ContactBlock
        locale={locale}
        title={withName(copy.contactTitle, item.title)}
        lead={site.contact.lead}
        email={site.contact.email}
        phone={site.contact.phone}
        actions={site.contact.actions}
        id="contact"
      />

      {neighbours.length ? (
        <div className="pl-page-section">
          <section className="pl-root pl-psec pl-reveal" lang={locale} aria-labelledby="pl-more">
            <SectionHeader
              locale={locale}
              title={copy.more}
              size="md"
              id="pl-more"
              action={{ label: copy.all, href: kindHref(kind, locale) }}
            />
            <div className="pl-pager">
              {neighbours.map((n) => (
                <div key={n.index} className="pl-pager-item">
                  <span className={`pl-pager-label ${ts('label', locale)}`}>{t(n.label, locale)}</span>
                  <ProductCard
                    product={items[n.index]}
                    locale={locale}
                    href={kindHref(kind, locale, items[n.index].slug)}
                    index={number(n.index)}
                    indexPrefix={prefix}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </Shell>
  );
}


/**
 * Demo route. Without `demoUrl` it shows an honest preview (the AppSkeleton of `preview`).
 * Setting `demoUrl` in the item's JSON turns it into the live demo, embedded in the frame. No page edits needed.
 * Demos are separate deployments; this site only frames them (product-architecture.md, "Future demos").
 */
export async function CollectionDemoPage({ kind, params }: { kind: Kind; params: ItemParams }) {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  const prefix = indexPrefix[kind];
  const items = getItems(kind);
  const at = items.findIndex((item) => item.slug === slug);
  if (at < 0) notFound();
  const item = items[at];
  const title = t(item.title, locale);
  const live = item.demoUrl;
  const demoCopy = getSite().demo;

  return (
    <Shell active={kind} locale={locale} path={`/${kind}/${slug}/demo`}>
      <div className="pl-page-section">
        <section className="pl-root pl-demo" lang={locale} aria-labelledby="pl-demo-title">
          <div className="pl-demo-head">
            <div className="pl-featured-head">
              <Eyebrow
                index={prefix ? `${prefix}-${pad(at + 1)}` : undefined}
                text={demoCopy.label}
                locale={locale}
              />
              <StatusBadge status={item.status} locale={locale} />
            </div>
            <h1 className={cx(ts('headline-lg', locale), 'pl-balance')} id="pl-demo-title">
              {tx(item.title, locale)}
            </h1>
            <p className={cx(ts('body-lg', locale), 'pl-demo-lead', 'pl-pretty')}>
              {t(live ? demoCopy.liveLead : demoCopy.previewLead, locale)}
            </p>
            <div className="pl-featured-actions">
              {live ? (
                <Button variant="secondary" href={live} external arrow>
                  {t(demoCopy.newTab, locale)}
                </Button>
              ) : null}
              <Button variant="ghost" href={kindHref(kind, locale, slug)}>
                {`${t(demoCopy.back, locale)}: ${title}`}
              </Button>
            </div>
          </div>
          <BrowserFrame
            size="lg"
            url={live ? new URL(live).host : (item.url ?? `${slug}.peera.dev`)}
            tag={live ? undefined : 'Preview'}
            aspect="16 / 10"
          >
            {live ? (
              <iframe
                className="pl-demo-embed"
                src={live}
                title={locale === 'th' ? `เดโม ${title}` : `${title} demo`}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
              />
            ) : (
              <AppSkeleton kind={item.preview} label={title} />
            )}
          </BrowserFrame>
        </section>
      </div>
    </Shell>
  );
}
