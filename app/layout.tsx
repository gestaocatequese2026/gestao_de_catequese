import type { Metadata } from 'next';
import { Manrope, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { NotificationProvider } from '@/components/notification-provider';
import { AuthGuard } from '@/components/auth-guard';
import { AppProvider } from '@/lib/store';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Catequese IVC',
  description: 'Sistema de gestão para catequistas da IVC',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${plusJakartaSans.variable}`}>
      <body suppressHydrationWarning className="font-plus-jakarta bg-white text-[#1a1c1c] min-h-screen">
        <AppProvider>
          <NotificationProvider>
            <AuthGuard>
              {children}
            </AuthGuard>
          </NotificationProvider>
        </AppProvider>
      </body>
    </html>
  );
}
