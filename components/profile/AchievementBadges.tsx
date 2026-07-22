import type { Achievement } from "@/lib/db/queries/profile";

export function AchievementBadges({
  achievements,
}: {
  achievements: Achievement[];
}) {
  if (achievements.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {achievements.map((a) => (
        <div
          key={a.id}
          title={a.description}
          className="flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300"
        >
          🏆 {a.label}
        </div>
      ))}
    </div>
  );
}
