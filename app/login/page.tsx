'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { loginWithGoogle } from '@/lib/auth'

/* ===== GANTI NAMA DI SINI ===== */
const NAMA_TOKO = 'UFO KEBONSARI'
const NAMA_APLIKASI = 'Jadwal Piket & Shift'
/* ============================== */

export default function LoginPage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true) // true: cek sesi dulu, form tidak berkedip
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [error, setError] = useState('')

  // Kunci scroll halaman login
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const prevHtml = html.style.overflow
    const prevBody = body.style.overflow
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prevHtml
      body.style.overflow = prevBody
    }
  }, [])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user || !user.email) {
        setIsChecking(false)
        return
      }
      setIsChecking(true)
      try {
        const docSnap = await getDoc(doc(db, 'config', 'ufo_data'))
        const data = docSnap.exists() ? docSnap.data() : {}
        const adminEmails: string[] = data.adminEmails || []
        const promotorEmails: string[] = data.promotorEmails || []
        const email = user.email.toLowerCase()
        const isAllowed =
          adminEmails.some((e) => e.toLowerCase() === email) ||
          promotorEmails.some((e) => e.toLowerCase() === email)

        if (isAllowed) {
          router.replace('/shift')
          return // spinner tetap tampil sampai pindah halaman
        }
        await auth.signOut()
        setError('Email Anda belum terdaftar. Silakan hubungi Admin.')
      } catch (err) {
        console.error(err) // error jaringan: jangan logout, tampilkan form
        setError('Gagal memeriksa akun. Periksa koneksi lalu coba lagi.')
      }
      setIsChecking(false)
    })
    return () => unsub()
  }, [router])

  const handleLogin = async () => {
    setError('')
    setIsLoggingIn(true)
    try {
      await loginWithGoogle()
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request') {
        console.error(err)
        setError('Login gagal. Coba lagi.')
      }
    } finally {
      setIsLoggingIn(false)
    }
  }

  const busy = isChecking || isLoggingIn

  return (
    <>
      <style>{`@keyframes loginSpin { to { transform: rotate(360deg); } }`}</style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          height: '100dvh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          background: 'linear-gradient(135deg, #f0f4f9 0%, #f8fafc 100%)',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '380px',
            padding: '32px 28px',
            borderRadius: '28px',
            textAlign: 'center',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 50px -12px rgba(15, 23, 42, 0.18)',
          }}
        >
          <img
            src="/logo-ufo.png"
            alt="Logo UFO"
            style={{
              width: '110px',
              height: '110px',
              objectFit: 'cover',
              borderRadius: '18px',
              margin: '0 auto',
              display: 'block',
              boxShadow: '0 8px 20px rgba(14, 165, 233, 0.25)',
            }}
          />

          <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '18px 0 4px' }}>
            {NAMA_TOKO}
          </p>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0ea5e9', margin: '0 0 22px' }}>
            {NAMA_APLIKASI}
          </h2>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
            Selamat Datang
          </h1>
          <p style={{ color: '#64748b', margin: '0 0 22px', fontSize: '0.875rem', lineHeight: 1.5 }}>
            {isChecking ? 'Memeriksa akun...' : 'Silakan login dengan akun Google Anda untuk mengakses jadwal.'}
          </p>

          {error && (
            <div
              role="alert"
              style={{
                marginBottom: '16px',
                padding: '10px 12px',
                borderRadius: '12px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                fontSize: '0.8rem',
                textAlign: 'left',
              }}
            >
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={busy}
            style={{
              width: '100%',
              height: '54px',
              border: 'none',
              borderRadius: '999px',
              cursor: busy ? 'not-allowed' : 'pointer',
              opacity: busy ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: 700,
              background: 'linear-gradient(90deg, #1d4ed8 0%, #0891b2 100%)',
              boxShadow: '0 10px 24px -6px rgba(29, 78, 216, 0.5)',
              transition: 'transform 0.15s ease, filter 0.15s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {busy ? (
              <span
                style={{
                  width: '20px',
                  height: '20px',
                  border: '3px solid rgba(255,255,255,0.4)',
                  borderTopColor: '#ffffff',
                  borderRadius: '50%',
                  animation: 'loginSpin 0.8s linear infinite',
                }}
              />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            {isLoggingIn ? 'Menghubungkan...' : 'Login with Google'}
          </button>
        </div>
      </div>
    </>
  )
}