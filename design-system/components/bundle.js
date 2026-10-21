/* @ds-bundle: {"format":4,"namespace":"PeeraLab","components":[{"name":"Button"},{"name":"LangSwitch"},{"name":"SiteNav"},{"name":"Hero"},{"name":"SectionHeader"},{"name":"StatusBadge"},{"name":"TechTag"},{"name":"BrowserFrame"},{"name":"AppSkeleton"},{"name":"ProductCard"},{"name":"ProductGrid"},{"name":"FeaturedProduct"},{"name":"SpecList"},{"name":"WorkRow"},{"name":"ContactBlock"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;

  /* ---------- helpers ---------- */
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  /* Localized value: a string, or {en, th}. Falls back to en. */
  function t(v, l) { if (v == null) return ''; if (typeof v === 'string' || typeof v === 'number') return v; return v[l] != null ? v[l] : (v.en != null ? v.en : ''); }
  /* Type-style class for a locale: "display-xl" -> "display-xl-th" in Thai. */
  function ts(name, l) { return l === 'th' && name !== 'label' && name !== 'code' ? name + '-th' : (l === 'th' && name === 'label' ? 'label-th' : name); }
  /* Phrase markers: "สร้างซอฟต์แวร์|ที่แก้ปัญหาจริง" -> nowrap phrases with <wbr> between. */
  function ph(s) {
    if (typeof s !== 'string' || s.indexOf('|') < 0) return s;
    var parts = s.split('|'), out = [];
    parts.forEach(function (p, i) { if (i) out.push(h('wbr', { key: 'w' + i })); out.push(h('span', { key: 'p' + i, className: 'pl-ph' }, p)); });
    return out;
  }
  function tx(v, l) { return ph(t(v, l)); }
  function omit(o, keys) { var r = {}; for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k) && keys.indexOf(k) < 0) r[k] = o[k]; return r; }
  function pad(n) { n = String(n); return n.length < 2 ? '0' + n : n; }

  var UI = {
    featured: { en: 'Featured product', th: 'ผลิตภัณฑ์เด่น' },
    problem: { en: 'Problem', th: 'ปัญหา' },
    value: { en: 'Value', th: 'คุณค่า' },
    stack: { en: 'Stack', th: 'เทคโนโลยี' },
    status: { en: 'Status', th: 'สถานะ' },
    explore: { en: 'Explore product', th: 'ดูผลิตภัณฑ์' },
    demo: { en: 'Open live demo', th: 'ลองเดโม' },
    email: { en: 'Email', th: 'อีเมล' },
    phone: { en: 'Phone', th: 'โทรศัพท์' },
    menuOpen: { en: 'Open menu', th: 'เปิดเมนู' },
    menuClose: { en: 'Close menu', th: 'ปิดเมนู' },
    mainNav: { en: 'Main', th: 'เมนูหลัก' }
  };

  var STATUS = {
    'concept': { en: 'Concept', th: 'แนวคิด' },
    'prototype': { en: 'Prototype', th: 'ต้นแบบ' },
    'in-development': { en: 'In development', th: 'กำลังพัฒนา' },
    'live-demo': { en: 'Live demo', th: 'มีเดโมให้ลอง' },
    'live': { en: 'Live', th: 'ใช้งานจริง' },
    'coming-soon': { en: 'Coming soon', th: 'เร็ว ๆ นี้' },
    'archived': { en: 'Archived', th: 'เก็บถาวร' }
  };

  var NAV = [
    { key: 'products', en: 'Products', th: 'ผลิตภัณฑ์', href: '#products' },
    { key: 'work', en: 'Work', th: 'ผลงาน', href: '#work' },
    { key: 'about', en: 'About', th: 'เกี่ยวกับ', href: '#about' },
    { key: 'contact', en: 'Contact', th: 'ติดต่อ', href: '#contact' }
  ];

  function Arrow(p) {
    return h('svg', { className: 'pl-arrow', width: 16, height: 16, viewBox: '0 0 16 16', 'aria-hidden': 'true', focusable: 'false' },
      h('path', { d: p && p.diag ? 'M4.5 11.5l7-7M5.5 4.5h6v6' : 'M2.5 8h10M8.5 4l4 4-4 4', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'square' }));
  }

  /* ---------- Button ---------- */
  function Button(p) {
    var variant = p.variant || 'primary', size = p.size || 'md';
    var rest = omit(p, ['variant', 'size', 'arrow', 'children', 'className', 'href', 'external']);
    var cls = cx('pl-btn', 'pl-btn-' + variant, size !== 'md' && 'pl-btn-' + size, p.className);
    var kids = [h('span', { key: 'l' }, p.children), p.arrow ? h(Arrow, { key: 'a', diag: !!p.external }) : null];
    if (p.href) return h('a', Object.assign({ href: p.href, className: cls }, p.external ? { target: '_blank', rel: 'noopener' } : null, rest), kids);
    return h('button', Object.assign({ type: 'button', className: cls }, rest), kids);
  }

  /* ---------- LangSwitch ---------- */
  function LangSwitch(p) {
    var locale = p.locale || 'en';
    var opts = [['th', 'TH', 'ภาษาไทย'], ['en', 'EN', 'English']];
    return h('div', { className: cx('pl-root', 'pl-lang'), role: 'group', 'aria-label': 'Language / ภาษา' },
      opts.map(function (o) {
        var cur = o[0] === locale;
        var props = { key: o[0], className: cx('pl-lang-opt', cur && 'is-current'), lang: o[0], hrefLang: o[0], 'aria-current': cur ? 'true' : undefined, 'aria-label': o[2] };
        if (p.hrefs && p.hrefs[o[0]]) props.href = p.hrefs[o[0]];
        else { props.href = '#'; props.onClick = function (e) { e.preventDefault(); if (p.onChange) p.onChange(o[0]); }; }
        return h('a', props, o[1]);
      }));
  }

  /* ---------- SiteNav ---------- */
  function SiteNav(p) {
    var l = p.locale || 'en';
    var st = React.useState(!!p.defaultOpen), open = st[0], setOpen = st[1];
    var items = p.items || NAV;
    return h('header', { className: cx('pl-root', 'pl-nav', open && 'is-open'), lang: l },
      h('div', { className: 'pl-nav-inner' },
        h('a', { className: 'pl-wordmark', href: p.homeHref || '#', 'aria-label': 'Peera Lab — home' },
          h('span', null, p.name || 'Peera'), h('span', { className: 'pl-wordmark-slash', 'aria-hidden': 'true' }, '/'), h('span', { className: 'pl-wordmark-lab' }, 'Lab')),
        h('nav', { className: 'pl-nav-links', 'aria-label': t(UI.mainNav, l), id: 'pl-nav-links' },
          items.map(function (it) {
            var on = p.active === it.key;
            return h('a', { key: it.key, href: it.href || '#', className: cx('pl-nav-link', on && 'is-active'), 'aria-current': on ? 'page' : undefined }, t(it, l));
          })),
        h('div', { className: 'pl-nav-end' },
          h(LangSwitch, { locale: l, onChange: p.onLocaleChange, hrefs: p.localeHrefs }),
          h('button', { type: 'button', className: 'pl-nav-toggle', 'aria-expanded': open ? 'true' : 'false', 'aria-controls': 'pl-nav-links', 'aria-label': t(open ? UI.menuClose : UI.menuOpen, l), onClick: function () { setOpen(!open); } },
            h('span', null), h('span', null)))));
  }

  /* ---------- StatusBadge ---------- */
  function StatusBadge(p) {
    var s = STATUS[p.status] ? p.status : 'concept', l = p.locale || 'en';
    return h('span', { className: cx('pl-status', 'pl-status-' + s, p.className), lang: l },
      h('span', { className: 'pl-status-dot', 'aria-hidden': 'true' }), t(p.label || STATUS[s], l));
  }

  /* ---------- TechTag ---------- */
  function TechTag(p) { return h('span', { className: 'pl-tag' }, p.children); }
  function TagList(items, max) {
    if (!items || !items.length) return null;
    var shown = max ? items.slice(0, max) : items, more = items.length - shown.length;
    return h('ul', { className: 'pl-tags' },
      shown.map(function (x) { return h('li', { key: x }, h(TechTag, null, x)); }),
      more > 0 ? h('li', { key: '+' }, h(TechTag, null, '+' + more)) : null);
  }

  /* ---------- Eyebrow ---------- */
  function Eyebrow(index, text, l) {
    return h('span', { className: cx('pl-eyebrow', ts('label', l)) },
      index != null ? h('span', { className: 'pl-index label' }, index) : null,
      index != null && text ? h('span', { 'aria-hidden': 'true' }, '—') : null,
      text ? h('span', null, t(text, l)) : null);
  }

  /* ---------- SectionHeader ---------- */
  function SectionHeader(p) {
    var l = p.locale || 'en', Tag = p.as || 'h2';
    return h('div', { className: cx('pl-root', 'pl-section-head'), lang: l },
      h('div', { className: 'pl-section-head-text' },
        Eyebrow(p.index, p.eyebrow, l),
        h(Tag, { className: cx(ts('headline-lg', l), 'pl-balance'), id: p.id }, tx(p.title, l)),
        p.lead ? h('p', { className: cx('pl-section-head-lead', ts('body', l), 'pl-pretty') }, t(p.lead, l)) : null),
      p.action ? h(Button, { variant: 'ghost', href: p.action.href, arrow: true }, t(p.action.label, l)) : null);
  }

  /* ---------- BrowserFrame ---------- */
  function BrowserFrame(p) {
    return h('figure', { className: cx('pl-root', 'pl-frame', p.size === 'lg' && 'pl-frame-lg', p.className), style: { margin: 0 } },
      h('div', { className: 'pl-frame-bar', 'aria-hidden': 'true' },
        h('span', { className: 'pl-frame-url' }, p.url || 'peera.dev'),
        p.tag ? h('span', { className: 'pl-frame-tag' }, p.tag) : null),
      h('div', { className: 'pl-frame-body', style: p.aspect ? { aspectRatio: p.aspect } : null },
        p.src ? h('img', { src: p.src, alt: p.alt || '', loading: 'lazy', decoding: 'async' }) : p.children),
      p.caption ? h('figcaption', { className: 'pv-cap', style: { padding: '8px 12px', margin: 0, borderTop: '1px solid var(--line)' } }, p.caption) : null);
  }

  /* ---------- AppSkeleton ---------- */
  function rep(n, f) { var a = []; for (var i = 0; i < n; i++) a.push(f(i)); return a; }
  function AppSkeleton(p) {
    var kind = p.kind || 'table';
    var side = h('div', { className: 'pl-skel-side' }, rep(6, function (i) { return h('i', { key: i, className: i === (kind === 'board' ? 3 : kind === 'calendar' ? 2 : 1) ? 'on' : null, style: i ? { width: (55 + (i * 13) % 35) + '%' } : null }); }));
    var top = h('div', { className: 'pl-skel-top' }, h('b'), h('u'));
    var body;
    if (kind === 'calendar') {
      var ev = [[1, 1, 2, 'b'], [2, 2, 1, 't'], [3, 1, 1, 'b'], [4, 3, 2, 'a'], [1, 4, 1, 't'], [3, 3, 2, 't'], [5, 2, 2, 'b'], [2, 5, 2, 'b'], [5, 5, 1, 't']];
      body = h('div', { className: 'pl-skel-cal' }, ev.map(function (e, i) { return h('span', { key: i, className: e[3], style: { gridColumn: e[0], gridRow: e[1] + ' / span ' + e[2] } }); }));
    } else if (kind === 'board') {
      var counts = [3, 2, 3, 1];
      body = h('div', { className: 'pl-skel-board' }, counts.map(function (c, ci) {
        return h('div', { key: ci, className: 'pl-skel-col' }, h('i'), rep(c, function (k) { return h('div', { key: k, className: cx('pl-skel-card', ci === 1 && k === 0 && 'on') }, h('i'), h('i', { style: { width: (40 + k * 17) + '%' } })); }));
      }));
    } else if (kind === 'dashboard') {
      var bars = [38, 52, 44, 63, 58, 72, 66, 81, 74, 90];
      body = h(React.Fragment, null,
        h('div', { className: 'pl-skel-kpis' }, rep(3, function (i) { return h('div', { key: i, className: 'pl-skel-kpi' }, h('i'), h('b', { style: { width: (50 + i * 12) + '%' } })); })),
        h('div', { className: 'pl-skel-chart' }, bars.map(function (b, i) { return h('span', { key: i, className: i === bars.length - 1 ? 'on' : null, style: { height: b + '%' } }); })));
    } else {
      var tags = ['a', 'b', 'a', 'c', 'a', 'b'];
      body = h(React.Fragment, null,
        h('div', { className: 'pl-skel-kpis' }, rep(3, function (i) { return h('div', { key: i, className: 'pl-skel-kpi' }, h('i'), h('b', { style: { width: (48 + i * 14) + '%' } })); })),
        h('div', { className: 'pl-skel-rows' },
          h('div', { className: 'pl-skel-row head' }, h('i'), h('i'), h('i'), h('i')),
          rep(6, function (i) { return h('div', { key: i, className: cx('pl-skel-row', i === 2 && 'hl') }, h('i', { style: { width: (60 + (i * 17) % 35) + '%' } }), h('em', { className: tags[i] }), h('i', { style: { width: '55%' } }), h('i', { style: { width: '70%' } })); })));
    }
    return h('div', { className: 'pl-skel', role: 'img', 'aria-label': p.label || 'Product interface preview' }, side, h('div', { className: 'pl-skel-main' }, top, body));
  }

  /* ---------- ProductCard ---------- */
  function ProductCard(p) {
    var pr = p.product || {}, l = p.locale || 'en';
    var idx = p.index != null ? 'P-' + pad(p.index) : null;
    var href = p.href || pr.href || '#';
    return h('article', { className: cx('pl-root', 'pl-card'), lang: l },
      h('a', { className: 'pl-card-link', href: href },
        h('div', { className: 'pl-card-meta' }, Eyebrow(idx, pr.category, l), h(StatusBadge, { status: pr.status, locale: l })),
        h(BrowserFrame, { url: pr.url || (pr.slug ? pr.slug + '.peera.dev' : null), src: pr.thumbnail, alt: t(pr.thumbnailAlt, l) },
          pr.thumbnail ? null : h(AppSkeleton, { kind: pr.preview, label: t(pr.title, l) + ' — ' + (l === 'th' ? 'ภาพตัวอย่างหน้าจอ' : 'interface preview') })),
        h('div', { className: 'pl-card-body' },
          h('h3', { className: cx('pl-card-title', ts('headline-sm', l)) }, h('span', null, t(pr.title, l)), h(Arrow)),
          h('p', { className: cx('pl-card-tagline', ts('body-sm', l), 'pl-pretty') }, t(pr.tagline, l)),
          TagList(pr.technologies, 3))));
  }

  /* ---------- ProductGrid ---------- */
  function ProductGrid(p) {
    var l = p.locale || 'en', list = p.products || [], start = p.startIndex || 1;
    return h('div', { className: cx('pl-root', 'pl-grid') }, list.map(function (pr, i) { return h(ProductCard, { key: pr.slug || i, product: pr, locale: l, index: start + i, href: pr.href }); }));
  }

  /* ---------- SpecList ---------- */
  function SpecList(p) {
    var l = p.locale || 'en';
    return h('dl', { className: cx('pl-root', 'pl-spec'), lang: l }, (p.rows || []).map(function (r, i) {
      return h('div', { key: i, className: 'pl-spec-row' },
        h('dt', { className: ts('label', l) }, t(r.label, l)),
        h('dd', { className: ts('body-sm', l) }, r.node || t(r.value, l)));
    }));
  }

  /* ---------- FeaturedProduct ---------- */
  function FeaturedProduct(p) {
    var pr = p.product || {}, l = p.locale || 'en';
    var rows = [];
    if (pr.problem) rows.push({ label: UI.problem, value: pr.problem });
    if (pr.value) rows.push({ label: UI.value, value: pr.value });
    if (pr.technologies) rows.push({ label: UI.stack, node: TagList(pr.technologies) });
    var actions = p.actions || [
      { label: UI.explore, href: pr.href || '#', variant: 'primary' },
      pr.demoUrl ? { label: UI.demo, href: pr.demoUrl, variant: 'secondary', external: true } : null
    ];
    return h('section', { className: cx('pl-root', 'pl-featured'), lang: l, 'aria-labelledby': 'pl-feat-' + (pr.slug || 'x') },
      h('div', { className: 'pl-featured-info' },
        h('div', { className: 'pl-featured-head' }, Eyebrow(null, UI.featured, l), h(StatusBadge, { status: pr.status, locale: l })),
        h('h2', { className: cx('pl-featured-title', ts('display-lg', l)), id: 'pl-feat-' + (pr.slug || 'x') }, tx(pr.title, l)),
        h('p', { className: cx('pl-featured-tagline', ts('body-lg', l), 'pl-pretty') }, t(pr.tagline, l)),
        h(SpecList, { rows: rows, locale: l }),
        h('div', { className: 'pl-featured-actions' }, actions.filter(Boolean).map(function (a, i) {
          return h(Button, { key: i, variant: a.variant || 'secondary', href: a.href, arrow: true, external: a.external, size: 'lg' }, t(a.label, l));
        }))),
      h('div', { className: 'pl-featured-visual' },
        h(BrowserFrame, { size: 'lg', url: pr.url || (pr.slug ? pr.slug + '.peera.dev' : null), tag: t(STATUS[pr.status] || '', 'en'), src: pr.thumbnail, alt: t(pr.thumbnailAlt, l) },
          pr.thumbnail ? null : h(AppSkeleton, { kind: pr.preview, label: t(pr.title, l) }))));
  }

  /* ---------- Hero ---------- */
  function Hero(p) {
    var l = p.locale || 'en';
    var b = p.building;
    return h('section', { className: cx('pl-root', 'pl-hero'), lang: l },
      h('div', { className: 'pl-hero-meta' }, Eyebrow(p.index, p.eyebrow, l)),
      h('h1', { className: cx('pl-hero-title', ts('display-xl', l), 'pl-balance') }, tx(p.title, l)),
      p.lead ? h('p', { className: cx('pl-hero-lead', ts('body-lg', l), 'pl-pretty') }, t(p.lead, l)) : null,
      p.actions ? h('div', { className: 'pl-hero-actions' }, p.actions.map(function (a, i) {
        return h(Button, { key: i, variant: a.variant || (i ? 'secondary' : 'primary'), href: a.href, arrow: !i, size: 'lg' }, t(a.label, l));
      })) : null,
      b ? h('div', { className: 'pl-hero-building' },
        h('p', { className: cx(ts('label', l)), style: { color: 'var(--ink-muted)', marginBottom: '4px' } }, t(b.label, l)),
        h('ul', null, (b.items || []).map(function (it, i) {
          return h('li', { key: i }, h('a', { className: 'pl-hero-building-row', href: it.href || '#' },
            h('span', { className: 'pl-index label' }, 'P-' + pad(i + 1)),
            h('span', { className: cx('pl-hero-building-name', ts('ui', l)) }, t(it.name, l)),
            h(StatusBadge, { status: it.status, locale: l })));
        }))) : null);
  }

  /* ---------- WorkRow ---------- */
  function WorkRow(p) {
    var l = p.locale || 'en';
    var inner = [
      h('span', { key: 'y', className: cx('pl-work-year', 'label') }, t(p.year, l)),
      h('span', { key: 'm', className: 'pl-work-main' },
        h('span', { className: cx('pl-work-title', ts('headline-sm', l)) }, t(p.title, l)),
        h('span', { className: cx('pl-work-client', ts('body-sm', l)) }, t(p.client, l))),
      h('span', { key: 'r', className: cx('pl-work-role', ts('body-sm', l)) }, t(p.role, l)),
      p.href ? h(Arrow, { key: 'a', diag: !!p.external }) : h('span', { key: 'a' })
    ];
    return h('div', { className: cx('pl-root', 'pl-work'), lang: l },
      p.href ? h('a', Object.assign({ className: 'pl-work-link', href: p.href }, p.external ? { target: '_blank', rel: 'noopener' } : null), inner)
             : h('div', { className: 'pl-work-link' }, inner));
  }

  /* ---------- ContactBlock ---------- */
  function ContactBlock(p) {
    var l = p.locale || 'en';
    var phone = p.phone || '';
    var digits = phone.replace(/[^0-9]/g, '');
    var tel = digits.charAt(0) === '0' ? '+66' + digits.slice(1) : '+' + digits;
    var phoneShown = l === 'th' ? (p.phoneDisplay && p.phoneDisplay.th) || phone : (p.phoneDisplay && p.phoneDisplay.en) || phone;
    return h('section', { className: cx('pl-root', 'pl-contact', 'pl-inverse'), lang: l, id: p.id || 'contact', 'aria-labelledby': 'pl-contact-title' },
      h('div', { className: 'pl-contact-inner' },
        Eyebrow(p.index, p.eyebrow || { en: 'Contact', th: 'ติดต่อ' }, l),
        h('h2', { className: cx('pl-contact-title', ts('headline-lg', l), 'pl-balance'), id: 'pl-contact-title' }, tx(p.title, l)),
        p.lead ? h('p', { className: cx('pl-contact-lead', ts('body-lg', l), 'pl-pretty') }, t(p.lead, l)) : null,
        h('div', { className: 'pl-contact-lines' },
          p.email ? h('a', { className: 'pl-contact-line', href: 'mailto:' + p.email },
            h('span', { className: cx('pl-k', ts('label', l)) }, t(UI.email, l)), h('span', { className: 'pl-v' }, p.email)) : null,
          phone ? h('a', { className: 'pl-contact-line', href: 'tel:' + tel },
            h('span', { className: cx('pl-k', ts('label', l)) }, t(UI.phone, l)), h('span', { className: 'pl-v' }, phoneShown)) : null),
        p.actions ? h('div', { className: 'pl-contact-actions' }, p.actions.map(function (a, i) {
          return h(Button, { key: i, variant: i ? 'inverse-secondary' : 'inverse', href: a.href, arrow: !i, external: a.external }, t(a.label, l));
        })) : null));
  }

  window.PeeraLab = Object.assign(window.PeeraLab || {}, {
    Button: Button, LangSwitch: LangSwitch, SiteNav: SiteNav, Hero: Hero, SectionHeader: SectionHeader,
    StatusBadge: StatusBadge, TechTag: TechTag, BrowserFrame: BrowserFrame, AppSkeleton: AppSkeleton,
    ProductCard: ProductCard, ProductGrid: ProductGrid, FeaturedProduct: FeaturedProduct, SpecList: SpecList,
    WorkRow: WorkRow, ContactBlock: ContactBlock,
    STATUS: STATUS, NAV: NAV, t: t
  });
})();
