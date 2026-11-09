import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { auth } from './firebase'; // Pastikan auth diekspor dari firebase.ts

// Daftar email Admin (Ganti dengan email Anda dan rekan admin)
const ADMIN_EMAILS = [
  'ufokebonsarimalang@gmail.com', 
  'emailadmin2@gmail.com'
];

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