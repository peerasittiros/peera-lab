import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { adminAvailable } from '@/lib/admin/auth';
import { fontVariables } from '../fonts';
import { ThemeScript } from '../theme-script';
import '../globals.css';
import './admin.css';

export const metadata: Metadata = {
  title: 'Admin — Peera Lab',
  robots: { index: false, follow: false },
};

/** Separate root layout: the admin is Thai-only, outside the [locale] routes, and never indexed. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Read request headers so Vercel availability and the force-enable escape hatch are checked at runtime.
  await headers();
  if (!adminAvailable()) notFound();
  return (
    <html lang="th" className={fontVariables} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="adm">{children}</body>
    </html>
  );
}
