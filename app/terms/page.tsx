export default function TermsOfServicePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold">Terms of Service</h1>
      <p className="mt-2 text-sm text-white/40">Last updated: 2026</p>

      <div className="mt-8 flex flex-col gap-6 text-sm text-white/70">
        <p>
          Core Vision is an early-stage, actively developed project. By using
          it, you agree to the following.
        </p>

        <section>
          <h2 className="mb-2 font-medium text-white">The service</h2>
          <p>
            Core Vision provides Roblox game analytics, developer profiles,
            and related tools. Statistics shown are derived from Roblox&apos;s
            public APIs and periodic snapshots we collect ourselves — they
            are estimates, not official figures, and may be incomplete or
            delayed.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-white">Accounts</h2>
          <p>
            You&apos;re responsible for keeping your account credentials
            secure. Claiming ownership of a tracked game is currently
            self-service and not independently verified against Roblox — do
            not rely on it as proof of ownership for any external purpose.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-white">Acceptable use</h2>
          <p>
            Don&apos;t use the service to misrepresent game ownership, scrape
            or abuse the platform, or interfere with other users&apos;
            accounts or data.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-white">No warranty</h2>
          <p>
            The service is provided as-is, without warranty of any kind,
            while under active development. Features may change or be
            removed without notice.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium text-white">Changes</h2>
          <p>
            These terms may be updated as the product evolves. Continued use
            after a change means you accept the updated terms.
          </p>
        </section>
      </div>
    </main>
  );
}
