'use client';
import { useState } from 'react';

export function PasswordModal({ onSubmit, onClose }: {
  onSubmit: (pin: string) => Promise<boolean>;
  onClose: () => void;
}) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!pin) return;
    setLoading(true);
    const ok = await onSubmit(pin);
    setLoading(false);
    if (!ok) { setError('PIN salah! Coba lagi.'); setPin(''); }
  };

  return (
    <div
      className="modal-overlay active"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🔒</span> Masukkan PIN Admin
        </h3>
        <p className="sub">Untuk mengubah data atau akses panel admin</p>
        
        <input
          type="password"
          value={pin}
          onChange={e => { setPin(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Masukkan PIN..."
          style={{ marginBottom: '20px' }}
          autoFocus
        />
        
        {/* Tombol dengan warna tegas */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleSubmit} 
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: '#0d9488', // Warna Hijau Tosca
              color: 'white',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px -1px rgba(13, 148, 136, 0.2)'
            }}
          >
            {loading ? 'Memeriksa...' : 'Konfirmasi'}
          </button>
          
          <button 
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px 24px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: 'white',
              color: '#334155',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Batal
          </button>
        </div>
        
        {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '12px', textAlign: 'center', fontWeight: 500 }}>{error}</div>}
      </div>
    </div>
  );
}