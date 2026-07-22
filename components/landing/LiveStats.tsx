import { formatCompactNumber } from "@/lib/utils/format";

export function LiveStats({
  gamesTracked,
  totalCcu,
}: {
  gamesTracked: number;
  totalCcu: number;
}) {
  const stats = [
    { label: "Games tracked", value: gamesTracked },
    { label: "Live players right now", value: totalCcu },
  ];

  return (
    <section className="border-y border-white/10 bg-white/[0.02]">
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-4 py-10 sm:px-6">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-semibold text-emerald-400">
              {formatCompactNumber(stat.value)}
            </p>
            <p className="mt-1 text-sm text-white/50">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
