"use client";

import { useHrFilters } from "@/lib/hrFilterContext";
import { getHrKpis } from "@/lib/hrDataEngine";
import { ShieldAlert, AlertTriangle, Scale, Percent, FileWarning, Fingerprint, ChevronRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const riskColors = ["#ef4444", "#f59e0b", "#6366f1", "#10b981"];

export default function CompliancePage() {
  const { filters } = useHrFilters();
  const kpis = getHrKpis(filters);

  const riskTrend = [
    { week: "W1", score: 62 },
    { week: "W2", score: 64 },
    { week: "W3", score: 68 },
    { week: "W4", score: 72 },
  ];

  const riskDrivers = [
    { name: "Missed Breaks", value: 45 },
    { name: "OT Non-Approval", value: 30 },
    { name: "Min Wage Tip Credit", value: 15 },
    { name: "Minor Work Hr Violations", value: 10 },
  ];

  const heatmapData = [
    { name: "FOH - Lunch", val: 82 },
    { name: "BOH - Lunch", val: 65 }, // High risk area
    { name: "FOH - Dinner", val: 94 },
    { name: "BOH - Dinner", val: 86 },
  ];

  const actionQueue = [
    { title: "Minor Work Hours Violation", desc: "Host clocked out 15m late past 10PM cutoff", severity: "High", store: "Downtown (001)" },
    { title: "Break Not Taken - Overtime", desc: "Cook worked 8.5hrs without meal break", severity: "Critical", store: "Westside (003)" },
    { title: "Tip Pool Discrepancy", desc: "Server tips math allocation error detected in POS shift close", severity: "High", store: "Uptown (002)" },
    { title: "Unapproved OT Penalty", desc: "No manager override provided for 3 shifts", severity: "Medium", store: "Downtown (001)" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Compliance & Risk</h1>
        <p className="text-sm text-slate-500">Labor law adherence, tip pooling math accuracy, and meal break compliance.</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Compliance Risk Score", val: `${kpis.complianceRiskScore} / 100`, icon: ShieldAlert, color: "text-amber-900", bg: "bg-amber-50/80 border-amber-200/60", subtitle: "Medium Risk" },
          { label: "Break Compliance Rate", val: kpis.breakComplianceRate + "%", icon: Percent, color: kpis.breakComplianceRate < 90 ? "text-rose-900" : "text-emerald-900", bg: kpis.breakComplianceRate < 90 ? "bg-rose-50/80 border-rose-200/60" : "bg-emerald-50/80 border-emerald-200/60", subtitle: "Target: 95%" },
          { label: "Overtime Violations", val: kpis.overtimeViolations, icon: AlertTriangle, color: "text-rose-900", bg: "bg-rose-50/80 border-rose-200/60", subtitle: "Unapproved OT" },
          { label: "Tip Pool Accuracy", val: kpis.tipPoolAllocAccuracy + "%", icon: Scale, color: "text-indigo-900", bg: "bg-indigo-50/80 border-indigo-200/60", subtitle: "System vs Payout Math" },
        ].map((kpi, i) => (
          <div key={i} className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm ${kpi.bg}`}>
            <div className="absolute -right-3 -top-3 opacity-5"><kpi.icon size={80} className={kpi.color} /></div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{kpi.label}</p>
            <p className={`text-3xl font-extrabold ${kpi.color} mb-1`}>{kpi.val}</p>
            <p className="text-[10px] font-bold text-slate-600 px-2 py-0.5 rounded border border-slate-200 bg-white/50 w-max">{kpi.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Trend Chart */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Risk Score Trend</h2>
          <p className="text-xs text-slate-500 mb-4">Higher score = higher compliance liability risk.</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} />
                <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5, fill: "#f59e0b", strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Driver Mix Donut */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm flex flex-col items-center">
          <div className="w-full text-left mb-2">
            <h2 className="text-sm font-bold text-slate-900">Risk Driver Mix</h2>
            <p className="text-xs text-slate-500">Root causes pushing up the score MTD.</p>
          </div>
          <div className="flex-1 w-full relative min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskDrivers} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} stroke="none">
                  {riskDrivers.map((_, i) => <Cell key={i} fill={riskColors[i % riskColors.length]} />)}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 500, paddingTop: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Break Compliance Hotspots */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Break Compliance Hotspots</h2>
          <p className="text-xs text-slate-500 mb-4">Meal & rest break adherence by department zone.</p>
          <div className="flex-1 flex flex-col justify-center space-y-4">
            {heatmapData.map((d, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-700">{d.name}</span>
                  <span className={`text-xs font-extrabold ${d.val < 80 ? 'text-rose-600' : 'text-emerald-600'}`}>{d.val}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${d.val < 80 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${d.val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Queue Alert Cards */}
      <div className="rounded-3xl border border-rose-200/60 bg-rose-50/30 backdrop-blur-xl shadow-sm flex flex-col overflow-hidden">
        <div className="border-b border-rose-200/50 p-5 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
            <FileWarning size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-rose-900 mb-0.5">Urgent Compliance Alerts Queue</h2>
            <p className="text-xs text-rose-700">Manager review required to mitigate active labor law liabilities.</p>
          </div>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {actionQueue.map((act, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-2xl border bg-white border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
              <div className="mt-0.5">
                <Fingerprint size={20} className={act.severity === 'Critical' ? 'text-rose-500' : act.severity === 'High' ? 'text-orange-500' : 'text-amber-500'} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <span className={`text-[9px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full mb-2 ${act.severity === 'Critical' ? 'bg-rose-100 text-rose-800' : act.severity === 'High' ? 'bg-orange-100 text-orange-800' : 'bg-amber-100 text-amber-800'}`}>
                    {act.severity}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">{act.store}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{act.title}</h3>
                <p className="text-xs font-medium text-slate-500 mt-1 line-clamp-2">{act.desc}</p>
              </div>
              <div className="flex flex-col justify-center">
                <ChevronRight size={18} className="text-slate-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
