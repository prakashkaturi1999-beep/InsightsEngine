"use client";

import { useSupplyFilters } from "@/lib/supplyFilterContext";
import { getSupplyKpis, CATEGORY_CONSUMPTION_TODAY, SHARED_INVENTORY_ITEMS } from "@/lib/supplyDataEngine";
import { PieChart as PieChartIcon, Zap, ShieldAlert, BadgeMinus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, Cell, PieChart, Pie } from "recharts";

export default function CategoryPerformancePage() {
  const { filters } = useSupplyFilters();
  const kpis = getSupplyKpis(filters);

  const categoryValueData = [
    { category: "Meat", value: 45000, risk: 4200 },
    { category: "Veg", value: 12000, risk: 2800 },
    { category: "Bar", value: 34000, risk: 6500 },
    { category: "Dry Goods", value: 21000, risk: 1200 },
    { category: "Supplies", value: 13400, risk: 800 },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Category Performance</h1>
          <p className="text-sm text-slate-500">Sub-portfolio velocity, coverage efficiency, and category-level risk exposure.</p>
        </div>
        <div className="flex gap-2">
          {["All Categories", "High Velocity", "High Risk", "Inefficient"].map(seg => (
            <button key={seg} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${seg === 'All Categories' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
              {seg}
            </button>
          ))}
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Category Inventory Value", val: `$${(125400).toLocaleString()}`, sub: "Meat carries highest weight", icon: PieChartIcon, color: "text-blue-900", bg: "bg-blue-50/80 border-blue-200/60" },
          { label: "Velocity Rate", val: `$3,800/d`, sub: "Extremely high turn", icon: Zap, color: "text-emerald-900", bg: "bg-emerald-50/80 border-emerald-200/60" },
          { label: "Avg Days of Cover", val: `15 Days`, sub: "Across all categories", icon: ShieldAlert, color: "text-amber-900", bg: "bg-amber-50/80 border-amber-200/60" },
          { label: "Inventory Efficiency", val: `1.4x`, sub: "Turnover Multiplier", icon: BadgeMinus, color: "text-indigo-900", bg: "bg-indigo-50/80 border-indigo-200/60" }
        ].map((kpi, i) => (
          <div key={i} className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm ${kpi.bg}`}>
            <div className="absolute -right-3 -top-3 opacity-5"><kpi.icon size={80} className={kpi.color} /></div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{kpi.label}</p>
            <p className={`text-3xl font-extrabold ${kpi.color}`}>{kpi.val}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Values & Risk Exposure Stacked Bar */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Risk Exposure by Category Value</h2>
          <p className="text-xs text-slate-500 mb-6">Total tied-up capital split by healthy vs at-risk designation.</p>
          <div className="flex-1 w-full min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryValueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
                <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v: any) => `$${Number(v).toLocaleString()}`} cursor={{ fill: 'transparent' }} />
                <Legend wrapperStyle={{ fontSize: 11, fontWeight: 500, paddingTop: 10 }} iconType="circle" />
                <Bar dataKey="value" stackId="a" name="Healthy Value" fill="#94a3b8" radius={[0, 0, 4, 4]} barSize={32} />
                <Bar dataKey="risk" stackId="a" name="At-Risk Value" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Velocity Daily Depletion Bar */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Category Consumption Velocity</h2>
          <p className="text-xs text-slate-500 mb-6">Daily financial depletion rate pacing per core category.</p>
          <div className="flex-1 w-full min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CATEGORY_CONSUMPTION_TODAY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
                <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v: any) => `$${Number(v).toLocaleString()}`} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" name="Daily $ Depletion" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24}>
                   {CATEGORY_CONSUMPTION_TODAY.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.value > 1000 ? "#10b981" : "#3b82f6"} />
                   ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

       {/* Category Value Breakdown Table */}
       <div className="rounded-3xl border border-slate-200/60 bg-white shadow-sm overflow-hidden mt-6">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-0.5">Efficiency Breakdown</h2>
              <p className="text-xs text-slate-500">Deep-dive into coverage health metrics calculated against historical depletion velocity.</p>
            </div>
        </div>
        <div className="overflow-x-auto p-2">
           <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                 <tr className="border-b border-slate-50">
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Category</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Inventory Capital</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Daily Turn Rate</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Days of Cover</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Efficiency Multiplier</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {categoryValueData.map((item, idx) => {
                    const dailyTurn = CATEGORY_CONSUMPTION_TODAY.find(c => c.category === item.category)?.value || 500;
                    const doc = Math.round(item.value / dailyTurn);
                    return (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                         <td className="px-4 py-3 font-bold text-slate-900">{item.category}</td>
                         <td className="px-4 py-3 text-right text-slate-500">${item.value.toLocaleString()}</td>
                         <td className="px-4 py-3 text-right font-medium text-slate-700">${dailyTurn.toLocaleString()}/d</td>
                         <td className="px-4 py-3 text-right font-bold text-slate-900">{doc}d</td>
                         <td className="px-4 py-3 text-right font-bold text-indigo-600">{(item.value / (dailyTurn * 30)).toFixed(2)}x</td>
                      </tr>
                    );
                 })}
              </tbody>
           </table>
        </div>
       </div>

    </div>
  );
}
