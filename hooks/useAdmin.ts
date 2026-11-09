'use client';
import { useState, useEffect, useCallback } from 'react';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth', { cache: 'no-store' });
      const data = await res.json();
      setIsAdmin(!!data.isAdmin);
    } catch {
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = useCallback(async (pin: string): Promise<boolean> => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });
    if (res.ok) { setIsAdmin(true); return true; }
    return false;
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setIsAdmin(false);
  }, []);

  return { isAdmin, loading, login, logout, refresh };
}