"use client";

import { useSupplyFilters } from "@/lib/supplyFilterContext";
import { getSupplyKpis, SHARED_INVENTORY_ITEMS } from "@/lib/supplyDataEngine";
import { TrendingUp, AlertTriangle, ArrowRightLeft, Target, Bot, Sparkles, Clock, CalendarDays, ShoppingBag } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, Cell, AreaChart, Area } from "recharts";

export default function TrendsForecastPage() {
  const { filters } = useSupplyFilters();
  const kpis = getSupplyKpis(filters);

  const weeklyFlowTrend = [
    { week: "W1", Flow: 3800 },
    { week: "W2", Flow: 5300 },
    { week: "W3", Flow: 7200 },
    { week: "W4", Flow: 5100 },
    { week: "Projected W5", Flow: -1000 }, // Projected Future Flow
  ];

  const demandInsights = [
    { day: "Mon", demand: 450, supply: 600 },
    { day: "Tue", demand: 480, supply: 600 },
    { day: "Wed", demand: 520, supply: 600 },
    { day: "Thu", demand: 850, supply: 600 }, // Thursday spike
    { day: "Fri", demand: 1100, supply: 1000 },
    { day: "Sat", demand: 1250, supply: 1000 },
    { day: "Sun", demand: 980, supply: 1000 },
  ];

  const forecastedStockouts = SHARED_INVENTORY_ITEMS.filter(i => i.status === "Stockout Risk");

  return (
    <div className="flex gap-6 pb-12 items-start">
      {/* LEFT COLUMN: Main Dashboard Content */}
      <div className="flex-1 space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Trends & Forecast</h1>
          <p className="text-sm text-slate-500">Predictive analytics overlaying historical usage models against scheduled supply inflow.</p>
        </div>

        {/* Top Level KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Projected Flow Trend", val: `+$6.2K`, sub: "Avg per week historically", icon: TrendingUp, color: "text-emerald-900", bg: "bg-emerald-50/80 border-emerald-200/60" },
            { label: "Projected Future Flow", val: `-$1,000`, sub: "Next week deficit looming", icon: ArrowRightLeft, color: "text-rose-900", bg: "bg-rose-50/80 border-rose-200/60" },
            { label: "Forecasted Stockouts", val: `${forecastedStockouts.length}`, sub: "Critical items dropping to 0", icon: AlertTriangle, color: "text-amber-900", bg: "bg-amber-50/80 border-amber-200/60" },
            { label: "Suggested Reorders", val: `2 Items`, sub: "Action required today", icon: ShoppingBag, color: "text-blue-900", bg: "bg-blue-50/80 border-blue-200/60" }
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
          {/* Inventory Flow Trend */}
          <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex flex-col">
            <h2 className="text-sm font-bold text-slate-900 mb-1">Inventory Flow Balance Trend</h2>
            <p className="text-xs text-slate-500 mb-6">Historical net financial flow with AI-projected Week 5 variance gap.</p>
            <div className="flex-1 w-full min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyFlowTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
                  <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v: any) => `$${Number(v).toLocaleString()}`} cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="Flow" radius={[4, 4, 4, 4]} barSize={24}>
                     {weeklyFlowTrend.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.Flow < 0 ? "#f43f5e" : "#10b981"} />
                     ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Demand vs Supply Projection */}
          <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex flex-col">
             <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-900">Weekly Demand Insights</h2>
              <p className="text-xs text-slate-500">Day-of-week demand smoothing against delivery supply drops.</p>
            </div>
            <div className="flex-1 w-full relative min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demandInsights} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v: any) => Number(v).toLocaleString()} />
                  <Legend wrapperStyle={{ fontSize: 11, fontWeight: 500, paddingTop: 10 }} iconType="circle" />
                  <Area type="monotone" dataKey="supply" name="Scheduled Intake Capacity" stroke="#94a3b8" strokeDasharray="4 4" fill="transparent" strokeWidth={2} />
                  <Area type="monotone" dataKey="demand" name="Predicted Demand" stroke="#6366f1" fill="#818cf8" fillOpacity={0.2} strokeWidth={3} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Tier Urgent Actions */}
        <div className="grid grid-cols-1 gap-6">
           <div className="rounded-3xl border border-slate-200/60 bg-white shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 mb-0.5">Urgency Ranking: Time to Stockout</h2>
                  <p className="text-xs text-slate-500">Suggested reorders automatically sized based on forecasted runway depletion.</p>
                </div>
              </div>
              <div className="overflow-x-auto p-2">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-50">
                      <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Item / SKU</th>
                      <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-center">Time to Empty</th>
                      <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-center">Suggested Reorder</th>
                      <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {forecastedStockouts.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-4 font-bold text-slate-900 flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <Clock size={14} />
                             </div>
                             {item.name}
                          </td>
                          <td className="px-4 py-3 text-center">
                             <span className="text-rose-600 font-black">{item.daysCover} Days</span>
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-slate-700">{item.reorderRec} units</td>
                          <td className="px-4 py-3 text-center">
                             <button className="px-3 py-1.5 bg-slate-900 text-white text-[10px] uppercase tracking-wider font-bold rounded-lg hover:bg-slate-800 transition shadow-sm">
                                Submit P.O.
                             </button>
                          </td>
                        </tr>
                     ))}
                  </tbody>
                </table>
              </div>
           </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Sticky AI feed */}
      <div className="w-[320px] shrink-0 sticky top-24 space-y-4">
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          <div className="flex items-center gap-2 mb-6">
            <Bot size={18} className="text-indigo-600" />
            <span className="text-[11px] font-black tracking-widest uppercase text-slate-500">AI Forecast Feed</span>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                 <h4 className="text-sm font-bold text-slate-900">Weekend Volume Spike</h4>
                 <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[9px] font-black uppercase rounded">High Impact</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Model predicts a 34% surge in Bar category consumption this coming Friday. Currently short 50 units of IPA Keg capacity.</p>
              <button className="mt-3 w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition rounded-xl text-xs font-bold border border-indigo-200">
                 Draft Weekend P.O.
              </button>
            </div>
            
            <div className="h-px w-full bg-slate-100" />
            
            <div>
               <div className="flex items-center justify-between mb-2">
                 <h4 className="text-sm font-bold text-slate-900">Yield Optimization</h4>
                 <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase rounded">Opportunity</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Historical trend analysis shows we are systematically over-pulling Ground Beef by roughly 8% on Tuesdays. Adjust prep sheet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
