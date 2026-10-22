import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Laporan & Rekapitulasi',
  description: 'Cetak dan rekap data laporan insiden serta pemeliharaan CCTV',
};

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}