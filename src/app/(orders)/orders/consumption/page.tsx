"use client";

import { useSupplyFilters } from "@/lib/supplyFilterContext";
import { getSupplyKpis, CATEGORY_CONSUMPTION_TODAY, SHARED_INVENTORY_ITEMS } from "@/lib/supplyDataEngine";
import { ShoppingCart, TrendingUp, AlertOctagon, Flame, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, Cell, PieChart, Pie } from "recharts";

export default function ConsumptionSnapshotPage() {
  const { filters } = useSupplyFilters();
  const kpis = getSupplyKpis(filters);

  const varianceData = [
    { name: "Ground Beef", expected: 32, actual: 35, variance: 3, costImpact: 300 },
    { name: "Avocados", expected: 3, actual: 4, variance: 1, costImpact: 40 },
    { name: "IPA Keg (50L)", expected: 1.5, actual: 2, variance: 0.5, costImpact: 75 },
    { name: "Chicken Breast", expected: 40, actual: 50, variance: 10, costImpact: 500 },
    { name: "Cooking Oil", expected: 2, actual: 3, variance: 1, costImpact: 45 },
  ];

  const pieColors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#94a3b8"];

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Outgoing Consumption Snapshot</h1>
          <p className="text-sm text-slate-500">Drill-down into daily usage, depletion velocity, and expected vs actual variances.</p>
        </div>
        <div className="flex gap-2">
          {["All", "Spikes", "Leakage", "Stable"].map(seg => (
            <button key={seg} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${seg === 'All' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
              {seg}
            </button>
          ))}
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Daily Consumption", val: `$${kpis.consumptionTodayValue.toLocaleString()}`, sub: `${kpis.consumptionTodayUnits} units`, icon: ShoppingCart, color: "text-blue-900", bg: "bg-blue-50/80 border-blue-200/60" },
          { label: "7D vs 30D Trend", val: `+${kpis.sevenDayTrend}%`, sub: "Elevated depletion", icon: TrendingUp, color: "text-amber-900", bg: "bg-amber-50/80 border-amber-200/60" },
          { label: "Consumption Spike", val: `+${kpis.spikeTrend}%`, sub: "3 SKUs affected", icon: Flame, color: "text-rose-900", bg: "bg-rose-50/80 border-rose-200/60" },
          { label: "Expected vs Actual", val: `$${kpis.varianceValue.toLocaleString()}`, sub: "Variance logged", icon: AlertOctagon, color: "text-purple-900", bg: "bg-purple-50/80 border-purple-200/60" }
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
        {/* Expected vs Actual Bar Chart */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Expected vs Actual Usage</h2>
          <p className="text-xs text-slate-500 mb-6">Theoretical usage based on POS sales vs physical depletion.</p>
          <div className="flex-1 w-full min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={varianceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v: any) => Number(v).toLocaleString()} cursor={{ fill: 'transparent' }} />
                <Legend wrapperStyle={{ fontSize: 11, fontWeight: 500, paddingTop: 10 }} iconType="circle" />
                <Bar dataKey="expected" name="Expected (POS Driven)" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="actual" name="Actual Depletion" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Setup */}
        <div className="grid grid-cols-1 gap-6">
           {/* Top Consumed Components */}
           <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 mb-0.5">Top Consumed Drivers</h2>
                <p className="text-xs text-slate-500">Highest velocity items accounting for 80% daily flow.</p>
              </div>
            </div>
            <div className="overflow-x-auto p-2">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Item</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Category</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Avg Daily</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {SHARED_INVENTORY_ITEMS.slice(0, 5).sort((a,b) => b.avgDailyUsage - a.avgDailyUsage).map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900">{c.name}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{c.category}</td>
                      <td className="px-4 py-3 text-right font-bold text-slate-900">{c.avgDailyUsage}u</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

       {/* Full Usage Variance List / Log */}
       <div className="rounded-3xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-0.5">Loss & Leakage Drill-Down (Variance Log)</h2>
              <p className="text-xs text-slate-500">Itemized breakdown of theoretical vs actual discrepancies contributing to the ${kpis.varianceValue} variance.</p>
            </div>
        </div>
        <div className="overflow-x-auto p-2">
           <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                 <tr className="border-b border-slate-50">
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Item Detail</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Theoretical Qty</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Actual Qty</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Cost Variance</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {varianceData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                       <td className="px-4 py-3 font-bold text-slate-900">{item.name}</td>
                       <td className="px-4 py-3 text-right text-slate-500">{item.expected} units</td>
                       <td className="px-4 py-3 text-right font-bold text-slate-900">{item.actual} units</td>
                       <td className="px-4 py-3 text-right font-bold text-rose-600 flex items-center justify-end gap-1">
                          <ArrowUpRight size={14} /> ${item.costImpact.toFixed(2)}
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
