import Link from 'next/link';
import { kindList, type Kind } from '@/lib/collections';
import { requireAdmin } from '@/lib/admin/auth';
import { listItems } from '@/lib/admin/store';
import { AdminHeader } from './AdminHeader';

const names: Record<Kind, { title: string; add: string }> = {
  products: { title: 'ผลิตภัณฑ์', add: 'เพิ่มผลิตภัณฑ์' },
  projects: { title: 'โปรเจกต์', add: 'เพิ่มโปรเจกต์' },
};

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  await requireAdmin();
  const { deleted } = await searchParams;
  return (
    <>
      <AdminHeader />
      <main className="adm-main">
        {deleted ? (
          <p className="adm-msg adm-ok" role="status">
            ลบ “{deleted}” แล้ว (ไฟล์ถูกย้ายไปที่ content/_deleted/ กู้คืนได้)
          </p>
        ) : null}
        {kindList.map((kind) => {
          const items = listItems(kind);
          return (
            <section key={kind} className="adm-section">
              <div className="adm-row">
                <h2>{names[kind].title}</h2>
                <Link href={`/admin/${kind}/new`} className="adm-btn adm-btn-secondary">
                  + {names[kind].add}
                </Link>
              </div>
              {items.length === 0 ? (
                <p className="adm-hint">ยังไม่มี</p>
              ) : (
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>ชื่อ</th>
                      <th>slug</th>
                      <th>สถานะ</th>
                      <th>ลำดับ</th>
                      <th>
                        <span className="pl-sr-only">การจัดการ</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => {
                      const slug = String(item.slug);
                      const title = (item.title as { th?: string; en?: string } | undefined) ?? {};
                      return (
                        <tr key={slug}>
                          <td>
                            {title.th || title.en || slug}
                            {item.draft === true ? <span className="adm-tag">ร่าง</span> : null}
                            {item.featured === true ? <span className="adm-tag">เด่น</span> : null}
                          </td>
                          <td className="adm-mono">{slug}</td>
                          <td className="adm-mono">{String(item.status ?? '')}</td>
                          <td className="adm-mono">{typeof item.order === 'number' ? item.order : '—'}</td>
                          <td className="adm-actions">
                            <Link href={`/admin/${kind}/${slug}`}>แก้ไข</Link>
                            {item.draft === true ? null : (
                              <a href={`/th/${kind}/${slug}`} target="_blank" rel="noopener">
                                ดู ↗
                              </a>
                            )}
                            <Link href={`/admin/${kind}/${slug}/delete`} className="adm-danger-link">
                              ลบ
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </section>
          );
        })}
      </main>
    </>
  );
}
