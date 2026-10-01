import { HTMLAttributes, forwardRef } from 'react';

interface BrutalCardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

const BrutalCard = forwardRef<HTMLDivElement, BrutalCardProps>(
  ({ hoverable = true, className = '', ...props }, ref) => {
    const hoverClass = hoverable
      ? 'hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-brutal-sm transition-all duration-100'
      : '';
    return (
      <div
        ref={ref}
        className={`bg-white border-[3px] border-dark shadow-brutal p-5 rounded-none ${hoverClass} ${className}`}
        {...props}
      />
    );
  }
);

BrutalCard.displayName = 'BrutalCard';

export default BrutalCard;
