import { notFound } from 'next/navigation';
import { isKind } from '@/lib/collections';
import { requireAdmin } from '@/lib/admin/auth';
import { newItemTemplate } from '@/lib/admin/store';
import { AdminForm } from '@/components/admin/AdminForm';
import { ItemFields } from '@/components/admin/ItemFields';
import { AdminHeader } from '../../AdminHeader';
import { saveItemAction } from '../../actions';

export default async function NewItemPage({ params }: { params: Promise<{ kind: string }> }) {
  await requireAdmin();
  const { kind } = await params;
  if (!isKind(kind)) notFound();
  return (
    <>
      <AdminHeader />
      <main className="adm-main">
        <h1>{kind === 'products' ? 'เพิ่มผลิตภัณฑ์' : 'เพิ่มโปรเจกต์'}</h1>
        <p className="adm-hint">เริ่มเป็นฉบับร่าง เอาติ๊ก “ฉบับร่าง” ออกเมื่อพร้อมแสดงบนเว็บ</p>
        <AdminForm action={saveItemAction} submit="สร้าง">
          <ItemFields kind={kind} item={newItemTemplate(kind)} isNew />
        </AdminForm>
      </main>
    </>
  );
}
