import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
});

import { ThemeWatcher } from '@/components/layout/ThemeWatcher';
import type { ReactNode } from 'react';


import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://manic.js.org'), // Fallback URL for SEO
  verification: {
    google: 'JGFgfGmGQs-FLZNMog1Uucr09OYHMwIKk6ORzv17-0o',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>
          {children}
        </RootProvider>
        <ThemeWatcher />
      </body>
    </html>
  );
}
