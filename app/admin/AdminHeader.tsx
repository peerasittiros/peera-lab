import Link from 'next/link';
import { logout } from './actions';

export function AdminHeader() {
  return (
    <header className="adm-header">
      <Link href="/admin" className="adm-brand">
        Peera Lab · Admin
      </Link>
      <nav>
        <Link href="/admin">ผลิตภัณฑ์และโปรเจกต์</Link>
        <Link href="/admin/site">ข้อความทั้งเว็บ</Link>
        <a href="/th" target="_blank" rel="noopener">
          ดูเว็บ ↗
        </a>
        <form action={logout}>
          <button type="submit" className="adm-link">
            ออกจากระบบ
          </button>
        </form>
      </nav>
    </header>
  );
}
