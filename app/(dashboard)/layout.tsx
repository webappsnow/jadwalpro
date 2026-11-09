'use client';
import { Sidebar } from '@/components/Sidebar';
import { BottomNav } from '@/components/BottomNav';
import { ToastProvider } from '@/hooks/useToast';
import { useAdmin } from '@/hooks/useAdmin';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, login, logout } = useAdmin();

  return (
    <ToastProvider>
      <div className="layout-wrapper">
        <Sidebar
          isAdmin={isAdmin}
          user={user}
          onLogin={login}
          onLogout={logout}
        />
        <main className={`main-content ${!isAdmin ? 'admin-locked' : ''}`}>
          {children}
        </main>
        <BottomNav
          isAdmin={isAdmin}
          onAdminClick={login}
        />
      </div>
    </ToastProvider>
  );
}