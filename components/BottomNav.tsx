'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/shift', label: 'Shift' },
  { href: '/piket', label: 'Toilet' },
  { href: '/harian', label: 'Harian' },
  { href: '/admin', label: 'Admin', adminOnly: true },
];

export function BottomNav({ isAdmin, onAdminClick }: {
  isAdmin: boolean;
  onAdminClick: () => void;
}) {
  const pathname = usePathname();
  
  return (
    <nav className="bottom-nav">
      {NAV.map(item => {
        const isActive = pathname.startsWith(item.href);
        
        if (item.adminOnly && !isAdmin) {
          return (
            <button
              key={item.href}
              className="bottom-nav-item"
              onClick={onAdminClick}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontSize: '0.65rem', fontWeight: 600, color: '#64748b' }}
            >
              <span>{item.label}</span>
            </button>
          );
        }
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', 
              fontSize: '0.65rem', fontWeight: 600, textDecoration: 'none',
              color: isActive ? '#0d9488' : '#64748b',
              padding: '8px 16px',
              borderRadius: '12px',
              background: isActive ? '#f0fdfa' : 'transparent'
            }}
          >
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}