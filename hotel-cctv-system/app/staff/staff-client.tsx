'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StaffSidebar from '@/components/StaffSidebar';
import StaffHeader from '@/components/StaffHeader';
import Footer from '@/components/Footer';
import { X } from 'lucide-react';

export default function StaffClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [username, setUsername] = useState('Staff Security');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check Guard Session Login Staff (Menggunakan sessionStorage)
    const userRole = sessionStorage.getItem('user_role');
    const savedName = sessionStorage.getItem('user_name');

    if (!userRole || !savedName) {
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

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-xs text-slate-500 font-medium">Mengecek sesi login staff...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row print:bg-white print:block">
      {/* 1. Sidebar Desktop (Layar Sedang & Besar) */}
      <aside className="hidden md:block w-64 fixed left-0 top-0 bottom-0 z-50 print:hidden">
        <StaffSidebar />
      </aside>

      {/* 2. Custom Mobile Drawer (Layar Kecil) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex print:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-64 bg-slate-900 h-full shadow-2xl flex flex-col z-10">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <StaffSidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* 3. Area Konten Utama Staff & Footer */}
      <div className="flex-1 md:ml-64 print:ml-0 flex flex-col min-h-screen w-full">
        <StaffHeader
          username={username}
          onLogout={handleLogout}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 print:p-0">
          {children}
        </main>

        {/* 4. Footer Staff */}
        <Footer />
      </div>
    </div>
  );
}