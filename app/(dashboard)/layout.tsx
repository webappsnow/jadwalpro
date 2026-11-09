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
  const { user, isAdmin, loading, logout } = useAdmin(data.adminEmails, data.promotorEmails);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (!user) return null;

  return (
    <ToastProvider>
      <div className="layout-wrapper">
        <Sidebar isAdmin={isAdmin} user={user} onLogout={logout} />
        
        <main className={`main-content ${!isAdmin ? 'admin-locked' : ''}`}>
          {/* TOMBOL LOGOUT KHUSUS MOBILE (Muncul di atas, sejajar dengan judul) */}
          <div className="mobile-only" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button 
              onClick={logout} 
              className="btn-modern btn-outline" 
              style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
            </button>
          </div>

          {children}
        </main>
        
        <BottomNav isAdmin={isAdmin} onAdminClick={() => {}} />
      </div>
    </ToastProvider>
  );
}