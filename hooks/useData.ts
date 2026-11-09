'use client';
import { useEffect, useState, useCallback } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import type { AppData } from '@/lib/types';
import { DEFAULT_HARIAN } from '@/lib/constants';

export function useData() {
  const [data, setData] = useState<AppData>({
    sales: [],
    colors: {},
    harian: DEFAULT_HARIAN,
    adminEmails: [],
    promotorEmails: [],
  });
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubSnapshot: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (unsubSnapshot) {
        unsubSnapshot();
        unsubSnapshot = null;
      }

      if (user) {
        unsubSnapshot = onSnapshot(doc(db, 'config', 'ufo_data'), (snap) => {
          if (snap.exists()) {
            const d = snap.data();
            setData({
              sales: (d.sales || []).map((s: any, i: number) => ({
                ...s,
                id: s.id || `sales-${i}-${Date.now()}`,
              })),
              colors: d.colors || {},
              harian: d.harian || DEFAULT_HARIAN,
              adminEmails: d.adminEmails || [],
              promotorEmails: d.promotorEmails || [],
            });
          }
          setLoading(false);
        }, (error) => {
          console.warn("Gagal baca data:", error);
          setData({ sales: [], colors: {}, harian: DEFAULT_HARIAN, adminEmails: [], promotorEmails: [] });
          setLoading(false);
        });
      } else {
        setData({ sales: [], colors: {}, harian: DEFAULT_HARIAN, adminEmails: [], promotorEmails: [] });
        setLoading(false);
      }
    });

    return () => {
      if (unsubSnapshot) unsubSnapshot();
      unsubAuth();
    };
  }, []);

  const saveData = useCallback(async (newData: Partial<AppData>) => {
    setSyncing(true);
    setData(prev => ({ ...prev, ...newData }));

    try {
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

  return { data, setData, saveData, syncing, loading };
}