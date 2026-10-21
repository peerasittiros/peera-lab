import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CollectionItemPage, itemParams, type ItemParams } from '@/components/pages/collection';
import { isLocale } from '@/lib/i18n';
import { itemMetadata } from '@/lib/seo';

// Items published at build time are prerendered. Items added later (e.g. from /admin) render on first visit;
// unknown slugs call notFound().

export async function generateMetadata({ params }: { params: ItemParams }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return itemMetadata(locale, 'projects', slug);
}

export function generateStaticParams() {
  return itemParams('projects');
}

export default function Page({ params }: { params: ItemParams }) {
  return <CollectionItemPage kind="projects" params={params} />;
}
