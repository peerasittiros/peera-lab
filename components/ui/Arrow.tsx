/** Arrow glyph for buttons and links. `diag` draws the ↗ used for external links. */
export function Arrow({ diag = false }: { diag?: boolean }) {
  return (
    <svg className="pl-arrow" width={16} height={16} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path
        d={diag ? 'M4.5 11.5l7-7M5.5 4.5h6v6' : 'M2.5 8h10M8.5 4l4 4-4 4'}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="square"
      />
    </svg>
  );
}
