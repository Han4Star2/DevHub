"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const body = {
      email: formData.get("email"),
      password: formData.get("password"),
      ...(mode === "signup" ? { name: formData.get("name") } : {}),
    };

    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {mode === "signup" && (
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm text-white/60">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
          />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm text-white/60">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm text-white/60">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90 disabled:opacity-50"
      >
        {loading
          ? "Please wait..."
          : mode === "login"
            ? "Log in"
            : "Create account"}
      </button>
    </form>
  );
}
