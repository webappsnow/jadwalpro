import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '800'] 
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'UFO Kebonsari · Jadwal',
  description: 'Sistem Jadwal Piket & Shift',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        {/* Script untuk menghapus IndexedDB Firebase secara paksa agar data lama hilang */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && window.indexedDB) {
                window.indexedDB.databases().then((dbs) => {
                  dbs.forEach((db) => {
                    if (db.name && db.name.includes('firestore')) {
                      window.indexedDB.deleteDatabase(db.name);
                    }
                  });
                }).catch(() => {});
              }
            `,
          }}
        />
      </head>
      <body className={jakarta.className}>{children}</body>
    </html>
  );
}