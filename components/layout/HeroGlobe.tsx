'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import type { VantaEffect } from 'vanta/dist/vanta.globe.min';
import { cx } from '@/lib/design';
import { globeConfig, type GlobeColor } from '@/lib/globe.config';

/** A colour from the config: a token name read from tokens.css (`#rrggbb`), or a number used as is. */
function resolve(color: GlobeColor): number {
  if (typeof color === 'number') return color;
  const value = getComputedStyle(document.documentElement).getPropertyValue(color).trim();
  return parseInt(value.replace('#', ''), 16);
}

/**
 * The hero's interactive globe: Vanta.js GLOBE (MIT, on three r134), set up in `lib/globe.config.ts`. It fills the
 * hero band behind the message and follows the mouse and touch.
 * - Loads only after the page is idle and while the globe is on screen; it is destroyed when it scrolls away, so
 *   it never runs off screen and never delays the h1 (the LCP).
 * - Rebuilds with the other theme's colours when `<html data-theme>` changes.
 * - Under prefers-reduced-motion it never loads, and CSS hides its box; on phones it is off unless the config
 *   turns it on (DESIGN.md › Motion).
 */
export function HeroGlobe() {
  const ref = useRef<HTMLDivElement>(null);
  const config = globeConfig;

  useEffect(() => {
    const el = ref.current;
    if (!el || !config.enabled || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let effect: VantaEffect | null = null;
    let visible = false;
    let loading = false;
    let cancelled = false;

    const stop = () => {
      effect?.destroy();
      effect = null;
    };
    const start = async () => {
      if (effect || loading || cancelled || !visible) return;
      loading = true;
      const [THREE, { default: GLOBE }] = await Promise.all([import('three'), import('vanta/dist/vanta.globe.min')]);
      loading = false;
      if (cancelled || !visible || effect) return;
      const colors = document.documentElement.dataset.theme === 'dark' ? config.dark : config.light;
      effect = GLOBE({
        el,
        THREE,
        mouseControls: config.mouseControls,
        touchControls: config.touchControls,
        gyroControls: config.gyroControls,
        minHeight: config.minHeight,
        minWidth: config.minWidth,
        scale: config.scale,
        scaleMobile: config.scaleMobile,
        size: config.size,
        color: resolve(colors.color),
        color2: resolve(colors.color2),
        backgroundColor: resolve(colors.background),
        backgroundAlpha: config.backgroundAlpha,
      });
    };

    const observer = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      if (visible) void start();
      else stop();
    });
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 600));
    idle(() => {
      if (!cancelled) observer.observe(el);
    });
    const themeWatch = new MutationObserver(() => {
      stop();
      void start();
    });
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      cancelled = true;
      observer.disconnect();
      themeWatch.disconnect();
      stop();
    };
  }, [config]);

  if (!config.enabled) return null;
  return (
    <div
      ref={ref}
      className={cx('pl-hero-globe', config.phones && 'on-phones')}
      style={{ '--globe-fade': config.fadeBehindText } as CSSProperties}
      aria-hidden="true"
    />
  );
}
