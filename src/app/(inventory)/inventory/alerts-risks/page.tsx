"use client";

import { useSupplyFilters } from "@/lib/supplyFilterContext";
import { getSupplyKpis, SHARED_INVENTORY_ITEMS } from "@/lib/supplyDataEngine";
import { ShieldAlert, PackageMinus, AlertOctagon, Flame, ArrowUpRight, TrendingUp, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, Cell, AreaChart, Area, PieChart, Pie } from "recharts";

export default function AlertsRisksPage() {
  const { filters } = useSupplyFilters();
  const kpis = getSupplyKpis(filters);

  // Math Invariant check: Risk Total
  const stockoutRiskValue = kpis.stockoutRiskValue; // $26,000
  const expiryRiskValue = kpis.expiryRiskValue; // $12,400
  const overstockValue = kpis.overstockRiskValue; // $18,400
  const totalValueAtRisk = kpis.totalRiskValue; // $56,800

  const riskSplit = [
    { name: "Stockout Risk", value: stockoutRiskValue },
    { name: "Expiry Risk", value: expiryRiskValue },
    { name: "Overstock Risk", value: overstockValue },
  ];
  const pieColors = ["#f43f5e", "#f59e0b", "#3b82f6"];

  const stockoutItems = SHARED_INVENTORY_ITEMS.filter(i => i.status === "Stockout Risk");
  const overstockItems = SHARED_INVENTORY_ITEMS.filter(i => i.status === "Overstock");

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Alerts & Risk Exposure</h1>
          <p className="text-sm text-slate-500">Consolidated risk register spanning stockouts, spoilage, delivery failures, and abnormal pacing.</p>
        </div>
        <div className="flex gap-2">
          {["All Risks", "Critical", "Warnings", "Actionable"].map(seg => (
            <button key={seg} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${seg === 'All Risks' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
              {seg}
            </button>
          ))}
        </div>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
           { label: "Total Asset Risk", val: `$${(totalValueAtRisk/1000).toFixed(1)}k`, sub: "Frozen or at-risk capital", icon: AlertOctagon, color: "text-slate-900", bg: "bg-slate-50 border-slate-200" },
           { label: "Stockout Alerts", val: `${stockoutItems.length}`, sub: "Impending < 7 days", icon: ShieldAlert, color: "text-rose-900", bg: "bg-rose-50/80 border-rose-200/60" },
           { label: "Expiry / Spoilage", val: `7`, sub: "At risk < 14 days", icon: AlertTriangle, color: "text-amber-900", bg: "bg-amber-50/80 border-amber-200/60" },
           { label: "Overstock Burden", val: `$${(overstockValue/1000).toFixed(1)}k`, sub: "Excess tied capital", icon: PackageMinus, color: "text-blue-900", bg: "bg-blue-50/80 border-blue-200/60" }
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Value Distribution Donut */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex flex-col justify-center">
             <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-900">Capital Risk Distribution</h2>
              <p className="text-xs text-slate-500">$56.8k broken down by risk bucket.</p>
            </div>
            <div className="flex-1 w-full relative min-h-[220px]">
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 pt-4">
                <span className="text-2xl font-black text-rose-600">${(totalValueAtRisk/1000).toFixed(1)}k</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">At Risk</span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskSplit} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} stroke="#fff" strokeWidth={2}>
                    {riskSplit.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} formatter={(v: any) => `$${Number(v).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
             <div className="mt-4 flex flex-wrap gap-2 justify-center">
                 {riskSplit.map((cat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pieColors[idx] }}></div>
                        {cat.name}
                    </div>
                 ))}
             </div>
        </div>

         {/* Abnormal Spikes / Operational Threats */}
         <div className="lg:col-span-2 space-y-4">
             {/* Spike Threat Panel */}
             <div className="rounded-3xl border border-rose-200/60 bg-rose-50/50 backdrop-blur shadow-sm p-5 relative overflow-hidden flex items-start gap-4 h-full">
               <div className="p-3 bg-white rounded-2xl shadow-sm relative z-10">
                  <Flame size={24} className="text-rose-600" />
               </div>
               <div className="relative z-10">
                 <h3 className="text-sm font-bold text-rose-900">Abnormal Consumption Spikes Detected</h3>
                 <p className="text-xs text-rose-700 mt-1 font-medium leading-relaxed">
                   3 active SKUs are currently experiencing demand spikes &gt; 18% above rolling 30-day baseline.<br/><br/>
                   <b>Chicken Breast:</b> +42% velocity<br/>
                   <b>Avocados:</b> +24% velocity<br/>
                   <b>IPA Keg:</b> +19% velocity<br/>
                 </p>
                 <div className="mt-4 flex gap-3">
                   <button className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-xl shadow-sm transition flex items-center gap-1">Update Reorder Parameters <ArrowUpRight size={14}/></button>
                 </div>
               </div>
             </div>
         </div>
      </div>

       {/* Full Risk Register Table Suite */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Stockout Risk Action List */}
          <div className="rounded-3xl border border-rose-200/60 bg-white shadow-sm overflow-hidden flex flex-col">
             <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                   <h2 className="text-sm font-bold text-rose-900 mb-0.5">Stockout Risk Register</h2>
                   <p className="text-xs text-slate-500">Items actively pacing toward 0 days of cover.</p>
                </div>
             </div>
             <div className="divide-y divide-slate-50">
                {stockoutItems.map((item, idx) => (
                   <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div>
                         <p className="font-bold text-slate-900">{item.name}</p>
                         <p className="text-[10px] font-bold text-rose-600 mt-0.5">Empty in {item.daysCover} Days</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                         <span className="text-xs font-black text-slate-900">${item.onHandValue.toLocaleString()} held</span>
                         <button className="text-[9px] font-bold uppercase tracking-wider text-rose-700 hover:text-rose-900">Queue P.O.</button>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Overstock Risk Action List */}
          <div className="rounded-3xl border border-blue-200/60 bg-white shadow-sm overflow-hidden flex flex-col">
             <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                   <h2 className="text-sm font-bold text-blue-900 mb-0.5">Overstock Register</h2>
                   <p className="text-xs text-slate-500">Capital actively frozen beyond operational 30d target.</p>
                </div>
             </div>
             <div className="divide-y divide-slate-50">
                {overstockItems.map((item, idx) => (
                   <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div>
                         <p className="font-bold text-slate-900">{item.name}</p>
                         <p className="text-[10px] font-bold text-blue-600 mt-0.5">Excess: {item.daysCover - 30} Days</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                         <span className="text-xs font-black text-slate-900">${item.onHandValue.toLocaleString()} held</span>
                         <button className="text-[9px] font-bold uppercase tracking-wider text-blue-700 hover:text-blue-900">Pause Auto-Order</button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
       </div>

    </div>
  );
}
