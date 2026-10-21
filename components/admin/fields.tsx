// Form fields for the admin. Plain server components: values go in as defaults, Server Actions read FormData.
import type { Json, JsonObject } from '@/lib/admin/store';

type Pair = { en?: string; th?: string } | undefined;

export function TextField({
  label,
  name,
  value,
  hint,
  type = 'text',
  required,
  readOnly,
}: {
  label: string;
  name: string;
  value?: string | number;
  hint?: string;
  type?: string;
  required?: boolean;
  readOnly?: boolean;
}) {
  return (
    <label className="adm-field">
      <span className="adm-label">{label}</span>
      <input name={name} type={type} defaultValue={value ?? ''} required={required} readOnly={readOnly} />
      {hint ? <span className="adm-hint">{hint}</span> : null}
    </label>
  );
}

export function TextArea({ label, name, value, hint, rows = 6 }: { label: string; name: string; value?: string; hint?: string; rows?: number }) {
  return (
    <label className="adm-field">
      <span className="adm-label">{label}</span>
      <textarea name={name} defaultValue={value ?? ''} rows={rows} spellCheck={false} />
      {hint ? <span className="adm-hint">{hint}</span> : null}
    </label>
  );
}

/** One field in both languages, side by side (stacked on small screens). Names are `<name>.th` and `<name>.en`. */
export function PairField({ label, name, value, long }: { label: string; name: string; value?: Pair; long?: boolean }) {
  const input = (lang: 'th' | 'en') =>
    long ? (
      <textarea name={`${name}.${lang}`} defaultValue={value?.[lang] ?? ''} rows={3} lang={lang} />
    ) : (
      <input name={`${name}.${lang}`} defaultValue={value?.[lang] ?? ''} lang={lang} />
    );
  return (
    <fieldset className="adm-pair">
      <legend className="adm-label">{label}</legend>
      <label>
        <span className="adm-lang">TH</span>
        {input('th')}
      </label>
      <label>
        <span className="adm-lang">EN</span>
        {input('en')}
      </label>
    </fieldset>
  );
}

export function SelectField({ label, name, value, options }: { label: string; name: string; value?: string; options: string[] }) {
  return (
    <label className="adm-field">
      <span className="adm-label">{label}</span>
      <select name={name} defaultValue={value ?? options[0]}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CheckField({ label, name, checked, hint }: { label: string; name: string; checked?: boolean; hint?: string }) {
  return (
    <label className="adm-check">
      <input type="checkbox" name={name} defaultChecked={checked} />
      <span>{label}</span>
      {hint ? <span className="adm-hint">{hint}</span> : null}
    </label>
  );
}

function isPair(value: Json): value is { en: string; th: string } {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).every((key) => key === 'en' || key === 'th') &&
    typeof value.en === 'string'
  );
}

/** "contactTitle" → "contact title", "0" → "#1". */
function humanize(key: string): string {
  return /^\d+$/.test(key) ? `#${Number(key) + 1}` : key.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
}

/**
 * Every string in site.json as a field, following its shape. Names are `s.<dotted path>`.
 * Structure (nav keys, links) is shown but only text is edited: `key` and `href` stay read-only here.
 */
export function SiteFields({ value, path = [] }: { value: JsonObject; path?: string[] }) {
  return (
    <>
      {Object.entries(value).map(([key, child]) => {
        const at = [...path, key];
        const name = `s.${at.join('.')}`;
        const label = humanize(key);
        if (isPair(child)) {
          const long = (child.en?.length ?? 0) > 60 || (child.th?.length ?? 0) > 60;
          return <PairField key={name} label={label} name={name} value={child} long={long} />;
        }
        if (typeof child === 'string') {
          const locked = key === 'key' || key === 'href';
          return <TextField key={name} label={label} name={name} value={child} readOnly={locked} hint={locked ? 'แก้ไม่ได้ในหน้านี้' : undefined} />;
        }
        if (child !== null && typeof child === 'object') {
          const entries: JsonObject = Array.isArray(child) ? Object.fromEntries(child.map((v, i) => [String(i), v])) : child;
          return (
            <fieldset key={name} className="adm-group">
              <legend>{label}</legend>
              <SiteFields value={entries} path={at} />
            </fieldset>
          );
        }
        return null;
      })}
    </>
  );
}
