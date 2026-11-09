'use client';

export function ConfirmModal({ 
  isOpen, 
  title = "Konfirmasi", 
  message, 
  onConfirm, 
  onCancel,
  isDanger = false 
}: { 
  isOpen: boolean; 
  title?: string; 
  message: string; 
  onConfirm: () => void; 
  onCancel: () => void;
  isDanger?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999
      }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div style={{
        background: 'white', borderRadius: '20px', padding: '32px',
        maxWidth: '380px', width: '90%', textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            width: '48px', height: '48px', borderRadius: '50%', 
            background: isDanger ? '#fee2e2' : '#fef3c7',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke={isDanger ? '#ef4444' : '#f59e0b'} strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>{title}</h3>
        <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.5 }}>{message}</p>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={onCancel}
            style={{
              flex: 1, padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1',
              background: 'white', color: '#334155', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer'
            }}
          >
            Batal
          </button>
          <button 
            onClick={onConfirm}
            style={{
              flex: 1, padding: '10px 16px', borderRadius: '8px', border: 'none',
              background: isDanger ? '#ef4444' : '#0d9488', 
              color: 'white', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer'
            }}
          >
            Ya, Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}