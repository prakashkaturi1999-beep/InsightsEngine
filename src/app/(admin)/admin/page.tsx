"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { UserDetailDrawer } from "@/components/admin/UserDetailDrawer";
import { InviteUserModal } from "@/components/admin/InviteUserModal";
import { useAdminFilters, type ViewerRole } from "@/lib/adminFilterContext";
import {
  useAdminStore,
  type AccessRequest,
  type AppUser,
  type DomainType,
  type PermissionLevel,
  type UserRole,
  type UserStatus,
} from "@/lib/adminStore";
import {
  formatScopeListLabel,
  multiScopeIntersectsSelection,
  userBelongsToOrg,
} from "@/lib/adminScopeUtils";
import {
  ArrowUpDown,
  Ban,
  Check,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  UserCheck,
  UserPlus,
  X,
} from "lucide-react";

const OWNER_ORG = "Craven Group";

const DOMAINS: DomainType[] = [
  "Finance",
  "Sales",
  "Orders",
  "Inventory",
  "HR & Labour",
  "Guest Experience",
  "Menu Intelligence",
  "Operations",
];

const ROLE_OPTIONS: Array<UserRole | "All Roles"> = [
  "All Roles",
  "Super Admin",
  "Organisation Director",
  "General Manager",
  "Kitchen Manager",
  "Floor Manager",
  "Shift Supervisor",
];

const STATUS_OPTIONS: Array<UserStatus | "All Statuses"> = [
  "All Statuses",
  "Active",
  "Pending",
  "Suspended",
];

const DOMAIN_OPTIONS: Array<DomainType | "All Domains"> = ["All Domains", ...DOMAINS];
const LEVEL_OPTIONS: Array<PermissionLevel | "All Levels"> = [
  "All Levels",
  "None",
  "View",
  "Edit",
  "Admin",
];

type SortKey = "name" | "org" | "role" | "status";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 50;

export default function AccessGovernancePage() {
  const {
    users,
    accessRequests,
    bulkChangeRole,
    processAccessRequest,
    removeUsers,
    resendInvites,
    suspendUser,
  } = useAdminStore();
  const { filters, setFilters, resetFilters } = useAdminFilters();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [bulkRole, setBulkRole] = useState<UserRole>("General Manager");
  const [sortKey, setSortKey] = useState<SortKey>("org");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const filterDrawerRef = useRef<HTMLDivElement>(null);

  // Close filter drawer on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (filterDrawerRef.current && !filterDrawerRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    if (isFilterOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isFilterOpen]);

  const pendingRequests = useMemo(
    () => accessRequests.filter((r) => r.status === "Pending"),
    [accessRequests]
  );

  const pendingRequestsByUser = useMemo(() => {
    return pendingRequests.reduce<Record<string, AccessRequest[]>>((acc, r) => {
      acc[r.userId] = [...(acc[r.userId] ?? []), r];
      return acc;
    }, {});
  }, [pendingRequests]);

  const pageScope = useMemo(
    () => ({ org: filters.filterOrg, brand: filters.filterBrand, location: filters.filterLocation }),
    [filters.filterOrg, filters.filterBrand, filters.filterLocation]
  );

  const filteredUsers = useMemo(() => {
    const list = users.filter((user) => {
      const scopeList = user.scopeList ?? [user.scope];
      if (!multiScopeIntersectsSelection(scopeList, pageScope)) return false;
      if (filters.viewerRole === "Owner" && !userBelongsToOrg(scopeList, OWNER_ORG)) return false;
      if (filters.status !== "All Statuses" && user.status !== filters.status) return false;
      if (filters.role !== "All Roles" && user.role !== filters.role) return false;
      if (filters.domain !== "All Domains") {
        if (filters.level === "All Levels") {
          if (user.permissions[filters.domain] === "None") return false;
        } else if (user.permissions[filters.domain] !== filters.level) return false;
      } else if (filters.level !== "All Levels") {
        if (!DOMAINS.some((d) => user.permissions[d] === filters.level)) return false;
      }
      const search = filters.search.trim().toLowerCase();
      if (!search) return true;
      const scopeText = scopeList.map((s) => `${s.org} ${s.brand} ${s.location}`).join(" ").toLowerCase();
      return `${user.firstName} ${user.lastName} ${user.email} ${user.role} ${user.status} ${scopeText}`
        .toLowerCase()
        .includes(search);
    });

    return list.sort((a, b) => {
      let v = 0;
      if (sortKey === "name") v = a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName);
      else if (sortKey === "org") {
        const oa = a.scopeList?.[0]?.org ?? a.scope.org;
        const ob = b.scopeList?.[0]?.org ?? b.scope.org;
        v = oa.localeCompare(ob) || a.firstName.localeCompare(b.firstName);
      } else if (sortKey === "role") v = a.role.localeCompare(b.role) || a.firstName.localeCompare(b.firstName);
      else if (sortKey === "status") v = a.status.localeCompare(b.status) || a.firstName.localeCompare(b.firstName);
      return sortDir === "asc" ? v : -v;
    });
  }, [filters, pageScope, users, sortKey, sortDir]);

  useEffect(() => setCurrentPage(1), [filters, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedUsers = filteredUsers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const filteredUserIds = useMemo(() => new Set(filteredUsers.map((u) => u.id)), [filteredUsers]);
  const visibleSelectedIds = useMemo(() => [...selectedIds].filter((id) => filteredUserIds.has(id)), [filteredUserIds, selectedIds]);
  const visiblePendingRequests = useMemo(() => pendingRequests.filter((r) => filteredUserIds.has(r.userId)), [filteredUserIds, pendingRequests]);

  const activeCount = filteredUsers.filter((u) => u.status === "Active").length;
  const pendingCount = visiblePendingRequests.length;

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const toggleSelectAll = () => {
    if (visibleSelectedIds.length === filteredUsers.length) { setSelectedIds(new Set()); return; }
    setSelectedIds(new Set(filteredUsers.map((u) => u.id)));
  };

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const handleBulkRemove = () => {
    if (confirm(`Permanently delete ${visibleSelectedIds.length} users? This is irreversible.`)) {
      removeUsers(visibleSelectedIds); setSelectedIds(new Set());
    }
  };

  const handleBulkSuspend = () => {
    const reason = prompt("Enter a reason for suspension:");
    if (!reason) return;
    visibleSelectedIds.forEach((id) => suspendUser(id, reason));
    setSelectedIds(new Set());
  };

  // Active filter count badge (Status, Role, Domain, Level only — scope comes from global navbar)
  const activeFilterCount = [
    filters.status !== "All Statuses",
    filters.role !== "All Roles",
    filters.domain !== "All Domains",
    filters.level !== "All Levels",
  ].filter(Boolean).length;

  return (
    <>
      <div className="flex flex-col gap-0 pb-24">

        {/* ── Command Bar ───────────────────────────────────────────────────── */}
        <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-6 py-3 backdrop-blur-sm">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:gap-4">

            {/* Left: Title + scope info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h1 className="text-[15px] font-bold text-slate-900">User Access Governance</h1>
                  <p className="text-[11px] font-medium text-slate-400">
                    {filteredUsers.length.toLocaleString()} users visible · use the top bar to filter by org, brand, or location
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Viewer role + actions */}
            <div className="flex shrink-0 items-center gap-2">
              {/* Viewer role */}
              <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                {(["Super Admin", "Owner"] as ViewerRole[]).map((vr) => (
                  <button
                    key={vr}
                    onClick={() => setFilters({ viewerRole: vr })}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition-all ${
                      filters.viewerRole === vr
                        ? vr === "Super Admin"
                          ? "bg-slate-900 text-white shadow-sm"
                          : "bg-violet-600 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {vr}
                  </button>
                ))}
              </div>

              {/* Filter drawer trigger */}
              <div className="relative" ref={filterDrawerRef}>
                <button
                  onClick={() => setIsFilterOpen((o) => !o)}
                  className={`relative inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-[13px] font-semibold transition-colors ${
                    activeFilterCount > 0
                      ? "border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <SlidersHorizontal size={14} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-black text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Filter Drawer */}
                {isFilterOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_32px_rgba(15,23,42,0.12)]">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Narrow Results</span>
                      {activeFilterCount > 0 && (
                        <button
                          onClick={() => { resetFilters(); }}
                          className="text-[11px] font-bold text-rose-500 hover:text-rose-700"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <DrawerSelect
                        label="Status"
                        value={filters.status}
                        options={STATUS_OPTIONS}
                        onChange={(v) => setFilters({ status: v as typeof filters.status })}
                      />
                      <DrawerSelect
                        label="Role"
                        value={filters.role}
                        options={ROLE_OPTIONS}
                        onChange={(v) => setFilters({ role: v as typeof filters.role })}
                      />
                      <DrawerSelect
                        label="Domain"
                        value={filters.domain}
                        options={DOMAIN_OPTIONS}
                        onChange={(v) => setFilters({ domain: v as typeof filters.domain })}
                      />
                      <DrawerSelect
                        label="Access Level"
                        value={filters.level}
                        options={LEVEL_OPTIONS}
                        onChange={(v) => setFilters({ level: v as typeof filters.level })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Search */}
              <div className="relative hidden xl:block">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users…"
                  value={filters.search}
                  onChange={(e) => setFilters({ search: e.target.value })}
                  className="h-9 w-52 rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-[13px] text-slate-900 placeholder-slate-400 outline-none transition-all focus:w-64 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Invite */}
              <button
                onClick={() => setIsInviteOpen(true)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-indigo-600 px-3 text-[13px] font-bold text-white shadow-sm transition-colors hover:bg-indigo-700"
              >
                <UserPlus size={14} /> Invite User
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="relative mt-2 xl:hidden">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search users…"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-[13px] text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-400 focus:bg-white"
            />
          </div>
        </div>

        {/* ── Active filter chips (Status / Role / Domain / Level only) ───── */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-6 py-2.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Filtered by:</span>
            {filters.status !== "All Statuses" && (
              <Chip label={filters.status} color="slate" onRemove={() => setFilters({ status: "All Statuses" })} />
            )}
            {filters.role !== "All Roles" && (
              <Chip label={filters.role} color="slate" onRemove={() => setFilters({ role: "All Roles" })} />
            )}
            {filters.domain !== "All Domains" && (
              <Chip label={filters.domain} color="slate" onRemove={() => setFilters({ domain: "All Domains" })} />
            )}
            {filters.level !== "All Levels" && (
              <Chip label={filters.level} color="slate" onRemove={() => setFilters({ level: "All Levels" })} />
            )}
            <button
              onClick={() => setFilters({ status: "All Statuses", role: "All Roles", domain: "All Domains", level: "All Levels" })}
              className="ml-1 text-[11px] font-bold text-rose-500 hover:text-rose-700"
            >
              Clear
            </button>
          </div>
        )}

        {/* ── Stats strip ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-px border-b border-slate-200 bg-slate-200 xl:grid-cols-4">
          <StatCell label="In Scope" value={filteredUsers.length.toLocaleString()} accent />
          <StatCell label="Active" value={activeCount.toLocaleString()} color="emerald" />
          <StatCell label="Pending Approvals" value={pendingCount.toLocaleString()} color="amber" />
          <StatCell
            label="Viewer Role"
            value={filters.viewerRole}
            color={filters.viewerRole === "Owner" ? "violet" : "slate"}
          />
        </div>

        {/* ── Main content: table + sidebar ─────────────────────────────────── */}
        <div className="flex min-h-0 flex-1 flex-col xl:flex-row">

          {/* Table */}
          <div className="min-w-0 flex-1">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="w-10 py-3 pl-6 pr-2">
                      <button
                        onClick={toggleSelectAll}
                        className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                          visibleSelectedIds.length === filteredUsers.length && filteredUsers.length > 0
                            ? "border-indigo-600 bg-indigo-600"
                            : "border-slate-300 bg-white hover:border-indigo-400"
                        }`}
                      >
                        {visibleSelectedIds.length === filteredUsers.length && filteredUsers.length > 0 && (
                          <Check size={10} className="text-white" />
                        )}
                      </button>
                    </th>
                    <SortTh label="User" sortK="name" current={sortKey} dir={sortDir} onSort={toggleSort} />
                    <SortTh label="Organisation" sortK="org" current={sortKey} dir={sortDir} onSort={toggleSort} />
                    <SortTh label="Role" sortK="role" current={sortKey} dir={sortDir} onSort={toggleSort} />
                    <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Access
                    </th>
                    <SortTh label="Status" sortK="status" current={sortKey} dir={sortDir} onSort={toggleSort} />
                    <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Requests
                    </th>
                    <th className="py-3 pl-3 pr-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                            <Filter size={20} className="text-slate-400" />
                          </div>
                          <p className="text-sm font-semibold text-slate-500">No users match your filters</p>
                          <button onClick={resetFilters} className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                            Reset all filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    pagedUsers.map((user) => {
                      const requestCount = pendingRequestsByUser[user.id]?.length ?? 0;
                      const access = summarizeAccess(user);
                      const scopeList = user.scopeList ?? [user.scope];
                      const isSelected = selectedIds.has(user.id);

                      return (
                        <tr
                          key={user.id}
                          className={`group transition-colors hover:bg-slate-50/80 ${isSelected ? "bg-indigo-50/60" : ""}`}
                        >
                          {/* Checkbox */}
                          <td className="py-3.5 pl-6 pr-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleSelect(user.id); }}
                              className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                                isSelected ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white hover:border-indigo-400"
                              }`}
                            >
                              {isSelected && <Check size={10} className="text-white" />}
                            </button>
                          </td>

                          {/* User */}
                          <td className="cursor-pointer px-3 py-3.5" onClick={() => setActiveUserId(user.id)}>
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 text-[11px] font-black text-indigo-700">
                                {user.firstName[0]}{user.lastName[0]}
                              </div>
                              <div className="min-w-0">
                                <div className="truncate text-[13px] font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="truncate text-[11px] text-slate-400">{user.email}</div>
                              </div>
                            </div>
                          </td>

                          {/* Org */}
                          <td className="px-3 py-3.5">
                            <div className="text-[12px] font-semibold text-slate-700 ">
                              {formatScopeListLabel(scopeList)}
                            </div>
                            {(user.scopeList ?? []).length > 1 && (
                              <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600">
                                🏢 {(user.scopeList ?? []).length} scopes
                              </span>
                            )}
                          </td>

                          {/* Role */}
                          <td className="px-3 py-3.5">
                            <RoleBadge role={user.role} />
                          </td>

                          {/* Access summary */}
                          <td className="px-3 py-3.5">
                            <div className="flex items-center gap-1">
                              {access.admin > 0 && (
                                <span className="rounded-md bg-slate-900 px-1.5 py-0.5 text-[10px] font-black text-white">
                                  {access.admin}A
                                </span>
                              )}
                              {access.edit > 0 && (
                                <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-black text-amber-800">
                                  {access.edit}E
                                </span>
                              )}
                              {access.view > 0 && (
                                <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-black text-emerald-800">
                                  {access.view}V
                                </span>
                              )}
                              {access.admin === 0 && access.edit === 0 && access.view === 0 && (
                                <span className="text-[11px] text-slate-300">—</span>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-3 py-3.5">
                            <StatusBadge status={user.status} />
                          </td>

                          {/* Requests */}
                          <td className="px-3 py-3.5">
                            {requestCount > 0 ? (
                              <button
                                onClick={(e) => { e.stopPropagation(); (pendingRequestsByUser[user.id] ?? []).forEach((r) => processAccessRequest(r.id, "Approved")); }}
                                className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-800 transition-colors hover:bg-amber-200"
                              >
                                <ShieldAlert size={10} /> {requestCount}
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-300">—</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 pl-3 pr-6">
                            <button
                              onClick={() => setActiveUserId(user.id)}
                              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-600 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
                <p className="text-[12px] font-medium text-slate-500">
                  <span className="font-bold text-slate-900">{(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filteredUsers.length)}</span>{" "}
                  of <span className="font-bold text-slate-900">{filteredUsers.length.toLocaleString()}</span>
                </p>
                <div className="flex items-center gap-1">
                  <PagBtn onClick={() => setCurrentPage(1)} disabled={safePage === 1} label="«" />
                  <PagBtn onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} label="‹" />
                  {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                    let s = Math.max(1, safePage - 3);
                    const e = Math.min(totalPages, s + 6);
                    s = Math.max(1, e - 6);
                    return s + i;
                  }).filter((pg) => pg <= totalPages).map((pg) => (
                    <button
                      key={pg}
                      onClick={() => setCurrentPage(pg)}
                      className={`h-7 w-7 rounded-lg border text-[12px] font-bold transition-colors ${
                        pg === safePage
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {pg}
                    </button>
                  ))}
                  <PagBtn onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} label="›" />
                  <PagBtn onClick={() => setCurrentPage(totalPages)} disabled={safePage === totalPages} label="»" />
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar: Approval Queue ──────────────────────────────────────── */}
          <aside className="w-full shrink-0 border-t border-slate-200 xl:w-[340px] xl:border-l xl:border-t-0">
            <div className="sticky top-[57px] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Approval Queue</p>
                  <h2 className="mt-0.5 text-[15px] font-bold text-slate-900">Pending Requests</h2>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-lg font-black text-amber-800">
                  {pendingCount}
                </div>
              </div>

              <div className="space-y-3">
                {visiblePendingRequests.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
                    <p className="text-[12px] font-medium text-slate-400">No pending requests in this scope</p>
                  </div>
                ) : (
                  visiblePendingRequests.slice(0, 6).map((request) => {
                    const user = users.find((u) => u.id === request.userId);
                    if (!user) return null;
                    return (
                      <div key={request.id} className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="truncate text-[13px] font-bold text-slate-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="mt-0.5 text-[11px] font-medium text-slate-500">
                              {request.domain} → <span className="font-bold text-slate-700">{request.requestedLevel}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setActiveUserId(user.id)}
                            className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-600 transition-colors hover:bg-slate-100"
                          >
                            View
                          </button>
                        </div>
                        {request.reason && (
                          <p className="mt-2 rounded-lg bg-slate-50 px-2.5 py-2 text-[11px] leading-relaxed text-slate-600">
                            {request.reason}
                          </p>
                        )}
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={() => processAccessRequest(request.id, "Approved")}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-emerald-700"
                          >
                            <UserCheck size={11} /> Approve
                          </button>
                          <button
                            onClick={() => processAccessRequest(request.id, "Denied")}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[11px] font-bold text-rose-700 transition-colors hover:bg-rose-100"
                          >
                            <Ban size={11} /> Deny
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
                {visiblePendingRequests.length > 6 && (
                  <p className="pt-1 text-center text-[11px] font-semibold text-slate-400">
                    +{visiblePendingRequests.length - 6} more — filter to a specific scope
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Bulk Action Bar ─────────────────────────────────────────────────── */}
      {visibleSelectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-slate-700 bg-slate-900 px-4 py-2.5 shadow-[0_20px_40px_rgba(15,23,42,0.4)]">
          <div className="border-r border-slate-700 pr-3 text-[13px] font-bold text-white">
            {visibleSelectedIds.length} selected
          </div>
          <select
            value={bulkRole}
            onChange={(e) => setBulkRole(e.target.value as UserRole)}
            className="h-8 rounded-full border border-slate-700 bg-slate-800 px-2.5 text-[12px] font-semibold text-slate-100 outline-none"
          >
            {ROLE_OPTIONS.filter((r) => r !== "All Roles").map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <button onClick={() => { bulkChangeRole(visibleSelectedIds, "Current Admin", bulkRole); setSelectedIds(new Set()); }} className="text-[12px] font-bold text-slate-300 hover:text-white">
            Change Role
          </button>
          <button onClick={() => { resendInvites(visibleSelectedIds); setSelectedIds(new Set()); }} className="text-[12px] font-bold text-slate-300 hover:text-white">
            Resend
          </button>
          <button onClick={handleBulkSuspend} className="text-[12px] font-bold text-amber-300 hover:text-amber-200">
            Suspend
          </button>
          <button onClick={handleBulkRemove} className="text-[12px] font-bold text-rose-400 hover:text-rose-300">
            Remove
          </button>
          <button onClick={() => setSelectedIds(new Set())} className="ml-1 rounded-full p-1 text-slate-400 hover:text-white">
            <X size={13} />
          </button>
        </div>
      )}

      <InviteUserModal open={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
      <UserDetailDrawer
        key={activeUserId ?? "closed"}
        open={activeUserId !== null}
        onClose={() => setActiveUserId(null)}
        userId={activeUserId}
      />
    </>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function CmdScopeSelect({ icon, label, value, options, onChange, disabled = false, active = false }: {
  icon: ReactNode; label: string; value: string; options: string[];
  onChange: (v: string) => void; disabled?: boolean; active?: boolean;
}) {
  return (
    <div className={`relative flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[12px] font-semibold transition-colors ${
      disabled ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
        : active ? "border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
    }`}>
      {icon}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="cursor-pointer appearance-none bg-transparent pr-4 outline-none disabled:cursor-not-allowed"
        aria-label={`Filter by ${label}`}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={11} className="pointer-events-none absolute right-2 text-current opacity-60" />
    </div>
  );
}

function DrawerSelect({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  const isActive = value !== options[0];
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2 text-[13px] font-semibold outline-none transition-colors ${
          isActive ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-slate-50 text-slate-700"
        } focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100`}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function SortTh({ label, sortK, current, dir, onSort }: {
  label: string; sortK: SortKey; current: SortKey; dir: SortDir; onSort: (k: SortKey) => void;
}) {
  const isActive = current === sortK;
  return (
    <th className="px-3 py-3">
      <button
        onClick={() => onSort(sortK)}
        className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition-colors ${
          isActive ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        {label}
        {isActive ? (
          dir === "asc" ? <ChevronUp size={11} /> : <ChevronDown size={11} />
        ) : (
          <ArrowUpDown size={10} className="opacity-30" />
        )}
      </button>
    </th>
  );
}

function Chip({ label, color, onRemove }: { label: string; color: "indigo" | "amber" | "emerald" | "slate"; onRemove: () => void }) {
  const cls = {
    indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    slate: "border-slate-200 bg-slate-100 text-slate-600",
  }[color];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${cls}`}>
      {label}
      <button onClick={onRemove} className="ml-0.5 rounded-full hover:opacity-70" aria-label={`Remove ${label}`}>
        <X size={9} />
      </button>
    </span>
  );
}

function StatCell({ label, value, color, accent }: { label: string; value: string; color?: "emerald" | "amber" | "violet" | "slate"; accent?: boolean }) {
  const cls = {
    emerald: "text-emerald-700",
    amber: "text-amber-700",
    violet: "text-violet-700",
    slate: "text-slate-900",
  }[color ?? "slate"];
  return (
    <div className={`flex flex-col gap-0.5 px-5 py-3 ${accent ? "bg-indigo-600" : "bg-white"}`}>
      <span className={`text-[10px] font-bold uppercase tracking-widest ${accent ? "text-indigo-200" : "text-slate-400"}`}>{label}</span>
      <span className={`text-[20px] font-black leading-none ${accent ? "text-white" : cls}`}>{value}</span>
    </div>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  const isSuper = role === "Super Admin";
  const isDir = role === "Organisation Director";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
      isSuper ? "bg-slate-900 text-white"
      : isDir ? "bg-violet-100 text-violet-800"
      : "bg-slate-100 text-slate-700"
    }`}>
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  const cls = { Active: "bg-emerald-100 text-emerald-700", Pending: "bg-amber-100 text-amber-700", Suspended: "bg-rose-100 text-rose-700" } as const;
  const dot = { Active: "bg-emerald-500", Pending: "bg-amber-500", Suspended: "bg-rose-500" } as const;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${cls[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot[status]}`} />
      {status}
    </span>
  );
}

function PagBtn({ onClick, disabled, label }: { onClick: () => void; disabled: boolean; label: string }) {
  return (
    <button onClick={onClick} disabled={disabled} className="h-7 w-7 rounded-lg border border-slate-200 bg-white text-[12px] font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30">
      {label}
    </button>
  );
}

function summarizeAccess(user: AppUser) {
  return DOMAINS.reduce((s, d) => {
    const l = user.permissions[d];
    if (l === "Admin") s.admin++;
    if (l === "Edit") s.edit++;
    if (l === "View") s.view++;
    return s;
  }, { admin: 0, edit: 0, view: 0 });
}
