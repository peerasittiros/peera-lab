import { cx } from '@/lib/design';
import { t, ts, type Locale, type Localized } from '@/lib/i18n';
import type { Product } from '@/lib/content';
import { LaptopFrame } from './LaptopFrame';
import { PhoneFrame } from './PhoneFrame';

export interface DeviceShot {
  src: string;
  alt?: Localized;
}

export interface DeviceStackProps {
  locale: Locale;
  desktop: DeviceShot;
  phone?: DeviceShot;
  /** Short line under the devices, such as "The same app on the phone and the computer". */
  label?: Localized;
  /** Load both screenshots eagerly (above the fold). */
  priority?: boolean;
  /** `sizes` for the laptop screenshot; the phone takes about a quarter of it. */
  sizes?: string;
  className?: string;
}

/** A product's phone screenshot, if it has one. */
export function phoneShot(product: Product): DeviceShot | undefined {
  return product.screenshots?.find((shot) => shot.device === 'phone');
}

/**
 * The same product on a laptop and a phone: a LaptopFrame with a PhoneFrame standing at its lower right, so a
 * visitor sees at a glance that it works on both. Without a phone shot it is the laptop alone.
 */
export function DeviceStack({ locale, desktop, phone, label, priority, sizes = '100vw', className }: DeviceStackProps) {
  return (
    <div className={cx('pl-root', 'pl-devices', phone && 'has-phone', className)} lang={locale}>
      <div className="pl-devices-stage">
        <div className="pl-devices-desktop">
          <LaptopFrame
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
              sizes="(min-width: 1024px) 12vw, 26vw"
              priority={priority}
            />
          </div>
        ) : null}
      </div>
      {label ? <p className={cx('pl-devices-label', ts('label', locale))}>{t(label, locale)}</p> : null}
    </div>
  );
}
