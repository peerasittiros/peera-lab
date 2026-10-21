// Redirects URLs without a locale prefix to /en/... or /th/... (bilingual.md, Routing & switching).
// Order: Accept-Language, then the locale cookie, then the default locale (th).
import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, isLocale, localeCookie, type Locale } from '@/lib/i18n';

function negotiate(acceptLanguage: string | null, cookie: string | undefined): Locale {
  const ranked = (acceptLanguage ?? '')
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
      return { tag: tag.trim().toLowerCase(), q: q ? Number(q.slice(2)) : 1 };
    })
    .filter((entry) => entry.tag && entry.q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split('-')[0];
    if (isLocale(base)) return base;
  }
  if (cookie && isLocale(cookie)) return cookie;
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [, first] = pathname.split('/');
  // The admin has no locale; its pages check the session themselves. /icon is the favicon route (app/icon.tsx).
  if (isLocale(first) || first === 'admin' || pathname === '/icon') return NextResponse.next();

  const locale = negotiate(request.headers.get('accept-language'), request.cookies.get(localeCookie)?.value);
  const url = request.nextUrl.clone();
  url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals and any path with a file extension (public/ assets).
  matcher: ['/((?!_next|.*\\..*).*)'],
};
