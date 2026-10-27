'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Fits a designed mock screen into a device frame. The mock is laid out at a fixed design width (`designWidth` px,
 * 2 px per device unit) and scaled down as a whole. Drawn directly at frame size its text would be 3–5 px, and phone
 * browsers raise that to their minimum font size (in-app browsers more so), so the text outgrew its boxes. Laid out
 * large, the text is about 12 px before the scale, above any minimum, and the screen keeps its proportions.
 * Hidden until measured, so it never shows at the wrong size.
 */
export function MockScreen({ designWidth, children }: { designWidth: number; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ scale: number; height: number } | null>(null);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const scale = el.clientWidth / designWidth;
      if (scale > 0) setFit({ scale, height: el.clientHeight / scale });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [designWidth]);

  return (
    <div ref={box} className="pl-mock-fit">
      <div
        className="pl-mock-stage"
        style={{
          width: designWidth,
          height: fit?.height ?? 0,
          transform: `scale(${fit?.scale ?? 0})`,
          visibility: fit ? undefined : 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
}
