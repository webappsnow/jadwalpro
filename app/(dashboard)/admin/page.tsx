'use client';
import { useState } from 'react';
import { useData } from '@/hooks/useData';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/useToast';
import { ConfirmModal } from '@/components/ConfirmModal';

export default function AdminPage() {
  const { data, saveData } = useData();
  const { isAdmin, loading } = useAdmin(data.adminEmails, data.promotorEmails);
  const { show } = useToast();

  const [newBrand, setNewBrand] = useState('');
  const [newName, setNewName] = useState('');
  const [newShiftDay, setNewShiftDay] = useState('P');
  
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newPromotorEmail, setNewPromotorEmail] = useState('');
  
  const [colorBrand, setColorBrand] = useState('');
  const [colorValue, setColorValue] = useState('#dbeafe');

  const [deleteIdx, setDeleteIdx] = useState('');

  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
    isDanger: boolean;
  }>({ isOpen: false, title: '', message: '', action: () => {}, isDanger: false });

  const openConfirm = (title: string, message: string, action: () => void, isDanger = false) => {
    setConfirmState({ isOpen: true, title, message, action, isDanger });
  };

  const closeConfirm = () => setConfirmState(prev => ({ ...prev, isOpen: false }));

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Memuat...</div>;
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Akses Ditolak</h2>
        <p>Halaman ini hanya untuk Admin.</p>
      </div>
    );
  }

  // --- FUNGSI KELOLA ADMIN ---
  const handleAddAdminEmail = async () => {
    const email = newAdminEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) return show('Email tidak valid', true);
    if (data.adminEmails.includes(email)) return show('Email sudah ada', true);
    if (data.promotorEmails.includes(email)) return show('Email ada di promotor', true);
    
    const ok = await saveData({ adminEmails: [...data.adminEmails, email] });
    if (ok) { show('Admin ditambahkan'); setNewAdminEmail(''); }
  };

  const handleRemoveAdminEmail = (email: string) => {
    openConfirm('Hapus Admin', `Hapus akses admin untuk ${email}?`, async () => {
      await saveData({ adminEmails: data.adminEmails.filter(e => e !== email) });
      show('Admin dihapus');
      closeConfirm();
    }, true);
  };

  // --- FUNGSI KELOLA PROMOTOR ---
  const handleAddPromotorEmail = async () => {
    const email = newPromotorEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) return show('Email tidak valid', true);
    if (data.promotorEmails.includes(email)) return show('Email sudah ada', true);
    if (data.adminEmails.includes(email)) return show('Email ada di admin', true);
    
    const ok = await saveData({ promotorEmails: [...data.promotorEmails, email] });
    if (ok) { show('Promotor ditambahkan'); setNewPromotorEmail(''); }
  };

  const handleRemovePromotorEmail = (email: string) => {
    openConfirm('Hapus Promotor', `Hapus akses promotor untuk ${email}?`, async () => {
      await saveData({ promotorEmails: data.promotorEmails.filter(e => e !== email) });
      show('Promotor dihapus');
      closeConfirm();
    }, true);
  };

  const handleAddSales = async () => {
    const brand = newBrand.trim().toUpperCase();
    const name = newName.trim();
    if (!brand || !name) { show('Brand dan Nama wajib diisi', true); return; }

    const mapShift: Record<string, any> = {
      'P': { selasa: 'OFF', rabu: 'S', kamis: 'L', jumat: 'P', sabtu: 'S', minggu: 'P' },
      'S': { selasa: 'L', rabu: 'P', kamis: 'OFF', jumat: 'S', sabtu: 'P', minggu: 'S' },
      'L': { selasa: 'P', rabu: 'OFF', kamis: 'S', jumat: 'P', sabtu: 'S', minggu: 'S' },
      'OFF': { selasa: 'S', rabu: 'L', kamis: 'P', jumat: 'S', sabtu: 'P', minggu: 'P' }
    };
    const pattern = mapShift[newShiftDay] || mapShift['P'];

    const newSales = [...data.sales, { id: `sales-${Date.now()}`, brand, name, senin: newShiftDay as any, ...pattern, toilet: '', toilet2: '' }];
    const ok = await saveData({ sales: newSales });
    if (ok) { show('Sales berhasil ditambahkan'); setNewBrand(''); setNewName(''); }
    else show('Gagal menambahkan sales', true);
  };

  const handleDeleteSales = () => {
    const idx = parseInt(deleteIdx);
    if (isNaN(idx)) { show('Pilih sales terlebih dahulu', true); return; }
    
    openConfirm('Hapus Sales', 'Apakah Anda yakin ingin menghapus sales ini dari daftar?', async () => {
      const newSales = [...data.sales];
      newSales.splice(idx, 1);
      const ok = await saveData({ sales: newSales });
      if (ok) { show('Sales dihapus'); setDeleteIdx(''); }
      else show('Gagal menghapus', true);
      closeConfirm();
    }, true);
  };

  const handleSetColor = async () => {
    const brand = colorBrand.trim().toUpperCase();
    if (!brand) { show('Masukkan nama brand', true); return; }
    const newColors = { ...data.colors, [brand]: colorValue };
    const ok = await saveData({ colors: newColors });
    if (ok) { show('Warna brand diset'); setColorBrand(''); }
  };

  const handleRemoveColor = (brand: string) => {
    openConfirm('Hapus Warna', `Hapus warna untuk brand ${brand}?`, async () => {
      const newColors = { ...data.colors };
      const keyToDelete = Object.keys(newColors).find(k => k.trim().toUpperCase() === brand.trim().toUpperCase());
      if (keyToDelete) delete newColors[keyToDelete];
      await saveData({ colors: newColors });
      show('Warna dihapus');
      closeConfirm();
    }, true);
  };

  return (
    <section>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Panel Admin</h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '4px' }}>Kelola data sales, shift, dan warna brand</p>
      </div>

      <div className="card-glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* FORM ADMIN */}
        <div>
          <h3 style={{ fontWeight: 700, color: '#334155', marginBottom: '12px' }}>Kelola Akses Admin (Email Google)</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            <input type="email" placeholder="Masukkan email admin..." className="admin-input" style={{ flex: 1, minWidth: '200px' }} value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} />
            <button className="btn-modern btn-primary" onClick={handleAddAdminEmail}>Tambah Admin</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {data.adminEmails.map((email) => (
              <span key={email} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem', fontWeight: 600 }}>
                {email}
                {/* TOMBOL HAPUS ADMIN */}
                <button onClick={() => handleRemoveAdminEmail(email)} style={{ border: 'none', background: 'transparent', color: '#cbd5e1', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
              </span>
            ))}
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />

        {/* FORM PROMOTOR */}
        <div>
          <h3 style={{ fontWeight: 700, color: '#334155', marginBottom: '12px' }}>Kelola Akses Promotor (Email Google)</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            <input type="email" placeholder="Masukkan email promotor..." className="admin-input" style={{ flex: 1, minWidth: '200px' }} value={newPromotorEmail} onChange={e => setNewPromotorEmail(e.target.value)} />
            <button className="btn-modern btn-primary" onClick={handleAddPromotorEmail}>Tambah Promotor</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {data.promotorEmails.map((email) => (
              <span key={email} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem', fontWeight: 600 }}>
                {email}
                {/* TOMBOL HAPUS PROMOTOR */}
                <button onClick={() => handleRemovePromotorEmail(email)} style={{ border: 'none', background: 'transparent', color: '#cbd5e1', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
              </span>
            ))}
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />

        {/* Tambah Sales & Warna */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div>
            <h3 style={{ fontWeight: 700, color: '#334155', marginBottom: '12px' }}>Tambah Sales</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <input type="text" placeholder="Brand (Cth: SHARP)" className="admin-input" style={{ flex: 1, minWidth: '120px' }} value={newBrand} onChange={e => setNewBrand(e.target.value)} />
              <input type="text" placeholder="Nama Sales" className="admin-input" style={{ flex: 1, minWidth: '120px' }} value={newName} onChange={e => setNewName(e.target.value)} />
              <select className="admin-input" style={{ flex: 1, minWidth: '120px' }} value={newShiftDay} onChange={e => setNewShiftDay(e.target.value)}>
                <option value="P">Pagi (P)</option>
                <option value="S">Siang (S)</option>
                <option value="L">Lembur (L)</option>
                <option value="OFF">Libur (OFF)</option>
              </select>
              <button className="btn-modern btn-primary" onClick={handleAddSales}>Tambah</button>
            </div>
          </div>

          <div>
            <h3 style={{ fontWeight: 700, color: '#334155', marginBottom: '12px' }}>Warna Brand</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <input type="text" placeholder="Nama Brand" className="admin-input" style={{ flex: 1, minWidth: '120px' }} value={colorBrand} onChange={e => setColorBrand(e.target.value)} />
              <input type="color" style={{ width: '48px', height: '48px', padding: '4px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer' }} value={colorValue} onChange={e => setColorValue(e.target.value)} />
              <button className="btn-modern btn-primary" onClick={handleSetColor}>Set</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
              {Object.entries(data.colors).map(([brand, color]) => (
                <span key={brand} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: color }}></span>
                  {brand}
                  <button onClick={() => handleRemoveColor(brand)} style={{ border: 'none', background: 'transparent', color: '#cbd5e1', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />

        {/* Hapus Sales & Kosongkan */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <h3 style={{ fontWeight: 700, color: '#334155', marginBottom: '8px', fontSize: '0.9rem' }}>Hapus Sales</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select className="admin-input" style={{ flex: 1 }} value={deleteIdx} onChange={e => setDeleteIdx(e.target.value)}>
                <option value="">Pilih sales</option>
                {data.sales.map((s, i) => (<option key={s.id} value={i}>{s.brand} - {s.name}</option>))}
              </select>
              <button className="btn-modern btn-danger" onClick={handleDeleteSales}>Hapus</button>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className="btn-modern btn-outline" style={{ width: '100%' }} onClick={() => {
              openConfirm('Kosongkan Shift', 'Kosongkan semua data shift?', async () => {
                await saveData({ sales: [] });
                show('Shift dikosongkan');
                closeConfirm();
              }, true);
            }}>Kosongkan Shift</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className="btn-modern btn-outline" style={{ width: '100%' }} onClick={() => {
              openConfirm('Kosongkan Piket Harian', 'Kosongkan piket harian?', async () => {
                const emptyHarian: any = {};
                ['senin','selasa','rabu','kamis','jumat','sabtu','minggu'].forEach(day => {
                  emptyHarian[day] = {
                    'LANTAI 1': { 'MENYAPU': [], 'MENGEPEL': [], 'CLEAN BRAND NON PROMOTOR + TANGGA': [], 'GENERAL CLEANING (SETELAH PIKET)': [] },
                    'LANTAI 2/AV': { 'MENYAPU': [], 'MENGEPEL': [], 'CLEAN BRAND NON PROMOTOR + TANGGA': [], 'GENERAL CLEANING (SETELAH PIKET)': [] },
                    'FREEZER': { 'MENYAPU': [], 'MENGEPEL': [], 'GENERAL CLEANING (SETELAH PIKET)': [] }
                  };
                });
                await saveData({ harian: emptyHarian });
                show('Piket harian dikosongkan');
                closeConfirm();
              }, true);
            }}>Kosongkan Piket Harian</button>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />

        {/* Daftar Sales */}
        <div>
          <h3 style={{ fontWeight: 700, color: '#334155', marginBottom: '12px' }}>Daftar Sales Terdaftar</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {data.sales.map((item, idx) => {
              const color = data.colors[item.brand.trim().toUpperCase()] || '#e2e8f0';
              return (
                <span key={item.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', padding: '8px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: 500 }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }}></span>
                  {item.brand} - {item.name}
                  <button onClick={() => {
                    openConfirm('Hapus Sales', `Hapus ${item.brand}?`, async () => {
                      const newSales = [...data.sales];
                      newSales.splice(idx, 1);
                      await saveData({ sales: newSales });
                      show('Sales dihapus');
                      closeConfirm();
                    }, true);
                  }} style={{ border: 'none', background: 'transparent', color: '#cbd5e1', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <ConfirmModal isOpen={confirmState.isOpen} title={confirmState.title} message={confirmState.message} onConfirm={confirmState.action} onCancel={closeConfirm} isDanger={confirmState.isDanger} />
    </section>
  );
}