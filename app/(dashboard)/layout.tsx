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

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (dataLoading || authLoading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Memuat...</div>;
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