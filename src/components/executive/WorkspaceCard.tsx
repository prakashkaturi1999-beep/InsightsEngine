"use client";

import Link from "next/link";
import type { WorkspaceCard as WorkspaceCardType } from "@/lib/executiveMock";
import { Sparkline } from "@/components/executive/Sparkline";
import {
  WalletCards,
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  HeartPulse,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  MessageSquare,
} from "lucide-react";

const icons: Record<WorkspaceCardType["id"], React.ReactNode> = {
  finance: <WalletCards size={18} />,
  sales: <BarChart3 size={18} />,
  orders: <ShoppingCart size={18} />,
  inventory: <Package size={18} />,
  hr: <Users size={18} />,
  customer: <HeartPulse size={18} />,
};

const statusConfig = {
  healthy: {
    pill: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
    label: "Healthy",
    line: "#16a34a",
    glow: "from-emerald-500/10",
  },
  watch: {
    pill: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-400",
    label: "Watch",
    line: "#f59e0b",
    glow: "from-amber-500/10",
  },
  atRisk: {
    pill: "bg-rose-50 text-rose-700 ring-rose-200",
    dot: "bg-rose-500",
    label: "At risk",
    line: "#e11d48",
    glow: "from-rose-500/10",
  },
};

export function WorkspaceCard({ card }: { card: WorkspaceCardType }) {
  const cfg = statusConfig[card.status];
  return (
    <Link
      href={card.href}
      className="domain-card group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20"
      aria-label={`Open ${card.title}`}
    >
      {/* subtle gradient accent based on status */}
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${cfg.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm flex-shrink-0 group-hover:bg-slate-800 transition-colors">
            {icons[card.id]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold text-slate-900">{card.title}</span>
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${cfg.pill}`}>
                <span className={`h-1.5 w-1.5 rounded-full pulse-dot ${cfg.dot}`} />
                {cfg.label}
              </span>
            </div>
            <div className="mt-0.5 text-xs text-slate-500 leading-relaxed">{card.description}</div>
          </div>
        </div>
        <div className="flex-shrink-0 pt-1">
          <Sparkline data={card.spark} color={cfg.line} />
        </div>
      </div>

      {/* KPI row */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {card.kpis.slice(0, 3).map((k) => {
          const isUp = k.deltaPct >= 0;
          return (
            <div key={k.label} className="rounded-xl bg-slate-50 px-3 py-2.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{k.label}</div>
              <div className="mt-1 text-sm font-bold text-slate-900">{k.value}</div>
              <div className={`mt-0.5 flex items-center gap-0.5 text-[11px] font-semibold ${isUp ? "text-emerald-600" : "text-rose-600"}`}>
                {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {isUp ? "+" : ""}{k.deltaPct.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* CEO note */}
      {card.note && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5">
          <MessageSquare size={12} className="mt-0.5 flex-shrink-0 text-slate-400" />
          <p className="text-xs text-slate-600 leading-relaxed">{card.note}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          {["Quick view", "Analyse", "Export"].map((tag) => (
            <span key={tag} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-500">
              {tag}
            </span>
          ))}
        </div>
        <span className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm group-hover:bg-slate-800 transition-colors">
          Open
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
