'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { Locale } from '@/lib/i18n';

const sandbox =
  'allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation';

function demoUrl(src: string, locale: Locale, theme?: 'light' | 'dark') {
  const url = new URL(src);
  url.searchParams.set('lang', locale);
  url.searchParams.set('embed', '1');
  if (theme) url.searchParams.set('theme', theme);
  return url.toString();
}

function usePageTheme() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return theme;
}

interface DemoEmbedProps {
  src: string;
  locale: Locale;
  title: string;
}

/** Loads the demo once its theme is known, without changing the frame's reserved dimensions. */
export function DemoEmbed({ src, locale, title }: DemoEmbedProps) {
  const theme = usePageTheme();

  if (!theme) return null;

  return (
    <iframe
      className="pl-demo-embed"
      src={demoUrl(src, locale, theme)}
      title={title}
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      sandbox={sandbox}
      allow="camera; clipboard-write; fullscreen"
    />
  );
}

interface DemoOpenLinkProps {
  src: string;
  locale: Locale;
  label: string;
}

/** Keeps the standalone demo link in the same locale and theme as the embedded demo. */
export function DemoOpenLink({ src, locale, label }: DemoOpenLinkProps) {
  const theme = usePageTheme();

  return (
    <Button variant="secondary" href={demoUrl(src, locale, theme ?? undefined)} external arrow>
      {label}
    </Button>
  );
}