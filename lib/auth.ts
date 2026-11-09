import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET || 'fallback-secret-ganti-di-env');
const COOKIE_NAME = 'ufo_admin_session';
const SESSION_DURATION = 60 * 60 * 8;

export async function verifyPin(pin: string): Promise<boolean> {
  return pin === process.env.ADMIN_PIN;
}

export async function createSession(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(SECRET);
}

export async function verifySession(): Promise<boolean> {
   const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

export const SESSION_COOKIE = COOKIE_NAME;
export const SESSION_MAX_AGE = SESSION_DURATION;