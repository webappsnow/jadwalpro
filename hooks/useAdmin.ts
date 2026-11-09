'use client';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { checkIsAdmin, checkIsAllowed, loginWithGoogle, logout } from '@/lib/auth';

export function useAdmin(adminEmails: string[] = [], promotorEmails: string[] = []) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Cek apakah email ada di admin atau promotor
      const allowed = checkIsAllowed(currentUser, adminEmails, promotorEmails);
      const admin = checkIsAdmin(currentUser, adminEmails);
      
      if (currentUser && !allowed) {
        // Jika login tapi tidak terdaftar, jangan set user (biarkan login page yang handle)
        setUser(null);
        setIsAdmin(false);
      } else {
        setIsAdmin(admin);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [adminEmails, promotorEmails]);

  const login = async () => {
    await loginWithGoogle();
  };

  const signOutUser = async () => {
    await logout();
    setUser(null);
    setIsAdmin(false);
  };

  return { user, isAdmin, loading, login, logout: signOutUser };
}