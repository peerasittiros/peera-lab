import { getSite } from '@/lib/content';
import { NotFoundView } from '@/components/pages/NotFoundView';
import { notFoundMetadata } from '@/lib/seo';

// not-found gets no params, so the title is in both languages.
export const metadata = notFoundMetadata;

/** 404 inside a locale (unknown slug or path). The view reads the locale from the URL. */
export default function NotFound() {
  return <NotFoundView site={getSite()} />;
}
