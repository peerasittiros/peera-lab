// The one Open Graph layout: wordmark, accent rule, title in display / display-th, lead, and (for items) a
// BrowserFrame-style visual. Satori subset of CSS: flexbox only, inline styles, every div needs display: flex.
// Content text goes through ShapedText (fontkit) so Thai marks sit where they do on the page.
import { ImageResponse } from 'next/og';
import type { Locale } from '@/lib/i18n';
import { bodyFamily, color, ogFonts, ogSize, plain } from '@/lib/og';
import { ShapedText, titleFace } from '@/lib/og-text';

export interface OgImageProps {
  locale: Locale;
  title: string;
  lead: string;
  /** Bottom-left label, e.g. the item's category. */
  label: string;
  /** For products and projects: the URL shown in the frame bar and the status tag. */
  frame?: { url: string; tag: string };
}

const PADDING = 68;
const FRAME_WIDTH = 400;
const GAP = 48;

/** A token-colored app wireframe inside a frame, like BrowserFrame + AppSkeleton on the page. */
function Frame({ url, tag }: { url: string; tag: string }) {
  const bar = (width: number, fill = color('line')) => (
    <div style={{ display: 'flex', width, height: 10, borderRadius: 2, backgroundColor: fill }} />
  );
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: FRAME_WIDTH,
        height: 300,
        backgroundColor: color('surface-raised'),
        border: `1px solid ${color('line')}`,
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 40,
          padding: '0 14px',
          borderBottom: `1px solid ${color('line')}`,
          fontFamily: bodyFamily,
          fontSize: 14,
          color: color('ink-muted'),
        }}
      >
        <div style={{ display: 'flex', padding: '3px 10px', borderRadius: 4, backgroundColor: color('surface-sunken') }}>{url}</div>
        <div style={{ display: 'flex' }}>{tag}</div>
      </div>
      <div style={{ display: 'flex', flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: 96, padding: 16, borderRight: `1px solid ${color('line')}` }}>
          {bar(56, color('ink'))}
          {bar(48, color('accent'))}
          {bar(60)}
          {bar(40)}
          {bar(52)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {bar(140, color('ink'))}
            {bar(52, color('accent'))}
          </div>
          {[0, 1, 2, 3, 4].map((row) => (
            <div key={row} style={{ display: 'flex', gap: 14, paddingBottom: 10, borderBottom: `1px solid ${color('line')}` }}>
              {bar(110)}
              {bar(46)}
              {bar(40)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function ogImage({ locale, title, lead, label, frame }: OgImageProps) {
  const heading = plain(title);
  const th = locale === 'th';
  const textWidth = ogSize.width - PADDING * 2 - (frame ? FRAME_WIDTH + GAP : 0);
  const titleSize = heading.length > 40 ? 52 : heading.length > 22 ? 62 : 80;
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: PADDING,
          backgroundColor: color('surface'),
          color: color('ink'),
          fontFamily: bodyFamily,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: 'Funnel Display', fontSize: 30 }}>
          Peera<span style={{ color: color('accent'), margin: '0 4px' }}>/</span>
          <span style={{ fontFamily: bodyFamily, fontSize: 20, color: color('ink-muted') }}>LAB</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: GAP }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: textWidth }}>
            <div style={{ display: 'flex', width: 96, height: 8, backgroundColor: color('accent') }} />
            {/* Thai: taller lines; no negative tracking in either locale (shaped text has none). */}
            <ShapedText
              text={heading}
              locale={locale}
              face={titleFace(locale)}
              size={titleSize}
              lineHeight={th ? 1.35 : 1.1}
              color={color('ink')}
              maxWidth={textWidth}
              maxLines={2}
            />
            <ShapedText
              text={plain(lead)}
              locale={locale}
              face="body"
              size={28}
              lineHeight={th ? 1.6 : 1.4}
              color={color('ink-muted')}
              maxWidth={textWidth}
              maxLines={frame ? 3 : 2}
            />
          </div>
          {frame ? <Frame url={frame.url} tag={frame.tag} /> : null}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 16,
            borderTop: `1px solid ${color('line')}`,
          }}
        >
          <ShapedText text={label} locale={locale} face="body" size={20} lineHeight={1.6} color={color('ink-muted')} maxWidth={700} maxLines={1} />
          <ShapedText
            text={th ? 'ภาษาไทย' : 'English'}
            locale={locale}
            face="body"
            size={20}
            lineHeight={1.6}
            color={color('ink-muted')}
            maxWidth={200}
            maxLines={1}
          />
        </div>
      </div>
    ),
    { ...ogSize, fonts: await ogFonts() },
  );
}
