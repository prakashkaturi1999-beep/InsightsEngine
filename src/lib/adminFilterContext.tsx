"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { DomainType, PermissionLevel, UserRole, UserStatus } from "@/lib/adminStore";

export type AdminFilters = {
  search: string;
  status: UserStatus | "All Statuses";
  role: UserRole | "All Roles";
  domain: DomainType | "All Domains";
  level: PermissionLevel | "All Levels";
};

type AdminFilterContextValue = {
  filters: AdminFilters;
  setFilters: (patch: Partial<AdminFilters>) => void;
  resetFilters: () => void;
};

const DEFAULT_FILTERS: AdminFilters = {
  search: "",
  status: "All Statuses",
  role: "All Roles",
  domain: "All Domains",
  level: "All Levels",
};

const AdminFilterContext = createContext<AdminFilterContextValue | null>(null);

export function AdminFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<AdminFilters>(DEFAULT_FILTERS);

  const setFilters = (patch: Partial<AdminFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...patch }));
  };

  const resetFilters = () => {
    setFiltersState(DEFAULT_FILTERS);
  };

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      resetFilters,
    }),
    [filters]
  );

  return <AdminFilterContext.Provider value={value}>{children}</AdminFilterContext.Provider>;
}

export function useAdminFilters() {
  const ctx = useContext(AdminFilterContext);
  if (!ctx) throw new Error("useAdminFilters must be used within AdminFilterProvider");
  return ctx;
}
