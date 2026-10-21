import { productStatuses } from '@/lib/content';
import type { Kind } from '@/lib/collections';
import type { JsonObject } from '@/lib/admin/store';
import { CheckField, PairField, SelectField, TextArea, TextField } from './fields';

type Pair = { en?: string; th?: string };

/** Every field of a product or project (same schema). Screenshots and sections are edited as JSON. */
export function ItemFields({ kind, item, isNew }: { kind: Kind; item: JsonObject; isNew: boolean }) {
  const pair = (key: string) => item[key] as Pair | undefined;
  const str = (key: string) => (typeof item[key] === 'string' ? (item[key] as string) : undefined);
  const json = (key: string) => (item[key] === undefined ? '' : JSON.stringify(item[key], null, 2));
  return (
    <>
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="isNew" value={isNew ? '1' : '0'} />

      <section className="adm-section">
        <h2>การแสดงผล</h2>
        <TextField
          label="slug (ส่วนท้ายของ URL)"
          name="slug"
          value={str('slug')}
          required
          readOnly={!isNew}
          hint={isNew ? 'a-z, 0-9 และ - เท่านั้น เปลี่ยนภายหลังไม่ได้' : 'เปลี่ยนไม่ได้'}
        />
        <CheckField label="ฉบับร่าง (ยังไม่แสดงบนเว็บ)" name="draft" checked={item.draft === true} />
        {kind === 'products' ? (
          <CheckField
            label="ผลิตภัณฑ์เด่นบนหน้าแรก"
            name="featured"
            checked={item.featured === true}
            hint="เลือกได้ตัวเดียว ติ๊กตัวนี้แล้วตัวเดิมจะถูกเอาออกเอง"
          />
        ) : null}
        <SelectField label="สถานะ" name="status" value={str('status')} options={[...productStatuses]} />
        <TextField label="ลำดับ (น้อยขึ้นก่อน)" name="order" type="number" value={item.order as number | undefined} />
        <TextField label="เริ่มเมื่อ" name="startedAt" type="date" value={str('startedAt')} />
      </section>

      <section className="adm-section">
        <h2>ข้อความ</h2>
        <PairField label="ชื่อ" name="title" value={pair('title')} />
        <PairField label="คำโปรย (หนึ่งประโยค)" name="tagline" value={pair('tagline')} long />
        <PairField label="หมวดหมู่" name="category" value={pair('category')} />
        <PairField label="ปัญหา" name="problem" value={pair('problem')} long />
        <PairField label="คุณค่า" name="value" value={pair('value')} long />
        <PairField label="คำอธิบาย (ไม่บังคับ)" name="description" value={pair('description')} long />
      </section>

      <section className="adm-section">
        <h2>เทคโนโลยีและภาพ</h2>
        <TextField
          label="เทคโนโลยี"
          name="technologies"
          value={Array.isArray(item.technologies) ? item.technologies.join(', ') : ''}
          hint="คั่นด้วยจุลภาค เช่น Next.js, TypeScript"
        />
        <SelectField
          label="ภาพตัวอย่างเมื่อยังไม่มีรูป"
          name="preview"
          value={str('preview')}
          options={['dashboard', 'table', 'calendar', 'board']}
        />
        <TextField label="รูปปก (path ใน public/)" name="thumbnail" value={str('thumbnail')} hint={`เช่น /images/${kind}/<slug>/thumb.webp`} />
        <PairField label="คำอธิบายรูปปก (alt)" name="thumbnailAlt" value={pair('thumbnailAlt')} />
      </section>

      <section className="adm-section">
        <h2>ลิงก์</h2>
        <TextField
          label="URL เดโมจริง (demoUrl)"
          name="demoUrl"
          type="url"
          value={str('demoUrl')}
          hint="ใส่เมื่อเดโมพร้อม หน้าเดโมจะฝังลิงก์นี้แทนภาพตัวอย่าง"
        />
        <TextField label="URL โค้ด (repositoryUrl)" name="repositoryUrl" type="url" value={str('repositoryUrl')} />
        <TextField label="URL ที่แสดงในกรอบ (url)" name="url" type="url" value={str('url')} />
      </section>

      <section className="adm-section">
        <h2>ขั้นสูง (JSON)</h2>
        <TextArea
          label="screenshots"
          name="screenshots"
          value={json('screenshots')}
          rows={5}
          hint={'[{ "src": "/images/...", "alt": { "en": "", "th": "" } }]'}
        />
        <TextArea
          label="sections (หัวข้อในหน้า)"
          name="sections"
          value={json('sections')}
          rows={14}
          hint="รูปแบบแต่ละประเภทดูใน content/README.md"
        />
      </section>
    </>
  );
}
