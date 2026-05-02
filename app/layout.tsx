import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sistema Financiero PRO',
  description: 'Gestión financiera personal',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FinPRO',
  },
};

export const viewport: Viewport = {
  themeColor: '#1e40af',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <div className="flex min-h-screen">
          <Sidebar />

          <main className="flex-1 min-w-0 pb-20 md:pb-0">
            <div className="max-w-5xl mx-auto px-4 py-6">{children}</div>
          </main>
        </div>

        <MobileNav />
      </body>
    </html>
  );
}