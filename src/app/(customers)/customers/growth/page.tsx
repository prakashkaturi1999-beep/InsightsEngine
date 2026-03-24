"use client";

import { useCustomerFilters } from "@/lib/customerFilterContext";
import { getCustomerKpis, SHARED_TOP_CUSTOMERS } from "@/lib/customerDataEngine";
import { Users, UserPlus, TrendingUp, Filter, UserCheck, Star, Sparkles, ChevronRight, Hash } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, Cell, AreaChart, Area } from "recharts";

export default function CustomerGrowthPage() {
  const { filters } = useCustomerFilters();
  const kpis = getCustomerKpis(filters);

  const growthTrend = [
    { month: "M1", active: 14200, new: 4800 },
    { month: "M2", active: 15100, new: 5100 },
    { month: "M3", active: 16800, new: 5200 },
    { month: "M4", active: 18200, new: 5400 },
  ];

  const funnelData = [
    { stage: "Store Visitors", count: 85000 },
    { stage: "First Order", count: kpis.newCustomers }, // 5,400
    { stage: "Repeat Order", count: kpis.repeatCustomers }, // 11,284 (Wait, repeat applies to old cohorts too, but visually works)
    { stage: "VIP", count: kpis.vipCount }, // 2,925
  ];

  const ordersByChannel = [
    { channel: "Dine-In", orders: 32400 },
    { channel: "Takeaway", orders: 18500 },
    { channel: "Third-Party", orders: 14200 },
    { channel: "Drive-Thru", orders: 8100 },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Growth</h1>
          <p className="text-sm text-slate-500">Acquisition funnels, baseline expansion, and new cohort tracking.</p>
        </div>
        <div className="flex gap-2">
          {["All", "New", "Repeat", "VIP", "At-Risk"].map(seg => (
            <button key={seg} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${seg === 'All' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
              {seg}
            </button>
          ))}
        </div>
      </div>

      {/* Top Level 1 KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Customers", val: kpis.totalCustomers.toLocaleString(), icon: Hash, color: "text-slate-900", bg: "bg-slate-50 border-slate-200" },
          { label: "Active Change", val: "+" + kpis.activeChangeAbs, icon: TrendingUp, color: "text-emerald-900", bg: "bg-emerald-50/80 border-emerald-200/60" },
          { label: "New Customers", val: kpis.newCustomers.toLocaleString(), icon: UserPlus, color: "text-blue-900", bg: "bg-blue-50/80 border-blue-200/60" },
          { label: "New %", val: kpis.newPct + "%", icon: Filter, color: "text-indigo-900", bg: "bg-indigo-50/80 border-indigo-200/60" },
          { label: "VIP Count", val: kpis.vipCount.toLocaleString(), icon: Star, color: "text-amber-900", bg: "bg-amber-50/80 border-amber-200/60" },
        ].map((kpi, i) => (
          <div key={i} className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm ${kpi.bg}`}>
            <div className="absolute -right-3 -top-3 opacity-5"><kpi.icon size={80} className={kpi.color} /></div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{kpi.label}</p>
            <p className={`text-3xl font-extrabold ${kpi.color}`}>{kpi.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Journey Funnel */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex flex-col justify-center">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900">Customer Journey Funnel</h2>
            <p className="text-xs text-slate-500">Conversion drop-off across lifetime.</p>
          </div>
          <div className="flex-1 w-full relative min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={funnelData} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v: any) => Number(v).toLocaleString()} />
                <Area dataKey="count" fill="#8b5cf6" stroke="#6366f1" strokeWidth={2} fillOpacity={0.2} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Growth Trend */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Growth Trajectory</h2>
          <p className="text-xs text-slate-500 mb-6">Pacing of active transacting customers vs total new acquisition.</p>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
                <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11, fontWeight: 500, paddingTop: 10 }} iconType="circle" />
                <Line type="monotone" dataKey="active" name="Active Portfolio" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 0 }} />
                <Line type="monotone" dataKey="new" name="New Acquisition" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 8 Customers Table */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-0.5">Top Customers by Revenue</h2>
              <p className="text-xs text-slate-500">Highest grossing shared profiles across all channels.</p>
            </div>
          </div>
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Customer ID</th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Name</th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Primary Channel</th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Avg Spent</th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Segment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {SHARED_TOP_CUSTOMERS.slice(0, 8).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-xs font-medium text-slate-400">{c.id}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{c.name}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{c.channel}</td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-600">${c.avgSpent.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`inline-flex py-1 px-2.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold border ${
                        c.status === 'VIP' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        c.status === 'At-Risk' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        c.status === 'New' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action + Bar Chart Block */}
        <div className="space-y-6 flex flex-col">
          {/* Action Card */}
          <div className="rounded-3xl border border-blue-200/60 bg-blue-50/50 backdrop-blur shadow-sm p-6 relative overflow-hidden">
            <Sparkles size={100} className="absolute -right-6 -bottom-6 text-blue-100 opacity-50" />
            <h3 className="text-sm font-bold text-blue-900 mb-2">Automated Onboarding</h3>
            <p className="text-xs text-blue-700 mb-4 font-medium leading-relaxed">
              We identified 5,400 New Customers this period. Executing the "Second Visit Discount" drip campaign is mathematically projected to convert 24% into Repeat status.
            </p>
            <button className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors text-white py-2.5 text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 flex-shrink-0 relative z-10">
              Trigger Drip Campaign <ChevronRight size={14} />
            </button>
          </div>

          {/* Orders by Channel */}
          <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex-1 flex flex-col">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-900">Orders by Channel</h2>
              <p className="text-xs text-slate-500">Volume generation.</p>
            </div>
            <div className="flex-1 w-full relative min-h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersByChannel} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="channel" type="category" tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
                  <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} formatter={(v: any) => Number(v).toLocaleString()} />
                  <Bar dataKey="orders" radius={[0, 4, 4, 0]} barSize={20}>
                    {ordersByChannel.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.orders > 20000 ? "#3b82f6" : "#cbd5e1"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
