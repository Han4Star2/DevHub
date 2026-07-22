export default function DiscoverLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 h-16 w-full max-w-md animate-pulse rounded-lg bg-white/5" />
      <div className="mb-6 h-12 w-full animate-pulse rounded-lg bg-white/5" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-video animate-pulse rounded-xl bg-white/5"
          />
        ))}
      </div>
    </main>
  );
}
