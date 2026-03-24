"use client";

import { useSupplyFilters } from "@/lib/supplyFilterContext";
import { getSupplyKpis, SHARED_INVENTORY_ITEMS } from "@/lib/supplyDataEngine";
import { PackagePlus, Clock, Zap, TrendingUp, AlertTriangle, ArrowRightLeft, Target, Truck } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, Cell, PieChart, Pie, AreaChart, Area } from "recharts";

export default function IncomingSupplyPage() {
  const { filters } = useSupplyFilters();
  const kpis = getSupplyKpis(filters);

  // Math Invariant Rules
  const incomingWeekly = [
    { week: "W-2", Received: 68000 },
    { week: "W-1", Received: 75000 },
    { week: "Curr", Received: kpis.incomingValue },  // $73,200 explicitly from engine
    { week: "W+1", Received: 82000 },
  ];

  const incomingVsReq = [
    { category: "Meat", incoming: 12000, required: 15000 },
    { category: "Veg", incoming: 8000, required: 9000 }, // Supply gap
    { category: "Bar", incoming: 9500, required: 9500 },
  ];

  const reliabilityData = [
    { name: "On-Time", value: 76 },
    { name: "Delayed", value: 18 },
    { name: "Missed", value: 6 },
  ];

  const pieColors = ["#10b981", "#f59e0b", "#f43f5e"];

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Incoming Supply Snapshot</h1>
          <p className="text-sm text-slate-500">Pipeline analysis, delayed delivery risks, and scheduled inventory restocks.</p>
        </div>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
           { label: "Incoming Supply Units", val: `${kpis.incomingUnits.toLocaleString()}`, sub: "Arrivals next 7 days", icon: PackagePlus, color: "text-blue-900", bg: "bg-blue-50/80 border-blue-200/60" },
           { label: "Incoming Capital Pipeline", val: `$${(kpis.incomingValue/1000).toFixed(1)}k`, sub: "POs outstanding", icon: ArrowRightLeft, color: "text-slate-900", bg: "bg-slate-50 border-slate-200" },
           { label: "Supplier Reliability", val: `76%`, sub: "On-time rate dropping", icon: Clock, color: "text-amber-900", bg: "bg-amber-50/80 border-amber-200/60" },
           { label: "Emergency Orders", val: `4`, sub: "Initiated last 7 days", icon: Zap, color: "text-rose-900", bg: "bg-rose-50/80 border-rose-200/60" }
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incoming Inventory by Week */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Incoming Inventory Capital by Week</h2>
          <p className="text-xs text-slate-500 mb-6">Historical received vs scheduled future PO monetary commitment.</p>
          <div className="flex-1 w-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomingWeekly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
                <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v: any) => `$${Number(v).toLocaleString()}`} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="Received" radius={[4, 4, 0, 0]} barSize={24} fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Supplier Reliability Donut */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex flex-col justify-center">
             <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-900">Supplier Delivery Reliability</h2>
              <p className="text-xs text-slate-500">Trailing 30-day fulfillment state.</p>
            </div>
            <div className="flex-1 w-full relative min-h-[160px]">
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 pt-4">
                <span className="text-2xl font-black text-slate-800">76%</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">On-Time</span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={reliabilityData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} stroke="#fff" strokeWidth={2}>
                    {reliabilityData.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} formatter={(v: any) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
             <div className="mt-4 flex flex-wrap gap-3 justify-center">
                 {reliabilityData.map((cat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 border px-2 py-1 rounded-full bg-slate-50">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pieColors[idx] }}></div>
                        {cat.name}
                    </div>
                 ))}
             </div>
        </div>
      </div>

       {/* Next Deliveries List */}
       <div className="rounded-3xl border border-slate-200/60 bg-white shadow-sm overflow-hidden flex flex-col mt-6">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-0.5">Incoming Supply Log: Next 7 Days</h2>
            <p className="text-xs text-slate-500">Scheduled trucks across active supplier networks.</p>
          </div>
        </div>
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">P.O. Number</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Supplier</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Target Time</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Value ($)</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">PO-49219</td>
                  <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2"><Truck size={14} className="text-slate-400"/> Sysco Main</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-700">Tomorrow, 06:00 AM</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">$21,450</td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex py-1 px-2.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold border bg-emerald-50 text-emerald-700 border-emerald-200">On Schedule</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">PO-22581</td>
                  <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2"><Truck size={14} className="text-slate-400"/> Local Greens</td>
                  <td className="px-4 py-3 text-sm font-medium text-rose-600">Delayed (+24h)</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">$4,200</td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex py-1 px-2.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold border bg-rose-50 text-rose-700 border-rose-200">Critical Delay</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">PO-11933</td>
                  <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2"><Truck size={14} className="text-slate-400"/> BevMo Dist</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-700">Wed, 11:00 AM</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">$18,900</td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex py-1 px-2.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold border bg-slate-50 text-slate-700 border-slate-200">Processing</span>
                  </td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
