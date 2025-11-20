'use client';
import { useTheme } from 'next-themes';
import { BiMoon, BiSun } from 'react-icons/bi';
import { useEffect, useState } from 'react';

export default function ThemeSwitch() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="flex items-center cursor-pointer p-2 bg-background hover:scale-110 transition-all fixed bottom-4 right-4 z-50 border-slate-500 border-2 rounded-full"
      onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}
    >
      {theme === 'dark' ? <BiSun /> : <BiMoon />}
    </div>
  );
}