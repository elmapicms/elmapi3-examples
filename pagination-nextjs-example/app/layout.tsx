import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ElmapiCMS Pagination Examples',
  description: 'Advanced pagination examples with Next.js and ElmapiCMS',
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

