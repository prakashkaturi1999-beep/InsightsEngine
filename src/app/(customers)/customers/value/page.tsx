"use client";

import { useCustomerFilters } from "@/lib/customerFilterContext";
import { getCustomerKpis, SHARED_TOP_CUSTOMERS } from "@/lib/customerDataEngine";
import { DollarSign, Crown, ShoppingBag, Eye, HeartHandshake, MapPin, Target, ArrowRight } from "lucide-react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, ZAxis, BarChart, Bar, Cell, PieChart, Pie, Legend } from "recharts";

const segmentColors = ["#8b5cf6", "#10b981", "#3b82f6", "#f43f5e"];

export default function CustomerValuePage() {
  const { filters } = useCustomerFilters();
  const kpis = getCustomerKpis(filters);

  // Value Orbit Scatter Plot (Recency vs Frequency vs Spend bubble size)
  const orbitData = [
    { x: 2, y: 15, z: 4200, name: "VIP Heavy" },
    { x: 5, y: 12, z: 3800, name: "VIP" },
    { x: 1, y: 8, z: 2100, name: "Routine High Spend" },
    { x: 12, y: 4, z: 850, name: "Regular" },
    { x: 45, y: 2, z: 1200, name: "At-Risk Whale" },
    { x: 25, y: 6, z: 1600, name: "Slipping Regular" },
  ]; // x = Recency (days ago), y = Frequency (visits/yr), z = Spend (LTV)

  const spentByChannel = [
    { channel: "Dine-In", rev: 8400500 },
    { channel: "Delivery App", rev: 3200000 },
    { channel: "Takeaway", rev: 2100000 },
    { channel: "Drive-Thru", rev: 950000 },
  ];

  const revenueBySegment = [
    { name: "VIP", value: 45 },
    { name: "Routine", value: 35 },
    { name: "New", value: 10 },
    { name: "Slipping", value: 10 },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Value & LTV</h1>
        <p className="text-sm text-slate-500">Gross revenue generation, top-tier lifetime values, and VIP segmentation.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Avg LTV", val: `$${kpis.avgLtv.toFixed(2)}`, icon: ShoppingBag, color: "text-emerald-900", bg: "bg-emerald-50/80 border-emerald-200/60" },
          { label: "VIP Share %", val: kpis.vipSharePct + "%", icon: Crown, color: "text-amber-900", bg: "bg-amber-50/80 border-amber-200/60" },
          { label: "Active AOV", val: `$${kpis.activeAvgAov.toFixed(2)}`, icon: DollarSign, color: "text-blue-900", bg: "bg-blue-50/80 border-blue-200/60" },
          { label: "VIP Avg LTV", val: "$3,450", icon: Target, color: "text-indigo-900", bg: "bg-indigo-50/80 border-indigo-200/60" },
        ].map((kpi, i) => (
          <div key={i} className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm ${kpi.bg}`}>
            <div className="absolute -right-3 -top-3 opacity-5"><kpi.icon size={80} className={kpi.color} /></div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{kpi.label}</p>
            <p className={`text-3xl font-extrabold ${kpi.color}`}>{kpi.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Value Orbit */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex flex-col justify-center">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900">Value Orbit (RFM Clustering)</h2>
            <p className="text-xs text-slate-500">Recency (X-axis) vs Frequency (Y-axis) with Volume (Bubble Size).</p>
          </div>
          <div className="flex-1 w-full relative min-h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" dataKey="x" name="Recency (Days Ago)" reversed tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis type="number" dataKey="y" name="Frequency (Visits)" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <ZAxis type="number" dataKey="z" range={[100, 1000]} name="LTV" />
                <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} />
                <Scatter name="Segments" data={orbitData} fill="#8b5cf6" fillOpacity={0.6}>
                  {orbitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.x > 30 ? "#f43f5e" : entry.z > 3000 ? "#f59e0b" : "#8b5cf6"} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action + Revenue by Segment Pie */}
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-emerald-200/60 bg-emerald-50/50 backdrop-blur shadow-sm p-6 relative overflow-hidden">
            <HeartHandshake size={80} className="absolute -right-4 -bottom-4 text-emerald-100 opacity-50" />
            <h3 className="text-sm font-bold text-emerald-900 mb-2">High-Value Expansion</h3>
            <p className="text-xs text-emerald-700 mb-4 font-medium leading-relaxed">
              We found 240 Routine customers sitting $50 below the VIP threshold. Sending an exclusive tasting invite will push 40% into the VIP tier.
            </p>
            <button className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 transition-colors text-white py-2.5 text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 relative z-10">
              Upgrade Segment <ArrowRight size={14} />
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex-1 flex flex-col items-center">
            <div className="w-full text-left mb-2">
              <h2 className="text-sm font-bold text-slate-900">Revenue by Hub</h2>
              <p className="text-xs text-slate-500">VIP cohort dominates yield.</p>
            </div>
            <div className="flex-1 w-full relative min-h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={revenueBySegment} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} stroke="none" paddingAngle={2}>
                    {revenueBySegment.map((_, i) => <Cell key={i} fill={segmentColors[i % segmentColors.length]} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none" }} formatter={(v: any) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

       {/* Top Value / VIP Tables  */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 mb-0.5">The VIP List</h2>
                <p className="text-xs text-slate-500">Highest grossing shared profiles.</p>
              </div>
              <Crown className="text-amber-500" size={16} />
            </div>
            <div className="overflow-x-auto p-2">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Customer ID</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Cadence</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">LTV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {SHARED_TOP_CUSTOMERS.filter(c => c.status === 'VIP').map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{c.name}</div>
                        <div className="text-xs text-slate-400">{c.id}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-600">{c.visitFreqStr} / mo</td>
                      <td className="px-4 py-3 text-right font-extrabold text-emerald-600">${c.ltv.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-rose-200/60 bg-rose-50/30 backdrop-blur shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-rose-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-rose-900 mb-0.5">VIP At-Risk Watchlist</h2>
                <p className="text-xs text-rose-700/70">Top 5% accounts missing recent cycles.</p>
              </div>
              <Eye className="text-rose-500" size={16} />
            </div>
            <div className="overflow-x-auto p-2">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-rose-50">
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-rose-400 font-bold">Customer ID</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-rose-400 font-bold text-right">Last Visit</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-rose-400 font-bold text-right">Risk LTV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-50/50">
                  {SHARED_TOP_CUSTOMERS.filter(c => c.status === 'At-Risk').map((c) => (
                    <tr key={c.id} className="hover:bg-rose-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-rose-900">{c.name}</div>
                        <div className="text-xs text-rose-400/70">{c.id}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-rose-600">{c.lastVisitDaysAgo} Days Ago</td>
                      <td className="px-4 py-3 text-right font-extrabold text-slate-700">${c.ltv.toLocaleString()}</td>
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
