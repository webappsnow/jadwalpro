'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { BottomNav } from '@/components/BottomNav';
import { ToastProvider } from '@/hooks/useToast';
import { useAdmin } from '@/hooks/useAdmin';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading, logout } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // Jika tidak ada user, lempar ke halaman login
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc', color: '#64748b' }}>
        Memuat...
      </div>
    );
  }

  if (!user) return null; // Mencegah render sebelum redirect selesai

  return (
    <ToastProvider>
      <div className="layout-wrapper">
        <Sidebar
          isAdmin={isAdmin}
          user={user}
          onLogout={logout}
        />
        <main className={`main-content ${!isAdmin ? 'admin-locked' : ''}`}>
          {children}
        </main>
        <BottomNav
          isAdmin={isAdmin}
          onAdminClick={() => {}} // Tidak perlu login lagi karena sudah di halaman login
        />
      </div>
    </ToastProvider>
  );
}