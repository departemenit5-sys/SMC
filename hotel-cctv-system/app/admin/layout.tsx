// app/admin/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import AdminHeader from '@/components/AdminHeader';
import Footer from '@/components/Footer';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [username, setUsername] = useState('Admin IT');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('user_name');
    if (savedName) setUsername(savedName);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row print:bg-white print:block">
      {/* 1. Sidebar Desktop (Disembunyikan saat mode cetak) */}
      <aside className="hidden md:block w-64 fixed left-0 top-0 bottom-0 z-50 print:hidden">
        <Sidebar />
      </aside>

      {/* 2. Sidebar Mobile Drawer (Disembunyikan saat mode cetak) */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-slate-900 border-r border-slate-800 print:hidden">
          <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* 3. Area Konten Utama & Footer */}
      <div className="flex-1 md:ml-64 print:ml-0 flex flex-col min-h-screen w-full">
        <AdminHeader
          username={username}
          onLogout={handleLogout}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 print:p-0">
          {children}
        </main>

        {/* 4. Footer Admin (Disembunyikan saat mode cetak) */}
        <Footer />
      </div>
    </div>
  );
}