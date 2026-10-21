import { redirect } from 'next/navigation';
import { adminConfig, isAdmin } from '@/lib/admin/auth';
import { AdminForm } from '@/components/admin/AdminForm';
import { TextField } from '@/components/admin/fields';
import { login } from '../actions';

export default async function LoginPage() {
  if (await isAdmin()) redirect('/admin');
  const configured = adminConfig() !== null;
  return (
    <main className="adm-main adm-narrow">
      <h1>เข้าสู่ระบบผู้ดูแล</h1>
      {configured ? (
        <AdminForm action={login} submit="เข้าสู่ระบบ">
          <TextField label="ชื่อผู้ใช้" name="username" required />
          <TextField label="รหัสผ่าน" name="password" type="password" required />
        </AdminForm>
      ) : (
        <div className="adm-msg adm-error">
          <p>ยังไม่ได้ตั้งค่าบัญชีผู้ดูแล รันคำสั่งนี้ในโฟลเดอร์โปรเจกต์ แล้วรีสตาร์ทเซิร์ฟเวอร์:</p>
          <pre>npm run admin:setup</pre>
        </div>
      )}
    </main>
  );
}
