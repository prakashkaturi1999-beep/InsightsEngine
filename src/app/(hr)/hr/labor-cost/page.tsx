"use client";

import { useHrFilters } from "@/lib/hrFilterContext";
import { getHrKpis } from "@/lib/hrDataEngine";
import { DollarSign, Activity, Clock, Percent, AlertTriangle, ChevronRight, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell, Legend } from "recharts";

export default function LaborCostPage() {
  const { filters } = useHrFilters();
  const kpis = getHrKpis(filters);

  // MTD Trend for RPLH vs CPLH
  const productivityTrend = [
    { day: "Oct 1", rplh: 52.40, cplh: 17.50 },
    { day: "Oct 8", rplh: 53.10, cplh: 17.45 },
    { day: "Oct 15", rplh: 51.80, cplh: 17.65 },
    { day: "Oct 22", rplh: 54.50, cplh: 17.30 },
    { day: "Oct 29", rplh: 54.23, cplh: 17.76 },
  ];

  const storeOvertime = [
    { store: "Downtown (001)", hours: 340, cost: 7480 },
    { store: "Uptown (002)", hours: 185, cost: 4070 },
    { store: "Westside (003)", hours: 110, cost: 2420 },
    { store: "Eastside (004)", hours: 69, cost: 1518 },
  ];

  const exceptions = [
    { title: "Excessive OT - Downtown", desc: "4 servers over 40hrs this week", priority: "Critical" },
    { title: "Low RPLH - Westside", desc: "$42.10 RPLH is 20% below target", priority: "High" },
    { title: "High Idle Labor - Uptown", desc: "32 hours unused capacity yesterday", priority: "Medium" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Labor Cost & Productivity</h1>
        <p className="text-sm text-slate-500">Revenue per labor hour, overtime tracking, and idle labor capacity.</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Labor Cost %", val: kpis.laborCostProdPct + "%", icon: Percent, color: "text-emerald-900", bg: "bg-emerald-50/80 border-emerald-200/60" },
          { label: "Revenue per Labor Hr", val: `$${kpis.revenuePerLaborHour}`, icon: TrendingUp, color: "text-indigo-900", bg: "bg-indigo-50/80 border-indigo-200/60" },
          { label: "Cost per Labor Hr", val: `$${kpis.costPerLaborHour}`, icon: DollarSign, color: "text-amber-900", bg: "bg-amber-50/80 border-amber-200/60" },
          { label: "Overtime Hours MTD", val: kpis.laborCostOtHoursMtd, icon: Clock, color: "text-rose-900", bg: "bg-rose-50/80 border-rose-200/60" },
        ].map((kpi, i) => (
          <div key={i} className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm ${kpi.bg}`}>
            <div className="absolute -right-3 -top-3 opacity-5"><kpi.icon size={80} className={kpi.color} /></div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{kpi.label}</p>
            <p className={`text-3xl font-extrabold ${kpi.color}`}>{kpi.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productivity Trend */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-bold text-slate-900 mb-1">RPLH vs CPLH Productivity Trend</h2>
          <p className="text-xs text-slate-500 mb-4">Tracking revenue generation efficiency against pure labor cost rates.</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productivityTrend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v: any) => `$${v.toFixed(2)}`} />
                <Legend wrapperStyle={{ fontSize: 11, fontWeight: 600, paddingTop: 10 }} iconType="circle" />
                <Line yAxisId="left" type="monotone" dataKey="rplh" name="Revenue per Labor Hour" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }} />
                <Line yAxisId="right" type="monotone" dataKey="cplh" name="Cost per Labor Hour" stroke="#f59e0b" strokeWidth={3} strokeDasharray="4 4" dot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Idle Labor Summary & Exceptions */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl border border-rose-200/60 bg-rose-50/50 backdrop-blur-xl p-5 shadow-sm text-center flex flex-col items-center justify-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500 mb-1">Idle Labor Cost</p>
              <p className="text-xl font-extrabold text-rose-900">${kpis.idleLaborCost.toLocaleString()}</p>
            </div>
            <div className="rounded-3xl border border-amber-200/60 bg-amber-50/50 backdrop-blur-xl p-5 shadow-sm text-center flex flex-col items-center justify-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500 mb-1">Idle Labor Hrs</p>
              <p className="text-xl font-extrabold text-amber-900">{kpis.idleLaborHours}</p>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl shadow-sm flex flex-col flex-1">
            <div className="border-b border-slate-100/50 p-5">
              <h2 className="text-sm font-bold text-slate-900 mb-0.5">Manager Action Items</h2>
              <p className="text-xs text-slate-500">Exceptions requiring intervention</p>
            </div>
            <div className="flex-1 p-4 space-y-3">
              {exceptions.map((ex, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100/50 transition-colors cursor-pointer">
                  <AlertTriangle size={16} className={ex.priority === 'Critical' ? 'text-rose-500' : ex.priority === 'High' ? 'text-orange-500' : 'text-amber-500'} />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-900">{ex.title}</p>
                    <p className="text-[10px] font-medium text-slate-500 mt-0.5">{ex.desc}</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overtime by Store */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Overtime Hours by Store</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={storeOvertime} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="store" type="category" tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} width={100} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} formatter={(v: any) => [`${v} hrs`, "Overtime"]} />
                <Bar dataKey="hours" name="Overtime Hours" radius={[0, 4, 4, 0]} barSize={20}>
                  {storeOvertime.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.hours > 200 ? "#ef4444" : "#f59e0b"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Overtime Cost by Store</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={storeOvertime} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                <YAxis dataKey="store" type="category" tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} width={100} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} formatter={(v: any) => [`$${v.toLocaleString()}`, "Overtime Cost"]} />
                <Bar dataKey="cost" name="Overtime Cost" radius={[0, 4, 4, 0]} barSize={20}>
                  {storeOvertime.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cost > 5000 ? "#ef4444" : "#f59e0b"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
