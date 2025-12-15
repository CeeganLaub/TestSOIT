import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: {
    default: 'LawFirm Platform - Client Portal',
    template: '%s | LawFirm Platform',
  },
  description: 'Enterprise multi-tenant SaaS platform for law firms. Invite clients, manage cases, and streamline your practice.',
  keywords: ['law firm', 'legal', 'client portal', 'case management', 'legal tech'],
  authors: [{ name: 'LawFirm Platform' }],
  creator: 'LawFirm Platform',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'LawFirm Platform',
    title: 'LawFirm Platform - Client Portal',
    description: 'Enterprise multi-tenant SaaS platform for law firms.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LawFirm Platform',
    description: 'Enterprise multi-tenant SaaS platform for law firms.',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a365d' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
