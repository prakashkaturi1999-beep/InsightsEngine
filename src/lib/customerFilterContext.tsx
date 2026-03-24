"use client";

import { createContext, useContext, useState, useMemo, ReactNode } from "react";

export type CustomerFilter = {
  dateRange: string;   // "7d" | "14d" | "mtd" | "qtd" | "ytd"
  comparison: string;  // "week" | "month" | "budget" | "target"
  org: string;
  brand: string;
  location: string;
};

type CustomerFilterContextValue = {
  filters: CustomerFilter;
  setFilters: (f: Partial<CustomerFilter>) => void;
};

const CustomerFilterContext = createContext<CustomerFilterContextValue | null>(null);

const DEFAULT_FILTERS: CustomerFilter = {
  dateRange: "30d",
  comparison: "month",
  org: "Craven Group",
  brand: "All Brands",
  location: "All Locations",
};

export function CustomerFilterProvider({
  children,
  initial,
}: {
  children: ReactNode;
  initial?: Partial<CustomerFilter>;
}) {
  const [filters, setFiltersState] = useState<CustomerFilter>({
    ...DEFAULT_FILTERS,
    ...initial,
  });

  const setFilters = (patch: Partial<CustomerFilter>) =>
    setFiltersState((prev) => ({ ...prev, ...patch }));

  const value = useMemo(() => ({ filters, setFilters }), [filters]);

  return (
    <CustomerFilterContext.Provider value={value}>
      {children}
    </CustomerFilterContext.Provider>
  );
}

export function useCustomerFilters() {
  const ctx = useContext(CustomerFilterContext);
  if (!ctx)
    throw new Error("useCustomerFilters must be used within CustomerFilterProvider");
  return ctx;
}
