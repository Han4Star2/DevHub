import Link from "next/link";

export function Hero() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6">
      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
        The professional platform for the Roblox economy
      </span>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Discover, analyze, and grow on Roblox.
      </h1>
      <p className="max-w-2xl text-lg text-white/60">
        Core Vision tracks concurrent players, visits, and favorites across
        the Roblox platform so developers and studios can see what&apos;s
        actually working — in real time, backed by real data.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/discover"
          className="rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90"
        >
          Explore Discover
        </Link>
        <a
          href="#features"
          className="rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5"
        >
          Learn more
        </a>
      </div>
    </section>
  );
}
