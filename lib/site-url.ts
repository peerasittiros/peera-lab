/**
 * Canonical public origin used by metadata, sitemap and JSON-LD.
 * Set NEXT_PUBLIC_SITE_URL to the deployed origin before production; peera.dev is mentioned in the project spec but not confirmed.
 */
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://peera.dev';
export const siteUrl = new URL(configuredSiteUrl);
siteUrl.pathname = '/';
siteUrl.search = '';
siteUrl.hash = '';

export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}
