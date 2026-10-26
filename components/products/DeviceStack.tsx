import { cx } from '@/lib/design';
import { t, ts, type Locale, type Localized } from '@/lib/i18n';
import type { Product } from '@/lib/content';
import { BrowserFrame } from './BrowserFrame';
import { PhoneFrame } from './PhoneFrame';

export interface DeviceShot {
  src: string;
  alt?: Localized;
}

export interface DeviceStackProps {
  locale: Locale;
  desktop: DeviceShot;
  phone?: DeviceShot;
  /** Shown in the desktop frame's URL bar and tag. */
  url?: string;
  tag?: string;
  /** Short line under the devices, such as "The same app on the phone and the computer". */
  label?: Localized;
  /** Load both screenshots eagerly (above the fold). */
  priority?: boolean;
  /** `sizes` for the desktop screenshot; the phone takes about a third of it. */
  sizes?: string;
  className?: string;
}

/** A product's phone screenshot, if it has one. */
export function phoneShot(product: Product): DeviceShot | undefined {
  return product.screenshots?.find((shot) => shot.device === 'phone');
}

/**
 * The same product on a computer and a phone: a desktop BrowserFrame with a PhoneFrame overlapping its lower
 * right corner, so a visitor sees at a glance that it works on both. Without a phone shot it is a plain frame.
 */
export function DeviceStack({
  locale,
  desktop,
  phone,
  url,
  tag,
  label,
  priority,
  sizes = '100vw',
  className,
}: DeviceStackProps) {
  return (
    <div className={cx('pl-root', 'pl-devices', phone && 'has-phone', className)} lang={locale}>
      <div className="pl-devices-stage">
        <div className="pl-devices-desktop">
          <BrowserFrame
            url={url}
            tag={tag}
            src={desktop.src}
            alt={desktop.alt ? t(desktop.alt, locale) : ''}
            sizes={sizes}
            priority={priority}
          />
        </div>
        {phone ? (
          <div className="pl-devices-phone">
            <PhoneFrame
              src={phone.src}
              alt={phone.alt ? t(phone.alt, locale) : ''}
              sizes="(min-width: 1024px) 14vw, 30vw"
              priority={priority}
            />
          </div>
        ) : null}
      </div>
      {label ? <p className={cx('pl-devices-label', ts('label', locale))}>{t(label, locale)}</p> : null}
    </div>
  );
}
