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
        
        <main className={`main-content ${!isAdmin ? 'admin-locked' : ''}`}>
          
          {/* TOP BAR KHUSUS MOBILE (Dengan Tombol Logout) */}
          <div className="mobile-only" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '12px 16px', 
            background: 'rgba(255, 255, 255, 0.9)', 
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid #e2e8f0',
            marginBottom: '16px',
            borderRadius: '12px'
          }}>
            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
              {isAdmin ? 'Admin Panel' : 'Promotor'}
            </div>
            <button 
              onClick={logout} 
              style={{ 
                padding: '6px 12px', 
                fontSize: '0.75rem', 
                fontWeight: 600,
                borderRadius: '8px',
                background: '#fee2e2',
                color: '#dc2626',
                border: 'none',
                cursor: 'pointer'
              }}
            >
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