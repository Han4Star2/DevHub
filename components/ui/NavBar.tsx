import Link from "next/link";

export function NavBar() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Core Vision
        </Link>
        <nav className="flex items-center gap-6 text-sm text-white/70">
          <Link href="/discover" className="hover:text-white">
            Discover
          </Link>
        </nav>
      </div>
    </header>
  );
}
