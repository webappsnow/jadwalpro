'use client';
import { useState, useMemo } from 'react';
import { useData } from '@/hooks/useData';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/useToast';

const NAMA_HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const NAMA_BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

// --- KUMPULAN SVG ICON ---
const IconLock = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const IconCheck = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconWarning = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const IconCalendar = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default function PiketPage() {
  const { data, saveData } = useData();
  const { isAdmin } = useAdmin(data.adminEmails);
  const { show } = useToast();

  const [bulanAcuan, setBulanAcuan] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);

  const config = (data as any).piketConfig || {
    antrian: data.sales.map((s: any) => s.id),
    posisi: 0,
    lastSavedMonth: '',
  };

  const isPagi = (row: any, tanggal: Date) => {
    const hariIndex = tanggal.getDay();
    const hariMap = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
    const shift = (row[hariMap[hariIndex]] || '').toUpperCase();
    return shift === 'P' || shift === 'L'; // P = Pagi, L = Lembur
  };

  const jadwalBulanIni = useMemo(() => {
    const tahun = bulanAcuan.getFullYear();
    const bulan = bulanAcuan.getMonth();
    const jumlahHari = new Date(tahun, bulan + 1, 0).getDate();

    const hasil: { tanggal: Date; sales: any }[] = [];
    let posisi = config.posisi || 0;
    const antrian = config.antrian || data.sales.map((s: any) => s.id);

    for (let tgl = 1; tgl <= jumlahHari; tgl++) {
      const tanggal = new Date(tahun, bulan, tgl);
      let foundIdx = -1;
      
      for (let i = 0; i < antrian.length; i++) {
        const idx = (posisi + i) % antrian.length;
        const row = data.sales.find((s: any) => s.id === antrian[idx]);
        if (row && isPagi(row, tanggal)) {
          foundIdx = idx;
          hasil.push({ tanggal, sales: row });
          break;
        }
      }
      if (foundIdx !== -1) posisi = (foundIdx + 1) % antrian.length;
    }

    return hasil;
  }, [bulanAcuan, data.sales, config.antrian, config.posisi]);

  const handleTutupBuku = async () => {
    if (!isAdmin) return;
    if (jadwalBulanIni.length === 0) return;

    const bulanStr = `${bulanAcuan.getFullYear()}-${String(bulanAcuan.getMonth() + 1).padStart(2, '0')}`;
    
    if (confirm(`Kunci jadwal bulan ${NAMA_BULAN[bulanAcuan.getMonth()]} dan sambungkan ke bulan depan?`)) {
      setIsSaving(true);
      
      const antrian = config.antrian || data.sales.map((s: any) => s.id);
      const lastSales = jadwalBulanIni[jadwalBulanIni.length - 1].sales;
      const lastIdx = antrian.indexOf(lastSales.id);
      const nextPosisi = (lastIdx + 1) % antrian.length;

      const ok = await saveData({ 
        piketConfig: { 
          ...config, 
          posisi: nextPosisi,
          lastSavedMonth: bulanStr
        } 
      } as any);

      setIsSaving(false);
      if (ok) show(`Berhasil! Bulan depan lanjut dari: ${data.sales.find((s:any) => s.id === antrian[nextPosisi])?.name}`);
      else show('Gagal menyimpan', true);
    }
  };

  const prevBulan = () => {
    const d = new Date(bulanAcuan);
    d.setMonth(d.getMonth() - 1);
    setBulanAcuan(d);
  };
  const nextBulan = () => {
    const d = new Date(bulanAcuan);
    d.setMonth(d.getMonth() + 1);
    setBulanAcuan(d);
  };

  const hariIni = new Date();
  const jadwalHariIni = jadwalBulanIni.find(j => j.tanggal.toDateString() === hariIni.toDateString());
  const bulanIniStr = `${bulanAcuan.getFullYear()}-${String(bulanAcuan.getMonth() + 1).padStart(2, '0')}`;
  const sudahDikunci = config.lastSavedMonth === bulanIniStr;

  return (
    <section>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>Jadwal Piket Toilet</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '4px' }}>Otomatis dari shift Pagi & Lembur, dengan sistem antrian adil.</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '6px 12px', borderRadius: '40px', border: '1.5px solid #e2e8f0' }}>
          <button onClick={prevBulan} style={{ background: 'white', border: '1.5px solid #e2e8f0', width: '34px', height: '34px', borderRadius: '50%', cursor: 'pointer', fontWeight: 700 }}>‹</button>
          <span style={{ fontWeight: 600, color: '#1e293b', minWidth: '130px', textAlign: 'center' }}>
            {NAMA_BULAN[bulanAcuan.getMonth()]} {bulanAcuan.getFullYear()}
          </span>
          <button onClick={nextBulan} style={{ background: 'white', border: '1.5px solid #e2e8f0', width: '34px', height: '34px', borderRadius: '50%', cursor: 'pointer', fontWeight: 700 }}>›</button>
        </div>
      </div>

      {isAdmin && (
        <div style={{ marginBottom: '24px', background: sudahDikunci ? '#f0fdf4' : '#fffbeb', border: `1px solid ${sudahDikunci ? '#bbf7d0' : '#fde68a'}`, padding: '16px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontWeight: 700, color: sudahDikunci ? '#166534' : '#b45309', fontSize: '0.95rem', display: 'flex', alignItems: 'center' }}>
              {sudahDikunci ? <IconCheck /> : <IconWarning />}
              {sudahDikunci ? 'Jadwal bulan ini sudah dikunci & disambungkan ke bulan depan' : 'Jadwal bulan ini belum dikunci'}
            </div>
            <div style={{ fontSize: '0.85rem', color: sudahDikunci ? '#15803d' : '#92400e', marginTop: '4px' }}>
              {sudahDikunci ? 'Posisi antrian terakhir sudah tersimpan.' : 'Klik tombol Tutup Buku jika bulan ini sudah selesai agar bulan depan antrian menyambung.'}
            </div>
          </div>
          
          <button 
            onClick={handleTutupBuku} 
            disabled={sudahDikunci || isSaving}
            style={{ 
              padding: '10px 20px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, 
              background: sudahDikunci ? '#e2e8f0' : '#1e293b', 
              color: sudahDikunci ? '#94a3b8' : 'white', 
              border: 'none', cursor: sudahDikunci ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center'
            }}
          >
            {isSaving ? 'Menyimpan...' : sudahDikunci ? 'Sudah Dikunci' : <><IconLock /> Tutup Buku & Sambung</>}
          </button>
        </div>
      )}

      <div className="card-glass" style={{ marginBottom: '24px', background: '#eff6ff', borderLeft: '4px solid #3b82f6', padding: '20px', borderRadius: '12px' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1d4ed8', marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
          <IconCalendar />
          Piket Toilet Hari Ini ({NAMA_HARI[hariIni.getDay()]}, {hariIni.getDate()} {NAMA_BULAN[hariIni.getMonth()]})
        </div>
        {jadwalHariIni ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: data.colors[jadwalHariIni.sales.brand] || '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              {jadwalHariIni.sales.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>{jadwalHariIni.sales.name}</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>{jadwalHariIni.sales.brand}</div>
            </div>
          </div>
        ) : (
          <div style={{ color: '#64748b', fontStyle: 'italic' }}>Tidak ada jadwal piket untuk hari ini.</div>
        )}
      </div>

      <div className="card-glass" style={{ padding: '0px', overflow: 'hidden' }}>
        <div className="desktop-only">
          <table className="table-piket" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', background: '#f8fafc' }}>
                <th style={{ padding: '12px 24px', width: '80px', fontSize: '0.8rem', color: '#64748b' }}>TGL</th>
                <th style={{ padding: '12px', fontSize: '0.8rem', color: '#64748b' }}>HARI</th>
                <th style={{ padding: '12px', fontSize: '0.8rem', color: '#64748b' }}>BRAND</th>
                <th style={{ padding: '12px', fontSize: '0.8rem', color: '#64748b' }}>PETUGAS PIKET</th>
              </tr>
            </thead>
            <tbody>
              {jadwalBulanIni.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 1 ? '#f8fafc' : 'white' }}>
                  <td style={{ padding: '12px 24px', fontWeight: 700, color: '#1d4ed8' }}>{item.tanggal.getDate()}</td>
                  <td style={{ padding: '12px', color: '#475569' }}>{NAMA_HARI[item.tanggal.getDay()]}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: data.colors[item.sales.brand] || '#e2e8f0' }}></span>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.sales.brand}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', fontWeight: 500, color: '#0f172a' }}>{item.sales.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mobile-only" style={{ padding: '16px' }}>
          {jadwalBulanIni.map((item, idx) => (
            <div key={idx} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#1d4ed8' }}>{item.tanggal.getDate()} {NAMA_BULAN[bulanAcuan.getMonth()].substring(0,3)}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{NAMA_HARI[item.tanggal.getDay()]}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.sales.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.sales.brand}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}