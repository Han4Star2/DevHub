"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { DiscoverSort } from "@/lib/db/queries/games";

const SORT_OPTIONS: { value: DiscoverSort; label: string }[] = [
  { value: "top-ccu", label: "Top CCU" },
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "most-visits", label: "Most Visits" },
];

export function DiscoverControls({
  genres,
  view,
}: {
  genres: string[];
  view: "grid" | "list";
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`/discover?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="search"
        placeholder="Search games..."
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => updateParam("q", e.target.value || null)}
        className="w-full max-w-xs rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30 sm:w-auto"
      />

      <select
        defaultValue={searchParams.get("genre") ?? ""}
        onChange={(e) => updateParam("genre", e.target.value || null)}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
      >
        <option value="">All genres</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("sort") ?? "top-ccu"}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <div className="ml-auto flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
        <button
          onClick={() => updateParam("view", null)}
          className={`rounded-md px-3 py-1 text-sm ${view === "grid" ? "bg-white/15" : "text-white/50"}`}
        >
          Grid
        </button>
        <button
          onClick={() => updateParam("view", "list")}
          className={`rounded-md px-3 py-1 text-sm ${view === "list" ? "bg-white/15" : "text-white/50"}`}
        >
          List
        </button>
      </div>
    </div>
  );
}
