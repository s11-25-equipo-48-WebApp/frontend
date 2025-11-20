import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function Layout({ children }: { children: React.ReactNode; }) {
  const session = await auth();
  if (session) {
    redirect('/dashboard');
  }
  return (
    <main className='relative overflow-hidden'>
      <div className='bg-[#633B48] rounded-full h-32 aspect-square absolute -top-16  -right-16 z-0'></div>
      <div className='bg-[#633B48] rounded-tr-full h-full w-1/4 min-w-[300px] absolute top-0  z-0 flex justify-center items-center'>
        <p className='text-white hidden md:block text-4xl font-bold '>Testimonial CMS
          <br />
          Global Edtech</p>
      </div>
      {children}
    </main>
  );
}
