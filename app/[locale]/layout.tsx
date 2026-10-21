import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteUrl } from '@/lib/site-url';
import { fontVariables } from '../fonts';
import { ThemeScript } from '../theme-script';
import { RevealObserver } from '@/components/layout/RevealObserver';
import '../globals.css';
import { isLocale, locales } from '@/lib/i18n';

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: 'Peera Lab', template: '%s | Peera Lab' },
  description: 'A personal product studio building useful software for real business problems.',
  openGraph: {
    siteName: 'Peera Lab',
    type: 'website',
  },
};

// Only the locales in lib/i18n.ts exist: proxy.ts redirects other prefixes and the layout 404s as a backstop.
// No `dynamicParams = false` here: child segments inherit it, which turns the catch-all and unknown slugs into a
// bare error page (no layout, no theme) and makes items added in /admin 404 until the next build.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Root layout for every route: <html lang> follows the URL locale.
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
