import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getDashboardAggregate, getOwnedGames } from "@/lib/db/queries/dashboard";
import { StatSummaryCards } from "@/components/analytics/StatSummaryCards";
import { GameCard } from "@/components/discover/GameCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ClaimGameForm } from "@/components/dashboard/ClaimGameForm";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const [aggregate, ownedGames] = await Promise.all([
    getDashboardAggregate(user.id),
    getOwnedGames(user.id),
  ]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold">
        Welcome back{user.name ? `, ${user.name}` : ""}
      </h1>
      <p className="mt-1 text-white/50">
        Your personal workspace for tracked games.
      </p>

      <div className="mt-8">
        <StatSummaryCards
          cards={[
            { label: "Games owned", value: aggregate?.gamesOwned ?? 0 },
            { label: "Combined CCU", value: aggregate?.totalCcu ?? 0 },
            { label: "Combined visits", value: aggregate?.totalVisits ?? 0 },
          ]}
        />
      </div>

      <div className="mt-10">
        <h2 className="mb-3 text-lg font-medium">Claim a game</h2>
        <ClaimGameForm />
      </div>

      <div className="mt-10">
        <h2 className="mb-3 text-lg font-medium">Your games</h2>
        {ownedGames.length === 0 ? (
          <EmptyState
            title="No games claimed yet"
            description="Claim a tracked game above by its Roblox universe ID to see it here."
          />
        ) : (
          <div className="flex flex-col gap-2">
            {ownedGames.map((game) => (
              <GameCard key={game.id} game={game} view="list" />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
