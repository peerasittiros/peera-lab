import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CollectionListPage, type LocaleParams } from '@/components/pages/collection';
import { isLocale } from '@/lib/i18n';
import { collectionMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return collectionMetadata(locale, 'projects');
}

export default function Page({ params }: { params: LocaleParams }) {
  return <CollectionListPage kind="projects" params={params} />;
}
