"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { hierarchy } from "./executiveMock";

export type UserRole = 
  | "Super Admin" 
  | "Organisation Director" 
  | "General Manager" 
  | "Kitchen Manager" 
  | "Floor Manager" 
  | "Shift Supervisor";

export type DomainType = 
  | "Finance" 
  | "Sales" 
  | "Orders" 
  | "Inventory" 
  | "HR & Labour" 
  | "Guest Experience" 
  | "Menu Intelligence" 
  | "Operations";

export type PermissionLevel = "None" | "View" | "Edit" | "Admin";
export type UserStatus = "Active" | "Pending" | "Suspended";

export type UserScope = {
  org: string;
  brand: string;
  location: string;
};

export type AppUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  scope: UserScope;
  permissions: Record<DomainType, PermissionLevel>;
  status: UserStatus;
  lastActive: string;
  sessions: number;
};

export type AuditLogEntry = {
  id: string;
  timestamp: string;
  actor: string;
  subject: string;
  actionType: string;
  details: string;
};

export type AccessRequest = {
  id: string;
  userId: string;
  domain: DomainType;
  requestedLevel: PermissionLevel;
  reason: string;
  status: "Pending" | "Approved" | "Denied" | "Escalated";
  date: string;
};

const DEFAULT_PERMISSIONS: Record<UserRole, Record<DomainType, PermissionLevel>> = {
  "Super Admin": {
    "Finance": "Admin", "Sales": "Admin", "Orders": "Admin", "Inventory": "Admin",
    "HR & Labour": "Admin", "Guest Experience": "Admin", "Menu Intelligence": "Admin", "Operations": "Admin"
  },
  "Organisation Director": {
    "Finance": "Edit", "Sales": "Admin", "Orders": "Admin", "Inventory": "Admin",
    "HR & Labour": "Edit", "Guest Experience": "Edit", "Menu Intelligence": "Edit", "Operations": "Admin"
  },
  "General Manager": {
    "Finance": "View", "Sales": "Edit", "Orders": "Edit", "Inventory": "Edit",
    "HR & Labour": "Edit", "Guest Experience": "Edit", "Menu Intelligence": "None", "Operations": "Edit"
  },
  "Kitchen Manager": {
    "Finance": "None", "Sales": "None", "Orders": "Edit", "Inventory": "Admin",
    "HR & Labour": "View", "Guest Experience": "None", "Menu Intelligence": "View", "Operations": "Edit"
  },
  "Floor Manager": {
    "Finance": "None", "Sales": "View", "Orders": "None", "Inventory": "None",
    "HR & Labour": "Edit", "Guest Experience": "Admin", "Menu Intelligence": "None", "Operations": "Edit"
  },
  "Shift Supervisor": {
    "Finance": "None", "Sales": "View", "Orders": "View", "Inventory": "View",
    "HR & Labour": "View", "Guest Experience": "View", "Menu Intelligence": "None", "Operations": "View"
  }
};

const FIRST_NAMES = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen", "Veera", "Alex", "Sam", "Emma", "Olivia"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Prakash", "Chen", "Kim", "Nguyen", "Ali"];
const ROLES: UserRole[] = ["Super Admin", "Organisation Director", "General Manager", "Kitchen Manager", "Floor Manager", "Shift Supervisor"];

// Generate 450 robust dummy users tracking to the huge organization map
const INITIAL_USERS: AppUser[] = Array.from({ length: 450 }).map((_, i) => {
  const f = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const l = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const email = `${f.toLowerCase()}.${l.toLowerCase()}${i}@corporate.com`;

  const org = hierarchy.organizations[Math.floor(Math.random() * hierarchy.organizations.length)];
  const brandObj = org.chains[0].brands[Math.floor(Math.random() * org.chains[0].brands.length)];
  const locArr = brandObj.regions[0].locations;

  const isLocScope = Math.random() > 0.4; // 60% are location managers
  const isBrandScope = Math.random() > 0.7; // 30% are brand managers

  const location = isLocScope && locArr.length > 0 ? locArr[Math.floor(Math.random() * locArr.length)].name : "All Locations";
  const brand = isLocScope || isBrandScope ? brandObj.name : "All Brands";
  const orgName = Math.random() > 0.95 ? "All Organisations" : org.name;

  const r = ROLES[Math.floor(Math.random() * ROLES.length)];
  const stat: UserStatus = Math.random() > 0.95 ? "Suspended" : Math.random() > 0.85 ? "Pending" : "Active";
  
  return {
    id: `usr_gen_${i}`,
    firstName: f,
    lastName: l,
    email,
    role: r,
    scope: { org: orgName, brand: brand, location },
    permissions: { ...DEFAULT_PERMISSIONS[r] },
    status: stat,
    lastActive: stat === "Active" ? `${Math.floor(Math.random() * 60)} mins ago` : "-",
    sessions: stat === "Active" ? Math.floor(Math.random() * 3) + 1 : 0
  };
});

const INITIAL_LOGS: AuditLogEntry[] = [
  { id: "log_001", timestamp: new Date(Date.now() - 3600000).toISOString(), actor: "System", subject: "Massive Migration", actionType: "Data Insert", details: "Inserted 450 user accounts via bulk upload." },
];

const INITIAL_REQUESTS: AccessRequest[] = [
  { id: "req_1", userId: "usr_gen_15", domain: "Finance", requestedLevel: "View", reason: "Need to check daily tip pool allocations against revenue.", status: "Pending", date: "2 hours ago" },
  { id: "req_2", userId: "usr_gen_400", domain: "Menu Intelligence", requestedLevel: "Admin", reason: "Cross-brand aggregation reporting.", status: "Pending", date: "1 day ago" }
];

type AdminStoreContextType = {
  users: AppUser[];
  auditLogs: AuditLogEntry[];
  accessRequests: AccessRequest[];
  addUser: (data: Omit<AppUser, "id" | "lastActive" | "sessions">) => void;
  updateUser: (id: string, data: Partial<AppUser>) => void;
  suspendUser: (id: string, reason: string) => void;
  reactivateUser: (id: string) => void;
  removeUsers: (ids: string[]) => void;
  bulkChangeRole: (ids: string[], currentActor: string, targetRole: UserRole) => void;
  logAction: (actor: string, subject: string, actionType: string, details: string) => void;
  processAccessRequest: (id: string, decision: "Approved" | "Denied") => void;
  resendInvites: (ids: string[]) => void;
  defaultPermissions: typeof DEFAULT_PERMISSIONS;
};

const AdminContext = createContext<AdminStoreContextType | undefined>(undefined);

export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AppUser[]>(INITIAL_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_LOGS);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>(INITIAL_REQUESTS);

  const logAction = useCallback((actor: string, subject: string, actionType: string, details: string) => {
    setAuditLogs(prev => [
      { id: `log_${Date.now()}_${Math.random()}`, timestamp: new Date().toISOString(), actor, subject, actionType, details },
      ...prev
    ]);
  }, []);

  const addUser = useCallback((data: Omit<AppUser, "id" | "lastActive" | "sessions">) => {
    const newUser: AppUser = {
      ...data,
      id: `usr_${Date.now()}`,
      lastActive: "-",
      sessions: 0
    };
    setUsers(prev => [newUser, ...prev]);
    logAction("Current Admin", `${data.firstName} ${data.lastName}`, "User Created", `Created user with role ${data.role}`);
  }, [logAction]);

  const updateUser = useCallback((id: string, data: Partial<AppUser>) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        logAction("Current Admin", `${u.firstName} ${u.lastName}`, "Profile Updated", `Updated specific profile or permission fields.`);
        return { ...u, ...data };
      }
      return u;
    }));
  }, [logAction]);

  const suspendUser = useCallback((id: string, reason: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        logAction("Current Admin", `${u.firstName} ${u.lastName}`, "Suspended", `Reason: ${reason}`);
        return { ...u, status: "Suspended", sessions: 0 };
      }
      return u;
    }));
  }, [logAction]);

  const reactivateUser = useCallback((id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        logAction("Current Admin", `${u.firstName} ${u.lastName}`, "Reactivated", "Restored access permissions");
        return { ...u, status: "Active" };
      }
      return u;
    }));
  }, [logAction]);

  const removeUsers = useCallback((ids: string[]) => {
    setUsers(prev => {
      const remaining = prev.filter(u => !ids.includes(u.id));
      const removed = prev.filter(u => ids.includes(u.id));
      removed.forEach(r => logAction("Current Admin", `${r.firstName} ${r.lastName}`, "User Removed", "Irreversible account deletion"));
      return remaining;
    });
  }, [logAction]);

  const bulkChangeRole = useCallback((ids: string[], currentActor: string, targetRole: UserRole) => {
    setUsers(prev => prev.map(u => {
      if (ids.includes(u.id) && u.role !== "Super Admin") {
        logAction(currentActor, `${u.firstName} ${u.lastName}`, "Role Changed", `Changed from ${u.role} to ${targetRole}.`);
        return { ...u, role: targetRole, permissions: { ...DEFAULT_PERMISSIONS[targetRole] } };
      }
      return u;
    }));
  }, [logAction]);

  const resendInvites = useCallback((ids: string[]) => {
    setUsers(prev => {
      prev.filter(u => ids.includes(u.id) && u.status === "Pending").forEach(u => {
        logAction("Current Admin", `${u.firstName} ${u.lastName}`, "Invite Resent", "New 48h link dispatched");
      });
      return prev;
    });
  }, [logAction]);

  const processAccessRequest = useCallback((id: string, decision: "Approved" | "Denied") => {
    setAccessRequests(prev => prev.map(r => {
      if (r.id === id) {
        if (decision === "Approved") {
          setUsers(ups => ups.map(u => {
            if (u.id === r.userId) {
              logAction("Current Admin", `${u.firstName} ${u.lastName}`, "Permission Upgraded", `Granted ${r.requestedLevel} access via Request ${id}`);
              return { ...u, permissions: { ...u.permissions, [r.domain]: r.requestedLevel } };
            }
            return u;
          }));
        } else {
          logAction("Current Admin", r.userId, "Request Denied", `Denied access request for ${r.domain}`);
        }
        return { ...r, status: decision };
      }
      return r;
    }));
  }, [logAction]);

  return (
    <AdminContext.Provider value={{
      users, auditLogs, accessRequests,
      addUser, updateUser, suspendUser, reactivateUser, removeUsers, bulkChangeRole, logAction, processAccessRequest, resendInvites,
      defaultPermissions: DEFAULT_PERMISSIONS
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminStore() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdminStore must be used within an AdminStoreProvider");
  return context;
}
