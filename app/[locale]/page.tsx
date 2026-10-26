import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { pageMetadata, personJsonLd } from '@/lib/seo';
import { getFeaturedProduct, getProducts, getSite } from '@/lib/content';
import { isLocale, t, type Locale } from '@/lib/i18n';
import { footerLinks, navItems } from '@/lib/nav';
import { SiteNav } from '@/components/navigation/SiteNav';
import { Hero } from '@/components/layout/Hero';
import { HeroGlobe } from '@/components/layout/HeroGlobe';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ContactBlock } from '@/components/layout/ContactBlock';
import { Footer } from '@/components/layout/Footer';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductDetails } from '@/components/products/ProductDetails';
import { ProductStory, productShots } from '@/components/products/ProductStory';
import { DeviceStack, phoneShot } from '@/components/products/DeviceStack';
import { mockScreens } from '@/components/products/mocks';

/**
 * Homepage: Nav → Hero (the message over the interactive globe) → Devices (the featured product on a laptop and a phone) →
 * Product story (featured) → Feature bento → Product Lab →
 * Contact → Footer (DESIGN.md › Layout). Personal details appear only in the Contact band.
 * The Hero is the page's only h1. Every section opens with an h2.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const site = getSite();
  const title = t(site.hero.title, raw);
  return pageMetadata(raw, `/${raw}`, title, t(site.hero.lead, raw), 'absolute');
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  const site = getSite();
  const products = getProducts();
  const featured = getFeaturedProduct();
  const lab = products.filter((product) => product.slug !== featured.slug);
  // Below the hero: the featured product on a laptop and a phone, the same app on both.
  const showcaseDesktop = productShots(featured)[0];
  const year = new Date().getFullYear();
  const brand = site.name.split(' ')[0];

  return (
    <>
      <JsonLd data={personJsonLd(locale)} />
      <SiteNav
        locale={locale}
        items={navItems(site, locale, true)}
        homeHref={`/${locale}`}
        name={brand}
        localeHrefs={{ en: '/en', th: '/th' }}
      />
      <main>
        {/* The globe fills the hero band behind the message; the products follow below. */}
        <div className="pl-hero-band">
          <HeroGlobe />
          <Hero
            locale={locale}
            title={site.hero.title}
            lead={site.hero.lead}
            actions={site.hero.actions.map((a, i) => ({ label: a.label, href: a.href, variant: i ? 'secondary' : 'primary' }))}
          />
        </div>

        {showcaseDesktop ? (
          <div className="pl-home-section" id="devices">
            <section className="pl-root pl-showcase pl-reveal" lang={locale}>
              <SectionHeader locale={locale} title={site.home.devices.title} lead={site.home.devices.lead} />
              <div className="pl-showcase-stack">
                <DeviceStack
                  locale={locale}
                  desktop={showcaseDesktop}
                  phone={phoneShot(featured)}
                  screens={mockScreens(featured.slug, locale)}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                />
              </div>
            </section>
          </div>
        ) : null}

        <div className="pl-home-section" id="featured">
          <ProductStory product={featured} locale={locale} />
        </div>

        <div className="pl-home-section" id="details">
          <ProductDetails
            products={products}
            locale={locale}
            title={site.home.details.title}
            lead={site.home.details.lead}
            exclude={featured.slug}
          />
        </div>

        <div className="pl-home-section pl-reveal" id="products">
          <SectionHeader
            locale={locale}
            title={site.home.lab.title}
            lead={site.home.lab.lead}
            action={{ label: site.home.lab.all, href: `/${locale}/products` }}
          />
          <ProductGrid products={lab} locale={locale} startIndex={2} />
        </div>

        <ContactBlock
          locale={locale}
          title={site.contact.title}
          lead={site.contact.lead}
          person={site.contact.person}
          email={site.contact.email}
          phone={site.contact.phone}
          actions={site.contact.actions}
          id="contact"
        />
      </main>
      <Footer
        locale={locale}
        name={brand}
        homeHref={`/${locale}`}
        links={footerLinks(site, locale, true)}
        owner={site.name}
        year={year}
      />
    </>
  );
}
