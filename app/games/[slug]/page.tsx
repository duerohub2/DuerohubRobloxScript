import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Container from '@/components/layout/Container';
import FilterBar from '@/components/features/FilterBar';
import ScriptCard from '@/components/features/ScriptCard';
import Pagination from '@/components/features/Pagination';

export const revalidate = 60;

const PAGE_SIZE = 12;

type SortConfig = { column: string; ascending: boolean };

const DEFAULT_SORT: SortConfig = { column: 'created_at', ascending: false };

const SORT_MAP: Record<string, SortConfig> = {
  newest: { column: 'created_at', ascending: false },
  popular: { column: 'view_count', ascending: false },
  copied: { column: 'copy_count', ascending: false },
};

interface GamePageProps {
  params: { slug: string };
  searchParams: { category?: string; sort?: string; page?: string };
}

export default async function GameDetailPage({ params, searchParams }: GamePageProps) {
  const supabase = await createClient();

  const { data: game } = await supabase
    .from('games')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!game) notFound();

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('display_order');

  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1);
  const sort = (searchParams.sort && SORT_MAP[searchParams.sort]) || DEFAULT_SORT;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from('scripts')
    .select('*, games(name, slug), users(username, avatar_url)', { count: 'exact' })
    .eq('status', 'published')
    .eq('game_id', game.id);

  if (searchParams.category) {
    const category = categories?.find((c) => c.slug === searchParams.category);
    if (category) query = query.eq('category_id', category.id);
  }

  const { data: scripts, count } = await query
    .order(sort.column, { ascending: sort.ascending })
    .range(from, to);

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <Container>
      <div className="py-12">
        <div className="mb-8">
          <h1 className="font-display uppercase text-4xl sm:text-5xl">{game.name}</h1>
          {game.description && (
            <p className="font-heading text-textdim mt-3 max-w-2xl">{game.description}</p>
          )}
          <p className="font-mono text-xs uppercase text-textdim mt-2">
            {game.total_scripts} {game.total_scripts === 1 ? 'script' : 'scripts'}
          </p>
        </div>

        <div className="mb-8">
          <FilterBar categories={categories ?? []} />
        </div>

        {scripts && scripts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {scripts.map((script) => (
                <ScriptCard key={script.id} script={script} />
              ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} />
          </>
        ) : (
          <div className="bg-white border-[3px] border-dark shadow-brutal p-10 text-center">
            <p className="font-mono uppercase text-textdim">No scripts found for this game.</p>
          </div>
        )}
      </div>
    </Container>
  );
}
