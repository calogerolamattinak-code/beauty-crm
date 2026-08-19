import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary:
      'bg-gradient-to-r from-[#EC4899] to-[#A855F7] text-white shadow-md hover:shadow-lg hover:opacity-95 border-none',
    secondary:
      'bg-[var(--bg-card)] text-[var(--text-dark)] border border-[var(--border-strong)] hover:border-[var(--primary-400)] hover:bg-[var(--bg-elevated)]',
    ghost:
      'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-dark)] border-none',
    danger:
      'bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20 hover:bg-[var(--danger)]/20',
    gold:
      'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white shadow-md hover:shadow-lg border-none',
  };

  const sizes = {
    sm: 'px-3.5 py-2 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
