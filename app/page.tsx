export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white border-[3px] border-dark shadow-brutal-lg p-10 max-w-xl text-center">
        <h1 className="text-huge md:text-mega leading-none mb-4">SCRIPTHUB</h1>
        <p className="font-heading text-textdim mb-6">
          Project scaffold is live. Homepage sections (hero, stats, trending games, latest scripts) ship in the frontend EPIC.
        </p>
        <span className="inline-block bg-secondary text-dark border-[2px] border-dark px-3 py-1 font-mono font-bold uppercase text-xs">
          EPIC 1 — Project Setup ✅
        </span>
      </div>
    </main>
  );
}
