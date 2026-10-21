import { requireAdmin } from '@/lib/admin/auth';
import { readSite } from '@/lib/admin/store';
import { AdminForm } from '@/components/admin/AdminForm';
import { SiteFields } from '@/components/admin/fields';
import { AdminHeader } from '../AdminHeader';
import { saveSiteAction } from '../actions';

/** Every piece of wording in content/site.json: hero, contact, page titles, 404, demo copy… */
export default async function SitePage() {
  await requireAdmin();
  return (
    <>
      <AdminHeader />
      <main className="adm-main">
        <h1>ข้อความทั้งเว็บ</h1>
        <p className="adm-hint">
          ทุกข้อความมีทั้งภาษาไทยและอังกฤษ ในหัวเรื่องภาษาไทยใช้ | กำหนดจุดตัดบรรทัดได้ และ {'{name}'} จะถูกแทนด้วยชื่อผลิตภัณฑ์
        </p>
        <AdminForm action={saveSiteAction} submit="บันทึกข้อความ">
          <SiteFields value={readSite()} />
        </AdminForm>
      </main>
    </>
  );
}
