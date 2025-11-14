'use client';
import { useTheme } from 'next-themes';
import { ToastContainer } from 'react-toastify';

export default function Toast() {
  const { theme } = useTheme();
  return (
    <ToastContainer autoClose={2000} theme={theme} />
  );
}
