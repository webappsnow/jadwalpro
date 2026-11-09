'use client';
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface ToastCtx {
  show: (msg: string, isError?: boolean) => void;
}

const Ctx = createContext<ToastCtx>({ show: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ msg: string; isError: boolean } | null>(null);

  const show = useCallback((msg: string, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 2500);
  }, []);

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      {toast && (
        <div
          className={`toast-notification show`}
          style={toast.isError ? { background: 'linear-gradient(135deg,#f87171,#dc2626)' } : undefined}
        >
          <span>{toast.isError ? '⚠️' : '✓'}</span>
          <span>{toast.msg}</span>
        </div>
      )}
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);