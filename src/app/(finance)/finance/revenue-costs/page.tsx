"use client";

import { useFinanceFilters, dateRangeLabel } from "@/lib/financeFilterContext";
import { getFinanceKpis, getDaypartMix, getCogsBreakdown, getChannelMix, getTheoreticalVsActual, getFinanceTrend } from "@/lib/financeDataEngine";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
  PieChart, Pie,
  LineChart, Line,
} from "recharts";
import { Utensils, Percent, AlertTriangle, TrendingUp } from "lucide-react";

const daypartColors = ["#f59e0b", "#6366f1", "#0ea5e9", "#10b981", "#8b5cf6"];
const cogsColors = ["#ef4444", "#10b981", "#f59e0b", "#6366f1", "#0ea5e9", "#8b5cf6", "#ec4899"];

function fmtM(v: number) { return "$" + (v / 1_000_000).toFixed(1) + "M"; }
function fmtK(v: number) { return "$" + (v / 1000).toFixed(0) + "K"; }
function fmtDollar(v: number) { return "$" + v.toLocaleString(); }
function fmtAxisM(v: number) { return "$" + (v / 1_000_000).toFixed(1) + "M"; }

export default function RevenueCostsPage() {
  const { filters } = useFinanceFilters();
  const kpis = getFinanceKpis(filters);
  const dayparts = getDaypartMix(filters);
  const cogs = getCogsBreakdown(filters);
  const channels = getChannelMix(filters);
  const foodCostData = getTheoreticalVsActual(filters);
  const trend = getFinanceTrend(filters);

  const foodCostTrend = trend.map(t => ({
    day: t.day,
    theoretical: 22.0,
    actual: t.foodCostPct,
  }));

  // Menu Engineering Matrix mock (Stars/Plowhorses/Puzzles/Dogs)
  const menuMatrix = [
    { name: "Wings Combo", popularity: 92, profitability: 68, quadrant: "Star" },
    { name: "Classic Burger", popularity: 85, profitability: 45, quadrant: "Plowhorse" },
    { name: "Lobster Mac", popularity: 35, profitability: 82, quadrant: "Puzzle" },
    { name: "Garden Salad", popularity: 28, profitability: 25, quadrant: "Dog" },
    { name: "Signature Tenders", popularity: 88, profitability: 72, quadrant: "Star" },
    { name: "Fish Tacos", popularity: 42, profitability: 78, quadrant: "Puzzle" },
    { name: "Loaded Fries", popularity: 78, profitability: 58, quadrant: "Star" },
    { name: "Kids Meal", popularity: 65, profitability: 32, quadrant: "Plowhorse" },
  ];

  const quadrantColors: Record<string, string> = {
    Star: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Plowhorse: "bg-amber-50 text-amber-700 border-amber-200",
    Puzzle: "bg-violet-50 text-violet-700 border-violet-200",
    Dog: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Revenue & Cost Analysis</h1>
        <p className="text-sm text-slate-500">Daypart revenue, COGS decomposition, theoretical vs actual food cost, and menu engineering for {dateRangeLabel(filters.dateRange)}</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {[
          { label: "Net Revenue", val: fmtM(kpis.netRevenue), icon: TrendingUp, color: "text-indigo-900", bg: "bg-gradient-to-br from-indigo-50/80 to-indigo-100/30", border: "border-indigo-200/60" },
          { label: "Food Cost %", val: kpis.foodCostPct.toFixed(1) + "%", icon: Utensils, color: kpis.foodCostPct > 30 ? "text-rose-900" : "text-emerald-900", bg: kpis.foodCostPct > 30 ? "bg-gradient-to-br from-rose-50/80 to-rose-100/30" : "bg-gradient-to-br from-emerald-50/80 to-emerald-100/30", border: kpis.foodCostPct > 30 ? "border-rose-200/60" : "border-emerald-200/60" },
          { label: "Theoretical FC %", val: foodCostData.theoreticalPct + "%", icon: Percent, color: "text-amber-900", bg: "bg-gradient-to-br from-amber-50/80 to-amber-100/30", border: "border-amber-200/60" },
          { label: "FC Variance", val: fmtK(foodCostData.variance), icon: AlertTriangle, color: "text-rose-900", bg: "bg-gradient-to-br from-rose-50/80 to-rose-100/30", border: "border-rose-200/60" },
          { label: "Bev Cost %", val: ((kpis.bevCost / kpis.netRevenue) * 100).toFixed(1) + "%", icon: Percent, color: "text-teal-900", bg: "bg-gradient-to-br from-teal-50/80 to-teal-100/30", border: "border-teal-200/60" },
          { label: "Packaging %", val: "2.0%", icon: Percent, color: "text-blue-900", bg: "bg-gradient-to-br from-blue-50/80 to-blue-100/30", border: "border-blue-200/60" },
        ].map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className={"relative overflow-hidden rounded-3xl border p-4 shadow-sm hover:shadow-md transition-shadow " + k.bg + " " + k.border}>
              <div className="absolute -right-3 -top-3 opacity-5"><Icon size={60} className={k.color} /></div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{k.label}</p>
              <p className={"text-xl font-extrabold " + k.color}>{k.val}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daypart Revenue Bars */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Revenue by Daypart</h2>
          <p className="text-xs text-slate-500 mb-4">Identifying highest-contribution service periods</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={dayparts} margin={{ top: 10, right: 10, left: 10, bottom: 0 }} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tickFormatter={fmtAxisM} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12, fontWeight: 600 }} formatter={((v: number) => [fmtDollar(v), "Revenue"]) as any} />
              <Bar dataKey="value" name="Revenue" radius={[4, 4, 0, 0]}>
                {dayparts.map((_, i) => <Cell key={"dp" + i} fill={daypartColors[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* COGS Category Donut */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1">COGS Decomposition</h2>
          <p className="text-xs text-slate-500 mb-4">Cost of goods by category</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={cogs} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} stroke="none">
                {cogs.map((_, i) => <Cell key={"cg" + i} fill={cogsColors[i]} />)}
              </Pie>
              <Tooltip formatter={((v: number) => [fmtDollar(v), "Cost"]) as any} cursor={{ fill: 'transparent' }} contentStyle={{ fontSize: 11, borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Legend layout="horizontal" align="center" verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 10, fontWeight: 500, paddingTop: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Theoretical vs Actual Food Cost */}
      <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-0.5">Theoretical vs Actual Food Cost %</h2>
            <p className="text-xs text-slate-500">The gap between ideal and realized food cost drives waste reduction strategy</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-1.5 border border-rose-100">
            <AlertTriangle size={13} className="text-rose-500" />
            <span className="text-xs font-bold text-rose-700">Variance: {fmtK(foodCostData.variance)} ({(foodCostData.actualPct - foodCostData.theoreticalPct).toFixed(1)}pp)</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={foodCostTrend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
            <YAxis domain={[20, 32]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }} formatter={((v: number) => [v.toFixed(1) + "%"]) as any} />
            <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600, paddingTop: 20 }} iconType="circle" />
            <Line type="monotone" dataKey="theoretical" name="Theoretical" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            <Line type="monotone" dataKey="actual" name="Actual" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 0, fill: "#ef4444" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Menu Engineering Matrix */}
      <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl shadow-sm flex flex-col">
        <div className="border-b border-slate-100/50 p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-0.5">Menu Engineering Matrix</h2>
          <p className="text-xs text-slate-500">Plotting items by popularity (volume) vs profitability (margin contribution)</p>
        </div>
        <div className="p-4 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-2">
          {["Star", "Plowhorse", "Puzzle", "Dog"].map(q => (
            <div key={q} className={"rounded-xl border p-3 " + quadrantColors[q]}>
              <p className="text-xs font-extrabold uppercase tracking-wider mb-1">{q === "Star" ? "★ Stars" : q === "Plowhorse" ? "🐴 Plowhorses" : q === "Puzzle" ? "🧩 Puzzles" : "🐕 Dogs"}</p>
              <p className="text-[10px] font-medium opacity-80">
                {q === "Star" ? "High Pop / High Profit" : q === "Plowhorse" ? "High Pop / Low Profit" : q === "Puzzle" ? "Low Pop / High Profit" : "Low Pop / Low Profit"}
              </p>
            </div>
          ))}
        </div>
        <div className="flex-1 p-2 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100/50 text-sm">
            <thead>
              <tr>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Item</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">Popularity Score</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">Profit Score</th>
                <th className="px-5 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/50">
              {menuMatrix.sort((a, b) => b.profitability - a.profitability).map(item => (
                <tr key={item.name} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 font-bold text-slate-800">{item.name}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-indigo-500" style={{ width: item.popularity + "%" }} /></div>
                      <span className="font-bold text-xs text-slate-600">{item.popularity}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-emerald-500" style={{ width: item.profitability + "%" }} /></div>
                      <span className="font-bold text-xs text-slate-600">{item.profitability}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={"inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border " + quadrantColors[item.quadrant]}>{item.quadrant}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
