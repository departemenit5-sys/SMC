'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import AdminHeader from '@/components/AdminHeader';
import Footer from '@/components/Footer';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export default function AdminClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [username, setUsername] = useState('Admin IT');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 1. Pengecekan Guard Session Login Admin (Menggunakan sessionStorage)
    const userRole = sessionStorage.getItem('user_role');
    const savedName = sessionStorage.getItem('user_name');

    if (!userRole || !savedName) {
      // Jika data login tidak ditemukan di tab saat ini, kembalikan ke halaman login
      router.push('/');
    } else {
      setUsername(savedName);
      setIsChecking(false);
    }
  }, [router]);

  const handleLogout = () => {
    // Hapus sesi dari sessionStorage saat logout
    sessionStorage.removeItem('user_role');
    sessionStorage.removeItem('user_name');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('user_department');
    router.push('/');
  };

  // Tampilan sementara saat mengecek sesi login
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-xs text-slate-500 font-medium">Mengecek sesi login admin...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row print:bg-white print:block">
      {/* Sidebar Desktop */}
      <aside className="hidden md:block w-64 fixed left-0 top-0 bottom-0 z-50 print:hidden">
        <Sidebar />
      </aside>

      {/* Sidebar Mobile Drawer */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-slate-900 border-r border-slate-800 print:hidden">
          <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Area Utama */}
      <div className="flex-1 min-w-0 max-w-full md:ml-64 print:ml-0 flex flex-col min-h-screen w-full">
        <AdminHeader
          username={username}
          onLogout={handleLogout}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 min-w-0 max-w-full p-4 md:p-8 print:p-0">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}