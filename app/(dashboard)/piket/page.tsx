'use client';
import { useState } from 'react';
import { useData } from '@/hooks/useData';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/useToast';

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

export default function PiketPage() {
  const { data, saveData } = useData();
  const { isAdmin } = useAdmin(data.adminEmails);
  const { show } = useToast();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [tgl1, setTgl1] = useState('');
  const [tgl2, setTgl2] = useState('');
  const [noteOpen, setNoteOpen] = useState(false);

  const openModal = (idx: number) => {
    if (!isAdmin) { show('Hanya Admin yang bisa mengubah jadwal', true); return; }
    setEditIdx(idx);
    setTgl1(data.sales[idx].toilet || '');
    setTgl2(data.sales[idx].toilet2 || '');
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const saveDate = async () => {
    if (editIdx === null || !isAdmin) return;
    const newSales = [...data.sales];
    newSales[editIdx].toilet = tgl1;
    newSales[editIdx].toilet2 = tgl2;
    const ok = await saveData({ sales: newSales });
    if (ok) show('Jadwal piket disimpan');
    else show('Gagal menyimpan', true);
    closeModal();
  };

  const clearDate = async () => {
    if (editIdx === null || !isAdmin) return;
    if (!confirm('Kosongkan jadwal piket untuk sales ini?')) return;
    const newSales = [...data.sales];
    newSales[editIdx].toilet = '';
    newSales[editIdx].toilet2 = '';
    const ok = await saveData({ sales: newSales });
    if (ok) show('Jadwal piket dikosongkan');
    closeModal();
  };

  return (
    <section>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Jadwal Piket Toilet</h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '4px' }}>Atur jadwal kebersihan toilet untuk setiap promotor.</p>
      </div>
      
      <div className="card-glass" style={{ marginBottom: '24px', borderLeft: '4px solid #f59e0b', background: '#fffbeb', overflow: 'hidden' }}>
        <button onClick={() => setNoteOpen(!noteOpen)} style={{ width: '100%', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#b45309', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Catatan Penting
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 600 }}>{noteOpen ? 'Tutup' : 'Buka'}</span>
        </button>
        
        {noteOpen && (
          <div style={{ padding: '0 20px 20px 20px' }}>
            <ul className="note-list" style={{ fontSize: '0.875rem', color: '#78350f', listStyleType: 'disc', paddingLeft: '20px', margin: 0, display: 'grid', gap: '8px' }}>
              <li>PIKET TOILET (LANTAI, DINDING, CLOSET, URINOIR, WASTAFEL, LANGIT2) HARUS DISIKAT</li>
              <li>GENERAL CLEANING SETIAP HARI SABTU & MINGGU</li>
              <li>HARI SABTU MINGGU PERTAMA : AREA LEMARI ES</li>
              <li>HARI MINGGU MINGGU PERTAMA : AREA TV</li>
              <li>HARI SABTU MINGGU KEDUA : AREA MESIN CUCI</li>
              <li>HARI MINGGU MINGGU KEDUA : FREEZER</li>
              <li>HARI SABTU MINGGU KETIGA : AREA AC</li>
              <li>HARI MINGGU MINGGU KETIGA : LANTAI 3</li>
              <li>HARI SABTU MINGGU KEEMPAT : AREA GUDANG KARDUS LANTAI 1</li>
              <li>HARI MINGGU MINGGU KEEMPAT : AREA GUDANG KARDUS LANTAI 4</li>
              <li>WAJIB UPDATE STOK HARIAN DAN UPLOAD SOSMED</li>
              <li>WAJIB FINGER ISTIRAHAT</li>
              <li>IZIN SAKIT WAJIB DISERTAI SURAT DOKTER DAN OBAT</li>
              <li>MENGISI FORM KONFIRMASI TUKAR SHIFT, TUKAR OFF, CUTI (DILENGKAPI SURAT IZIN CUTI)</li>
            </ul>
          </div>
        )}
      </div>

      <div className="card-glass" style={{ padding: '0px', overflow: 'hidden' }}>
        <div className="desktop-only">
          <table className="table-piket" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', paddingLeft: '24px' }}>BRAND</th>
                <th style={{ textAlign: 'center' }}>NAMA</th>
                <th style={{ textAlign: 'center' }}>JADWAL PIKET</th>
              </tr>
            </thead>
            <tbody>
              {data.sales.map((row, idx) => {
                const color = data.colors[row.brand] || '#e2e8f0';
                const t1 = formatDate(row.toilet);
                const t2 = formatDate(row.toilet2);
                let displayText = 'Belum diatur';
                let badgeClass = 'badge-toilet empty';
                if (t1 && t2) { displayText = `${t1} • ${t2}`; badgeClass = 'badge-toilet'; }
                else if (t1 || t2) { displayText = t1 || t2; badgeClass = 'badge-toilet'; }
                
                return (
                  <tr key={row.id} className={idx % 2 === 1 ? 'pair-divider' : ''}>
                    <td style={{ fontWeight: 600, color: '#0f172a', textAlign: 'left', paddingLeft: '24px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: color, border: '2px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}></span>
                        {row.brand}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500, color: '#475569', textAlign: 'center' }}>{row.name}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`${badgeClass} ${!isAdmin ? 'admin-locked' : ''}`} onClick={() => openModal(idx)} style={{ cursor: isAdmin ? 'pointer' : 'not-allowed' }}>
                        {displayText === 'Belum diatur' ? (<span style={{ opacity: 0.6 }}>+ Pilih Tanggal</span>) : (<><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '6px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>{displayText}</>)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mobile-only" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.sales.map((row, idx) => {
            const color = data.colors[row.brand] || '#e2e8f0';
            const t1 = formatDate(row.toilet);
            const t2 = formatDate(row.toilet2);
            let displayText = 'Belum diatur';
            let badgeClass = 'badge-toilet empty';
            if (t1 && t2) { displayText = `${t1} • ${t2}`; badgeClass = 'badge-toilet'; }
            else if (t1 || t2) { displayText = t1 || t2; badgeClass = 'badge-toilet'; }

            return (
              <div key={row.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#0f172a' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }}></span>
                    {row.brand}
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{row.name}</span>
                </div>
                <span className={`${badgeClass} ${!isAdmin ? 'admin-locked' : ''}`} onClick={() => openModal(idx)} style={{ cursor: isAdmin ? 'pointer' : 'not-allowed' }}>
                  {displayText === 'Belum diatur' ? '+ Tanggal' : displayText}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {modalOpen && editIdx !== null && (
        <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-content">
            <h3>🗓️ Edit Piket Toilet</h3>
            <p className="sub">Brand: {data.sales[editIdx].brand} - Nama: {data.sales[editIdx].name}</p>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Tanggal Piket 1</label>
              <input type="date" value={tgl1} onChange={e => setTgl1(e.target.value)} style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Tanggal Piket 2 (Opsional)</label>
              <input type="date" value={tgl2} onChange={e => setTgl2(e.target.value)} style={{ width: '100%' }} />
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-modern btn-primary" style={{ flex: 1 }} onClick={saveDate}>Simpan</button>
              <button className="btn-modern btn-danger" onClick={clearDate}>Kosongkan</button>
            </div>
            <button className="btn-modern btn-outline" style={{ width: '100%', marginTop: '12px' }} onClick={closeModal}>Batal</button>
          </div>
        </div>
      )}
    </section>
  );
}