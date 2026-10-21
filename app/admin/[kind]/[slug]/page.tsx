import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isKind } from '@/lib/collections';
import { requireAdmin } from '@/lib/admin/auth';
import { isSlug, readItem } from '@/lib/admin/store';
import { AdminForm } from '@/components/admin/AdminForm';
import { ItemFields } from '@/components/admin/ItemFields';
import { AdminHeader } from '../../AdminHeader';
import { saveItemAction } from '../../actions';

export default async function EditItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ kind: string; slug: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const { kind, slug } = await params;
  if (!isKind(kind) || !isSlug(slug)) notFound();
  const item = readItem(kind, slug);
  if (!item) notFound();
  const { saved } = await searchParams;
  const title = (item.title as { th?: string; en?: string } | undefined) ?? {};
  return (
    <>
      <AdminHeader />
      <main className="adm-main">
        <div className="adm-row">
          <h1>{title.th || title.en || slug}</h1>
          <div className="adm-actions">
            {item.draft === true ? null : (
              <a href={`/th/${kind}/${slug}`} target="_blank" rel="noopener">
                ดูบนเว็บ ↗
              </a>
            )}
            <Link href={`/admin/${kind}/${slug}/delete`} className="adm-danger-link">
              ลบ
            </Link>
          </div>
        </div>
        {saved ? (
          <p className="adm-msg adm-ok" role="status">
            สร้างแล้ว
          </p>
        ) : null}
        <AdminForm action={saveItemAction} submit="บันทึก">
          <ItemFields kind={kind} item={item} isNew={false} />
        </AdminForm>
      </main>
    </>
  );
}
