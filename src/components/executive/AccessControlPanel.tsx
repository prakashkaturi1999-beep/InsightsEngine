"use client";

import { useMemo, useState } from "react";
import type { AccessRequest, Role } from "@/lib/executiveMock";
import { accessRequests, governanceSnapshot } from "@/lib/executiveMock";
import {
  Shield,
  Users,
  KeyRound,
  ClipboardList,
  Search,
  X,
  Filter,
  AlertTriangle,
} from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  canManage: boolean;
};

const roles: Role[] = [
  "CEO",
  "CFO",
  "COO",
  "OrgAdmin",
  "BrandAdmin",
  "LocationManager",
  "Analyst",
];

export function AccessControlPanel({ open, onClose, canManage }: Props) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");

  const filteredRequests = useMemo(() => {
    const q = query.trim().toLowerCase();
    return accessRequests.filter((r) => {
      const roleOk = roleFilter === "all" ? true : r.requestedRole === roleFilter;
      const qOk =
        q.length === 0 ||
        r.name.toLowerCase().includes(q) ||
        r.scope.toLowerCase().includes(q) ||
        r.requestedModules.join(" ").toLowerCase().includes(q);
      return roleOk && qOk;
    });
  }, [query, roleFilter]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-[0_40px_120px_rgba(15,23,42,0.35)] ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Shield size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Access Control
              </div>
              <div className="text-xs text-slate-500">
                Executive governance across organizations, brands, and locations.
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            aria-label="Close access control"
          >
            <X size={18} />
          </button>
        </div>

        {!canManage ? (
          <div className="p-5">
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <AlertTriangle className="mt-0.5 text-amber-700" size={18} />
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Restricted
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Your role does not allow managing users, roles, or approval
                  workflows.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-[calc(100%-65px)] flex-col">
            <div className="grid grid-cols-2 gap-3 px-5 py-4">
              <StatTile
                icon={<Users size={16} />}
                label="Active Users"
                value={governanceSnapshot.activeUsers.toString()}
              />
              <StatTile
                icon={<ClipboardList size={16} />}
                label="Pending Requests"
                value={governanceSnapshot.pendingRequests.toString()}
              />
              <StatTile
                icon={<KeyRound size={16} />}
                label="Org Admins"
                value={governanceSnapshot.orgAdmins.toString()}
              />
              <StatTile
                icon={<Filter size={16} />}
                label="Users Need Review"
                value={governanceSnapshot.needReview.toString()}
              />
            </div>

            <div className="border-y border-slate-200 px-5 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[220px]">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search users, modules, or scope…"
                    className="h-10 w-full rounded-2xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-900/10"
                  aria-label="Filter by role"
                >
                  <option value="all">All roles</option>
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {prettyRole(r)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Tip: filter by role and search to review cross-brand access,
                finance access, or pending approvals.
              </div>
            </div>

            <div className="flex-1 overflow-auto px-5 py-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Access Requests
              </div>
              <div className="mt-3 space-y-3">
                {filteredRequests.map((r) => (
                  <RequestRow key={r.id} request={r} />
                ))}
                {filteredRequests.length === 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    No matching requests.
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Audit view is read-only in this mock.
                </div>
                <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95">
                  Open Governance Console
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-50 text-slate-700">
          {icon}
        </div>
        <div className="text-lg font-semibold text-slate-900">{value}</div>
      </div>
      <div className="mt-2 text-xs font-medium text-slate-500">{label}</div>
    </div>
  );
}

function RequestRow({ request }: { request: AccessRequest }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">
            {request.name}
          </div>
          <div className="mt-1 text-xs text-slate-500">{request.scope}</div>
          <div className="mt-2 flex flex-wrap gap-1">
            {request.requestedModules.map((m) => (
              <span
                key={m}
                className="rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">
            Pending
          </span>
          <div className="text-xs font-semibold text-slate-700">
            {prettyRole(request.requestedRole)}
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-95">
          Approve
        </button>
        <button className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
          Review
        </button>
        <button className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100">
          Deny
        </button>
      </div>
    </div>
  );
}

function prettyRole(role: Role) {
  switch (role) {
    case "OrgAdmin":
      return "Org Admin";
    case "BrandAdmin":
      return "Brand Admin";
    case "LocationManager":
      return "Location Manager";
    default:
      return role;
  }
}

