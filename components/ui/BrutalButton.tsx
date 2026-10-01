import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BrutalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const BASE =
  'inline-flex items-center justify-center border-[3px] border-dark shadow-brutal font-mono font-bold uppercase tracking-wider hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-brutal-sm active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all duration-100 rounded-none disabled:opacity-50 disabled:pointer-events-none';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white',
  secondary: 'bg-secondary text-dark',
  accent: 'bg-accent text-dark',
  danger: 'bg-danger text-white',
  outline: 'bg-white text-dark',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

const BrutalButton = forwardRef<HTMLButtonElement, BrutalButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
        {...props}
      />
    );
  }
);

BrutalButton.displayName = 'BrutalButton';

export default BrutalButton;
