import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
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
  const base = 'font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'text-white hover:opacity-95',
    secondary: 'bg-[var(--bg-elevated)] text-text-dark border border-[var(--border-strong)] hover:border-[var(--primary-400)] hover:bg-[var(--bg-hover)]',
    ghost: 'text-text-muted hover:bg-[var(--primary-50)] hover:text-text-dark',
    danger: 'bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20 hover:bg-[var(--danger)]/20',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const style = variant === 'primary' ? {
    background: 'linear-gradient(135deg, #EC4899, #A855F7)',
    boxShadow: '0 2px 8px rgba(236,72,153,0.25)',
  } : undefined;

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}
