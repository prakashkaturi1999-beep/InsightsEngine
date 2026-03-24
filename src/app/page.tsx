/* eslint-disable @next/next/no-sync-scripts */
"use client";

import { useState } from "react";
import { TopNav } from "@/components/executive/TopNav";
import {
  ExecutiveScopeProvider,
  useExecutiveScope,
} from "@/components/executive/ExecutiveScopeProvider";
import {
  currentScope,
  currentUser,
  governanceSnapshot,
  workspaces,
  getPerformanceRows,
} from "@/lib/executiveMock";
import { WorkspaceCard } from "@/components/executive/WorkspaceCard";
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  AlertCircle,
  Info,
  Shield,
  CheckCircle2,
} from "lucide-react";

export default function ExecutiveLandingPage() {
  return (
    <ExecutiveScopeProvider initialScope={currentScope}>
      <ExecutiveLandingBody />
    </ExecutiveScopeProvider>
  );
}

function ExecutiveLandingBody() {
  const { scope } = useExecutiveScope();
  const [dateRange, setDateRange] = useState("7d");
  const [comparison, setComparison] = useState("week");

  // Scope-reactive performance rows
  const perfRows = getPerformanceRows(scope);

  // Derive label for the table header based on scope level
  const perfTableTitle =
    scope.location !== "All Locations"
      ? scope.location
      : scope.brand !== "All Brands"
      ? `${scope.brand} — Locations`
      : `${scope.org} — Brands`;

  // Derive sidebar priorities from workspace notes
  const domainPriorities = workspaces
    .filter((ws) => ws.status !== "healthy" || ws.note)
    .sort((a, b) => {
      const order = { atRisk: 0, watch: 1, healthy: 2 };
      return order[a.status as keyof typeof order] - order[b.status as keyof typeof order];
    });

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Background ambient blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-20 h-[500px] w-[500px] rounded-full bg-indigo-200/15 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-[400px] w-[400px] rounded-full bg-amber-200/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-rose-200/10 blur-3xl" />
      </div>

      {/* Top nav */}
      <TopNav
        user={currentUser}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        comparison={comparison}
        onComparisonChange={setComparison}
      />

      <main className="mx-auto max-w-[1600px] px-6 py-6 space-y-6">
        {/* Page header row */}
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Executive View
            </p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">
              Good morning, {currentUser.name.split(" ")[0]}.
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Viewing{" "}
              <span className="font-semibold text-slate-700">{scope.org}</span>
              {scope.brand !== "All Brands" && (
                <>
                  {" "}
                  ·{" "}
                  <span className="font-semibold text-slate-700">
                    {scope.brand}
                  </span>
                </>
              )}
              {scope.location !== "All Locations" && (
                <>
                  {" "}
                  ·{" "}
                  <span className="font-semibold text-slate-700">
                    {scope.location}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ─── MAIN CONTENT ─── */}
          <div className="lg:col-span-8 space-y-6">
            {/* Organisation Performance */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Organisation Performance
                  </h2>
                  <p className="text-xs text-slate-500">
                    {perfTableTitle} — Revenue, COGS, Labour, Guest Score, Avg
                    Ticket &amp; Alerts.
                  </p>
                </div>
                <button className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                  Portfolio view <ArrowRight size={12} />
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-slate-100 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <PerfTh>
                        {scope.location !== "All Locations"
                          ? "Location"
                          : scope.brand !== "All Brands"
                          ? "Location"
                          : "Brand / Org"}
                      </PerfTh>
                      <PerfTh align="right">Revenue</PerfTh>
                      <PerfTh align="right">COGS %</PerfTh>
                      <PerfTh align="right">Labour %</PerfTh>
                      <PerfTh align="right">Guest Score</PerfTh>
                      <PerfTh align="right">Avg Ticket</PerfTh>
                      <PerfTh align="right">Alerts</PerfTh>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {perfRows
                      .slice()
                      .sort((a, b) => b.revenue - a.revenue)
                      .map((row, i) => (
                        <tr
                          key={row.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                                {i + 1}
                              </span>
                              <span className="font-semibold text-slate-900">
                                {row.name}
                              </span>
                              <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 capitalize">
                                {row.level}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-right font-semibold text-slate-900">
                            ${Math.round(row.revenue / 1000).toLocaleString()}K
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <Metric
                              value={`${row.cogsPct.toFixed(1)}%`}
                              good={row.cogsPct <= 28.5}
                              invert
                            />
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <Metric
                              value={`${row.laborPct.toFixed(1)}%`}
                              good={row.laborPct <= 29}
                              invert
                            />
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <Metric
                              value={String(row.guestScore)}
                              good={row.guestScore >= 63}
                            />
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <Metric
                              value={`$${row.avgTicket.toFixed(2)}`}
                              good={row.avgTicket >= 17}
                            />
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                row.alerts >= 3
                                  ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                                  : row.alerts >= 1
                                  ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                                  : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                              }`}
                            >
                              {row.alerts}
                            </span>
                          </td>
                        </tr>
                      ))}
                    {perfRows.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-5 py-8 text-center text-sm text-slate-400"
                        >
                          No data available for the current scope.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Domain cards */}
            <section>
              <div className="mb-3">
                <h2 className="text-sm font-semibold text-slate-900">
                  Business Domains
                </h2>
                <p className="text-xs text-slate-500">
                  Deep-dive into any domain — KPIs, trends, and
                  performance-based notes.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {workspaces.map((ws) => (
                  <WorkspaceCard key={ws.id} card={ws} />
                ))}
              </div>
            </section>
          </div>

          {/* ─── SIDEBAR ─── */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Domain Priorities */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 px-5 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Today's Priorities
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Derived from domain performance signals.
                  </p>
                </div>
                <button className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50">
                  All <ArrowRight size={11} />
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {domainPriorities.map((ws) => {
                  const IconEl =
                    ws.status === "atRisk"
                      ? AlertTriangle
                      : ws.status === "watch"
                      ? AlertCircle
                      : Info;
                  const iconColor =
                    ws.status === "atRisk"
                      ? "text-rose-500"
                      : ws.status === "watch"
                      ? "text-amber-500"
                      : "text-blue-400";
                  const bgColor =
                    ws.status === "atRisk"
                      ? "bg-rose-50"
                      : ws.status === "watch"
                      ? "bg-amber-50"
                      : "bg-blue-50";
                  return (
                    <div key={ws.id} className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${bgColor}`}
                        >
                          <IconEl size={13} className={iconColor} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-900">
                              {ws.title}
                            </span>
                            <span
                              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ring-1 ${
                                ws.status === "atRisk"
                                  ? "bg-rose-50 text-rose-700 ring-rose-200"
                                  : ws.status === "watch"
                                  ? "bg-amber-50 text-amber-700 ring-amber-200"
                                  : "bg-blue-50 text-blue-700 ring-blue-200"
                              }`}
                            >
                              {ws.status === "atRisk"
                                ? "At Risk"
                                : ws.status === "watch"
                                ? "Watch"
                                : "Note"}
                            </span>
                          </div>
                          {ws.note && (
                            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                              {ws.note}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Access Governance */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-slate-500" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Access Governance
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Role visibility, requests, and risk flags.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 p-4">
                <MiniStat
                  label="Active users"
                  value={String(governanceSnapshot.activeUsers)}
                />
                <MiniStat
                  label="Pending"
                  value={String(governanceSnapshot.pendingRequests)}
                  tone="warn"
                />
                <MiniStat
                  label="Org admins"
                  value={String(governanceSnapshot.orgAdmins)}
                />
                <MiniStat
                  label="Loc. managers"
                  value={String(governanceSnapshot.locationManagers)}
                />
                <MiniStat
                  label="Finance access"
                  value={String(governanceSnapshot.financeAccess)}
                />
                <MiniStat
                  label="HR access"
                  value={String(governanceSnapshot.hrAccess)}
                />
                <MiniStat
                  label="Risky combos"
                  value={String(governanceSnapshot.riskyCombos)}
                  tone="bad"
                />
                <MiniStat
                  label="Need review"
                  value={String(governanceSnapshot.needReview)}
                  tone="warn"
                />
              </div>
              <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1.5">
                  Key questions
                </p>
                <ul className="space-y-1">
                  {[
                    "Who can see Finance?",
                    "Who has cross-brand access?",
                    "Which users are inactive?",
                  ].map((q) => (
                    <li
                      key={q}
                      className="flex items-center gap-2 text-xs text-slate-600"
                    >
                      <CheckCircle2
                        size={11}
                        className="text-slate-300 flex-shrink-0"
                      />{" "}
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>

        <footer className="pb-4 text-center text-[11px] text-slate-400">
          Insights Engine · Mock data for prototyping ·{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </footer>
      </main>
    </div>
  );
}

/* ─── Helper components ─── */

function PerfTh({
  children,
  align,
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function Metric({
  value,
  good,
  invert,
}: {
  value: string;
  good: boolean;
  invert?: boolean;
}) {
  const isGood = invert ? !good : good;
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold ${
        isGood ? "text-emerald-700" : "text-rose-600"
      }`}
    >
      {isGood ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {value}
    </span>
  );
}

function MiniStat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "warn" | "bad";
}) {
  const styles =
    tone === "bad"
      ? "bg-rose-50 ring-rose-200"
      : tone === "warn"
      ? "bg-amber-50 ring-amber-200"
      : "bg-slate-50 ring-slate-200";
  return (
    <div className={`rounded-xl p-3 ring-1 ${styles}`}>
      <div className="text-base font-bold text-slate-800">{value}</div>
      <div className="mt-0.5 text-[11px] font-medium text-slate-500">
        {label}
      </div>
    </div>
  );
}
