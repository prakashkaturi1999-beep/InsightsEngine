"use client";

import { useHrFilters } from "@/lib/hrFilterContext";
import { getHrKpis } from "@/lib/hrDataEngine";
import { Clock, ShieldAlert, CheckCircle, BellRing, UserMinus, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";

export default function AttendancePage() {
  const { filters } = useHrFilters();
  const kpis = getHrKpis(filters);

  const callOutTrend = [
    { day: "Mon", rate: 2.1 },
    { day: "Tue", rate: 1.8 },
    { day: "Wed", rate: 2.4 },
    { day: "Thu", rate: 3.2 },
    { day: "Fri", rate: 5.6 }, // Higher on Friday
    { day: "Sat", rate: 4.8 },
    { day: "Sun", rate: 4.1 },
  ];

  const heatmapData = [
    { shift: "AM", M: 12, T: 8, W: 15, Th: 11, F: 24, S: 18, Su: 14 },
    { shift: "PM", M: 8, T: 10, W: 12, Th: 19, F: 35, S: 42, Su: 28 },
    { shift: "Late", M: 2, T: 1, W: 4, Th: 6, F: 12, S: 15, Su: 8 },
  ];

  const repeatOffenders = [
    { name: "John D.", infractions: 4, type: "Late Clock-in", trend: "Worsening" },
    { name: "Sarah K.", infractions: 3, type: "No Call No Show", trend: "Critical" },
    { name: "Mike R.", infractions: 3, type: "Missed Punch", trend: "Stable" },
  ];

  const reliabilityLeaderboard = [
    { name: "Emily Watson", role: "Server", score: 100, streak: "45 Days" },
    { name: "David Chen", role: "Line Cook", score: 99, streak: "38 Days" },
    { name: "Amanda Joy", role: "Bartender", score: 98, streak: "29 Days" },
    { name: "Marcus T.", role: "Host", score: 98, streak: "26 Days" },
  ];

  // Helper for heatmap colors
  const getHeatmapColor = (val: number) => {
    if (val > 30) return "bg-rose-500 text-white";
    if (val > 15) return "bg-amber-400 text-amber-900";
    if (val > 5) return "bg-amber-200 text-amber-800";
    return "bg-slate-100 text-slate-400";
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance & Reliability</h1>
        <p className="text-sm text-slate-500">Tracking clock-in fidelity, last-minute call-outs, and repeat offenders.</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Late Clock-In Rate", val: kpis.lateClockInRateAlt + "%", icon: Clock, color: "text-amber-900", bg: "bg-amber-50/80 border-amber-200/60" },
          { label: "Late Clock-Ins MTD", val: kpis.lateClockIns, icon: AlertTriangle, color: "text-orange-900", bg: "bg-orange-50/80 border-orange-200/60" },
          { label: "Missed Punch Rate", val: kpis.missedPunchRate + "%", icon: BellRing, color: "text-rose-900", bg: "bg-rose-50/80 border-rose-200/60" },
          { label: "Missed Punches MTD", val: kpis.missedPunches, icon: ShieldAlert, color: "text-red-900", bg: "bg-red-50/80 border-red-200/60" },
          { label: "Early Clock-Out Rate", val: kpis.earlyClockOutRate + "%", icon: UserMinus, color: "text-indigo-900", bg: "bg-indigo-50/80 border-indigo-200/60" },
        ].map((kpi, i) => (
          <div key={i} className={`relative overflow-hidden rounded-3xl border p-4 shadow-sm ${kpi.bg}`}>
            <div className="absolute -right-3 -top-3 opacity-5"><kpi.icon size={60} className={kpi.color} /></div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{kpi.label}</p>
            <p className={`text-2xl font-extrabold ${kpi.color}`}>{kpi.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Call Out Trend Chart */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Last-Minute Call-Out Rate</h2>
          <p className="text-xs text-slate-500 mb-4">Percentage of scheduled shifts cancelled &lt;4 hours prior.</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={callOutTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v: any) => [`${v}%`, "Call-Out Rate"]} />
                <Bar dataKey="rate" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {callOutTrend.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.rate > 4 ? "#ef4444" : "#6366f1"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heatmap Widget */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Attendance Violation Concentration</h2>
          <p className="text-xs text-slate-500 mb-4">Heatmap of occurrences by shift and day over the last 30 days.</p>
          <div className="flex-1 w-full overflow-x-auto">
            <table className="w-full text-center border-separate" style={{ borderSpacing: "4px" }}>
              <thead>
                <tr>
                  <th className="font-semibold text-slate-400 text-[10px] pb-2">Shift</th>
                  {['M', 'T', 'W', 'Th', 'F', 'S', 'Su'].map(d => <th key={d} className="font-semibold text-slate-400 text-xs pb-2 w-10">{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {heatmapData.map((row, i) => (
                  <tr key={i}>
                    <td className="text-xs font-bold text-slate-500 text-right pr-3">{row.shift}</td>
                    {[row.M, row.T, row.W, row.Th, row.F, row.S, row.Su].map((val, idx) => (
                      <td key={idx} className={`rounded-xl h-12 text-xs font-bold transition-colors ${getHeatmapColor(val)}`}>
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 mb-0.5">Employee Reliability Score</h2>
            <p className="text-xs text-slate-500">Perfect attendance leaderboards.</p>
          </div>
          <div className="p-2 space-y-1">
            {reliabilityLeaderboard.map((emp, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100/50 flex items-center justify-center border border-emerald-200 text-emerald-600 font-bold text-xs">{i+1}</div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{emp.name}</h3>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">{emp.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-600 font-extrabold flex items-center gap-1 justify-end"><CheckCircle size={14} /> Score: {emp.score}</div>
                  <div className="text-[10px] font-bold text-slate-400">Streak: {emp.streak}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Repeat Offenders */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 mb-0.5">Repeat Offender Rate</h2>
            <p className="text-xs text-slate-500">Employees with 3+ violations MTD.</p>
          </div>
          <div className="p-4 space-y-3">
            {repeatOffenders.map((off, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-rose-100 bg-rose-50/50 h-full">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{off.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{off.type}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-xs font-bold text-rose-700">{off.infractions}</div>
                    <div className="text-[9px] uppercase tracking-wider text-rose-400 font-bold">Incidents</div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${off.trend === 'Critical' ? 'bg-rose-500 text-white border-rose-600' : 'bg-rose-200 text-rose-800 border-rose-300'}`}>
                    {off.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
