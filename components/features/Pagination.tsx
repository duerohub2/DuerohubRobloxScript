'use client';

import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    return `${pathname}?${params.toString()}`;
  };

  const btnClass =
    'bg-white border-[3px] border-dark shadow-brutal-sm px-4 py-2 font-mono font-bold uppercase text-xs hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100 rounded-none';
  const disabledClass = 'opacity-50 pointer-events-none';

  return (
    <div className="flex items-center justify-center gap-3 mt-10">
      <Link
        href={buildHref(Math.max(1, currentPage - 1))}
        className={`${btnClass} ${currentPage <= 1 ? disabledClass : ''}`}
      >
        Prev
      </Link>
      <span className="font-mono text-xs uppercase font-bold">
        Page {currentPage} / {totalPages}
      </span>
      <Link
        href={buildHref(Math.min(totalPages, currentPage + 1))}
        className={`${btnClass} ${currentPage >= totalPages ? disabledClass : ''}`}
      >
        Next
      </Link>
    </div>
  );
}
