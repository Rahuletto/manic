import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
});

import { ThemeWatcher } from '@/components/layout/ThemeWatcher';
import { appDescription, appName } from '@/lib/shared';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL('https://manicjs.tech'),
  title: {
    default: `${appName} Docs`,
    template: `%s | ${appName} Docs`,
  },
  description: appDescription,
  applicationName: appName,
  alternates: {
    canonical: '/docs',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    siteName: appName,
    title: `${appName} Docs`,
    description: appDescription,
    url: 'https://manicjs.tech/docs',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${appName} Docs`,
    description: appDescription,
  },
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
