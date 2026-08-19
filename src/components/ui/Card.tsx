import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] p-5 shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-[var(--border-strong)] hover:shadow-md hover:translate-y-[-1px]' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {children}
    </div>
  );
}
