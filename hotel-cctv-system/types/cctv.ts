// types/cctv.ts
export type Role = 'admin' | 'staff';
export type CCTVStatus = 'normal' | 'broken' | 'maintenance' | 'offline';

export interface CCTV {
  id: string;
  code: string;
  location: string;
  floor: string;
  cameraType: string;
  ipAddress: string;
  status: CCTVStatus;
  damageNotes?: string;
  followUpPlan?: string;
  lastChecked: string;
}

export type TicketStatus = 'pending' | 'in_progress' | 'resolved';

export interface TicketReport {
  id: string;
  cctvId: string;
  cctvCode: string;
  location: string;
  floor?: string;
  reporterName: string;
  issueType: string;
  description: string;
  status: TicketStatus;
  actionTaken?: string;
  reportedAt: string;
  resolvedAt?: string;
  photoUrl?: string;     // <-- Tambahkan ini
  photo_path?: string;
}

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  status: 'active' | 'inactive';
  createdAt: string;
}