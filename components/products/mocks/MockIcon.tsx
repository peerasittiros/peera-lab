/** Small line icons for the mock screens (24 × 24, stroke = currentColor). Drawn here so the site needs no icon set. */

const PATHS = {
  basket: 'M4 10h16l-1.6 9.2a2 2 0 0 1-2 1.8H7.6a2 2 0 0 1-2-1.8zM8 10l4-6 4 6M9 14v3M12 14v3M15 14v3',
  building: 'M5 21V4h10v17M15 9h4v12M8 8h1M11 8h1M8 12h1M11 12h1M8 16h1M11 16h1M3 21h18',
  bottle: 'M10 2h4v3l2 3v12a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V8l2-3zM8 12h8',
  can: 'M7 4h10v16H7zM7 7h10M7 17h10',
  cup: 'M5 8h12v5a6 6 0 0 1-12 0zM17 9h1.5a2.5 2.5 0 0 1 0 5H17M8 2v3M12 2v3',
  egg: 'M12 3c3.5 0 6 6 6 10a6 6 0 0 1-12 0c0-4 2.5-10 6-10z',
  bolt: 'M13 2 5 14h6l-1 8 8-12h-6z',
  swap: 'M7 7h13l-3-3M17 17H4l3 3',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  box: 'M4 7.5 12 3l8 4.5v9L12 21l-8-4.5zM4 7.5 12 12l8-4.5M12 12v9',
  cart: 'M3 4h2l2.4 11h10.2L20 7H6.2M9 20h.01M17 20h.01',
  doc: 'M6 3h9l3 3v15H6zM9 9h6M9 13h6M9 17h4',
  check: 'M6 3h12v18H6zM9 12l2 2 4-4',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  dots: 'M6 12h.01M12 12h.01M18 12h.01',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
  scan: 'M4 8V5h3M17 5h3v3M20 16v3h-3M7 19H4v-3M7 12h10',
  alert: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 8v5M12 16h.01',
  warn: 'M12 4 2.5 20h19zM12 10v4M12 17h.01',
  home: 'M4 11 12 4l8 7v9H4zM10 20v-5h4v5',
  meter: 'M5 18a8 8 0 1 1 14 0M12 14l4-5',
  bill: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h3',
  wrench: 'M15 4a5 5 0 0 0-5.5 6.5L4 16l4 4 5.5-5.5A5 5 0 0 0 20 9l-3 3-3-3 3-3a5 5 0 0 0-2-2z',
  megaphone: 'M4 10v4h3l7 5V5L7 10zM17 9a4 4 0 0 1 0 6',
  users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M16 3.5a4 4 0 0 1 0 7.5M22 21a7 7 0 0 0-4-6.3',
  card: 'M3 6h18v12H3zM3 10h18M7 15h4',
} as const;

export type MockIconName = keyof typeof PATHS;

export function MockIcon({ name }: { name: MockIconName }) {
  return (
    <svg className="mk-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={PATHS[name]} />
    </svg>
  );
}
