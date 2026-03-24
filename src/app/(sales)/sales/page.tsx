"use client";

import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  ArrowRight, TrendingUp, TrendingDown,
  AlertTriangle, AlertCircle, Info,
  Zap, BarChart3, Package, Users,
  ChevronRight, ArrowUpRight
} from "lucide-react";
import { useSalesFilters, dateRangeLabel, comparisonLabel } from "@/lib/salesFilterContext";
import {
  getDailySnapshot, getSalesTrend, getHomeDonutData,
  getHomeSalesTrend, getHomeStoreSales, getSalesAlerts,
  getChannelSummary, getTopProducts, getOverviewDailyTrend,
} from "@/lib/salesDataEngine";
import { overviewStoreDonut } from "@/lib/salesMockData";

const donutColors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const quickLinks = [
  { href: "/sales/channels", label: "Channels", icon: BarChart3, color: "text-indigo-600", bg: "bg-indigo-50", hover: "hover:border-indigo-200 hover:shadow-indigo-100/50" },
  { href: "/sales/items", label: "Items", icon: Package, color: "text-emerald-600", bg: "bg-emerald-50", hover: "hover:border-emerald-200 hover:shadow-emerald-100/50" },
  { href: "/sales/employees", label: "Staff", icon: Users, color: "text-amber-600", bg: "bg-amber-50", hover: "hover:border-amber-200 hover:shadow-amber-100/50" },
];

const alertIcon = { critical: AlertTriangle, high: AlertTriangle, medium: AlertCircle, low: Info };
const alertColor = {
  critical: "text-rose-500 bg-rose-50 ring-rose-200",
  high: "text-rose-400 bg-rose-50 ring-rose-200",
  medium: "text-amber-500 bg-amber-50 ring-amber-200",
  low: "text-blue-500 bg-blue-50 ring-blue-200",
};
const alertBadge = {
  critical: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
  high: "bg-rose-50 text-rose-600 ring-1 ring-rose-200",
  medium: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  low: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
};

// Component for horizontal progress bars
function ProgressBarList({ title, data, color }: { title: string; data: { name: string; value: number }[]; color: string }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm flex flex-col h-full">
      <h2 className="text-sm font-bold text-slate-900 mb-5">{title}</h2>
      <div className="space-y-4 flex-1">
        {data.map((item, i) => {
          const pct = Math.round((item.value / total) * 100);
          return (
            <div key={item.name}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-700">{item.name}</span>
                <span className="font-bold text-slate-900">{pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${pct}%`, backgroundColor: i === 0 ? color : i === 1 ? `${color}dd` : i === 2 ? `${color}99` : `${color}66` }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Component for simple Pie Chart blocks
function MiniPieBlock({ title, data }: { title: string; data: { name: string; value: number }[] }) {
  return (
    <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
      <h2 className="text-sm font-bold text-slate-900 mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={42} outerRadius={75} paddingAngle={2} stroke="none">
            {data.map((_, i) => <Cell key={i} fill={donutColors[i % donutColors.length]} />)}
          </Pie>
          <Tooltip formatter={((v: number) => [`${v}%`, "Share"]) as any} cursor={{fill: 'transparent'}} contentStyle={{ fontSize: 11, borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
          <Legend layout="horizontal" align="center" verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 500, paddingTop: 10 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}


export default function SalesHomePage() {
  const { filters } = useSalesFilters();

  const snap = getDailySnapshot(filters);
  const donuts = getHomeDonutData(filters);
  const alerts = getSalesAlerts(filters);
  const channelSummary = getChannelSummary(filters);
  const topProducts = getTopProducts(filters);
  const overviewTrend = getOverviewDailyTrend(filters);

  // Map channelSummary to the {name, value} format for ProgressBarList
  const channelMixData = channelSummary.map(c => ({ name: c.channel, value: c.pct }));

  return (
    <div className="space-y-6 pb-12">
      {/* ─── Premium Header & Explore Navigation ────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">Sales Command</h1>
          <p className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span className="text-slate-800">{filters.org}</span>
            {filters.brand !== "All Brands" && <><ChevronRight size={14} className="text-slate-300" /> <span className="text-slate-700">{filters.brand}</span></>}
            {filters.location !== "All Locations" && <><ChevronRight size={14} className="text-slate-300" /> <span className="text-slate-700">{filters.location}</span></>}
            <span className="ml-2 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700">{dateRangeLabel(filters.dateRange)}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {quickLinks.map((ql) => {
            const Icon = ql.icon;
            return (
              <Link key={ql.href} href={ql.href} className={`group flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 shadow-sm transition-all ${ql.hover}`}>
                <div className={`flex h-6 w-6 items-center justify-center rounded-lg ${ql.bg}`}>
                  <Icon size={13} className={ql.color} />
                </div>
                <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900">{ql.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ─── Section 1: Period Performance KPIs ─────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Sales */}
        <div className="relative overflow-hidden rounded-3xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50/80 to-indigo-100/30 backdrop-blur-xl p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="absolute -right-4 -top-4 opacity-5">
            <BarChart3 size={100} className="text-indigo-900" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-500 mb-1">Period Performance</p>
          <p className="text-3xl font-extrabold text-indigo-950">${snap.netSales.value.toLocaleString()}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${snap.netSales.vsDailyGoal >= 0 ? "bg-indigo-200/50 text-indigo-700" : "bg-rose-100/80 text-rose-700"}`}>
              {snap.netSales.vsDailyGoal >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(snap.netSales.vsDailyGoal)}%
            </span>
            <span className="text-xs font-medium text-indigo-600/80">vs target</span>
          </div>
        </div>

        {/* Orders */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/80 to-emerald-100/30 backdrop-blur-xl p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="absolute -right-4 -top-4 opacity-5">
            <Package size={100} className="text-emerald-900" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-1">Total Orders</p>
          <p className="text-3xl font-extrabold text-emerald-950">{snap.orders.value.toLocaleString()}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${snap.orders.vsLastWeek >= 0 ? "bg-emerald-200/50 text-emerald-800" : "bg-rose-100/80 text-rose-700"}`}>
              {snap.orders.vsLastWeek >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(snap.orders.vsLastWeek)}%
            </span>
            <span className="text-xs font-medium text-emerald-700/80">vs last period</span>
          </div>
        </div>

        {/* AOV */}
        <div className="relative overflow-hidden rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-amber-100/30 backdrop-blur-xl p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="absolute -right-4 -top-4 opacity-5">
            <Users size={100} className="text-amber-900" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600 mb-1">Avg Order Value</p>
          <p className="text-3xl font-extrabold text-amber-950">${snap.aov.value.toFixed(2)}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${snap.aov.vsLastWeek >= 0 ? "bg-amber-200/50 text-amber-800" : "bg-rose-100/80 text-rose-700"}`}>
              {snap.aov.vsLastWeek >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(snap.aov.vsLastWeek).toFixed(1)}%
            </span>
            <span className="text-xs font-medium text-amber-700/80">vs last period</span>
          </div>
        </div>

        {/* Revenue Leakage */}
        <div className="relative overflow-hidden rounded-3xl border border-rose-200/60 bg-gradient-to-br from-rose-50/80 to-rose-100/30 backdrop-blur-xl p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="absolute -right-4 -top-4 opacity-5">
            <AlertTriangle size={100} className="text-rose-900" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-rose-500 mb-1">Revenue Leakage</p>
          <p className="text-3xl font-extrabold text-rose-600">${snap.revenueLeakage.total.toLocaleString()}</p>
          <div className="mt-3 space-y-1">
            {[
              { label: "Discounts", val: snap.revenueLeakage.discounts },
              { label: "Refunds", val: snap.revenueLeakage.refunds },
              { label: "Voids", val: snap.revenueLeakage.voids },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between text-[11px]">
                <span className="text-rose-600/80 font-medium">{r.label}</span>
                <span className="font-bold text-rose-700">-${r.val.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* ─── Main Column (Charts & Tables) ─────────────────────────────────── */}
        <div className="flex-1 space-y-6 min-w-0">
          
          {/* Sales Trend Line */}
          <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 mb-0.5">Sales Trend — {dateRangeLabel(filters.dateRange)}</h2>
                <p className="text-xs text-slate-500">Revenue velocity breakdown by channel</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={overviewTrend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  {[
                    { id: "gDineIn", color: "#6366f1" },
                    { id: "gDelivery", color: "#10b981" },
                    { id: "gPickup", color: "#f59e0b" },
                  ].map((g) => (
                    <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={g.color} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={g.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${Math.round(v / 1000)}K`} dx={-10} />
                <Tooltip cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ fontSize: 11, borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }} formatter={((v: number) => [`$${v.toLocaleString()}`]) as any} />
                <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600, paddingTop: 20 }} iconType="circle" />
                <Area type="monotone" dataKey="dineIn" name="Dine-In" stroke="#6366f1" strokeWidth={3} fill="url(#gDineIn)" activeDot={{ r: 6, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="delivery" name="Delivery" stroke="#10b981" strokeWidth={3} fill="url(#gDelivery)" activeDot={{ r: 6, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="pickup" name="Pickup" stroke="#f59e0b" strokeWidth={3} fill="url(#gPickup)" activeDot={{ r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-full">
               <MiniPieBlock title="Store Performance" data={overviewStoreDonut} />
            </div>
            <div className="h-full">
               <MiniPieBlock title="Drinks Category Mix" data={donuts.drinks} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-full">
              <ProgressBarList title="Food Category Mix" data={donuts.food} color="#10b981" />
            </div>
            <div className="h-full">
              <ProgressBarList title="Channel Category Mix" data={channelMixData} color="#6366f1" />
            </div>
          </div>

          {/* Top Products */}
          <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl shadow-sm flex flex-col">
            <div className="border-b border-slate-100/50 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-slate-900 mb-0.5">Top Products</h2>
                <p className="text-xs text-slate-500">By sales volume</p>
              </div>
              <Link href="/sales/items" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors">
                <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="flex-1 p-2">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100/50 text-sm">
                  <thead className="bg-transparent">
                    <tr>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">#</th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Item</th>
                      <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">Units</th>
                      <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Sales</th>
                      <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/50">
                    {topProducts.slice(0, 5).map((p, i) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-5 py-3.5 w-10">
                          <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-slate-200 text-slate-700" : i === 2 ? "bg-orange-100 text-orange-800" : "bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600"}`}>{i + 1}</span>
                        </td>
                        <td className="px-5 py-3.5 font-bold text-slate-800 group-hover:text-indigo-900 transition-colors">{p.item}</td>
                        <td className="px-5 py-3.5 text-right font-medium text-slate-500">{p.units.toLocaleString()}</td>
                        <td className="px-5 py-3.5 text-right font-extrabold text-slate-900">${p.sales.toLocaleString()}</td>
                        <td className="px-5 py-3.5 text-right">
                          <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${p.trendPct >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                            {p.trendPct >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {p.trendPct >= 0 ? "+" : ""}{p.trendPct}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* ─── Sidebar Column (Insights) ─────────────────────────────────────── */}
        <div className="w-full xl:w-[340px] flex-shrink-0 space-y-6">
          <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl shadow-sm overflow-hidden sticky top-6">
            <div className="border-b border-slate-100/50 px-6 py-5 flex justify-between items-center bg-white/80">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-sm font-bold text-slate-900">Live Insights</h2>
              </div>
            </div>
            <div className="divide-y divide-slate-100/50 max-h-[800px] overflow-y-auto">
              {alerts.map((alert) => {
                const Icon = alertIcon[alert.severity];
                return (
                  <div key={alert.id} className="p-5 hover:bg-slate-50/50 transition-colors group cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl shadow-sm ${alertColor[alert.severity]} ring-0 border border-white/20`}>
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`rounded-full px-2 py-0.5 text-[9px] uppercase tracking-widest font-extrabold border ${alertBadge[alert.severity]}`}>
                            {alert.severity}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">12m ago</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 leading-tight mb-1 group-hover:text-indigo-700 transition-colors">{alert.title}</p>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed">{alert.detail}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-4 bg-slate-50/50 border-t border-slate-100/50">
              <button className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 shadow-sm hover:border-slate-300 hover:text-slate-900 transition-all flex items-center justify-center gap-1.5">
                View All Events <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
