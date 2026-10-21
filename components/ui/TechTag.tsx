export interface TechTagProps {
  /** Spell the name as the project does (Next.js, PostgreSQL). */
  children: string;
}

/** Mono chip for one technology name in a product's stack. */
export function TechTag({ children }: TechTagProps) {
  return <span className="pl-tag">{children}</span>;
}

/**
 * List of tech chips. With `max`, shows that many plus a `+n` chip for the rest
 * (cards use 3; product pages show all). Returns null for an empty list.
 */
export function TagList({ items, max }: { items?: string[]; max?: number }) {
  if (!items || items.length === 0) return null;
  const shown = max ? items.slice(0, max) : items;
  const more = items.length - shown.length;
  return (
    <ul className="pl-tags">
      {shown.map((x) => (
        <li key={x}>
          <TechTag>{x}</TechTag>
        </li>
      ))}
      {more > 0 ? (
        <li key="+">
          <TechTag>{`+${more}`}</TechTag>
        </li>
      ) : null}
    </ul>
  );
}
