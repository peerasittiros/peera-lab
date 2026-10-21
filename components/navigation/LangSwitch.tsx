'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { cx } from '@/lib/design';
import { localeCookie, type Locale } from '@/lib/i18n';

/** Each language is named in itself, so a visitor who can't read the current page still finds theirs. */
const options: { locale: Locale; label: string }[] = [
  { locale: 'th', label: 'ภาษาไทย' },
  { locale: 'en', label: 'English' },
];

export interface LangSwitchProps {
  locale: Locale;
  /** Route for each locale. Links are used when given; otherwise the switch calls onChange. */
  hrefs?: { en: string; th: string };
  onChange?: (locale: Locale) => void;
}

/** Stores the choice in the `locale` cookie, which proxy.ts reads on `/`. One year. */
function rememberLocale(locale: Locale) {
  document.cookie = `${localeCookie}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

/**
 * Flags are drawn inline (flag emoji don't render on Windows, and the voice rules ban emoji).
 * They are decorative: the language name next to each one carries the meaning.
 */
function Flag({ locale }: { locale: Locale }) {
  const id = useId();
  if (locale === 'th') {
    return (
      <svg className="pl-flag" viewBox="0 0 9 6" aria-hidden="true" focusable="false" preserveAspectRatio="none">
        <rect width="9" height="6" fill="#A51931" />
        <rect y="1" width="9" height="4" fill="#F4F5F8" />
        <rect y="2" width="9" height="2" fill="#2D2A4A" />
      </svg>
    );
  }
  // Union Jack, cropped to the same 3:2 box as the Thai flag.
  return (
    <svg className="pl-flag" viewBox="0 0 60 30" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
      <clipPath id={`${id}-t`}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#${id}-t)`} stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

/**
 * Language dropdown: a button with the current flag and language name, opening a list of both languages.
 * Disclosure pattern: the button has `aria-expanded`; options are links with `lang`, `hreflang` and
 * `aria-current` on the current one. Escape or a click outside closes it.
 */
export function LangSwitch({ locale, hrefs, onChange }: LangSwitchProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const current = options.find((o) => o.locale === locale) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div
      className={cx('pl-root', 'pl-lang', open && 'is-open')}
      ref={root}
      onBlur={(e) => {
        // Tabbing out of the dropdown closes it.
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        type="button"
        className="pl-lang-button"
        ref={button}
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`Language / ภาษา: ${current.label}`}
        onClick={() => setOpen(!open)}
      >
        <Flag locale={current.locale} />
        <span lang={current.locale}>{current.label}</span>
        <svg className="pl-lang-chevron" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <ul className="pl-lang-list" id={listId} hidden={!open}>
        {options.map((o) => {
          const isCurrent = o.locale === locale;
          return (
            <li key={o.locale}>
              <a
                className={cx('pl-lang-opt', isCurrent && 'is-current')}
                lang={o.locale}
                hrefLang={o.locale}
                aria-current={isCurrent ? 'true' : undefined}
                href={hrefs ? hrefs[o.locale] : '#'}
                onClick={(e) => {
                  rememberLocale(o.locale);
                  setOpen(false);
                  if (!hrefs) {
                    e.preventDefault();
                    onChange?.(o.locale);
                  }
                }}
              >
                <Flag locale={o.locale} />
                <span>{o.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
