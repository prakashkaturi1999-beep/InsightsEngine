"use client";

import { useFinanceFilters, dateRangeLabel } from "@/lib/financeFilterContext";
import { getFinanceKpis, getFinanceTrend, getBudgetVsActual } from "@/lib/financeDataEngine";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
  AreaChart, Area,
} from "recharts";
import { DollarSign, TrendingUp, Percent, Building2, ArrowUpRight } from "lucide-react";

const waterfallColors: Record<string, string> = {
  revenue: "#6366f1", cogs: "#ef4444", grossProfit: "#10b981",
  labor: "#f97316", occupancy: "#f59e0b", otherOpex: "#eab308",
  ga: "#8b5cf6", ebitda: "#0ea5e9", netIncome: "#06b6d4",
};

function fmtM(v: number) { return "$" + (v / 1_000_000).toFixed(1) + "M"; }
function fmtDollar(v: number) { return "$" + v.toLocaleString(); }
function fmtAxisM(v: number) { return "$" + (v / 1_000_000).toFixed(1) + "M"; }

export default function PLOverviewPage() {
  const { filters } = useFinanceFilters();
  const kpis = getFinanceKpis(filters);
  const trend = getFinanceTrend(filters);
  const budget = getBudgetVsActual(filters);

  // Build EBITDA Bridge Waterfall
  const waterfall = [
    { name: "Net Revenue",   value: kpis.netRevenue, type: "total" },
    { name: "COGS",          value: -kpis.cogs, type: "negative" },
    { name: "Gross Profit",  value: kpis.netRevenue - kpis.cogs, type: "subtotal" },
    { name: "Labor",         value: -kpis.totalLabor, type: "negative" },
    { name: "Occupancy",     value: -kpis.occupancy, type: "negative" },
    { name: "Other OpEx",    value: -(kpis.otherControllable + kpis.nonControllable), type: "negative" },
    { name: "Rest. EBITDA",  value: kpis.restaurantEbitda, type: "subtotal" },
    { name: "G&A",           value: -kpis.gaExpenses, type: "negative" },
    { name: "Corp. EBITDA",  value: kpis.corporateEbitda, type: "total" },
  ];

  // Compute invisible base for waterfall stacking
  let runningBase = 0;
  const waterfallData = waterfall.map(item => {
    let base = 0;
    if (item.type === "total" || item.type === "subtotal") {
      base = 0;
      runningBase = item.value;
    } else {
      runningBase += item.value;
      base = runningBase;
    }
    return { name: item.name, base, value: Math.abs(item.value), type: item.type, rawValue: item.value };
  });

  // P&L summary rows
  const pnlRows = [
    { item: "Net Revenue",           amount: kpis.netRevenue,           pctRev: 100,                                                 color: "text-slate-900" },
    { item: "COGS",                  amount: -kpis.cogs,                pctRev: -((kpis.cogs / kpis.netRevenue) * 100),               color: "text-rose-600" },
    { item: "Gross Profit",          amount: kpis.netRevenue - kpis.cogs, pctRev: ((kpis.netRevenue - kpis.cogs) / kpis.netRevenue) * 100, color: "text-emerald-700" },
    { item: "Total Labor",           amount: -kpis.totalLabor,          pctRev: -((kpis.totalLabor / kpis.netRevenue) * 100),         color: "text-orange-600" },
    { item: "Occupancy",             amount: -kpis.occupancy,           pctRev: -((kpis.occupancy / kpis.netRevenue) * 100),          color: "text-amber-600" },
    { item: "Other OpEx",            amount: -(kpis.otherControllable + kpis.nonControllable), pctRev: -(((kpis.otherControllable + kpis.nonControllable) / kpis.netRevenue) * 100), color: "text-amber-700" },
    { item: "Restaurant EBITDA",     amount: kpis.restaurantEbitda,     pctRev: kpis.restaurantEbitdaMargin,                         color: "text-teal-700", bold: true },
    { item: "G&A Expenses",          amount: -kpis.gaExpenses,          pctRev: -((kpis.gaExpenses / kpis.netRevenue) * 100),         color: "text-violet-600" },
    { item: "Corporate EBITDA",      amount: kpis.corporateEbitda,      pctRev: kpis.corporateEbitdaMargin,                          color: "text-blue-700", bold: true },
    { item: "Net Income",            amount: kpis.netIncome,            pctRev: kpis.netIncomeMargin,                                color: "text-indigo-900", bold: true },
  ];

  const marginCards = [
    { label: "Gross Margin",           value: (((kpis.netRevenue - kpis.cogs) / kpis.netRevenue) * 100).toFixed(1) + "%", delta: "+1.2%", positive: true, icon: Percent, color: "text-indigo-900", bg: "bg-gradient-to-br from-indigo-50/80 to-indigo-100/30", border: "border-indigo-200/60" },
    { label: "Food Cost %",            value: kpis.foodCostPct.toFixed(1) + "%",         delta: "-0.5%", positive: true, icon: TrendingUp, color: "text-emerald-900", bg: "bg-gradient-to-br from-emerald-50/80 to-emerald-100/30", border: "border-emerald-200/60" },
    { label: "Labor %",                value: kpis.laborPct.toFixed(1) + "%",            delta: "-0.3%", positive: true, icon: Percent, color: "text-amber-900", bg: "bg-gradient-to-br from-amber-50/80 to-amber-100/30", border: "border-amber-200/60" },
    { label: "Restaurant EBITDA %",    value: kpis.restaurantEbitdaMargin.toFixed(1) + "%", delta: "+0.4%", positive: true, icon: Building2, color: "text-teal-900", bg: "bg-gradient-to-br from-teal-50/80 to-teal-100/30", border: "border-teal-200/60" },
    { label: "Corporate EBITDA %",     value: kpis.corporateEbitdaMargin.toFixed(1) + "%", delta: "+0.2%", positive: true, icon: DollarSign, color: "text-blue-900", bg: "bg-gradient-to-br from-blue-50/80 to-blue-100/30", border: "border-blue-200/60" },
    { label: "Net Income Margin",      value: kpis.netIncomeMargin.toFixed(1) + "%",     delta: "+0.1%", positive: true, icon: TrendingUp, color: "text-violet-900", bg: "bg-gradient-to-br from-violet-50/80 to-violet-100/30", border: "border-violet-200/60" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">P&L Performance Overview</h1>
        <p className="text-sm text-slate-500">EBITDA bridge, margin architecture, and period-over-period analysis for {dateRangeLabel(filters.dateRange)}</p>
      </div>

      {/* Top-line KPI strip */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {marginCards.map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className={"relative overflow-hidden rounded-3xl border p-4 shadow-sm hover:shadow-md transition-shadow " + m.bg + " " + m.border}>
              <div className="absolute -right-3 -top-3 opacity-5"><Icon size={60} className={m.color} /></div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{m.label}</p>
              <p className={"text-xl font-extrabold " + m.color}>{m.value}</p>
              <span className={"flex items-center gap-0.5 text-[10px] font-bold mt-1.5 " + (m.positive ? "text-emerald-600" : "text-rose-600")}>
                {m.positive ? <TrendingUp size={10} /> : <ArrowUpRight size={10} />} {m.delta}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* EBITDA Bridge Waterfall */}
        <div className="xl:col-span-3 rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1">EBITDA Bridge</h2>
          <p className="text-xs text-slate-500 mb-4">Revenue cascading to Corporate EBITDA</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tickFormatter={fmtAxisM} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12, fontWeight: 600 }} formatter={((v: number, n: string, props: any) => [fmtDollar(props.payload.rawValue), props.payload.name]) as any} />
              <Bar dataKey="base" stackId="stack" fill="transparent" radius={0} />
              <Bar dataKey="value" stackId="stack" radius={[4, 4, 0, 0]}>
                {waterfallData.map((entry, i) => {
                  let color = "#6366f1";
                  if (entry.type === "negative") color = "#ef4444";
                  else if (entry.type === "subtotal") color = "#10b981";
                  else if (entry.name === "Corp. EBITDA") color = "#0ea5e9";
                  return <Cell key={"wf" + i} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* P&L Statement Table */}
        <div className="xl:col-span-2 rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl shadow-sm flex flex-col">
          <div className="border-b border-slate-100/50 p-5">
            <h2 className="text-sm font-bold text-slate-900 mb-0.5">P&L Statement</h2>
            <p className="text-xs text-slate-500">Income Statement Summary</p>
          </div>
          <div className="flex-1 p-2 overflow-hidden">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100/50">
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Line Item</th>
                  <th className="px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">Amount</th>
                  <th className="px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">% Rev</th>
                </tr>
              </thead>
              <tbody>
                {pnlRows.map(row => (
                  <tr key={row.item} className={"border-b border-slate-50/50 " + (row.bold ? "bg-slate-50/50" : "")}>
                    <td className={"px-4 py-2.5 " + (row.bold ? "font-extrabold text-slate-900" : "font-medium text-slate-700")}>{row.item}</td>
                    <td className={"px-4 py-2.5 text-right font-bold " + row.color}>{row.amount >= 0 ? fmtM(row.amount) : "-" + fmtM(Math.abs(row.amount))}</td>
                    <td className="px-4 py-2.5 text-right text-xs font-medium text-slate-400">{row.pctRev >= 0 ? row.pctRev.toFixed(1) : row.pctRev.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* P&L Velocity Trend */}
      <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 mb-0.5">Revenue & EBITDA Velocity</h2>
        <p className="text-xs text-slate-500 mb-4">Period-over-period output with margin trend overlay</p>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={trend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} /></linearGradient>
              <linearGradient id="gEbit" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.15} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={fmtAxisM} dx={-10} />
            <Tooltip cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ fontSize: 11, borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }} formatter={((v: number) => [fmtDollar(v)]) as any} />
            <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600, paddingTop: 20 }} iconType="circle" />
            <Area type="monotone" dataKey="revenue" name="Net Revenue" stroke="#6366f1" strokeWidth={3} fill="url(#gRev)" />
            <Area type="monotone" dataKey="ebitda" name="Corp EBITDA" stroke="#10b981" strokeWidth={3} fill="url(#gEbit)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Budget Variance Table */}
      <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl shadow-sm flex flex-col">
        <div className="border-b border-slate-100/50 p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-0.5">Budget vs Actual Snapshot</h2>
          <p className="text-xs text-slate-500">Quick variance check</p>
        </div>
        <div className="flex-1 p-2 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100/50 text-sm">
            <thead>
              <tr>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Line Item</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">Budget</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">Actual</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/50">
              {budget.map(b => {
                const variance = b.actual - b.budget;
                const isRevLike = b.item.includes("Revenue") || b.item.includes("EBITDA");
                const favorable = isRevLike ? variance >= 0 : variance <= 0;
                return (
                  <tr key={b.item} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3 font-bold text-slate-800">{b.item}</td>
                    <td className="px-5 py-3 text-right font-medium text-slate-500">{fmtM(b.budget)}</td>
                    <td className="px-5 py-3 text-right font-extrabold text-slate-900">{fmtM(b.actual)}</td>
                    <td className={"px-5 py-3 text-right font-bold " + (favorable ? "text-emerald-600" : "text-rose-600")}>
                      {variance >= 0 ? "+" : "-"}{fmtM(Math.abs(variance))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
