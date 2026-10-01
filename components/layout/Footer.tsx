import Link from 'next/link';
import Container from './Container';

export default function Footer() {
  return (
    <footer className="border-t-[3px] border-dark bg-white mt-20">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-10">
          <div>
            <p className="font-display uppercase text-xl">
              Script<span className="text-primary">Hub</span>
            </p>
            <p className="font-mono text-xs text-textdim mt-1">
              Community-driven Roblox script catalog.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-5 font-mono uppercase text-xs font-bold">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/dmca">DMCA</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>

        <div className="border-t-[3px] border-dark py-4 text-center font-mono text-[10px] uppercase tracking-wider text-textdim">
          © {new Date().getFullYear()} ScriptHub. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
