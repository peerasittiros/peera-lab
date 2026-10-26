import type { Locale } from '@/lib/i18n';
import { MockIcon, type MockIconName } from './MockIcon';

/**
 * A designed Stockline screen for the website's device frames (not a screenshot): the quick-move screen of the
 * sample mini-mart, drawn in em so it keeps its proportions at any frame size. Colours are Stockline's own
 * (mocks.css); the text is the app's, in the page's language.
 */

const COPY = {
  th: {
    shop: 'มินิมาร์ทหน้าหมู่บ้าน',
    sample: 'ร้านตัวอย่าง',
    title: 'รับ-เบิกด่วน',
    subtitle: 'รับเข้า เบิกออก หรือปรับยอด เสร็จในสามแตะ',
    search: 'ชื่อหรือรหัสสินค้า',
    scan: 'สแกน',
    low: 'ใกล้หมด',
    out: 'หมด',
    nav: ['รับ-เบิกด่วน', 'ภาพรวม', 'สินค้า', 'ต้องสั่ง', 'ใบสั่งซื้อ', 'นับสต็อก', 'ประวัติ'],
    tabs: ['รับ-เบิก', 'สินค้า', 'ต้องสั่ง', 'ประวัติ', 'เพิ่มเติม'],
  },
  en: {
    shop: 'Village Mini-mart',
    sample: 'Sample shop',
    title: 'Quick move',
    subtitle: 'Stock in, stock out or adjust in three taps',
    search: 'Item name or code',
    scan: 'Scan',
    low: 'Running low',
    out: 'Out',
    nav: ['Quick move', 'Overview', 'Items', 'To order', 'Orders', 'Counts', 'History'],
    tabs: ['Move', 'Items', 'Order', 'History', 'More'],
  },
} as const;

const ITEMS: { th: string; en: string; code: string; qty: number; unit: [string, string]; out: boolean; icon: MockIconName }[] = [
  { th: 'น้ำดื่ม 600 มล.', en: 'Drinking water 600 ml', code: 'STK-0001', qty: 0, unit: ['ขวด', 'bottles'], out: true, icon: 'bottle' },
  { th: 'น้ำอัดลมรสโคล่า 325 มล.', en: 'Cola 325 ml can', code: 'STK-0004', qty: 0, unit: ['กระป๋อง', 'cans'], out: true, icon: 'can' },
  { th: 'กาแฟสำเร็จรูป 3in1', en: 'Instant coffee 3-in-1', code: 'STK-0043', qty: 43, unit: ['ซอง', 'sachets'], out: false, icon: 'cup' },
  { th: 'ไข่ไก่เบอร์ 2', en: 'Chicken eggs, size 2', code: 'STK-0051', qty: 72, unit: ['ฟอง', 'eggs'], out: false, icon: 'egg' },
  { th: 'เครื่องดื่มชูกำลัง 150 มล.', en: 'Energy drink 150 ml', code: 'STK-0013', qty: 36, unit: ['ขวด', 'bottles'], out: false, icon: 'bolt' },
];

const NAV_ICONS: MockIconName[] = ['swap', 'grid', 'box', 'cart', 'doc', 'check', 'clock'];
const TAB_ICONS: MockIconName[] = ['swap', 'box', 'cart', 'clock', 'dots'];

function Rows({ locale, count }: { locale: Locale; count: number }) {
  const c = COPY[locale];
  return (
    <ul className="mk-rows">
      {ITEMS.slice(0, count).map((item) => (
        <li key={item.code} className="mk-row">
          <span className="mk-thumb">
            <MockIcon name={item.icon} />
          </span>
          <span className="mk-row-text">
            <b>{locale === 'th' ? item.th : item.en}</b>
            <code>{item.code}</code>
          </span>
          <span className="mk-row-qty">
            <b>
              {item.qty} {item.unit[locale === 'th' ? 0 : 1]}
            </b>
            <span className={item.out ? 'mk-chip mk-chip-danger' : 'mk-chip mk-chip-warning'}>
              <MockIcon name={item.out ? 'alert' : 'warn'} />
              {item.out ? c.out : c.low}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function Shop({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  return (
    <span className="mk-shop">
      <span className="mk-logo">
        <MockIcon name="basket" />
      </span>
      <span className="mk-shop-text">
        <b>{c.shop}</b>
        <small>{c.sample}</small>
      </span>
    </span>
  );
}

export function StocklineMock({ locale, device }: { locale: Locale; device: 'desktop' | 'phone' }) {
  const c = COPY[locale];
  if (device === 'phone') {
    return (
      <div className="mk mk-stockline mk-phone" lang={locale}>
        <div className="mk-status" />
        <div className="mk-top">
          <Shop locale={locale} />
        </div>
        <div className="mk-main">
          <h3>{c.title}</h3>
          <div className="mk-searchrow">
            <span className="mk-search">
              <MockIcon name="search" />
              {c.search}
            </span>
            <span className="mk-scan">
              <MockIcon name="scan" />
            </span>
          </div>
          <p className="mk-label">{c.low}</p>
          <Rows locale={locale} count={4} />
        </div>
        <nav className="mk-tabs">
          {c.tabs.map((label, i) => (
            <span key={label} className={i === 0 ? 'is-on' : undefined}>
              <MockIcon name={TAB_ICONS[i]} />
              {label}
            </span>
          ))}
        </nav>
      </div>
    );
  }
  return (
    <div className="mk mk-stockline mk-desktop" lang={locale}>
      <div className="mk-top">
        <Shop locale={locale} />
        <span className="mk-app">Stockline</span>
      </div>
      <div className="mk-body">
        <nav className="mk-side">
          {c.nav.map((label, i) => (
            <span key={label} className={i === 0 ? 'is-on' : undefined}>
              <MockIcon name={NAV_ICONS[i]} />
              {label}
            </span>
          ))}
        </nav>
        <div className="mk-main">
          <h3>{c.title}</h3>
          <p className="mk-sub">{c.subtitle}</p>
          <div className="mk-searchrow">
            <span className="mk-search">
              <MockIcon name="search" />
              {c.search}
            </span>
            <span className="mk-scan">
              <MockIcon name="scan" />
              {c.scan}
            </span>
          </div>
          <p className="mk-label">{c.low}</p>
          <Rows locale={locale} count={5} />
        </div>
      </div>
    </div>
  );
}
