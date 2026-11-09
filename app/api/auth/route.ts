import { NextRequest, NextResponse } from 'next/server';
import { verifyPin, createSession, verifySession, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { pin } = await req.json();
  if (!pin || typeof pin !== 'string') {
    return NextResponse.json({ error: 'PIN wajib diisi' }, { status: 400 });
  }

  // Cek PIN di server (tidak terekspos ke browser)
  if (!(await verifyPin(pin))) {
    return NextResponse.json({ error: 'PIN salah' }, { status: 401 });
  }

  // Buat token JWT
  const token = await createSession();
  const res = NextResponse.json({ success: true });
  
  // Set HttpOnly Cookie (tidak bisa dicuri via JS/XSS)
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
  return res;
}

export async function GET() {
  return NextResponse.json({ isAdmin: await verifySession() });
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}