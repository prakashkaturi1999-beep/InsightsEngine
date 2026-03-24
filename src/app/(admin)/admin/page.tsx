"use client";

import { useState, useMemo } from "react";
import { useAdminStore, AppUser, UserRole } from "@/lib/adminStore";
import { Search, UserPlus, Filter, Shield, ShieldAlert, Mail, Ban, Trash2, ArrowRight, Check } from "lucide-react";
import { UserDetailDrawer } from "@/components/admin/UserDetailDrawer";
import { InviteUserModal } from "@/components/admin/InviteUserModal";

export default function AccessGovernancePage() {
  const { users, accessRequests, removeUsers, resendInvites, processAccessRequest } = useAdminStore();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const pendingRequests = useMemo(() => accessRequests.filter(r => r.status === "Pending"), [accessRequests]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredUsers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredUsers.map(u => u.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBulkRemove = () => {
    if (confirm(`Are you sure you want to permanently delete ${selectedIds.size} users? This is irreversible.`)) {
      removeUsers(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  return (
    <>
      <div className="space-y-6 pb-24">
        {/* Access Requests Banner Widget */}
        {pendingRequests.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-amber-200/60 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-900">Pending Access Requests ({pendingRequests.length})</h3>
                <p className="text-xs font-medium text-amber-700/80 mt-0.5">Approve or deny domain upgrades requested by your team.</p>
              </div>
            </div>
            <button className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-amber-600 transition-colors">
              Review Requests <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Directory</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Manage all {users.length} active and pending accounts across your scope.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
              <Filter size={15} /> Filter
            </button>
            <button 
              onClick={() => setIsInviteOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <UserPlus size={15} /> Invite User
            </button>
          </div>
        </div>

        {/* Directory Table Grid */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 p-2">
            <div className="flex items-center px-4 py-2 rounded-lg bg-slate-50 border border-slate-100">
              <Search size={16} className="text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-sm font-medium text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="py-4 pl-6 pr-3 w-12">
                    <button 
                      onClick={toggleSelectAll}
                      className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${selectedIds.size === filteredUsers.length && filteredUsers.length > 0 ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white hover:border-indigo-400'}`}
                    >
                      {selectedIds.size === filteredUsers.length && filteredUsers.length > 0 && <Check size={12} className="text-white" />}
                    </button>
                  </th>
                  <th className="py-4 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">User</th>
                  <th className="py-4 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Role</th>
                  <th className="py-4 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Scope</th>
                  <th className="py-4 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                  <th className="py-4 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm font-medium text-slate-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr 
                      key={user.id} 
                      className={`group hover:bg-slate-50 transition-colors ${selectedIds.has(user.id) ? 'bg-indigo-50/30' : ''}`}
                    >
                      <td className="py-3 pl-6 pr-3">
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleSelect(user.id); }}
                          className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${selectedIds.has(user.id) ? 'bg-indigo-600 border-indigo-600 mt-1' : 'border-slate-300 bg-white hover:border-indigo-400 mt-1'}`}
                        >
                          {selectedIds.has(user.id) && <Check size={12} className="text-white" />}
                        </button>
                      </td>
                      <td 
                        className="py-3 px-3 cursor-pointer" 
                        onClick={() => setActiveUserId(user.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-700 font-bold text-xs ring-2 ring-white shadow-sm">
                            {user.firstName[0]}{user.lastName[0]}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-xs font-medium text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1 shadow-sm">
                          <Shield size={12} className="text-indigo-500" />
                          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{user.role}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-xs font-semibold text-slate-700">{user.scope.brand === "All Brands" ? "All Scope" : user.scope.brand}</div>
                        <div className="text-[10px] uppercase tracking-wide text-slate-400 mt-0.5">{user.scope.location === "All Locations" ? "All Locs" : user.scope.location}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                          user.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-rose-100 text-rose-700'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-xs font-medium text-slate-600">{user.lastActive}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 rounded-full bg-slate-900 px-6 py-3 shadow-[0_20px_40px_rgba(15,23,42,0.3)] fade-in-up">
          <div className="text-sm font-bold text-white mr-2 border-r border-slate-700 pr-5">
            {selectedIds.size} Selected
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <Shield size={14} /> Change Role
            </button>
            <button onClick={() => { resendInvites(Array.from(selectedIds)); setSelectedIds(new Set()); }} className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <Mail size={14} /> Resend Invites
            </button>
            <button className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-slate-800 hover:text-amber-200 transition-colors">
              <Ban size={14} /> Suspend
            </button>
            <button onClick={handleBulkRemove} className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-slate-800 hover:text-rose-200 transition-colors ml-2 bg-rose-500/10">
              <Trash2 size={14} /> Remove
            </button>
          </div>
        </div>
      )}

      {/* Drawers and Modals */}
      <InviteUserModal open={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
      <UserDetailDrawer open={activeUserId !== null} onClose={() => setActiveUserId(null)} userId={activeUserId} />
    </>
  );
}
