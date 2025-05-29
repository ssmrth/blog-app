import React from 'react';

// ConfirmDialog: A modal for confirming user actions (e.g., delete)
export default function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.18)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#fffef8', borderRadius: 16, boxShadow: '0 4px 32px rgba(150,121,105,0.12)',
        padding: '2em 2.5em', minWidth: 320, textAlign: 'center'
      }}>
        <div style={{ fontSize: '1.15em', color: '#967969', marginBottom: 24 }}>{message}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <button
            style={{
              background: '#967969', color: '#fff', border: 'none', borderRadius: 999, padding: '0.7em 2em', fontWeight: 600, fontSize: '1em', cursor: 'pointer'
            }}
            onClick={onConfirm}
          >Delete</button>
          <button
            style={{
              background: '#e7d8c9', color: '#222', border: 'none', borderRadius: 999, padding: '0.7em 2em', fontWeight: 600, fontSize: '1em', cursor: 'pointer'
            }}
            onClick={onCancel}
          >Cancel</button>
        </div>
      </div>
    </div>
  );
} 