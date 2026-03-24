"use client";

import { useSupplyFilters } from "@/lib/supplyFilterContext";
import { getSupplyKpis, CATEGORY_CONSUMPTION_TODAY, SHARED_INVENTORY_ITEMS } from "@/lib/supplyDataEngine";
import { ShoppingCart, TrendingUp, AlertTriangle, ArrowRightLeft, Target, Bell, Bot, PieChart as PieChartIcon, Zap, ChevronRight, Hash, ShieldAlert } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, Cell, PieChart, Pie, AreaChart, Area } from "recharts";

export default function OrdersCommandCenterPage() {
  const { filters } = useSupplyFilters();
  const kpis = getSupplyKpis(filters);

  // Mocking trend data for line charts
  const consumptionTrend = [
    { day: "Mon", current: 520, previous: 480 },
    { day: "Tue", current: 580, previous: 510 },
    { day: "Wed", current: 610, previous: 590 },
    { day: "Thu", current: 850, previous: 720 },
    { day: "Fri", current: 920, previous: 810 },
    { day: "Sat", current: 1100, previous: 1050 },
    { day: "Sun", current: 980, previous: 900 },
  ];

  const weeklyFlowBalance = [
    { week: "W1", inflow: 7800, outflow: 8100, net: -300 },
    { week: "W2", inflow: 9200, outflow: 8900, net: 300 },
    { week: "W3", inflow: 8500, outflow: 9400, net: -900 },
    { week: "W4", inflow: 11200, outflow: 9800, net: 1400 },
  ];

  const pieColors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#94a3b8"];

  const forecastedStockouts = SHARED_INVENTORY_ITEMS.filter(i => i.status === "Stockout Risk");

  return (
    <div className="flex gap-6 pb-12 items-start">
      {/* LEFT COLUMN: Main Dashboard Content */}
      <div className="flex-1 space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Orders & Consumption</h1>
          <p className="text-sm text-slate-500">Real-time depletion tracking, multi-channel consumption forecasting, and risk balancing.</p>
        </div>

        {/* Top Level KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Consumption Today", val: `$${kpis.consumptionTodayValue.toLocaleString()}`, sub: `${kpis.consumptionTodayUnits} units`, icon: ShoppingCart, color: "text-blue-900", bg: "bg-blue-50/80 border-blue-200/60" },
            { label: "7D vs 30D Volume Trend", val: `+${kpis.sevenDayTrend}%`, sub: "Accelerating demand", icon: TrendingUp, color: "text-emerald-900", bg: "bg-emerald-50/80 border-emerald-200/60" },
            { label: "Usage Variance (Exp vs Act)", val: `$${kpis.varianceValue.toLocaleString()}`, sub: "Over-consumption detected", icon: AlertTriangle, color: "text-rose-900", bg: "bg-rose-50/80 border-rose-200/60" },
            { label: "Avg Net Inventory Flow", val: `+${kpis.netFlowUnits.toLocaleString()} units`, sub: `+$${kpis.netFlowValue.toLocaleString()} accrued`, icon: ArrowRightLeft, color: "text-indigo-900", bg: "bg-indigo-50/80 border-indigo-200/60" }
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

        {/* Charts Middle Tier */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Trend Line */}
          <div className="lg:col-span-2 rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex flex-col">
            <h2 className="text-sm font-bold text-slate-900 mb-1">Consumption Pacing vs 30-Day Avg</h2>
            <p className="text-xs text-slate-500 mb-6">Unit depletion velocity tracking continuously higher than historical baselines.</p>
            <div className="flex-1 w-full min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={consumptionTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v: any) => Number(v).toLocaleString()} />
                  <Legend wrapperStyle={{ fontSize: 11, fontWeight: 500, paddingTop: 10 }} iconType="circle" />
                  <Area type="monotone" dataKey="current" name="Current Week (Units)" stroke="#3b82f6" strokeWidth={3} fill="url(#colorCurrent)" activeDot={{ r: 6 }} />
                  <Area type="monotone" dataKey="previous" name="30-Day Avg Baseline" stroke="#94a3b8" strokeWidth={3} strokeDasharray="6 6" fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Donut */}
          <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex flex-col justify-center">
             <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-900">Consumption Today</h2>
              <p className="text-xs text-slate-500">Distribution by category.</p>
            </div>
            <div className="flex-1 w-full relative min-h-[180px]">
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 pt-4">
                <span className="text-2xl font-black text-slate-800">${(kpis.consumptionTodayValue/1000).toFixed(1)}k</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Total</span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={CATEGORY_CONSUMPTION_TODAY} dataKey="value" nameKey="category" cx="50%" cy="50%" innerRadius={60} outerRadius={85} stroke="#fff" strokeWidth={2}>
                    {CATEGORY_CONSUMPTION_TODAY.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v: any) => `$${Number(v).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
             <div className="mt-4 flex flex-wrap gap-2 justify-center">
                 {CATEGORY_CONSUMPTION_TODAY.slice(0, 3).map((cat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pieColors[idx] }}></div>
                        {cat.category}
                    </div>
                 ))}
             </div>
          </div>
        </div>

        {/* Bottom Tier */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Flow Balance */}
           <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex flex-col">
            <h2 className="text-sm font-bold text-slate-900 mb-1">Weekly Flow Balance</h2>
            <p className="text-xs text-slate-500 mb-4">Inflow (Deliveries) vs Outflow (Consumption) yielding Net Flow.</p>
            <div className="flex-1 w-full min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyFlowBalance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
                  <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v: any) => Number(v).toLocaleString()} cursor={{ fill: 'transparent' }} />
                  <Legend wrapperStyle={{ fontSize: 11, fontWeight: 500, paddingTop: 10 }} iconType="circle" />
                  <Bar dataKey="inflow" name="Incoming Supply" fill="#10b981" radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar dataKey="outflow" name="Consumed Order Volume" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Action Queue & Forecasted Stockouts */}
          <div className="space-y-4">
             {/* Spike Alert */}
             <div className="rounded-3xl border border-rose-200/60 bg-rose-50/50 backdrop-blur shadow-sm p-5 relative overflow-hidden flex items-start gap-4">
               <div className="p-3 bg-white rounded-2xl shadow-sm">
                  <Flame size={24} className="text-rose-600" />
               </div>
               <div>
                 <h3 className="text-sm font-bold text-rose-900">Consumption Spike Detected</h3>
                 <p className="text-xs text-rose-700 mt-1 font-medium leading-relaxed">
                   Chicken Breast usage is tracking <b>+42%</b> above forecasted norms for the Tuesday day-part. Emergency transfer recommended immediately to prevent 6PM stockout.
                 </p>
                 <div className="mt-3 flex gap-3">
                   <button className="px-4 py-2 bg-rose-600 text-white text-[11px] font-bold rounded-xl shadow-sm hover:bg-rose-700 transition">Execute Transfer</button>
                   <button className="px-4 py-2 bg-white text-rose-600 border border-rose-200 text-[11px] font-bold rounded-xl hover:bg-rose-50 transition">View Drilldown</button>
                 </div>
               </div>
               <Sparkles size={80} className="absolute -right-4 -bottom-4 text-rose-100 opacity-50 pointer-events-none" />
             </div>

             {/* Forecasted Stockouts List */}
             <div className="rounded-3xl border border-slate-200/60 bg-white shadow-sm overflow-hidden text-sm">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <ShieldAlert size={16} className="text-amber-500" />
                     <h2 className="font-bold text-slate-900">Critical Stockouts Projected</h2>
                   </div>
                   <span className="text-xs font-bold text-slate-400">{forecastedStockouts.length} Items</span>
                </div>
                <div className="divide-y divide-slate-50">
                   {forecastedStockouts.map((item, idx) => (
                      <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                         <div>
                            <p className="font-bold text-slate-900">{item.name}</p>
                            <p className="text-xs font-medium text-slate-500 mt-0.5">Coverage: <span className="text-rose-600 font-bold">{item.daysCover} Days</span> left</p>
                         </div>
                         <button className="px-3 py-1.5 bg-slate-900 text-white text-[10px] uppercase tracking-wider font-bold rounded-lg hover:bg-slate-800 transition">
                            Reorder <span className="text-slate-400 ml-1">{item.reorderRec}u</span>
                         </button>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Sticky AI feed */}
      <div className="w-[320px] shrink-0 sticky top-24 space-y-4">
        <div className="rounded-3xl bg-indigo-900 text-white p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10">
            <Bot size={120} />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-indigo-300" />
            <span className="text-xs font-black tracking-widest uppercase text-indigo-300">AI Supply Strategy</span>
          </div>
          
          <div className="space-y-5 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                 <h4 className="text-[13px] font-bold text-white">Flow Restored</h4>
              </div>
              <p className="text-xs text-indigo-200 leading-relaxed font-medium">Last Friday's emergency reorder of IPA Kegs corrected the weekend coverage deficit. +$1,400 sales protected.</p>
            </div>
            
            <div className="h-px w-full bg-indigo-800/50" />
            
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                 <h4 className="text-[13px] font-bold text-white">Variance Alert ($1,380)</h4>
              </div>
              <p className="text-xs text-indigo-200 leading-relaxed font-medium">Meat category (specifically Ground Beef) is showing significant over-portioned usage compared to associated sales tickets. Investigate back-of-house line portions.</p>
              <button className="mt-3 w-full py-2 bg-indigo-800 hover:bg-indigo-700 transition flex items-center justify-center gap-2 rounded-xl text-xs font-bold text-white shadow-sm border border-indigo-700/50">
                 Run Variance Audit <ArrowRightLeft size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-5 shadow-sm">
          <h3 className="text-[11px] font-black tracking-widest uppercase text-slate-400 mb-4">Action Queue</h3>
          <div className="space-y-3">
             {[
               { title: "Review Draft P.O.", desc: "Sysco delivery tomorrow", type: "Approval" },
               { title: "Excess Prep Waste", desc: "Romaine Hearts +15% loss", type: "Audit" },
             ].map((action, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-300 cursor-pointer transition">
                   <div className="mt-0.5"><Target size={14} className="text-slate-400" /></div>
                   <div>
                      <p className="text-xs font-bold text-slate-900">{action.title}</p>
                      <p className="text-[10px] font-bold text-slate-500 mt-0.5">{action.desc}</p>
                   </div>
                </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// Temporary icon to avoid import errors since Flame wasn't imported initially
function Flame(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
  );
}

// Temporary icon
function Sparkles(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
  );
}
