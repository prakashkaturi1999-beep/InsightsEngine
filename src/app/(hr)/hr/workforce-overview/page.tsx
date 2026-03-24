"use client";

import { useHrFilters } from "@/lib/hrFilterContext";
import { getHrKpis } from "@/lib/hrDataEngine";
import { Users, Clock, UserPlus, Briefcase, Search, TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from "recharts";

const pieColors = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6"];
const attritionColors = ["#ef4444", "#f97316", "#f59e0b", "#ec4899"];

export default function WorkforceOverviewPage() {
  const { filters } = useHrFilters();
  const kpis = getHrKpis(filters);

  const headcountTrend = [
    { month: "Oct", count: 215 },
    { month: "Nov", count: 218 },
    { month: "Dec", count: 220 },
    { month: "Jan", count: 224 },
    { month: "Feb", count: 222 },
    { month: "Mar", count: 227 },
  ];

  const roleComposition = [
    { name: "Server", value: 85 },
    { name: "Line Cook", value: 62 },
    { name: "Host", value: 24 },
    { name: "Bartender", value: 38 },
    { name: "Manager", value: 18 },
  ];

  const attritionByDept = [
    { name: "BOH", rate: 14.2 },
    { name: "FOH", rate: 18.5 },
    { name: "Bar", rate: 12.1 },
    { name: "Mgmt", rate: 4.5 },
  ];

  const recentHires = [
    { name: "Emily Chen", role: "Server", store: "Downtown (001)", start: "Mar 12, 2026", progress: 85, status: "On Track" },
    { name: "Marcus Johnson", role: "Line Cook", store: "Uptown (002)", start: "Mar 08, 2026", progress: 100, status: "Completed" },
    { name: "Sophia Martinez", role: "Bartender", store: "Downtown (001)", start: "Mar 15, 2026", progress: 40, status: "At Risk" },
    { name: "James Wilson", role: "Host", store: "Uptown (002)", start: "Mar 18, 2026", progress: 15, status: "On Track" },
    { name: "Olivia Taylor", role: "Server", store: "Downtown (001)", start: "Mar 05, 2026", progress: 100, status: "Completed" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workforce Overview</h1>
        <p className="text-sm text-slate-500">Headcount trends, role composition, and recent hire tracking.</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Headcount", val: kpis.activeHeadcountTotal, icon: Users, color: "text-indigo-900", bg: "bg-indigo-50/80 border-indigo-200/60" },
          { label: "Avg Employee Tenure", val: `${kpis.avgTenureYrs} yrs`, icon: Clock, color: "text-emerald-900", bg: "bg-emerald-50/80 border-emerald-200/60" },
          { label: "New Hires (<30 Days)", val: kpis.newHires30d, icon: UserPlus, color: "text-blue-900", bg: "bg-blue-50/80 border-blue-200/60" },
          { label: "Open Positions", val: kpis.openPositions, icon: Briefcase, color: "text-amber-900", bg: "bg-amber-50/80 border-amber-200/60" },
        ].map((kpi, i) => (
          <div key={i} className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm ${kpi.bg}`}>
            <div className="absolute -right-3 -top-3 opacity-5"><kpi.icon size={80} className={kpi.color} /></div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{kpi.label}</p>
            <p className={`text-3xl font-extrabold ${kpi.color}`}>{kpi.val}</p>
          </div>
        ))}
      </div>

      {/* Headcount Trend Chart */}
      <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Headcount Growth Trend</h2>
            <p className="text-xs text-slate-500">Net active employees over 6 months</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <TrendingUp size={14} /> +5.5% Growth YTD
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={headcountTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis domain={['dataMin - 10', 'dataMax + 10']} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} />
              <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" activeDot={{ r: 6, strokeWidth: 0, fill: "#6366f1" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workforce Composition */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Workforce Composition</h2>
          <p className="text-xs text-slate-500 mb-4">Distribution of headcount across roles</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={roleComposition} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} stroke="none">
                  {roleComposition.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                </Pie>
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ fontSize: 11, borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 500, paddingTop: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attrition by Department */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Annualized Attrition Rates</h2>
              <p className="text-xs text-slate-500">Trailing 12 months by operational bucket</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
              <TrendingDown size={12} /> FOH highest
            </div>
          </div>
          <div className="flex-1 space-y-5 justify-center flex flex-col mt-4">
            {attritionByDept.map((dept, i) => (
              <div key={dept.name}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-700">{dept.name}</span>
                  <span className="font-extrabold text-slate-900">{dept.rate}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${dept.rate * 3}%`, backgroundColor: attritionColors[i % attritionColors.length] }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Hires Table */}
      <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl shadow-sm flex flex-col overflow-hidden">
        <div className="border-b border-slate-100/50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-0.5">Recent Hires Onboarding</h2>
            <p className="text-xs text-slate-500">Tracking training progress for employees hired &lt;30 days</p>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search employees..." className="h-9 w-full sm:w-64 rounded-full border border-slate-200 bg-white pl-9 pr-4 text-xs shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
        </div>
        <div className="flex-1 p-2 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Employee</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Role & Location</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Start Date</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Onboarding Progress</th>
                <th className="px-5 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentHires.map((hire, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{hire.name}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-slate-800 text-xs">{hire.role}</p>
                    <p className="text-[10px] text-slate-500">{hire.store}</p>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500 font-medium">{hire.start}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden min-w-[100px]">
                        <div className={`h-full rounded-full ${hire.progress === 100 ? 'bg-emerald-500' : hire.progress < 50 ? 'bg-amber-500' : 'bg-indigo-500'}`} style={{ width: `${hire.progress}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600">{hire.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider rounded-full px-2.5 py-0.5 border ${
                      hire.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      hire.status === 'At Risk' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                      {hire.status}
                    </span>
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
