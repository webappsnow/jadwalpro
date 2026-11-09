'use client';
import { useState, useEffect } from 'react';
import { useData } from '@/hooks/useData';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/useToast';
import { HARI_ORDER, HARI_LABELS, TUGAS_OPTIONS } from '@/lib/constants';
import { ConfirmModal } from '@/components/ConfirmModal';

// Fungsi warna kontras
function getContrastYIQ(hexcolor: string){
    if(!hexcolor || hexcolor.indexOf('#') !== 0) return '#ffffff';
    hexcolor = hexcolor.replace("#", "");
    if(hexcolor.length === 3) hexcolor = hexcolor.split('').map(c => c+c).join('');
    var r = parseInt(hexcolor.substr(0,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 150) ? '#0f172a' : '#ffffff';
}

export default function HarianPage() {
  const { data, saveData } = useData();
  const { isAdmin } = useAdmin();
  const { show } = useToast();
  
  const [activeDay, setActiveDay] = useState<string>('senin');
  
  const [localHarian, setLocalHarian] = useState(data.harian);

  useEffect(() => {
    setLocalHarian(data.harian);
  }, [data.harian]);

  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [editHarian, setEditHarian] = useState<{day: string, area: string, tugas: string, brandIndex: number, brand: string} | null>(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addTarget, setAddTarget] = useState<{day: string, area: string, tugas: string} | null>(null);

  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({ isOpen: false, title: '', message: '', action: () => {} });

  const openConfirm = (title: string, message: string, action: () => void) => {
    setConfirmState({ isOpen: true, title, message, action });
  };
  const closeConfirm = () => setConfirmState(prev => ({ ...prev, isOpen: false }));

  const dayData = localHarian[activeDay as keyof typeof localHarian] || {};
  const areas = Object.keys(dayData).sort((a, b) => {
    const order = ['LANTAI 1', 'LANTAI 2/AV', 'FREEZER'];
    const indexA = order.indexOf(a.toUpperCase());
    const indexB = order.indexOf(b.toUpperCase());
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const openMoveModal = (day: string, area: string, tugas: string, brandIndex: number) => {
    if (!isAdmin) return;
    const brand = localHarian[day as keyof typeof localHarian]?.[area]?.[tugas]?.[brandIndex];
    if (!brand) return;
    setEditHarian({ day, area, tugas, brandIndex, brand });
    setMoveModalOpen(true);
  };

  const handleMove = async (targetTugas: string) => {
    if (!editHarian) return;
    const { day, area, tugas, brandIndex, brand } = editHarian;
    if (tugas === targetTugas) { setMoveModalOpen(false); return; }

    const newHarian = JSON.parse(JSON.stringify(localHarian));
    newHarian[day as keyof typeof localHarian][area][tugas].splice(brandIndex, 1);
    if (!newHarian[day as keyof typeof localHarian][area][targetTugas]) {
      newHarian[day as keyof typeof localHarian][area][targetTugas] = [];
    }
    newHarian[day as keyof typeof localHarian][area][targetTugas].push(brand);

    setLocalHarian(newHarian);
    setMoveModalOpen(false);
    show(`${brand} dipindah ke ${targetTugas}`);

    const ok = await saveData({ harian: newHarian });
    if (!ok) {
      show('Gagal menyimpan ke database', true);
      setLocalHarian(data.harian); 
    }
  };

  const removeBrand = async (day: string, area: string, tugas: string, brandIndex: number, ev: React.MouseEvent) => {
    ev.stopPropagation();
    if (!isAdmin) return;
    const brand = localHarian[day as keyof typeof localHarian]?.[area]?.[tugas]?.[brandIndex];
    if (!brand) return;

    openConfirm(
      'Hapus Brand',
      `Apakah Anda yakin ingin menghapus brand "${brand}" dari tugas ${tugas}?`,
      async () => {
        const newHarian = JSON.parse(JSON.stringify(localHarian));
        newHarian[day as keyof typeof localHarian][area][tugas].splice(brandIndex, 1);
        
        setLocalHarian(newHarian);
        show(`${brand} dihapus`);

        const ok = await saveData({ harian: newHarian });
        if (!ok) {
          show('Gagal menghapus di database', true);
          setLocalHarian(data.harian);
        }
        closeConfirm();
      }
    );
  };

  const openAddModal = (day: string, area: string, tugas: string) => {
    if (!isAdmin) return;
    setAddTarget({ day, area, tugas });
    setAddModalOpen(true);
  };

  const handleAddBrand = async (brand: string) => {
    if (!addTarget) return;
    const { day, area, tugas } = addTarget;
    
    const existing = localHarian[day as keyof typeof localHarian]?.[area]?.[tugas] || [];
    if (existing.includes(brand)) {
      show('Brand sudah ada di tugas ini', true);
      return;
    }

    const newHarian = JSON.parse(JSON.stringify(localHarian));
    if (!newHarian[day as keyof typeof localHarian][area][tugas]) {
      newHarian[day as keyof typeof localHarian][area][tugas] = [];
    }
    newHarian[day as keyof typeof localHarian][area][tugas].push(brand);
    
    setLocalHarian(newHarian);
    setAddModalOpen(false);
    show(`${brand} ditambahkan`);

    const ok = await saveData({ harian: newHarian });
    if (!ok) {
      show('Gagal menambahkan ke database', true);
      setLocalHarian(data.harian);
    }
  };

  const allBrands = Array.from(new Set([
    ...data.sales.map(s => s.brand.toUpperCase()),
    ...Object.keys(data.colors).map(b => b.toUpperCase())
  ])).sort();

  const sortTugas = (keys: string[]) => {
    const order = ['MENYAPU', 'MENGEPEL', 'CLEAN BRAND NON PROMOTOR + TANGGA', 'GENERAL CLEANING (SETELAH PIKET)'];
    return [...keys].sort((a, b) => {
      const indexA = order.indexOf(a);
      const indexB = order.indexOf(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  };

  const renderBrandChips = (brands: string[], day: string, area: string, tugas: string) => {
    if (!brands || brands.length === 0) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span className="brand-chip empty">—</span>
          {isAdmin && tugas !== 'GENERAL CLEANING (SETELAH PIKET)' && (
            <button onClick={() => openAddModal(day, area, tugas)} style={{ fontSize: '0.65rem', padding: '4px 8px', borderRadius: '20px', border: '1px dashed #cbd5e1', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
              + Brand
            </button>
          )}
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {brands.map((b, bi) => {
          const baseColor = data.colors[b.toUpperCase()] || '#3b82f6';
          const textColor = getContrastYIQ(baseColor);
          return (
            <span 
              key={bi} 
              className="brand-chip"
              style={{ background: baseColor, color: textColor, borderColor: baseColor, cursor: isAdmin ? 'pointer' : 'default' }}
              onClick={() => isAdmin ? openMoveModal(day, area, tugas, bi) : null}
            >
              {b}
              {isAdmin && (
                <span onClick={(e) => removeBrand(day, area, tugas, bi, e)} style={{ marginLeft: '4px', opacity: 0.6, fontSize: '0.8rem' }}>✕</span>
              )}
            </span>
          );
        })}
        {isAdmin && tugas !== 'GENERAL CLEANING (SETELAH PIKET)' && (
          <button onClick={() => openAddModal(day, area, tugas)} style={{ fontSize: '0.65rem', padding: '4px 8px', borderRadius: '20px', border: '1px dashed #cbd5e1', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
            + Brand
          </button>
        )}
      </div>
    );
  };

  const isWeekend = activeDay === 'sabtu' || activeDay === 'minggu';

  return (
    <section>
      <div style={{ marginBottom: '12px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>Jadwal Piket Harian</h2>
      </div>

      <div style={{ marginBottom: '24px', maxWidth: '300px' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
          Pilih Hari
        </label>
        <div style={{ position: 'relative' }}>
          <select 
            value={activeDay}
            onChange={(e) => setActiveDay(e.target.value)}
            className="admin-input"
            style={{ width: '100%', padding: '12px 16px', fontSize: '1rem', fontWeight: 600, color: '#0f172a', appearance: 'none', background: 'white', cursor: 'pointer', borderRadius: '40px', border: '2px solid #e2e8f0' }}
          >
            {HARI_ORDER.map(day => (
              <option key={day} value={day}>{HARI_LABELS[day]}</option>
            ))}
          </select>
          <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="card-glass" style={{ padding: '0px', borderRadius: '16px', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
        {areas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>Belum ada data untuk hari ini.</div>
        ) : (
          <>
            <div className="desktop-only">
              <table className="table-harian" style={{ width: '100%', tableLayout: 'fixed' }}>
                <thead>
                  <tr>
                    <th style={{ width: '120px', textAlign: 'center' }}>AREA</th>
                    <th style={{ width: '280px', textAlign: 'left', paddingLeft: '16px' }}>TUGAS</th>
                    <th style={{ textAlign: 'left', paddingLeft: '16px' }}>BRAND PENANGGUNG JAWAB</th>
                  </tr>
                </thead>
                <tbody>
                  {areas.map(area => {
                    const tugasMap = dayData[area] || {};
                    const tugasKeys = sortTugas(Object.keys(tugasMap)).filter(tugas => {
                      // Sembunyikan General Cleaning jika bukan weekend
                      if (tugas.includes('GENERAL CLEANING') && !isWeekend) return false;
                      return true;
                    });

                    if (tugasKeys.length === 0) {
                      return (
                        <tr key={area} className="area-start">
                          <td className="area-cell" style={{ textAlign: 'center' }}>{area}</td>
                          <td className="tugas-cell">-</td>
                          <td><span className="brand-chip empty">-</span></td>
                        </tr>
                      );
                    }
                    return tugasKeys.map((tugas, i) => {
                      const brands = tugasMap[tugas] || [];
                      const isGeneralCleaning = tugas.includes('GENERAL CLEANING');
                      return (
                        <tr key={`${area}-${tugas}`} className={i === 0 ? 'area-start' : ''}>
                          {i === 0 && <td className="area-cell" rowSpan={tugasKeys.length} style={{ textAlign: 'center', verticalAlign: 'middle' }}>{area}</td>}
                          <td className="tugas-cell" style={{ whiteSpace: 'normal', lineHeight: '1.3', paddingLeft: '16px' }}>
                            {tugas}
                          </td>
                          <td style={{ paddingLeft: '16px', textAlign: 'left' }}>
                            {isGeneralCleaning ? (
                              <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>Semua Promotor Shift Pagi</span>
                            ) : (
                              renderBrandChips(brands, activeDay, area, tugas)
                            )}
                          </td>
                        </tr>
                      );
                    });
                  })}
                </tbody>
              </table>
            </div>

            <div className="mobile-only" style={{ padding: '16px' }}>
              {areas.map(area => {
                const tugasMap = dayData[area] || {};
                const tugasKeys = sortTugas(Object.keys(tugasMap)).filter(tugas => {
                  if (tugas.includes('GENERAL CLEANING') && !isWeekend) return false;
                  return true;
                });
                
                if (tugasKeys.length === 0) return null; // Jika tidak ada tugas, jangan tampilkan card area
                
                return (
                  <div key={area} className="harian-card">
                    <div className="area-title">{area}</div>
                    {tugasKeys.map(tugas => {
                      const isGeneralCleaning = tugas.includes('GENERAL CLEANING');
                      return (
                        <div key={tugas} style={{ display: 'flex', flexDirection: 'column', gap: '3px', padding: '5px 0', borderBottom: '1px dashed #eef2f6' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>{tugas}</span>
                          <div>
                            {isGeneralCleaning ? (
                              <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>Semua Promotor Shift Pagi</span>
                            ) : (
                              renderBrandChips(tugasMap[tugas] || [], activeDay, area, tugas)
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="card-glass" style={{ padding: '16px', borderRadius: '16px', marginTop: '12px', borderLeft: '4px solid #34d399', background: 'rgba(236, 253, 245, 0.8)' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#1e293b', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#059669' }}>🧹</span> General Cleaning
        </h3>
        <p style={{ fontSize: '0.75rem', color: '#334155', margin: 0 }}>
          <strong>HARI SABTU & MINGGU:</strong> GENERAL CLEANING WAJIB UNTUK SEMUA YANG SHIFT PAGI (SETELAH PIKET HARIAN SELESAI).
        </p>
      </div>

      {moveModalOpen && editHarian && (
        <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && setMoveModalOpen(false)}>
          <div className="modal-content">
            <h3>➡️ Pindahkan Brand</h3>
            <p className="sub">Pindahkan <strong>{editHarian.brand}</strong> dari tugas {editHarian.tugas}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {TUGAS_OPTIONS.map(opt => (
                <button 
                  key={opt}
                  className={`tugas-option-btn ${opt === editHarian.tugas ? 'active' : ''}`}
                  onClick={() => handleMove(opt)}
                  style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: opt === editHarian.tugas ? '#f8fafc' : 'white', cursor: 'pointer', fontWeight: 600 }}
                >
                  <span>{opt}</span>
                  {opt === editHarian.tugas && <span style={{ fontSize: '0.65rem', background: '#e2e8f0', padding: '2px 6px', borderRadius: '10px' }}>SAAT INI</span>}
                </button>
              ))}
            </div>
            <button className="btn-modern btn-outline" style={{ width: '100%' }} onClick={() => setMoveModalOpen(false)}>Batal</button>
          </div>
        </div>
      )}

      {addModalOpen && addTarget && (
        <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && setAddModalOpen(false)}>
          <div className="modal-content">
            <h3>➕ Tambah Brand</h3>
            <p className="sub">Area: {addTarget.area} · Tugas: {addTarget.tugas}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '240px', overflowY: 'auto', marginBottom: '16px' }}>
              {allBrands.length === 0 ? (
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Belum ada brand terdaftar di Panel Admin.</span>
              ) : (
                allBrands.map(b => {
                  const color = data.colors[b] || '#3b82f6';
                  const isExist = (localHarian[addTarget.day as keyof typeof localHarian]?.[addTarget.area]?.[addTarget.tugas] || []).includes(b);
                  return (
                    <button 
                      key={b}
                      onClick={() => handleAddBrand(b)}
                      disabled={isExist}
                      style={{ 
                        padding: '6px 14px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem',
                        background: isExist ? '#e2e8f0' : color, 
                        color: isExist ? '#94a3b8' : '#fff', 
                        border: 'none', cursor: isExist ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {b} {isExist && '✓'}
                    </button>
                  );
                })
              )}
            </div>
            <button className="btn-modern btn-outline" style={{ width: '100%' }} onClick={() => setAddModalOpen(false)}>Batal</button>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={confirmState.action}
        onCancel={closeConfirm}
        isDanger={true}
      />
    </section>
  );
}