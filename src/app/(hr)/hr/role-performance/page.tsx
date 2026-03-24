"use client";

import { useState } from "react";
import { useHrFilters } from "@/lib/hrFilterContext";
import { getHrKpis } from "@/lib/hrDataEngine";
import { Clock, TrendingUp, DollarSign, Award, ChevronDown, ChevronUp, Lightbulb, ChefHat, Trash2, ShieldCheck, ChevronRight } from "lucide-react";

type SortField = 'name' | 'ticketTime' | 'checkAvg' | 'tips' | 'score';
type SortOrder = 'asc' | 'desc';

export default function RolePerformancePage() {
  const { filters } = useHrFilters();
  const kpis = getHrKpis(filters);

  const [sortField, setSortField] = useState<SortField>('score');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const employeeData = [
    { id: 1, name: "Sarah Miller", role: "Server", ticketTime: 14.5, checkAvg: 42.50, tips: 22.4, score: 98 },
    { id: 2, name: "David Lin", role: "Line Cook", ticketTime: 9.2, checkAvg: 0, tips: 0, score: 96 },
    { id: 3, name: "Elena Ramos", role: "Bartender", ticketTime: 6.8, checkAvg: 54.20, tips: 24.1, score: 95 },
    { id: 4, name: "Marcus Johnson", role: "Server", ticketTime: 18.2, checkAvg: 31.10, tips: 18.5, score: 82 },
    { id: 5, name: "Priya Patel", role: "Host", ticketTime: 0, checkAvg: 0, tips: 0, score: 88 },
    { id: 6, name: "James Wilson", role: "Server", ticketTime: 15.1, checkAvg: 28.40, tips: 15.2, score: 76 },
    { id: 7, name: "Alex Kostas", role: "Line Cook", ticketTime: 13.5, checkAvg: 0, tips: 0, score: 79 },
  ];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedData = [...employeeData].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    
    // Sort logic handling numeric properties
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    }
    
    // String sorting (for name)
    const strA = String(valA).toLowerCase();
    const strB = String(valB).toLowerCase();
    if (strA < strB) return sortOrder === 'asc' ? -1 : 1;
    if (strA > strB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />;
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Role Performance Dashboard</h1>
        <p className="text-sm text-slate-500">Employee-level analytics, operational efficiency, and ROI metrics.</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Avg Ticket Time", val: kpis.roleAvgTicketTimeStr, icon: Clock, color: "text-amber-900", bg: "bg-amber-50/80 border-amber-200/60" },
          { label: "Tickets per Labor Hr", val: kpis.ticketsPerLaborHour, icon: TrendingUp, color: "text-blue-900", bg: "bg-blue-50/80 border-blue-200/60" },
          { label: "Check Avg per Server", val: `$${kpis.checkAvgPerServer.toFixed(2)}`, icon: DollarSign, color: "text-emerald-900", bg: "bg-emerald-50/80 border-emerald-200/60" },
          { label: "Labor ROI Index", val: `${kpis.laborRoiIndex}x`, icon: Award, color: "text-indigo-900", bg: "bg-indigo-50/80 border-indigo-200/60" },
        ].map((kpi, i) => (
          <div key={i} className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm ${kpi.bg}`}>
            <div className="absolute -right-3 -top-3 opacity-5"><kpi.icon size={80} className={kpi.color} /></div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{kpi.label}</p>
            <p className={`text-3xl font-extrabold ${kpi.color}`}>{kpi.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Employee Performance Table */}
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl shadow-sm xl:col-span-2 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-0.5">Employee Performance Overview</h2>
              <p className="text-xs text-slate-500">Cross-role metrics sorted by primary KPI target.</p>
            </div>
          </div>
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold cursor-pointer hover:bg-slate-50 rounded-lg transition-colors" onClick={() => handleSort('name')}>
                    <div className="flex items-center">Employee {getSortIcon('name')}</div>
                  </th>
                  <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">Role</th>
                  <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right cursor-pointer hover:bg-slate-50 rounded-lg transition-colors" onClick={() => handleSort('ticketTime')}>
                    <div className="flex items-center justify-end">Ticket Time {getSortIcon('ticketTime')}</div>
                  </th>
                  <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right cursor-pointer hover:bg-slate-50 rounded-lg transition-colors" onClick={() => handleSort('checkAvg')}>
                    <div className="flex items-center justify-end">Check Avg {getSortIcon('checkAvg')}</div>
                  </th>
                  <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right cursor-pointer hover:bg-slate-50 rounded-lg transition-colors" onClick={() => handleSort('tips')}>
                    <div className="flex items-center justify-end">Tip % {getSortIcon('tips')}</div>
                  </th>
                  <th className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold text-right cursor-pointer hover:bg-slate-50 rounded-lg transition-colors" onClick={() => handleSort('score')}>
                    <div className="flex items-center justify-end">ROI Score {getSortIcon('score')}</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sortedData.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{emp.name}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">{emp.role}</td>
                    
                    {/* Ticket Time Color Coding: > 15m is Bad, < 10m is Good for Cooks, undefined for Hosts */}
                    <td className={`px-5 py-3.5 text-right font-medium text-xs ${emp.ticketTime === 0 ? 'text-slate-300' : emp.ticketTime > 15 ? 'text-rose-600 bg-rose-50/50 rounded-md' : emp.ticketTime < 10 ? 'text-emerald-600' : 'text-slate-700'}`}>
                      {emp.ticketTime > 0 ? `${emp.ticketTime}m` : '—'}
                    </td>

                    {/* Check Avg Color Coding: Server > 40 is Good, < 30 is Bad */}
                    <td className={`px-5 py-3.5 text-right font-medium text-xs ${emp.checkAvg === 0 ? 'text-slate-300' : emp.checkAvg > 40 ? 'text-emerald-600' : emp.checkAvg < 30 ? 'text-rose-600 bg-rose-50/50 rounded-md' : 'text-slate-700'}`}>
                      {emp.checkAvg > 0 ? `$${emp.checkAvg.toFixed(2)}` : '—'}
                    </td>

                    {/* Tip % Color Coding: > 20 is Good, < 18 is Bad */}
                    <td className={`px-5 py-3.5 text-right font-medium text-xs ${emp.tips === 0 ? 'text-slate-300' : emp.tips > 20 ? 'text-emerald-600' : emp.tips < 18 ? 'text-rose-600' : 'text-slate-700'}`}>
                      {emp.tips > 0 ? `${emp.tips}%` : '—'}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <span className={`inline-flex items-center justify-center min-w-[32px] px-2 py-1 rounded-md text-xs font-bold border ${emp.score >= 90 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : emp.score < 80 ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                        {emp.score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Supporting Cards Container (Stacked) */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-rose-200/60 bg-rose-50/30 backdrop-blur-xl shadow-sm p-5 cursor-pointer hover:bg-rose-50/50 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                <Trash2 size={20} className="text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-900">High Voids/Discounts</h3>
                <p className="text-xs text-rose-700 mt-0.5">2 servers flag over 4% anomaly logic</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-rose-400" />
          </div>

          <div className="rounded-3xl border border-indigo-200/60 bg-indigo-50/30 backdrop-blur-xl shadow-sm p-5 cursor-pointer hover:bg-indigo-50/50 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <ChefHat size={20} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-indigo-900">Kitchen Performance</h3>
                <p className="text-xs text-indigo-700 mt-0.5">Expo time improved by 1.2m MTD</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-indigo-400" />
          </div>

          <div className="rounded-3xl border border-amber-200/60 bg-amber-50/30 backdrop-blur-xl shadow-sm p-5 cursor-pointer hover:bg-amber-50/50 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <ShieldCheck size={20} className="text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-900">Manager Approvals</h3>
                <p className="text-xs text-amber-700 mt-0.5">14 comps pending GM sign-off</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-amber-400" />
          </div>
        </div>
      </div>

      {/* Narrative Insights */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-50/50 to-white backdrop-blur-xl shadow-sm p-6 flex flex-col sm:flex-row gap-6">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-2xl bg-indigo-100/80 border border-indigo-200 flex items-center justify-center">
            <Lightbulb size={24} className="text-indigo-600" />
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <h2 className="text-base font-bold text-slate-900">Automated Performance Insights</h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <span className="text-indigo-500 font-black mt-0.5">•</span>
              <strong>Server Check Average Deficit:</strong> James Wilson and Marcus Johnson are significantly underperforming the $40 target Check Average, reducing overall FOH Labor ROI.
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <span className="text-indigo-500 font-black mt-0.5">•</span>
              <strong>Peak Kitchen Efficiency:</strong> David Lin is averaging 9.2m ticket times on the grill station, maintaining 96% accuracy with zero remakes MTD.
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-700">
              <span className="text-indigo-500 font-black mt-0.5">•</span>
              <strong>Tip Discrepancy Alert:</strong> FOH tip averages dropped precisely when Voids/Discounts spiked on Tuesday nights—recommend tracking correlation closely.
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
}
