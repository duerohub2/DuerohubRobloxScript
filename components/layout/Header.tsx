'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { logout } from '@/actions/auth';
import BrutalButton from '@/components/ui/BrutalButton';
import Container from './Container';

export default function Header() {
  const { user, profile, loading } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-bg border-b-[3px] border-dark">
      <Container>
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="font-display uppercase text-2xl tracking-tight">
            Script<span className="text-primary">Hub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 font-mono uppercase text-sm font-bold">
            <Link href="/games">Games</Link>
            <Link href="/search">Search</Link>
            {!loading && user && <Link href="/dashboard">Dashboard</Link>}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {!loading && user ? (
              <>
                <Link href="/upload">
                  <BrutalButton size="sm" variant="primary">
                    Upload
                  </BrutalButton>
                </Link>
                <Link href={`/u/${profile?.username ?? ''}`}>
                  <BrutalButton size="sm" variant="outline">
                    {profile?.username ?? 'Profile'}
                  </BrutalButton>
                </Link>
                <form action={logout}>
                  <BrutalButton size="sm" variant="danger" type="submit">
                    Logout
                  </BrutalButton>
                </form>
              </>
            ) : !loading ? (
              <>
                <Link href="/login">
                  <BrutalButton size="sm" variant="outline">
                    Login
                  </BrutalButton>
                </Link>
                <Link href="/register">
                  <BrutalButton size="sm" variant="primary">
                    Register
                  </BrutalButton>
                </Link>
              </>
            ) : null}
          </div>

          <button
            className="md:hidden bg-white border-[3px] border-dark shadow-brutal-sm p-2 rounded-none"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} strokeWidth={3} /> : <Menu size={20} strokeWidth={3} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden flex flex-col gap-3 pb-6 font-mono uppercase text-sm font-bold">
            <Link href="/games" onClick={() => setMobileOpen(false)}>
              Games
            </Link>
            <Link href="/search" onClick={() => setMobileOpen(false)}>
              Search
            </Link>
            {!loading && user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/upload" onClick={() => setMobileOpen(false)}>
                  Upload
                </Link>
                <Link href={`/u/${profile?.username ?? ''}`} onClick={() => setMobileOpen(false)}>
                  {profile?.username ?? 'Profile'}
                </Link>
                <form action={logout}>
                  <BrutalButton size="sm" variant="danger" type="submit" className="w-full">
                    Logout
                  </BrutalButton>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </Container>
    </header>
  );
}
