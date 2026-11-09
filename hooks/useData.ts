'use client';
import { useEffect, useState, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import type { AppData } from '@/lib/types';

export function useData() {
  const [data, setData] = useState<AppData>({
    sales: [],
    colors: {},
    harian: {}, 
  });
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'config', 'ufo_data'), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setData({
          sales: (d.sales || []).map((s: any, i: number) => ({
            ...s,
            id: s.id || `sales-${i}-${Date.now()}`,
          })),
          colors: d.colors || {},
          harian: d.harian || {},
        });
      } else {
        setData({
          sales: [],
          colors: {},
          harian: {},
        });
      }
    });

    return () => unsub();
  }, []);

  const saveData = useCallback(async (newData: Partial<AppData>) => {
    setSyncing(true);
    
    // 1. Update Layar Instan
    setData(prev => ({ ...prev, ...newData }));

    try {
      // 2. Paksa timpa data lama dengan data baru di Firebase
      const payload = { ...data, ...newData };
      await setDoc(doc(db, 'config', 'ufo_data'), payload, { merge: true });
      
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