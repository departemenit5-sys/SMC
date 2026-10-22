// components/layout/header.tsx
'use client';

import { useState, useEffect } from 'react';
import { Bell, ShieldCheck, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const [adminName, setAdminName] = useState('Admin IT');
  const [role, setRole] = useState('Administrator');

  useEffect(() => {
    const savedName = localStorage.getItem('user_name');
    const savedRole = localStorage.getItem('user_role');
    if (savedName) setAdminName(savedName);
    if (savedRole) setRole(savedRole === 'admin' ? 'Administrator IT' : 'Staff Security');
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 print:hidden">
      {/* INFORMASI LOKASI HOTEL */}
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <div className="text-xs">
          <span className="font-bold text-slate-800">Homm Saranam Baturiti</span>
          <span className="text-slate-400 mx-1.5">•</span>
          <span className="text-slate-500 font-medium">IT Security & Monitoring Active</span>
        </div>
      </div>

      {/* NOTIFIKASI & PROFIL AKUN */}
      <div className="flex items-center gap-4">
        <button
          className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
          title="Notifikasi"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="h-4 w-px bg-slate-200" />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-slate-800 leading-tight">{adminName}</div>
            <div className="text-[10px] text-purple-600 font-semibold">{role}</div>
          </div>
          <Badge className="bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100 text-[10px] ml-1">
            <ShieldCheck className="w-3 h-3 mr-1 text-purple-600" /> Online
          </Badge>
        </div>
      </div>
    </header>
  );
}