// Favicon. There is no logo file (the wordmark is type), so this is the wordmark's initial and slash:
// display face on inverse-surface, the slash in inverse-accent, radius-sm corners. Colors come from tokens.json.
import { ImageResponse } from 'next/og';
import { color, ogFonts } from '@/lib/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default async function Icon() {
  const fonts = await ogFonts();
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: color('inverse-surface'),
          color: color('inverse-ink'),
          borderRadius: 4,
          fontFamily: 'Funnel Display',
          fontSize: 22,
          lineHeight: 1,
        }}
      >
        P<span style={{ color: color('inverse-accent') }}>/</span>
      </div>
    ),
    { ...size, fonts: fonts.filter((font) => font.name === 'Funnel Display') },
  );
}
