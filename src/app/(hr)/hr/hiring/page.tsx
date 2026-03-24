"use client";

import { useHrFilters } from "@/lib/hrFilterContext";
import { getHrKpis } from "@/lib/hrDataEngine";
import { UserPlus, UserCheck, CalendarDays, FileWarning, AlertTriangle, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const declineColors = ["#f43f5e", "#f97316", "#eab308", "#8b5cf6"];

export default function HiringPage() {
  const { filters } = useHrFilters();
  const kpis = getHrKpis(filters);

  const timeToFill = [
    { role: "Line Cook", days: 18 },
    { role: "Server", days: 11 },
    { role: "Manager", days: 32 },
    { role: "Host", days: 7 },
  ];

  const declineReasons = [
    { name: "Pay Rate", value: 42 },
    { name: "Schedule Conflict", value: 28 },
    { name: "Ghosted", value: 18 },
    { name: "Took Other Job", value: 12 },
  ];

  const actionQueue = [
    { title: "Cook Onboarding No-Show", desc: "Candidate accepted offer but failed to show for Day 1 orientation.", priority: "High", store: "Uptown (002)" },
    { title: "Server Offer Decline", desc: "Candidate requested $2/hr higher base pay.", priority: "Medium", store: "Downtown (001)" },
    { title: "I-9 Form Pending", desc: "New host missing documentation deadline tomorrow.", priority: "Critical", store: "Westside (003)" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hiring & Onboarding</h1>
        <p className="text-sm text-slate-500">Time-to-fill velocity, offer acceptance pipelines, and critical onboarding blockers.</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          { label: "Time to Fill", val: kpis.timeToFillDays + " days", icon: CalendarDays, color: "text-indigo-900", bg: "bg-indigo-50/80 border-indigo-200/60" },
          { label: "Offer Acceptance Rate", val: kpis.offerAcceptanceRate + "%", icon: UserCheck, color: "text-emerald-900", bg: "bg-emerald-50/80 border-emerald-200/60" },
          { label: "Onboarding Completion", val: kpis.onboardingCompletion + "%", icon: UserPlus, color: "text-amber-900", bg: "bg-amber-50/80 border-amber-200/60" },
        ].map((kpi, i) => (
          <div key={i} className={`relative overflow-hidden rounded-3xl border p-6 shadow-sm ${kpi.bg}`}>
            <div className="absolute -right-3 -top-3 opacity-5"><kpi.icon size={100} className={kpi.color} /></div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{kpi.label}</p>
            <p className={`text-4xl font-extrabold ${kpi.color}`}>{kpi.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time to Fill Chart */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Time to Fill by Role</h2>
          <p className="text-xs text-slate-500 mb-4">Average days from opening req to candidate acceptance.</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeToFill} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="role" type="category" tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} formatter={(v: any) => [`${v} days`, "Time to Fill"]} />
                <Bar dataKey="days" radius={[0, 4, 4, 0]} barSize={24}>
                  {timeToFill.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.days > 20 ? "#ef4444" : "#6366f1"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Offer Decline Reasons Donut */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm flex flex-col items-center">
          <div className="w-full text-left mb-2">
            <h2 className="text-sm font-bold text-slate-900">Offer Decline Reasons</h2>
            <p className="text-xs text-slate-500">Primary driver for the 32% unaccepted offers.</p>
          </div>
          <div className="flex-1 w-full relative min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={declineReasons} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} stroke="none" paddingAngle={2}>
                  {declineReasons.map((_, i) => <Cell key={i} fill={declineColors[i % declineColors.length]} />)}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v: any) => `${v}%`} />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 500, paddingTop: 10 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-6">
              <span className="text-2xl font-bold text-slate-800">100%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Declines</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Queue */}
      <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl shadow-sm overflow-hidden flex flex-col">
        <div className="border-b border-slate-100/50 p-5 flex items-center gap-2">
          <FileWarning size={16} className="text-slate-400" />
          <h2 className="text-sm font-bold text-slate-900">Hiring Queue Issue Alerts</h2>
        </div>
        <div className="p-4 space-y-3">
          {actionQueue.map((act, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-2xl border bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer">
              <div className="mt-0.5">
                <AlertTriangle size={18} className={act.priority === 'Critical' ? 'text-rose-500' : act.priority === 'High' ? 'text-orange-500' : 'text-amber-500'} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <span className={`text-[9px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full mb-1 border ${act.priority === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-200' : act.priority === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    {act.priority}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">{act.store}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{act.title}</h3>
                <p className="text-xs font-medium text-slate-500 mt-0.5">{act.desc}</p>
              </div>
              <div className="flex flex-col justify-center">
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
