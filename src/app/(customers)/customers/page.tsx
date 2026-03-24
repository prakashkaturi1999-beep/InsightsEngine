"use client";

import { useCustomerFilters } from "@/lib/customerFilterContext";
import { getCustomerKpis, SHARED_TOP_CUSTOMERS } from "@/lib/customerDataEngine";
import { Users, UserPlus, Repeat, AlertTriangle, TrendingUp, Store, ShoppingBag, MapPin, Sparkles, ChevronRight, Fingerprint, Crown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const channelColors = ["#f59e0b", "#10b981", "#6366f1", "#8b5cf6"];
const locationColors = ["#ec4899", "#ef4444", "#3b82f6", "#14b8a6"];

export default function CustomerCommandCenter() {
  const { filters } = useCustomerFilters();
  const kpis = getCustomerKpis(filters);

  const channelMix = [
    { name: "Dine-In", value: 45 },
    { name: "Takeaway", value: 25 },
    { name: "Delivery App", value: 20 },
    { name: "Drive-Thru", value: 10 },
  ]; // Sums exactly to 100

  const locationSnapshot = [
    { name: "Downtown (001)", value: 42 },
    { name: "Uptown (002)", value: 38 },
    { name: "Westside (003)", value: 20 },
  ]; // Sums exactly to 100

  const growthTrend = [
    { month: "W1", active: 16500, new: 1200, repeat: 10100 },
    { month: "W2", active: 16900, new: 1350, repeat: 10400 },
    { month: "W3", active: 17400, new: 1400, repeat: 10850 },
    { month: "W4", active: 18200, new: 1450, repeat: 11284 },
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-6 pb-12">
      {/* Main Content Column */}
      <div className="flex-1 space-y-6">
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Analytics</h1>
          <p className="text-sm text-slate-500">Base expansion, repeat behavior, and high-level lifetime value tracking.</p>
        </div>

        {/* Top KPIs Level 1 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Active Customers", val: kpis.activeCustomers.toLocaleString(), icon: Users, color: "text-blue-900", bg: "bg-blue-50/80 border-blue-200/60" },
            { label: "New Customers", val: kpis.newCustomers.toLocaleString(), icon: UserPlus, color: "text-emerald-900", bg: "bg-emerald-50/80 border-emerald-200/60" },
            { label: "Repeat Rate", val: kpis.repeatRatePct + "%", icon: Repeat, color: "text-indigo-900", bg: "bg-indigo-50/80 border-indigo-200/60" },
            { label: "At-Risk Customers", val: kpis.atRiskCustomers.toLocaleString(), icon: AlertTriangle, color: "text-rose-900", bg: "bg-rose-50/80 border-rose-200/60" },
          ].map((kpi, i) => (
            <div key={i} className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm ${kpi.bg}`}>
              <div className="absolute -right-3 -top-3 opacity-5"><kpi.icon size={80} className={kpi.color} /></div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{kpi.label}</p>
              <p className={`text-3xl font-extrabold ${kpi.color}`}>{kpi.val}</p>
            </div>
          ))}
        </div>

        {/* Top KPIs Level 2 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Avg Visit freq", val: kpis.avgVisit + "/mo", icon: TrendingUp },
            { label: "Avg LTV", val: "$" + kpis.avgLtv.toFixed(2), icon: ShoppingBag },
            { label: "VIP Share", val: kpis.vipSharePct + "%", icon: Crown },
            { label: "Multi-Channel", val: kpis.multiChannelPct + "%", icon: Store },
          ].map((kpi, i) => (
            <div key={i} className="rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow-sm flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                <kpi.icon size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{kpi.label}</p>
                <p className="text-lg font-bold text-slate-900">{kpi.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-1">Customer Growth Trend</h2>
            <p className="text-xs text-slate-500 mb-4">Active vs Repeat expansion over time.</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
                  <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11, fontWeight: 500, paddingTop: 10 }} iconType="circle" />
                  <Line type="monotone" dataKey="active" name="Active" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="repeat" name="Repeat" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="new" name="New" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex flex-col items-center">
            <div className="w-full text-left mb-2">
              <h2 className="text-sm font-bold text-slate-900">Channel Mix</h2>
              <p className="text-xs text-slate-500">Exact 100% distribution.</p>
            </div>
            <div className="flex-1 w-full relative min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={channelMix} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} stroke="none" paddingAngle={2}>
                    {channelMix.map((_, i) => <Cell key={i} fill={channelColors[i % channelColors.length]} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", fontSize: 12 }} formatter={(v: any) => `${v}%`} />
                  <Legend layout="horizontal" align="center" verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 500, paddingTop: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Actionable Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 mb-0.5">Top Customers Watchlist</h2>
                <p className="text-xs text-slate-500">Highest LTV VIPs across portfolio.</p>
              </div>
            </div>
            <div className="overflow-x-auto p-2">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Customer</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Visits</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">LTV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {SHARED_TOP_CUSTOMERS.filter(c => c.status === 'VIP').slice(0, 4).map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5"><Crown size={12} className="text-amber-500" /> {c.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{c.id}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-indigo-600">{c.visitFreqStr}</td>
                      <td className="px-4 py-3 text-right font-extrabold text-emerald-600">${c.ltv.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 mb-0.5">At-Risk Retention Threat</h2>
                <p className="text-xs text-slate-500">Customers nearing 45-day inactivity cliff.</p>
              </div>
            </div>
            <div className="overflow-x-auto p-2">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Customer</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Last Visit</th>
                    <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {SHARED_TOP_CUSTOMERS.filter(c => c.status === 'At-Risk').slice(0, 4).map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{c.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{c.id}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-rose-600">{c.lastVisitDaysAgo} days</td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex py-1 px-2.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Right Sidebar: Sticky Insights Feed */}
      <div className="w-full xl:w-80 flex-shrink-0 space-y-4">
        <div className="sticky top-20 space-y-4">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute -right-10 -top-10 opacity-10">
              <Sparkles size={120} />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-indigo-200" />
              <h2 className="text-sm font-bold tracking-tight">AI Strategy Engine</h2>
            </div>
            <p className="text-xs text-indigo-100 font-medium mb-4 leading-relaxed">
              Based on the {kpis.newPct}% surge in New Customers this week, deploying an automated 7-day win-back SMS yields a projected 14% lift in Repeat Rate.
            </p>
            <button className="w-full rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white py-2 text-xs font-bold border border-white/20 backdrop-blur flex items-center justify-center gap-1.5">
              Launch Campaign <ChevronRight size={14} />
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Live Signals</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-tight">Downtown Loyalty Spike</p>
                  <p className="text-xs text-slate-500 mt-1">Downtown (001) drove 42% of all VIP return visits yesterday.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-tight">Delivery Churn Warning</p>
                  <p className="text-xs text-slate-500 mt-1">Multi-channel customers abandoning the native app at 3x rate.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-tight">New Item Affinity</p>
                  <p className="text-xs text-slate-500 mt-1">38% of new customers ordered 'Classic Burger'. Top acquisition hook.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
