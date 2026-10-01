'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import BrutalSelect from '@/components/ui/BrutalSelect';
import type { Database } from '@/types/database';

type Category = Database['public']['Tables']['categories']['Row'];

interface FilterBarProps {
  categories: Category[];
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Viewed' },
  { value: 'copied', label: 'Most Copied' },
];

export default function FilterBar({ categories }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="w-full sm:w-56">
        <BrutalSelect
          placeholder="All Categories"
          value={searchParams.get('category') ?? ''}
          onChange={(e) => updateParam('category', e.target.value)}
          options={categories.map((c) => ({ value: c.slug, label: c.name }))}
        />
      </div>
      <div className="w-full sm:w-56">
        <BrutalSelect
          value={searchParams.get('sort') ?? 'newest'}
          onChange={(e) => updateParam('sort', e.target.value)}
          options={SORT_OPTIONS}
        />
      </div>
    </div>
  );
}
