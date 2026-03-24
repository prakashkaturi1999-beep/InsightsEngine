"use client";

import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Award, AlertCircle } from "lucide-react";
import { useSalesFilters, dateRangeLabel, comparisonLabel } from "@/lib/salesFilterContext";
import { employeePerformance } from "@/lib/salesMockData";

export default function EmployeesPage() {
  const { filters } = useSalesFilters();
  const [sortBy, setSortBy] = useState<"revenue" | "guestScore" | "upsellRate">("revenue");

  // Determine multiplier based on scope
  const isNash = filters.org === "Nashville Chicken House";
  const m = isNash ? 0.6 : (filters.brand !== "All Brands" ? 0.4 : (filters.location !== "All Locations" ? 0.15 : 1.0));

  // Determine if we should show a specific location's staff or all
  const locationName = filters.location !== "All Locations" ? filters.location : "All Locations";

  // Scale data
  const data = employeePerformance.map((e) => ({
    ...e,
    revenue: Math.round(e.revenue * m),
    orders: Math.round(e.orders * m),
    location: locationName !== "All Locations" ? locationName : e.location,
  })).sort((a, b) => b[sortBy] - a[sortBy]);

  const topPerformer = data[0];
  const lowestScore = [...data].sort((a, b) => a.guestScore - b.guestScore)[0];
  const topUpsell = [...data].sort((a, b) => b.upsellRate - a.upsellRate)[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Employee Performance</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          {filters.org}
          {filters.brand !== "All Brands" && ` · ${filters.brand}`}
          {filters.location !== "All Locations" && ` · ${filters.location}`}
          {" · "}{dateRangeLabel(filters.dateRange)} · {comparisonLabel(filters.comparison)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 shadow-sm relative overflow-hidden">
          <Award size={80} className="absolute -bottom-4 -right-4 text-indigo-500/10" />
          <div className="flex items-center gap-2 mb-2">
            <Award size={16} className="text-indigo-600" />
            <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-800">Top Sales Earner</p>
          </div>
          <p className="text-xl font-bold text-slate-900">{topPerformer.name}</p>
          <p className="text-sm font-semibold text-indigo-700 mt-1">${topPerformer.revenue.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-0.5">{topPerformer.location}</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm relative overflow-hidden">
          <TrendingUp size={80} className="absolute -bottom-4 -right-4 text-emerald-500/10" />
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-emerald-600" />
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Highest Upsell Rate</p>
          </div>
          <p className="text-xl font-bold text-slate-900">{topUpsell.name}</p>
          <p className="text-sm font-semibold text-emerald-700 mt-1">{topUpsell.upsellRate}% upsells</p>
          <p className="text-xs text-slate-500 mt-0.5">{topUpsell.location}</p>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 shadow-sm relative overflow-hidden">
          <AlertCircle size={80} className="absolute -bottom-4 -right-4 text-rose-500/10" />
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} className="text-rose-600" />
            <p className="text-[11px] font-bold uppercase tracking-wider text-rose-800">At-Risk Guest Score</p>
          </div>
          <p className="text-xl font-bold text-slate-900">{lowestScore.name}</p>
          <p className="text-sm font-semibold text-rose-700 mt-1">{lowestScore.guestScore} score</p>
          <p className="text-xs text-slate-500 mt-0.5">{lowestScore.location}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Revenue by Employee</h2>
            <p className="text-xs text-slate-500">Top 10 staff members across {filters.location !== "All Locations" ? filters.location : "all selected locations"}</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data.slice(0, 10)} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${Math.round(v / 1000)}K`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#475569", fontWeight: 500 }} axisLine={false} tickLine={false} width={100} />
            <Tooltip
              cursor={{ fill: "#f8fafc" }}
              contentStyle={{ fontSize: 11, borderRadius: 10, border: "1px solid #e2e8f0" }}
              formatter={((v: number) => [`$${v.toLocaleString()}`, "Sales"]) as any}
            />
            <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={20}>
              {data.slice(0, 10).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? "#6366f1" : "#c7d2fe"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-900">Detailed Leaderboard</h3>
          <div className="flex gap-2 text-xs font-semibold">
            {[{ id: "revenue", label: "Sales" }, { id: "guestScore", label: "Guest Score" }, { id: "upsellRate", label: "Upsell Rate" }].map((s) => (
              <button
                key={s.id}
                onClick={() => setSortBy(s.id as any)}
                className={`rounded-lg px-2.5 py-1 transition-colors ${sortBy === s.id ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {["Rank", "Name", "Location", "Role", "Orders", "Revenue", "Avg Ticket", "Upsell", "Guest Score"].map((h) => (
                  <th key={h} className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 ${["Orders", "Revenue", "Avg Ticket", "Upsell", "Guest Score"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((e, i) => (
                <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${i === 0 ? "bg-amber-100 text-amber-700" : i < 3 ? "bg-slate-100 text-slate-700" : "text-slate-400"}`}>{i + 1}</span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-900">{e.name}</td>
                  <td className="px-5 py-3.5 text-slate-500">{e.location}</td>
                  <td className="px-5 py-3.5 text-slate-500 capitalize">{e.role}</td>
                  <td className="px-5 py-3.5 text-right font-medium text-slate-700">{e.orders.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-right font-semibold text-slate-900">${e.revenue.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-right text-slate-700">${e.avgTicket.toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-right text-emerald-600 font-medium">{e.upsellRate}%</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold ${e.guestScore >= 4.8 ? "bg-emerald-50 text-emerald-700" : e.guestScore < 4.5 ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-700"}`}>{e.guestScore.toFixed(1)}</span>
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
