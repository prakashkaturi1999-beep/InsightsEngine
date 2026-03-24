"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { RestaurantHierarchy, Scope } from "@/lib/executiveMock";
import { currentScope, hierarchy } from "@/lib/executiveMock";

type ScopeContextValue = {
  hierarchy: RestaurantHierarchy;
  scope: Scope;
  setScope: (next: Scope) => void;
  contextLine: string;
  options: {
    organizations: string[];
    brands: string[];
    locations: string[];
  };
};

const ScopeContext = createContext<ScopeContextValue | null>(null);

export function ExecutiveScopeProvider({
  children,
  initialScope = currentScope,
}: {
  children: React.ReactNode;
  initialScope?: Scope;
}) {
  const [scope, setScope] = useState<Scope>(initialScope);

  const options = useMemo(() => {
    const organizations = hierarchy.organizations.map((o) => o.name);

    // All brands under the selected org
    const orgNode = hierarchy.organizations.find((o) => o.name === scope.org);
    const brandsFromOrg = orgNode?.chains.flatMap((c) => c.brands.map((b) => b.name)) ?? [];
    const brands = ["All Brands", ...Array.from(new Set(brandsFromOrg))];

    // Locations: if a brand is selected, list locations under that brand
    const brandNode = (() => {
      if (scope.brand === "All Brands") return undefined;
      return orgNode?.chains.flatMap((c) => c.brands).find((b) => b.name === scope.brand);
    })();

    const locationNames =
      scope.brand === "All Brands"
        ? orgNode?.chains.flatMap((c) => c.brands.flatMap((b) => b.regions.flatMap((r) => r.locations.map((l) => l.name)))) ?? []
        : brandNode?.regions.flatMap((r) => r.locations.map((l) => l.name)) ?? [];

    const locations = ["All Locations", ...Array.from(new Set(locationNames))];

    return { organizations, brands, locations };
  }, [scope.org, scope.brand]);

  const contextLine = useMemo(() => {
    const bits: string[] = [];
    bits.push(scope.org);
    if (scope.brand !== "All Brands") bits.push(scope.brand);
    if (scope.location !== "All Locations") bits.push(scope.location);
    return bits.join(" · ");
  }, [scope]);

  const value = useMemo(
    () => ({ hierarchy, scope, setScope, contextLine, options }),
    [scope, contextLine, options]
  );

  return <ScopeContext.Provider value={value}>{children}</ScopeContext.Provider>;
}

export function useExecutiveScope() {
  const ctx = useContext(ScopeContext);
  if (!ctx) throw new Error("useExecutiveScope must be used within ExecutiveScopeProvider");
  return ctx;
}
