import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/design';
import { Arrow } from './Arrow';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'inverse' | 'inverse-secondary';
  size?: 'sm' | 'md' | 'lg';
  /** Renders an <a> instead of a <button>. */
  href?: string;
  /** Forward-motion arrow after the label. */
  arrow?: boolean;
  /** With href: opens in a new tab and uses the ↗ arrow. */
  external?: boolean;
  children?: ReactNode;
}

/**
 * Verb-first action. Primary (accent) at most once per view.
 * Width follows the label; never set a fixed width.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  href,
  arrow = false,
  external = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cx('pl-btn', `pl-btn-${variant}`, size !== 'md' && `pl-btn-${size}`, className);
  const content = (
    <>
      <span>{children}</span>
      {arrow ? <Arrow diag={external} /> : null}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener' } : null)}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  );
}
