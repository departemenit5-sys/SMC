// components/StaffHeader.tsx
'use client';

import { User, LogOut, Menu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface StaffHeaderProps {
  username: string;
  onLogout: () => void;
  onOpenMobileMenu?: () => void;
}

export default function StaffHeader({ username, onLogout, onOpenMobileMenu }: StaffHeaderProps) {
  return (
    <header className="bg-slate-900 text-white py-3 px-4 md:px-8 flex justify-between items-center shadow-md sticky top-0 z-40 border-b border-slate-800">
      <div className="flex items-center gap-3">
        {/* Tombol Hamburger Mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-slate-300 hover:bg-slate-800"
          onClick={onOpenMobileMenu}
        >
          <Menu className="w-6 h-6" />
        </Button>

        {/* Branding Hotel dengan Logo.png */}
        <div className="flex items-center gap-2.5 font-bold text-base md:text-lg">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-xs border border-slate-700">
            <img
              src="/logo.png"
              alt="Homm Saranam Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="hidden sm:inline">Homm Saranam Baturiti Portal</span>
          <span className="sm:hidden">CCTV Portal</span>
        </div>
      </div>

      {/* Profile Avatar Trigger di Kanan Atas */}
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none hover:opacity-90 transition p-1 rounded-full focus:ring-2 focus:ring-purple-400">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold shadow-md">
            <User className="w-5 h-5 md:w-6 md:h-6" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-72 mt-2 bg-white text-slate-800 shadow-2xl border border-slate-100 rounded-xl p-4 space-y-3"
        >
          {/* Header Info User */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
              <User className="w-7 h-7" />
            </div>
            <div className="space-y-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 truncate">
                  {username || 'Staff Security'}
                </span>
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 text-[10px] px-2 py-0.5 rounded-full font-semibold border-none">
                  Staff
                </Badge>
              </div>
              <p className="text-xs text-slate-500 truncate">security@hommsaranam.com</p>
            </div>
          </div>

          <DropdownMenuSeparator className="bg-slate-100 my-2" />

          {/* Tombol Logout */}
          <DropdownMenuItem
            onClick={onLogout}
            className="cursor-pointer text-slate-700 hover:text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600 rounded-lg px-3 py-2.5 text-sm font-semibold flex items-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}