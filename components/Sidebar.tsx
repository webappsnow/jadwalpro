'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/shift', label: 'Jadwal Shift', icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
  { href: '/piket', label: 'Piket Toilet', icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
  { href: '/harian', label: 'Piket Harian', icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
  { href: '/admin', label: 'Panel Admin', icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> }
];

export function Sidebar({ isAdmin, user, onLogin, onLogout }: { isAdmin: boolean; user: any; onLogin: () => void; onLogout: () => void; }) {
  const pathname = usePathname();
  
  return (
    <aside className="sidebar" style={{ width: '260px', flexShrink: 0, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Logo */}
      <div style={{ paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
        <div className="logo-wrap"><img src="/logo-ufo.png" alt="Logo" className="logo-img" style={{ width: '140px', height: 'auto' }} /></div>
      </div>

      {/* Menu */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {NAV.map(item => {
          // Sembunyikan menu Admin jika bukan Admin
          if (item.href === '/admin' && !isAdmin) return null;
          
          return (
            <Link key={item.href} href={item.href} className={`nav-item ${pathname.startsWith(item.href) ? 'active' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>{item.icon}<span>{item.label}</span></div>
            </Link>
          );
        })}
      </nav>

      {/* Footer (Auth) */}
      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {user ? (
          <>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
              {user.email} <br/> <span style={{ color: isAdmin ? '#4ade80' : '#64748b' }}>({isAdmin ? 'Admin' : 'Promotor'})</span>
            </div>
            <button onClick={onLogout} className="btn-modern btn-outline" style={{ width: '100%', fontSize: '0.8rem', padding: '8px' }}>Logout</button>
          </>
        ) : (
          <button onClick={onLogin} className="btn-modern btn-primary" style={{ width: '100%', fontSize: '0.8rem', padding: '8px' }}>Login with Google</button>
        )}
      </div>
    </aside>
  );
}