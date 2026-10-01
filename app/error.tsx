'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white border-[3px] border-dark shadow-brutal-lg p-8 max-w-md text-center">
        <h2 className="text-3xl mb-3 text-danger">SOMETHING BROKE</h2>
        <p className="font-mono text-sm text-textdim mb-6 break-words">
          {error.message || 'Unexpected error.'}
        </p>
        <button
          onClick={reset}
          className="bg-primary text-white border-[3px] border-dark shadow-brutal px-6 py-3 font-mono font-bold uppercase tracking-wider text-sm hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-brutal-sm active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all duration-100"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
