import clsx from 'clsx';
import React from 'react';
import { RiLoader5Line } from 'react-icons/ri';

type ButtonVariant = 'primary' | 'action' | 'ghost' | 'wine' | 'wineAlt';
type ButtonColor = 'default' | 'green' | 'red' | 'orange' | 'yellow';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: 'fit' | 'full';
  unStyled?: boolean;
  name?: string;
}

export default function Button({
  isLoading,
  children,
  variant = 'primary',
  color = 'default',
  size,
  unStyled,
  className,
  disabled,
  ...props
}: ButtonProps) {
  // Estilos Base
  const baseStyles =
    'font-semibold transition-all duration-200 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  // Estilos de FORMA (Variant)
  const variantStyles = {
    primary: clsx(
      'rounded-lg text-lg',
      size === 'fit' ? 'p-2 w-fit' : 'p-2 w-full'
    ),
    action: clsx(
      'rounded-full text-sm px-4 py-1 shadow-sm hover:shadow-md',
      size === 'full' ? 'w-full' : 'w-fit'
    ),
    ghost: clsx(
      'bg-btn-ghost/50 border shadow-md border-foreground/20 text-foreground/50 p-2 rounded-lg hover:bg-btn-ghost/10',
      size === 'full' ? 'w-full' : 'w-fit'
    ),
    wine: clsx(
      'rounded-3xl border-2 border-white text-lg shadow-xl bg-winered text-white hover:opacity-90',
      size === 'fit' ? 'p-2 w-fit' : 'p-2 w-full'
    ),

    wineAlt: clsx(
      'rounded-3xl text-lg shadow-lg shadow-gray-700 bg-transparent border-2 border-white text-winered hover:opacity-90',
      size === 'fit' ? 'p-2  w-fit' : 'p-2 w-full'
    ),
  };

  const colorStyles = {
    default: 'bg-btn-primary text-white hover:opacity-90',

    green:
      'bg-btn-success/10 text-btn-success hover:brightness-95 dark:hover:brightness-110',

    red: 'bg-btn-danger/10 text-btn-danger hover:brightness-95 dark:hover:brightness-110',

    orange:
      'bg-btn-warning/10 text-btn-warning hover:brightness-95 dark:hover:brightness-110',
    yellow:
      'bg-yellow text-white hover:brightness-95 dark:hover:brightness-110',
  };

  return (
    <button
      {...props}
      disabled={isLoading || disabled}
      className={clsx(
        !unStyled && baseStyles,
        !unStyled && variantStyles[variant],
        !unStyled && variant !== 'ghost' && colorStyles[color],
        className
      )}
    >
      {isLoading ? (
        <RiLoader5Line className="animate-spin mx-auto my-1" />
      ) : (
        children
      )}
    </button>
  );
}
