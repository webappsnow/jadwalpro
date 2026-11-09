'use client';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { checkIsAdmin, checkIsAllowed, loginWithGoogle, logout } from '@/lib/auth';

export function useAdmin(adminEmails: string[] = [], promotorEmails: string[] = []) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email) {
        const allowed = checkIsAllowed(currentUser, adminEmails, promotorEmails);
        const admin = checkIsAdmin(currentUser, adminEmails);

        if (!allowed) {
          setUser(null);
          setIsAdmin(false);
          setUnauthorized(true);
        } else {
          setUser(currentUser);
          setIsAdmin(admin);
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
    await loginWithGoogle();
  };

  const signOutUser = async () => {
    await logout();
    setUser(null);
    setIsAdmin(false);
  };

  return { user, isAdmin, loading, login, logout: signOutUser, unauthorized };
}