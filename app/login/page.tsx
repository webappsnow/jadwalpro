'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/hooks/useAdmin';
import { useData } from '@/hooks/useData';

export default function LoginPage() {
  const { data, loading: dataLoading } = useData();
  const { user, login, loading: authLoading, unauthorized } = useAdmin(data.adminEmails, data.promotorEmails);
  const router = useRouter();

  const isLoading = dataLoading || authLoading;

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/shift'); 
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc', color: '#64748b' }}>
        Memuat...
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f4f9 0%, #f8fafc 100%)', 
      padding: '20px' 
    }}>
      <div className="card-glass" style={{ 
        padding: '40px 32px',
        borderRadius: '24px', 
        maxWidth: '400px', 
        width: '100%', 
        textAlign: 'center' 
      }}>
        <img src="/logo-ufo.png" alt="Logo" style={{ width: '140px', height: 'auto', margin: '0 auto 16px auto' }} />
        
        {/* NAMA APLIKASI (Tambahan) */}
        <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
          UFO Kebonsari
        </p>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
          Selamat Datang
        </h1>
        
        {unauthorized ? (
          <p style={{ color: '#ef4444', marginBottom: '24px', fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.5 }}>
            Maaf, email Anda belum terdaftar. Silakan hubungi Admin.
          </p>
        ) : (
          <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Silakan login dengan akun Google Anda untuk mengakses jadwal.
          </p>
        )}
        
        <button 
          onClick={login} 
          className="btn-modern btn-primary" 
          style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Login with Google
        </button>
      </div>
    </div>
  );
}