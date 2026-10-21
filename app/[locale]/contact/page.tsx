import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSite } from '@/lib/content';
import { isLocale } from '@/lib/i18n';
import { ContactBlock } from '@/components/layout/ContactBlock';
import { Shell } from '@/components/pages/shell';
import { pageMetadata } from '@/lib/seo';
import { t } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const site = getSite();
  return pageMetadata(locale, `/${locale}/contact`, t(site.contactPage.title, locale), t(site.contactPage.lead, locale));
}

/** Contact page: the contact band as the whole page, with its title as the page's only h1. */
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const site = getSite();
  return (
    <Shell active="contact" locale={locale} path="/contact">
      <ContactBlock
        locale={locale}
        as="h1"
        title={site.contactPage.title}
        lead={site.contactPage.lead}
        person={site.contact.person}
        email={site.contact.email}
        phone={site.contact.phone}
        actions={site.contact.actions}
        id="contact"
      />
    </Shell>
  );
}
