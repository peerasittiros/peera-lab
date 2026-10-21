import type { Metadata } from 'next';
import { fontVariables } from '../fonts';
import { ThemeScript } from '../theme-script';
import '../globals.css';
import './admin.css';

export const metadata: Metadata = {
  title: 'Admin — Peera Lab',
  robots: { index: false, follow: false },
};

/** Separate root layout: the admin is Thai-only, outside the [locale] routes, and never indexed. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={fontVariables} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="adm">{children}</body>
    </html>
  );
}
