import './global.css';
import type { Metadata } from 'next';
import { QueryProvider } from './providers/query-provider';
import { Geist_Mono, Inter } from 'next/font/google';
import { cn } from '@/shared/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Statter',
  description: 'Uptime monitoring dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn('antialiased', fontMono.variable, 'font-sans', inter.variable)}>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
