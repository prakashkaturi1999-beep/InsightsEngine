"use client";

import { createContext, useContext, useState, useMemo, ReactNode } from "react";

export type HrFilter = {
  dateRange: string;   // "7d" | "14d" | "mtd" | "qtd" | "ytd"
  comparison: string;  // "week" | "month" | "budget" | "target"
  org: string;
  brand: string;
  location: string;
};

type HrFilterContextValue = {
  filters: HrFilter;
  setFilters: (f: Partial<HrFilter>) => void;
};

const HrFilterContext = createContext<HrFilterContextValue | null>(null);

const DEFAULT_FILTERS: HrFilter = {
  dateRange: "7d",
  comparison: "week",
  org: "Craven Group",
  brand: "All Brands",
  location: "All Locations",
};

export function HrFilterProvider({
  children,
  initial,
}: {
  children: ReactNode;
  initial?: Partial<HrFilter>;
}) {
  const [filters, setFiltersState] = useState<HrFilter>({
    ...DEFAULT_FILTERS,
    ...initial,
  });

  const setFilters = (patch: Partial<HrFilter>) =>
    setFiltersState((prev) => ({ ...prev, ...patch }));

  const value = useMemo(() => ({ filters, setFilters }), [filters]);

  return (
    <HrFilterContext.Provider value={value}>
      {children}
    </HrFilterContext.Provider>
  );
}

export function useHrFilters() {
  const ctx = useContext(HrFilterContext);
  if (!ctx)
    throw new Error("useHrFilters must be used within HrFilterProvider");
  return ctx;
}
