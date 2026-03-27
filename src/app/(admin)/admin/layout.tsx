"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BurgerNav } from "@/components/executive/BurgerNav";
import { ExecutiveScopeProvider, useExecutiveScope } from "@/components/executive/ExecutiveScopeProvider";
import { AdminStoreProvider } from "@/lib/adminStore";
import { AdminFilterProvider, useAdminFilters } from "@/lib/adminFilterContext";
import { currentScope } from "@/lib/executiveMock";
import { UserCog, Zap, Building2, Bell, ArrowLeft, Search } from "lucide-react";

const adminNavItems = [
  { href: "/admin", label: "Access Governance", exact: true },
  { href: "/admin/roles", label: "Role Permissions", exact: false },
  { href: "/admin/audit", label: "Audit Logs", exact: false },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ExecutiveScopeProvider initialScope={currentScope}>
      <AdminStoreProvider>
        <AdminFilterProvider>
          <AdminShell>{children}</AdminShell>
        </AdminFilterProvider>
      </AdminStoreProvider>
    </ExecutiveScopeProvider>
  );
}

function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { scope, setScope, options } = useExecutiveScope();
  const { filters, setFilters } = useAdminFilters();

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Premium ambient background tailored to admin (serious slate/zinc tones) */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-20 h-[450px] w-[450px] rounded-full bg-slate-200/20 blur-3xl" />
        <div className="absolute top-1/2 -right-20 h-[350px] w-[350px] rounded-full bg-slate-300/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/90 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 px-6 h-16">
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

          <div className="flex flex-1 items-center justify-center gap-2 xl:gap-3 flex-wrap">
            <div className="hidden md:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <Building2 size={13} className="text-slate-400 flex-shrink-0" />
              <select
                value={scope.org}
                onChange={(e) =>
                  setScope({ org: e.target.value, brand: "All Brands", location: "All Locations" })
                }
                className="bg-transparent text-sm font-semibold text-slate-900 outline-none cursor-pointer"
                aria-label="Organisation filter"
              >
                {options.organizations.map((org) => (
                  <option key={org} value={org}>
                    {org}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <select
                value={scope.brand}
                onChange={(e) =>
                  setScope({ ...scope, brand: e.target.value as typeof scope.brand, location: "All Locations" })
                }
                className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
                aria-label="Brand filter"
              >
                {options.brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden xl:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <select
                value={scope.location}
                onChange={(e) =>
                  setScope({ ...scope, location: e.target.value as typeof scope.location })
                }
                className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
                aria-label="Location filter"
              >
                {options.locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative flex h-10 min-w-[260px] flex-1 max-w-xl items-center rounded-xl border border-slate-200/60 bg-slate-100 px-3 text-sm shadow-inner transition-all focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-slate-900/10">
              <Search size={16} className="mr-2 flex-shrink-0 text-slate-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
                placeholder="Search users, email, role, domain, or location"
                className="w-full bg-transparent font-medium text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400"
                aria-label="Search users"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-rose-100 bg-rose-50 text-rose-700 shadow-sm shadow-rose-100 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span className="text-xs font-bold tracking-tight">Super Admin Mode</span>
            </div>
            
            <button className="relative rounded-xl border border-slate-200 bg-white p-2 hover:bg-slate-50 transition-colors shadow-sm" aria-label="Alerts">
              <Bell size={17} className="text-slate-600" />
            </button>
            
            <Link href="/" className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              <ArrowLeft size={13} /> Dashboard
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-100 px-6">
          <div className="flex items-center gap-1 -mb-px overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 pr-4 mr-2 border-r border-slate-200 flex-shrink-0 py-3">
              <UserCog size={15} className="text-slate-700" />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">User Admin</span>
            </div>

            {adminNavItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex-shrink-0 px-4 py-3 text-[13px] font-bold transition-all border-b-2 ${
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

      <main className="mx-auto max-w-[1600px] px-4 sm:px-6 py-6 transition-all duration-300 ease-in-out">
        {children}
      </main>
    </div>
  );
}
