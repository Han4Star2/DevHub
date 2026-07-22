export function RobloxSignInButton() {
  return (
    <a
      href="/api/auth/roblox/start"
      className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10"
    >
      Continue with Roblox
    </a>
  );
}
