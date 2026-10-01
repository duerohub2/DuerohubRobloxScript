'use client';

import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { logout } from '@/actions/auth';

const navLinkClass = 'font-mono text-sm font-bold uppercase tracking-wide hover:underline underline-offset-4';
const buttonClass =
  'border-[3px] border-dark shadow-brutal-sm px-4 py-2 font-mono font-bold uppercase text-xs hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100';

export function Header() {
  const { user, profile, loading } = useUser();

  return (
    <header className="sticky top-0 z-40 bg-bg border-b-[3px] border-dark">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="font-display text-xl uppercase tracking-tight">
          ScriptHub
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/games" className={navLinkClass}>Games</Link>
          <Link href="/search" className={navLinkClass}>Search</Link>
          {user && <Link href="/dashboard" className={navLinkClass}>Dashboard</Link>}
        </nav>

        <div className="flex items-center gap-3">
          {loading ? null : user ? (
            <>
              <Link href="/upload" className={`${buttonClass} bg-primary text-white`}>
                Upload
              </Link>
              <Link href={`/u/${profile?.username ?? ''}`} className={navLinkClass}>
                @{profile?.username ?? 'me'}
              </Link>
              <form action={logout}>
                <button type="submit" className={`${buttonClass} bg-white`}>
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className={navLinkClass}>Login</Link>
              <Link href="/register" className={`${buttonClass} bg-secondary text-dark`}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
