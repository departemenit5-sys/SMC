import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buat Laporan Perbaikan',
  description: 'Formulir pelaporan kerusakan dan permintaan maintenance CCTV',
};

export default function StaffReportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}