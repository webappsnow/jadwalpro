'use client';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { checkIsAdmin, loginWithGoogle, logout } from '@/lib/auth';

export function useAdmin(adminEmails: string[] = [], promotorEmails: string[] = []) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAdmin(checkIsAdmin(currentUser, adminEmails));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [adminEmails]);

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