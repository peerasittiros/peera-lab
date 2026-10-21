import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isKind } from '@/lib/collections';
import { requireAdmin } from '@/lib/admin/auth';
import { isSlug, readItem } from '@/lib/admin/store';
import { AdminForm } from '@/components/admin/AdminForm';
import { AdminHeader } from '../../../AdminHeader';
import { deleteItemAction } from '../../../actions';

/** A separate confirmation page instead of a browser confirm() dialog. */
export default async function DeleteItemPage({ params }: { params: Promise<{ kind: string; slug: string }> }) {
  await requireAdmin();
  const { kind, slug } = await params;
  if (!isKind(kind) || !isSlug(slug)) notFound();
  const item = readItem(kind, slug);
  if (!item) notFound();
  const title = (item.title as { th?: string; en?: string } | undefined) ?? {};
  return (
    <>
      <AdminHeader />
      <main className="adm-main adm-narrow">
        <h1>ลบ “{title.th || title.en || slug}”?</h1>
        <p>หน้านี้จะหายจากเว็บทันที ไฟล์จะถูกย้ายไปที่ content/_deleted/{kind}/ เพื่อกู้คืนได้ภายหลัง</p>
        <AdminForm action={deleteItemAction} submit="ยืนยันการลบ" danger>
          <input type="hidden" name="kind" value={kind} />
          <input type="hidden" name="slug" value={slug} />
        </AdminForm>
        <p>
          <Link href={`/admin/${kind}/${slug}`}>ยกเลิก</Link>
        </p>
      </main>
    </>
  );
}
