import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 px-4 py-8 text-center text-sm text-white/40 sm:px-6">
      <p>Core Vision — built for the Roblox creator economy.</p>
      <div className="mt-2 flex justify-center gap-4">
        <Link href="/privacy" className="hover:text-white">
          Privacy Policy
        </Link>
        <Link href="/terms" className="hover:text-white">
          Terms of Service
        </Link>
      </div>
    </footer>
  );
}
