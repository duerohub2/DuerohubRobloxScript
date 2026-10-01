import { HTMLAttributes } from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'accent' | 'good' | 'outline';

interface BrutalBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const VARIANTS: Record<BadgeVariant, string> = {
  primary: 'bg-primary text-white',
  secondary: 'bg-secondary text-dark',
  accent: 'bg-accent text-dark',
  good: 'bg-good text-dark',
  outline: 'bg-white text-dark',
};

export default function BrutalBadge({
  variant = 'secondary',
  className = '',
  children,
  ...props
}: BrutalBadgeProps) {
  return (
    <span
      className={`inline-flex items-center border-[2px] border-dark px-2 py-1 font-mono font-bold uppercase text-[10px] tracking-wider rounded-none ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
