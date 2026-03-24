"use client";

import { useHrFilters } from "@/lib/hrFilterContext";
import { getHrKpis } from "@/lib/hrDataEngine";
import { Calendar, Percent, ShieldCheck, Activity, Users } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell, Legend, PieChart, Pie } from "recharts";

export default function SchedulingPage() {
  const { filters } = useHrFilters();
  const kpis = getHrKpis(filters);

  const scheduleVariance = [
    { day: "Mon", scheduled: 180, actual: 185 },
    { day: "Tue", scheduled: 180, actual: 178 },
    { day: "Wed", scheduled: 190, actual: 195 },
    { day: "Thu", scheduled: 190, actual: 205 },
    { day: "Fri", scheduled: 240, actual: 238 },
    { day: "Sat", scheduled: 260, actual: 280 },
    { day: "Sun", scheduled: 220, actual: 235 },
  ];

  const roleCoverage = [
    { role: "Server", over: 15, under: -5 },
    { role: "Line Cook", over: 5, under: -12 },
    { role: "Host", over: 8, under: -2 },
    { role: "Bartender", over: 12, under: 0 },
    { role: "Dishwasher", over: 0, under: -8 },
  ];

  const coverageStatus = [
    { name: "Covered", value: 68 },
    { name: "Uncovered", value: 12 },
    { name: "At Risk", value: 20 },
  ];

  const coverageColors = ["#10b981", "#ef4444", "#f59e0b"];

  const operationalTable = [
    { role: "Line Cook", shift: "Friday PM", variance: "-2 Staff", ot: 3, reason: "Unexpected volume, 1 call-out" },
    { role: "Server", shift: "Saturday AM", variance: "+3 Staff", ot: 0, reason: "Over-scheduled for projected event" },
    { role: "Dishwasher", shift: "Sunday PM", variance: "-1 Staff", ot: 1, reason: "No-show, coverage via OT" },
    { role: "Bartender", shift: "Thursday PM", variance: "Target", ot: 2, reason: "Late rush, extended shifts" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Scheduling & Coverage</h1>
        <p className="text-sm text-slate-500">Schedule vs actual hours variance, shift coverage integrity, and targeted role gaps.</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Staffing Levels", val: kpis.staffingLevels + "%", icon: Users, color: "text-indigo-900", bg: "bg-indigo-50/80 border-indigo-200/60" },
          { label: "Variance %", val: "+" + kpis.variancePct + "%", icon: Activity, color: "text-rose-900", bg: "bg-rose-50/80 border-rose-200/60" },
          { label: "Accuracy Score", val: kpis.accuracyScore, icon: ShieldCheck, color: "text-emerald-900", bg: "bg-emerald-50/80 border-emerald-200/60" },
          { label: "Unplanned OT", val: kpis.unplannedOtShifts + " shifts", icon: Calendar, color: "text-amber-900", bg: "bg-amber-50/80 border-amber-200/60" },
          { label: "Shift Coverage", val: kpis.shiftCoverageStatus + "%", icon: Percent, color: "text-blue-900", bg: "bg-blue-50/80 border-blue-200/60" },
        ].map((kpi, i) => (
          <div key={i} className={`relative overflow-hidden rounded-3xl border p-4 shadow-sm ${kpi.bg}`}>
            <div className="absolute -right-3 -top-3 opacity-5"><kpi.icon size={60} className={kpi.color} /></div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{kpi.label}</p>
            <p className={`text-2xl font-extrabold ${kpi.color}`}>{kpi.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule vs Actual Chart */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Schedule vs Actual Variance</h2>
          <p className="text-xs text-slate-500 mb-4">Total scheduled labor hours versus actual clocked hours.</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scheduleVariance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11, fontWeight: 600, paddingTop: 10 }} iconType="circle" />
                <Line type="monotone" dataKey="scheduled" name="Scheduled Hours" stroke="#94a3b8" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                <Line type="monotone" dataKey="actual" name="Actual Hours" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 0, fill: "#6366f1" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Coverage Donut */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm flex flex-col items-center">
          <div className="w-full text-left mb-2">
            <h2 className="text-sm font-bold text-slate-900">Shift Coverage Status</h2>
            <p className="text-xs text-slate-500">Rolling 7 days schedule coverage.</p>
          </div>
          <div className="flex-1 w-full relative min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={coverageStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} stroke="none">
                  {coverageStatus.map((_, i) => <Cell key={i} fill={coverageColors[i % coverageColors.length]} />)}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 500, paddingTop: 10 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-6">
              <span className="text-2xl font-bold text-emerald-600">{kpis.shiftCoverageStatus}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Over/Understaffing Stacked Bar */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Overstaffing & Understaffing by Role</h2>
          <p className="text-xs text-slate-500 mb-4">Variance in hours relative to demand matrix.</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roleCoverage} layout="vertical" stackOffset="sign" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="role" type="category" tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11, fontWeight: 600, paddingTop: 10 }} iconType="circle" />
                <Bar dataKey="under" name="Understaffed (Hrs)" fill="#ef4444" stackId="stack" barSize={16} radius={[4, 0, 0, 4]} />
                <Bar dataKey="over" name="Overstaffed (Hrs)" fill="#10b981" stackId="stack" barSize={16} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operational Variance Table */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl shadow-sm flex flex-col overflow-hidden">
          <div className="border-b border-slate-100/50 p-5">
            <h2 className="text-sm font-bold text-slate-900 mb-0.5">Role Coverage & Variance Details</h2>
            <p className="text-xs text-slate-500">Unplanned OT and shift disruption root causes.</p>
          </div>
          <div className="flex-1 p-2 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Role / Shift</th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">Staffing Variance</th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">OT Shifts</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Root Cause</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {operationalTable.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900 text-xs">{row.role}</p>
                      <p className="text-[10px] text-slate-500">{row.shift}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`inline-flex font-bold text-xs px-2 py-0.5 rounded-md ${row.variance.includes('-') ? 'bg-rose-50 text-rose-700' : row.variance.includes('+') ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                        {row.variance}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-extrabold text-xs ${row.ot > 0 ? 'text-amber-600' : 'text-slate-400'}`}>{row.ot > 0 ? row.ot : '-'}</span>
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-slate-500 truncate max-w-[150px]">{row.reason}</td>
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
