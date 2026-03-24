"use client";

import type { AccessBadge } from "@/lib/executiveMock";

const badgeStyles: Record<AccessBadge, string> = {
  "CEO Access":
    "bg-slate-900 text-white ring-1 ring-slate-900/10 shadow-sm",
  "Org Admin": "bg-indigo-600 text-white ring-1 ring-indigo-600/10 shadow-sm",
  "Brand Admin":
    "bg-sky-600 text-white ring-1 ring-sky-600/10 shadow-sm",
  "Location Manager":
    "bg-emerald-600 text-white ring-1 ring-emerald-600/10 shadow-sm",
  Analyst: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
};

export function RoleBadge({ badge }: { badge: AccessBadge }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${badgeStyles[badge]}`}
    >
      {badge}
    </span>
  );
}

