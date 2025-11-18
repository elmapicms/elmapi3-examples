import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Translations Example - ElmapiCMS',
  description: 'Multilingual blog example with translations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

