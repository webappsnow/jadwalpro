'use client';
import { useEffect, useState, useCallback } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import type { AppData } from '@/lib/types';
import { DEFAULT_HARIAN } from '@/lib/constants';

const EMPTY_DATA: AppData = {
  sales: [],
  colors: {},
  harian: DEFAULT_HARIAN,
  adminEmails: [],
  promotorEmails: [],
};

export function useData() {
  const [data, setData] = useState<AppData>(EMPTY_DATA);
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let unsubSnapshot: (() => void) | null = null;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const cleanupSnapshot = () => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      if (unsubSnapshot) {
        unsubSnapshot();
        unsubSnapshot = null;
      }
    };

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      cleanupSnapshot();

      if (!user || !user.email) {
        setAuthorized(false);
        setData(EMPTY_DATA);
        setLoading(false);
        return;
      }

      const currentEmail = user.email.trim().toLowerCase();
      setLoading(true);

      // Timeout pengaman: Jika 5 detik tidak ada respons, paksa selesai loading
      timeout = setTimeout(() => {
        setLoading(false);
      }, 5000);

      unsubSnapshot = onSnapshot(
        doc(db, 'config', 'ufo_data'),
        async (snap) => {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }

          if (!snap.exists()) {
            setAuthorized(false);
            setData(EMPTY_DATA);
            await signOut(auth);
            setLoading(false);
            return;
          }

          const d = snap.data();
          const adminEmails: string[] = Array.isArray(d.adminEmails) ? d.adminEmails : [];
          const promotorEmails: string[] = Array.isArray(d.promotorEmails) ? d.promotorEmails : [];
          const allowedList = [...adminEmails, ...promotorEmails]
            .filter((e): e is string => typeof e === 'string')
            .map((e) => e.trim().toLowerCase());

          const isAllowed = allowedList.includes(currentEmail);

          if (!isAllowed) {
            setAuthorized(false);
            setData(EMPTY_DATA);
            await signOut(auth);
            setLoading(false);
            return;
          }

          setAuthorized(true);
          setData({
            sales: (d.sales || []).map((s: any, i: number) => ({
              ...s,
              id: s.id || `sales-${i}-${Date.now()}`,
            })),
            colors: d.colors || {},
            harian: d.harian || DEFAULT_HARIAN,
            adminEmails,
            promotorEmails,
          });
          setLoading(false);
        },
        (error) => {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }
          console.warn('Gagal baca data:', error);
          setAuthorized(false);
          setData(EMPTY_DATA);
          setLoading(false);
        }
      );
    });

    return () => {
      cleanupSnapshot();
      unsubAuth();
    };
  }, []);

  const saveData = useCallback(
    async (newData: Partial<AppData>) => {
      if (!auth.currentUser || !authorized) {
        console.warn('Akses ditolak: user tidak terdaftar.');
        return false;
      }

      setSyncing(true);
      setData((prev) => ({ ...prev, ...newData }));

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
    },
    [data, authorized]
  );

  return { data, setData, saveData, syncing, loading, authorized };
}