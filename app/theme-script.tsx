'use client';

import { useLayoutEffect } from 'react';

// Runs before paint: a saved choice wins, otherwise follow the OS. tokens.css keys dark off [data-theme="dark"].
function applyTheme() {
  try {
    let theme = localStorage.getItem('theme');
    if (theme !== 'light' && theme !== 'dark') {
      theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.dataset.theme = theme;
  } catch {}
}

const script = `(${applyTheme.toString()})()`;

/**
 * The server renders a runnable inline script. Next serves 404s as an empty error shell that React then renders
 * on the client, which recreates <html> without data-theme: the layout effect sets it again before paint.
 * On the client the script gets type="text/plain", since React warns about client-rendered executable scripts.
 */
export function ThemeScript() {
  useLayoutEffect(() => {
    if (!document.documentElement.dataset.theme) applyTheme();
  }, []);
  return (
    <script
      type={typeof window === 'undefined' ? undefined : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
