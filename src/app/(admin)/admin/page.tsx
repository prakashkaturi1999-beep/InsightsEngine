"use client";

import { useMemo, useState, type ReactNode } from "react";
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
  formatScopeLabel,
  formatScopeListLabel,
  getFilterBarOptions,
  multiScopeIntersectsSelection,
  userBelongsToOrg,
  ALL_ORGANISATIONS,
} from "@/lib/adminScopeUtils";
import {
  Ban,
  Building2,
  Check,
  ChevronDown,
  FilterX,
  KeyRound,
  Mail,
  MapPin,
  Shield,
  ShieldAlert,
  Tag,
  UserCheck,
  UserPlus,
  X,
} from "lucide-react";

const OWNER_ORG = "Craven Group"; // default owner org for "Owner" role simulation

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
  const [bulkRole, setBulkRole] = useState<UserRole>("General Manager");
  const [sortBy, setSortBy] = useState<"Name" | "Organisation" | "Role" | "Status">("Organisation");

  // Cascade-aware dropdown options for the global filter bar
  const filterBarOptions = useMemo(
    () => getFilterBarOptions(filters.filterOrg, filters.filterBrand),
    [filters.filterOrg, filters.filterBrand]
  );

  const pendingRequests = useMemo(
    () => accessRequests.filter((request) => request.status === "Pending"),
    [accessRequests]
  );

  const pendingRequestsByUser = useMemo(() => {
    return pendingRequests.reduce<Record<string, AccessRequest[]>>((acc, request) => {
      acc[request.userId] = [...(acc[request.userId] ?? []), request];
      return acc;
    }, {});
  }, [pendingRequests]);

  // The "selected scope" from the page-level filter bar
  const pageScope = useMemo(
    () => ({
      org: filters.filterOrg,
      brand: filters.filterBrand,
      location: filters.filterLocation,
    }),
    [filters.filterOrg, filters.filterBrand, filters.filterLocation]
  );

  const filteredUsers = useMemo(() => {
    const filtered = users.filter((user) => {
      const scopeList = user.scopeList ?? [user.scope];

      // 1. Multi-scope intersection against the page filter bar scope
      if (!multiScopeIntersectsSelection(scopeList, pageScope)) return false;

      // 2. Viewer role restriction: Owner can only see their own org's users
      if (filters.viewerRole === "Owner") {
        if (!userBelongsToOrg(scopeList, OWNER_ORG)) return false;
      }

      // 3. Status / role filters
      if (filters.status !== "All Statuses" && user.status !== filters.status) return false;
      if (filters.role !== "All Roles" && user.role !== filters.role) return false;

      // 4. Domain / level filters
      if (filters.domain !== "All Domains") {
        if (filters.level === "All Levels") {
          if (user.permissions[filters.domain] === "None") return false;
        } else if (user.permissions[filters.domain] !== filters.level) {
          return false;
        }
      } else if (filters.level !== "All Levels") {
        const hasLevel = DOMAINS.some((domain) => user.permissions[domain] === filters.level);
        if (!hasLevel) return false;
      }

      // 5. Text search
      const search = filters.search.trim().toLowerCase();
      if (!search) return true;

      const permissionSearch = DOMAINS.map((domain) => `${domain} ${user.permissions[domain]}`)
        .join(" ")
        .toLowerCase();

      // Include all scopes in the search text
      const scopeText = scopeList
        .map((s) => `${s.org} ${s.brand} ${s.location}`)
        .join(" ")
        .toLowerCase();

      const userText = [
        user.firstName,
        user.lastName,
        user.email,
        user.role,
        user.status,
        scopeText,
        permissionSearch,
      ]
        .join(" ")
        .toLowerCase();

      return userText.includes(search);
    });

    return filtered.sort((a, b) => {
      if (sortBy === "Name") {
        return a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName);
      } else if (sortBy === "Organisation") {
        const orgA = a.scopeList?.[0]?.org ?? a.scope.org;
        const orgB = b.scopeList?.[0]?.org ?? b.scope.org;
        if (orgA !== orgB) return orgA.localeCompare(orgB);
        return a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName);
      } else if (sortBy === "Role") {
        if (a.role !== b.role) return a.role.localeCompare(b.role);
        return a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName);
      } else if (sortBy === "Status") {
        if (a.status !== b.status) return a.status.localeCompare(b.status);
        return a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName);
      }
      return 0;
    });
  }, [filters, pageScope, users, sortBy]);

  const filteredUserIds = useMemo(
    () => new Set(filteredUsers.map((user) => user.id)),
    [filteredUsers]
  );

  const visibleSelectedIds = useMemo(
    () => [...selectedIds].filter((id) => filteredUserIds.has(id)),
    [filteredUserIds, selectedIds]
  );

  const visiblePendingRequests = useMemo(
    () => pendingRequests.filter((request) => filteredUserIds.has(request.userId)),
    [filteredUserIds, pendingRequests]
  );

  const activeUsers = filteredUsers.filter((user) => user.status === "Active").length;
  const usersWithAdminAccess = filteredUsers.filter((user) =>
    DOMAINS.some((domain) => user.permissions[domain] === "Admin")
  ).length;
  const usersWithEditAccess = filteredUsers.filter((user) =>
    DOMAINS.some((domain) => user.permissions[domain] === "Edit")
  ).length;

  // Count how many users have multi-scope access in the current view
  const multiScopeCount = filteredUsers.filter(
    (u) => (u.scopeList ?? [u.scope]).length > 1
  ).length;

  const toggleSelectAll = () => {
    if (visibleSelectedIds.length === filteredUsers.length) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(filteredUsers.map((user) => user.id)));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkRemove = () => {
    if (
      confirm(
        `Are you sure you want to permanently delete ${visibleSelectedIds.length} users? This is irreversible.`
      )
    ) {
      removeUsers(visibleSelectedIds);
      setSelectedIds(new Set());
    }
  };

  const handleBulkSuspend = () => {
    const reason = prompt("Enter a reason for suspension:");
    if (!reason) return;
    visibleSelectedIds.forEach((id) => suspendUser(id, reason));
    setSelectedIds(new Set());
  };

  const handleBulkRoleApply = () => {
    bulkChangeRole(visibleSelectedIds, "Current Admin", bulkRole);
    setSelectedIds(new Set());
  };

  const handleApproveUserRequests = (userId: string) => {
    (pendingRequestsByUser[userId] ?? []).forEach((request) => {
      processAccessRequest(request.id, "Approved");
    });
  };

  const hasActiveGlobalFilter =
    filters.filterOrg !== ALL_ORGANISATIONS ||
    filters.filterBrand !== "All Brands" ||
    filters.filterLocation !== "All Locations";

  return (
    <>
      <div className="space-y-6 pb-24">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                Access Governance
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                Organize users by scope, access, and approval state
              </h1>
              <p className="mt-2 max-w-3xl text-sm font-medium text-slate-500">
                Use the global scope filter below to narrow by organisation, brand, or location.
                Switch your viewer role between Super&nbsp;Admin and Owner to simulate what each
                persona sees.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <ScopePill label="Visible Users" value={String(filteredUsers.length)} tone="indigo" />
              <ScopePill label="Multi-Scope" value={String(multiScopeCount)} tone="violet" />
              <button
                onClick={() => setIsInviteOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-800"
              >
                <UserPlus size={15} /> Invite User
              </button>
            </div>
          </div>
        </section>

        {/* ── Global Filter Bar ─────────────────────────────────────────────── */}
        <section className="rounded-[28px] border border-indigo-100 bg-gradient-to-br from-slate-50 to-indigo-50/40 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100/80 px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Building2 size={14} />
              </div>
              <span className="text-sm font-bold text-slate-800">Global Scope Filter</span>
              {hasActiveGlobalFilter && (
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-bold text-indigo-700">
                  Active
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Viewer Role Toggle */}
              <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                {(["Super Admin", "Owner"] as ViewerRole[]).map((vr) => (
                  <button
                    key={vr}
                    onClick={() => setFilters({ viewerRole: vr })}
                    className={`rounded-lg px-3 py-1.5 text-[12px] font-bold transition-all ${
                      filters.viewerRole === vr
                        ? vr === "Super Admin"
                          ? "bg-slate-900 text-white shadow-sm"
                          : "bg-violet-600 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {vr}
                  </button>
                ))}
              </div>
              {hasActiveGlobalFilter && (
                <button
                  onClick={() =>
                    setFilters({
                      filterOrg: ALL_ORGANISATIONS,
                      filterBrand: "All Brands",
                      filterLocation: "All Locations",
                    })
                  }
                  className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-[12px] font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  <X size={13} /> Clear
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-4 px-6 py-4">
            {/* Org */}
            <ScopeFilterSelect
              icon={<Building2 size={13} className="text-indigo-500" />}
              label="Organisation"
              value={filters.filterOrg}
              options={filterBarOptions.organizations}
              onChange={(val) =>
                setFilters({
                  filterOrg: val,
                  filterBrand: "All Brands",
                  filterLocation: "All Locations",
                })
              }
            />

            {/* Brand */}
            <ScopeFilterSelect
              icon={<Tag size={13} className="text-amber-500" />}
              label="Brand"
              value={filters.filterBrand}
              options={filterBarOptions.brands}
              onChange={(val) =>
                setFilters({ filterBrand: val, filterLocation: "All Locations" })
              }
              disabled={filterBarOptions.brands.length <= 1}
            />

            {/* Location */}
            <ScopeFilterSelect
              icon={<MapPin size={13} className="text-emerald-500" />}
              label="Location"
              value={filters.filterLocation}
              options={filterBarOptions.locations}
              onChange={(val) => setFilters({ filterLocation: val })}
              disabled={filterBarOptions.locations.length <= 1}
            />

            {/* Active filter chips */}
            {hasActiveGlobalFilter && (
              <div className="flex flex-wrap items-center gap-2 pb-0.5">
                {filters.filterOrg !== ALL_ORGANISATIONS && (
                  <FilterChip
                    label={filters.filterOrg}
                    onRemove={() =>
                      setFilters({
                        filterOrg: ALL_ORGANISATIONS,
                        filterBrand: "All Brands",
                        filterLocation: "All Locations",
                      })
                    }
                  />
                )}
                {filters.filterBrand !== "All Brands" && (
                  <FilterChip
                    label={filters.filterBrand}
                    onRemove={() =>
                      setFilters({ filterBrand: "All Brands", filterLocation: "All Locations" })
                    }
                  />
                )}
                {filters.filterLocation !== "All Locations" && (
                  <FilterChip
                    label={filters.filterLocation}
                    onRemove={() => setFilters({ filterLocation: "All Locations" })}
                  />
                )}
              </div>
            )}
          </div>

          {/* Viewer Role explanation */}
          <div className="border-t border-slate-100/80 bg-white/60 px-6 py-3 rounded-b-[28px]">
            <p className="text-[12px] font-medium text-slate-500">
              {filters.viewerRole === "Super Admin" ? (
                <>
                  <span className="font-bold text-slate-900">Super Admin</span> — sees all users
                  across every organisation matching the scope filter above.
                </>
              ) : (
                <>
                  <span className="font-bold text-violet-700">Owner</span> — restricted to users
                  within <span className="font-bold text-slate-800">{OWNER_ORG}</span> only,
                  regardless of the scope filter selection.
                </>
              )}
            </p>
          </div>
        </section>

        {/* ── Metric Cards ──────────────────────────────────────────────────── */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Users In Scope"
            value={filteredUsers.length}
            helper="Accounts matching the global scope and page filters"
          />
          <MetricCard
            label="Active Right Now"
            value={activeUsers}
            helper="Users with live access in this view"
            tone="emerald"
          />
          <MetricCard
            label="Pending Approvals"
            value={visiblePendingRequests.length}
            helper="Requests waiting for approval or denial"
            tone="amber"
          />
          <MetricCard
            label="Elevated Access"
            value={`${usersWithAdminAccess} admin / ${usersWithEditAccess} edit`}
            helper="Users holding edit or admin permissions in scope"
            tone="violet"
          />
        </section>

        {/* ── User Directory + Approval Queue ───────────────────────────────── */}
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_420px]">
          <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Scoped User Directory</h2>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    Narrow further by role, status, domain, and permission level. Users with
                    multi-brand or multi-location access appear when any of their scopes match.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <FilterSelect
                    label="Status"
                    value={filters.status}
                    onChange={(value) => setFilters({ status: value as typeof filters.status })}
                    options={STATUS_OPTIONS}
                  />
                  <FilterSelect
                    label="Role"
                    value={filters.role}
                    onChange={(value) => setFilters({ role: value as typeof filters.role })}
                    options={ROLE_OPTIONS}
                  />
                  <FilterSelect
                    label="Domain"
                    value={filters.domain}
                    onChange={(value) => setFilters({ domain: value as typeof filters.domain })}
                    options={DOMAIN_OPTIONS}
                  />
                  <FilterSelect
                    label="Access"
                    value={filters.level}
                    onChange={(value) => setFilters({ level: value as typeof filters.level })}
                    options={LEVEL_OPTIONS}
                  />
                  <FilterSelect
                    label="Sort By"
                    value={sortBy}
                    onChange={(value) => setSortBy(value as "Name" | "Organisation" | "Role" | "Status")}
                    options={["Organisation", "Name", "Role", "Status"]}
                  />
                  <button
                    onClick={resetFilters}
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                  >
                    <FilterX size={15} /> Reset All
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1020px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="w-12 py-4 pl-6 pr-3">
                      <button
                        onClick={toggleSelectAll}
                        className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                          visibleSelectedIds.length === filteredUsers.length &&
                          filteredUsers.length > 0
                            ? "border-indigo-600 bg-indigo-600"
                            : "border-slate-300 bg-white hover:border-indigo-400"
                        }`}
                      >
                        {visibleSelectedIds.length === filteredUsers.length &&
                          filteredUsers.length > 0 && (
                            <Check size={12} className="text-white" />
                          )}
                      </button>
                    </th>
                    <th className="px-3 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      User
                    </th>
                    <th className="px-3 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Scope / Access
                    </th>
                    <th className="px-3 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Role
                    </th>
                    <th className="px-3 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Permissions
                    </th>
                    <th className="px-3 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Status
                    </th>
                    <th className="px-3 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Requests
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-14 text-center text-sm font-medium text-slate-500"
                      >
                        No users match the selected scope, role, and access filters.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const requestCount = pendingRequestsByUser[user.id]?.length ?? 0;
                      const accessSummary = summarizeAccess(user);
                      const scopeList = user.scopeList ?? [user.scope];
                      const isMultiScope = scopeList.length > 1;

                      return (
                        <tr
                          key={user.id}
                          className={`group transition-colors hover:bg-slate-50 ${
                            selectedIds.has(user.id) ? "bg-indigo-50/40" : ""
                          }`}
                        >
                          <td className="py-4 pl-6 pr-3">
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleSelect(user.id);
                              }}
                              className={`mt-1 flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                                selectedIds.has(user.id)
                                  ? "border-indigo-600 bg-indigo-600"
                                  : "border-slate-300 bg-white hover:border-indigo-400"
                              }`}
                            >
                              {selectedIds.has(user.id) && (
                                <Check size={12} className="text-white" />
                              )}
                            </button>
                          </td>
                          <td
                            className="cursor-pointer px-3 py-4"
                            onClick={() => setActiveUserId(user.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 text-xs font-bold text-indigo-700 ring-2 ring-white shadow-sm">
                                {user.firstName[0]}
                                {user.lastName[0]}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-xs font-medium text-slate-500">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-4">
                            <div className="text-xs font-semibold text-slate-700">
                              {formatScopeListLabel(scopeList)}
                            </div>
                            {isMultiScope && (
                              <div className="mt-1 flex items-center gap-1">
                                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600">
                                  <Building2 size={9} />
                                  {scopeList.length} scopes
                                </span>
                              </div>
                            )}
                            {!isMultiScope && (
                              <div className="mt-1 text-[11px] text-slate-400">
                                {formatScopeLabel(user.scope)}
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-4">
                            <span className="inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-sm">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-3 py-4">
                            <div className="flex flex-wrap gap-1.5">
                              <AccessCountChip
                                label="Admin"
                                value={accessSummary.admin}
                                tone="slate"
                              />
                              <AccessCountChip
                                label="Edit"
                                value={accessSummary.edit}
                                tone="amber"
                              />
                              <AccessCountChip
                                label="View"
                                value={accessSummary.view}
                                tone="emerald"
                              />
                            </div>
                          </td>
                          <td className="px-3 py-4">
                            <StatusBadge status={user.status} />
                          </td>
                          <td className="px-3 py-4">
                            {requestCount > 0 ? (
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleApproveUserRequests(user.id);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800 transition-colors hover:bg-amber-200"
                              >
                                <ShieldAlert size={12} /> Approve {requestCount}
                              </button>
                            ) : (
                              <span className="text-xs font-medium text-slate-400">
                                No pending
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setActiveUserId(user.id)}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50"
                              >
                                Manage
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Approval Queue + Info ─────────────────────────────────────────  */}
          <aside className="space-y-6">
            <div className="rounded-[28px] border border-amber-200/70 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-500">
                    Approval Queue
                  </p>
                  <h2 className="mt-2 text-lg font-bold text-amber-950">
                    Requests inside this scope
                  </h2>
                  <p className="mt-2 text-sm font-medium text-amber-800/80">
                    Review the users asking for more access in the currently selected org, brand,
                    or location.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/70 px-3 py-2 text-right shadow-sm">
                  <div className="text-xl font-black text-amber-900">
                    {visiblePendingRequests.length}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
                    Pending
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {visiblePendingRequests.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-amber-200 bg-white/60 px-4 py-6 text-center text-sm font-medium text-amber-800/80">
                    No requests are waiting in this scope.
                  </div>
                ) : (
                  visiblePendingRequests.slice(0, 6).map((request) => {
                    const user = users.find((item) => item.id === request.userId);
                    if (!user) return null;

                    return (
                      <div
                        key={request.id}
                        className="rounded-2xl border border-amber-200/70 bg-white/80 p-4 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-bold text-slate-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="mt-1 text-xs font-medium text-slate-500">
                              {request.domain} → {request.requestedLevel} ·{" "}
                              {user.scope.location === "All Locations"
                                ? user.scope.brand
                                : user.scope.location}
                            </div>
                          </div>
                          <button
                            onClick={() => setActiveUserId(user.id)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 transition-colors hover:bg-slate-50"
                          >
                            Open
                          </button>
                        </div>
                        <p className="mt-3 text-xs font-medium leading-relaxed text-slate-600">
                          {request.reason}
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                          <button
                            onClick={() => processAccessRequest(request.id, "Approved")}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700"
                          >
                            <UserCheck size={13} /> Approve
                          </button>
                          <button
                            onClick={() => processAccessRequest(request.id, "Denied")}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-100"
                          >
                            <Ban size={13} /> Deny
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                What This View Gives You
              </p>
              <div className="mt-4 space-y-4 text-sm font-medium text-slate-600">
                <InfoRow
                  icon={<Shield size={15} className="text-slate-700" />}
                  title="Multi-scope visibility"
                  copy="Users with access to multiple brands or locations appear whenever any of their scopes matches your selected filter — shown with a scope count badge."
                />
                <InfoRow
                  icon={<KeyRound size={15} className="text-amber-600" />}
                  title="Viewer role simulation"
                  copy="Toggle between Super Admin (full cross-org visibility) and Owner (restricted to your org only) to preview what each persona sees."
                />
                <InfoRow
                  icon={<Mail size={15} className="text-indigo-600" />}
                  title="Fast approval and edits"
                  copy="Approve requests from the queue or open any user to change scope, role, or permissions in the side drawer."
                />
              </div>
            </div>
          </aside>
        </section>

        {/* ── Access Matrix ─────────────────────────────────────────────────── */}
        <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Access Matrix</h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Review exactly which domains each visible user can access in the current scope.
                </p>
              </div>
              <div className="text-sm font-semibold text-slate-500">
                {filteredUsers.length} users ·{" "}
                {filters.viewerRole === "Owner"
                  ? `Owner view (${OWNER_ORG})`
                  : "Super Admin view"}
              </div>
            </div>
          </div>

          <div className="max-h-[560px] overflow-auto">
            <table className="w-full min-w-[1180px] border-collapse text-left">
              <thead className="sticky top-0 z-10 bg-slate-50">
                <tr className="border-b border-slate-100">
                  <th className="sticky left-0 z-20 w-[280px] bg-slate-50 px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    User
                  </th>
                  {DOMAINS.map((domain) => (
                    <th
                      key={domain}
                      className="px-3 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400"
                    >
                      {domain}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={DOMAINS.length + 1}
                      className="px-6 py-14 text-center text-sm font-medium text-slate-500"
                    >
                      No users available for the current access matrix.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={`matrix-${user.id}`} className="hover:bg-slate-50/70">
                      <td className="sticky left-0 z-10 bg-white px-6 py-4 shadow-[6px_0_14px_rgba(15,23,42,0.03)]">
                        <button
                          onClick={() => setActiveUserId(user.id)}
                          className="text-left transition-colors hover:text-indigo-600"
                        >
                          <div className="font-semibold text-slate-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="mt-1 text-xs font-medium text-slate-500">
                            {user.role} · {formatScopeListLabel(user.scopeList ?? [user.scope])}
                          </div>
                        </button>
                      </td>
                      {DOMAINS.map((domain) => (
                        <td key={`${user.id}-${domain}`} className="px-3 py-4 text-center">
                          <PermissionCell level={user.permissions[domain]} />
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* ── Bulk Action Bar ───────────────────────────────────────────────── */}
      {visibleSelectedIds.length > 0 && (
        <div className="fade-in-up fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full bg-slate-900 px-5 py-3 shadow-[0_20px_40px_rgba(15,23,42,0.3)]">
          <div className="border-r border-slate-700 pr-4 text-sm font-bold text-white">
            {visibleSelectedIds.length} selected
          </div>
          <div className="flex items-center gap-2">
            <select
              value={bulkRole}
              onChange={(event) => setBulkRole(event.target.value as UserRole)}
              className="h-9 rounded-full border border-slate-700 bg-slate-800 px-3 text-xs font-semibold text-slate-100 outline-none"
              aria-label="Bulk role change"
            >
              {ROLE_OPTIONS.filter((role) => role !== "All Roles").map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <button
              onClick={handleBulkRoleApply}
              className="rounded-full px-3 py-1.5 text-xs font-bold text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              Change Role
            </button>
            <button
              onClick={() => {
                resendInvites(visibleSelectedIds);
                setSelectedIds(new Set());
              }}
              className="rounded-full px-3 py-1.5 text-xs font-bold text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              Resend Invites
            </button>
            <button
              onClick={handleBulkSuspend}
              className="rounded-full px-3 py-1.5 text-xs font-bold text-amber-300 transition-colors hover:bg-slate-800 hover:text-amber-200"
            >
              Suspend
            </button>
            <button
              onClick={handleBulkRemove}
              className="rounded-full bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-300 transition-colors hover:bg-slate-800 hover:text-rose-200"
            >
              Remove
            </button>
          </div>
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

// ── Sub-components ────────────────────────────────────────────────────────────

function ScopeFilterSelect({
  icon,
  label,
  value,
  options,
  onChange,
  disabled = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
        {icon}
        {label}
      </span>
      <div
        className={`relative flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
          disabled
            ? "border-slate-100 bg-slate-50 text-slate-300"
            : "border-slate-200 bg-white text-slate-800 shadow-sm hover:border-indigo-300 hover:bg-indigo-50/30"
        }`}
      >
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="cursor-pointer appearance-none bg-transparent pr-6 outline-none disabled:cursor-default"
          aria-label={`Filter by ${label}`}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={13}
          className={`pointer-events-none absolute right-3 ${disabled ? "text-slate-200" : "text-slate-400"}`}
        />
      </div>
    </label>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[12px] font-bold text-indigo-700">
      {label}
      <button
        onClick={onRemove}
        className="rounded-full p-0.5 transition-colors hover:bg-indigo-100"
        aria-label={`Remove ${label} filter`}
      >
        <X size={10} />
      </button>
    </span>
  );
}

function MetricCard({
  label,
  value,
  helper,
  tone = "slate",
}: {
  label: string;
  value: number | string;
  helper: string;
  tone?: "slate" | "emerald" | "amber" | "violet";
}) {
  const tones = {
    slate: "border-slate-200 bg-white text-slate-900",
    emerald: "border-emerald-200 bg-emerald-50/70 text-emerald-950",
    amber: "border-amber-200 bg-amber-50/70 text-amber-950",
    violet: "border-violet-200 bg-violet-50/70 text-violet-950",
  } as const;

  return (
    <div className={`rounded-[24px] border p-5 shadow-sm ${tones[tone]}`}>
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">{label}</p>
      <div className="mt-3 text-3xl font-black tracking-tight">{value}</div>
      <p className="mt-2 text-sm font-medium text-slate-500">{helper}</p>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none transition-colors hover:bg-white"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ScopePill({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "slate" | "indigo" | "violet";
}) {
  const tones = {
    slate: "border-slate-200 bg-slate-50 text-slate-700",
    indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
    violet: "border-violet-200 bg-violet-50 text-violet-700",
  } as const;

  return (
    <div className={`rounded-2xl border px-4 py-2 ${tones[tone]}`}>
      <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">{label}</div>
      <div className="mt-1 text-sm font-bold">{value}</div>
    </div>
  );
}

function AccessCountChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "slate" | "amber" | "emerald";
}) {
  const tones = {
    slate: "bg-slate-900 text-white",
    amber: "bg-amber-100 text-amber-800",
    emerald: "bg-emerald-100 text-emerald-800",
  } as const;

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${tones[tone]}`}>
      {label}: {value}
    </span>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  const tones = {
    Active: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
    Suspended: "bg-rose-100 text-rose-700",
  } as const;

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${tones[status]}`}
    >
      {status}
    </span>
  );
}

function PermissionCell({ level }: { level: PermissionLevel }) {
  const tones = {
    None: "border-slate-200 bg-slate-50 text-slate-400",
    View: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Edit: "border-amber-200 bg-amber-50 text-amber-700",
    Admin: "border-slate-900 bg-slate-900 text-white",
  } as const;

  return (
    <span
      className={`inline-flex min-w-[66px] items-center justify-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${tones[level]}`}
    >
      {level}
    </span>
  );
}

function InfoRow({
  icon,
  title,
  copy,
}: {
  icon: ReactNode;
  title: string;
  copy: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
        {icon}
      </div>
      <div>
        <div className="font-semibold text-slate-900">{title}</div>
        <p className="mt-1 leading-relaxed">{copy}</p>
      </div>
    </div>
  );
}

function summarizeAccess(user: AppUser) {
  return DOMAINS.reduce(
    (summary, domain) => {
      const level = user.permissions[domain];
      if (level === "Admin") summary.admin += 1;
      if (level === "Edit") summary.edit += 1;
      if (level === "View") summary.view += 1;
      return summary;
    },
    { admin: 0, edit: 0, view: 0 }
  );
}
