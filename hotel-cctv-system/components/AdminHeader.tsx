// components/AdminHeader.tsx
'use client';

import { useState, useEffect } from 'react';
import { Menu, Bell, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminHeaderProps {
  username?: string;
  onLogout?: () => void;
  onOpenMobileMenu?: () => void;
  onMenuClick?: () => void;
}

export function AdminHeader({
  username,
  onLogout,
  onOpenMobileMenu,
  onMenuClick,
}: AdminHeaderProps) {
  const [adminName, setAdminName] = useState('Admin IT');
  const [role, setRole] = useState('Administrator');

  useEffect(() => {
    if (username) {
      setAdminName(username);
    } else {
      const savedName = localStorage.getItem('user_name');
      if (savedName) setAdminName(savedName);
    }

    const savedRole = localStorage.getItem('user_role');
    if (savedRole) setRole(savedRole === 'admin' ? 'Administrator IT' : 'Staff Security');
  }, [username]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_name');
      window.location.href = '/login';
    }
  };

  const handleMobileMenuToggle = () => {
    if (onOpenMobileMenu) {
      onOpenMobileMenu();
    } else if (onMenuClick) {
      onMenuClick();
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 print:hidden shadow-2xs">
      {/* SISI KIRI: TOMBOL MENU MOBILE (LOKAL) */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMobileMenuToggle}
          className="md:hidden text-slate-600 hover:text-slate-900"
          aria-label="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* SISI KANAN: NOTIFIKASI, PROFIL AKUN, & TOMBOL KELUAR */}
      <div className="flex items-center gap-3">
        <button
          className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
          title="Notifikasi"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 font-bold text-xs shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-slate-800 leading-tight">{adminName}</div>
            <div className="text-[10px] text-slate-500 font-medium">{role}</div>
          </div>
        </div>

        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold gap-1.5 ml-1"
          title="Keluar Akun"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Keluar</span>
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;