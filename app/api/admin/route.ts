import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  // Cek apakah user sudah login sebagai Admin
  if (!(await verifySession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Pastikan body memiliki data yang valid
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Siapkan data yang akan disimpan
    const dataToSave = {
      sales: body.sales || [],
      colors: body.colors || {},
      harian: body.harian || {},
      updatedAt: new Date().toISOString()
    };

    // Simpan ke Firestore (merge: true agar tidak menghapus data lain)
    await setDoc(doc(db, 'config', 'ufo_data'), dataToSave, { merge: true });
    
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Firestore error:', e);
    return NextResponse.json({ error: e.message || 'Firestore error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { getDoc } = await import('firebase/firestore');
    const snap = await getDoc(doc(db, 'config', 'ufo_data'));
    return NextResponse.json(snap.exists() ? snap.data() : null);
  } catch (e) {
    return NextResponse.json({ error: 'Firestore error' }, { status: 500 });
  }
}