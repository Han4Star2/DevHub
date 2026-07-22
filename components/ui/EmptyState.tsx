export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-16 text-center">
      <p className="text-lg font-medium text-white/80">{title}</p>
      {description && <p className="text-sm text-white/50">{description}</p>}
    </div>
  );
}
