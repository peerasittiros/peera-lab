import type { ReactNode } from 'react';
import Image from 'next/image';
import { cx } from '@/lib/design';

export interface LaptopFrameProps {
  /** 16:10 desktop screenshot, local path under public/. */
  src?: string;
  alt?: string;
  /** A designed mock screen (HTML, sized in em) instead of a screenshot. */
  children?: ReactNode;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/**
 * A laptop around a 16:10 screenshot: the MacBook Pro frame from Devices.css (`components/devices.css`, MIT).
 * It scales with its container (`.pl-device-laptop` sets the em size). Device art is exempt from the site's
 * colour and shape rules (DESIGN.md › Product visuals).
 */
export function LaptopFrame({ src, alt, children, sizes = '60vw', priority, className }: LaptopFrameProps) {
  return (
    <figure className={cx('pl-root', 'pl-device-laptop', className)} style={{ margin: 0 }}>
      <div className="device device-macbook-pro">
        <div className="device-frame">
          {children ? (
            <div className="device-screen pl-mock-screen" role="img" aria-label={alt ?? ''}>
              {children}
            </div>
          ) : src ? (
            <Image className="device-screen" src={src} alt={alt ?? ''} width={1280} height={800} sizes={sizes} priority={priority} />
          ) : null}
        </div>
        <div className="device-stripe" />
        <div className="device-header" />
        <div className="device-sensors" />
        <div className="device-btns" />
        <div className="device-power" />
      </div>
    </figure>
  );
}
