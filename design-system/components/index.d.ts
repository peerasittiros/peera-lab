import type * as React from 'react';

/** 'en' | 'th'. Every component takes `locale` and sets `lang` on its root. */
export type Locale = 'en' | 'th';
/** A string, or one per locale. Thai display text may contain `|` phrase markers. */
export type Localized = string | { en: string; th: string };

export type ProductStatus = 'concept' | 'prototype' | 'in-development' | 'live-demo' | 'live' | 'coming-soon' | 'archived';
export type SkeletonKind = 'table' | 'calendar' | 'board' | 'dashboard';

/** The product content model (content/products/<slug>.json). */
export interface Product {
  slug: string;
  title: Localized;
  tagline: Localized;
  description?: Localized;
  category: Localized;
  status: ProductStatus;
  featured?: boolean;
  /** Lower first; sorts the Product Lab. */
  order?: number;
  problem?: Localized;
  value?: Localized;
  technologies: string[];
  /** Screenshot path; when absent an AppSkeleton of `preview` is drawn. */
  thumbnail?: string;
  thumbnailAlt?: Localized;
  preview?: SkeletonKind;
  url?: string;
  href?: string;
  demoUrl?: string;
  repositoryUrl?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'inverse' | 'inverse-secondary';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  arrow?: boolean;
  external?: boolean;
}
export declare function Button(props: ButtonProps): React.ReactElement;

export interface LangSwitchProps { locale: Locale; hrefs?: { en: string; th: string }; onChange?: (l: Locale) => void }
export declare function LangSwitch(props: LangSwitchProps): React.ReactElement;

export interface NavItem { key: string; en: string; th: string; href: string }
export interface SiteNavProps { locale: Locale; active?: string; items?: NavItem[]; homeHref?: string; name?: string; localeHrefs?: { en: string; th: string }; onLocaleChange?: (l: Locale) => void; defaultOpen?: boolean }
export declare function SiteNav(props: SiteNavProps): React.ReactElement;

export interface HeroProps {
  locale: Locale;
  index?: string;
  eyebrow?: Localized;
  title: Localized;
  lead?: Localized;
  actions?: { label: Localized; href: string; variant?: ButtonProps['variant'] }[];
  building?: { label: Localized; items: { name: Localized; status: ProductStatus; href?: string }[] };
}
export declare function Hero(props: HeroProps): React.ReactElement;

export interface SectionHeaderProps { locale: Locale; index?: string; eyebrow?: Localized; title: Localized; lead?: Localized; action?: { label: Localized; href: string }; as?: 'h1' | 'h2' | 'h3'; id?: string }
export declare function SectionHeader(props: SectionHeaderProps): React.ReactElement;

export interface StatusBadgeProps { status: ProductStatus; locale: Locale; label?: Localized; className?: string }
export declare function StatusBadge(props: StatusBadgeProps): React.ReactElement;

export interface TechTagProps { children: React.ReactNode }
export declare function TechTag(props: TechTagProps): React.ReactElement;

export interface BrowserFrameProps { url?: string; tag?: string; src?: string; alt?: string; aspect?: string; size?: 'md' | 'lg'; caption?: React.ReactNode; className?: string; children?: React.ReactNode }
export declare function BrowserFrame(props: BrowserFrameProps): React.ReactElement;

export interface AppSkeletonProps { kind?: SkeletonKind; label?: string }
export declare function AppSkeleton(props: AppSkeletonProps): React.ReactElement;

export interface ProductCardProps { product: Product; locale: Locale; index?: number; href?: string }
export declare function ProductCard(props: ProductCardProps): React.ReactElement;

export interface ProductGridProps { products: Product[]; locale: Locale; startIndex?: number }
export declare function ProductGrid(props: ProductGridProps): React.ReactElement;

export interface FeaturedProductProps { product: Product; locale: Locale; actions?: { label: Localized; href: string; variant?: ButtonProps['variant']; external?: boolean }[] }
export declare function FeaturedProduct(props: FeaturedProductProps): React.ReactElement;

export interface SpecListProps { locale: Locale; rows: { label: Localized; value?: Localized; node?: React.ReactNode }[] }
export declare function SpecList(props: SpecListProps): React.ReactElement;

export interface WorkRowProps { locale: Locale; year: Localized; title: Localized; client: Localized; role?: Localized; href?: string; external?: boolean }
export declare function WorkRow(props: WorkRowProps): React.ReactElement;

export interface ContactBlockProps { locale: Locale; index?: string; eyebrow?: Localized; title: Localized; lead?: Localized; email?: string; phone?: string; phoneDisplay?: { en: string; th: string }; actions?: { label: Localized; href: string; external?: boolean }[]; id?: string }
export declare function ContactBlock(props: ContactBlockProps): React.ReactElement;

declare global {
  interface Window {
    PeeraLab: {
      Button: typeof Button; LangSwitch: typeof LangSwitch; SiteNav: typeof SiteNav; Hero: typeof Hero;
      SectionHeader: typeof SectionHeader; StatusBadge: typeof StatusBadge; TechTag: typeof TechTag;
      BrowserFrame: typeof BrowserFrame; AppSkeleton: typeof AppSkeleton; ProductCard: typeof ProductCard;
      ProductGrid: typeof ProductGrid; FeaturedProduct: typeof FeaturedProduct; SpecList: typeof SpecList;
      WorkRow: typeof WorkRow; ContactBlock: typeof ContactBlock;
    };
  }
}
