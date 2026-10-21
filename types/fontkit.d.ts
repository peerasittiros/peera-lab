// The small part of fontkit's API that lib/og-text.tsx uses (the package ships no types).
declare module 'fontkit' {
  export interface Path {
    toSVG(): string;
  }
  export interface Glyph {
    path: Path;
  }
  export interface GlyphPosition {
    xAdvance: number;
    xOffset: number;
    yOffset: number;
  }
  export interface GlyphRun {
    glyphs: Glyph[];
    positions: GlyphPosition[];
    advanceWidth: number;
  }
  export interface Font {
    unitsPerEm: number;
    ascent: number;
    descent: number;
    layout(text: string): GlyphRun;
  }
  export function create(buffer: Buffer): Font;
}
