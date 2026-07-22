const PROPS = [
  {
    title: "Discover games",
    description:
      "Browse trending, fastest-growing, and hidden-gem games with SteamDB-style filters and sorting.",
  },
  {
    title: "Track real analytics",
    description:
      "See CCU, visits, and favorites history for any game — not just a snapshot, but real growth over time.",
  },
  {
    title: "Understand growth",
    description:
      "Moving averages and growth deltas surface what's actually accelerating, not just what's big today.",
  },
];

export function ValueProps() {
  return (
    <section id="features" className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {PROPS.map((prop) => (
          <div
            key={prop.title}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-6"
          >
            <h3 className="font-medium">{prop.title}</h3>
            <p className="mt-2 text-sm text-white/50">{prop.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
