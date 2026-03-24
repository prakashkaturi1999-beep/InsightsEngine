"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, LogOut, Search, Bell, Settings, Filter, ArrowUpRight, Container, Briefcase, CalendarDays, Activity } from "lucide-react";
import { ExecutiveScopeProvider, useExecutiveScope } from "@/components/executive/ExecutiveScopeProvider";
import { SupplyFilterProvider, useSupplyFilters } from "@/lib/supplyFilterContext";

function InventoryHeader() {
  const { scope: currentScope, setScope: updateScope } = useExecutiveScope();
  const { filters, setFilters } = useSupplyFilters();
  const pathname = usePathname();

  const inventoryNavItems = [
    { name: 'Command Center', path: '/inventory' },
    { name: 'Current Snapshot', path: '/inventory/current' },
    { name: 'Incoming Supply', path: '/inventory/incoming' },
    { name: 'Alerts & Risks', path: '/inventory/alerts-risks' },
    { name: 'Health & Coverage', path: '/inventory/health' },
  ];

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
      {/* Top Utility Bar */}
      <div className="flex h-14 items-center justify-between px-6 border-b border-slate-100">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white font-bold">
              <Package2 size={18} />
            </div>
            <span className="text-sm font-bold text-slate-900 tracking-tight">Insights Engine</span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* Scope Dropdowns */}
          <div className="flex items-center gap-2">
            <div className="flex items-center px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors">
              <Briefcase size={14} className="mr-2 text-slate-400" />
              {filters.org}
              <ChevronDown className="ml-2 opacity-50" size={12} />
            </div>
            <div className="flex items-center px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors">
              {filters.brand}
              <ChevronDown className="ml-2 opacity-50" size={12} />
            </div>
            <div className="flex items-center px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors">
              {filters.location}
              <ChevronDown className="ml-2 opacity-50" size={12} />
            </div>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* Date & Comparison Filters */}
          <div className="flex items-center gap-2">
            <div className="flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors">
              <CalendarDays size={14} className="mr-2 text-slate-400" />
              {filters.dateRange}
              <ChevronDown className="ml-2 opacity-50" size={12} />
            </div>
            <div className="flex items-center px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-500 cursor-pointer hover:bg-slate-100 transition-colors">
              <Activity size={14} className="mr-2 text-slate-400" />
              {filters.comparison}
              <ChevronDown className="ml-2 opacity-50" size={12} />
            </div>
          </div>
        </div>

        {/* Right Nav */}
         <div className="flex items-center gap-4">
           <div className="flex items-center px-3 py-1.5 bg-slate-100/50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 cursor-pointer hover:bg-slate-100 hover:text-slate-900 transition-all">
            <ArrowUpRight className="mr-1.5 rotate-45" size={14} /> Back to Hub
          </div>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex items-center px-6 gap-6 pt-2 overflow-x-auto custom-scrollbar">
         <div className="flex items-center gap-2 pr-4 border-r border-slate-200 py-2">
            <Package2 size={16} className="text-teal-500" />
            <span className="text-[11px] font-black tracking-widest uppercase text-slate-500">Inventory</span>
         </div>
        {inventoryNavItems.map((item) => (
          <a
            key={item.name}
            href={item.path}
            className={`whitespace-nowrap pb-3 pt-2 text-sm font-bold border-b-2 transition-colors ${
              pathname === item.path
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            {item.name}
          </a>
        ))}
      </div>
    </div>
  );
}

// Custom chevron icon
function ChevronDown(props: any) {
  return (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}

function Package2(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package-2"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>
  );
}

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <ExecutiveScopeProvider>
      <SupplyFilterProvider>
        <div className="min-h-screen bg-[#f8f9fb] font-sans selection:bg-teal-100 selection:text-teal-900">
          <InventoryHeader />
          <main className="mx-auto max-w-[1600px] p-6">{children}</main>
        </div>
      </SupplyFilterProvider>
    </ExecutiveScopeProvider>
  );
}
