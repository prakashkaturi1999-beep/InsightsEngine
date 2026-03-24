"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BurgerNav } from "@/components/executive/BurgerNav";
import { CustomerFilterProvider, useCustomerFilters } from "@/lib/customerFilterContext";
import { ExecutiveScopeProvider, useExecutiveScope } from "@/components/executive/ExecutiveScopeProvider";
import { currentScope, hierarchy } from "@/lib/executiveMock";
import { UserCheck, Zap, Building2, CalendarDays, SlidersHorizontal, ArrowLeft } from "lucide-react";

const customerNavItems = [
  { href: "/customers", label: "Command Center", exact: true },
  { href: "/customers/growth", label: "Customer Growth", exact: false },
  { href: "/customers/repeat-rate", label: "Repeat Rate & Risk", exact: false },
  { href: "/customers/visit-behavior", label: "Visit Behavior", exact: false },
  { href: "/customers/value", label: "Customer Value", exact: false },
  { href: "/customers/channel-location", label: "Channel & Location", exact: false },
  { href: "/customers/loyalty-drivers", label: "Loyalty Drivers", exact: false },
];

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <ExecutiveScopeProvider initialScope={currentScope}>
      <CustomerFilterProvider>
        <CustomerShell>{children}</CustomerShell>
      </CustomerFilterProvider>
    </ExecutiveScopeProvider>
  );
}

function CustomerShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { scope, setScope, options } = useExecutiveScope();
  const { filters, setFilters } = useCustomerFilters();

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-20 h-[400px] w-[400px] rounded-full bg-violet-200/15 blur-3xl" />
        <div className="absolute top-1/2 -right-20 h-[350px] w-[350px] rounded-full bg-fuchsia-200/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/90 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 px-6 h-16">
          {/* Left: Burger + Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <BurgerNav />
            <Link href="/" className="flex items-center gap-2.5 group" aria-label="Home">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white shadow-md group-hover:shadow-lg transition-shadow">
                <Zap size={16} className="text-amber-400" />
              </div>
              <span className="text-[15px] font-bold tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors hidden sm:inline">
                Insights Engine
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-center flex-wrap">
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 lg:py-2">
              <Building2 size={13} className="text-slate-400 flex-shrink-0" />
              <select
                value={scope.org}
                onChange={(e) => {
                  setScope({ org: e.target.value, brand: "All Brands", location: "All Locations" });
                  setFilters({ org: e.target.value, brand: "All Brands", location: "All Locations" });
                }}
                className="bg-transparent text-sm font-semibold text-slate-900 outline-none cursor-pointer"
              >
                {options.organizations.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 lg:py-2">
              <select
                value={scope.brand}
                onChange={(e) => {
                  setScope({ ...scope, brand: e.target.value as any, location: "All Locations" });
                  setFilters({ brand: e.target.value, location: "All Locations" });
                }}
                className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
              >
                {options.brands.map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 lg:py-2">
              <select
                value={scope.location}
                onChange={(e) => {
                  setScope({ ...scope, location: e.target.value as any });
                  setFilters({ location: e.target.value });
                }}
                className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
              >
                {options.locations.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>

            <div className="hidden md:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 lg:py-2">
              <CalendarDays size={13} className="text-slate-400 flex-shrink-0" />
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({ dateRange: e.target.value })}
                className="bg-transparent text-sm font-semibold text-slate-900 outline-none cursor-pointer"
              >
                <option value="7d">Last 7 Days</option>
                <option value="14d">Last 14 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="mtd">MTD</option>
                <option value="qtd">QTD</option>
                <option value="ytd">YTD</option>
              </select>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <SlidersHorizontal size={13} className="text-slate-400 flex-shrink-0" />
              <select
                value={filters.comparison}
                onChange={(e) => setFilters({ comparison: e.target.value })}
                className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
              >
                <option value="week">vs last week</option>
                <option value="month">vs last month</option>
                <option value="budget">vs budget</option>
                <option value="target">vs target</option>
              </select>
            </div>
          </div>

          <Link href="/" className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <ArrowLeft size={13} /> Dashboard
          </Link>
        </div>

        <div className="border-t border-slate-100 px-6">
          <div className="flex items-center gap-2 -mb-px overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 pr-4 mr-1 border-r border-slate-200 flex-shrink-0 py-3">
              <UserCheck size={15} className="text-violet-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</span>
            </div>

            {customerNavItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex-shrink-0 px-3 py-3 text-[13px] font-semibold transition-colors border-b-2 whitespace-nowrap ${
                    isActive
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-6 py-6 transition-all duration-300 ease-in-out">
        {children}
      </main>
    </div>
  );
}
