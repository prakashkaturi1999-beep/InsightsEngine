"use client";

import { useSupplyFilters } from "@/lib/supplyFilterContext";
import { getSupplyKpis, SHARED_INVENTORY_ITEMS } from "@/lib/supplyDataEngine";
import { ArrowRightLeft, ShieldCheck, ShieldAlert, PackageMinus, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, Cell, AreaChart, Area } from "recharts";

export default function CrossFlowSummaryPage() {
  const { filters } = useSupplyFilters();
  const kpis = getSupplyKpis(filters);

  const coverageProjection = [
    { day: "Mon", noAction: 1.2, afterDelivery: 1.2 },
    { day: "Tue", noAction: 1.0, afterDelivery: 1.0 },
    { day: "Wed", noAction: 0.8, afterDelivery: 1.4 },
    { day: "Thu", noAction: 0.5, afterDelivery: 1.3 },
    { day: "Fri", noAction: 0.2, afterDelivery: 1.1 },
    { day: "Sat", noAction: -0.1, afterDelivery: 1.0 },
    { day: "Sun", noAction: -0.4, afterDelivery: 0.9 },
  ];

  const stockoutRiskValue = 1450;
  const overstockAtRisk = kpis.overstockRiskValue;

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Cross-Flow Summary</h1>
          <p className="text-sm text-slate-500">Analyze the intersection of outgoing demand vs incoming supply deliveries.</p>
        </div>
        <div className="flex gap-2">
          {["All Flows", "Risk Only", "Overstock Only", "Optimal"].map(seg => (
            <button key={seg} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${seg === 'All Flows' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
              {seg}
            </button>
          ))}
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Net Inventory Flow", val: `+${kpis.netFlowUnits.toLocaleString()}`, sub: `+$${kpis.netFlowValue.toLocaleString()}/wk`, icon: ArrowRightLeft, color: "text-blue-900", bg: "bg-blue-50/80 border-blue-200/60" },
          { label: "Coverage Post-Delivery", val: `1.15x`, sub: "Improving ratio", icon: ShieldCheck, color: "text-emerald-900", bg: "bg-emerald-50/80 border-emerald-200/60" },
          { label: "Stockout Risk (Pre-Del)", val: `$${stockoutRiskValue.toLocaleString()}`, sub: "3 items at risk", icon: ShieldAlert, color: "text-rose-900", bg: "bg-rose-50/80 border-rose-200/60" },
          { label: "Overstock (Post-Del)", val: `$${overstockAtRisk.toLocaleString()}`, sub: "Capital tied up", icon: PackageMinus, color: "text-amber-900", bg: "bg-amber-50/80 border-amber-200/60" }
        ].map((kpi, i) => (
          <div key={i} className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm ${kpi.bg}`}>
            <div className="absolute -right-3 -top-3 opacity-5"><kpi.icon size={80} className={kpi.color} /></div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{kpi.label}</p>
            <p className={`text-3xl font-extrabold ${kpi.color}`}>{kpi.val}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coverage Projection Area Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-6">
             <div>
               <h2 className="text-sm font-bold text-slate-900 mb-1">Global Coverage Projection (Multiplier)</h2>
               <p className="text-xs text-slate-500">Scenario planning: No Action vs Scheduled Replenishment.</p>
             </div>
             <div className="px-3 py-1 bg-amber-50 rounded-lg border border-amber-200 text-amber-700 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <AlertTriangle size={14} /> Deficit Warning Wed-Sun
             </div>
          </div>
          <div className="flex-1 w-full min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={coverageProjection} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAfter" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v: any) => `${Number(v).toFixed(2)}x`} />
                <Legend wrapperStyle={{ fontSize: 11, fontWeight: 500, paddingTop: 10 }} iconType="circle" />
                <Area type="monotone" dataKey="afterDelivery" name="Post-Delivery Coverage" stroke="#10b981" strokeWidth={3} fill="url(#colorAfter)" activeDot={{ r: 6 }} />
                <Area type="monotone" dataKey="noAction" name="No-Action Depletion" stroke="#f43f5e" strokeWidth={3} strokeDasharray="6 6" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Summary Panel */}
        <div className="space-y-4">
           {/* Decision Enablement */}
           <div className="rounded-3xl border border-blue-200/60 bg-blue-50/50 backdrop-blur p-6 shadow-sm">
             <h3 className="text-sm font-bold text-blue-900 mb-2">Executive Recommendation</h3>
             <p className="text-xs text-blue-700 mb-5 font-medium leading-relaxed">
               Approving the $1,450 emergency purchase order for Wednesday will completely eliminate the pre-weekend Stockout Risk, preserving an estimated $6,200 in gross margin.
             </p>
             <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center gap-2 rounded-xl text-xs font-bold text-white shadow-sm">
                Approve Emergency Transfer <ArrowRight size={14} />
             </button>
           </div>

           {/* Risk Breakdown Cards */}
           <div className="rounded-3xl border border-slate-200/60 bg-white shadow-sm overflow-hidden text-sm">
              <div className="p-4 border-b border-slate-100">
                 <h2 className="font-bold text-slate-900">Pre-Delivery Stockout Risks</h2>
              </div>
              <div className="divide-y divide-slate-50">
                 {SHARED_INVENTORY_ITEMS.filter(i => i.status === "Stockout Risk").map((item, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between">
                       <div>
                          <p className="font-bold text-slate-900">{item.name}</p>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">Runs out in {item.daysCover}d</p>
                       </div>
                       <div className="text-right">
                          <p className="font-bold text-rose-600">${item.onHandValue.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Value left</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
      
      {/* Operational Impact Table */}
      <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur shadow-sm overflow-hidden flex flex-col mt-6">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-0.5">Operational Flow Impact Analysis</h2>
            <p className="text-xs text-slate-500">Cross-referencing net consumption against scheduled incoming supply.</p>
          </div>
        </div>
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Category</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Avg Weekly Usage</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Scheduled Inflow</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Net Category Flow</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {/* Mocking the category logic */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 font-bold text-slate-900">Meat</td>
                <td className="px-4 py-3 text-right text-slate-500">1,240u</td>
                <td className="px-4 py-3 text-right font-medium text-slate-700">1,400u</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-600">+160u</td>
                <td className="px-4 py-3 text-right"><span className="inline-flex py-1 px-2.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold border bg-emerald-50 text-emerald-700 border-emerald-200">Surplus</span></td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 font-bold text-slate-900">Veg</td>
                <td className="px-4 py-3 text-right text-slate-500">1,820u</td>
                <td className="px-4 py-3 text-right font-medium text-slate-700">1,600u</td>
                <td className="px-4 py-3 text-right font-bold text-rose-600">-220u</td>
                <td className="px-4 py-3 text-right"><span className="inline-flex py-1 px-2.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold border bg-rose-50 text-rose-700 border-rose-200">Deficit</span></td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 font-bold text-slate-900">Bar</td>
                <td className="px-4 py-3 text-right text-slate-500">950u</td>
                <td className="px-4 py-3 text-right font-medium text-slate-700">950u</td>
                <td className="px-4 py-3 text-right font-bold text-slate-400">0u</td>
                <td className="px-4 py-3 text-right"><span className="inline-flex py-1 px-2.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold border bg-slate-50 text-slate-700 border-slate-200">Balanced</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
