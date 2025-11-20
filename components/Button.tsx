import clsx from 'clsx';
import React from 'react';
import { RiLoader5Line } from 'react-icons/ri';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
  model?: 'primary' | 'secondary' | 'ghost';
  unStyled?: boolean;
  size?: 'fit' | 'full';
  name: string;
  role?: string;
}
export default function Button({
  isLoading,
  children,
  model = 'primary',
  size = 'full',
  unStyled,
  name,
  role = 'button',
  ...props
}: ButtonProps) {
  const isPrimary = model === 'primary';
  const isSecondary = model === 'secondary';
  const isGhost = model === 'ghost';
  const isFit = size === 'fit';
  const isFull = size === 'full';
  return (
    <button
      {...props}
      className={clsx(
        !unStyled && 'rounded-lg hover:opacity-70 cursor-pointer text-lg font-semibold h-fit  disabled:opacity-50 disabled:cursor-not-allowed',
        !unStyled && isPrimary && 'bg-btn-primary text-white',
        !unStyled && isSecondary && 'bg-btn-secondary text-white',
        !unStyled && isGhost && 'bg-transparent border border-btn-ghost text-btn-ghost',
        !unStyled && isFit && 'p-1 w-fit',
        !unStyled && isFull && 'p-2 w-full',
        props?.className
      )}
      disabled={isLoading}
      name={name}
      role={role}
    >
      {isLoading ? (
        <RiLoader5Line
          className='animate-spin mx-auto my-1'
        />
      ) : (
        <>{children}</>
      )}
    </button>
  );
}