"use client";

import { useSupplyFilters } from "@/lib/supplyFilterContext";
import { getSupplyKpis, SHARED_INVENTORY_ITEMS } from "@/lib/supplyDataEngine";
import { Container, DollarSign, Database, ShieldCheck, ShieldAlert, ArrowDownRight, PackageMinus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, Cell, AreaChart, Area } from "recharts";

export default function CurrentInventoryPage() {
  const { filters } = useSupplyFilters();
  const kpis = getSupplyKpis(filters);

  // Health by category (Mocked for visual)
  const healthByCategory = [
    { category: "Meat", Healthy: 38000, Understock: 4200, Overstock: 2800 },
    { category: "Veg", Healthy: 7000, Understock: 2800, Overstock: 2200 },
    { category: "Bar", Healthy: 25000, Understock: 6500, Overstock: 2500 },
    { category: "Dry Goods", Healthy: 18000, Understock: 1200, Overstock: 1800 },
    { category: "Supplies", Healthy: 4300, Understock: 0, Overstock: 9100 }, // Heavily overstocked
  ];

  const daysOfCoverCat = [
    { category: "Meat", DOC: 12 },
    { category: "Veg", DOC: 3 },
    { category: "Bar", DOC: 18 },
    { category: "Dry Goods", DOC: 25 },
    { category: "Supplies", DOC: 60 },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Current Inventory Snapshot</h1>
          <p className="text-sm text-slate-500">Deep-dive into on-hand physical capital, calculating tied-up value vs operational health.</p>
        </div>
        <div className="flex gap-2">
          {["All Items", "Understocked", "Overstocked", "Healthy"].map(seg => (
            <button key={seg} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${seg === 'All Items' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
              {seg}
            </button>
          ))}
        </div>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
           { label: "On-Hand Units", val: `${kpis.currentUnits.toLocaleString()}`, sub: "Total physical count", icon: Container, color: "text-slate-900", bg: "bg-slate-50 border-slate-200" },
           { label: "Total Asset Value", val: `$${(kpis.currentValue/1000).toFixed(1)}k`, sub: "Capital frozen on-premises", icon: DollarSign, color: "text-emerald-900", bg: "bg-emerald-50/80 border-emerald-200/60" },
           { label: "SKUs Managed", val: `${kpis.totalItems}`, sub: "Active tracked catalog", icon: Database, color: "text-blue-900", bg: "bg-blue-50/80 border-blue-200/60" },
           { label: "Average DOC", val: `${kpis.daysOfCover}d`, sub: "Days of Cover", icon: ShieldCheck, color: "text-indigo-900", bg: "bg-indigo-50/80 border-indigo-200/60" },
           { label: "Inventory Health", val: `${kpis.healthScore}/100`, sub: "Based on 4-point model", icon: ShieldAlert, color: "text-amber-900", bg: "bg-amber-50/80 border-amber-200/60" }
        ].map((kpi, i) => (
          <div key={i} className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm ${kpi.bg}`}>
            <div className="absolute -right-3 -top-3 opacity-5"><kpi.icon size={80} className={kpi.color} /></div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{kpi.label}</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-3xl font-extrabold ${kpi.color}`}>{kpi.val}</p>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Tier */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Value Health Stacked Bar */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Inventory Value Health by Category</h2>
          <p className="text-xs text-slate-500 mb-6">Cross-section of capital efficiency ($).</p>
          <div className="flex-1 w-full min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={healthByCategory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
                <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v: any) => `$${Number(v).toLocaleString()}`} cursor={{ fill: 'transparent' }} />
                <Legend wrapperStyle={{ fontSize: 11, fontWeight: 500, paddingTop: 10 }} iconType="circle" />
                <Bar dataKey="Healthy" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} barSize={32} />
                <Bar dataKey="Understock" stackId="a" fill="#f43f5e" barSize={32} />
                <Bar dataKey="Overstock" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Days of Cover by Category */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex flex-col">
           <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900">Average Days of Cover by Category</h2>
            <p className="text-xs text-slate-500">Length of operational runway per segment.</p>
          </div>
          <div className="flex-1 w-full relative min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daysOfCoverCat} layout="vertical" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} formatter={(v: any) => `${Number(v)} Days`} />
                <Bar dataKey="DOC" name="Days Cover" radius={[0, 4, 4, 0]} barSize={24}  fill="#3b82f6">
                    {daysOfCoverCat.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.DOC > 30 ? "#f59e0b" : entry.DOC < 5 ? "#f43f5e" : "#3b82f6"} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Value Contribution List */}
      <div className="rounded-3xl border border-slate-200/60 bg-white shadow-sm overflow-hidden flex flex-col mt-6">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-0.5">Top Items by Value Contribution</h2>
            <p className="text-xs text-slate-500">Items tying up the most capital vs operational utility.</p>
          </div>
        </div>
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Item Name</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Category</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Physical Units</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Held Value ($)</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {SHARED_INVENTORY_ITEMS.sort((a,b) => b.onHandValue - a.onHandValue).map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                     <td className="px-4 py-3 font-bold text-slate-900">{item.name}</td>
                     <td className="px-4 py-3 text-xs text-slate-500">{item.category}</td>
                     <td className="px-4 py-3 text-right text-slate-600">{item.onHand}u</td>
                     <td className="px-4 py-3 text-right font-bold text-slate-900">${item.onHandValue.toLocaleString()}</td>
                     <td className="px-4 py-3 text-right">
                        <span className={`inline-flex py-1 px-2.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold border ${
                           item.status === 'Stockout Risk' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                           item.status === 'Overstock' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                           item.status === 'Low Cover' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                           'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                           {item.status}
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
