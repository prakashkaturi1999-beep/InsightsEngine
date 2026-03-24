"use client";

import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Legend,
} from "recharts";
import {
  ArrowRight, TrendingUp, TrendingDown,
  AlertTriangle, AlertCircle, Info,
  Zap, ChevronRight, ArrowUpRight, DollarSign, Target,
  ShoppingCart, Percent, Building2, Users, Utensils,
} from "lucide-react";
import { useFinanceFilters, dateRangeLabel } from "@/lib/financeFilterContext";
import {
  getFinanceKpis, getFinanceTrend, getStorePnL,
  getChannelMix, getLeakage, getFinanceAlerts
} from "@/lib/financeDataEngine";

const channelColors = ["#6366f1", "#8b5cf6", "#0ea5e9", "#06b6d4", "#10b981", "#f59e0b"];

const quickLinks = [
  { href: "/finance/overview", label: "P&L Deep Dive", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
  { href: "/finance/cash-flow", label: "Treasury", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
  { href: "/finance/leakage", label: "Leakage", icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50" },
];

const alertIcon: Record<string, any> = { critical: AlertTriangle, high: AlertTriangle, medium: AlertCircle, low: Info, info: Info };
const alertColor: Record<string, string> = {
  critical: "text-rose-500 bg-rose-50 ring-rose-200",
  high: "text-orange-500 bg-orange-50 ring-orange-200",
  medium: "text-amber-500 bg-amber-50 ring-amber-200",
  low: "text-blue-500 bg-blue-50 ring-blue-200",
  info: "text-slate-500 bg-slate-50 ring-slate-200",
};
const alertBadge: Record<string, string> = {
  critical: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
  high: "bg-orange-100 text-orange-700 ring-1 ring-orange-200",
  medium: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  low: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  info: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
};

function fmtM(v: number) { return "$" + (v / 1_000_000).toFixed(1) + "M"; }
function fmtK(v: number) { return "$" + (v / 1000).toFixed(0) + "K"; }
function fmtDollar(v: number) { return "$" + v.toLocaleString(); }
function fmtAxisM(v: number) { return "$" + (v / 1_000_000).toFixed(1) + "M"; }
function fmtNum(v: number) { return v >= 1_000_000 ? (v / 1_000_000).toFixed(1) + "M" : (v / 1000).toFixed(0) + "K"; }

export default function FinanceHomePage() {
  const { filters } = useFinanceFilters();
  const kpis = getFinanceKpis(filters);
  const trend = getFinanceTrend(filters);
  const stores = getStorePnL(filters).sort((a, b) => b.ebitda4Wall - a.ebitda4Wall);
  const channels = getChannelMix(filters);
  const leakage = getLeakage(filters);
  const alerts = getFinanceAlerts(filters);

  const totalLeakage = leakage.reduce((s, l) => s + l.value, 0);

  // Comp vs Non-Comp SSSG comparison
  const compData = [
    { name: "Comp Stores", sssg: kpis.sssg, avgCheck: kpis.averageCheck, count: kpis.compUnitCount },
    { name: "New Stores", sssg: kpis.sssg + 8.5, avgCheck: kpis.averageCheck + 1.2, count: kpis.unitCount - kpis.compUnitCount },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">CFO Command Center</h1>
          <p className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span className="text-slate-800">{filters.org}</span>
            {filters.brand !== "All Brands" && <><ChevronRight size={14} className="text-slate-300" /> <span className="text-slate-700">{filters.brand}</span></>}
            {filters.location !== "All Locations" && <><ChevronRight size={14} className="text-slate-300" /> <span className="text-slate-700">{filters.location}</span></>}
            <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">{dateRangeLabel(filters.dateRange)}</span>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700">{kpis.unitCount} Units</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {quickLinks.map((ql) => {
            const Icon = ql.icon;
            return (
              <Link key={ql.href} href={ql.href} className="group flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-3 py-2 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
                <div className={"flex h-6 w-6 items-center justify-center rounded-lg " + ql.bg}><Icon size={13} className={ql.color} /></div>
                <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900">{ql.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* KPI Row 1 — Revenue & Growth */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative overflow-hidden rounded-3xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50/80 to-indigo-100/30 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -top-4 opacity-5"><DollarSign size={90} className="text-indigo-900" /></div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-500 mb-1">Net Revenue</p>
          <p className="text-2xl font-extrabold text-indigo-950">{fmtM(kpis.netRevenue)}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-indigo-200/50 text-indigo-700"><TrendingUp size={11} /> +12.4%</span>
            <span className="text-[10px] font-medium text-indigo-600/80">vs prior year</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/80 to-emerald-100/30 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -top-4 opacity-5"><TrendingUp size={90} className="text-emerald-900" /></div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-1">Same-Store Sales Growth</p>
          <p className="text-2xl font-extrabold text-emerald-950">+{kpis.sssg}%</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-emerald-200/50 text-emerald-800"><TrendingUp size={11} /> +80bps</span>
            <span className="text-[10px] font-medium text-emerald-700/80">vs prior quarter</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-violet-200/60 bg-gradient-to-br from-violet-50/80 to-violet-100/30 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -top-4 opacity-5"><Building2 size={90} className="text-violet-900" /></div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-violet-600 mb-1">Avg Unit Volume (Weekly)</p>
          <p className="text-2xl font-extrabold text-violet-950">{fmtK(kpis.auvWeekly)}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10px] font-medium text-violet-600/80">{kpis.compUnitCount} comp / {kpis.unitCount - kpis.compUnitCount} new units</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-amber-100/30 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -top-4 opacity-5"><ShoppingCart size={90} className="text-amber-900" /></div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600 mb-1">Transactions / Avg Check</p>
          <p className="text-2xl font-extrabold text-amber-950">{fmtNum(kpis.transactionCount)}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-amber-200/50 text-amber-800">{"$" + kpis.averageCheck.toFixed(2)} avg</span>
            <span className="text-[10px] font-medium text-amber-700/80">check size</span>
          </div>
        </div>
      </div>

      {/* KPI Row 2 — Cost Structure & Profitability */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={"relative overflow-hidden rounded-3xl border p-5 shadow-sm hover:shadow-md transition-shadow " + (kpis.primeCostPct > 60 ? "border-rose-200/60 bg-gradient-to-br from-rose-50/80 to-rose-100/30" : "border-cyan-200/60 bg-gradient-to-br from-cyan-50/80 to-cyan-100/30")}>
          <div className="absolute -right-4 -top-4 opacity-5"><Percent size={90} className={kpis.primeCostPct > 60 ? "text-rose-900" : "text-cyan-900"} /></div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Prime Cost %</p>
          <p className={"text-2xl font-extrabold " + (kpis.primeCostPct > 60 ? "text-rose-900" : "text-cyan-950")}>{kpis.primeCostPct}%</p>
          <div className="mt-2 text-[10px] font-medium text-slate-500">Food {kpis.foodCostPct}% + Labor {kpis.laborPct}%</div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-teal-200/60 bg-gradient-to-br from-teal-50/80 to-teal-100/30 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -top-4 opacity-5"><Utensils size={90} className="text-teal-900" /></div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-teal-600 mb-1">4-Wall EBITDA</p>
          <p className="text-2xl font-extrabold text-teal-950">{fmtM(kpis.restaurantEbitda)}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-teal-200/50 text-teal-800">{kpis.restaurantEbitdaMargin}%</span>
            <span className="text-[10px] font-medium text-teal-700/80">restaurant-level</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-blue-200/60 bg-gradient-to-br from-blue-50/80 to-blue-100/30 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -top-4 opacity-5"><Target size={90} className="text-blue-900" /></div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600 mb-1">Corporate EBITDA</p>
          <p className="text-2xl font-extrabold text-blue-950">{fmtM(kpis.corporateEbitda)}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold bg-blue-200/50 text-blue-800">{kpis.corporateEbitdaMargin}%</span>
            <span className="text-[10px] font-medium text-blue-700/80">after G&A</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-rose-200/60 bg-gradient-to-br from-rose-50/80 to-rose-100/30 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -top-4 opacity-5"><AlertTriangle size={90} className="text-rose-900" /></div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-rose-500 mb-1">Leakage Impact</p>
          <p className="text-2xl font-extrabold text-rose-600">{fmtM(totalLeakage)}</p>
          <div className="mt-2 text-[10px] font-medium text-rose-600/80">{((totalLeakage / kpis.netRevenue) * 100).toFixed(1)}% of net revenue</div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Main Column */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Revenue vs EBITDA Trend */}
          <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 mb-0.5">Revenue vs EBITDA Velocity — {dateRangeLabel(filters.dateRange)}</h2>
                <p className="text-xs text-slate-500">Net Revenue and Corporate EBITDA by period</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gRevE" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gEbitE" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.2} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={fmtAxisM} dx={-10} />
                <Tooltip cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ fontSize: 11, borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }} formatter={((v: number) => [fmtDollar(v)]) as any} />
                <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600, paddingTop: 20 }} iconType="circle" />
                <Area type="monotone" dataKey="revenue" name="Net Revenue" stroke="#6366f1" strokeWidth={3} fill="url(#gRevE)" activeDot={{ r: 5, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="ebitda" name="EBITDA" stroke="#10b981" strokeWidth={3} fill="url(#gEbitE)" activeDot={{ r: 5, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Channel Mix + Comp vs Non-Comp */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Channel Mix Horizontal Bars */}
            <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-4">Revenue by Channel</h2>
              <div className="space-y-3">
                {channels.map((ch, i) => {
                  const pct = Math.round((ch.value / kpis.netRevenue) * 100);
                  return (
                    <div key={ch.name}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700">{ch.name}</span>
                        <span className="font-bold text-slate-900">{fmtM(ch.value)} <span className="text-slate-400 font-normal">({pct}%)</span></span>
                      </div>
                      <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: pct + "%", backgroundColor: channelColors[i] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comp vs Non-Comp Performance */}
            <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-4">Comp vs New Store Performance</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={compData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }} barGap={8} barSize={50}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12, fontWeight: 600 }} />
                  <Bar dataKey="sssg" name="SSSG %" fill="#6366f1" radius={[4, 4, 0, 0]}>
                    <Cell fill="#6366f1" />
                    <Cell fill="#10b981" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-2 grid grid-cols-2 gap-4">
                {compData.map(c => (
                  <div key={c.name} className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{c.name}</p>
                    <p className="text-sm font-extrabold text-slate-900">{c.count} units</p>
                    <p className="text-xs font-bold text-indigo-600">{"$" + c.avgCheck.toFixed(2)} avg check</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Stores by 4-Wall EBITDA */}
          <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl shadow-sm flex flex-col">
            <div className="border-b border-slate-100/50 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-slate-900 mb-0.5">Unit Economics — Top Performers</h2>
                <p className="text-xs text-slate-500">Stores ranked by 4-Wall EBITDA contribution</p>
              </div>
              <Link href="/finance/store-profitability" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors">
                <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="flex-1 p-2 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100/50 text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">#</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Store</th>
                    <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">AUV</th>
                    <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">4-Wall EBITDA</th>
                    <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">Margin</th>
                    <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">Prime Cost</th>
                    <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">RPLH</th>
                    <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">Comp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {stores.slice(0, 5).map((s, i) => {
                    const rankColors = ["bg-amber-100 text-amber-700", "bg-slate-200 text-slate-700", "bg-orange-100 text-orange-800"];
                    const rankClass = rankColors[i] || "bg-slate-100 text-slate-500";
                    return (
                      <tr key={s.name} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-4 py-3 w-8"><span className={"flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold " + rankClass}>{i + 1}</span></td>
                        <td className="px-4 py-3 font-bold text-slate-800 group-hover:text-emerald-900 transition-colors">{s.name}</td>
                        <td className="px-4 py-3 text-right font-bold text-slate-600">{fmtK(s.auvWeekly)}</td>
                        <td className="px-4 py-3 text-right font-extrabold text-indigo-900">{fmtDollar(s.ebitda4Wall)}</td>
                        <td className="px-4 py-3 text-right"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold text-xs">{s.margin4Wall}%</span></td>
                        <td className={"px-4 py-3 text-right font-bold text-xs " + (s.primeCost > 60 ? "text-rose-600" : "text-slate-600")}>{s.primeCost}%</td>
                        <td className="px-4 py-3 text-right font-bold text-slate-600">{"$" + s.rplh.toFixed(0)}</td>
                        <td className="px-4 py-3 text-center">{s.compStore ? <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" /> : <span className="h-2 w-2 rounded-full bg-amber-400 inline-block" />}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar (AI Signals) */}
        <div className="w-full xl:w-[340px] flex-shrink-0 space-y-6">
          <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl shadow-sm overflow-hidden sticky top-24">
            <div className="border-b border-slate-100/50 px-6 py-5 flex justify-between items-center bg-white/80">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-sm font-bold text-slate-900">AI Finance Signals</h2>
              </div>
              <span className="text-[10px] font-bold text-slate-400">{alerts.length} active</span>
            </div>
            <div className="divide-y divide-slate-100/50 max-h-[800px] overflow-y-auto">
              {alerts.map((alert) => {
                const Icon = alertIcon[alert.severity] || Info;
                const badgeStyle = alertBadge[alert.severity] || "";
                const colorStyle = alertColor[alert.severity] || "";
                return (
                  <div key={alert.id} className="p-5 hover:bg-slate-50/50 transition-colors group cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className={"mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl shadow-sm ring-0 border border-white/20 " + colorStyle}>
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={"rounded-full px-2 py-0.5 text-[9px] uppercase tracking-widest font-extrabold border " + badgeStyle}>{alert.severity}</span>
                          <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">4m ago</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 leading-tight mb-1 group-hover:text-emerald-700 transition-colors">{alert.title}</p>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed">{alert.detail}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-4 bg-slate-50/50 border-t border-slate-100/50">
              <button className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 shadow-sm hover:border-slate-300 hover:text-slate-900 transition-all flex items-center justify-center gap-1.5">
                View All Signals <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
