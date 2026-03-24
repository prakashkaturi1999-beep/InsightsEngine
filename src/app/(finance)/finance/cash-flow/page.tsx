"use client";

import { useFinanceFilters, dateRangeLabel } from "@/lib/financeFilterContext";
import { getCashFlowMetrics, getCashFlowActivity, getCapexPipeline, getFinanceTrend } from "@/lib/financeDataEngine";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Legend,
} from "recharts";
import { Wallet, TrendingUp, ShieldCheck, Clock, ArrowDownUp, Banknote } from "lucide-react";

const capexColors = ["#6366f1", "#8b5cf6", "#0ea5e9", "#f59e0b", "#94a3b8"];

function fmtM(v: number) { return "$" + (v / 1_000_000).toFixed(1) + "M"; }
function fmtDollar(v: number) { return "$" + v.toLocaleString(); }
function fmtAxisM(v: number) { return "$" + (v / 1_000_000).toFixed(1) + "M"; }

export default function CashFlowPage() {
  const { filters } = useFinanceFilters();
  const cf = getCashFlowMetrics(filters);
  const activity = getCashFlowActivity(filters);
  const capex = getCapexPipeline(filters);
  const trend = getFinanceTrend(filters);

  const balanceTrend = activity.filter(a => a.balance > 0).map(a => ({
    day: a.date + " " + a.category.substring(0, 8),
    balance: a.balance,
    reserve: cf.operatingReserve,
  }));

  // CF Waterfall
  const cfWaterfall = [
    { name: "Operating CF", value: cf.operatingCashFlow, type: "positive" },
    { name: "CapEx",        value: -cf.capex, type: "negative" },
    { name: "Debt Service", value: -cf.debtService, type: "negative" },
    { name: "Free CF",      value: cf.freeCashFlow, type: "total" },
  ];

  const kpiCards = [
    { label: "Operating Cash Flow", val: fmtM(cf.operatingCashFlow), icon: TrendingUp, color: "text-emerald-900", bg: "bg-gradient-to-br from-emerald-50/80 to-emerald-100/30", border: "border-emerald-200/60" },
    { label: "Free Cash Flow", val: fmtM(cf.freeCashFlow), icon: Wallet, color: "text-indigo-900", bg: "bg-gradient-to-br from-indigo-50/80 to-indigo-100/30", border: "border-indigo-200/60" },
    { label: "Cash Conversion Cycle", val: cf.cashConversionCycleDays + " days", icon: Clock, color: "text-amber-900", bg: "bg-gradient-to-br from-amber-50/80 to-amber-100/30", border: "border-amber-200/60" },
    { label: "DSCR", val: cf.dscr + "x", icon: ShieldCheck, color: "text-teal-900", bg: "bg-gradient-to-br from-teal-50/80 to-teal-100/30", border: "border-teal-200/60" },
    { label: "Working Capital Days", val: cf.workingCapitalDays + " days", icon: ArrowDownUp, color: "text-blue-900", bg: "bg-gradient-to-br from-blue-50/80 to-blue-100/30", border: "border-blue-200/60" },
    { label: "CapEx (Period)", val: fmtM(cf.capex), icon: Banknote, color: "text-violet-900", bg: "bg-gradient-to-br from-violet-50/80 to-violet-100/30", border: "border-violet-200/60" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Cash Flow & Treasury</h1>
        <p className="text-sm text-slate-500">Liquidity management, Free Cash Flow, reserve monitoring, and CapEx pipeline for {dateRangeLabel(filters.dateRange)}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpiCards.map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className={"relative overflow-hidden rounded-3xl border p-5 shadow-sm hover:shadow-md transition-shadow " + kpi.bg + " " + kpi.border}>
              <div className="absolute -right-3 -top-3 opacity-5"><Icon size={70} className={kpi.color} /></div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">{kpi.label}</p>
              <p className={"text-xl font-extrabold " + kpi.color}>{kpi.val}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Waterfall */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-0.5">Cash Flow Waterfall</h2>
          <p className="text-xs text-slate-500 mb-4">Operating CF minus CapEx and debt service = Free CF</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={cfWaterfall} margin={{ top: 10, right: 10, left: 10, bottom: 0 }} barSize={50}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tickFormatter={fmtAxisM} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12, fontWeight: 600 }} formatter={((v: number) => [fmtDollar(v)]) as any} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {cfWaterfall.map((item, i) => (
                  <Cell key={"cf" + i} fill={item.type === "negative" ? "#ef4444" : item.type === "total" ? "#0ea5e9" : "#10b981"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cash Balance Trend with Reserve Line */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-0.5">Cash Balance Trajectory</h2>
          <p className="text-xs text-slate-500 mb-4">Daily balance vs 10-day operating reserve floor</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={balanceTrend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="gBal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tickFormatter={fmtAxisM} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }} formatter={((v: number) => [fmtDollar(v)]) as any} />
              <Legend wrapperStyle={{ fontSize: 11, fontWeight: 600, paddingTop: 15 }} iconType="circle" />
              <Area type="monotone" dataKey="balance" name="Cash Balance" stroke="#6366f1" strokeWidth={3} fill="url(#gBal)" activeDot={{ r: 5, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="reserve" name="Reserve Floor" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" fill="none" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CapEx Pipeline */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-3">CapEx Allocation</h2>
          <div className="space-y-3">
            {capex.map((item, i) => (
              <div key={item.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">{item.name}</span>
                  <span className="font-bold text-slate-900">{fmtDollar(item.value)} <span className="text-slate-400 font-normal">({item.pct}%)</span></span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: item.pct + "%", backgroundColor: capexColors[i] }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cash Activity Ledger */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl shadow-sm flex flex-col">
          <div className="border-b border-slate-100/50 p-5">
            <h2 className="text-sm font-bold text-slate-900 mb-0.5">Weekly Cash Obligation Calendar</h2>
            <p className="text-xs text-slate-500">Inflows, outflows, and running balance</p>
          </div>
          <div className="flex-1 p-2 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100/50 text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Day</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Category</th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400 text-emerald-500">Inflow</th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400 text-rose-500">Outflow</th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50/50">
                {activity.map((a, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-600 text-xs">{a.date}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{a.category}</td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-600">{a.inflow ? fmtDollar(a.inflow) : "-"}</td>
                    <td className="px-4 py-3 text-right font-bold text-rose-600">{a.outflow ? "-" + fmtDollar(a.outflow) : "-"}</td>
                    <td className="px-4 py-3 text-right font-extrabold text-slate-900">{fmtM(a.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
