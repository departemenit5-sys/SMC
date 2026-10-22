// components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Camera,
  FileText,
  Users,
  ChevronRight,
  X,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

const navItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Master CCTV',
    href: '/admin/cctv',
    icon: Camera,
  },
  {
    title: 'Laporan Maintenance',
    href: '/admin/reports',
    icon: FileText,
  },
  {
    title: 'Manajemen User',
    href: '/admin/users',
    icon: Users,
  },
];

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col h-screen sticky top-0 border-r border-slate-800 print:hidden shrink-0">
      {/* BRANDING HEADER HOTEL DENGAN CONTAINER LOGO PUTIH */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* CONTAINER PUTIH UNTUK LOGO AGAR KELIATAN DENGAN JELAS */}
          <div className="w-10 h-10 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-md border border-slate-200">
            <img
              src="/logo.png"
              alt="Homm Saranam Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="overflow-hidden">
            <h2 className="font-bold text-sm text-white truncate uppercase tracking-wide">
              Homm Saranam
            </h2>
            <p className="text-[11px] text-purple-300 font-medium truncate">
              Baturiti • CCTV System
            </p>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden text-slate-400 hover:text-white p-1"
            title="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* NAVIGATION MENU UTAMA */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Menu Utama
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-purple-600 text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.title}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;