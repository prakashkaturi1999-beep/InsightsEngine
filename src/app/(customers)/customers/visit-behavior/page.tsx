"use client";

import { useCustomerFilters } from "@/lib/customerFilterContext";
import { getCustomerKpis, SHARED_TOP_CUSTOMERS } from "@/lib/customerDataEngine";
import { CalendarDays, Repeat, Clock, Activity, TrendingUp, Zap, ChevronRight, Hash } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, Cell } from "recharts";

export default function CustomerVisitBehaviorPage() {
  const { filters } = useCustomerFilters();
  const kpis = getCustomerKpis(filters);

  const visitRhythmMatrix = [
    { day: "Monday", breakfast: 12, lunch: 45, dinner: 28, late: 5 },
    { day: "Tuesday", breakfast: 15, lunch: 52, dinner: 31, late: 8 },
    { day: "Wednesday", breakfast: 14, lunch: 48, dinner: 35, late: 12 },
    { day: "Thursday", breakfast: 18, lunch: 65, dinner: 42, late: 18 },
    { day: "Friday", breakfast: 22, lunch: 85, dinner: 95, late: 45 },
    { day: "Saturday", breakfast: 45, lunch: 110, dinner: 120, late: 60 },
    { day: "Sunday", breakfast: 55, lunch: 95, dinner: 75, late: 25 },
  ];

  const forecastData = [
    { week: "W-3", actual: 3.1, forecast: null },
    { week: "W-2", actual: 3.2, forecast: null },
    { week: "W-1", actual: 3.4, forecast: null },
    { week: "Current", actual: 3.4, forecast: 3.5 },
    { week: "W+1", actual: null, forecast: 3.6 },
    { week: "W+2", actual: null, forecast: 3.8 },
  ];

  const getHeatmapColor = (val: number) => {
    if (val > 100) return "bg-indigo-600 text-white";
    if (val > 70) return "bg-indigo-400 text-white";
    if (val > 40) return "bg-indigo-200 text-indigo-900";
    if (val > 20) return "bg-indigo-100 text-indigo-800";
    return "bg-slate-50 text-slate-400";
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Visit Behavior</h1>
        <p className="text-sm text-slate-500">Recency, frequency, and time-of-day behavioral patterns.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Avg Visit Frequency", val: kpis.avgVisit + "/mo", icon: CalendarDays, color: "text-blue-900", bg: "bg-blue-50/80 border-blue-200/60" },
          { label: "Routine Customers", val: kpis.routineCustomers.toLocaleString(), icon: Repeat, color: "text-emerald-900", bg: "bg-emerald-50/80 border-emerald-200/60" },
          { label: "High Frequency", val: "4,250", icon: Zap, color: "text-amber-900", bg: "bg-amber-50/80 border-amber-200/60" },
          { label: "Avg Inactive Days", val: "18.5", icon: Clock, color: "text-slate-900", bg: "bg-slate-50 border-slate-200" },
        ].map((kpi, i) => (
          <div key={i} className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm ${kpi.bg}`}>
            <div className="absolute -right-3 -top-3 opacity-5"><kpi.icon size={80} className={kpi.color} /></div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{kpi.label}</p>
            <p className={`text-3xl font-extrabold ${kpi.color}`}>{kpi.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visit Rhythm Heatmap (Table) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-0.5">Visit Rhythm Matrix</h2>
              <p className="text-xs text-slate-500">Concentration of customer visits by day and daypart.</p>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-200">Heatmap</span>
          </div>
          <div className="p-4 flex-1">
            <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              <div className="text-left">Day</div>
              <div>Breakfast</div>
              <div>Lunch</div>
              <div>Dinner</div>
              <div>Late Night</div>
            </div>
            <div className="space-y-2">
              {visitRhythmMatrix.map((row) => (
                <div key={row.day} className="grid grid-cols-5 gap-2 items-center text-xs font-semibold">
                  <div className="text-slate-500 truncate">{row.day}</div>
                  <div className={`py-3 rounded-lg flex items-center justify-center transition-colors ${getHeatmapColor(row.breakfast)}`}>{row.breakfast}</div>
                  <div className={`py-3 rounded-lg flex items-center justify-center transition-colors ${getHeatmapColor(row.lunch)}`}>{row.lunch}</div>
                  <div className={`py-3 rounded-lg flex items-center justify-center transition-colors ${getHeatmapColor(row.dinner)}`}>{row.dinner}</div>
                  <div className={`py-3 rounded-lg flex items-center justify-center transition-colors ${getHeatmapColor(row.late)}`}>{row.late}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 flex flex-col">
          {/* Action Card */}
          <div className="rounded-3xl border border-indigo-200/60 bg-indigo-50/50 backdrop-blur shadow-sm p-6 relative overflow-hidden">
            <Activity size={100} className="absolute -right-6 -bottom-6 text-indigo-100 opacity-50" />
            <h3 className="text-sm font-bold text-indigo-900 mb-2">Daypart Expansion</h3>
            <p className="text-xs text-indigo-700 mb-4 font-medium leading-relaxed">
              We identified 1,450 customers who exclusively visit for Lunch on Tue-Thu. Sending a "Weekend Dinner BOGO" offer could yield a 6% daypart migration.
            </p>
            <button className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-colors text-white py-2.5 text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 relative z-10">
              Trigger Migration <ChevronRight size={14} />
            </button>
          </div>

          {/* Forecast Line */}
          <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur p-6 shadow-sm flex-1 flex flex-col">
             <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-900">Frequency Forecast (Visits/Mo)</h2>
              <p className="text-xs text-slate-500">Projected cadence shift.</p>
            </div>
            <div className="flex-1 w-full relative min-h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} />
                  <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} name="Actual" />
                  <Line type="monotone" dataKey="forecast" stroke="#8b5cf6" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} name="Forecast" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

       {/* High Frequency Segment Card */}
      <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-0.5">Routine Customer Stable</h2>
              <p className="text-xs text-slate-500">Customers with rock-solid predictable visit patterns.</p>
            </div>
          </div>
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Customer ID</th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Name</th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Cadence</th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Avg Spend</th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right">Reliability Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {SHARED_TOP_CUSTOMERS.filter(c => c.status !== 'At-Risk' && c.status !== 'New').map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-xs font-medium text-slate-400">{c.id}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{c.name}</td>
                    <td className="px-4 py-3 text-right font-bold text-indigo-600">Every {Math.floor(30 / parseFloat(c.visitFreqStr))} Days</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-600">${c.avgSpent.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-2 w-16 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '95%' }} />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600">95%</span>
                      </div>
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
