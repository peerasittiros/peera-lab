import { notFound } from 'next/navigation';
import { notFoundMetadata } from '@/lib/seo';

export const metadata = notFoundMetadata;

/** Any path under a locale that no route matches renders app/[locale]/not-found.tsx, in that locale. */
export default function Page() {
  notFound();
}
