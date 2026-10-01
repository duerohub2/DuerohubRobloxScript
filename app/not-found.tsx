import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="bg-white border-[3px] border-dark shadow-brutal-lg p-8 max-w-md text-center">
        <h2 className="text-huge mb-3">404</h2>
        <p className="font-mono text-sm text-textdim mb-6">
          This page does not exist.
        </p>
        <Link
          href="/"
          className="inline-block bg-secondary text-dark border-[3px] border-dark shadow-brutal px-6 py-3 font-mono font-bold uppercase tracking-wider text-sm hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-brutal-sm active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all duration-100"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
