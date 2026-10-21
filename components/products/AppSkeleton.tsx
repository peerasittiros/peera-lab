import { cx } from '@/lib/design';

export type SkeletonKind = 'table' | 'calendar' | 'board' | 'dashboard';

export interface AppSkeletonProps {
  /** table (inventory, records), calendar (bookings), board (CRM), dashboard (analytics). */
  kind?: SkeletonKind;
  /** Accessible name. The skeleton itself carries no text. */
  label?: string;
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

/**
 * Token-colored wireframe of an app screen, so a product looks real before it has screenshots.
 * Carries no text on purpose. Replace with a real screenshot once one exists.
 */
export function AppSkeleton({ kind = 'table', label }: AppSkeletonProps) {
  const activeSide = kind === 'board' ? 3 : kind === 'calendar' ? 2 : 1;

  const side = (
    <div className="pl-skel-side">
      {range(6).map((i) => (
        <i
          key={i}
          className={i === activeSide ? 'on' : undefined}
          style={i ? { width: `${55 + ((i * 13) % 35)}%` } : undefined}
        />
      ))}
    </div>
  );

  const top = (
    <div className="pl-skel-top">
      <b />
      <u />
    </div>
  );

  let body;
  if (kind === 'calendar') {
    // [column, row, span, variant]
    const ev: [number, number, number, 'b' | 't' | 'a'][] = [
      [1, 1, 2, 'b'],
      [2, 2, 1, 't'],
      [3, 1, 1, 'b'],
      [4, 3, 2, 'a'],
      [1, 4, 1, 't'],
      [3, 3, 2, 't'],
      [5, 2, 2, 'b'],
      [2, 5, 2, 'b'],
      [5, 5, 1, 't'],
    ];
    body = (
      <div className="pl-skel-cal">
        {ev.map((e, i) => (
          <span
            key={i}
            className={e[3]}
            style={{ gridColumn: e[0], gridRow: `${e[1]} / span ${e[2]}` }}
          />
        ))}
      </div>
    );
  } else if (kind === 'board') {
    const counts = [3, 2, 3, 1];
    body = (
      <div className="pl-skel-board">
        {counts.map((c, ci) => (
          <div key={ci} className="pl-skel-col">
            <i />
            {range(c).map((k) => (
              <div key={k} className={cx('pl-skel-card', ci === 1 && k === 0 && 'on')}>
                <i />
                <i style={{ width: `${40 + k * 17}%` }} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  } else if (kind === 'dashboard') {
    const bars = [38, 52, 44, 63, 58, 72, 66, 81, 74, 90];
    body = (
      <>
        <div className="pl-skel-kpis">
          {range(3).map((i) => (
            <div key={i} className="pl-skel-kpi">
              <i />
              <b style={{ width: `${50 + i * 12}%` }} />
            </div>
          ))}
        </div>
        <div className="pl-skel-chart">
          {bars.map((b, i) => (
            <span key={i} className={i === bars.length - 1 ? 'on' : undefined} style={{ height: `${b}%` }} />
          ))}
        </div>
      </>
    );
  } else {
    const tags = ['a', 'b', 'a', 'c', 'a', 'b'] as const;
    body = (
      <>
        <div className="pl-skel-kpis">
          {range(3).map((i) => (
            <div key={i} className="pl-skel-kpi">
              <i />
              <b style={{ width: `${48 + i * 14}%` }} />
            </div>
          ))}
        </div>
        <div className="pl-skel-rows">
          <div className="pl-skel-row head">
            <i />
            <i />
            <i />
            <i />
          </div>
          {range(6).map((i) => (
            <div key={i} className={cx('pl-skel-row', i === 2 && 'hl')}>
              <i style={{ width: `${60 + ((i * 17) % 35)}%` }} />
              <em className={tags[i]} />
              <i style={{ width: '55%' }} />
              <i style={{ width: '70%' }} />
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="pl-skel" role="img" aria-label={label || 'Product interface preview'}>
      {side}
      <div className="pl-skel-main">
        {top}
        {body}
      </div>
    </div>
  );
}
