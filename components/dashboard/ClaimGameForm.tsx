"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function ClaimGameForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const universeId = formData.get("universeId");

    const res = await fetch("/api/games/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ universeId }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong");
      return;
    }

    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="universeId" className="text-sm text-white/60">
          Claim a tracked game by universe ID
        </label>
        <input
          id="universeId"
          name="universeId"
          type="number"
          required
          placeholder="e.g. 920587237"
          className="w-56 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
      >
        {loading ? "Claiming..." : "Claim"}
      </button>
      {error && <p className="w-full text-sm text-red-400">{error}</p>}
    </form>
  );
}
