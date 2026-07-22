"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { ChartRange } from "@/lib/db/queries/stats";

const RANGES: { value: ChartRange; label: string }[] = [
  { value: "24h", label: "24h" },
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
  { value: "all", label: "All" },
];

export function TimeRangeSelector({ current }: { current: ChartRange }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setRange(range: ChartRange) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", range);
    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
      {RANGES.map((r) => (
        <button
          key={r.value}
          onClick={() => setRange(r.value)}
          className={`rounded-md px-3 py-1 text-sm ${
            current === r.value ? "bg-white/15" : "text-white/50"
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
