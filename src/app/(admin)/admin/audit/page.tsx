"use client";

import { useState, useMemo } from "react";
import { useAdminStore } from "@/lib/adminStore";
import { Search, Filter, ShieldAlert, Clock, User, Activity, FileText, Download } from "lucide-react";

export default function AuditLogPage() {
  const { auditLogs } = useAdminStore();
  const [search, setSearch] = useState("");

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => 
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.subject.toLowerCase().includes(search.toLowerCase()) ||
      log.actionType.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, auditLogs]);

  return (
    <div className="space-y-6 pb-24">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Audit Trail</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Immutable, cryptographic log of every recorded action across your security scope.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
            <Filter size={15} /> Advanced Filters
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-slate-800 transition-colors">
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 p-2">
          <div className="flex items-center px-4 py-2 rounded-lg bg-slate-50 border border-slate-100">
            <Search size={16} className="text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search by actor, subject, action, or details..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-sm font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="py-4 pl-6 pr-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <div className="flex items-center gap-1.5"><Clock size={12}/> Timestamp</div>
                </th>
                <th className="py-4 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <div className="flex items-center gap-1.5"><ShieldAlert size={12}/> Actor</div>
                </th>
                <th className="py-4 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <div className="flex items-center gap-1.5"><User size={12}/> Subject</div>
                </th>
                <th className="py-4 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <div className="flex items-center gap-1.5"><Activity size={12}/> Action Type</div>
                </th>
                <th className="py-4 px-3 pr-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <div className="flex items-center gap-1.5"><FileText size={12}/> Detailed Log</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center font-medium text-slate-500">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 pl-6 pr-3 whitespace-nowrap">
                      <div className="text-xs font-semibold text-slate-700">{new Date(log.timestamp).toLocaleDateString()}</div>
                      <div className="text-[10px] font-medium text-slate-400 mt-0.5">{new Date(log.timestamp).toLocaleTimeString()}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="inline-flex items-center px-2 py-0.5 rounded border border-slate-200 bg-white font-semibold text-slate-700 text-xs shadow-sm">
                        {log.actor}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700">
                      {log.subject}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-xs font-bold text-indigo-700 uppercase tracking-tight bg-indigo-50 px-2 py-1 rounded-md">
                        {log.actionType}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 pr-6 text-slate-600 font-medium text-xs max-w-sm leading-relaxed">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
