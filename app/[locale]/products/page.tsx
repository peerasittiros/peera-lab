import type { Metadata } from 'next';
import { CollectionListPage, type LocaleParams } from '@/components/pages/collection';
import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { collectionMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return collectionMetadata(locale, 'products');
}

export default function Page({ params }: { params: LocaleParams }) {
  return <CollectionListPage kind="products" params={params} />;
}
