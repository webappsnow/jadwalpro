'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/shift', label: 'Shift' },
  { href: '/piket', label: 'Toilet' },
  { href: '/harian', label: 'Harian' },
  { href: '/admin', label: 'Admin', adminOnly: true },
];

export function BottomNav({ isAdmin, onAdminClick, onLogout }: {
  isAdmin: boolean;
  onAdminClick: () => void;
  onLogout: () => void;
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
          >
            <span>{item.label}</span>
          </Link>
        );
      })}
      
      {/* TOMBOL LOGOUT DI SEBELAH ADMIN */}
      <button 
        onClick={onLogout} 
        className="bottom-nav-item" 
        style={{ color: '#ef4444' }}
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        <span>Keluar</span>
      </button>
    </nav>
  );
}