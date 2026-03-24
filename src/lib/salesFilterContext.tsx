"use client";

import { createContext, useContext, useState, useMemo, ReactNode } from "react";

export type SalesFilter = {
  dateRange: string;   // "7d" | "14d" | "mtd" | "qtd" | "ytd"
  comparison: string;  // "week" | "month" | "budget" | "target"
  org: string;
  brand: string;
  location: string;
};

type SalesFilterContextValue = {
  filters: SalesFilter;
  setFilters: (f: Partial<SalesFilter>) => void;
};

const SalesFilterContext = createContext<SalesFilterContextValue | null>(null);

const DEFAULT_FILTERS: SalesFilter = {
  dateRange: "7d",
  comparison: "week",
  org: "Craven Group",
  brand: "All Brands",
  location: "All Locations",
};

export function SalesFilterProvider({
  children,
  initial,
}: {
  children: ReactNode;
  initial?: Partial<SalesFilter>;
}) {
  const [filters, setFiltersState] = useState<SalesFilter>({
    ...DEFAULT_FILTERS,
    ...initial,
  });

  const setFilters = (patch: Partial<SalesFilter>) =>
    setFiltersState((prev) => ({ ...prev, ...patch }));

  const value = useMemo(() => ({ filters, setFilters }), [filters]);

  return (
    <SalesFilterContext.Provider value={value}>
      {children}
    </SalesFilterContext.Provider>
  );
}

export function useSalesFilters() {
  const ctx = useContext(SalesFilterContext);
  if (!ctx)
    throw new Error("useSalesFilters must be used within SalesFilterProvider");
  return ctx;
}

/** Human-readable label for a date range key */
export function dateRangeLabel(key: string) {
  return (
    { "7d": "Last 7 Days", "14d": "Last 14 Days", mtd: "MTD", qtd: "QTD", ytd: "YTD" }[key] ?? key
  );
}

/** Human-readable label for comparison key */
export function comparisonLabel(key: string) {
  return (
    { week: "vs last week", month: "vs last month", budget: "vs budget", target: "vs target" }[key] ?? key
  );
}
