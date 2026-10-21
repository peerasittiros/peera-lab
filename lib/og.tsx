// Shared pieces for the Open Graph images (app/**/opengraph-image.tsx): brand fonts, token colors, plain text.
// Fonts are the site's own (assets/fonts, SIL OFL 1.1). Satori uses them for the small Latin labels; content text
// is shaped by lib/og-text.tsx, because satori does no Thai mark positioning.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import tokens from '@/design-system/tokens.json';
export { plain } from '@/lib/i18n';

export const ogSize = { width: 1200, height: 630 };

type ColorToken = { name: string; value: { light: string; dark: string } };

/** Light-theme color by token name, straight from design-system/tokens.json (no hex in components). */
export function color(name: string): string {
  const token = (tokens.color.tokens as ColorToken[]).find((entry) => entry.name === name);
  if (!token) throw new Error(`[og] unknown color token: ${name}`);
  return token.value.light;
}

const FONT_DIR = path.join(process.cwd(), 'assets', 'fonts');
const fontFiles = [
  { name: 'Funnel Display', file: 'FunnelDisplay-Medium.ttf', weight: 500 },
  { name: 'Anuphan', file: 'Anuphan-SemiBold.ttf', weight: 600 },
  { name: 'IBM Plex Sans Thai', file: 'IBMPlexSansThai-Regular.ttf', weight: 400 },
] as const;

let loaded: Promise<{ name: string; data: Buffer; weight: 500 | 600 | 400; style: 'normal' }[]> | null = null;

/** Read once per server process. */
export function ogFonts() {
  loaded ??= Promise.all(
    fontFiles.map(async (font) => ({
      name: font.name,
      data: await readFile(path.join(FONT_DIR, font.file)),
      weight: font.weight,
      style: 'normal' as const,
    })),
  );
  return loaded;
}

export const bodyFamily = 'IBM Plex Sans Thai';
