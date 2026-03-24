"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface SupplyFilter {
  dateRange: string;
  comparison: string;
  org: string;
  brand: string;
  location: string;
  exceptionsOnly: boolean;
}

interface SupplyFilterContextType {
  filters: SupplyFilter;
  setFilters: React.Dispatch<React.SetStateAction<SupplyFilter>>;
}

const SupplyFilterContext = createContext<SupplyFilterContextType | undefined>(undefined);

export function SupplyFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<SupplyFilter>({
    dateRange: "Last 7 Days",
    comparison: "vs Last Week",
    org: "Craven Group",
    brand: "All Brands",
    location: "All Locations",
    exceptionsOnly: false,
  });

  return (
    <SupplyFilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </SupplyFilterContext.Provider>
  );
}

export function useSupplyFilters() {
  const context = useContext(SupplyFilterContext);
  if (context === undefined) {
    throw new Error("useSupplyFilters must be used within a SupplyFilterProvider");
  }
  return context;
}
