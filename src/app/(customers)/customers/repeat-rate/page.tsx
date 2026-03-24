"use client";

import { useCustomerFilters } from "@/lib/customerFilterContext";
import { getCustomerKpis, SHARED_TOP_CUSTOMERS } from "@/lib/customerDataEngine";
import { Repeat, AlertTriangle, ShieldAlert, HeartHandshake, Skull, Crown, ChevronRight, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip as RechartsTooltip, Cell, PieChart, Pie } from "recharts";

const pieColors = ["#f59e0b", "#10b981", "#3b82f6", "#ef4444"];

export default function CustomerRepeatRiskPage() {
  const { filters } = useCustomerFilters();
  const kpis = getCustomerKpis(filters);

  // Drop-off by inactivity duration
  const churnCliffData = [
    { days: "15 Days", customers: 4500 },
    { days: "30 Days", customers: 3100 },
    { days: "45 Days (Risk)", customers: 1456 },
    { days: "60 Days (Churn)", customers: 850 },
    { days: "90+ Days", customers: 410 },
  ];

  const atRiskByChannel = [
    { channel: "Third-Party", riskCount: 852 },
    { channel: "Takeaway", riskCount: 340 },
    { channel: "Drive-Thru", riskCount: 160 },
    { channel: "Dine-In", riskCount: 104 },
  ];

  // Segment Split: VIP vs Regular vs New vs At-Risk
  const segmentSplit = [
    { name: "VIP", value: kpis.vipCount },
    { name: "Routine", value: kpis.routineCustomers },
    { name: "New", value: kpis.newCustomers },
    { name: "At-Risk", value: kpis.atRiskCustomers },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Repeat Rate & Retention Risk</h1>
        <p className="text-sm text-slate-500">Tracking returning customers against inactivity cliffs to prevent churn.</p>
      </div>

      {/* Top 4 Impact KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Repeat Customers", val: kpis.repeatCustomers.toLocaleString(), sub: `Rate: ${kpis.repeatRatePct}%`, icon: Repeat, color: "text-indigo-900", bg: "bg-indigo-50/80 border-indigo-200/60" },
          { label: "At-Risk Customers", val: kpis.atRiskCustomers.toLocaleString(), sub: `${kpis.atRiskPct}% of Active`, icon: AlertTriangle, color: "text-rose-900", bg: "bg-rose-50/80 border-rose-200/60" },
          { label: "VIP Count", val: kpis.vipCount.toLocaleString(), sub: `Share: ${kpis.vipSharePct}%`, icon: Crown, color: "text-amber-900", bg: "bg-amber-50/80 border-amber-200/60" },
          { label: "Avg LTV", val: `$${kpis.avgLtv.toFixed(2)}`, sub: `Avg Spend: $${kpis.activeAvgAov.toFixed(2)}`, icon: HeartHandshake, color: "text-emerald-900", bg: "bg-emerald-50/80 border-emerald-200/60" },
        ].map((kpi, i) => (
          <div key={i} className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm ${kpi.bg} group`}>
            <div className="absolute -right-3 -top-3 opacity-5 transition-transform group-hover:scale-110"><kpi.icon size={80} className={kpi.color} /></div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{kpi.label}</p>
            <p className={`text-3xl font-extrabold ${kpi.color}`}>{kpi.val}</p>
            <div className="mt-2 inline-block bg-white/50 px-2 py-0.5 rounded text-[10px] font-bold text-slate-600 border border-slate-200/50">
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Churn Cliff Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex flex-col justify-center">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900">The Churn Cliff (Inactivity Duration)</h2>
            <p className="text-xs text-slate-500">Visualizing the drop-off funnel as days since last visit increases.</p>
          </div>
          <div className="flex-1 w-full relative min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={churnCliffData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="days" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v: any) => [Number(v).toLocaleString(), "Customers"]} />
                <Bar dataKey="customers" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {churnCliffData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.days.includes('Risk') ? "#f43f5e" : entry.days.includes('Churn') ? "#9f1239" : "#94a3b8"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Segment Split Pie Chart */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex flex-col items-center">
          <div className="w-full text-left mb-2">
            <h2 className="text-sm font-bold text-slate-900">Segment Split</h2>
            <p className="text-xs text-slate-500">Active distribution by tier.</p>
          </div>
          <div className="flex-1 w-full relative min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={segmentSplit} dataKey="value" nameKey="name" cx="50%" cy="45%" innerRadius={60} outerRadius={85} stroke="#fff" strokeWidth={2}>
                  {segmentSplit.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v: any) => Number(v).toLocaleString()} />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 500, paddingTop: 10 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-4">
              <span className="text-2xl font-bold text-slate-800 tracking-tight">{kpis.activeCustomers.toLocaleString()}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* At Risk By Channel Bar Graph */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur shadow-sm p-6 flex flex-col">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900">At-Risk by Channel</h2>
            <p className="text-xs text-slate-500">3rd-party delivery drives highest risk.</p>
          </div>
          <div className="flex-1 w-full relative min-h-[200px]">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={atRiskByChannel} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="channel" type="category" tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v: any) => Number(v).toLocaleString()} />
                <Bar dataKey="riskCount" radius={[0, 4, 4, 0]} barSize={24} fill="#f43f5e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Churn Risk Table */}
        <div className="xl:col-span-2 rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50/50 to-white">
            <div className="flex items-center gap-3">
              <ShieldAlert className="text-rose-500" size={20} />
              <div>
                <h2 className="text-sm font-bold text-rose-900 mb-0.5">High-Value Churn Risk Log</h2>
                <p className="text-[11px] text-rose-700/70">Top LTV customers severely past their standard visit pattern.</p>
              </div>
            </div>
            <button className="flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-100/50 hover:bg-rose-100 px-3 py-1.5 rounded-full transition-colors">
              Send Mass Reactivation <ChevronRight size={12} />
            </button>
          </div>
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Customer ID</th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Name</th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Last Seen</th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Lifetime Value</th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Expected Loss</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {SHARED_TOP_CUSTOMERS.filter(c => c.status === 'At-Risk').sort((a,b) => b.ltv - a.ltv).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-xs font-medium text-slate-400 flex items-center gap-2">
                      <Activity size={12} className="text-rose-400" /> {c.id}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">{c.name}</td>
                    <td className="px-4 py-3 text-right font-bold text-rose-600">
                      {c.lastVisitDaysAgo} Days Ago
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-600">${c.ltv.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-rose-700 font-extrabold flex items-center justify-end gap-1">
                      <Skull size={12} className="opacity-70" /> ${c.avgSpent.toFixed(2)}/mo
                    </td>
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
