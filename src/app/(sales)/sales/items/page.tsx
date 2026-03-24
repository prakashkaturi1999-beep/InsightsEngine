"use client";

import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from "recharts";
import { TrendingUp, TrendingDown, ArrowRight, ArrowDown, ArrowUp, Zap, UtensilsCrossed, ShoppingBag, BarChart3, Wine } from "lucide-react";
import { useSalesFilters, dateRangeLabel, comparisonLabel } from "@/lib/salesFilterContext";
import {
  getFoodKpis, getAlcoholKpis, getTopProducts, getOverviewKpis,
} from "@/lib/salesDataEngine";
import {
  foodTrend7d as foodTrendData, foodDonut, decliningFood as foodDec, increasingFood as foodInc,
  alcoholCategoryDonut as alcoholDonut, alcoholCategoryTable as allAlcoholSparkRows, alcoholItems,
  beerDonut, beerSubTable, whiskeyDonut, whiskeySubTable,
} from "@/lib/salesMockData";

const donutColors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#14b8a6"];
function fmtM(n: number) { return n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`; }

function MiniSpark({ data }: { data: number[] }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pts = data.map((v, i) => `${i * (30 / (data.length - 1))},${14 - ((v - min) / (max - min || 1)) * 14}`).join(" ");
  return (
    <svg width="30" height="14" className="overflow-visible">
      <polyline fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  );
}

// ── Food View ────────────────────────────────────────────────────────────────
function FoodView({ filters }: { filters: any }) {
  const kpis = getFoodKpis(filters);
  const topProducts = getTopProducts(filters);
  const scale = kpis.totalSales / 53250;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Top Item (Qty)", value: kpis.topByQuantity.item, sub: `${kpis.topByQuantity.units.toLocaleString()} units`, icon: UtensilsCrossed, border: "border-indigo-200/60", bg: "bg-gradient-to-br from-indigo-50/80 to-indigo-100/30", labelColor: "text-indigo-500", valueColor: "text-indigo-950", iconColor: "text-indigo-900" },
          { label: "Top Item (Sales)", value: kpis.topBySales.item, sub: `$${kpis.topBySales.sales.toLocaleString()}`, icon: BarChart3, border: "border-emerald-200/60", bg: "bg-gradient-to-br from-emerald-50/80 to-emerald-100/30", labelColor: "text-emerald-600", valueColor: "text-emerald-950", iconColor: "text-emerald-900" },
          { label: "Total Food Sales", value: `$${kpis.totalSales.toLocaleString()}`, sub: "72% of total", icon: ShoppingBag, border: "border-amber-200/60", bg: "bg-gradient-to-br from-amber-50/80 to-amber-100/30", labelColor: "text-amber-600", valueColor: "text-amber-950", iconColor: "text-amber-900" },
          { label: "Food Orders", value: kpis.todaysOrders.toLocaleString(), sub: "avg 2.1 items/order", icon: Zap, border: "border-rose-200/60", bg: "bg-gradient-to-br from-rose-50/80 to-rose-100/30", labelColor: "text-rose-500", valueColor: "text-rose-950", iconColor: "text-rose-900" },
        ].map((c) => (
          <div key={c.label} className={`relative overflow-hidden rounded-3xl border ${c.border} ${c.bg} backdrop-blur-xl p-6 shadow-sm transition-shadow hover:shadow-md`}>
            <div className="absolute -right-4 -top-4 opacity-5">
              <c.icon size={100} className={c.iconColor} />
            </div>
            <div className="relative">
              <p className={`text-[11px] font-bold uppercase tracking-wider ${c.labelColor} mb-1`}>{c.label}</p>
              <p className={`mt-1 text-2xl font-extrabold ${c.valueColor}`}>{c.value}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">{c.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Top 5 Items Trend (7 Day)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={foodTrendData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => Math.round(v * scale).toString()} />
              <Tooltip formatter={((v: number) => [Math.round(v * scale).toString(), "Units"]) as any} contentStyle={{ fontSize: 11, borderRadius: 10, border: "1px solid #e2e8f0" }} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
              {["Burgers", "Wings", "Tacos", "Fries", "Salads"].map((key, i) => (
                <Line key={key} type="monotone" dataKey={key} stroke={donutColors[i]} strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-6 shadow-sm flex flex-col">
          <h2 className="mb-2 text-sm font-semibold text-slate-900">Food Category Mix</h2>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={foodDonut} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={42} outerRadius={70} paddingAngle={2}>
                  {foodDonut.map((_, i) => <Cell key={i} fill={["#6366f1", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"][i]} />)}
                </Pie>
                <Tooltip formatter={((v: number) => [`${v}%`, "Share"]) as any} contentStyle={{ fontSize: 11, borderRadius: 10, border: "1px solid #e2e8f0" }} />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-rose-200/60 bg-white/60 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="border-b border-rose-100 bg-rose-50/50 px-6 py-4 flex items-center gap-2">
            <ArrowDown size={14} className="text-rose-500" />
            <h3 className="text-sm font-bold text-rose-900">Most Declining Items</h3>
          </div>
          <div className="divide-y divide-slate-100 p-2">
            {foodDec.map((i: any) => (
              <div key={i.item} className="flex items-center justify-between p-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{i.item}</p>
                  <p className="text-xs text-slate-500">{Math.round(i.units * scale)} units</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-rose-600">-{i.delta}%</p>
                  <p className="text-[10px] text-slate-400">vs last week</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-emerald-200/60 bg-white/60 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="border-b border-emerald-100 bg-emerald-50/50 px-6 py-4 flex items-center gap-2">
            <ArrowUp size={14} className="text-emerald-500" />
            <h3 className="text-sm font-bold text-emerald-900">Top Increasing Items</h3>
          </div>
          <div className="divide-y divide-slate-100 p-2">
            {foodInc.map((i: any) => (
              <div key={i.item} className="flex items-center justify-between p-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{i.item}</p>
                  <p className="text-xs text-slate-500">{Math.round(i.units * scale)} units</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">+{i.delta}%</p>
                  <p className="text-[10px] text-slate-400">vs last week</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl shadow-sm">
        <div className="border-b border-slate-100/50 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900">Detailed Item Performance</h3>
          <div className="flex gap-2 text-xs font-semibold">
            {["All", "Burgers", "Wings", "Sides", "Mains"].map((cat) => (
              <button key={cat} className={`rounded-lg px-2.5 py-1 transition-colors ${cat === "All" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{cat}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50">
              <tr>
                {["Item", "Category", "Units", "Revenue", "Avg Price", "Margin", "Trend"].map((h) => (
                  <th key={h} className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 ${["Units", "Revenue", "Avg Price", "Margin", "Trend"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topProducts.map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-semibold text-slate-900">{p.item}</td>
                  <td className="px-5 py-3 text-slate-500">Food</td>
                  <td className="px-5 py-3 text-right text-slate-700">{p.units.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right font-semibold text-slate-900">${p.sales.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right text-slate-700">${(p.sales / p.units).toFixed(2)}</td>
                  <td className="px-5 py-3 text-right text-slate-700">72%</td>
                  <td className="px-5 py-3 text-right">
                    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${p.trendPct >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {p.trendPct >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {p.trendPct >= 0 ? "+" : ""}{p.trendPct}%
                    </span>
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

// ── Alcohol View ──────────────────────────────────────────────────────────────
function AlcoholView({ filters }: { filters: any }) {
  const [subView, setSubView] = useState<"all" | "beer" | "whiskey">("all");
  const kpis = getAlcoholKpis(filters);
  const scale = kpis.totalSales / 13700;

  const renderSparkTable = (title: string, data: any[], onClickAction?: (cat: string) => void) => (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex-1">
      <div className="border-b border-slate-100 px-5 py-3">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>
      <table className="min-w-full divide-y divide-slate-100 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {["Category", "Units", "Sales", "Avg Price", "Trend (7d)"].map((h) => (
              <th key={h} className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 ${h !== "Category" ? "text-right" : "text-left"}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((r) => (
            <tr key={r.id} onClick={() => onClickAction?.(r.category || r.subCategory)} className={`transition-colors ${onClickAction ? "cursor-pointer hover:bg-slate-50" : ""}`}>
              <td className="px-4 py-3 font-semibold text-slate-900">{r.category || r.subCategory}</td>
              <td className="px-4 py-3 text-right text-slate-700">{Math.round(r.units * scale).toLocaleString()}</td>
              <td className="px-4 py-3 text-right font-semibold text-slate-900">${Math.round(r.sales * scale).toLocaleString()}</td>
              <td className="px-4 py-3 text-right text-slate-700">${r.avgPrice.toFixed(2)}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <MiniSpark data={r.sparkline} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Sub-nav for Alcohol */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {[
          { id: "all", label: "All Alcohol" },
          { id: "beer", label: "🍺 Beer" },
          { id: "whiskey", label: "🥃 Whiskey / Bourbon" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubView(tab.id as any)}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-[1px] ${subView === tab.id ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {subView === "all" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Alcohol Sales", value: `$${kpis.totalSales.toLocaleString()}`, sub: "20% of net sales", icon: Wine, border: "border-indigo-200/60", bg: "bg-gradient-to-br from-indigo-50/80 to-indigo-100/30", labelColor: "text-indigo-500", valueColor: "text-indigo-950", iconColor: "text-indigo-900" },
              { label: "Total Units Sold", value: kpis.totalUnits.toLocaleString(), sub: "avg 1.2 per order", icon: BarChart3, border: "border-emerald-200/60", bg: "bg-gradient-to-br from-emerald-50/80 to-emerald-100/30", labelColor: "text-emerald-600", valueColor: "text-emerald-950", iconColor: "text-emerald-900" },
              { label: "Top Category", value: kpis.topBySales.item, sub: `$${kpis.topBySales.sales.toLocaleString()}`, icon: TrendingUp, border: "border-amber-200/60", bg: "bg-gradient-to-br from-amber-50/80 to-amber-100/30", labelColor: "text-amber-600", valueColor: "text-amber-950", iconColor: "text-amber-900" },
              { label: "Declining Category", value: kpis.declining.item, sub: `${kpis.declining.delta}% vs last week`, bad: true, icon: TrendingDown, border: "border-rose-200/60", bg: "bg-gradient-to-br from-rose-50/80 to-rose-100/30", labelColor: "text-rose-500", valueColor: "text-rose-600", iconColor: "text-rose-900" },
            ].map((c) => (
              <div key={c.label} className={`relative overflow-hidden rounded-3xl border ${c.border} ${c.bg} backdrop-blur-xl p-6 shadow-sm transition-shadow hover:shadow-md`}>
                <div className="absolute -right-4 -top-4 opacity-5">
                  <c.icon size={100} className={c.iconColor} />
                </div>
                <div className="relative">
                  <p className={`text-[11px] font-bold uppercase tracking-wider ${c.labelColor} mb-1`}>{c.label}</p>
                  <p className={`mt-1 text-2xl font-extrabold ${c.bad ? "text-rose-600" : c.valueColor}`}>{c.value}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">{c.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:w-1/3">
              <h3 className="mb-2 text-sm font-semibold text-slate-900">Alcohol Category Mix</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={alcoholDonut} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2}>
                    {alcoholDonut.map((_: any, i: number) => <Cell key={i} fill={donutColors[i % donutColors.length]} />)}
                  </Pie>
                  <Tooltip formatter={((v: number) => [`${v}%`, "Share"]) as any} contentStyle={{ fontSize: 11, borderRadius: 10, border: "1px solid #e2e8f0" }} />
                  <Legend layout="horizontal" align="center" verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {renderSparkTable("Category Performance", allAlcoholSparkRows, (cat) => {
              if (cat === "Beer") setSubView("beer");
              if (cat === "Whiskey" || cat === "Whiskey / Bourbon") setSubView("whiskey");
            })}
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-900">All Alcohol Items</h3>
              <input type="text" placeholder="Search items..." className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none w-48" />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {["Item", "Category", "Units", "Revenue", "Trend"].map((h) => (
                      <th key={h} className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 ${["Units", "Revenue", "Trend"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {alcoholItems.map((p: any) => (
                    <tr key={p.item} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 font-semibold text-slate-900">{p.item}</td>
                      <td className="px-5 py-3 text-slate-500 text-xs">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{p.category}</span>
                      </td>
                      <td className="px-5 py-3 text-right text-slate-700">{Math.round(p.units * scale).toLocaleString()}</td>
                      <td className="px-5 py-3 text-right font-semibold text-slate-900">${Math.round(p.revenue * scale).toLocaleString()}</td>
                      <td className="px-5 py-3 text-right">
                        <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${p.delta >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                          {p.delta >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                          {p.delta >= 0 ? "+" : ""}{p.delta}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {subView === "beer" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Beer Sales", value: `$${Math.round(allAlcoholSparkRows[0].sales * scale).toLocaleString()}`, border: "border-amber-200/60", bg: "bg-gradient-to-br from-amber-50/80 to-amber-100/30", labelColor: "text-amber-600", valueColor: "text-amber-950" },
              { label: "Beer Share", value: "41.6%", sub: "of alcohol", border: "border-indigo-200/60", bg: "bg-gradient-to-br from-indigo-50/80 to-indigo-100/30", labelColor: "text-indigo-500", valueColor: "text-indigo-950" },
              { label: "Top Category", value: "IPA", sub: `$${Math.round(1250 * scale)}`, border: "border-emerald-200/60", bg: "bg-gradient-to-br from-emerald-50/80 to-emerald-100/30", labelColor: "text-emerald-600", valueColor: "text-emerald-950" },
              { label: "Declining", value: "Stout", sub: "-4% vs last week", bad: true, border: "border-rose-200/60", bg: "bg-gradient-to-br from-rose-50/80 to-rose-100/30", labelColor: "text-rose-500", valueColor: "text-rose-600" },
            ].map((c) => (
              <div key={c.label} className={`relative overflow-hidden rounded-3xl border ${c.border} ${c.bg} backdrop-blur-xl p-6 shadow-sm transition-shadow hover:shadow-md`}>
                <div className="relative">
                  <p className={`text-[11px] font-bold uppercase tracking-wider ${c.labelColor} mb-1`}>{c.label}</p>
                  <p className={`mt-1 text-2xl font-extrabold ${c.bad ? "text-rose-600" : c.valueColor}`}>{c.value}</p>
                  {c.sub && <p className="mt-1 text-xs font-medium text-slate-500">{c.sub}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:w-1/3">
              <h3 className="mb-2 text-sm font-semibold text-amber-900">Beer Flow (by Type)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={beerDonut} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2}>
                    {beerDonut.map((_: any, i: number) => <Cell key={i} fill={["#f59e0b", "#d97706", "#b45309", "#78350f", "#fcd34d"][i]} />)}
                  </Pie>
                  <Tooltip formatter={((v: number) => [`${v}%`, "Share"]) as any} contentStyle={{ fontSize: 11, borderRadius: 10, border: "1px solid #e2e8f0" }} />
                  <Legend layout="horizontal" align="center" verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {renderSparkTable("Beer Sub-Categories", beerSubTable)}
          </div>
        </div>
      )}

      {subView === "whiskey" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Whiskey Sales", value: `$${Math.round(allAlcoholSparkRows[4].sales * scale).toLocaleString()}`, border: "border-orange-200/60", bg: "bg-gradient-to-br from-orange-50/80 to-orange-100/30", labelColor: "text-orange-600", valueColor: "text-orange-950" },
              { label: "Whiskey Share", value: "11.6%", sub: "of alcohol", border: "border-indigo-200/60", bg: "bg-gradient-to-br from-indigo-50/80 to-indigo-100/30", labelColor: "text-indigo-500", valueColor: "text-indigo-950" },
              { label: "Top Category", value: "Bourbon", sub: `$${Math.round(2500 * scale)}`, border: "border-emerald-200/60", bg: "bg-gradient-to-br from-emerald-50/80 to-emerald-100/30", labelColor: "text-emerald-600", valueColor: "text-emerald-950" },
              { label: "Declining", value: "Irish Whiskey", sub: "-2% vs last week", bad: true, border: "border-rose-200/60", bg: "bg-gradient-to-br from-rose-50/80 to-rose-100/30", labelColor: "text-rose-500", valueColor: "text-rose-600" },
            ].map((c) => (
              <div key={c.label} className={`relative overflow-hidden rounded-3xl border ${c.border} ${c.bg} backdrop-blur-xl p-6 shadow-sm transition-shadow hover:shadow-md`}>
                <div className="relative">
                  <p className={`text-[11px] font-bold uppercase tracking-wider ${c.labelColor} mb-1`}>{c.label}</p>
                  <p className={`mt-1 text-2xl font-extrabold ${c.bad ? "text-rose-600" : c.valueColor}`}>{c.value}</p>
                  {c.sub && <p className="mt-1 text-xs font-medium text-slate-500">{c.sub}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:w-1/3">
              <h3 className="mb-2 text-sm font-semibold text-orange-950">Whiskey Profile</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={whiskeyDonut} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2}>
                    {whiskeyDonut.map((_: any, i: number) => <Cell key={i} fill={["#ea580c", "#c2410c", "#9a3412", "#7c2d12", "#f97316"][i]} />)}
                  </Pie>
                  <Tooltip formatter={((v: number) => [`${v}%`, "Share"]) as any} contentStyle={{ fontSize: 11, borderRadius: 10, border: "1px solid #e2e8f0" }} />
                  <Legend layout="horizontal" align="center" verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {renderSparkTable("Whiskey Sub-Categories", whiskeySubTable)}
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN PAGE ──────────────────────────────────────────────────────────────────
export default function ItemsPage() {
  const { filters } = useSalesFilters();
  const [tab, setTab] = useState<"food" | "alcohol">("food");

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Item Performance</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {filters.org}
            {filters.brand !== "All Brands" && ` · ${filters.brand}`}
            {filters.location !== "All Locations" && ` · ${filters.location}`}
            {" · "}{dateRangeLabel(filters.dateRange)} · {comparisonLabel(filters.comparison)}
          </p>
        </div>
        <div className="relative flex rounded-full bg-slate-200/50 p-1 backdrop-blur-md shadow-inner w-max">
          {[
            { id: "food", label: "🍔 Food" },
            { id: "alcohol", label: "🍷 Alcohol" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`relative flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 ${tab === t.id ? "bg-white text-indigo-700 shadow-md" : "text-slate-500 hover:text-slate-800 hover:bg-black/5"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "food" ? <FoodView filters={filters} /> : <AlcoholView filters={filters} />}
    </div>
  );
}
