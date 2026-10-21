import type { ReactNode } from 'react';
import { UI, cx, pad } from '@/lib/design';
import { t, ts, type Locale, type Localized } from '@/lib/i18n';
import type { Product, ProductSection } from '@/lib/content';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Button } from '@/components/ui/Button';
import { TagList } from '@/components/ui/TechTag';
import { BrowserFrame } from './BrowserFrame';

type SectionType = ProductSection['type'];

const titles: Record<SectionType, Localized> = {
  overview: { en: 'Overview', th: 'ภาพรวม' },
  problem: { en: 'The problem', th: 'ปัญหา' },
  solution: { en: 'The solution', th: 'ทางแก้' },
  features: { en: 'Features', th: 'ความสามารถหลัก' },
  gallery: { en: 'Screens', th: 'หน้าจอ' },
  'how-it-works': { en: 'How it works', th: 'ทำงานอย่างไร' },
  architecture: { en: 'Architecture', th: 'สถาปัตยกรรม' },
  demo: { en: 'Try the demo', th: 'ลองใช้เดโม' },
  status: { en: 'Where it stands', th: 'ตอนนี้อยู่ตรงไหน' },
  roadmap: { en: 'What comes next', th: 'สิ่งที่จะทำต่อ' },
};

export interface ProductSectionsProps {
  product: Product;
  locale: Locale;
}

/**
 * The product page body: each content section in its stored order, opened by a SectionHeader (headline-md, h2)
 * Sections absent from content don't render, so this returns null when there are none.
 */
export function ProductSections({ product, locale }: ProductSectionsProps) {
  const sections = product.sections ?? [];
  if (sections.length === 0) return null;
  const title = t(product.title, locale);
  const url = product.url ?? `${product.slug}.peera.dev`;

  const paragraph = (body: Localized) => (
    <p className={cx(ts('body-lg', locale), 'pl-prose', 'pl-pretty')}>{t(body, locale)}</p>
  );

  const content = (section: ProductSection): ReactNode => {
    switch (section.type) {
      case 'overview':
      case 'problem':
      case 'solution':
      case 'status':
        return paragraph(section.body);
      case 'features':
        return (
          <ul className="pl-psec-features">
            {section.items.map((item, i) => (
              <li key={i}>
                <h3 className={ts('title', locale)}>{t(item.title, locale)}</h3>
                <p className={cx(ts('body', locale), 'pl-psec-muted', 'pl-pretty')}>{t(item.body, locale)}</p>
              </li>
            ))}
          </ul>
        );
      case 'how-it-works':
        return (
          <ol className="pl-psec-steps">
            {section.steps.map((step, i) => (
              <li key={i}>
                <span className="pl-index label" aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <div>
                  <h3 className={ts('title', locale)}>{t(step.title, locale)}</h3>
                  <p className={cx(ts('body', locale), 'pl-psec-muted', 'pl-pretty')}>{t(step.body, locale)}</p>
                </div>
              </li>
            ))}
          </ol>
        );
      case 'gallery':
        return (
          <div className="pl-psec-gallery">
            {section.screenshots.map((src) => {
              // content.ts guarantees every gallery path is in `screenshots`.
              const shot = product.screenshots?.find((s) => s.src === src);
              return (
                <BrowserFrame
                  key={src}
                  url={url}
                  src={src}
                  alt={shot ? t(shot.alt, locale) : ''}
                  aspect="16 / 10"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  caption={shot?.caption ? t(shot.caption, locale) : undefined}
                />
              );
            })}
          </div>
        );
      case 'architecture':
        return (
          <div className="pl-psec-arch">
            <BrowserFrame
              url={url}
              src={section.diagram}
              alt={locale === 'th' ? `แผนภาพสถาปัตยกรรมของ ${title}` : `${title} architecture diagram`}
              aspect="16 / 10"
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
            <div className="pl-psec-arch-text">
              {section.body ? paragraph(section.body) : null}
              <TagList items={section.stack} />
            </div>
          </div>
        );
      case 'demo':
        return (
          <div className="pl-psec-demo">
            {section.note ? paragraph(section.note) : null}
            <div>
              <Button variant="secondary" href={section.url} external arrow size="lg">
                {t(UI.demo, locale)}
              </Button>
            </div>
          </div>
        );
      case 'roadmap':
        return (
          <ul className="pl-psec-roadmap">
            {section.items.map((item, i) => (
              <li key={i} className={cx(ts('body-lg', locale), 'pl-pretty')}>
                {t(item, locale)}
              </li>
            ))}
          </ul>
        );
    }
  };

  return (
    <>
      {sections.map((section, i) => {
        const id = `pl-psec-${section.type}-${i}`;
        return (
          <section key={id} className="pl-root pl-psec pl-reveal" lang={locale} aria-labelledby={id}>
            <SectionHeader locale={locale} title={titles[section.type]} size="md" id={id} />
            {content(section)}
          </section>
        );
      })}
    </>
  );
}
