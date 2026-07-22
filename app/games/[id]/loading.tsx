export default function GameAnalyticsLoading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="h-4 w-32 animate-pulse rounded bg-white/5" />
      <div className="mt-4 h-20 w-full animate-pulse rounded-xl bg-white/5" />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-white/5" />
        ))}
      </div>
      <div className="mt-8 flex flex-col gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-xl bg-white/5" />
        ))}
      </div>
    </main>
  );
}
