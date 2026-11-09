'use client';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { checkIsAdmin, checkIsAllowed, loginWithGoogle, logout } from '@/lib/auth';

export function useAdmin(adminEmails: string[] = [], promotorEmails: string[] = []) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    // JIKA data admin belum termuat, tunggu (jangan lakukan pengecekan apa pun)
    if (adminEmails.length === 0 && promotorEmails.length === 0) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser && currentUser.email) {
        const isAllowed = checkIsAllowed(currentUser, adminEmails, promotorEmails);
        
        if (!isAllowed) {
          await signOut(auth);
          setUser(null);
          setIsAdmin(false);
          setUnauthorized(true);
        } else {
          setUser(currentUser);
          setIsAdmin(checkIsAdmin(currentUser, adminEmails));
          setUnauthorized(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setUnauthorized(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [adminEmails, promotorEmails]);

  const login = async () => {
    try {
      setUnauthorized(false);
      await loginWithGoogle();
    } catch (error) {
      console.error(error);
    }
  };

  const signOutUser = async () => {
    await logout();
    setUser(null);
    setIsAdmin(false);
  };

  return { user, isAdmin, loading, login, logout: signOutUser, unauthorized };
}