// components/StaffSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PlusCircle, Activity } from 'lucide-react';

interface StaffSidebarProps {
  onCloseMobile?: () => void;
}

export default function StaffSidebar({ onCloseMobile }: StaffSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Form Lapor CCTV',
      href: '/staff/report',
      icon: PlusCircle,
    },
    {
      label: 'Monitoring & Histori',
      href: '/staff/monitoring',
      icon: Activity,
    },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 h-full flex flex-col p-4 border-r border-slate-800">
      {/* Brand Header dengan Logo.png & Nama Hotel */}
      <div className="flex items-center gap-3 px-2 text-white font-bold text-sm border-b border-slate-800 pb-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-md border border-slate-200">
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
            Baturiti • Staff Portal
          </p>
        </div>
      </div>

      {/* Menu Navigasi Staff */}
      <nav className="space-y-1">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
          Menu Security / Staff
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname === '/' && item.href === '/staff/report');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}