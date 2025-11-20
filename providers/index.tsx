'use client';
import ReactQueryProvider from './ReactQueryProvider';
import NextThemeProvider from './ThemeProvider';
import AuthProvider from './AuthProvider';
import Toast from '@/components/Toast';
import ThemeSwitch from '@/components/ThemeSwitch';

export default function Providers({ children }: { children: React.ReactNode; }) {
  return (
    <AuthProvider>
      <NextThemeProvider>
        <ReactQueryProvider>
          <ThemeSwitch />
          {children}
          <Toast />
        </ReactQueryProvider>
      </NextThemeProvider>
    </AuthProvider>
  );
}
