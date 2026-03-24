"use client";

import { useSupplyFilters } from "@/lib/supplyFilterContext";
import { getSupplyKpis, SHARED_INVENTORY_ITEMS } from "@/lib/supplyDataEngine";
import { Activity, LayoutDashboard, ShieldCheck, Flame, Layers } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, Cell, AreaChart, Area, PieChart, Pie } from "recharts";

export default function InventoryHealthPage() {
  const { filters } = useSupplyFilters();
  const kpis = getSupplyKpis(filters);

  // Invariant validation checks out:
  // totalValueHealth (125400) = understockValue (26000) + healthyStockValue (81000) + overstockRiskValue (18400)
  const healthDistribution = [
    { name: "Healthy Stock", value: 81000, color: "#10b981" },
    { name: "Understock (Risk)", value: 26000, color: "#f43f5e" },
    { name: "Overstock (Frozen)", value: 18400, color: "#3b82f6" },
  ];

  const categoryHealthBar = [
    { category: "Meat", healthy: 82, under: 14, over: 4 },
    { category: "Veg", healthy: 55, under: 35, over: 10 },
    { category: "Bar", healthy: 71, under: 19, over: 10 },
    { category: "Dry Goods", healthy: 85, under: 5, over: 10 },
    { category: "Supplies", healthy: 32, under: 0, over: 68 }, // Heavy overstock
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory Health & Coverage</h1>
          <p className="text-sm text-slate-500">Macro-level composite scorings based on Coverage, Overstock constraints, Stockout probability, and Aging.</p>
        </div>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
           { label: "Inventory Health Score", val: `${kpis.healthScore}/100`, sub: "Multi-Factor Assessment", icon: Activity, color: "text-slate-900", bg: "bg-slate-50 border-slate-200" },
           { label: "Total Target Value", val: `$${(kpis.totalValueHealth/1000).toFixed(1)}k`, sub: "100% of Physical Asset Map", icon: LayoutDashboard, color: "text-indigo-900", bg: "bg-indigo-50/80 border-indigo-200/60" },
           { label: "Healthy Core Value", val: `$${(kpis.healthyStockValue/1000).toFixed(1)}k`, sub: "64.6% Optimal Density", icon: ShieldCheck, color: "text-emerald-900", bg: "bg-emerald-50/80 border-emerald-200/60" },
           { label: "Risk Penalty Impact", val: `-$${((kpis.understockValue + kpis.overstockRiskValue)/1000).toFixed(1)}k`, sub: "Dragging score down", icon: Flame, color: "text-rose-900", bg: "bg-rose-50/80 border-rose-200/60" }
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

       {/* Sub-Score Breakdown */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-4 shadow-sm flex items-center justify-between">
             <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">Coverage Score</span>
                <p className="text-xl font-black text-emerald-900">88/100</p>
             </div>
          </div>
          <div className="rounded-2xl border border-blue-200/60 bg-blue-50/40 p-4 shadow-sm flex items-center justify-between">
             <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-1">Overstock Efficiency</span>
                <p className="text-xl font-black text-blue-900">65/100</p>
             </div>
          </div>
          <div className="rounded-2xl border border-rose-200/60 bg-rose-50/40 p-4 shadow-sm flex items-center justify-between">
             <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block mb-1">Stockout Deflection</span>
                <p className="text-xl font-black text-rose-900">54/100</p>
             </div>
          </div>
          <div className="rounded-2xl border border-amber-200/60 bg-amber-50/40 p-4 shadow-sm flex items-center justify-between">
             <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block mb-1">Aging & Spoilage Matrix</span>
                <p className="text-xl font-black text-amber-900">82/100</p>
             </div>
          </div>
       </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Value Health Donut Breakdown */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex flex-col justify-center">
             <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-900">Inventory Status Split</h2>
              <p className="text-xs text-slate-500">Macro balance of total mathematical volume.</p>
            </div>
            <div className="flex-1 w-full relative min-h-[220px]">
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 pt-4">
                <span className="text-3xl font-black text-slate-800">${(kpis.totalValueHealth/1000).toFixed(1)}k</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Basis</span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={healthDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={90} stroke="#fff" strokeWidth={2}>
                    {healthDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} formatter={(v: any) => `$${Number(v).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
             <div className="mt-4 flex flex-col gap-2">
                 {healthDistribution.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></div>{cat.name}</div>
                        <span className="text-slate-900">${cat.value.toLocaleString()}</span>
                    </div>
                 ))}
             </div>
        </div>

        {/* Health By Category Breakdown Bar */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Percentage Status Split by Category</h2>
          <p className="text-xs text-slate-500 mb-6">Normalized 100% basis stacked chart isolating category-specific inefficiencies.</p>
          <div className="flex-1 w-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryHealthBar} layout="vertical" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} formatter={(v: any) => `${v}%`} />
                <Legend wrapperStyle={{ fontSize: 11, fontWeight: 500, paddingTop: 10 }} iconType="circle" />
                <Bar dataKey="healthy" stackId="a" name="Healthy Target" radius={[0, 0, 0, 0]} barSize={24}  fill="#10b981" />
                <Bar dataKey="under" stackId="a" name="Understock Deficit" radius={[0, 0, 0, 0]} barSize={24}  fill="#f43f5e" />
                <Bar dataKey="over" stackId="a" name="Overstock Frozen" radius={[0, 4, 4, 0]} barSize={24}  fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

       {/* Priority Action Queue */}
       <div className="rounded-3xl border border-slate-200/60 bg-white shadow-sm overflow-hidden flex flex-col mt-6">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-0.5">Problem Items Driving Score Down</h2>
            <p className="text-xs text-slate-500">Highest priority fixes based on algorithmic health detriment.</p>
          </div>
        </div>
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Item Name</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Risk Vector</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Score Penalty</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-center">AI Optimization Suggestion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {SHARED_INVENTORY_ITEMS.filter(i => i.status !== "Healthy").map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                     <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2">
                        <Layers size={14} className="text-slate-400" /> {item.name}
                     </td>
                     <td className="px-4 py-3 text-right text-xs font-bold text-slate-600">{item.status}</td>
                     <td className="px-4 py-3 text-right font-black text-rose-600">
                        {item.status === 'Stockout Risk' ? '-4.2 pts' : item.status === 'Overstock' ? '-1.8 pts' : '-0.5 pts'}
                     </td>
                     <td className="px-4 py-3 text-center">
                        <span className="text-[10px] font-bold text-slate-500 max-w-[200px] truncate block mx-auto">
                           {item.status === 'Stockout Risk' ? `Execute P.O. for ${item.reorderRec || 50} units` : 'Pause associated auto-orders for 30d'}
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
