import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";
import { LogoutButton } from "./LogoutButton";

export async function NavBar() {
  const user = await getSessionUser();

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
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-white">
                Dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-white">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-white px-3 py-1.5 text-black hover:bg-white/90"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
