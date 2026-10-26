import type { ReactNode } from 'react';
import Image from 'next/image';
import { cx } from '@/lib/design';

export interface BrowserFrameProps {
  /** Shown in the URL bar. Defaults to peera.dev. */
  url?: string;
  /** Mono tag at the right of the bar, such as "Prototype UI". */
  tag?: string;
  /** Screenshot (local path under public/). Use with `alt`. Otherwise pass children (usually AppSkeleton). */
  src?: string;
  alt?: string;
  /** `sizes` hint for the screenshot, so the browser picks the right width. */
  sizes?: string;
  /** CSS aspect-ratio for the body, such as "16 / 10". */
  aspect?: string;
  /** `lg` is the featured product: larger radius and lift shadow. */
  size?: 'md' | 'lg';
  caption?: ReactNode;
  className?: string;
  /** Load the screenshot eagerly (above the fold). */
  priority?: boolean;
  /** `view-transition-name`, so the frame morphs between pages (card → product hero). Unique per page. */
  transitionName?: string;
  children?: ReactNode;
}

/**
 * The container for every product visual: a slim bar with the product URL,
 * then a body. No traffic-light dots and no fake OS chrome.
 */
export function BrowserFrame({
  url,
  tag,
  src,
  alt,
  sizes = '100vw',
  aspect,
  size = 'md',
  caption,
  className,
  priority,
  transitionName,
  children,
}: BrowserFrameProps) {
  return (
    <figure
      className={cx('pl-root', 'pl-frame', size === 'lg' && 'pl-frame-lg', className)}
      style={{ margin: 0, viewTransitionName: transitionName }}
    >
      <div className="pl-frame-bar" aria-hidden="true">
        <span className="pl-frame-url">{url || 'peera.dev'}</span>
        {tag ? <span className="pl-frame-tag">{tag}</span> : null}
      </div>
      <div className="pl-frame-body" style={aspect ? { aspectRatio: aspect } : undefined}>
        {src ? <Image src={src} alt={alt ?? ''} fill sizes={sizes} priority={priority} /> : children}
      </div>
      {caption ? <figcaption className="pl-frame-caption">{caption}</figcaption> : null}
    </figure>
  );
}
