import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Master Data CCTV',
  description: 'Kelola inventaris dan status perangkat CCTV HOMM Saranam Baturiti',
};

export default function CCTVLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}