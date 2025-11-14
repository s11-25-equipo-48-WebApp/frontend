'use client';
import ReactQueryProvider from './ReactQueryProvider';
import NextThemeProvider from './ThemeProvider';
import AuthProvider from './AuthProvider';
import Toast from '@/components/Toast';

export default function Providers({ children }: { children: React.ReactNode; }) {
  return (
    <AuthProvider>
      <NextThemeProvider>
        <ReactQueryProvider>
          {children}
          <Toast />
        </ReactQueryProvider>
      </NextThemeProvider>
    </AuthProvider>
  );
}
