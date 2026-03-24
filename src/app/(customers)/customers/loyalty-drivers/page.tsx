"use client";

import { useCustomerFilters } from "@/lib/customerFilterContext";
import { getCustomerKpis, SHARED_TOP_CUSTOMERS } from "@/lib/customerDataEngine";
import { HeartHandshake, Crown, Sparkles, AlertTriangle, ArrowRight, Zap, RefreshCcw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell, PieChart, Pie, Legend } from "recharts";

const segmentColors = ["#8b5cf6", "#10b981", "#cbd5e1"];

export default function CustomerLoyaltyDriversPage() {
  const { filters } = useCustomerFilters();
  const kpis = getCustomerKpis(filters);

  const repeatByChannel = [
    { channel: "Dine-In", repeat: 5800 },
    { channel: "Takeaway", repeat: 2900 },
    { channel: "Third-Party", repeat: 1600 },
    { channel: "Drive-Thru", repeat: 984 },
  ]; // Sums roughly to 11,284

  const repeatSegmentSplit = [
    { name: "VIP", value: kpis.vipCount },
    { name: "Routine", value: kpis.routineCustomers },
    { name: "Unclassified", value: kpis.repeatCustomers - kpis.vipCount - kpis.routineCustomers },
  ];

  const topItemInfluence = [
    { item: "Classic Burger", repeatsGenerated: 3400 },
    { item: "Truffle Fries", repeatsGenerated: 2850 },
    { item: "Craft Cola", repeatsGenerated: 1900 },
    { item: "Spicy Chicken", repeatsGenerated: 1200 },
    { item: "Seasonal Salad", repeatsGenerated: 850 },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Loyalty Drivers & Triggers</h1>
        <p className="text-sm text-slate-500">Automated campaign tracking, VIP behavior, and item-based retention correlations.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Repeat Rate", val: kpis.repeatRatePct + "%", sub: "of active customers", icon: RefreshCcw, color: "text-indigo-900", bg: "bg-indigo-50/80 border-indigo-200/60" },
          { label: "VIP Repeat Rate", val: "94.2%", sub: "Insulated loyalty base", icon: Crown, color: "text-amber-900", bg: "bg-amber-50/80 border-amber-200/60" },
          { label: "Top Retention Item", val: "Burger", sub: "3.4k Repeats Linked", icon: HeartHandshake, color: "text-emerald-900", bg: "bg-emerald-50/80 border-emerald-200/60" },
          { label: "VIPs At-Risk", val: "142", sub: "Immediate Action Req.", icon: AlertTriangle, color: "text-rose-900", bg: "bg-rose-50/80 border-rose-200/60" },
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
        {/* Trigger Engine Card */}
        <div className="rounded-3xl border border-violet-200/60 bg-gradient-to-b from-violet-50 to-white backdrop-blur shadow-sm p-6 relative overflow-hidden flex flex-col justify-center">
          <Zap size={150} className="absolute -right-10 -bottom-10 text-violet-100 opacity-60" />
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={20} className="text-violet-600" />
            <h3 className="text-lg font-bold text-violet-900 tracking-tight">Active Trigger Engine</h3>
          </div>
          <p className="text-sm text-violet-700 mb-6 font-medium leading-relaxed">
            The Trigger Engine is currently managing <strong>4,200</strong> automated campaigns based on VIP purchase history. 
            Estimated recovered LTV is pacing at <strong>+$84k</strong> this month.
          </p>
          <div className="space-y-3 mb-6 relative z-10 w-full">
            <div className="bg-white/80 border border-violet-100 p-3 rounded-xl flex items-center justify-between shadow-sm">
              <span className="text-xs font-bold text-slate-700">VIP Win-back</span>
               <span className="text-xs font-extrabold text-emerald-600">Active</span>
            </div>
            <div className="bg-white/80 border border-violet-100 p-3 rounded-xl flex items-center justify-between shadow-sm">
              <span className="text-xs font-bold text-slate-700">Truffle Fries Upsell</span>
              <span className="text-xs font-extrabold text-emerald-600">Active</span>
            </div>
          </div>
          <button className="w-full mt-auto rounded-xl bg-violet-600 hover:bg-violet-700 transition-colors text-white py-3 text-xs font-bold shadow-md flex items-center justify-center gap-1.5 relative z-10">
            Manage Engine Rules <ArrowRight size={14} />
          </button>
        </div>

        {/* Top Item Influence Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex flex-col justify-center">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900">Top Item Influence (Menu Magnetism)</h2>
            <p className="text-xs text-slate-500">Number of exact customer repeats strongly correlated with an initial item purchase.</p>
          </div>
          <div className="flex-1 w-full relative min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topItemInfluence} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="item" type="category" tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} width={100} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v: any) => [Number(v).toLocaleString(), "Repeat Attributions"]} />
                <Bar dataKey="repeatsGenerated" radius={[0, 6, 6, 0]} barSize={28}>
                  {topItemInfluence.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#10b981" : "#8b5cf6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Charts Column */}
          <div className="space-y-6 flex flex-col">
            <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex-1 flex flex-col items-center">
              <div className="w-full text-left mb-2">
                <h2 className="text-sm font-bold text-slate-900">Repeat Base Split</h2>
                <p className="text-xs text-slate-500">Volume by segment tier.</p>
              </div>
              <div className="flex-1 w-full relative min-h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={repeatSegmentSplit} dataKey="value" nameKey="name" cx="50%" cy="40%" innerRadius={40} outerRadius={70} stroke="#fff" strokeWidth={2}>
                      {repeatSegmentSplit.map((_, i) => <Cell key={i} fill={segmentColors[i % segmentColors.length]} />)}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none" }} formatter={(v: any) => Number(v).toLocaleString()} />
                    <Legend layout="horizontal" align="center" verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 500 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex-1 flex flex-col">
              <div className="mb-4">
                <h2 className="text-sm font-bold text-slate-900">Repeat by Channel</h2>
                <p className="text-xs text-slate-500">Where are repeats happening?</p>
              </div>
              <div className="flex-1 w-full relative min-h-[160px]">
                 <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={repeatByChannel} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="channel" type="category" tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
                    <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} formatter={(v: any) => Number(v).toLocaleString()} />
                    <Bar dataKey="repeat" radius={[0, 4, 4, 0]} barSize={16} fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="xl:col-span-2 rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 mb-0.5">Top Repeat Transactors</h2>
                <p className="text-xs text-slate-500">Highest grossing returning profiles.</p>
              </div>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] uppercase font-bold px-2 py-1 rounded-full border border-indigo-200">Shared Data Engine</span>
            </div>
            <div className="overflow-x-auto p-2">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Customer ID</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Name</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-center">Status</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Cadence</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">LTV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {SHARED_TOP_CUSTOMERS.filter(c => c.status !== 'New').map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 text-xs font-medium text-slate-400">{c.id}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{c.name}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex py-1 px-2.5 rounded-md text-[9px] uppercase tracking-wider font-extrabold border ${
                          c.status === 'VIP' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          c.status === 'At-Risk' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          'bg-slate-50 text-slate-700 border-slate-200'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-xs font-medium text-indigo-500">{c.visitFreqStr} / mo</td>
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
