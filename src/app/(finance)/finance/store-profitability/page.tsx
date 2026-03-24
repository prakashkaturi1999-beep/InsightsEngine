"use client";

import { useFinanceFilters, dateRangeLabel } from "@/lib/financeFilterContext";
import { getFinanceKpis, getStorePnL } from "@/lib/financeDataEngine";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
  ScatterChart, Scatter, ZAxis,
} from "recharts";
import { Building2, Award, TrendingUp, AlertTriangle } from "lucide-react";

const rankColors = ["#6366f1", "#8b5cf6", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6"];

function fmtK(v: number) { return "$" + (v / 1000).toFixed(0) + "K"; }
function fmtDollar(v: number) { return "$" + v.toLocaleString(); }
function fmtAxisK(v: number) { return "$" + (v / 1000).toFixed(0) + "K"; }

export default function StoreProfitabilityPage() {
  const { filters } = useFinanceFilters();
  const kpis = getFinanceKpis(filters);
  const stores = getStorePnL(filters);

  const byEbitda = [...stores].sort((a, b) => b.ebitda4Wall - a.ebitda4Wall);
  const compStores = stores.filter(s => s.compStore);
  const newStores = stores.filter(s => !s.compStore);
  const aboveThreshold = stores.filter(s => s.margin4Wall >= 25).length;
  const watchList = [...stores].filter(s => s.margin4Wall < 27).sort((a, b) => a.margin4Wall - b.margin4Wall);
  const avgMargin = stores.length > 0 ? Math.round(stores.reduce((s, st) => s + st.margin4Wall, 0) / stores.length * 10) / 10 : 0;

  const compAvg4Wall = compStores.length > 0 ? Math.round(compStores.reduce((s, st) => s + st.margin4Wall, 0) / compStores.length * 10) / 10 : 0;
  const newAvg4Wall = newStores.length > 0 ? Math.round(newStores.reduce((s, st) => s + st.margin4Wall, 0) / newStores.length * 10) / 10 : 0;

  const scatterData = stores.map(s => ({
    x: s.auvWeekly,
    y: s.margin4Wall,
    z: s.txnCount,
    name: s.name,
    comp: s.compStore,
  }));

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Unit Economics & Store Profitability</h1>
        <p className="text-sm text-slate-500">4-Wall EBITDA, AUV ranking, and unit-level KPIs for {dateRangeLabel(filters.dateRange)}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative overflow-hidden rounded-3xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50/80 to-indigo-100/30 p-5 shadow-sm">
          <div className="absolute -right-3 -top-3 opacity-5"><Building2 size={70} className="text-indigo-900" /></div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 mb-1">Avg Weekly AUV</p>
          <p className="text-2xl font-extrabold text-indigo-950">{fmtK(kpis.auvWeekly)}</p>
          <p className="text-[10px] font-medium text-indigo-600/80 mt-1">{"$" + ((kpis.auvWeekly * 52) / 1000).toFixed(0) + "K annualized"}</p>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/80 to-emerald-100/30 p-5 shadow-sm">
          <div className="absolute -right-3 -top-3 opacity-5"><Award size={70} className="text-emerald-900" /></div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-1">Avg 4-Wall Margin</p>
          <p className="text-2xl font-extrabold text-emerald-950">{avgMargin}%</p>
          <p className="text-[10px] font-medium text-emerald-600/80 mt-1">Comp: {compAvg4Wall}% / New: {newAvg4Wall}%</p>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-amber-100/30 p-5 shadow-sm">
          <div className="absolute -right-3 -top-3 opacity-5"><TrendingUp size={70} className="text-amber-900" /></div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500 mb-1">Units ≥ 25% Margin</p>
          <p className="text-2xl font-extrabold text-amber-950">{aboveThreshold} <span className="text-base text-amber-600/60">/ {stores.length}</span></p>
          <p className="text-[10px] font-medium text-amber-600/80 mt-1">{Math.round((aboveThreshold / stores.length) * 100)}% above threshold</p>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-rose-200/60 bg-gradient-to-br from-rose-50/80 to-rose-100/30 p-5 shadow-sm">
          <div className="absolute -right-3 -top-3 opacity-5"><AlertTriangle size={70} className="text-rose-900" /></div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500 mb-1">Watch List Units</p>
          <p className="text-2xl font-extrabold text-rose-900">{watchList.length}</p>
          <p className="text-[10px] font-medium text-rose-600/80 mt-1">Below 27% 4-Wall margin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 4-Wall EBITDA Bar Chart */}
        <div className="lg:col-span-3 rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-4">4-Wall EBITDA by Store</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byEbitda} margin={{ top: 10, right: 10, left: 10, bottom: 0 }} barSize={35}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} tickFormatter={(v: string) => v.length > 12 ? v.substring(0, 12) + "..." : v} />
              <YAxis tickFormatter={fmtAxisK} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12, fontWeight: 600 }} formatter={((v: number) => [fmtDollar(v), "4-Wall EBITDA"]) as any} />
              <Bar dataKey="ebitda4Wall" name="4-Wall EBITDA" radius={[4, 4, 0, 0]}>
                {byEbitda.map((_, i) => <Cell key={"eb" + i} fill={rankColors[i % rankColors.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Comp vs Non-Comp Summary */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Comp vs New Store Averages</h2>
          <div className="space-y-4">
            {[
              { label: "4-Wall Margin", comp: compAvg4Wall + "%", newV: newAvg4Wall + "%" },
              { label: "Avg AUV", comp: fmtK(compStores.length > 0 ? Math.round(compStores.reduce((s, st) => s + st.auvWeekly, 0) / compStores.length) : 0), newV: fmtK(newStores.length > 0 ? Math.round(newStores.reduce((s, st) => s + st.auvWeekly, 0) / newStores.length) : 0) },
              { label: "Avg Prime Cost", comp: (compStores.length > 0 ? (compStores.reduce((s, st) => s + st.primeCost, 0) / compStores.length).toFixed(1) : 0) + "%", newV: (newStores.length > 0 ? (newStores.reduce((s, st) => s + st.primeCost, 0) / newStores.length).toFixed(1) : 0) + "%" },
              { label: "Avg RPLH", comp: "$" + (compStores.length > 0 ? (compStores.reduce((s, st) => s + st.rplh, 0) / compStores.length).toFixed(0) : 0), newV: "$" + (newStores.length > 0 ? (newStores.reduce((s, st) => s + st.rplh, 0) / newStores.length).toFixed(0) : 0) },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between py-2 border-b border-slate-100/50">
                <span className="text-xs font-semibold text-slate-500">{row.label}</span>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-xs font-bold text-indigo-700"><span className="h-2 w-2 rounded-full bg-indigo-500" />{row.comp}</span>
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" />{row.newV}</span>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 pt-1">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-indigo-500" /> Comp ({compStores.length})</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> New ({newStores.length})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Unit Economics Scorecard */}
      <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl shadow-sm flex flex-col">
        <div className="border-b border-slate-100/50 p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-0.5">Unit Economics Scorecard</h2>
          <p className="text-xs text-slate-500">Complete store-level P&L and operational KPIs</p>
        </div>
        <div className="flex-1 p-2 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100/50 text-sm">
            <thead>
              <tr>
                <th className="px-3 py-3 text-left text-[9px] font-semibold uppercase tracking-wider text-slate-400">#</th>
                <th className="px-3 py-3 text-left text-[9px] font-semibold uppercase tracking-wider text-slate-400">Store</th>
                <th className="px-3 py-3 text-right text-[9px] font-semibold uppercase tracking-wider text-slate-400">AUV</th>
                <th className="px-3 py-3 text-right text-[9px] font-semibold uppercase tracking-wider text-slate-400">Revenue</th>
                <th className="px-3 py-3 text-right text-[9px] font-semibold uppercase tracking-wider text-slate-400">COGS</th>
                <th className="px-3 py-3 text-right text-[9px] font-semibold uppercase tracking-wider text-slate-400">Labor</th>
                <th className="px-3 py-3 text-right text-[9px] font-semibold uppercase tracking-wider text-slate-400 text-indigo-500 bg-indigo-50/30 rounded-t-lg">4-Wall EBITDA</th>
                <th className="px-3 py-3 text-right text-[9px] font-semibold uppercase tracking-wider text-slate-400">Margin</th>
                <th className="px-3 py-3 text-right text-[9px] font-semibold uppercase tracking-wider text-slate-400">Prime</th>
                <th className="px-3 py-3 text-right text-[9px] font-semibold uppercase tracking-wider text-slate-400">RPLH</th>
                <th className="px-3 py-3 text-right text-[9px] font-semibold uppercase tracking-wider text-slate-400">Txns</th>
                <th className="px-3 py-3 text-center text-[9px] font-semibold uppercase tracking-wider text-slate-400">Status</th>
                <th className="px-3 py-3 text-right text-[9px] font-semibold uppercase tracking-wider text-slate-400">Vintage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/50">
              {byEbitda.map((s, i) => {
                const isWatch = s.margin4Wall < 27;
                return (
                  <tr key={s.name} className={"hover:bg-slate-50/50 transition-colors " + (isWatch ? "bg-rose-50/20" : "")}>
                    <td className="px-3 py-3 w-8"><span className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold bg-slate-100 text-slate-500">{i + 1}</span></td>
                    <td className="px-3 py-3 font-bold text-slate-800 whitespace-nowrap">{s.name}</td>
                    <td className="px-3 py-3 text-right font-semibold text-slate-600 text-xs">{fmtK(s.auvWeekly)}</td>
                    <td className="px-3 py-3 text-right font-semibold text-slate-600 text-xs">{fmtDollar(s.revenue)}</td>
                    <td className="px-3 py-3 text-right font-medium text-slate-500 text-xs">{fmtDollar(s.cogs)}</td>
                    <td className="px-3 py-3 text-right font-medium text-slate-500 text-xs">{fmtDollar(s.labor)}</td>
                    <td className="px-3 py-3 text-right font-extrabold text-indigo-900 bg-indigo-50/30 text-xs">{fmtDollar(s.ebitda4Wall)}</td>
                    <td className="px-3 py-3 text-right"><span className={"font-bold text-xs px-1.5 py-0.5 rounded-full " + (s.margin4Wall >= 28 ? "bg-emerald-50 text-emerald-700" : s.margin4Wall >= 25 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700")}>{s.margin4Wall}%</span></td>
                    <td className={"px-3 py-3 text-right font-bold text-xs " + (s.primeCost > 60 ? "text-rose-600" : "text-slate-600")}>{s.primeCost}%</td>
                    <td className="px-3 py-3 text-right font-bold text-xs text-slate-600">{"$" + s.rplh.toFixed(0)}</td>
                    <td className="px-3 py-3 text-right font-medium text-xs text-slate-500">{s.txnCount.toLocaleString()}</td>
                    <td className="px-3 py-3 text-center">{s.compStore ? <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">COMP</span> : <span className="bg-amber-50 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-200">NEW</span>}</td>
                    <td className="px-3 py-3 text-right font-semibold text-xs text-slate-500">{s.vintage}</td>
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
