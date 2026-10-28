import type { Locale } from '@/lib/i18n';
import { MockIcon, type MockIconName } from './MockIcon';

/**
 * A designed Stockline screen for the website's device frames (not a screenshot): quick move in the sample
 * mini-mart, as the v2 app draws it. The laptop shows the two-pane layout (low-stock list and the move panel with
 * its label strip); the phone shows the large item cards and the bottom tabs. Drawn in device units so it keeps its
 * proportions at any frame size. Colours are Stockline's own (mocks.css); the text is the app's, in the page's
 * language. `data-spot` marks the parts the home page calls out (STOCKLINE_SPOTS, DeviceSpots).
 */

export const STOCKLINE_SPOTS = ['low', 'move', 'scan', 'tabs'];

const COPY = {
  th: {
    shop: 'มินิมาร์ทหน้าหมู่บ้าน',
    sample: 'ร้านตัวอย่าง',
    sampleData: 'ข้อมูลตัวอย่าง',
    title: 'รับ-เบิกด่วน',
    subtitle: 'รับเข้า เบิกออก หรือปรับยอด เสร็จในสามแตะ',
    search: 'ชื่อหรือรหัส',
    scan: 'สแกน',
    low: 'ใกล้หมด',
    out: 'หมด',
    left: (qty: number, unit: string) => `คงเหลือ ${qty} ${unit}`,
    types: ['รับเข้า', 'เบิกออก', 'ปรับยอด'],
    quantity: 'จำนวน',
    save: 'บันทึกรับเข้า',
    nav: ['รับ-เบิกด่วน', 'ภาพรวม', 'สินค้า', 'ต้องสั่ง', 'ใบสั่งซื้อ', 'นับสต็อก', 'ประวัติ'],
    tabs: ['รับ-เบิก', 'สินค้า', 'ต้องสั่ง', 'ประวัติ', 'เพิ่มเติม'],
  },
  en: {
    shop: 'Village Mini-mart',
    sample: 'Sample shop',
    sampleData: 'Sample data',
    title: 'Quick move',
    subtitle: 'Stock in, stock out or adjust in three taps',
    search: 'Name or code',
    scan: 'Scan',
    low: 'Running low',
    out: 'Out',
    left: (qty: number, unit: string) => `${qty} ${unit} on hand`,
    types: ['In', 'Out', 'Adjust'],
    quantity: 'Quantity',
    save: 'Save In',
    nav: ['Quick move', 'Overview', 'Items', 'To order', 'Orders', 'Counts', 'History'],
    tabs: ['Move', 'Items', 'Order', 'History', 'More'],
  },
} as const;

type Item = {
  th: string;
  en: string;
  code: string;
  qty: number;
  unit: [string, string];
  out: boolean;
  icon: MockIconName;
  packs: number[];
};

const ITEMS: Item[] = [
  { th: 'น้ำดื่ม 600 มล.', en: 'Drinking water 600 ml', code: 'STK-0001', qty: 0, unit: ['ขวด', 'bottles'], out: true, icon: 'bottle', packs: [12, 24] },
  { th: 'น้ำอัดลมรสโคล่า 325 มล.', en: 'Cola 325 ml can', code: 'STK-0004', qty: 0, unit: ['กระป๋อง', 'cans'], out: true, icon: 'can', packs: [6, 24] },
  { th: 'กาแฟสำเร็จรูป 3in1', en: 'Instant coffee 3-in-1', code: 'STK-0043', qty: 43, unit: ['ซอง', 'sachets'], out: false, icon: 'cup', packs: [27] },
  { th: 'ไข่ไก่เบอร์ 2', en: 'Chicken eggs, size 2', code: 'STK-0051', qty: 72, unit: ['ฟอง', 'eggs'], out: false, icon: 'egg', packs: [30] },
  { th: 'เครื่องดื่มชูกำลัง 150 มล.', en: 'Energy drink 150 ml', code: 'STK-0013', qty: 36, unit: ['ขวด', 'bottles'], out: false, icon: 'bolt', packs: [10, 50] },
];

const NAV_ICONS: MockIconName[] = ['swap', 'grid', 'box', 'cart', 'doc', 'check', 'clock'];
const TAB_ICONS: MockIconName[] = ['swap', 'box', 'cart', 'clock', 'dots'];

const name = (item: Item, locale: Locale) => (locale === 'th' ? item.th : item.en);
const unit = (item: Item, locale: Locale) => item.unit[locale === 'th' ? 0 : 1];

function Status({ item, locale }: { item: Item; locale: Locale }) {
  const c = COPY[locale];
  return (
    <span className={item.out ? 'mk-chip mk-chip-danger' : 'mk-chip mk-chip-warning'}>
      <MockIcon name={item.out ? 'alert' : 'warn'} />
      {item.out ? c.out : c.low}
    </span>
  );
}

function Rows({ locale, count, spot }: { locale: Locale; count: number; spot?: string }) {
  return (
    <ul className="mk-rows" data-spot={spot}>
      {ITEMS.slice(0, count).map((item, i) => (
        <li key={item.code} className={i === 0 ? 'mk-row is-on' : 'mk-row'}>
          <span className="mk-thumb">
            <MockIcon name={item.icon} />
          </span>
          <span className="mk-row-text">
            <b>{name(item, locale)}</b>
            <code>{item.code}</code>
          </span>
          <span className="mk-row-qty">
            <b className="mk-num">
              {item.qty} {unit(item, locale)}
            </b>
            <Status item={item} locale={locale} />
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

/** The app bar: name, the sample-data chip, the language switch. */
function AppBar({ locale, menu }: { locale: Locale; menu: boolean }) {
  const c = COPY[locale];
  return (
    <div className="mk-top">
      <span className="mk-sl-brand">
        <b>Stockline</b>
        <span className="mk-sl-tag">{c.sampleData}</span>
      </span>
      <span className="mk-sl-bar-end">
        <span className={locale === 'th' ? 'is-on' : undefined}>TH</span>
        <span className={locale === 'en' ? 'is-on' : undefined}>EN</span>
        {menu ? <MockIcon name="menu" /> : <MockIcon name="reset" />}
      </span>
    </div>
  );
}

function Search({ locale, label, spot }: { locale: Locale; label: boolean; spot?: string }) {
  const c = COPY[locale];
  return (
    <div className="mk-searchrow">
      <span className="mk-search">
        <MockIcon name="search" />
        {c.search}
      </span>
      <span className="mk-scan" data-spot={spot}>
        <MockIcon name="scan" />
        {label ? c.scan : null}
      </span>
    </div>
  );
}

/** The move panel beside the list (laptop): the picked item with the label strip, then the In form. */
function Panel({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const item = ITEMS[0];
  return (
    <section className="mk-sl-panel" data-spot="move">
      <span className="mk-sl-strip" />
      <div className="mk-sl-head">
        <span className="mk-thumb">
          <MockIcon name={item.icon} />
        </span>
        <span className="mk-row-text">
          <b>{name(item, locale)}</b>
          <code>
            {item.code} · {c.left(item.qty, unit(item, locale))}
          </code>
        </span>
        <span className="mk-sl-big">
          <b className="mk-num">{item.qty}</b>
          <small>{unit(item, locale)}</small>
        </span>
      </div>
      <Status item={item} locale={locale} />
      <div className="mk-sl-seg">
        {c.types.map((type, i) => (
          <span key={type} className={i === 0 ? 'is-on' : undefined}>
            {type}
          </span>
        ))}
      </div>
      <small className="mk-sl-field">{c.quantity}</small>
      <div className="mk-sl-stepper">
        <span>
          <MockIcon name="minus" />
        </span>
        <b className="mk-num">1</b>
        <span>
          <MockIcon name="plus" />
        </span>
      </div>
      <div className="mk-sl-chips">
        {[1, ...item.packs].map((step) => (
          <span key={step} className="mk-num">
            +{step}
          </span>
        ))}
      </div>
      <span className="mk-sl-save">{c.save}</span>
    </section>
  );
}

export function StocklineMock({ locale, device }: { locale: Locale; device: 'desktop' | 'phone' }) {
  const c = COPY[locale];
  if (device === 'phone') {
    return (
      <div className="mk mk-stockline mk-phone" lang={locale}>
        <div className="mk-status" />
        <AppBar locale={locale} menu />
        <div className="mk-main">
          <Shop locale={locale} />
          <h3>{c.title}</h3>
          <p className="mk-sub">{c.subtitle}</p>
          <Search locale={locale} label spot="scan" />
          <p className="mk-label">{c.low}</p>
          <Rows locale={locale} count={4} />
        </div>
        <div className="mk-tabs" data-spot="tabs">
          {c.tabs.map((label, i) => (
            <span key={label} className={i === 0 ? 'is-on' : undefined}>
              <MockIcon name={TAB_ICONS[i]} />
              {label}
            </span>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="mk mk-stockline mk-desktop" lang={locale}>
      <AppBar locale={locale} menu={false} />
      <div className="mk-body">
        <div className="mk-side">
          <span className="mk-sl-side-shop">
            <Shop locale={locale} />
          </span>
          {c.nav.map((label, i) => (
            <span key={label} className={i === 0 ? 'is-on' : undefined}>
              <MockIcon name={NAV_ICONS[i]} />
              {label}
            </span>
          ))}
        </div>
        <div className="mk-main">
          <h3>{c.title}</h3>
          <p className="mk-sub">{c.subtitle}</p>
          <div className="mk-sl-panes">
            <div className="mk-sl-list">
              <Search locale={locale} label />
              <p className="mk-label">{c.low}</p>
              <Rows locale={locale} count={5} spot="low" />
            </div>
            <Panel locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}
