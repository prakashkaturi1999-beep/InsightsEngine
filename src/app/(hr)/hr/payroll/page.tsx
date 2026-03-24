"use client";

import { useHrFilters } from "@/lib/hrFilterContext";
import { getHrKpis } from "@/lib/hrDataEngine";
import { DollarSign, FileEdit, Banknote, Percent, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";

export default function PayrollPage() {
  const { filters } = useHrFilters();
  const kpis = getHrKpis(filters);

  const tipsTrend = [
    { period: "Week 1", cash: 2840, card: 7520 },
    { period: "Week 2", cash: 3105, card: 7890 },
    { period: "Week 3", cash: 2950, card: 7200 },
    { period: "Week 4 (MTD)", cash: 2860, card: 8165 },
  ]; // Total Cash (11755), Total Card (30775)

  const adjustments = [
    { type: "Missed Punches", count: 18 },
    { type: "Tip Alloc Edits", count: 12 },
    { type: "Rate Corrections", count: 5 },
    { type: "Bonus Processing", count: 3 },
  ];

  const actionQueue = [
    { id: "PAY-104", desc: "Correct missed punch for E. Watson", submitter: "Manager Downtown", status: "Open" },
    { id: "PAY-105", desc: "Retroactive merit increase S. Martinez", submitter: "HR Admin", status: "In Progress" },
    { id: "PAY-106", desc: "Tip pool allocation offset dispute", submitter: "Server Uptown", status: "Open" },
    { id: "PAY-102", desc: "Manager bonus payout verification", submitter: "Regional Director", status: "Closed" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payroll & Admin</h1>
        <p className="text-sm text-slate-500">Total tip reconciliation, adjustments volume, and payroll processing queue.</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Payroll Adjustments", val: kpis.payrollAdjFrequency, icon: FileEdit, color: "text-amber-900", bg: "bg-amber-50/80 border-amber-200/60" },
          { label: "Cost per Labor Hour", val: `$${kpis.payrollCostPerLaborHour}`, icon: DollarSign, color: "text-indigo-900", bg: "bg-indigo-50/80 border-indigo-200/60" },
          { label: "Total Tips Collected", val: `$${kpis.totalTipsCollected.toLocaleString()}`, icon: Banknote, color: "text-emerald-900", bg: "bg-emerald-50/80 border-emerald-200/60" },
          { label: "Tip Dist Variance", val: kpis.tipDistVariance + "%", icon: Percent, color: "text-rose-900", bg: "bg-rose-50/80 border-rose-200/60" },
        ].map((kpi, i) => (
          <div key={i} className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm ${kpi.bg}`}>
            <div className="absolute -right-3 -top-3 opacity-5"><kpi.icon size={80} className={kpi.color} /></div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{kpi.label}</p>
            <p className={`text-3xl font-extrabold ${kpi.color}`}>{kpi.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tip Collection Validation */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm flex flex-col">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900">Total Tips Collected Trend</h2>
            <p className="text-xs text-slate-500">Validation of Math: Total (${kpis.totalTipsCollected.toLocaleString()}) = Cash (${kpis.cashTips.toLocaleString()}) + Card (${kpis.cardTips.toLocaleString()})</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tipsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v: any) => `$${v.toLocaleString()}`} />
                <Legend wrapperStyle={{ fontSize: 11, fontWeight: 600, paddingTop: 10 }} iconType="circle" />
                <Bar dataKey="cash" name="Cash Tips" fill="#10b981" stackId="tips" radius={[0, 0, 4, 4]} barSize={40} />
                <Bar dataKey="card" name="Card Tips" fill="#6366f1" stackId="tips" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Adjustments Breakdown */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Payroll Adjustments Breakdown</h2>
          <p className="text-xs text-slate-500 mb-4">Volume of corrections applied to the current payroll run.</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adjustments} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} width={100} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} />
                <Bar dataKey="count" name="Frequency" radius={[0, 4, 4, 0]} barSize={24} fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Action Queue */}
      <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-0.5">Admin Action Queue</h2>
            <p className="text-xs text-slate-500">Tickets relating to payroll and tip pooling overrides.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Ticket ID</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Description</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Submitted By</th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {actionQueue.map((act) => (
                <tr key={act.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-900 text-xs">{act.id}</td>
                  <td className="px-5 py-4 text-xs font-semibold text-slate-700">{act.desc}</td>
                  <td className="px-5 py-4 text-xs text-slate-500">{act.submitter}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      act.status === 'Open' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      act.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {act.status === 'Open' ? <AlertCircle size={12} /> : act.status === 'In Progress' ? <Circle size={12} className="fill-amber-400" /> : <CheckCircle2 size={12} />}
                      {act.status}
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
