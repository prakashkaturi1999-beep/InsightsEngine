"use client";

import { useFinanceFilters, dateRangeLabel } from "@/lib/financeFilterContext";
import { getFinanceKpis, getLaborDetail, getControllableOpex, getNonControllableOpex, getGaExpenses, getStorePnL, getFinanceTrend } from "@/lib/financeDataEngine";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from "recharts";
import { Users, Activity, Clock, TrendingDown, Building, DollarSign } from "lucide-react";

const pieC = ["#ef4444", "#6366f1", "#f59e0b", "#10b981", "#8b5cf6", "#0ea5e9"];
const gaC = ["#6366f1", "#8b5cf6", "#0ea5e9", "#10b981", "#f59e0b", "#94a3b8"];

function fmtM(v: number) { return "$" + (v / 1_000_000).toFixed(1) + "M"; }
function fmtK(v: number) { return "$" + (v / 1000).toFixed(0) + "K"; }
function fmtDollar(v: number) { return "$" + v.toLocaleString(); }

export default function ExpensesPage() {
  const { filters } = useFinanceFilters();
  const kpis = getFinanceKpis(filters);
  const labor = getLaborDetail(filters);
  const controllable = getControllableOpex(filters);
  const nonControllable = getNonControllableOpex(filters);
  const g_a = getGaExpenses(filters);
  const stores = getStorePnL(filters);
  const trend = getFinanceTrend(filters);

  const rplhTrend = trend.map(t => ({ day: t.day, rplh: Math.round(t.revenue / (kpis.transactionCount / trend.length * 0.26)) }));

  const laborWaterfall = [
    { name: "Hourly Wages", value: labor.find(l => l.name.includes("FOH"))!.value + labor.find(l => l.name.includes("BOH"))!.value },
    { name: "Salary/Mgmt", value: labor.find(l => l.name.includes("Salaried"))!.value },
    { name: "Overtime", value: labor.find(l => l.name.includes("Overtime"))!.value },
    { name: "Benefits/Tax", value: labor.find(l => l.name.includes("Benefits"))!.value },
  ];

  // OT by store
  const storeOT = stores.map(s => ({ name: s.name.length > 10 ? s.name.substring(0, 10) + "..." : s.name, otPct: Math.round((3 + Math.random() * 6) * 10) / 10 })).sort((a, b) => b.otPct - a.otPct);

  // Controllable vs Non-Controllable
  const allOpex = [
    ...controllable.map(c => ({ ...c, type: "Controllable" })),
    ...nonControllable.map(c => ({ ...c, type: "Non-Controllable" })),
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Labor & Operating Expenses</h1>
        <p className="text-sm text-slate-500">RPLH, overtime tracking, controllable vs non-controllable OpEx, and G&A for {dateRangeLabel(filters.dateRange)}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {[
          { label: "Labor % of Rev", val: kpis.laborPct.toFixed(1) + "%", icon: Users, color: kpis.laborPct > 30 ? "text-rose-900" : "text-emerald-900", bg: kpis.laborPct > 30 ? "bg-gradient-to-br from-rose-50/80 to-rose-100/30" : "bg-gradient-to-br from-emerald-50/80 to-emerald-100/30", border: kpis.laborPct > 30 ? "border-rose-200/60" : "border-emerald-200/60" },
          { label: "RPLH", val: "$" + kpis.rplh.toFixed(0), icon: DollarSign, color: "text-indigo-900", bg: "bg-gradient-to-br from-indigo-50/80 to-indigo-100/30", border: "border-indigo-200/60" },
          { label: "OT % of Hours", val: kpis.overtimePct.toFixed(1) + "%", icon: Clock, color: kpis.overtimePct > 5 ? "text-amber-900" : "text-emerald-900", bg: "bg-gradient-to-br from-amber-50/80 to-amber-100/30", border: "border-amber-200/60" },
          { label: "Turnover Rate", val: kpis.turnoverRateAnnual + "%", icon: TrendingDown, color: "text-rose-900", bg: "bg-gradient-to-br from-rose-50/80 to-rose-100/30", border: "border-rose-200/60" },
          { label: "Controllable OpEx", val: fmtK(controllable.reduce((s, c) => s + c.value, 0)), icon: Activity, color: "text-blue-900", bg: "bg-gradient-to-br from-blue-50/80 to-blue-100/30", border: "border-blue-200/60" },
          { label: "G&A (Above-Store)", val: fmtM(kpis.gaExpenses), icon: Building, color: "text-violet-900", bg: "bg-gradient-to-br from-violet-50/80 to-violet-100/30", border: "border-violet-200/60" },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className={"relative overflow-hidden rounded-3xl border p-4 shadow-sm " + kpi.bg + " " + kpi.border}>
              <div className="absolute -right-3 -top-3 opacity-5"><Icon size={60} className={kpi.color} /></div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{kpi.label}</p>
              <p className={"text-xl font-extrabold " + kpi.color}>{kpi.val}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Labor Cost Waterfall */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Labor Cost Structure</h2>
          <p className="text-xs text-slate-500 mb-4">Wages → OT → Benefits → Total labor cost</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={laborWaterfall} margin={{ top: 10, right: 10, left: 10, bottom: 0 }} barSize={50}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tickFormatter={(v: number) => fmtK(v)} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12, fontWeight: 600 }} formatter={((v: number) => [fmtDollar(v), "Cost"]) as any} />
              <Bar dataKey="value" name="Labor" radius={[4, 4, 0, 0]}>
                {laborWaterfall.map((_, i) => <Cell key={"lw" + i} fill={pieC[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Overtime by Store */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Overtime % by Store</h2>
          <p className="text-xs text-slate-500 mb-4">Stores exceeding 5% OT threshold flagged</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={storeOT} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", fontSize: 12, fontWeight: 600 }} formatter={((v: number) => [v + "%", "OT Rate"]) as any} />
              <Bar dataKey="otPct" name="OT %" radius={[0, 4, 4, 0]}>
                {storeOT.map((s, i) => <Cell key={"ot" + i} fill={s.otPct > 5 ? "#ef4444" : "#10b981"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controllable vs Non-Controllable OpEx */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-3">Operating Expense Breakdown</h2>
          <div className="space-y-3">
            {allOpex.map((item, i) => (
              <div key={item.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">{item.name} <span className={"text-[9px] font-bold uppercase tracking-wider " + (item.type === "Controllable" ? "text-emerald-500" : "text-slate-400")}>{item.type}</span></span>
                  <span className="font-bold text-slate-900">{fmtDollar(item.value)} <span className="text-slate-400 font-normal">({item.pct}%)</span></span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: (item.pct * 10) + "%", backgroundColor: item.type === "Controllable" ? pieC[i % pieC.length] : "#94a3b8" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* G&A Breakdown Donut */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1">G&A (Above-Store) Expenses</h2>
          <p className="text-xs text-slate-500 mb-2">Corporate overhead: {((kpis.gaExpenses / kpis.netRevenue) * 100).toFixed(1)}% of revenue</p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={g_a} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} stroke="none">
                {g_a.map((_, i) => <Cell key={"ga" + i} fill={gaC[i]} />)}
              </Pie>
              <Tooltip formatter={((v: number) => [fmtDollar(v), "G&A"]) as any} contentStyle={{ fontSize: 11, borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Legend layout="horizontal" align="center" verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 10, fontWeight: 500, paddingTop: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
