"use client";

import { createContext, useContext, useState, useMemo, ReactNode } from "react";

export type FinanceFilter = {
  dateRange: string;   // "7d" | "14d" | "mtd" | "qtd" | "ytd"
  comparison: string;  // "week" | "month" | "budget" | "target"
  org: string;
  brand: string;
  location: string;
};

type FinanceFilterContextValue = {
  filters: FinanceFilter;
  setFilters: (f: Partial<FinanceFilter>) => void;
};

const FinanceFilterContext = createContext<FinanceFilterContextValue | null>(null);

const DEFAULT_FILTERS: FinanceFilter = {
  dateRange: "7d",
  comparison: "week",
  org: "Craven Group",
  brand: "All Brands",
  location: "All Locations",
};

export function FinanceFilterProvider({
  children,
  initial,
}: {
  children: ReactNode;
  initial?: Partial<FinanceFilter>;
}) {
  const [filters, setFiltersState] = useState<FinanceFilter>({
    ...DEFAULT_FILTERS,
    ...initial,
  });

  const setFilters = (patch: Partial<FinanceFilter>) =>
    setFiltersState((prev) => ({ ...prev, ...patch }));

  const value = useMemo(() => ({ filters, setFilters }), [filters]);

  return (
    <FinanceFilterContext.Provider value={value}>
      {children}
    </FinanceFilterContext.Provider>
  );
}

export function useFinanceFilters() {
  const ctx = useContext(FinanceFilterContext);
  if (!ctx)
    throw new Error("useFinanceFilters must be used within FinanceFilterProvider");
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
