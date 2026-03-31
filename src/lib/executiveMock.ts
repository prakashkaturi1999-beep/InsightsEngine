export type Role =
  | "CEO"
  | "CFO"
  | "COO"
  | "OrgAdmin"
  | "BrandAdmin"
  | "LocationManager"
  | "Analyst";

export type AccessBadge =
  | "CEO Access"
  | "Org Admin"
  | "Brand Admin"
  | "Location Manager"
  | "Analyst";

export type Scope = {
  org: string;
  brand: string | "All Brands";
  location: string | "All Locations";
};

export type ExecutiveUser = {
  id: string;
  name: string;
  email: string;
  title: string;
  role: Role;
  accessBadge: AccessBadge;
  lastLogin: string;
};

export const currentUser: ExecutiveUser = {
  id: "u_veera",
  name: "Veera Katuri",
  email: "veera@cravengroup.com",
  title: "Chief Executive Officer",
  role: "CEO",
  accessBadge: "CEO Access",
  lastLogin: "Today, 8:12 AM",
};

export const currentScope: Scope = {
  org: "Craven Group",
  brand: "All Brands",
  location: "All Locations",
};

export type RestaurantHierarchy = {
  owner: string;
  organizations: {
    id: string;
    name: string;
    chains: {
      id: string;
      name: string;
      brands: {
        id: string;
        name: string;
        regions: {
          id: string;
          name: string;
          locations: { id: string; name: string }[];
        }[];
      }[];
    }[];
  }[];
};

// MASSIVE DUMMY DATA GENERATION
const ORG_NAMES = [
  "Craven Group", "Zenith Hospitality", "Nova Eateries", "Summit Food Co", 
  "Omega Dining", "Vanguard Restaurant Group", "Pinnacle Brands", "Global Food Partners"
];

// 32 Brands total (4 per org)
const BRAND_ROSTER = [
  // Craven
  "Craven Wings", "Wings Express", "Southern Bites", "Urban Smokehouse",
  // Zenith
  "Zenith Grill", "Morning Cafe", "Night Owl Pizza", "Zenith Tacos",
  // Nova
  "Nova Fish House", "Lunar Burger", "Starlight Diner", "Nova Bowls",
  // Summit
  "Peak Steakhouse", "Summit Wraps", "Altitude Coffee", "Basecamp BBQ",
  // Omega
  "Alpha Sushi", "Omega Noodles", "Delta Dim Sum", "Gamma Fusion",
  // Vanguard
  "Vanguard Pastry", "Guardhouse Grill", "Sentinel Salads", "Vanguard Deli",
  // Pinnacle
  "Apex Pub", "Pinnacle Panini", "Vertex Veg", "Crown Catering",
  // Global
  "Earth Eats", "Passport Plates", "Continental Cuisine", "Globe Trotter Cafe"
];

const REGIONS = ["Northeast", "Southeast", "Midwest", "Southwest", "West Coast"];
const CITIES = ["New York", "Boston", "Atlanta", "Miami", "Chicago", "Detroit", "Austin", "Dallas", "Los Angeles", "Seattle"];
const VENUES = ["Downtown", "Midtown", "Plaza", "Airport", "Station", "Mall", "Heights", "Valley", "Crossroads", "Pavilion", "Avenue", "Market"];

function generateHierarchy(): RestaurantHierarchy {
  let brandIndex = 0;
  let locCounter = 1;
  const orgs = ORG_NAMES.map((orgName) => {
    const brandsForOrg = [];
    for (let i = 0; i < 4; i++) {
      const brandName = BRAND_ROSTER[brandIndex++];
      
      const numRegions = 2 + (i % 3); // 2-4 regions per brand
      const regions = REGIONS.slice(0, numRegions).map((region, rIdx) => {
        const numCities = 3 + (rIdx % 4); // 3-6 locations per region
        const locations = CITIES.slice((brandIndex + rIdx) % CITIES.length, ((brandIndex + rIdx) % CITIES.length) + numCities).map((city, cIdx) => {
          const venue = VENUES[(brandIndex + cIdx * 7) % VENUES.length];
          const locName = `${city} - ${venue}`;
          return {
            id: `loc_${locCounter++}`,
            name: locName
          };
        });
        if (locations.length === 0) {
          locations.push({ id: `loc_${locCounter++}`, name: `Metro 1` });
          locations.push({ id: `loc_${locCounter++}`, name: `Metro 2` });
          locations.push({ id: `loc_${locCounter++}`, name: `Metro 3` });
        }
        return {
          id: `reg_${region.toLowerCase().replace(/\s/g, '_')}_${rIdx}`,
          name: region,
          locations
        };
      });

      brandsForOrg.push({
        id: `brand_${brandName.toLowerCase().replace(/\s/g, '_')}`,
        name: brandName,
        regions
      });
    }

    return {
      id: `org_${orgName.toLowerCase().replace(/\s/g, '_')}`,
      name: orgName,
      chains: [{
        id: `chain_${orgName.toLowerCase().replace(/\s/g, '_')}_main`,
        name: `${orgName} Master Chain`,
        brands: brandsForOrg
      }]
    };
  });

  return { owner: "Executive Insight Owner", organizations: orgs };
}

export const hierarchy: RestaurantHierarchy = generateHierarchy();
export const orgSwitcher = hierarchy.organizations.map((o) => ({ id: o.id, name: o.name }));

// Flat arrays for PerfRows
export type PerfRow = {
  id: string;
  name: string;
  level: "org" | "brand" | "location";
  revenue: number;
  cogsPct: number;
  laborPct: number;
  guestScore: number;
  avgTicket: number;
  alerts: number;
};

export const orgPerfRows: PerfRow[] = [];
export const brandPerfRows: PerfRow[] = [];
export const locationPerfRows: PerfRow[] = [];
export const brandToOrg: Record<string, string> = {};
export const locationToBrand: Record<string, string> = {};

// Random seeded generator for stable values
let seed = 12345;
function random() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

hierarchy.organizations.forEach(org => {
  let orgRev = 0, orgCogs = 0, orgLabor = 0, orgGuest = 0, orgTickets = 0, orgAlerts = 0, orgLocCount = 0;

  org.chains.forEach(chain => {
    chain.brands.forEach(brand => {
      brandToOrg[brand.name] = org.name;
      let brandRev = 0, brandCogs = 0, brandLabor = 0, brandGuest = 0, brandTickets = 0, brandAlerts = 0, brandLocCount = 0;

      brand.regions.forEach(region => {
        region.locations.forEach(loc => {
          locationToBrand[loc.name] = brand.name;
          // deterministic random values
          const revenue = 80000 + Math.floor(random() * 250000);
          const cogsPct = 22 + random() * 12;
          const laborPct = 24 + random() * 9;
          const guestScore = 40 + random() * 50;
          const avgTicket = 10 + random() * 20;
          const alerts = Math.floor(random() * 3);

          brandRev += revenue; brandCogs += cogsPct; brandLabor += laborPct; 
          brandGuest += guestScore; brandTickets += avgTicket; brandAlerts += alerts;
          brandLocCount++;

          locationPerfRows.push({
            id: loc.id, name: loc.name, level: "location",
            revenue: Math.round(revenue), 
            cogsPct: Number(cogsPct.toFixed(1)), 
            laborPct: Number(laborPct.toFixed(1)), 
            guestScore: Math.round(guestScore), 
            avgTicket: Number(avgTicket.toFixed(2)), 
            alerts
          });
        });
      });

      orgRev += brandRev; orgCogs += brandCogs; orgLabor += brandLabor; 
      orgGuest += brandGuest; orgTickets += brandTickets; orgAlerts += brandAlerts;
      orgLocCount += brandLocCount;

      brandPerfRows.push({
        id: brand.id, name: brand.name, level: "brand",
        revenue: Math.round(brandRev), 
        cogsPct: Number((brandCogs / brandLocCount).toFixed(1)), 
        laborPct: Number((brandLabor / brandLocCount).toFixed(1)), 
        guestScore: Math.round(brandGuest / brandLocCount), 
        avgTicket: Number((brandTickets / brandLocCount).toFixed(2)), 
        alerts: brandAlerts
      });
    });
  });

  orgPerfRows.push({
    id: org.id, name: org.name, level: "org",
    revenue: Math.round(orgRev), 
    cogsPct: Number((orgCogs / orgLocCount).toFixed(1)), 
    laborPct: Number((orgLabor / orgLocCount).toFixed(1)), 
    guestScore: Math.round(orgGuest / orgLocCount), 
    avgTicket: Number((orgTickets / orgLocCount).toFixed(2)), 
    alerts: orgAlerts
  });
});

export function getPerformanceRows(scope: Scope): PerfRow[] {
  const { org, brand, location } = scope;

  // Location selected — show just that one location
  if (location !== "All Locations") {
    return locationPerfRows.filter((r) => r.name === location);
  }

  // Brand selected — show all locations under that brand for the selected org
  if (brand !== "All Brands") {
    return locationPerfRows.filter((r) => locationToBrand[r.name] === brand);
  }

  // Org selected (no brand/location) — show brands under that specific org
  const brandsUnderOrg = brandPerfRows.filter((r) => brandToOrg[r.name] === org);
  if (brandsUnderOrg.length > 0) return brandsUnderOrg;

  // Org has no sub-brands — show just that org's row
  const orgRow = orgPerfRows.find((r) => r.name === org);
  if (orgRow) return [orgRow];

  // No specific org selected — show all orgs
  return orgPerfRows;
}

// Global Options export for easy dropdown mappings
export const options = {
  organizations: ["All Organisations", ...hierarchy.organizations.map((o) => o.name)],
  brands: ["All Brands", ...brandPerfRows.map(b => b.name)],
  locations: ["All Locations", ...locationPerfRows.map(l => l.name)],
};

export type ExecutiveKpi = {
  id: string;
  label: string;
  value: string;
  deltaPct: number;
  status: "good" | "warn" | "bad" | "neutral";
  targetLabel?: string;
  targetValue?: string;
  spark: number[];
};

type ExecutiveKpiBase = Omit<ExecutiveKpi, "value"> & {
  valueBase: number;
  valueFormat: "currency" | "percent" | "number";
  valueSuffix?: string;
};

const executiveKpisBase: ExecutiveKpiBase[] = [
  { id: "rev", label: "Total Revenue", valueBase: 3840000, valueFormat: "currency", deltaPct: 6.8, status: "good", targetLabel: "vs Budget", targetValue: "+2.1%", spark: [32, 34, 33, 36, 35, 38, 39] },
  { id: "margin", label: "Gross Margin", valueBase: 42.6, valueFormat: "percent", deltaPct: 1.2, status: "good", targetLabel: "Target", targetValue: "41.5%", spark: [41.1, 41.5, 41.9, 42.2, 42.0, 42.4, 42.6] },
  { id: "sss", label: "Same-Store Sales", valueBase: 4.1, valueFormat: "percent", valueSuffix: "%", deltaPct: 0.7, status: "good", targetLabel: "vs Last Month", targetValue: "+1.3%", spark: [2.2, 2.6, 3.1, 3.5, 3.8, 4.0, 4.1] },
  { id: "cash", label: "Cash Position", valueBase: 1120000, valueFormat: "currency", deltaPct: -1.4, status: "warn", targetLabel: "Min Threshold", targetValue: "$1.00M", spark: [1.28, 1.26, 1.24, 1.2, 1.16, 1.14, 1.12] },
  { id: "inventory", label: "Inventory Health", valueBase: 92, valueFormat: "percent", deltaPct: -2.3, status: "warn", targetLabel: "Stockout Risk", targetValue: "5 items", spark: [96, 95, 95, 94, 93, 93, 92] },
  { id: "labor", label: "Labor Cost", valueBase: 29.4, valueFormat: "percent", deltaPct: 1.6, status: "warn", targetLabel: "Target", targetValue: "28.0%", spark: [27.8, 28.2, 28.5, 28.9, 29.1, 29.3, 29.4] },
  { id: "nps", label: "Customer Sentiment (NPS)", valueBase: 61, valueFormat: "number", deltaPct: -4.2, status: "bad", targetLabel: "Target", targetValue: "65", spark: [67, 66, 64, 63, 62, 62, 61] },
  { id: "alerts", label: "Open Operational Alerts", valueBase: 14, valueFormat: "number", deltaPct: 8.0, status: "bad", targetLabel: "SLA", targetValue: "< 10", spark: [8, 9, 9, 10, 11, 12, 14] },
];

function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)); }

function formatValue(format: string, value: number, suffix?: string) {
  if (format === "currency") {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
    return `$${Math.round(value).toLocaleString()}`;
  }
  if (format === "percent") return `${value.toFixed(1)}%`;
  const rounded = value >= 100 ? Math.round(value) : Math.round(value * 10) / 10;
  return suffix ? `${rounded}${suffix}` : `${rounded}`;
}

export function getExecutiveKpis(scope: Scope): ExecutiveKpi[] {
  let scale = 1.0;
  if (scope.org !== "All Organisations") scale *= 0.125; // 1/8th of total
  if (scope.brand !== "All Brands") scale *= 0.25; // 1/4th of org
  if (scope.location !== "All Locations") scale *= 0.1; // 1/10th of brand

  return executiveKpisBase.map((k) => {
    let value = k.valueBase;
    if (k.id === "rev") value = k.valueBase * scale;
    if (k.id === "cash") value = k.valueBase * scale;
    if (k.id === "alerts") value = Math.max(1, Math.round(k.valueBase * scale * 2)); // randomly scale alerts

    const valueStr = k.id === "sss" ? `+${formatValue(k.valueFormat, value, k.valueSuffix)}` : formatValue(k.valueFormat, value, k.valueSuffix);

    return { ...k, value: valueStr };
  });
}

// Preserve other mocks below generically
export type PriorityItem = { id: string; title: string; detail: string; severity: "critical"|"high"|"medium"|"low"; owner?: string; };
export const todaysPriorities: PriorityItem[] = [
  { id: "p1", title: "15 locations below target sales", detail: "Widespread slowdown detected across 3 brands.", severity: "high", owner: "Sales Ops" },
  { id: "p2", title: "20 stores with labor over budget", detail: "Overage driven by overtime on weekend shifts. Review scheduling.", severity: "medium", owner: "COO" },
  { id: "p3", title: "5 items nearing stockout", detail: "Chicken wings (2 locations), fryer oil, paper bags, cola syrup.", severity: "high", owner: "Supply" },
  { id: "p4", title: "Customer complaints rising in one region", detail: "Memphis: late delivery + cold food mentions up 18%.", severity: "medium", owner: "CX" },
  { id: "p5", title: "4 pending access requests", detail: "2 location managers, 1 analyst, 1 finance contractor.", severity: "low", owner: "IT Admin" },
];

export type WorkspaceCard = { id: string; title: string; description: string; href: string; status: "healthy" | "watch" | "atRisk"; kpis: { label: string; value: string; deltaPct: number }[]; spark: number[]; note?: string; };
export const workspaces: WorkspaceCard[] = [
  { id: "finance", title: "Finance", description: "Profitability, cash, variance analysis, and governance.", href: "/finance", status: "watch", kpis: [{ label: "Cash", value: "$3.1M", deltaPct: -1.4 }, { label: "Margin", value: "42.6%", deltaPct: 1.2 }, { label: "Variance", value: "$84K", deltaPct: 3.1 }], spark: [10, 11, 12, 11, 12, 12, 13], note: "Cash position trending -1.4% — approaching minimum threshold. Review burn rate." },
  { id: "sales", title: "Sales", description: "Sales performance by location, channel, and menu.", href: "/sales", status: "healthy", kpis: [{ label: "Revenue", value: "$3.84M", deltaPct: 6.8 }, { label: "Orders", value: "98.2K", deltaPct: 3.2 }, { label: "AOV", value: "$39.10", deltaPct: 1.1 }], spark: [32, 34, 33, 36, 35, 38, 39], note: "Revenue up +6.8% YOY. 3 locations underperforming — Knoxville, Franklin, Murfreesboro." },
  { id: "orders", title: "Orders", description: "Vendor performance, logistics, and purchasing workflows.", href: "/orders", status: "healthy", kpis: [{ label: "On-time", value: "96%", deltaPct: 0.4 }, { label: "Lead Time", value: "4.2d", deltaPct: -5.1 }, { label: "Cost/Unit", value: "$4.12", deltaPct: 1.1 }], spark: [94, 95, 95, 96, 96, 96, 96], note: "Lead times down 5.1% — supplier negotiations paying off. Monitor cost/unit creep." },
  { id: "inventory", title: "Inventory", description: "Stock levels, replenishment, and shrinkage tracking.", href: "/inventory", status: "watch", kpis: [{ label: "Stock Health", value: "92%", deltaPct: -2.3 }, { label: "Turnover", value: "12.4x", deltaPct: 4.2 }, { label: "Shrinkage", value: "0.8%", deltaPct: -1.2 }], spark: [95, 94, 93, 93, 92, 92, 92], note: "5 items nearing stockout. Chicken wings critical at 2 locations — reorder now." },
  { id: "hr", title: "HR", description: "Labor efficiency, hiring health, and retention signals.", href: "/hr", status: "healthy", kpis: [{ label: "Labor", value: "29.4%", deltaPct: 1.6 }, { label: "Open Roles", value: "45", deltaPct: -3.0 }, { label: "Attrition", value: "3.1%", deltaPct: -0.6 }], spark: [28.2, 28.6, 29.0, 28.8, 29.1, 29.3, 29.4], note: "Labor cost +1.6% over target. Weekend overtime flagged — review staffing model." },
  { id: "customer", title: "Customer", description: "Experience signals across feedback, loyalty, and service.", href: "/customers", status: "atRisk", kpis: [{ label: "NPS", value: "61", deltaPct: -4.2 }, { label: "Complaints", value: "312", deltaPct: 12.4 }, { label: "Loyalty", value: "38%", deltaPct: 1.8 }], spark: [67, 66, 64, 63, 62, 62, 61], note: "NPS dropped -4.2 pts. Memphis complaints +18% — cold food & late delivery. Escalate." },
];

export const orgPerformance = []; // Deprecated
export const governanceSnapshot = { activeUsers: 4500, pendingRequests: 125, orgAdmins: 80, locationManagers: 1200, crossBrandAccess: 45, financeAccess: 380, hrAccess: 210, riskyCombos: 15, needReview: 42, inactiveUsers: 215 };
export type AccessRequest = {
  id: string;
  name: string;
  scope: string;
  requestedRole: Role;
  requestedModules: string[];
};

export const accessRequests: AccessRequest[] = [
  {
    id: "req_1",
    name: "John Smith",
    scope: "Zenith Hospitality > All Brands",
    requestedRole: "BrandAdmin",
    requestedModules: ["Sales", "Finance"],
  },
  {
    id: "req_2",
    name: "Sarah Connor",
    scope: "Craven Wings Downtown",
    requestedRole: "LocationManager",
    requestedModules: ["Inventory", "HR"],
  },
  {
    id: "req_3",
    name: "Mike Wazowski",
    scope: "Summit Food Co > Peak Steakhouse",
    requestedRole: "Analyst",
    requestedModules: ["Sales", "Orders"],
  },
];
