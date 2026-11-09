'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { BottomNav } from '@/components/BottomNav';
import { ToastProvider } from '@/hooks/useToast';
import { useAdmin } from '@/hooks/useAdmin';
import { useData } from '@/hooks/useData';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data, loading: dataLoading } = useData();
  const { user, isAdmin, loading: authLoading, logout } = useAdmin(data.adminEmails, data.promotorEmails);
  const router = useRouter();

  // Tunggu KEDUA proses, tapi jangan biarkan saling mengunci
  const isLoading = dataLoading || authLoading;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc', color: '#64748b' }}>
        Memuat aplikasi...
      </div>
    );
  }

  if (!user) return null;

  return (
    <ToastProvider>
      <div className="layout-wrapper">
        <Sidebar isAdmin={isAdmin} user={user} onLogout={logout} />
        <main className={`main-content ${!isAdmin ? 'admin-locked' : ''}`}>{children}</main>
        <BottomNav isAdmin={isAdmin} onAdminClick={() => {}} />
      </div>
    </ToastProvider>
  );
}