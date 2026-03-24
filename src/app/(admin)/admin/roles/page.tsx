"use client";

import { useAdminStore, DomainType, PermissionLevel, UserRole } from "@/lib/adminStore";
import { Shield, Layers, HelpCircle, ArrowRight } from "lucide-react";

const DOMAINS: DomainType[] = [
  "Finance", "Sales", "Orders", "Inventory", 
  "HR & Labour", "Guest Experience", "Menu Intelligence", "Operations"
];
const ROLES: UserRole[] = ["Super Admin", "Organisation Director", "General Manager", "Kitchen Manager", "Floor Manager", "Shift Supervisor"];

export default function RolesPage() {
  const { defaultPermissions } = useAdminStore();

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Role Permissions Template</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Configure default operational domain access automatically granted when assigning standard roles.</p>
        </div>
        <button className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
          <HelpCircle size={15} /> Read Documentation
        </button>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-sm text-indigo-800 font-medium">
        <Shield size={18} className="shrink-0 text-indigo-600" />
        <p><strong>Note:</strong> Super Admin (CEO, CTO) accounts possess hard-coded Admin restrictions globally across all domains. Their templates are immutable.</p>
      </div>

      {/* Matrix Grid */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="py-4 pl-6 pr-3 text-[11px] font-bold uppercase tracking-widest text-slate-400 w-64 bg-slate-50 sticky left-0 z-10 border-r border-slate-100">
                <div className="flex items-center gap-2"><Layers size={14}/> Domain / Service</div>
              </th>
              {ROLES.map(role => (
                <th key={role} className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-600 border-l border-slate-100 text-center min-w-[140px]">
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {DOMAINS.map((domain) => (
              <tr key={domain} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 pl-6 pr-3 font-semibold text-slate-800 whitespace-nowrap bg-white sticky left-0 z-10 border-r border-slate-100 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                  {domain}
                </td>
                {ROLES.map(role => {
                  const level = defaultPermissions[role][domain];
                  return (
                    <td key={`${role}-${domain}`} className="py-4 px-4 border-l border-slate-100 text-center">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors ${
                        level === "Admin" ? "bg-slate-900 border-slate-900 text-white shadow-sm" :
                        level === "Edit" ? "bg-amber-100 border-amber-200 text-amber-800" :
                        level === "View" ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                        "bg-slate-50 border-slate-200 text-slate-400"
                      }`}>
                        {level}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
