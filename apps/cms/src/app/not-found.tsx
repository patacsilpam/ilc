import Link from 'next/link';

export default function NotFound() {
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
      <h1 style={{ fontSize: '72px', margin: '0 0 16px', fontWeight: 700, color: '#f59e0b' }}>404</h1>
      <h2 style={{ fontSize: '24px', margin: '0 0 12px', fontWeight: 600 }}>Page Not Found</h2>
      <p style={{ color: '#94a3b8', maxWidth: '420px', margin: '0 0 28px', lineHeight: 1.5 }}>
        The page you are looking for does not exist or has been moved in the Island Living CMS.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '10px 20px',
          backgroundColor: '#0284c7',
          color: '#ffffff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '14px',
        }}
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
