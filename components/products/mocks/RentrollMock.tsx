import type { Locale } from '@/lib/i18n';
import { MockIcon, type MockIconName } from './MockIcon';

/**
 * A designed Rentroll screen for the website's device frames (not a screenshot): the owner's month overview on the
 * laptop and the tenant's bill on the phone, for a sample building. Drawn in em; Rentroll's colours (mocks.css).
 */

const COPY = {
  th: {
    building: 'อาคารสุขสบาย',
    sample: 'อาคารตัวอย่าง',
    title: 'ภาพรวมเดือนนี้',
    billed: 'ออกบิลแล้ว',
    paid: 'ชำระแล้ว',
    overdue: 'ค้างชำระ',
    floor: 'ชั้น 3',
    legend: ['ชำระแล้ว', 'รอชำระ', 'ค้างชำระ', 'ห้องว่าง'],
    nav: ['ภาพรวม', 'ห้องพัก', 'ผู้เช่า', 'จดมิเตอร์', 'ออกบิล', 'การชำระเงิน', 'แจ้งซ่อม'],
    room: 'ห้อง A-305',
    due: 'ยอดที่ต้องชำระ',
    dueDate: 'กำหนดชำระ 30 ต.ค. 2569',
    pay: 'ชำระเลย',
    quick: ['บิลของฉัน', 'แจ้งซ่อม', 'ประกาศ'],
    noticeTitle: 'ประกาศ',
    notice: 'วันเสาร์นี้ปิดน้ำช่วง 09:00–12:00 น. เพื่อซ่อมท่อหลัก',
    tabs: ['ภาพรวม', 'ห้องพัก', 'มิเตอร์', 'บิล', 'เพิ่มเติม'],
  },
  en: {
    building: 'Suksabai Apartments',
    sample: 'Sample building',
    title: 'This month',
    billed: 'Billed',
    paid: 'Paid',
    overdue: 'Overdue',
    floor: 'Floor 3',
    legend: ['Paid', 'Due', 'Overdue', 'Vacant'],
    nav: ['Overview', 'Rooms', 'Tenants', 'Meters', 'Bills', 'Payments', 'Repairs'],
    room: 'Room A-305',
    due: 'Amount due',
    dueDate: 'Due 30 Oct 2026',
    pay: 'Pay now',
    quick: ['My bills', 'Repair', 'Notices'],
    noticeTitle: 'Notice',
    notice: 'Water is off this Saturday, 09:00–12:00, to repair the main pipe.',
    tabs: ['Overview', 'Rooms', 'Meters', 'Bills', 'More'],
  },
} as const;

type RoomState = 'paid' | 'due' | 'overdue' | 'vacant';
const ROOMS: [string, RoomState][] = [
  ['A-301', 'paid'], ['A-302', 'paid'], ['A-303', 'due'], ['A-304', 'paid'], ['A-305', 'due'], ['A-306', 'overdue'],
  ['A-307', 'paid'], ['A-308', 'vacant'], ['A-309', 'paid'], ['A-310', 'paid'], ['A-311', 'due'], ['A-312', 'paid'],
];
const STATE_ICON: Record<RoomState, MockIconName> = { paid: 'check', due: 'clock', overdue: 'alert', vacant: 'home' };
const NAV_ICONS: MockIconName[] = ['grid', 'building', 'users', 'meter', 'bill', 'card', 'wrench'];
const TAB_ICONS: MockIconName[] = ['home', 'building', 'meter', 'bill', 'dots'];

function Building({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  return (
    <span className="mk-shop">
      <span className="mk-logo">
        <MockIcon name="building" />
      </span>
      <span className="mk-shop-text">
        <b>{c.building}</b>
        <small>{c.sample}</small>
      </span>
    </span>
  );
}

export function RentrollMock({ locale, device }: { locale: Locale; device: 'desktop' | 'phone' }) {
  const c = COPY[locale];
  if (device === 'phone') {
    return (
      <div className="mk mk-rentroll mk-phone" lang={locale}>
        <div className="mk-status" />
        <div className="mk-top">
          <Building locale={locale} />
        </div>
        <div className="mk-main">
          <div className="mk-bill">
            <span className="mk-muted">{c.room}</span>
            <span className="mk-muted">{c.due}</span>
            <b className="mk-money">฿7,216.00</b>
            <span className="mk-muted">{c.dueDate}</span>
            <span className="mk-pay">{c.pay}</span>
          </div>
          <div className="mk-quick">
            {c.quick.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <div className="mk-notice">
            <b>{c.noticeTitle}</b>
            <span>{c.notice}</span>
          </div>
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
    <div className="mk mk-rentroll mk-desktop" lang={locale}>
      <div className="mk-top">
        <Building locale={locale} />
        <span className="mk-app">Rentroll</span>
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
          <div className="mk-kpis">
            <span>
              <small>{c.billed}</small>
              <b>฿186,400</b>
            </span>
            <span>
              <small>{c.paid}</small>
              <b className="mk-good">฿142,950</b>
            </span>
            <span>
              <small>{c.overdue}</small>
              <b className="mk-bad">฿12,600</b>
            </span>
          </div>
          <p className="mk-label">{c.floor}</p>
          <div className="mk-floor">
            {ROOMS.map(([room, state]) => (
              <span key={room} className={`mk-roomtile is-${state}`}>
                <b>{room}</b>
                <MockIcon name={STATE_ICON[state]} />
              </span>
            ))}
          </div>
          <div className="mk-legend">
            {(['paid', 'due', 'overdue', 'vacant'] as RoomState[]).map((state, i) => (
              <span key={state} className={`is-${state}`}>
                <MockIcon name={STATE_ICON[state]} />
                {c.legend[i]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
