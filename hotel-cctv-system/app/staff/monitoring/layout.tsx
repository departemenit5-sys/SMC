import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Monitoring CCTV',
  description: 'Pemantauan status kamera CCTV HOMM Saranam Baturiti secara real-time',
};

export default function StaffMonitoringLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}