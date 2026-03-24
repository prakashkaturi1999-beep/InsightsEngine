"use client";

import { useSupplyFilters } from "@/lib/supplyFilterContext";
import { getSupplyKpis, SHARED_INVENTORY_ITEMS } from "@/lib/supplyDataEngine";
import { Container, DollarSign, ShieldAlert, ArrowRightLeft, PackagePlus, PackageMinus, TrendingUp, AlertOctagon, Bot, Sparkles, AlertTriangle, Scale } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, Cell, AreaChart, Area } from "recharts";

export default function InventoryCommandCenterPage() {
  const { filters } = useSupplyFilters();
  const kpis = getSupplyKpis(filters);

  // Math Invariant Rule 3: Category values match across views
  const categoryValueData = [
    { category: "Meat", value: 45000, daysCover: 12, targetCover: 14 },
    { category: "Veg", value: 12000, daysCover: 3, targetCover: 5 },
    { category: "Bar", value: 34000, daysCover: 18, targetCover: 14 },
    { category: "Dry Goods", value: 21000, daysCover: 25, targetCover: 21 },
    { category: "Supplies", value: 13400, daysCover: 60, targetCover: 30 }, // Overstocked
  ];

  const weeklyMovement = [
    { week: "W1", Current: 110000, Incoming: 68000, Outgoing: 54000 },
    { week: "W2", Current: 124000, Incoming: 75000, Outgoing: 61000 },
    { week: "W3", Current: 118000, Incoming: 62000, Outgoing: 68000 },
    { week: "W4", Current: kpis.currentValue, Incoming: kpis.incomingValue, Outgoing: kpis.outgoingValue },
  ];

  return (
    <div className="flex gap-6 pb-12 items-start">
      {/* LEFT COLUMN: Main Dashboard Content */}
      <div className="flex-1 space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory Command Center</h1>
          <p className="text-sm text-slate-500">Global overview of capital tied in held goods, incoming pipelines, and projected depletion.</p>
        </div>

        {/* Top Level KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
             { label: "Total Inventory Value", val: `$${(kpis.currentValue/1000).toFixed(1)}k`, sub: `${kpis.totalItems} Active Items`, icon: DollarSign, color: "text-slate-900", bg: "bg-slate-50 border-slate-200" },
             { label: "Aggregate Days of Cover", val: `${kpis.daysOfCover}d`, sub: "Across all categories", icon: Scale, color: "text-blue-900", bg: "bg-blue-50/80 border-blue-200/60" },
             { label: "Stockout Risk Value", val: `$${(kpis.stockoutRiskValue/1000).toFixed(1)}k`, sub: "Critical shortage imminent", icon: ShieldAlert, color: "text-rose-900", bg: "bg-rose-50/80 border-rose-200/60" },
             { label: "Net Inventory Flow", val: `+$${(kpis.netFlowValue/1000).toFixed(1)}k`, sub: `+${kpis.netFlowUnits.toLocaleString()} units`, icon: ArrowRightLeft, color: "text-emerald-900", bg: "bg-emerald-50/80 border-emerald-200/60" }
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

        {/* Mid KPIs (Pipeline States) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm flex items-center justify-between">
               <div>
                  <div className="flex items-center gap-1.5 mb-1 text-slate-500">
                     <Container size={14} /> <span className="text-[10px] font-bold uppercase tracking-wider">Current Held</span>
                  </div>
                  <p className="text-xl font-black text-slate-900">${(kpis.currentValue/1000).toFixed(1)}k</p>
                  <p className="text-xs font-medium text-slate-400">{kpis.currentUnits.toLocaleString()} units</p>
               </div>
            </div>
            <div className="rounded-2xl border border-blue-200/60 bg-blue-50/40 p-4 shadow-sm flex items-center justify-between">
               <div>
                  <div className="flex items-center gap-1.5 mb-1 text-blue-600">
                     <PackagePlus size={14} /> <span className="text-[10px] font-bold uppercase tracking-wider">Incoming Supply</span>
                  </div>
                  <p className="text-xl font-black text-blue-900">${(kpis.incomingValue/1000).toFixed(1)}k</p>
                  <p className="text-xs font-medium text-blue-500">{kpis.incomingUnits.toLocaleString()} units</p>
               </div>
            </div>
            <div className="rounded-2xl border border-rose-200/60 bg-rose-50/40 p-4 shadow-sm flex items-center justify-between">
               <div>
                  <div className="flex items-center gap-1.5 mb-1 text-rose-600">
                     <PackageMinus size={14} /> <span className="text-[10px] font-bold uppercase tracking-wider">Outgoing Usage</span>
                  </div>
                  <p className="text-xl font-black text-rose-900">${(kpis.outgoingValue/1000).toFixed(1)}k</p>
                  <p className="text-xs font-medium text-rose-500">{kpis.outgoingUnits.toLocaleString()} units</p>
               </div>
            </div>
        </div>

        {/* Charts Tier */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Movement Flow */}
          <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex flex-col">
            <h2 className="text-sm font-bold text-slate-900 mb-1">Weekly Inventory Movement</h2>
            <p className="text-xs text-slate-500 mb-6">Historical snapshot of capital tied in current inventory vs supply chain pipeline.</p>
            <div className="flex-1 w-full min-h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyMovement} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
                  <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v: any) => `$${(Number(v)/1000).toFixed(1)}k`} cursor={{ fill: 'transparent' }} />
                  <Legend wrapperStyle={{ fontSize: 11, fontWeight: 500, paddingTop: 10 }} iconType="circle" />
                  <Bar dataKey="Current" name="Held Capital" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar dataKey="Incoming" name="P.O. Pipeline" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar dataKey="Outgoing" name="Consumed Capital" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Value by Category Horizontal Bar */}
          <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex flex-col">
             <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-900">Inventory Value by Category</h2>
              <p className="text-xs text-slate-500">Distribution of the $125k held capital.</p>
            </div>
            <div className="flex-1 w-full relative min-h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryValueData} layout="vertical" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="category" type="category" tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
                  <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} formatter={(v: any) => `$${Number(v).toLocaleString()}`} />
                  <Bar dataKey="value" name="Capital Value" radius={[0, 4, 4, 0]} barSize={24}  fill="#10b981">
                      {categoryValueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.value > 20000 ? "#10b981" : "#cbd5e1"} />
                      ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Coverage Tables & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 rounded-3xl border border-slate-200/60 bg-white shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 mb-0.5">Category Target vs Actual Coverage</h2>
                  <p className="text-xs text-slate-500">Benchmarking real days of stock vs established organizational targets.</p>
                </div>
              </div>
              <div className="overflow-x-auto p-2">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-50">
                      <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Category</th>
                      <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-center">Current DOC</th>
                      <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-center">Target DOC</th>
                      <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Variance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {categoryValueData.map((item, idx) => {
                        const variance = item.daysCover - item.targetCover;
                        return (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-4 font-bold text-slate-900">{item.category}</td>
                            <td className="px-4 py-3 text-center font-black text-slate-700">{item.daysCover}d</td>
                            <td className="px-4 py-3 text-center text-slate-400 font-medium">{item.targetCover}d</td>
                            <td className="px-4 py-3 text-right">
                               <span className={`inline-flex py-1 px-2.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold border ${
                                  variance < -2 ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                  variance > 10 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                  'bg-emerald-50 text-emerald-700 border-emerald-200'
                               }`}>
                                  {variance > 0 ? `+${variance}d` : `${variance}d`}
                               </span>
                            </td>
                          </tr>
                        );
                     })}
                  </tbody>
                </table>
              </div>
           </div>
           
           {/* Critical Alerts panel */}
           <div className="space-y-4">
              <div className="rounded-3xl border border-rose-200/60 bg-rose-50/60 backdrop-blur p-5 shadow-sm">
                 <div className="flex items-center gap-2 mb-3 text-rose-800">
                    <AlertTriangle size={18} />
                    <h3 className="text-xs font-black tracking-widest uppercase">Coverage Deficit</h3>
                 </div>
                 <p className="text-xs font-semibold text-rose-900 leading-relaxed">
                   <b>Veg Category</b> is critically under target. Current on-hand supply represents 3 Days of Cover against a 5 Day target. Expedited prep logistics recommended before Friday peak.
                 </p>
              </div>
              
              <div className="rounded-3xl border border-amber-200/60 bg-amber-50/60 backdrop-blur p-5 shadow-sm">
                 <div className="flex items-center gap-2 mb-3 text-amber-800">
                    <AlertOctagon size={18} />
                    <h3 className="text-xs font-black tracking-widest uppercase">Overstock Identified</h3>
                 </div>
                 <p className="text-xs font-semibold text-amber-900 leading-relaxed">
                   <b>Supplies Category</b> holds 60 Days of Cover against a 30 Day target. $13.4k capital frozen. Pause incoming Auto-Orders for Napkins and Takeout Bags immediately.
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Sticky AI feed */}
      <div className="w-[320px] shrink-0 sticky top-24 space-y-4">
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
          <div className="flex items-center gap-2 mb-6">
            <Bot size={18} className="text-teal-600" />
            <span className="text-[11px] font-black tracking-widest uppercase text-slate-500">Inventory AI</span>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                 <h4 className="text-sm font-bold text-slate-900">Capital Rebalancing</h4>
                 <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase rounded">Suggested</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Re-allocating the $5,000 currently tied in excess Supply auto-orders toward accelerating Meat P.O.s will completely solve projected weekend stockouts while keeping Net Flow identical.</p>
              <button className="mt-4 w-full py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 transition rounded-xl text-xs font-bold border border-teal-200 shadow-sm flex items-center justify-center gap-1.5">
                 Optimize Orders <TrendingUp size={14}/>
              </button>
            </div>
            
            <div className="h-px w-full bg-slate-100" />
            
            <div>
               <div className="flex items-center justify-between mb-2">
                 <h4 className="text-sm font-bold text-slate-900">Supplier Reliability</h4>
                 <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[9px] font-black uppercase rounded">Risk Alert</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Sysco's on-time rate for Bar deliveries has dropped to 76%. Expect incoming $4,500 IPA Keg shipment to be delayed by up to 18 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
