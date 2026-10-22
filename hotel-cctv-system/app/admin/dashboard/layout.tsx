import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard Utama',
  description: 'Ringkasan statistik dan status sistem CCTV HOMM Saranam Baturiti',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}