"use client";

import { useFinanceFilters, dateRangeLabel } from "@/lib/financeFilterContext";
import { getFinanceKpis, getLeakage, getTopExceptions, getFinanceAlerts, getFinanceTrend } from "@/lib/financeDataEngine";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  AreaChart, Area,
} from "recharts";
import { ShieldAlert, AlertTriangle, ArrowRight, TrendingDown, CheckCircle2, Eye, Flag } from "lucide-react";

const leakageColors = ["#ef4444", "#f59e0b", "#f97316", "#ec4899", "#8b5cf6", "#6366f1", "#94a3b8"];

function fmtM(v: number) { return "$" + (v / 1_000_000).toFixed(1) + "M"; }
function fmtK(v: number) { return "$" + (v / 1000).toFixed(0) + "K"; }
function fmtDollar(v: number) { return "$" + v.toLocaleString(); }
function fmtAxisK(v: number) { return "$" + (v / 1000).toFixed(0) + "K"; }

export default function LeakagePage() {
  const { filters } = useFinanceFilters();
  const kpis = getFinanceKpis(filters);
  const leakage = getLeakage(filters);
  const exceptions = getTopExceptions();
  const alerts = getFinanceAlerts(filters).filter(a => a.severity === "critical" || a.severity === "high");
  const trend = getFinanceTrend(filters);

  const totalLeakage = leakage.reduce((s, l) => s + l.value, 0);
  const leakagePct = ((totalLeakage / kpis.netRevenue) * 100).toFixed(1);

  // Leakage velocity trend
  const leakageTrend = trend.map((t, i) => ({
    day: t.day,
    leakage: Math.round(totalLeakage / trend.length * (0.85 + Math.random() * 0.3)),
  }));

  const breachedItems = leakage.filter(l => l.pctOfRev > l.threshold);

  const flagColors: Record<string, string> = {
    critical: "bg-rose-100 text-rose-700 border-rose-200",
    high: "bg-orange-100 text-orange-700 border-orange-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Leakage & Exceptions</h1>
        <p className="text-sm text-slate-500">Void-to-sales ratio, discount depth, comp meal tracking, shrinkage monitoring, and LP exceptions</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative overflow-hidden rounded-3xl border border-rose-200/60 bg-gradient-to-br from-rose-50/80 to-rose-100/30 p-5 shadow-sm">
          <div className="absolute -right-4 -top-4 opacity-5"><ShieldAlert size={80} className="text-rose-900" /></div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500 mb-1">Total Leakage</p>
          <p className="text-2xl font-extrabold text-rose-900">{fmtM(totalLeakage)}</p>
          <p className="text-[10px] font-bold text-rose-600/80 mt-1">{leakagePct}% of net revenue</p>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-amber-100/30 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -top-4 opacity-5"><AlertTriangle size={80} className="text-amber-900" /></div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500 mb-1">Void-to-Sales Ratio</p>
          <p className="text-2xl font-extrabold text-amber-900">{leakage.find(l => l.name === "Voids")?.pctOfRev || 0}%</p>
          <p className="text-[10px] font-bold text-amber-600/80 mt-1">SLA Threshold: {leakage.find(l => l.name === "Voids")?.threshold || 0}%</p>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-violet-200/60 bg-gradient-to-br from-violet-50/80 to-violet-100/30 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -top-4 opacity-5"><TrendingDown size={80} className="text-violet-900" /></div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-violet-500 mb-1">Discount Depth</p>
          <p className="text-2xl font-extrabold text-violet-900">{leakage.find(l => l.name.includes("Discount"))?.pctOfRev || 0}%</p>
          <p className="text-[10px] font-bold text-violet-600/80 mt-1">{fmtK(leakage.find(l => l.name.includes("Discount"))?.value || 0)} total</p>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-blue-200/60 bg-gradient-to-br from-blue-50/80 to-blue-100/30 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -top-4 opacity-5"><Flag size={80} className="text-blue-900" /></div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500 mb-1">LP Exceptions</p>
          <p className="text-2xl font-extrabold text-blue-900">{exceptions.length}</p>
          <p className="text-[10px] font-bold text-blue-600/80 mt-1">{exceptions.filter(e => e.flag === "critical" || e.flag === "high").length} high-priority flags</p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 space-y-6 min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Leakage Waterfall */}
            <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-4">Leakage Breakdown</h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={leakage} margin={{ top: 10, right: 10, left: 10, bottom: 0 }} barSize={30}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} tickFormatter={(v: string) => v.length > 10 ? v.substring(0, 10) + "..." : v} />
                  <YAxis tickFormatter={fmtAxisK} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12, fontWeight: 600 }} formatter={((v: number) => [fmtDollar(v), "Leakage"]) as any} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {leakage.map((_, i) => <Cell key={"lk" + i} fill={leakageColors[i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Leakage Velocity Trend */}
            <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-4">Leakage Velocity</h2>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={leakageTrend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gLk" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tickFormatter={fmtAxisK} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: "none" }} formatter={((v: number) => [fmtDollar(v), "Leakage"]) as any} />
                  <Area type="monotone" dataKey="leakage" stroke="#ef4444" strokeWidth={3} fill="url(#gLk)" activeDot={{ r: 5, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Exception Ledger */}
          <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl shadow-sm flex flex-col">
            <div className="border-b border-slate-100/50 p-5">
              <h2 className="text-sm font-bold text-slate-900 mb-0.5">Top Exception Transactions</h2>
              <p className="text-xs text-slate-500">Flagged items requiring Loss Prevention investigation</p>
            </div>
            <div className="flex-1 p-2 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100/50 text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">ID</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Date</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Store</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Type</th>
                    <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">Amount</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Description</th>
                    <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50/50">
                  {exceptions.map(ex => (
                    <tr key={ex.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                      <td className="px-4 py-3 font-bold text-xs text-indigo-600">{ex.id}</td>
                      <td className="px-4 py-3 font-medium text-xs text-slate-500">{ex.date}</td>
                      <td className="px-4 py-3 font-bold text-slate-800">{ex.store}</td>
                      <td className="px-4 py-3 font-semibold text-xs text-slate-600">{ex.type}</td>
                      <td className="px-4 py-3 text-right font-extrabold text-rose-700">{"$" + ex.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 font-medium text-xs text-slate-500 max-w-[200px] truncate">{ex.description}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={"inline-flex items-center gap-1 text-[9px] font-extrabold uppercase rounded-full px-2:5 py-0.5 border " + (flagColors[ex.flag] || "")}>
                          <Flag size={10} />{ex.flag}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Threshold Breaches Table */}
          <div className="rounded-3xl border border-rose-200/60 bg-rose-50/20 backdrop-blur-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={16} className="text-rose-600" />
              <h2 className="text-sm font-bold text-rose-900">SLA Threshold Breaches</h2>
            </div>
            <div className="space-y-3">
              {breachedItems.length === 0 ? (
                <p className="flex items-center gap-2 text-xs font-medium text-emerald-700"><CheckCircle2 size={14} /> All leakage lines within SLA thresholds.</p>
              ) : breachedItems.map(item => (
                <div key={item.name} className="flex items-center justify-between bg-white/80 rounded-xl border border-rose-100 p-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.name}</p>
                    <p className="text-[10px] font-medium text-slate-500">Current: {item.pctOfRev}% / Threshold: {item.threshold}%</p>
                  </div>
                  <span className="text-xs font-extrabold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">+{(item.pctOfRev - item.threshold).toFixed(1)}pp over</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar — Anomali Alerts */}
        <div className="w-full xl:w-[320px] flex-shrink-0 space-y-6">
          <div className="rounded-3xl border border-rose-200/60 bg-white/60 backdrop-blur-xl shadow-sm overflow-hidden sticky top-24">
            <div className="border-b border-rose-100/50 px-5 py-4 bg-rose-50/50">
              <div className="flex items-center gap-2"><Eye size={15} className="text-rose-600" /><h2 className="text-sm font-bold text-slate-900">LP / Anomaly Signals</h2></div>
            </div>
            <div className="divide-y divide-slate-100/50">
              {alerts.map(a => (
                <div key={a.id} className="p-4 hover:bg-slate-50/50 transition-colors cursor-pointer">
                  <p className="text-sm font-bold text-slate-900 leading-tight mb-1">{a.title}</p>
                  <p className="text-xs font-medium text-slate-500 leading-relaxed mb-2">{a.detail}</p>
                  <button className="text-[10px] font-bold text-rose-600 uppercase flex items-center gap-1">Investigate <ArrowRight size={12} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
