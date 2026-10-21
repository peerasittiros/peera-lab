'use client';

import { useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Fades `.pl-reveal` sections up once as they enter the viewport (README › Motion). Mounted once in the locale
 * layout; it rescans after every navigation.
 * - Hiding is opt-in: CSS hides `.pl-reveal` only under `html[data-reveal]`, which this sets. Without JS, or under
 *   prefers-reduced-motion, everything stays visible.
 * - Sections already on screen when a page renders are shown at once, without the transition, so nothing above
 *   the fold blinks out and back in.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const root = document.documentElement;
    const pending = Array.from(document.querySelectorAll<HTMLElement>('.pl-reveal:not(.is-in)'));
    const below: HTMLElement[] = [];
    // Set the start state with transitions off: sections on screen show at once, the rest hide without fading out.
    for (const el of pending) {
      el.style.transition = 'none';
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in');
      else below.push(el);
    }
    root.dataset.reveal = '';
    void root.offsetHeight; // reading layout commits those styles before transitions come back
    const frame = requestAnimationFrame(() => pending.forEach((el) => el.style.removeProperty('transition')));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    below.forEach((el) => observer.observe(el));
    return () => {
      cancelAnimationFrame(frame);
      pending.forEach((el) => el.style.removeProperty('transition'));
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
