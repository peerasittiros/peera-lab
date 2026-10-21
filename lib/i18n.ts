// Locales, Localized values, and the formatting helpers shared by pages and (later) components.
// Rules: design-system/bilingual.md. Thai years are พ.ศ. via Intl; Thai phones use 0XX-XXX-XXXX.

export const locales = ['en', 'th'] as const;
export type Locale = (typeof locales)[number];

/** `/` redirects to this locale when Accept-Language and the cookie give no supported locale. */
export const defaultLocale: Locale = 'th';
export const localeCookie = 'locale';

/** A content field: every user-facing string is written in both locales. */
export type Localized = { en: string; th: string };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Removes `|` phrase markers. They only control line breaks on the page; titles, meta tags and images use this. */
export function plain(text: string): string {
  return text.replaceAll('|', '');
}

/** Resolves a Localized value for a locale. Falls back to en when th is empty. */
export function t(value: Localized, locale: Locale): string {
  return value[locale] || value.en;
}

/** Type-style class for a locale: `display-xl` becomes `display-xl-th` in Thai. `code` never changes. */
export function ts(style: string, locale: Locale): string {
  return locale === 'th' && style !== 'code' ? `${style}-th` : style;
}

/** Thai years are พ.ศ. (Buddhist era) and English years are CE. */
export function formatYear(year: number, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'th' ? 'th-TH' : 'en-US', { year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, 0, 1)),
  );
}

/** Month and year of an ISO date: "March 2026" (en) or "มีนาคม 2569" (th, พ.ศ.). */
export function formatMonthYear(isoDate: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'th' ? 'th-TH' : 'en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

/** Formats a 10-digit Thai mobile number: 062-753-2703 (th) or +66 62 753 2703 (en). Other inputs are returned unchanged. */
export function formatPhone(raw: string, locale: Locale): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length !== 10 || !digits.startsWith('0')) return raw;
  return locale === 'th'
    ? `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
    : `+66 ${digits.slice(1, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

/** `tel:` link for a Thai phone number, with the country code. */
export function phoneHref(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  return digits.startsWith('0') ? `tel:+66${digits.slice(1)}` : `tel:+${digits}`;
}
