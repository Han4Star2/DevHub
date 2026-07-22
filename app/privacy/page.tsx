export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-white/40">Last updated: 2026</p>

      <div className="mt-8 flex flex-col gap-6 text-sm text-white/70">
        <p>
          Core Vision is an early-stage project. This page describes, in
          plain terms, what data we collect and how it&apos;s used. It is not
          a substitute for legal advice, and it will be revised as the
          product matures.
        </p>

        <section>
          <h2 className="mb-2 font-medium text-white">What we collect</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Account info you provide directly: email address (or a
              Roblox-linked identifier if you sign in with Roblox), a hashed
              password (we never store your plaintext password), and any
              profile details you choose to add (display name, bio, skills,
              avatar URL).
            </li>
            <li>
              If you sign in with Roblox, we receive your Roblox user ID,
              username, and public display name/avatar from Roblox&apos;s
              OAuth service — nothing else from your Roblox account.
            </li>
            <li>
              Publicly available Roblox game statistics (concurrent players,
              visits, favorites, likes) for games tracked on the platform.
              This is not personal data about you.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-white">How it&apos;s used</h2>
          <p>
            Solely to operate the product: authenticating you, showing your
            dashboard and public developer profile, and displaying game
            analytics. We do not sell your data or share it with third
            parties for advertising.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-white">Cookies</h2>
          <p>
            We use a single, essential, httpOnly session cookie to keep you
            logged in. No tracking or advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-white">Your data</h2>
          <p>
            You can edit or remove your profile information at any time from{" "}
            <code className="rounded bg-white/10 px-1">/settings/profile</code>
            . For account deletion requests, contact the project owner.
          </p>
        </section>
      </div>
    </main>
  );
}
