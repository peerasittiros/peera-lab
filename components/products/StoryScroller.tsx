'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * ProductStory's one island. ≥1024 the frame is sticky and the steps scroll past it; the step crossing the middle of
 * the viewport becomes current, and so does the screenshot with the same `data-shot`. CSS does the cross-fade.
 * Below 1024, without IntersectionObserver, or before this runs, the first step and screenshot stay current.
 */
export function StoryScroller({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !('IntersectionObserver' in window)) return;
    const steps = Array.from(root.querySelectorAll<HTMLElement>('.pl-story-step'));
    const shots = Array.from(root.querySelectorAll<HTMLElement>('.pl-story-shot'));
    const select = (step: HTMLElement) => {
      for (const s of steps) s.classList.toggle('is-current', s === step);
      for (const shot of shots) shot.classList.toggle('is-current', shot.dataset.shot === step.dataset.shot);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) select(entry.target as HTMLElement);
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
