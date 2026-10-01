import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import BrutalButton from '@/components/ui/BrutalButton';
import StatsStrip from '@/components/features/StatsStrip';
import GameCard from '@/components/features/GameCard';
import ScriptCard from '@/components/features/ScriptCard';
import Container from '@/components/layout/Container';

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  const [
    { count: totalScripts },
    { count: totalGames },
    { count: totalUsers },
    { data: trendingGames },
    { data: latestScripts },
  ] = await Promise.all([
    supabase.from('scripts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('games').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('games').select('*').order('total_scripts', { ascending: false }).limit(8),
    supabase
      .from('scripts')
      .select('*, games(name, slug), users(username, avatar_url)')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(6),
  ]);

  return (
    <>
      <section className="border-b-[3px] border-dark bg-bg">
        <Container>
          <div className="py-20 sm:py-28 text-center flex flex-col items-center gap-6">
            <h1 className="font-display uppercase text-5xl sm:text-mega leading-none tracking-tight">
              Script<span className="text-primary">Hub</span>
            </h1>
            <p className="font-heading text-lg sm:text-xl max-w-xl text-textdim">
              Browse, copy, and share Roblox scripts. No barrier to entry — no login required to
              browse.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/games">
                <BrutalButton size="lg" variant="primary">
                  Browse
                </BrutalButton>
              </Link>
              <Link href="/upload">
                <BrutalButton size="lg" variant="outline">
                  Upload
                </BrutalButton>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 border-b-[3px] border-dark">
        <Container>
          <StatsStrip
            totalScripts={totalScripts ?? 0}
            totalGames={totalGames ?? 0}
            totalUsers={totalUsers ?? 0}
          />
        </Container>
      </section>

      <section className="py-16 border-b-[3px] border-dark">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display uppercase text-3xl sm:text-4xl">Trending Games</h2>
            <Link href="/games" className="font-mono uppercase text-xs font-bold underline">
              View All
            </Link>
          </div>
          {trendingGames && trendingGames.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {trendingGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <p className="font-mono text-textdim">No games yet.</p>
          )}
        </Container>
      </section>

      <section className="py-16 bg-white">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display uppercase text-3xl sm:text-4xl">Latest Scripts</h2>
            <Link href="/search" className="font-mono uppercase text-xs font-bold underline">
              View All
            </Link>
          </div>
          {latestScripts && latestScripts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {latestScripts.map((script) => (
                <ScriptCard key={script.id} script={script} />
              ))}
            </div>
          ) : (
            <p className="font-mono text-textdim">No scripts yet.</p>
          )}
        </Container>
      </section>
    </>
  );
}
