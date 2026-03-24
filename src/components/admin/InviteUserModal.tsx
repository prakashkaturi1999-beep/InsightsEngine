"use client";

import { useState } from "react";
import { useAdminStore, UserRole } from "@/lib/adminStore";
import { X, UserPlus, Send, Mail, Briefcase, MapPin } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const ROLES: UserRole[] = ["Super Admin", "Organisation Director", "General Manager", "Kitchen Manager", "Floor Manager", "Shift Supervisor"];

export function InviteUserModal({ open, onClose }: Props) {
  const { addUser, defaultPermissions } = useAdminStore();
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("General Manager");
  const [org, setOrg] = useState("All Organisations");
  const [brand, setBrand] = useState("All Brands");
  const [location, setLocation] = useState("All Locations");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) return alert("Fill out all identity fields.");
    
    addUser({
      firstName, lastName, email, role,
      scope: { org, brand, location },
      permissions: { ...defaultPermissions[role] },
      status: "Pending"
    });
    
    // reset form mapping
    setFirst(""); setLast(""); setEmail(""); setRole("General Manager"); setOrg("All Organisations");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-center pt-20">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-xl self-start rounded-[24px] bg-slate-50 shadow-2xl fade-in-up">
        <header className="flex items-center justify-between border-b border-slate-200/60 bg-white px-6 py-5 rounded-t-[24px]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <UserPlus size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Invite New Executive</h2>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">Workflow Step 1</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full bg-slate-50 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"><X size={18} /></button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
              <Mail size={14} /> Identity Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" value={firstName} onChange={setFirst} placeholder="Jane" />
              <Input label="Last Name" value={lastName} onChange={setLast} placeholder="Doe" />
              <div className="col-span-2">
                <Input label="Corporate Email" value={email} onChange={setEmail} placeholder="jane.doe@enterprise.com" type="email" />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
              <Briefcase size={14} /> Access Configuration
            </h3>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <Select label="Platform Hierarchy Role" value={role} onChange={v => setRole(v as UserRole)} options={ROLES} />
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
                <p className="text-xs font-medium text-indigo-800 leading-relaxed">
                  Assigning <span className="font-bold">{role}</span> will automatically apply the matching master permission template to all 8 operational domains. You can override specific domains later in the User Directory.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
              <MapPin size={14} /> Data Scope Restriction
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <Select label="Organisation" value={org} onChange={setOrg} options={["All Organisations", "Craven Group"]} />
              <Select label="Brand" value={brand} onChange={setBrand} options={["All Brands", "Urban Bite"]} />
              <Select label="Location" value={location} onChange={setLocation} options={["All Locations", "Downtown Central"]} />
            </div>
          </section>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200/50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
              <Send size={15} /> Send 48hr Invitation
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string, type?: string }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-slate-700 mb-1.5">{label}</span>
      <input type={type} required value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20" />
    </label>
  );
}

function Select({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-slate-700 mb-1.5">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium bg-white text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 cursor-pointer">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
