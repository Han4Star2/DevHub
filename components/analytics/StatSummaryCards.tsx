import { formatCompactNumber, formatPercent } from "@/lib/utils/format";

export interface SummaryCard {
  label: string;
  value: number | string | null;
  deltaPct?: number | null;
}

export function StatSummaryCards({ cards }: { cards: SummaryCard[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
        >
          <p className="text-xs uppercase tracking-wide text-white/40">
            {card.label}
          </p>
          <p className="mt-1 text-xl font-semibold">
            {typeof card.value === "number"
              ? formatCompactNumber(card.value)
              : (card.value ?? "—")}
          </p>
          {card.deltaPct !== undefined && card.deltaPct !== null && (
            <p
              className={`mt-1 text-xs font-medium ${
                card.deltaPct >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {formatPercent(card.deltaPct)} (7d)
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
