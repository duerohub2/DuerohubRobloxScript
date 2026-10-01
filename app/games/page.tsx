import { createClient } from '@/lib/supabase/server';
import Container from '@/components/layout/Container';
import GameCard from '@/components/features/GameCard';

export const revalidate = 60;

export default async function GamesPage() {
  const supabase = await createClient();
  const { data: games } = await supabase
    .from('games')
    .select('*')
    .order('total_scripts', { ascending: false });

  return (
    <Container>
      <div className="py-12">
        <h1 className="font-display uppercase text-4xl sm:text-5xl mb-10">All Games</h1>

        {games && games.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="bg-white border-[3px] border-dark shadow-brutal p-10 text-center">
            <p className="font-mono uppercase text-textdim">No games have been added yet.</p>
          </div>
        )}
      </div>
    </Container>
  );
}
