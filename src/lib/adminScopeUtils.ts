import type { UserScope } from "@/lib/adminStore";
import { hierarchy, type Scope } from "@/lib/executiveMock";

export const ALL_ORGANISATIONS = "All Organisations";
export const ALL_BRANDS = "All Brands";
export const ALL_LOCATIONS = "All Locations";

type ScopeTuple = {
  org: string;
  brand: string;
  location: string;
};

const scopeTuples: ScopeTuple[] = hierarchy.organizations.flatMap((org) =>
  org.chains.flatMap((chain) =>
    chain.brands.flatMap((brand) =>
      brand.regions.flatMap((region) =>
        region.locations.map((location) => ({
          org: org.name,
          brand: brand.name,
          location: location.name,
        }))
      )
    )
  )
);

function matchesOrg(tuple: ScopeTuple, org: string) {
  return org === ALL_ORGANISATIONS || tuple.org === org;
}

function matchesBrand(tuple: ScopeTuple, brand: string) {
  return brand === ALL_BRANDS || tuple.brand === brand;
}

function matchesLocation(tuple: ScopeTuple, location: string) {
  return location === ALL_LOCATIONS || tuple.location === location;
}

export function getAdminScopeOptions(scope: Pick<UserScope, "org" | "brand">) {
  const organizations = [ALL_ORGANISATIONS, ...hierarchy.organizations.map((org) => org.name)];

  const brands = [
    ALL_BRANDS,
    ...Array.from(
      new Set(
        scopeTuples
          .filter((tuple) => matchesOrg(tuple, scope.org))
          .map((tuple) => tuple.brand)
      )
    ),
  ];

  const locations = [
    ALL_LOCATIONS,
    ...Array.from(
      new Set(
        scopeTuples
          .filter((tuple) => matchesOrg(tuple, scope.org) && matchesBrand(tuple, scope.brand))
          .map((tuple) => tuple.location)
      )
    ),
  ];

  return { organizations, brands, locations };
}

function getScopedTuples(scope: { org: string; brand: string; location: string }) {
  return scopeTuples.filter(
    (tuple) =>
      matchesOrg(tuple, scope.org) &&
      matchesBrand(tuple, scope.brand) &&
      matchesLocation(tuple, scope.location)
  );
}

export function scopeIntersectsSelection(userScope: UserScope, selectedScope: Scope) {
  const selectedTuples = getScopedTuples(selectedScope);
  if (selectedTuples.length === 0) return false;

  const userTuples = getScopedTuples(userScope);
  if (userTuples.length === 0) return false;

  const selectedKeys = new Set(
    selectedTuples.map((tuple) => `${tuple.org}::${tuple.brand}::${tuple.location}`)
  );

  return userTuples.some((tuple) =>
    selectedKeys.has(`${tuple.org}::${tuple.brand}::${tuple.location}`)
  );
}

export function scopeMatchesScopeFilter(userScope: UserScope, selectedScope: Scope) {
  return scopeIntersectsSelection(userScope, selectedScope);
}

export function formatScopeLabel(scope: { org: string; brand: string; location: string }) {
  const bits = [scope.org];
  if (scope.brand !== ALL_BRANDS) bits.push(scope.brand);
  if (scope.location !== ALL_LOCATIONS) bits.push(scope.location);
  return bits.join(" · ");
}
