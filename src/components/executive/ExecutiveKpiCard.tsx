"use client";

import type { ExecutiveKpi } from "@/lib/executiveMock";
import { Sparkline } from "@/components/executive/Sparkline";
import {
  DollarSign,
  TrendingUp,
  BadgePercent,
  Wallet,
  Boxes,
  UsersRound,
  MessageSquare,
  AlertOctagon,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  rev: <DollarSign size={16} />,
  margin: <BadgePercent size={16} />,
  sss: <TrendingUp size={16} />,
  cash: <Wallet size={16} />,
  inventory: <Boxes size={16} />,
  labor: <UsersRound size={16} />,
  nps: <MessageSquare size={16} />,
  alerts: <AlertOctagon size={16} />,
};

function statusColor(status: ExecutiveKpi["status"]) {
  switch (status) {
    case "good":
      return { dot: "bg-emerald-500", line: "#16a34a", chip: "bg-emerald-50 text-emerald-700 ring-emerald-200" };
    case "warn":
      return { dot: "bg-amber-500", line: "#f59e0b", chip: "bg-amber-50 text-amber-700 ring-amber-200" };
    case "bad":
      return { dot: "bg-rose-500", line: "#e11d48", chip: "bg-rose-50 text-rose-700 ring-rose-200" };
    default:
      return { dot: "bg-slate-400", line: "#64748b", chip: "bg-slate-50 text-slate-700 ring-slate-200" };
  }
}

export function ExecutiveKpiCard({ kpi }: { kpi: ExecutiveKpi }) {
  const c = statusColor(kpi.status);
  const isPositive = kpi.deltaPct >= 0;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${c.dot}`} aria-hidden="true" />
            <div className="truncate text-xs font-semibold uppercase tracking-wide text-slate-500">
              {kpi.label}
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-2xl font-semibold tracking-tight text-slate-900">
              {kpi.value}
            </div>
            <div
              className={`text-xs font-semibold ${isPositive ? "text-emerald-600" : "text-rose-600"}`}
            >
              {isPositive ? "+" : ""}
              {kpi.deltaPct.toFixed(1)}%
            </div>
          </div>
          {kpi.targetLabel && kpi.targetValue && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1">
              <span className={`rounded-full px-2 py-0.5 ${c.chip} ring-1 ${c.chip.includes("ring-") ? "" : "ring-slate-200"}`}>
                {kpi.targetLabel}: {kpi.targetValue}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-start gap-3">
          <div className="hidden sm:block">
            <Sparkline data={kpi.spark} color={c.line} />
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-700 ring-1 ring-slate-200">
            {iconMap[kpi.id] ?? iconMap.rev}
          </div>
        </div>
      </div>
    </div>
  );
}

