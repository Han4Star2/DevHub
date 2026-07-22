const MESSAGES: Record<string, string> = {
  roblox_missing_params: "The Roblox sign-in attempt was incomplete. Please try again.",
  roblox_state_mismatch: "The Roblox sign-in session expired. Please try again.",
  roblox_invalid_state: "The Roblox sign-in session expired. Please try again.",
  roblox_exchange_failed: "Couldn't complete sign-in with Roblox. Please try again.",
  roblox_not_configured: "Sign-in with Roblox isn't set up on this deployment yet.",
};

export function OAuthErrorBanner({ error }: { error?: string }) {
  if (!error) return null;
  const message = MESSAGES[error] ?? "Something went wrong signing in. Please try again.";
  return (
    <p className="mb-4 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-400">
      {message}
    </p>
  );
}
