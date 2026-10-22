import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manajemen User',
  description: 'Pengaturan akun dan hak akses pengguna sistem',
};

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}