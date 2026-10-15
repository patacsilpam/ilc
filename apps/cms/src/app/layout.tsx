import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Island Living Digital — Editorial & Operations CMS',
  description: 'VOD CMS and Digital Operations Console for Island Living Channel (ILC)',
  icons: {
    icon: '/brand/ilc-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
