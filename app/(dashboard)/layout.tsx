'use client';
import { Sidebar } from '@/components/Sidebar';
import { BottomNav } from '@/components/BottomNav';
import { PasswordModal } from '@/components/PasswordModal';
import { ToastProvider } from '@/hooks/useToast';
import { useAdmin } from '@/hooks/useAdmin';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, login, logout } = useAdmin();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <ToastProvider>
      <div className="layout-wrapper">
        <Sidebar
          isAdmin={isAdmin}
          onUnlock={() => setShowPasswordModal(true)}
          onLock={logout}
        />
        <main className={`main-content ${!isAdmin ? 'admin-locked' : ''}`}>
          {children}
        </main>
        <BottomNav
          isAdmin={isAdmin}
          onAdminClick={() => setShowPasswordModal(true)}
        />
      </div>
      {showPasswordModal && (
        <PasswordModal
          onSubmit={async (pin) => {
            const ok = await login(pin);
            if (ok) setShowPasswordModal(false);
            return ok;
          }}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </ToastProvider>
  );
}