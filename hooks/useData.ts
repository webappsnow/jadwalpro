'use client';
import { useEffect, useState, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import type { AppData } from '@/lib/types';
import { DEFAULT_HARIAN, DEFAULT_SALES } from '@/lib/constants';

export function useData() {
  // PERBAIKAN: Gunakan DEFAULT_HARIAN sebagai inisialisasi awal agar tipenya sesuai
  const [data, setData] = useState<AppData>({
    sales: DEFAULT_SALES.map((s, i) => ({ ...s, id: `tmp-${i}` })),
    colors: {},
    harian: DEFAULT_HARIAN, 
  });
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'config', 'ufo_data'), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        
        // Pastikan data yang di-set dari Firebase juga sesuai tipenya
        setData({
          sales: (d.sales || []).map((s: any, i: number) => ({
            ...s,
            id: s.id || `sales-${i}-${Date.now()}`,
          })),
          colors: d.colors || {},
          // Jika d.harian kosong, gunakan DEFAULT_HARIAN agar tipenya aman
          harian: d.harian || DEFAULT_HARIAN,
        });
      } else {
        setData({
          sales: [],
          colors: {},
          harian: DEFAULT_HARIAN,
        });
      }
    });

    return () => unsub();
  }, []);

  const saveData = useCallback(async (newData: Partial<AppData>) => {
    setSyncing(true);
    
    // Update Layar Instan
    setData(prev => ({ ...prev, ...newData }));

    try {
      const payload = { ...data, ...newData };
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Gagal simpan');
      setSyncing(false);
      return true;
    } catch (error) {
      console.error(error);
      setSyncing(false);
      return false;
    }
  }, [data]);

  return { data, setData, saveData, syncing };
}