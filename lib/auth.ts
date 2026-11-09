import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';
import { auth } from './firebase';
import type { User } from 'firebase/auth';

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Login gagal:", error);
    throw error;
  }
};

export const logout = async () => {
  await signOut(auth);
};

export const checkIsAdmin = (user: User | null, adminEmails: string[]) => {
  if (!user || !user.email) return false;
  // Bersihkan spasi dan jadikan huruf kecil semua sebelum dibandingkan
  const cleanUserEmail = user.email.trim().toLowerCase();
  const cleanAdminEmails = adminEmails.map(e => e.trim().toLowerCase());
  
  return cleanAdminEmails.includes(cleanUserEmail);
};