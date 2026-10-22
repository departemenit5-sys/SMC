// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '@/types/cctv';
import LoginForm from '@/components/LoginForm';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Cek status login & role yang tersimpan di localStorage
    const savedRole = localStorage.getItem('user_role');

    if (savedRole === 'admin') {
      router.replace('/admin/dashboard');
    } else if (savedRole === 'staff') {
      router.replace('/staff/report');
    } else {
      setIsLoading(false);
      setIsLoggedIn(false);
    }
  }, [router]);

  // Handler saat user berhasil login melalui LoginForm
  const handleLogin = (selectedRole: Role, user: string) => {
    if (selectedRole === 'admin') {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/staff/report');
    }
  };

  // Tampilkan loading sebentar saat mengecek session login
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-sm">
        Memuat sistem...
      </div>
    );
  }

  // Jika belum login, tampilkan Form Login utama
  return <LoginForm onLogin={handleLogin} />;
}