"use client";

import { useCustomerFilters } from "@/lib/customerFilterContext";
import { getCustomerKpis, SHARED_TOP_CUSTOMERS } from "@/lib/customerDataEngine";
import { MapPin, Store, Smartphone, Shuffle, ChevronRight, Magnet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell, LineChart, Line, PieChart, Pie, Legend } from "recharts";

const pieColors = ["#ec4899", "#ef4444", "#3b82f6"];

export default function CustomerChannelLocationPage() {
  const { filters } = useCustomerFilters();
  const kpis = getCustomerKpis(filters);

  const customersByChannel = [
    { channel: "Dine-In", count: 8200 },
    { channel: "Takeaway", count: 5400 },
    { channel: "Third-Party", count: 3100 },
    { channel: "Drive-Thru", count: 1500 },
  ];

  const customersByLocation = [
    { name: "Downtown (001)", value: 45 },
    { name: "Uptown (002)", value: 35 },
    { name: "Westside (003)", value: 20 },
  ];

  const multiChannelBehaviorTrend = [
    { month: "W-3", multiChannel: 2100, singleChannel: 14400 },
    { month: "W-2", multiChannel: 2300, singleChannel: 14600 },
    { month: "W-1", multiChannel: 2550, singleChannel: 14850 },
    { month: "Current", multiChannel: 2700, singleChannel: 15500 },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Channel & Location</h1>
        <p className="text-sm text-slate-500">Cross-channel engagement, direct-ordering migrations, and store crossover.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Top Channel", val: "Dine-In", sub: "45% Share", icon: Store, color: "text-blue-900", bg: "bg-blue-50/80 border-blue-200/60" },
          { label: "Top Location", val: "Downtown", sub: "45% of Users", icon: MapPin, color: "text-indigo-900", bg: "bg-indigo-50/80 border-indigo-200/60" },
          { label: "Multi-Channel Users", val: kpis.multiChannelCustomers.toLocaleString(), sub: `${kpis.multiChannelPct}% Penetration`, icon: Smartphone, color: "text-emerald-900", bg: "bg-emerald-50/80 border-emerald-200/60" },
          { label: "Cross-Store Users", val: kpis.crossStoreCustomers.toLocaleString(), sub: "Visiting 2+ sites", icon: Shuffle, color: "text-amber-900", bg: "bg-amber-50/80 border-amber-200/60" },
        ].map((kpi, i) => (
          <div key={i} className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm ${kpi.bg}`}>
            <div className="absolute -right-3 -top-3 opacity-5"><kpi.icon size={80} className={kpi.color} /></div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{kpi.label}</p>
            <p className={`text-3xl font-extrabold ${kpi.color} mb-1.5`}>{kpi.val}</p>
            <div className="inline-block bg-white/50 px-2 py-0.5 rounded text-[10px] font-bold text-slate-600 border border-slate-200/50">
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Multi-Channel Behavior Trend */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex-1 flex flex-col lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900">Platform Penetration Trend</h2>
            <p className="text-xs text-slate-500">Tracking migration from Single-Channel (mostly 3rd-party) to Multi-Channel native.</p>
          </div>
          <div className="flex-1 w-full relative min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={multiChannelBehaviorTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} dy={10} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
                <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11, fontWeight: 500, paddingTop: 10 }} iconType="circle" />
                <Line yAxisId="left" type="monotone" dataKey="multiChannel" name="Multi-Channel Users" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 0 }} />
                <Line yAxisId="right" type="monotone" dataKey="singleChannel" name="Single-Channel Only" stroke="#cbd5e1" strokeWidth={3} dot={{ r: 4, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Migration Opportunities Card */}
        <div className="rounded-3xl border border-amber-200/60 bg-amber-50/50 backdrop-blur shadow-sm p-6 relative overflow-hidden flex flex-col justify-center">
          <Magnet size={120} className="absolute -right-6 -bottom-6 text-amber-100 opacity-50" />
          <h3 className="text-sm font-bold text-amber-900 mb-2">3rd-Party App Migration</h3>
          <p className="text-xs text-amber-700 mb-4 font-medium leading-relaxed">
            We've identified 3,100 customers exclusively using high-commission Third-Party delivery apps. 
            Deploying a "Free Delivery on Native App" campaign can capture $12k in margin savings this week.
          </p>
          <button className="w-full mt-auto rounded-xl bg-amber-500 hover:bg-amber-600 transition-colors text-white py-2.5 text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 relative z-10">
            Export Migration Target List <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Charts Column */}
        <div className="space-y-6 flex flex-col">
          <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex-1 flex flex-col items-center">
            <div className="w-full text-left mb-2">
              <h2 className="text-sm font-bold text-slate-900">Customers by Location</h2>
              <p className="text-xs text-slate-500">Where are accounts localized.</p>
            </div>
            <div className="flex-1 w-full relative min-h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={customersByLocation} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} stroke="none" paddingAngle={2}>
                    {customersByLocation.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none" }} formatter={(v: any) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex-1 flex flex-col">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-900">Customers by Channel</h2>
              <p className="text-xs text-slate-500">Primary interaction point.</p>
            </div>
            <div className="flex-1 w-full relative min-h-[160px]">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customersByChannel} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="channel" type="category" tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
                  <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} formatter={(v: any) => Number(v).toLocaleString()} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20} fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Opportunity Table */}
        <div className="xl:col-span-2 rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-0.5">Cross-Boundary Users</h2>
              <p className="text-xs text-slate-500">VIPs that transact at multiple store locations or channels.</p>
            </div>
          </div>
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Customer</th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Primary Store</th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-center">Channels Used</th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">LTV</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {SHARED_TOP_CUSTOMERS.filter(c => c.status === 'VIP').map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{c.name}</div>
                      <div className="text-xs text-slate-400 font-medium">{c.id}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{c.store}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex py-1 px-2.5 rounded-md text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                        {Math.floor(Math.random() * 2) + 2} Platforms
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-extrabold text-emerald-600">${c.ltv.toLocaleString()}</td>
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
