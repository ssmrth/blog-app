import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: '', visible: false, type: 'info' });

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, visible: true, type });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast.visible && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: toast.type === 'error' ? '#b91c1c' : '#e7d8c9',
            color: toast.type === 'error' ? '#fff' : '#222',
            padding: '1.5em 2.5em',
            borderRadius: '1em',
            boxShadow: '0 4px 32px rgba(150,121,105,0.12)',
            fontSize: '1.2em',
            zIndex: 9999,
            minWidth: 250,
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
} 