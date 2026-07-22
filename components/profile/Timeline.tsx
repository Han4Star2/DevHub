import Link from "next/link";
import { formatDate } from "@/lib/utils/format";

export interface TimelineEntry {
  slug: string;
  name: string;
  createdAt: Date;
}

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <ol className="flex flex-col gap-3 border-l border-white/10 pl-4">
      {entries.map((entry) => (
        <li key={entry.slug} className="relative">
          <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-white/30" />
          <p className="text-xs text-white/40">
            {formatDate(entry.createdAt)} · Added to Core Vision
          </p>
          <Link
            href={`/games/${entry.slug}`}
            className="text-sm font-medium hover:underline"
          >
            {entry.name}
          </Link>
        </li>
      ))}
    </ol>
  );
}
