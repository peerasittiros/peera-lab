import Image from 'next/image';
import { cx } from '@/lib/design';

export interface PhoneFrameProps {
  /** Portrait screenshot (390 wide), local path under public/. */
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/**
 * A generic phone around a portrait screenshot: an `ink` body with a speaker slot in the top bezel, so the
 * screenshot is never covered. Its corner radius is device geometry, not a UI radius (DESIGN.md › Product visuals).
 */
export function PhoneFrame({ src, alt, sizes = '30vw', priority, className }: PhoneFrameProps) {
  return (
    <figure className={cx('pl-root', 'pl-phone', className)} style={{ margin: 0 }}>
      <span className="pl-phone-slot" aria-hidden="true" />
      <div className="pl-phone-screen">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} />
      </div>
    </figure>
  );
}
