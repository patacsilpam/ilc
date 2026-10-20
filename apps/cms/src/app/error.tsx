'use client';

import { useEffect } from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[CMS App Error]:', error);
  }, [error]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#0a0f1d',
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '24px',
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '48px', margin: '0 0 16px', fontWeight: 700, color: '#ef4444' }}>500</h1>
      <h2 style={{ fontSize: '22px', margin: '0 0 12px', fontWeight: 600 }}>Something went wrong</h2>
      <p style={{ color: '#94a3b8', maxWidth: '460px', margin: '0 0 24px', lineHeight: 1.5 }}>
        An unexpected error occurred in the Island Living CMS console.
      </p>
      <button
        onClick={() => reset()}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0284c7',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '14px',
          cursor: 'pointer',
        }}
      >
        Try Again
      </button>
    </div>
  );
}
