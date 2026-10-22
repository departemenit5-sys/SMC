import type { Metadata } from 'next';
import AdminClient from './admin-client';

export const metadata: Metadata = {
  title: {
    default: 'Admin Dashboard | CCTV HOMM Saranam',
    template: '%s | Admin CCTV HOMM Saranam',
  },
  description: 'Panel Kontrol Admin Sistem Monitoring CCTV HOMM Saranam Baturiti',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminClient>{children}</AdminClient>;
}