// Text for Open Graph images, shaped with fontkit and drawn as SVG paths.
// Satori lays text out without OpenType GSUB/GPOS, so Thai tone marks after an upper vowel collide with it
// ("ที่" reads as "ที"). fontkit applies the font's own substitutions and mark positioning, like a browser does.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { create, type Font } from 'fontkit';
import type { Locale } from '@/lib/i18n';

export type OgFace = 'display' | 'display-th' | 'body';

const files: Record<OgFace, string> = {
  display: 'FunnelDisplay-Medium.ttf',
  'display-th': 'Anuphan-SemiBold.ttf',
  body: 'IBMPlexSansThai-Regular.ttf',
};

const cache = new Map<OgFace, Font>();

function font(face: OgFace): Font {
  let loaded = cache.get(face);
  if (!loaded) {
    loaded = create(readFileSync(path.join(process.cwd(), 'assets', 'fonts', files[face])));
    cache.set(face, loaded);
  }
  return loaded;
}

/** Title face per locale: display for English, display-th for Thai (the type tokens' families). */
export function titleFace(locale: Locale): OgFace {
  return locale === 'th' ? 'display-th' : 'display';
}

/** Words to break between: Thai has no spaces, so Intl.Segmenter finds the word boundaries. */
function words(text: string, locale: Locale): string[] {
  const segmenter = new Intl.Segmenter(locale === 'th' ? 'th' : 'en', { granularity: 'word' });
  return Array.from(segmenter.segment(text), (part) => part.segment);
}

function width(text: string, face: OgFace, size: number): number {
  const f = font(face);
  return (f.layout(text).advanceWidth * size) / f.unitsPerEm;
}

/** Greedy line breaking at word boundaries, at most `maxLines` (the last line is cut with an ellipsis). */
function lines(text: string, face: OgFace, size: number, maxWidth: number, locale: Locale, maxLines: number): string[] {
  const out: string[] = [];
  let line = '';
  for (const word of words(text, locale)) {
    const next = line + word;
    if (line && width(next.trimEnd(), face, size) > maxWidth) {
      out.push(line.trimEnd());
      line = word.trimStart();
    } else {
      line = next;
    }
  }
  if (line.trim()) out.push(line.trimEnd());
  if (out.length > maxLines) {
    const kept = out.slice(0, maxLines);
    let last = kept[maxLines - 1];
    while (last && width(`${last}…`, face, size) > maxWidth) last = last.slice(0, -1);
    kept[maxLines - 1] = `${last.trimEnd()}…`;
    return kept;
  }
  return out;
}

/** One shaped line as an <svg>: each glyph is a path at the position fontkit computed (y flipped: fonts are y-up). */
function Line({ text, face, size, lineHeight, fill }: { text: string; face: OgFace; size: number; lineHeight: number; fill: string }) {
  const f = font(face);
  const scale = size / f.unitsPerEm;
  const run = f.layout(text);
  const height = Math.ceil(size * lineHeight);
  const lineWidth = Math.ceil(run.advanceWidth * scale) + 2;
  // Center the font's ascent–descent box in the line, like CSS does.
  const baseline = (height - (f.ascent - f.descent) * scale) / 2 + f.ascent * scale;
  const placed: { d: string; x: number; y: number }[] = [];
  for (let i = 0, x = 0; i < run.glyphs.length; i++) {
    const pos = run.positions[i];
    placed.push({ d: run.glyphs[i].path.toSVG(), x: x + pos.xOffset * scale, y: baseline - pos.yOffset * scale });
    x += pos.xAdvance * scale;
  }
  const glyphs = placed.map((glyph, i) => (
    <path key={i} d={glyph.d} transform={`translate(${glyph.x.toFixed(2)} ${glyph.y.toFixed(2)}) scale(${scale} ${-scale})`} />
  ));
  return (
    <svg width={lineWidth} height={height} viewBox={`0 0 ${lineWidth} ${height}`} fill={fill}>
      {glyphs}
    </svg>
  );
}

export interface ShapedTextProps {
  text: string;
  locale: Locale;
  face: OgFace;
  size: number;
  /** Multiplier of size, as in CSS. */
  lineHeight: number;
  color: string;
  maxWidth: number;
  maxLines?: number;
}

/** A block of wrapped, shaped text for ImageResponse. */
export function ShapedText({ text, locale, face, size, lineHeight, color, maxWidth, maxLines = 3 }: ShapedTextProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {lines(text, face, size, maxWidth, locale, maxLines).map((line, i) => (
        <Line key={i} text={line} face={face} size={size} lineHeight={lineHeight} fill={color} />
      ))}
    </div>
  );
}
