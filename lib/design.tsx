// Shared helpers for components. Ported from design-system/components/bundle.js (helpers and UI strings).
// t() and ts() live in lib/i18n.ts and are reused from there.
import { Fragment, type ReactNode } from 'react';
import { t, type Locale, type Localized } from '@/lib/i18n';

/** Joins the truthy class names. */
export function cx(...names: (string | false | null | undefined)[]): string {
  return names.filter(Boolean).join(' ');
}

/** Phrase markers: "สร้างซอฟต์แวร์|ที่แก้ปัญหาจริง" renders each phrase as a nowrap span, with a <wbr> between phrases. */
export function ph(text: string): ReactNode {
  if (text.indexOf('|') < 0) return text;
  return text.split('|').map((part, i) => (
    <Fragment key={i}>
      {i > 0 ? <wbr /> : null}
      <span className="pl-ph">{part}</span>
    </Fragment>
  ));
}

/** Localized text with phrase markers rendered. Use only in hero, section and product titles (CLAUDE.md rule). */
export function tx(value: Localized, locale: Locale): ReactNode {
  return ph(t(value, locale));
}

/** Two-digit padding for indexes: 3 becomes "03". */
export function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** Must match `productStatuses` in lib/content.ts (that file is server-only, so it can't be imported here). */
export type ProductStatus =
  | 'concept'
  | 'prototype'
  | 'in-development'
  | 'live-demo'
  | 'live'
  | 'coming-soon'
  | 'archived';

/** Built-in status labels (bundle.js STATUS). */
export const STATUS: Record<ProductStatus, Localized> = {
  concept: { en: 'Concept', th: 'แนวคิด' },
  prototype: { en: 'Prototype', th: 'ต้นแบบ' },
  'in-development': { en: 'In development', th: 'กำลังพัฒนา' },
  'live-demo': { en: 'Live demo', th: 'มีเดโมให้ลอง' },
  live: { en: 'Live', th: 'ใช้งานจริง' },
  'coming-soon': { en: 'Coming soon', th: 'เร็ว ๆ นี้' },
  archived: { en: 'Archived', th: 'เก็บถาวร' },
};

/** Built-in bilingual UI strings used by components. */
export const UI = {
  featured: { en: 'Featured product', th: 'ผลิตภัณฑ์เด่น' },
  problem: { en: 'Problem', th: 'ปัญหา' },
  value: { en: 'Value', th: 'คุณค่า' },
  stack: { en: 'Stack', th: 'เทคโนโลยี' },
  status: { en: 'Status', th: 'สถานะ' },
  explore: { en: 'Explore product', th: 'ดูผลิตภัณฑ์' },
  demo: { en: 'Open live demo', th: 'ลองเดโม' },
  demoPreview: { en: 'Demo preview', th: 'ดูตัวอย่างเดโม' },
  code: { en: 'View the code', th: 'ดูโค้ด' },
  email: { en: 'Email', th: 'อีเมล' },
  phone: { en: 'Phone', th: 'โทรศัพท์' },
  menuOpen: { en: 'Open menu', th: 'เปิดเมนู' },
  menuClose: { en: 'Close menu', th: 'ปิดเมนู' },
  mainNav: { en: 'Main', th: 'เมนูหลัก' },
  started: { en: 'Started', th: 'เริ่มเมื่อ' },
  previous: { en: 'Previous', th: 'ก่อนหน้า' },
  next: { en: 'Next', th: 'ถัดไป' },
} satisfies Record<string, Localized>;
