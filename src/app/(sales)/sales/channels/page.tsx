"use client";

import { useState } from "react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  TrendingUp, TrendingDown, Store, ShoppingBag, Bike, Utensils,
  ChevronRight, CircleDollarSign, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import Image from "next/image";
import { useSalesFilters, dateRangeLabel, comparisonLabel } from "@/lib/salesFilterContext";
import {
  channelDonut, dineInMenuType, dineInTopItems, dineInDecliningItems,
  deliveryMarketShare, takeawayTopItems, takeawayDecliningItems,
  uberEatsDonut, doorDashDonut, deliveryTopItems, deliveryDecliningItems,
  uberTopItems, doorDashTopItems,
} from "@/lib/salesMockData";
import {
  getChannelOverviewKpis, getChannelSummary, getDineInData,
  getDeliveryData, getChannelDailyTrend, getOverviewDailyTrend
} from "@/lib/salesDataEngine";

const donutColors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

function ItemListPanel({ title, items, type, scaleFactor }: { title: string, items: any[], type: 'best' | 'worst', scaleFactor: number }) {
  const isBest = type === 'best';
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h3>
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isBest ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
          {isBest ? <TrendingUp size={16} strokeWidth={2.5} /> : <TrendingDown size={16} strokeWidth={2.5} />}
        </div>
      </div>
      <div className="space-y-3">
        {items.map((it, idx) => (
          <div key={idx} className="group flex items-center justify-between rounded-xl border border-slate-100 bg-white p-2.5 transition-all hover:border-slate-300 hover:shadow-md">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg bg-slate-50 shadow-sm border border-slate-100">
                {it.image ? <Image src={it.image} alt={it.item} fill className="object-cover transition-transform duration-500 group-hover:scale-110" unoptimized /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900 leading-tight">{it.item}</p>
                <p className="mt-0.5 text-xs font-medium text-slate-500">{Math.round(it.units * scaleFactor).toLocaleString()} units</p>
              </div>
            </div>
            <div className="text-right pl-3">
              <p className="text-sm font-black tracking-tight text-slate-900">
                {it.sales ? `$${Math.round(it.sales * scaleFactor).toLocaleString()}` : `$${(it.avgPrice ?? 0).toFixed(2)}`}
              </p>
              {it.delta !== undefined && (
                <div className={`mt-0.5 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${it.delta > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {it.delta > 0 ? <ArrowUpRight size={10} strokeWidth={3} /> : <ArrowDownRight size={10} strokeWidth={3} />}
                  {Math.abs(it.delta)}%
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Overview View ──────────────────────────────────────────────────────────────
function OverviewView({ filters }: { filters: any }) {
  const k = getChannelOverviewKpis(filters);
  const table = getChannelSummary(filters);
  const trend = getOverviewDailyTrend(filters);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Sales", value: k.totalSales, icon: CircleDollarSign, border: "border-indigo-200/60", bg: "bg-gradient-to-br from-indigo-50/80 to-indigo-100/30", labelColor: "text-indigo-500", valueColor: "text-indigo-950", iconColor: "text-indigo-900", pillBg: "bg-indigo-200/50 text-indigo-700" },
          { label: "Dine-In", value: k.dineIn, icon: Utensils, border: "border-emerald-200/60", bg: "bg-gradient-to-br from-emerald-50/80 to-emerald-100/30", labelColor: "text-emerald-600", valueColor: "text-emerald-950", iconColor: "text-emerald-900", pillBg: "bg-emerald-200/50 text-emerald-800" },
          { label: "Takeout", value: k.takeaway, icon: ShoppingBag, border: "border-amber-200/60", bg: "bg-gradient-to-br from-amber-50/80 to-amber-100/30", labelColor: "text-amber-600", valueColor: "text-amber-950", iconColor: "text-amber-900", pillBg: "bg-amber-200/50 text-amber-800" },
          { label: "3rd Party", value: k.delivery, icon: Bike, border: "border-rose-200/60", bg: "bg-gradient-to-br from-rose-50/80 to-rose-100/30", labelColor: "text-rose-500", valueColor: "text-rose-950", iconColor: "text-rose-900", pillBg: "bg-rose-200/50 text-rose-700" },
        ].map((c) => (
          <div key={c.label} className={`group relative overflow-hidden rounded-3xl border ${c.border} ${c.bg} backdrop-blur-xl p-6 shadow-sm transition-shadow hover:shadow-md`}>
            <div className="absolute -right-4 -top-4 opacity-5">
              <c.icon size={100} className={c.iconColor} />
            </div>
            <div className="relative">
              <p className={`text-[11px] font-bold uppercase tracking-wider ${c.labelColor} mb-1`}>{c.label}</p>
              <p className={`text-3xl font-extrabold ${c.valueColor}`}>${c.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-sm font-bold text-slate-900 uppercase tracking-widest">Multi-Channel Growth Trajectory</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradDineIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradDelivery" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradPickup" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", fontWeight: 600 }} />
              <Area type="monotone" dataKey="dineIn" name="Dine-In" stroke="#10b981" strokeWidth={3} fill="url(#gradDineIn)" stackId="1" activeDot={{ r: 6, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="pickup" name="Takeout" stroke="#f59e0b" strokeWidth={3} fill="url(#gradPickup)" stackId="1" activeDot={{ r: 6, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="delivery" name="3rd Party" stroke="#6366f1" strokeWidth={3} fill="url(#gradDelivery)" stackId="1" activeDot={{ r: 6, strokeWidth: 0 }} />
              <Legend verticalAlign="top" iconType="circle" wrapperStyle={{ fontSize: 12, fontWeight: 600, paddingBottom: 15 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
          <h2 className="mb-2 text-sm font-bold text-slate-900 uppercase tracking-widest">
            Channel Mix
          </h2>
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={channelDonut} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} stroke="none">
                  {channelDonut.map((_, i) => <Cell key={i} fill={donutColors[i % donutColors.length]} />)}
                </Pie>
                <Tooltip formatter={((v: number) => [`${v}%`, "Share"]) as any} contentStyle={{ fontSize: 12, borderRadius: 12, border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", fontWeight: 600 }} cursor={false} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            {channelDonut.map((d, i) => (
              <div key={d.name} className="flex flex-col items-center bg-slate-50 rounded-lg py-2">
                <div className="h-3 w-3 rounded-full mb-1.5 shadow-sm" style={{ backgroundColor: donutColors[i % donutColors.length] }} />
                <span className="font-semibold text-slate-500 mb-0.5">{d.name}</span>
                <span className="font-black text-slate-900 text-sm">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-3 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col">
          <div className="border-b border-slate-100 bg-slate-50/80 px-8 py-5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Performance Summary Matrix</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Channel", "Orders", "Revenue", "Avg Order", "Trend"].map((h) => (
                    <th key={h} className="px-8 py-5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {table.map((r, i) => (
                  <tr key={i} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-5 font-bold text-slate-900 tracking-tight flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: donutColors[i % donutColors.length] }} />
                      {r.channel}
                    </td>
                    <td className="px-8 py-5 font-medium text-slate-600">{r.orders.toLocaleString()}</td>
                    <td className="px-8 py-5 font-black text-slate-900 tracking-tight">${r.revenue.toLocaleString()}</td>
                    <td className="px-8 py-5 font-medium text-slate-600">${r.aov.toFixed(2)}</td>
                    <td className="px-8 py-5">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold shadow-sm ${r.delta >= 0 ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}>
                        {r.delta >= 0 ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
                        {r.delta >= 0 ? "+" : ""}{r.delta}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Dine-In View ───────────────────────────────────────────────────────────────
function DineInView({ filters }: { filters: any }) {
  const { kpis, trend } = getDineInData(filters);
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/80 to-emerald-100/30 backdrop-blur-xl p-8 shadow-sm lg:col-span-1 transition-shadow hover:shadow-md">
          <div className="absolute -right-8 -bottom-8 opacity-[0.03]">
            <Utensils size={180} className="text-emerald-950" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-6 text-emerald-800">
              <Utensils size={24} />
              <h2 className="text-base font-bold tracking-widest uppercase">Dine-In Operations</h2>
            </div>
            <p className="text-sm font-bold uppercase tracking-wider text-emerald-600 mb-1">Total Revenue</p>
            <p className="text-5xl font-black tracking-tighter text-emerald-950 mb-8">${kpis.sales.toLocaleString()}</p>

            <div className="grid grid-cols-2 gap-4 border-t border-emerald-200/60 pt-6 text-emerald-900">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Avg Ticket</p>
                <p className="text-xl font-extrabold mt-0.5">${kpis.avgOrder.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Peak Hour</p>
                <p className="text-xl font-extrabold mt-0.5">7:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-sm font-bold text-slate-900 uppercase tracking-widest">Revenue Trajectory</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="dineInGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", fontWeight: 600 }} formatter={((v: number) => [`$${v.toLocaleString()}`]) as any} />
              <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={4} fill="url(#dineInGrad)" activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ItemListPanel title="Top Drivers (Dine-In)" items={dineInTopItems} type="best" scaleFactor={kpis.sales / 35050} />
        <ItemListPanel title="Declining Velocity (Dine-In)" items={dineInDecliningItems} type="worst" scaleFactor={kpis.sales / 35050} />
      </div>
    </div>
  );
}

// ── Takeaway View ───────────────────────────────────────────────────────────────
function TakeawayView({ filters }: { filters: any }) {
  const ch = getChannelSummary(filters).find((c) => c.channel === "Takeaway")!;
  const trend = getChannelDailyTrend(filters);
  const scale = ch.revenue / 10750;
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="relative overflow-hidden rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-amber-100/30 backdrop-blur-xl p-8 shadow-sm lg:col-span-1 transition-shadow hover:shadow-md">
          <div className="absolute -right-8 -bottom-8 opacity-[0.03]">
            <ShoppingBag size={180} className="text-amber-950" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-6 text-amber-800">
              <ShoppingBag size={24} />
              <h2 className="text-base font-bold tracking-widest uppercase">Takeaway</h2>
            </div>
            <p className="text-sm font-bold uppercase tracking-wider text-amber-600 mb-1">Total Revenue</p>
            <p className="text-5xl font-black tracking-tighter text-amber-950 mb-4">${ch.revenue.toLocaleString()}</p>
            <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-200 bg-amber-100/50 text-amber-800 backdrop-blur-md`}>
              {ch.delta >= 0 ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
              {ch.delta >= 0 ? "+" : ""}{ch.delta}% vs Base
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-amber-200/60 pt-6 mt-6 text-amber-900">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Total Orders</p>
                <p className="text-xl font-extrabold mt-0.5">{ch.orders.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Avg Ticket</p>
                <p className="text-xl font-extrabold mt-0.5">${ch.aov.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-sm font-bold text-slate-900 uppercase tracking-widest">Takeaway Volume</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="takeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", fontWeight: 600 }} />
              <Area type="monotone" dataKey="takeaway" name="Takeaway Revenue" stroke="#f59e0b" strokeWidth={4} fill="url(#takeGrad)" activeDot={{ r: 6, strokeWidth: 0, fill: "#f59e0b" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ItemListPanel title="Top Drivers (Takeout)" items={takeawayTopItems} type="best" scaleFactor={scale} />
        <ItemListPanel title="Declining (Takeout)" items={takeawayDecliningItems} type="worst" scaleFactor={scale} />
      </div>
    </div>
  );
}

// ── Delivery View (Third-Party) ────────────────────────────────────────────────
function DeliveryView({ filters }: { filters: any }) {
  const { kpis, trend } = getDeliveryData(filters);
  const factor = kpis.totalSales / 7450;
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="relative overflow-hidden rounded-3xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50/80 to-indigo-100/30 backdrop-blur-xl p-8 shadow-sm lg:col-span-1 transition-shadow hover:shadow-md">
          <div className="absolute -right-8 -bottom-8 opacity-[0.03]">
            <Bike size={180} className="text-indigo-950" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-6 text-indigo-800">
              <Bike size={24} />
              <h2 className="text-base font-bold tracking-widest uppercase">3rd Party Delivery</h2>
            </div>
            <p className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-1">Total Network Revenue</p>
            <p className="text-5xl font-black tracking-tighter text-indigo-950 mb-8">${kpis.totalSales.toLocaleString()}</p>

            <div className="space-y-4 border-t border-indigo-200/60 pt-6 text-indigo-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-[#06C167] shadow-sm"><Bike size={12} color="white" /></div>
                  <p className="text-sm font-extrabold text-indigo-800">Uber Eats</p>
                </div>
                <p className="text-base font-extrabold">${kpis.uberEats.toLocaleString()}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-[#FF3008] shadow-sm"><TruckIcon size={12} color="white" /></div>
                  <p className="text-sm font-extrabold text-indigo-800">DoorDash</p>
                </div>
                <p className="text-base font-extrabold">${kpis.doorDash.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-sm font-bold text-slate-900 uppercase tracking-widest">Platform Battle Trajectory</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="uberGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06C167" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#06C167" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF3008" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#FF3008" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", fontWeight: 600 }} />
              <Area type="monotone" dataKey="uber" name="Uber Eats" stroke="#06C167" strokeWidth={3} fill="url(#uberGrad)" activeDot={{ r: 6, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="doordash" name="DoorDash" stroke="#FF3008" strokeWidth={3} fill="url(#dashGrad)" activeDot={{ r: 6, strokeWidth: 0 }} />
              <Legend verticalAlign="top" iconType="circle" wrapperStyle={{ fontSize: 12, fontWeight: 600, paddingBottom: 15 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ItemListPanel title="Top Drivers (Network)" items={deliveryTopItems} type="best" scaleFactor={factor} />
          <ItemListPanel title="Declining (Network)" items={deliveryDecliningItems} type="worst" scaleFactor={factor} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Uber Eats - Top Index</h3>
              <div className="flex h-7 w-7 items-center justify-center rounded bg-[#06C167] shadow-sm"><Bike size={14} color="white" /></div>
            </div>
            <div className="p-2 space-y-1">
              {uberTopItems.map((r, i) => (
                <div key={r.item} className="flex items-center justify-between rounded-lg p-2.5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-400 w-4 text-center">{i + 1}</span>
                    <div className="relative h-9 w-9 overflow-hidden rounded-md bg-slate-100">
                      {r.image && <Image src={r.image} alt={r.item} fill className="object-cover" unoptimized />}
                    </div>
                    <span className="text-sm font-bold text-slate-800">{r.item}</span>
                  </div>
                  <span className="font-black text-slate-900 text-sm tracking-tight">${Math.round(r.sales * (kpis.uberEats / 3200)).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">DoorDash - Top Index</h3>
              <div className="flex h-7 w-7 items-center justify-center rounded bg-[#FF3008] shadow-sm"><TruckIcon size={14} color="white" /></div>
            </div>
            <div className="p-2 space-y-1">
              {doorDashTopItems.map((r, i) => (
                <div key={r.item} className="flex items-center justify-between rounded-lg p-2.5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-400 w-4 text-center">{i + 1}</span>
                    <div className="relative h-9 w-9 overflow-hidden rounded-md bg-slate-100">
                      {r.image && <Image src={r.image} alt={r.item} fill className="object-cover" unoptimized />}
                    </div>
                    <span className="text-sm font-bold text-slate-800">{r.item}</span>
                  </div>
                  <span className="font-black text-slate-900 text-sm tracking-tight">${Math.round(r.sales * (kpis.doorDash / 3400)).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const TruckIcon = ({ size, color }: { size: number, color: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 17h4V5H2v12h3M20 17h2v-9h-4V5H14v12h3M7 17a2 2 0 1 0 4 0 2 2 0 1 0-4 0M17 17a2 2 0 1 0 4 0 2 2 0 1 0-4 0" />
  </svg>
)


// ── MAIN PAGE ──────────────────────────────────────────────────────────────────
type ChannelView = "overview" | "dineIn" | "takeaway" | "delivery";

export default function ChannelsPage() {
  const { filters } = useSalesFilters();
  const [view, setView] = useState<ChannelView>("overview");

  const TABS = [
    { id: "overview", label: "Overview", icon: Store },
    { id: "dineIn", label: "Dine-In Operations", icon: Utensils },
    { id: "takeaway", label: "Takeout Volumes", icon: ShoppingBag },
    { id: "delivery", label: "3rd Party Network", icon: Bike },
  ] as const;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Channel Command</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {filters.org}
            {filters.brand !== "All Brands" && ` · ${filters.brand}`}
            {filters.location !== "All Locations" && ` · ${filters.location}`}
            {" · "}{dateRangeLabel(filters.dateRange)}{" · "}{comparisonLabel(filters.comparison)}
          </p>
        </div>

        <div className="relative flex rounded-full bg-slate-200/50 p-1 backdrop-blur-md shadow-inner w-max">
          {TABS.map((t) => {
            const active = view === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setView(t.id as any)}
                className={`relative flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 ${active
                    ? "bg-white text-indigo-700 shadow-md transform scale-100"
                    : "text-slate-500 hover:text-slate-800 hover:bg-black/5 scale-95"
                  }`}
              >
                <t.icon size={16} strokeWidth={active ? 3 : 2} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-[600px]">
        {view === "overview" && <OverviewView filters={filters} />}
        {view === "dineIn" && <DineInView filters={filters} />}
        {view === "takeaway" && <TakeawayView filters={filters} />}
        {view === "delivery" && <DeliveryView filters={filters} />}
      </div>
    </div>
  );
}
