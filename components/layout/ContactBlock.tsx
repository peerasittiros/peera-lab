import { UI, cx, tx } from '@/lib/design';
import { formatPhone, t, ts, type Locale, type Localized } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';

export interface ContactBlockProps {
  locale: Locale;
  /** Section number, such as "05". */
  index?: string;
  eyebrow?: Localized;
  title: Localized;
  lead?: Localized;
  email: string;
  /** Digits as written locally, such as 0627532703. `tel:` becomes +66… */
  phone: string;
  /** How the phone reads in each locale. Falls back to `formatPhone` (062-753-2703 / +66 62 753 2703). */
  phoneDisplay?: { en?: string; th?: string };
  /** First action is the inverse primary; the rest are inverse-secondary. */
  actions?: { label: Localized; href: string; external?: boolean }[];
  /** Name, role and a short bio, shown above the email and phone. */
  person?: { name: Localized; role?: Localized; body?: Localized };
  /** The Contact page uses h1; elsewhere the band is a section (h2). */
  as?: 'h1' | 'h2';
  id?: string;
}

/** The single inverted band: one question, email and phone as large links, one primary action. */
export function ContactBlock({
  locale,
  index,
  eyebrow,
  title,
  lead,
  email,
  phone,
  phoneDisplay,
  actions,
  person,
  as: Heading = 'h2',
  id = 'contact',
}: ContactBlockProps) {
  const digits = phone.replace(/[^0-9]/g, '');
  // Thai local numbers start with 0; the tel: link uses the international form.
  const tel = digits.charAt(0) === '0' ? `+66${digits.slice(1)}` : `+${digits}`;
  const phoneShown = (locale === 'th' ? phoneDisplay?.th : phoneDisplay?.en) || formatPhone(phone, locale);
  const headingId = `${id}-title`;

  return (
    <section className={cx('pl-root', 'pl-contact', 'pl-inverse', 'pl-reveal')} lang={locale} id={id} aria-labelledby={headingId}>
      <div className="pl-contact-inner">
        <Eyebrow index={index} text={eyebrow} locale={locale} />
        <Heading className={cx('pl-contact-title', ts('headline-lg', locale), 'pl-balance')} id={headingId}>
          {tx(title, locale)}
        </Heading>
        {lead ? <p className={cx('pl-contact-lead', ts('body-lg', locale), 'pl-pretty')}>{t(lead, locale)}</p> : null}
        {person ? (
          <div className="pl-contact-person">
            <p className={cx('pl-contact-name', ts('headline-sm', locale))}>{t(person.name, locale)}</p>
            {person.role ? <p className={cx('pl-contact-role', ts('label', locale))}>{t(person.role, locale)}</p> : null}
            {person.body ? (
              <p className={cx('pl-contact-bio', ts('body', locale), 'pl-pretty')}>{t(person.body, locale)}</p>
            ) : null}
          </div>
        ) : null}
        <div className="pl-contact-lines">
          {email ? (
            <a className="pl-contact-line" href={`mailto:${email}`}>
              <span className={cx('pl-k', ts('label', locale))}>{t(UI.email, locale)}</span>
              <span className="pl-v">{email}</span>
            </a>
          ) : null}
          {phone ? (
            <a className="pl-contact-line" href={`tel:${tel}`}>
              <span className={cx('pl-k', ts('label', locale))}>{t(UI.phone, locale)}</span>
              <span className="pl-v">{phoneShown}</span>
            </a>
          ) : null}
        </div>
        {actions && actions.length ? (
          <div className="pl-contact-actions">
            {actions.map((a, i) => (
              <Button
                key={i}
                variant={i ? 'inverse-secondary' : 'inverse'}
                href={a.href}
                arrow={i === 0}
                external={a.external}
              >
                {t(a.label, locale)}
              </Button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
