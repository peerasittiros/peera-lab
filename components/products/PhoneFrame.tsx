import type { ReactNode } from 'react';
import Image from 'next/image';
import { cx } from '@/lib/design';
import { MockScreen } from './mocks/MockScreen';

export interface PhoneFrameProps {
  /** Portrait screenshot (390 wide at 2×), local path under public/. */
  src?: string;
  alt?: string;
  /** A designed mock screen (HTML, sized in em) instead of a screenshot. */
  children?: ReactNode;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/**
 * A phone around a portrait screenshot: the iPhone 14 Pro frame from Devices.css (`components/devices.css`, MIT).
 * It scales with its container (`.pl-device-phone` sets the em size). Device art is exempt from the site's
 * colour and shape rules (DESIGN.md › Product visuals).
 */
export function PhoneFrame({ src, alt, children, sizes = '30vw', priority, className }: PhoneFrameProps) {
  return (
    <figure className={cx('pl-root', 'pl-device-phone', className)} style={{ margin: 0 }}>
      <div className="device device-iphone-14-pro">
        <div className="device-frame">
          {children ? (
            <div className="device-screen pl-mock-screen" role="img" aria-label={alt ?? ''}>
              <MockScreen designWidth={780}>{children}</MockScreen>
            </div>
          ) : src ? (
            <Image className="device-screen" src={src} alt={alt ?? ''} width={780} height={1660} sizes={sizes} priority={priority} />
          ) : null}
        </div>
        <div className="device-stripe" />
        <div className="device-header" />
        <div className="device-sensors" />
        <div className="device-btns" />
        <div className="device-power" />
        <div className="device-home" />
      </div>
    </figure>
  );
}
