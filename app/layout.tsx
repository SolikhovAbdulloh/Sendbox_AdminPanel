import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/contexts/language-context';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type React from 'react';
import './globals.css';
import ReactQueryProvider from './provider/ReactQueryProvider';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sector Sandbox Admin',
  description: 'Admin panel for Sector Sandbox',
  generator: 'https://portfolio-with-next-js-rho.vercel.app/',
  openGraph: {
    title: 'Sector Sandbox Admin',
    description: 'Powerful and modern admin panel for Sector Sandbox',
    siteName: 'Sector Sandbox',
    images: [
      {
        url: '../public/logo.png',
        width: 1200,
        height: 630,
        alt: 'Sector Sandbox Admin Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LanguageProvider>{children}</LanguageProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
