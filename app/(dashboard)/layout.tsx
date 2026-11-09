'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { BottomNav } from '@/components/BottomNav';
import { ToastProvider } from '@/hooks/useToast';
import { useAdmin } from '@/hooks/useAdmin';
import { useData } from '@/hooks/useData';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data } = useData();
  const { user, isAdmin, loading, logout } = useAdmin(data.adminEmails);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc', color: '#64748b' }}>
        Memuat...
      </div>
    );
  }

  if (!user) return null;

  return (
    <ToastProvider>
      <div className="layout-wrapper">
        <Sidebar isAdmin={isAdmin} user={user} onLogout={logout} />
        
        {/* Konten Utama (Tanpa Top Bar Mobile) */}
        <main className={`main-content ${!isAdmin ? 'admin-locked' : ''}`}>
          {children}
        </main>
        
        {/* Bottom Nav (Tombol Logout sudah ada di sini) */}
        <BottomNav isAdmin={isAdmin} onAdminClick={() => {}} onLogout={logout} />
      </div>
    </ToastProvider>
  );
}