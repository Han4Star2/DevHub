import type { ReactNode } from "react";

const VARIANTS = {
  default: "bg-white/10 text-white/80",
  verified: "bg-blue-500/15 text-blue-400",
  live: "bg-emerald-500/15 text-emerald-400",
} as const;

export function Badge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${VARIANTS[variant]}`}
    >
      {children}
    </span>
  );
}
