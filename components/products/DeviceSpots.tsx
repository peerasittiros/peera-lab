'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '@/lib/design';
import { t, ts, type Locale, type Localized } from '@/lib/i18n';

export interface DeviceSpot {
  /** A `data-spot` name in the product's mock screen. */
  target: string;
  title: Localized;
  body: Localized;
}

export interface DeviceSpotsProps {
  locale: Locale;
  spots: DeviceSpot[];
  /** Label for the callout list. */
  label?: Localized;
  /** The DeviceStack with the designed mock screens. */
  children: ReactNode;
}

/**
 * Numbered callouts on a DeviceStack's mock screens, with a list that explains each one (home devices section).
 * The marks are drawn by CSS inside the mocks (`[data-spot]`), so they follow the lid, the tilt and the scroll
 * drift; this component numbers them and marks the chosen one `data-spot-active`. Choosing a caption
 * (hover, focus or tap) or tapping a mark outlines that part of the screen and brings its device forward.
 * Below 1024 px the devices stay pinned under the nav and the captions scroll beneath them; the caption just
 * below the devices becomes the chosen one. The list is the accessible control; the screens
 * stay one image each.
 */
export function DeviceSpots({ locale, spots, label, children }: DeviceSpotsProps) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Number the marks in the mocks (they are server-rendered, so the order comes from here).
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const marked: HTMLElement[] = [];
    spots.forEach((spot, i) => {
      el.querySelectorAll<HTMLElement>(`[data-spot="${spot.target}"]`).forEach((target) => {
        target.dataset.spotN = String(i + 1);
        target.style.setProperty('--spot-i', String(i));
        marked.push(target);
      });
    });
    return () => marked.forEach((target) => delete target.dataset.spotN);
  }, [spots]);

  // Phones and tablets: the caption just below the pinned devices is the chosen one.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const media = window.matchMedia('(max-width: 1023px)');
    const stage = el.querySelector<HTMLElement>('.pl-spots-stage');
    const list = el.querySelector<HTMLElement>('.pl-spots-list');
    const items = [...el.querySelectorAll<HTMLElement>('.pl-spots-list > li')];
    let frame = 0;
    const pick = () => {
      frame = 0;
      if (!media.matches || !stage || !list) return;
      const line = stage.getBoundingClientRect().bottom;
      const box = list.getBoundingClientRect();
      if (box.top > window.innerHeight || box.bottom < line) return;
      const index = items.findIndex((item) => {
        const rect = item.getBoundingClientRect();
        return rect.top + rect.height / 2 > line;
      });
      if (index >= 0) setActive(index);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(pick);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [spots]);

  // Outline the chosen part; CSS brings its device forward (`:has([data-spot-active])`).
  useEffect(() => {
    const target = root.current?.querySelector<HTMLElement>(`[data-spot="${spots[active]?.target}"]`);
    if (!target) return;
    target.dataset.spotActive = '';
    return () => {
      delete target.dataset.spotActive;
    };
  }, [spots, active]);

  return (
    <div
      ref={root}
      className="pl-root pl-spots"
      lang={locale}
      onClick={(event) => {
        const target = (event.target as HTMLElement).closest<HTMLElement>('[data-spot-n]');
        if (target) setActive(Number(target.dataset.spotN) - 1);
      }}
    >
      <div className="pl-showcase-stack pl-spots-stage">{children}</div>
      <ol className="pl-spots-list" aria-label={label ? t(label, locale) : undefined}>
        {spots.map((spot, i) => (
          <li key={spot.target}>
            <button
              type="button"
              className="pl-spot"
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              onFocus={() => setActive(i)}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') setActive(i);
              }}
            >
              <span className={cx('pl-spot-n', 'code')} aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="pl-spot-text">
                <span className={ts('title', locale)}>{t(spot.title, locale)}</span>
                <span className={cx(ts('body-sm', locale), 'pl-spot-body')}>{t(spot.body, locale)}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
