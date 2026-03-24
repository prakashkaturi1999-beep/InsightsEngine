"use client";

import { useHrFilters } from "@/lib/hrFilterContext";
import { getHrKpis } from "@/lib/hrDataEngine";
import { Users, Clock, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown, Star, ChevronRight, Activity } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const donutColors = ["#8b5cf6", "#0ea5e9", "#f43f5e"];

export default function HrHome() {
  const { filters } = useHrFilters();
  const kpis = getHrKpis(filters as any); // Ignoring type since hrDataEngine accepts the old format

  const openRoles = [
    { name: "Line Cook", count: 5, priority: "High" },
    { name: "Host", count: 3, priority: "Medium" },
    { name: "Shift Supervisor", count: 4, priority: "Critical" },
  ];

  const topPerformers = [
    { name: "Sarah M.", role: "Server", checkAvg: 42.50, tipPct: 22.4, score: 98, status: "Excellent" },
    { name: "David L.", role: "Line Cook", checkAvg: null, tipPct: null, score: 96, status: "Excellent" },
    { name: "Elena R.", role: "Bartender", checkAvg: 54.20, tipPct: 24.1, score: 95, status: "Great" },
  ];

  const quickActions = [
    { title: "Review Labor Costs", desc: "Overtime approaching 5% threshold", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-50" },
    { title: "Fill Open Positions", desc: "4 Critical shift supervisor gaps", icon: Users, color: "text-amber-500", bg: "bg-amber-50" },
    { title: "Approve Timesheets", desc: "12 pending manager approvals", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workforce Command Center</h1>
        <p className="text-sm text-slate-500">Global HR performance, active gaps, and manager action items.</p>
      </div>

      {/* KPIs Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Labor Cost %", val: kpis.laborCostPct + "%", icon: DollarSignIcon, trend: "-1.2% vs last week", positive: true, color: "text-emerald-700", bg: "bg-emerald-50/80 border-emerald-200/60" },
          { label: "Active Headcount", val: kpis.activeHeadcount, icon: Users, trend: "+3 new hires", positive: true, color: "text-blue-700", bg: "bg-blue-50/80 border-blue-200/60" },
          { label: "Attendance Rate", val: kpis.attendanceRate + "%", icon: CheckCircle2, trend: "-0.5% vs avg", positive: false, color: "text-amber-700", bg: "bg-amber-50/80 border-amber-200/60" },
          { label: "Late Clock-in Rate", val: kpis.lateClockInRate + "%", icon: Clock, trend: "+1.1% increase", positive: false, color: "text-rose-700", bg: "bg-rose-50/80 border-rose-200/60" },
          { label: "Schedule vs Actual", val: kpis.scheduleVsActual + "% var", icon: Activity, trend: "Overstaffed", positive: false, color: "text-indigo-700", bg: "bg-indigo-50/80 border-indigo-200/60" },
        ].map((kpi, i) => (
          <div key={i} className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm ${kpi.bg}`}>
            <div className="absolute -right-3 -top-3 opacity-5"><kpi.icon size={80} className={kpi.color} /></div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{kpi.label}</p>
            <p className={`text-3xl font-extrabold mb-2 ${kpi.color}`}>{kpi.val}</p>
            <span className={`flex items-center gap-1 text-[10px] font-bold ${kpi.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {kpi.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {kpi.trend}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Time Sparkline Card */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Avg Ticket Time</p>
          <div className="flex items-baseline gap-2 mb-4">
            <p className="text-5xl font-extrabold text-slate-900">{kpis.avgTicketTime}</p>
            <p className="text-sm font-medium text-slate-500">min</p>
          </div>
          <div className="h-24 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{val: 5.2}, {val: 5.1}, {val: 5.4}, {val: 5.8}, {val: 5.6}, {val: 5.5}]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', color: '#0f172a', fontSize: '10px' }} formatter={(v: any) => [`${v}m`, "Avg Time"]} />
                <Bar dataKey="val" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Open Positions Donut & Table */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm lg:col-span-2 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-1/3 h-40 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={openRoles} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} stroke="none" paddingAngle={2}>
                  {openRoles.map((_, i) => <Cell key={i} fill={donutColors[i]} />)}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', color: '#0f172a', fontSize: '12px', borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-900">{kpis.openPositions}</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Open</span>
            </div>
          </div>
          <div className="w-full md:w-2/3 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Critical Gaps</h3>
            {openRoles.map((role, i) => (
              <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: donutColors[i] }} />
                  <span className="text-sm font-medium text-slate-700">{role.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500">{role.count} openings</span>
                  <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${role.priority === 'Critical' ? 'bg-rose-50 text-rose-600 border-rose-200' : role.priority === 'High' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>{role.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Employees Table */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl shadow-sm lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Top Performers</h2>
              <p className="text-xs text-slate-500">Ranked by overall reliability and service score</p>
            </div>
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-500 transition-colors">View All</button>
          </div>
          <div className="flex-1 overflow-x-auto p-2">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Employee</th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Role</th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Avg Check</th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Tip %</th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {topPerformers.map((emp, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 border border-slate-200">{i+1}</div>
                      {emp.name}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 font-medium">{emp.role}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-700">{emp.checkAvg ? `$${emp.checkAvg.toFixed(2)}` : "—"}</td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-600">{emp.tipPct ? `${emp.tipPct}%` : "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full text-xs font-bold">
                        <Star size={10} className="fill-indigo-500 text-indigo-500" /> {emp.score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manager Quick Actions */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl shadow-sm p-6 flex flex-col">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Manager Action Queue</h2>
          <div className="space-y-3 flex-1">
            {quickActions.map((action, i) => (
              <div key={i} className={`flex items-start gap-4 p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-shadow cursor-pointer`}>
                <div className={`mt-0.5 h-8 w-8 rounded-full flex items-center justify-center ${action.bg}`}><action.icon size={16} className={action.color} /></div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900">{action.title}</h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{action.desc}</p>
                </div>
                <ChevronRight size={16} className="text-slate-400 self-center" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline icon
function DollarSignIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
}
