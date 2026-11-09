'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { 
    href: '/shift', 
    label: 'Jadwal Shift',
    icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
  },
  { 
    href: '/piket', 
    label: 'Piket Toilet',
    icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
  },
  { 
    href: '/harian', 
    label: 'Piket Harian',
    icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  },
  { 
    href: '/admin', 
    label: 'Panel Admin',
    icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  },
];

export function Sidebar({ isAdmin, onUnlock, onLock }: { 
  isAdmin: boolean; 
  onUnlock: () => void; 
  onLock: () => void; 
}) {
  const pathname = usePathname();
  
  return (
    <aside className="sidebar" style={{ width: '260px', flexShrink: 0, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Logo Section */}
      <div style={{ paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
        <div className="logo-wrap">
          <img src="/logo-ufo.png" alt="Logo" className="logo-img" style={{ width: '140px', height: 'auto' }} />
        </div>
      </div>

      {/* Navigation Items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {NAV.map(item => (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`nav-item ${pathname.startsWith(item.href) ? 'active' : ''}`}
            style={{ 
              color: pathname.startsWith(item.href) ? 'white' : 'rgba(255,255,255,0.7)', 
              textDecoration: 'none', 
              padding: '12px 16px', 
              fontSize: '0.9rem', 
              fontWeight: 500, 
              display: 'block',
              borderRadius: '10px',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {item.icon}
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      {/* Auth Status Footer */}
      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
        <span style={{ color: isAdmin ? '#4ade80' : '#64748b', fontWeight: 600 }}>
          {isAdmin ? 'Admin Mode' : 'Read Only'}
        </span>
        <button 
          onClick={isAdmin ? onLock : onUnlock} 
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: '#94a3b8', 
            cursor: 'pointer', 
            fontWeight: 600,
            padding: 0
          }}
          className="hover:text-white transition-colors"
        >
          {isAdmin ? 'Logout' : 'Login'}
        </button>
      </div>
    </aside>
  );
}