// components/Footer.tsx
'use client';

import { ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 py-4 px-6 text-slate-500 text-xs mt-auto print:hidden">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* SISI KIRI: HAK CIPTA & BRANDING HOTEL */}
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="font-semibold text-slate-700">
            &copy; {currentYear} Homm Saranam Baturiti.
          </span>
          <span className="hidden md:inline text-slate-300">•</span>
          <span className="hidden md:inline text-slate-500">
            CCTV Management System
          </span>
        </div>

        {/* SISI KANAN: STATUS SISTEM & IT SUPPORT */}
        <div className="flex items-center gap-3 text-center sm:text-right">
          <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>IT Operational Active</span>
          </div>

          <span className="text-slate-300">•</span>

          <div className="flex items-center gap-1 text-slate-400">
            <span>Powered by IT Department & Suka Astawa Intern</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;