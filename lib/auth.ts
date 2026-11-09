import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';
import { auth } from './firebase';
import type { User } from 'firebase/auth';

// Ambil daftar email dari Environment Variable
const adminEmailsString = process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
const ADMIN_EMAILS = adminEmailsString.split(',').map(email => email.trim().toLowerCase());

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

export const checkIsAdmin = (user: User | null) => {
  if (!user || !user.email) return false;
  return ADMIN_EMAILS.includes(user.email.toLowerCase());
};