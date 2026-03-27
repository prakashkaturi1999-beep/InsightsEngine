"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { DomainType, PermissionLevel, UserRole, UserStatus } from "@/lib/adminStore";

export type ViewerRole = "Super Admin" | "Owner";

export type AdminFilters = {
  search: string;
  status: UserStatus | "All Statuses";
  role: UserRole | "All Roles";
  domain: DomainType | "All Domains";
  level: PermissionLevel | "All Levels";
  /** Global page-level scope filter — org */
  filterOrg: string;
  /** Global page-level scope filter — brand (cascades from filterOrg) */
  filterBrand: string;
  /** Global page-level scope filter — location (cascades from filterBrand) */
  filterLocation: string;
  /** Whose perspective is the admin looking from */
  viewerRole: ViewerRole;
};

type AdminFilterContextValue = {
  filters: AdminFilters;
  setFilters: (patch: Partial<AdminFilters>) => void;
  resetFilters: () => void;
};

export const DEFAULT_FILTERS: AdminFilters = {
  search: "",
  status: "All Statuses",
  role: "All Roles",
  domain: "All Domains",
  level: "All Levels",
  filterOrg: "All Organisations",
  filterBrand: "All Brands",
  filterLocation: "All Locations",
  viewerRole: "Super Admin",
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
