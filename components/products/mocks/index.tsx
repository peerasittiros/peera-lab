import type { ReactNode } from 'react';
import type { Locale } from '@/lib/i18n';
import { RentrollMock } from './RentrollMock';
import { STOCKLINE_SPOTS, StocklineMock } from './StocklineMock';

export interface MockScreens {
  desktop: ReactNode;
  phone: ReactNode;
}

/**
 * Designed screens for products that have them, used in the device frames instead of screenshots (a real
 * capture is often too small for the frame). Products without one fall back to their screenshots.
 */
export function mockScreens(slug: string, locale: Locale): MockScreens | undefined {
  switch (slug) {
    case 'stockline':
      return {
        desktop: <StocklineMock locale={locale} device="desktop" />,
        phone: <StocklineMock locale={locale} device="phone" />,
      };
    case 'rentroll':
      return {
        desktop: <RentrollMock locale={locale} device="desktop" />,
        phone: <RentrollMock locale={locale} device="phone" />,
      };
    default:
      return undefined;
  }
}

/** The `data-spot` names a product's mock marks, for the home page callouts (DeviceSpots). */
export function mockSpots(slug: string): readonly string[] {
  return slug === 'stockline' ? STOCKLINE_SPOTS : [];
}
