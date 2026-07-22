"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { User } from "@/lib/db/schema";

export function ProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const body = {
      username: formData.get("username"),
      name: formData.get("name"),
      bio: formData.get("bio"),
      skills: formData.get("skills"),
      avatarUrl: formData.get("avatarUrl"),
    };

    const res = await fetch("/api/users/profile", {
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

    setSuccess(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="text-sm text-white/60">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          pattern="[a-z0-9-]{3,30}"
          title="3-30 characters: lowercase letters, numbers, and hyphens"
          defaultValue={user.username ?? ""}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
        />
        <p className="text-xs text-white/40">
          Your public profile: /developers/{user.username ?? "your-handle"}
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm text-white/60">
          Display name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={user.name ?? ""}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="bio" className="text-sm text-white/60">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          maxLength={500}
          defaultValue={user.bio ?? ""}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="skills" className="text-sm text-white/60">
          Skills
        </label>
        <input
          id="skills"
          name="skills"
          type="text"
          placeholder="Scripting, UI Design, Building"
          defaultValue={user.skills ?? ""}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
        />
        <p className="text-xs text-white/40">Comma-separated</p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="avatarUrl" className="text-sm text-white/60">
          Avatar URL
        </label>
        <input
          id="avatarUrl"
          name="avatarUrl"
          type="url"
          placeholder="https://..."
          defaultValue={user.avatarUrl ?? ""}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {success && !error && (
        <p className="text-sm text-emerald-400">Profile updated.</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="self-start rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
