"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useAdminStore, AppUser, UserRole, DomainType, PermissionLevel } from "@/lib/adminStore";
import {
  ALL_BRANDS,
  ALL_LOCATIONS,
  getAdminScopeOptions,
} from "@/lib/adminScopeUtils";
import { X, Shield, Lock, Power, UserMinus, UserCheck, AlertTriangle, KeyRound, MonitorSmartphone, Layers } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  userId: string | null;
};

const DOMAINS: DomainType[] = [
  "Finance", "Sales", "Orders", "Inventory", 
  "HR & Labour", "Guest Experience", "Menu Intelligence", "Operations"
];
const LEVELS: PermissionLevel[] = ["None", "View", "Edit", "Admin"];
const ROLES: UserRole[] = ["Super Admin", "Organisation Director", "General Manager", "Kitchen Manager", "Floor Manager", "Shift Supervisor"];

export function UserDetailDrawer({ open, onClose, userId }: Props) {
  const { users, updateUser, suspendUser, reactivateUser, removeUsers, bulkChangeRole } = useAdminStore();
  const [tab, setTab] = useState<"profile" | "permissions" | "security">("profile");
  const user = useMemo(
    () => (open && userId ? users.find((candidate) => candidate.id === userId) ?? null : null),
    [open, userId, users]
  );
  const scopeOptions = useMemo(
    () =>
      user
        ? getAdminScopeOptions({ org: user.scope.org, brand: user.scope.brand })
        : null,
    [user]
  );

  if (!open || !user) return null;

  const handleRoleChange = (newRole: UserRole) => {
    if (confirm(`Changing role to ${newRole} will recalculate all their domain permissions. Proceed?`)) {
      bulkChangeRole([user.id], "Current User", newRole);
    }
  };

  const handleScopeChange = (key: keyof AppUser["scope"], val: string) => {
    const nextScope =
      key === "org"
        ? { org: val, brand: ALL_BRANDS, location: ALL_LOCATIONS }
        : key === "brand"
          ? { ...user.scope, brand: val, location: ALL_LOCATIONS }
          : { ...user.scope, location: val };
    updateUser(user.id, { scope: nextScope });
  };

  const handlePermissionChange = (domain: DomainType, level: PermissionLevel) => {
    // Super Admins immutable on permissions
    if (user.role === "Super Admin") return alert("Super Admin always possesses Admin access. Cannot override.");
    const nextPerms = { ...user.permissions, [domain]: level };
    updateUser(user.id, { permissions: nextPerms });
  };

  const RequestRemoval = () => {
    if (user.role === "Super Admin") return alert("Cannot remove Super Admin account.");
    if (confirm(`Are you sure you want to permanently delete ${user.firstName} ${user.lastName} (${user.role})? This action will terminate all active sessions entirely. Data authored by the user will be attributed to '[Deleted User]'.\n\nThis action is irreversible.`)) {
      removeUsers([user.id]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <aside className="relative flex h-full w-[600px] flex-col bg-white shadow-2xl transition-transform duration-300">
        <header className="flex items-center justify-between border-b border-slate-100 px-6 py-5 bg-white">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-700 font-black text-lg ring-4 ring-white shadow-md">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">{user.firstName} {user.lastName}</h2>
              <p className="text-sm font-medium text-slate-500">{user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full bg-slate-50 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"><X size={18} /></button>
        </header>

        {/* Status bar */}
        <div className="flex items-center gap-3 bg-slate-50/80 px-6 py-3 border-b border-slate-100">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
            user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
            user.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
            'bg-rose-100 text-rose-700'
          }`}>
            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : user.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'}`} />
            {user.status}
          </span>
          <span className="text-xs font-semibold text-slate-400">|</span>
          <span className="text-xs font-medium text-slate-500"><b className="text-slate-700">Role:</b> {user.role}</span>
          <span className="text-xs font-semibold text-slate-400">|</span>
          <span className="text-xs font-medium text-slate-500">Last seen: {user.lastActive}</span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-6 border-b border-slate-100 px-6">
          <TabButton active={tab === "profile"} onClick={() => setTab("profile")} icon={<Shield size={14} />} label="Profile & Role" />
          <TabButton active={tab === "permissions"} onClick={() => setTab("permissions")} icon={<Layers size={14} />} label="Domain Permissions" />
          <TabButton active={tab === "security"} onClick={() => setTab("security")} icon={<Lock size={14} />} label="Security" />
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-[#f8f9fb]">
          
          {tab === "profile" && (
            <div className="space-y-6 fade-in-up">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Core Identity</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="First Name" value={user.firstName} readOnly />
                  <Input label="Last Name" value={user.lastName} readOnly />
                  <div className="col-span-2">
                    <Input label="Email Address" value={user.email} readOnly />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
                  Assigned Hierarchy Role
                </h3>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex gap-3 mb-4">
                  <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900">Permission Recalculation Alert</h4>
                    <p className="text-[11px] text-amber-800/80 font-medium leading-relaxed mt-1">Changing a user&apos;s role here will instantly reset all their Domain Permissions to match the standard template for the new role. Any manual domain overrides will be permanently lost.</p>
                  </div>
                </div>
                <Select label="System Role" value={user.role} onChange={v => handleRoleChange(v as UserRole)} options={ROLES} />
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Data Context Scope</h3>
                <p className="text-xs font-medium text-slate-500 mb-4 leading-relaxed">Scope restriction determines what data rows appear across all domains this user has access to.</p>
                <div className="grid gap-4">
                  <Select
                    label="Organisation Level"
                    value={user.scope.org}
                    onChange={v => handleScopeChange("org", v)}
                    options={scopeOptions?.organizations ?? []}
                  />
                  <Select
                    label="Brand Level"
                    value={user.scope.brand}
                    onChange={v => handleScopeChange("brand", v)}
                    options={scopeOptions?.brands ?? []}
                  />
                  <Select
                    label="Location Level"
                    value={user.scope.location}
                    onChange={v => handleScopeChange("location", v)}
                    options={scopeOptions?.locations ?? []}
                  />
                </div>
              </section>
            </div>
          )}

          {tab === "permissions" && (
            <div className="space-y-4 fade-in-up pb-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Module Access Rules</h3>
                  <p className="text-xs text-slate-500 font-medium">Overriding defaults for {user.role}.</p>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Auto-saved</div>
              </div>
              
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm divide-y divide-slate-100 overflow-hidden">
                {DOMAINS.map(domain => {
                  const currentLevel = user.permissions[domain];
                  return (
                    <div key={domain} className="p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                      <div className="font-semibold text-sm text-slate-800">{domain}</div>
                      <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        {LEVELS.map(lvl => (
                          <button 
                            key={lvl}
                            onClick={() => handlePermissionChange(domain, lvl)}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                              currentLevel === lvl 
                                ? lvl === "Admin" ? "bg-slate-900 text-white shadow-md" 
                                : lvl === "None" ? "bg-rose-100 text-rose-700 shadow-sm ring-1 ring-inset ring-rose-200"
                                : "bg-white text-slate-800 shadow-sm"
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "security" && (
            <div className="space-y-6 fade-in-up">
              
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                    <MonitorSmartphone size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Active Sessions</h3>
                    <p className="text-xs font-medium text-slate-500">{user.sessions} active logins via web or app.</p>
                  </div>
                </div>
                <button className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors">
                  Terminate All Sessions
                </button>
              </section>

              <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-5 shadow-sm space-y-5">
                <h3 className="text-sm font-bold text-rose-900">Security & Access Governance</h3>
                
                <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-rose-100 shadow-sm">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Force Password Reset</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Logs user out and emails reset link.</div>
                  </div>
                  <button className="flex items-center justify-center rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"><KeyRound size={14} className="mr-1.5"/> Reset</button>
                </div>

                <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-rose-100 shadow-sm">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Suspend Access</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 shrink">Preserves data but completely blocks login immediately.</div>
                    </div>
                  {user.status === "Suspended" ? (
                    <button 
                      onClick={() => { reactivateUser(user.id); }}
                      className="flex items-center justify-center rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-600 shadow-sm"
                    >
                      <UserCheck size={14} className="mr-1.5"/> Reactivate
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        const reason = prompt("Enter reason for suspension:");
                        if (reason) { suspendUser(user.id, reason); }
                      }}
                      className="flex items-center justify-center rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-600 shadow-sm"
                    >
                      <Power size={14} className="mr-1.5"/> Suspend
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-rose-200/60 shadow-sm">
                  <div>
                    <div className="text-xs font-bold text-rose-700">Remove Account Permanently</div>
                    <div className="text-[11px] text-rose-500 mt-0.5 max-w-[200px] leading-snug">Irreversible action. All authored data will be orphaned or attributed to [Deleted].</div>
                  </div>
                  <button 
                    onClick={RequestRemoval}
                    className="flex shrink-0 items-center justify-center rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-200 border border-rose-200"
                  >
                    <UserMinus size={14} className="mr-1.5"/> Remove
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </aside>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex items-center gap-2 py-4 text-xs font-bold transition-colors ${active ? "text-indigo-600" : "text-slate-500 hover:text-slate-800"}`}
    >
      {icon} {label}
      {active && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-600 rounded-t" />}
    </button>
  );
}

function Input({ label, value, readOnly }: { label: string, value: string, readOnly?: boolean }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-slate-700 mb-1.5">{label}</span>
      <input type="text" value={value} readOnly={readOnly} className={`w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium focus:outline-none ${readOnly ? "bg-slate-50 text-slate-500 cursor-not-allowed" : "bg-white text-slate-900 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"}`} />
    </label>
  );
}

function Select({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange?: (v: string) => void }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-slate-700 mb-1.5">{label}</span>
      <select value={value} onChange={e => onChange?.(e.target.value)} disabled={!onChange} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium bg-white text-slate-900 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 cursor-pointer">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
