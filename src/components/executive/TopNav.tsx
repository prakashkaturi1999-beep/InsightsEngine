"use client";

import { useState } from "react";
import Link from "next/link";
import type { ExecutiveUser } from "@/lib/executiveMock";
import { RoleBadge } from "@/components/executive/RoleBadge";
import { AccessControlPanel } from "@/components/executive/AccessControlPanel";
import { useExecutiveScope } from "@/components/executive/ExecutiveScopeProvider";
import {
  Bell,
  ChevronDown,
  Settings,
  Shield,
  User,
  LogOut,
  GitBranch,
  CalendarDays,
  SlidersHorizontal,
  Zap,
} from "lucide-react";

type Props = {
  user: ExecutiveUser;
  dateRange?: string;
  onDateRangeChange?: (v: string) => void;
  comparison?: string;
  onComparisonChange?: (v: string) => void;
};

export function TopNav({ user, dateRange, onDateRangeChange, comparison, onComparisonChange }: Props) {
  const { scope, setScope, contextLine, options } = useExecutiveScope();
  const [profileOpen, setProfileOpen] = useState(false);
  const [govOpen, setGovOpen] = useState(false);
  const [scopeOpen, setScopeOpen] = useState(false);

  const canManageAccess = user.role === "CEO" || user.role === "OrgAdmin";
  const canSeeSettings = user.role === "CEO" || user.role === "OrgAdmin" || user.role === "CFO";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/90 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 px-6 h-16">

          {/* LEFT: Logo (acts as home button) — sidebar toggle is in BurgerNav */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group flex-shrink-0"
            aria-label="Go to dashboard home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white shadow-md group-hover:shadow-lg transition-shadow">
              <Zap size={16} className="text-amber-400" />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors hidden sm:inline">
              Insights Engine
            </span>
          </Link>

          {/* CENTER: Scope + time filters */}
          <div className="flex items-center gap-2 flex-1 justify-center">
            {/* Scope switcher */}
            <div className="relative">
              <button
                onClick={() => setScopeOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm hover:bg-slate-100 hover:border-slate-300 transition-all"
                aria-label="Open scope switcher"
              >
                <GitBranch size={14} className="text-slate-500 flex-shrink-0" />
                <span className="font-semibold text-slate-900 max-w-[200px] truncate">
                  {contextLine}
                </span>
                <ChevronDown size={13} className="text-slate-400 flex-shrink-0" />
              </button>

              {scopeOpen && (
                <div className="fade-in-up absolute left-0 mt-2 w-[340px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] z-50">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <div className="text-sm font-semibold text-slate-900">Portfolio Scope</div>
                    <div className="mt-0.5 text-xs text-slate-500">Organisation → Brand → Location</div>
                  </div>
                  <div className="grid gap-2.5 p-4">
                    <ScopeSelect
                      label="Organisation"
                      value={scope.org}
                      options={options.organizations}
                      onChange={(org) => setScope({ org, brand: "All Brands", location: "All Locations" })}
                    />
                    <ScopeSelect
                      label="Brand"
                      value={scope.brand}
                      options={options.brands}
                      onChange={(brand) => setScope({ ...scope, brand: brand as any, location: "All Locations" })}
                    />
                    <ScopeSelect
                      label="Location"
                      value={scope.location}
                      options={options.locations}
                      onChange={(location) => setScope({ ...scope, location: location as any })}
                    />
                  </div>
                  <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 flex items-center justify-between">
                    <div className="text-xs text-slate-500 font-medium">{contextLine}</div>
                    <button
                      onClick={() => setScopeOpen(false)}
                      className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Time filter */}
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <CalendarDays size={14} className="text-slate-500 flex-shrink-0" />
              <select
                value={dateRange}
                onChange={(e) => onDateRangeChange?.(e.target.value)}
                className="bg-transparent text-sm font-semibold text-slate-900 outline-none cursor-pointer"
                aria-label="Date range"
              >
                <option value="7d">Last 7 Days</option>
                <option value="14d">Last 14 Days</option>
                <option value="mtd">MTD</option>
                <option value="qtd">QTD</option>
                <option value="ytd">YTD</option>
              </select>
            </div>

            {/* Comparison filter */}
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 hidden md:flex">
              <SlidersHorizontal size={14} className="text-slate-500 flex-shrink-0" />
              <select
                value={comparison}
                onChange={(e) => onComparisonChange?.(e.target.value)}
                className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
                aria-label="Comparison"
              >
                <option value="week">vs last week</option>
                <option value="month">vs last month</option>
                <option value="budget">vs budget</option>
                <option value="target">vs target</option>
              </select>
            </div>
          </div>

          {/* RIGHT: Actions + profile */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="relative rounded-xl border border-slate-200 bg-white p-2 hover:bg-slate-50 transition-colors" aria-label="Notifications">
              <Bell size={17} className="text-slate-600" />
              <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white leading-none">6</span>
            </button>

            {canManageAccess && (
              <button onClick={() => setGovOpen(true)} className="rounded-xl border border-slate-200 bg-white p-2 hover:bg-slate-50 transition-colors" aria-label="Access governance">
                <Shield size={17} className="text-slate-600" />
              </button>
            )}

            {canSeeSettings && (
              <button className="rounded-xl border border-slate-200 bg-white p-2 hover:bg-slate-50 transition-colors hidden sm:block" aria-label="Settings">
                <Settings size={17} className="text-slate-600" />
              </button>
            )}

            <button className="rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm hidden sm:block">
              Export
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white pl-1 pr-2.5 py-1 hover:bg-slate-50 transition-colors"
                aria-label="Profile menu"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-700 text-white text-xs font-bold shadow-sm flex-shrink-0">
                  {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-semibold text-slate-900 leading-tight">{user.name}</div>
                  <div className="text-[11px] text-slate-500">{user.title}</div>
                </div>
                <ChevronDown size={13} className="text-slate-400" />
              </button>

              {profileOpen && (
                <div className="fade-in-up absolute right-0 mt-2 w-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] z-50">
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white text-sm font-bold shadow-sm flex-shrink-0">
                        {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{user.name}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                        <div className="mt-1"><RoleBadge badge={user.accessBadge} /></div>
                      </div>
                    </div>
                    <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Viewing</div>
                      <div className="mt-0.5 text-xs text-slate-700 font-medium">{contextLine}</div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                        <Settings size={13} /> Account
                      </button>
                      {canManageAccess ? (
                        <button onClick={() => { setProfileOpen(false); setGovOpen(true); }} className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:opacity-90">
                          <Shield size={13} /> Governance
                        </button>
                      ) : (
                        <button className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:opacity-90">
                          <User size={13} /> Profile
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-slate-100 px-2 py-1.5">
                    <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                      <span className="flex items-center gap-2"><LogOut size={13} /> Sign out</span>
                      <span className="text-slate-400">⌘K</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <AccessControlPanel open={govOpen} onClose={() => setGovOpen(false)} canManage={canManageAccess} />
    </>
  );
}

function ScopeSelect({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <label className="grid grid-cols-[90px_1fr] items-center gap-2">
      <span className="text-xs font-semibold text-slate-600">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer" aria-label={label}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
