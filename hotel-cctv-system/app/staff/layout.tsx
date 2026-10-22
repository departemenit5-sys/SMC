import type { Metadata } from 'next';
import StaffClient from './staff-client';

export const metadata: Metadata = {
  title: {
    default: 'Staff Portal | CCTV HOMM Saranam',
    template: '%s | Staff CCTV HOMM Saranam',
  },
  description: 'Portal Staff Monitoring & Pelaporan CCTV HOMM Saranam Baturiti',
};

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return <StaffClient>{children}</StaffClient>;
}