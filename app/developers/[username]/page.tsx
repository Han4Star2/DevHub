import { notFound } from "next/navigation";
import {
  getPublicProfileByUsername,
  getProfileAchievements,
  getProfileGames,
  getProfileStats,
} from "@/lib/db/queries/profile";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { StatSummaryCards } from "@/components/analytics/StatSummaryCards";
import { AchievementBadges } from "@/components/profile/AchievementBadges";
import { GameCard } from "@/components/discover/GameCard";
import { Timeline } from "@/components/profile/Timeline";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function DeveloperProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getPublicProfileByUsername(username);
  if (!profile || !profile.username) notFound();

  const [stats, ownedGames, achievements] = await Promise.all([
    getProfileStats(profile.id),
    getProfileGames(profile.id),
    getProfileAchievements(profile.id),
  ]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <ProfileHeader
        profile={{
          username: profile.username,
          name: profile.name,
          bio: profile.bio,
          skills: profile.skills,
          avatarUrl: profile.avatarUrl,
          createdAt: profile.createdAt,
        }}
      />

      <div className="mt-6">
        <AchievementBadges achievements={achievements} />
      </div>

      <div className="mt-8">
        <StatSummaryCards
          cards={[
            { label: "Games", value: stats.gamesOwned },
            { label: "Combined CCU", value: stats.combinedCcu },
            { label: "Lifetime visits", value: stats.combinedVisits },
            { label: "Peak CCU ever", value: stats.peakCcuEver },
          ]}
        />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="mb-3 text-lg font-medium">Portfolio</h2>
          {ownedGames.length === 0 ? (
            <EmptyState
              title="No public games yet"
              description={`${profile.name || profile.username} hasn't claimed any tracked games.`}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {ownedGames.map((game) => (
                <GameCard key={game.id} game={game} view="grid" />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-lg font-medium">Timeline</h2>
          {ownedGames.length === 0 ? (
            <p className="text-sm text-white/40">Nothing here yet.</p>
          ) : (
            <Timeline entries={ownedGames} />
          )}
        </div>
      </div>
    </main>
  );
}
