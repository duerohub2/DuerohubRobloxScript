import Link from 'next/link';
import BrutalCard from '@/components/ui/BrutalCard';
import type { Database } from '@/types/database';

type Game = Database['public']['Tables']['games']['Row'];

export default function GameCard({ game }: { game: Game }) {
  return (
    <Link href={`/games/${game.slug}`}>
      <BrutalCard className="h-full flex flex-col gap-3">
        <div className="relative w-full aspect-video border-[3px] border-dark bg-bg overflow-hidden flex items-center justify-center">
          {game.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={game.thumbnail_url}
              alt={game.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-display text-3xl text-dark/20 uppercase">
              {game.name.slice(0, 2)}
            </span>
          )}
        </div>
        <h3 className="font-display uppercase text-lg leading-tight">{game.name}</h3>
        <p className="font-mono text-xs text-textdim mt-auto">
          {game.total_scripts} {game.total_scripts === 1 ? 'SCRIPT' : 'SCRIPTS'}
        </p>
      </BrutalCard>
    </Link>
  );
}
