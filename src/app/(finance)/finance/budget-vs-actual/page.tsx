"use client";

import { useFinanceFilters, dateRangeLabel } from "@/lib/financeFilterContext";
import { getBudgetVsActual, getFinanceKpis } from "@/lib/financeDataEngine";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Target, AlertCircle } from "lucide-react";

function fmtM(v: number) { return "$" + (v / 1_000_000).toFixed(1) + "M"; }
function fmtDollar(v: number) { return "$" + v.toLocaleString(); }
function fmtAxisM(v: number) { return "$" + (v / 1_000_000).toFixed(1) + "M"; }

export default function BudgetVsActualPage() {
  const { filters } = useFinanceFilters();
  const budget = getBudgetVsActual(filters);
  const kpis = getFinanceKpis(filters);

  // Compute overall attainment
  const revRow = budget.find(b => b.item.includes("Revenue"));
  const ebitdaRow = budget.find(b => b.item.includes("Corporate EBITDA"));
  const revAttainment = revRow ? ((revRow.actual / revRow.budget) * 100).toFixed(1) : "N/A";
  const ebitdaAttainment = ebitdaRow ? ((ebitdaRow.actual / ebitdaRow.budget) * 100).toFixed(1) : "N/A";

  // Find largest favorable and unfavorable
  const withVariance = budget.map(b => {
    const variance = b.actual - b.budget;
    const isRevLike = b.item.includes("Revenue") || b.item.includes("EBITDA");
    const favorable = isRevLike ? variance >= 0 : variance <= 0;
    return { ...b, variance, favorable };
  });

  const favItems = withVariance.filter(b => b.favorable);
  const unfavItems = withVariance.filter(b => !b.favorable);
  const largestFav = favItems.sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance))[0];
  const largestUnfav = unfavItems.sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance))[0];

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Budget vs Actual Variance</h1>
        <p className="text-sm text-slate-500">Plan realization, flex budget comparison, and rolling forecast tracking for {dateRangeLabel(filters.dateRange)}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative overflow-hidden rounded-3xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50/80 to-indigo-100/30 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -top-4 opacity-5"><Target size={80} className="text-indigo-900" /></div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 mb-1">Revenue Attainment</p>
          <p className="text-2xl font-extrabold text-indigo-950">{revAttainment}%</p>
          <p className="text-[10px] font-medium text-indigo-600/80 mt-1">of budgeted revenue</p>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/80 to-emerald-100/30 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -top-4 opacity-5"><Target size={80} className="text-emerald-900" /></div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-1">EBITDA Attainment</p>
          <p className="text-2xl font-extrabold text-emerald-950">{ebitdaAttainment}%</p>
          <p className="text-[10px] font-medium text-emerald-600/80 mt-1">of budgeted EBITDA</p>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-teal-200/60 bg-gradient-to-br from-teal-50/80 to-teal-100/30 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -top-4 opacity-5"><TrendingUp size={80} className="text-teal-900" /></div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-teal-500 mb-1">Largest Favorable</p>
          <p className="text-lg font-extrabold text-teal-900">{largestFav?.item || "—"}</p>
          <p className="text-xs font-bold text-emerald-600 mt-1">{largestFav ? "+" + fmtM(Math.abs(largestFav.variance)) : "—"}</p>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-rose-200/60 bg-gradient-to-br from-rose-50/80 to-rose-100/30 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute -right-4 -top-4 opacity-5"><TrendingDown size={80} className="text-rose-900" /></div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500 mb-1">Largest Unfavorable</p>
          <p className="text-lg font-extrabold text-rose-900">{largestUnfav?.item || "—"}</p>
          <p className="text-xs font-bold text-rose-600 mt-1">{largestUnfav ? "-" + fmtM(Math.abs(largestUnfav.variance)) : "—"}</p>
        </div>
      </div>

      {/* 3-Series Chart: Budget vs Actual vs Rolling Forecast */}
      <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 mb-0.5">Budget vs Actual vs Rolling Forecast</h2>
        <p className="text-xs text-slate-500 mb-4">3-series comparison for every P&L line item</p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={budget} margin={{ top: 10, right: 10, left: 10, bottom: 0 }} barGap={4} barSize={22}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="item" tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} tickFormatter={(v: string) => v.length > 12 ? v.substring(0, 12) + "..." : v} />
            <YAxis tickFormatter={fmtAxisM} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12, fontWeight: 600 }} formatter={((v: number) => [fmtDollar(v)]) as any} />
            <Legend wrapperStyle={{ fontSize: 11, fontWeight: 600, paddingTop: 20 }} iconType="circle" />
            <Bar dataKey="budget" name="Budget" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" name="Actual" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="rollingForecast" name="Rolling Forecast" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Variance Ledger */}
      <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl shadow-sm flex flex-col">
        <div className="border-b border-slate-100/50 p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-0.5">Comprehensive Variance Analysis</h2>
          <p className="text-xs text-slate-500">Budget, Actual, Rolling Forecast, and Variance with directional indicators</p>
        </div>
        <div className="flex-1 p-2 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100/50 text-sm">
            <thead>
              <tr>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Line Item</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">Budget</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">Actual</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">Rolling FC</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">$ Variance</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">% Variance</th>
                <th className="px-5 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/50">
              {withVariance.map(b => {
                const varPct = ((b.variance / b.budget) * 100).toFixed(1);
                return (
                  <tr key={b.item} className={"hover:bg-slate-50/50 transition-colors " + (b.item.includes("EBITDA") || b.item.includes("Revenue") ? "bg-slate-50/30 font-extrabold" : "")}>
                    <td className={"px-5 py-3.5 text-slate-800 " + (b.item.includes("EBITDA") ? "font-extrabold" : "font-bold")}>{b.item}</td>
                    <td className="px-5 py-3.5 text-right font-medium text-slate-500">{fmtM(b.budget)}</td>
                    <td className="px-5 py-3.5 text-right font-extrabold text-slate-900">{fmtM(b.actual)}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-slate-500">{fmtM(b.rollingForecast)}</td>
                    <td className={"px-5 py-3.5 text-right font-bold " + (b.favorable ? "text-emerald-600" : "text-rose-600")}>
                      {b.variance >= 0 ? "+" : "-"}{fmtM(Math.abs(b.variance))}
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-slate-500">{b.variance >= 0 ? "+" : ""}{varPct}%</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={"inline-flex items-center gap-1 text-[9px] font-extrabold uppercase rounded-full px-2 py-0.5 border " + (b.favorable ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200")}>
                        {b.favorable ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {b.favorable ? "Favorable" : "Unfavorable"}
                      </span>
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
