import Link from 'next/link';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalBadge from '@/components/ui/BrutalBadge';
import { formatDate, truncate } from '@/lib/utils';
import type { Database } from '@/types/database';

type Script = Database['public']['Tables']['scripts']['Row'] & {
  games?: { name: string; slug: string } | null;
  users?: { username: string; avatar_url: string | null } | null;
};

export default function ScriptCard({ script }: { script: Script }) {
  return (
    <Link href={`/scripts/${script.slug}`}>
      <BrutalCard className="h-full flex flex-col gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {script.is_keyless && <BrutalBadge variant="good">Keyless</BrutalBadge>}
          {script.is_mobile_friendly && <BrutalBadge variant="accent">Mobile</BrutalBadge>}
        </div>

        <h3 className="font-display uppercase text-lg leading-tight">{script.title}</h3>

        <p className="font-heading text-sm text-textdim">{truncate(script.description, 100)}</p>

        <div className="mt-auto pt-3 border-t-[2px] border-dark flex items-center justify-between font-mono text-[10px] uppercase text-textdim">
          <span>{script.games?.name ?? 'No Game'}</span>
          <span>{formatDate(script.created_at)}</span>
        </div>

        <div className="flex items-center justify-between font-mono text-[10px] uppercase text-textdim">
          <span>by {script.users?.username ?? 'unknown'}</span>
          <span>
            {script.view_count} views · {script.copy_count} copies
          </span>
        </div>
      </BrutalCard>
    </Link>
  );
}
