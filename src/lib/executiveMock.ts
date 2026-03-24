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

export const hierarchy: RestaurantHierarchy = {
  owner: "Owner",
  organizations: [
    {
      id: "org_craven",
      name: "Craven Group",
      chains: [
        {
          id: "chain_wings",
          name: "Wings Division",
          brands: [
            {
              id: "brand_craven_wings",
              name: "Craven Wings",
              regions: [
                {
                  id: "region_tn",
                  name: "Tennessee",
                  locations: [
                    { id: "loc_knox", name: "Knoxville West" },
                    { id: "loc_frank", name: "Franklin" },
                    { id: "loc_murf", name: "Murfreesboro" },
                  ],
                },
                {
                  id: "region_ga",
                  name: "Georgia",
                  locations: [
                    { id: "loc_atl_mid", name: "Atlanta Midtown" },
                    { id: "loc_atl_buck", name: "Atlanta Buckhead" },
                  ],
                },
              ],
            },
            {
              id: "brand_wings_express",
              name: "Wings Express",
              regions: [
                {
                  id: "region_tx",
                  name: "Texas",
                  locations: [
                    { id: "loc_austin", name: "Austin Central" },
                    { id: "loc_dallas", name: "Dallas North" },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "chain_bites",
          name: "Southern Bites",
          brands: [
            {
              id: "brand_southern_bites",
              name: "Southern Bites",
              regions: [
                {
                  id: "region_al",
                  name: "Alabama",
                  locations: [
                    { id: "loc_bham", name: "Birmingham" },
                    { id: "loc_hunts", name: "Huntsville" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "org_nash",
      name: "Nashville Chicken House",
      chains: [
        {
          id: "chain_nch",
          name: "NCH Core",
          brands: [
            {
              id: "brand_nch",
              name: "Nashville Chicken House",
              regions: [
                {
                  id: "region_tn_2",
                  name: "Tennessee",
                  locations: [
                    { id: "loc_nash_1", name: "Nashville Downtown" },
                    { id: "loc_nash_2", name: "Nashville East" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const orgSwitcher = hierarchy.organizations.map((o) => ({
  id: o.id,
  name: o.name,
}));

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
  {
    id: "rev",
    label: "Total Revenue",
    valueBase: 3_840_000,
    valueFormat: "currency",
    deltaPct: 6.8,
    status: "good",
    targetLabel: "vs Budget",
    targetValue: "+2.1%",
    spark: [32, 34, 33, 36, 35, 38, 39],
  },
  {
    id: "margin",
    label: "Gross Margin",
    valueBase: 42.6,
    valueFormat: "percent",
    deltaPct: 1.2,
    status: "good",
    targetLabel: "Target",
    targetValue: "41.5%",
    spark: [41.1, 41.5, 41.9, 42.2, 42.0, 42.4, 42.6],
  },
  {
    id: "sss",
    label: "Same-Store Sales",
    valueBase: 4.1,
    valueFormat: "percent",
    valueSuffix: "%",
    deltaPct: 0.7,
    status: "good",
    targetLabel: "vs Last Month",
    targetValue: "+1.3%",
    spark: [2.2, 2.6, 3.1, 3.5, 3.8, 4.0, 4.1],
  },
  {
    id: "cash",
    label: "Cash Position",
    valueBase: 1_120_000,
    valueFormat: "currency",
    deltaPct: -1.4,
    status: "warn",
    targetLabel: "Min Threshold",
    targetValue: "$1.00M",
    spark: [1.28, 1.26, 1.24, 1.2, 1.16, 1.14, 1.12],
  },
  {
    id: "inventory",
    label: "Inventory Health",
    valueBase: 92,
    valueFormat: "percent",
    deltaPct: -2.3,
    status: "warn",
    targetLabel: "Stockout Risk",
    targetValue: "5 items",
    spark: [96, 95, 95, 94, 93, 93, 92],
  },
  {
    id: "labor",
    label: "Labor Cost",
    valueBase: 29.4,
    valueFormat: "percent",
    deltaPct: 1.6,
    status: "warn",
    targetLabel: "Target",
    targetValue: "28.0%",
    spark: [27.8, 28.2, 28.5, 28.9, 29.1, 29.3, 29.4],
  },
  {
    id: "nps",
    label: "Customer Sentiment (NPS)",
    valueBase: 61,
    valueFormat: "number",
    deltaPct: -4.2,
    status: "bad",
    targetLabel: "Target",
    targetValue: "65",
    spark: [67, 66, 64, 63, 62, 62, 61],
  },
  {
    id: "alerts",
    label: "Open Operational Alerts",
    valueBase: 14,
    valueFormat: "number",
    deltaPct: 8.0,
    status: "bad",
    targetLabel: "SLA",
    targetValue: "< 10",
    spark: [8, 9, 9, 10, 11, 12, 14],
  },
];

type ScopeFactor = {
  revenue: number;
  cash: number;
  alerts: number;
  nps: number;
  inventory: number;
  labor: number;
  margin: number;
};

const orgFactors: Record<string, ScopeFactor> = {
  "Craven Group": {
    revenue: 1.0,
    cash: 1.0,
    alerts: 1.0,
    nps: 1.0,
    inventory: 1.0,
    labor: 1.0,
    margin: 1.0,
  },
  "Nashville Chicken House": {
    revenue: 0.62,
    cash: 0.72,
    alerts: 0.85,
    nps: 0.92,
    inventory: 0.97,
    labor: 1.04,
    margin: 0.98,
  },
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatValue(
  format: ExecutiveKpiBase["valueFormat"],
  value: number,
  suffix?: string
) {
  if (format === "currency") {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
    return `$${Math.round(value).toLocaleString()}`;
  }
  if (format === "percent") {
    return `${value.toFixed(1)}%`;
  }
  const rounded = value >= 100 ? Math.round(value) : Math.round(value * 10) / 10;
  return suffix ? `${rounded}${suffix}` : `${rounded}`;
}

export function getExecutiveKpis(scope: Scope): ExecutiveKpi[] {
  const factor = orgFactors[scope.org] ?? orgFactors["Craven Group"];
  const brandNudge =
    scope.brand === "All Brands"
      ? 1
      : scope.brand === "Craven Wings"
        ? 1.03
        : 0.98;
  const locationNudge = scope.location === "All Locations" ? 1 : 0.92;

  const revenueFactor = factor.revenue * brandNudge * locationNudge;
  const cashFactor = factor.cash * brandNudge * locationNudge;
  const alertsFactor = clamp(factor.alerts / brandNudge, 0.6, 1.3);

  return executiveKpisBase.map((k) => {
    let value = k.valueBase;
    if (k.id === "rev") value = k.valueBase * revenueFactor;
    if (k.id === "cash") value = k.valueBase * cashFactor;
    if (k.id === "alerts") value = Math.max(1, Math.round(k.valueBase * alertsFactor));
    if (k.id === "nps") value = clamp(k.valueBase * factor.nps, 45, 75);
    if (k.id === "inventory") value = clamp(k.valueBase * factor.inventory, 80, 99);
    if (k.id === "labor") value = clamp(k.valueBase * factor.labor, 24, 36);
    if (k.id === "margin") value = clamp(k.valueBase * factor.margin, 34, 55);

    const valueStr =
      k.id === "sss"
        ? `+${formatValue(k.valueFormat, value, k.valueSuffix)}`
        : formatValue(k.valueFormat, value, k.valueSuffix);

    return {
      id: k.id,
      label: k.label,
      value: valueStr,
      deltaPct: k.deltaPct,
      status: k.status,
      targetLabel: k.targetLabel,
      targetValue: k.targetValue,
      spark: k.spark,
    };
  });
}

export type PriorityItem = {
  id: string;
  title: string;
  detail: string;
  severity: "critical" | "high" | "medium" | "low";
  owner?: string;
};

export const todaysPriorities: PriorityItem[] = [
  {
    id: "p1",
    title: "3 locations below target sales",
    detail: "Knoxville West, Franklin, and Murfreesboro trending -6% vs target.",
    severity: "high",
    owner: "Sales Ops",
  },
  {
    id: "p2",
    title: "2 stores with labor over budget",
    detail: "Overage driven by overtime on weekend shifts. Review scheduling.",
    severity: "medium",
    owner: "COO",
  },
  {
    id: "p3",
    title: "5 items nearing stockout",
    detail: "Chicken wings (2 locations), fryer oil, paper bags, cola syrup.",
    severity: "high",
    owner: "Supply",
  },
  {
    id: "p4",
    title: "Customer complaints rising in one region",
    detail: "Memphis: late delivery + cold food mentions up 18%.",
    severity: "medium",
    owner: "CX",
  },
  {
    id: "p5",
    title: "4 pending access requests",
    detail: "2 location managers, 1 analyst, 1 finance contractor.",
    severity: "low",
    owner: "IT Admin",
  },
];

export type WorkspaceCard = {
  id: "finance" | "sales" | "orders" | "inventory" | "hr" | "customer";
  title: string;
  description: string;
  href: string;
  status: "healthy" | "watch" | "atRisk";
  kpis: { label: string; value: string; deltaPct: number }[];
  spark: number[];
  note?: string;
};

export const workspaces: WorkspaceCard[] = [
  {
    id: "finance",
    title: "Finance",
    description: "Profitability, cash, variance analysis, and governance.",
    href: "/finance",
    status: "watch",
    kpis: [
      { label: "Cash", value: "$1.12M", deltaPct: -1.4 },
      { label: "Margin", value: "42.6%", deltaPct: 1.2 },
      { label: "Variance", value: "$84K", deltaPct: 3.1 },
    ],
    spark: [10, 11, 12, 11, 12, 12, 13],
    note: "Cash position trending -1.4% — approaching minimum threshold. Review burn rate.",
  },
  {
    id: "sales",
    title: "Sales",
    description: "Sales performance by location, channel, and menu.",
    href: "/sales",
    status: "healthy",
    kpis: [
      { label: "Revenue", value: "$3.84M", deltaPct: 6.8 },
      { label: "Orders", value: "98.2K", deltaPct: 3.2 },
      { label: "AOV", value: "$39.10", deltaPct: 1.1 },
    ],
    spark: [32, 34, 33, 36, 35, 38, 39],
    note: "Revenue up +6.8% YOY. 3 locations underperforming — Knoxville, Franklin, Murfreesboro.",
  },
  {
    id: "orders",
    title: "Orders",
    description: "Vendor performance, logistics, and purchasing workflows.",
    href: "/supply",
    status: "healthy",
    kpis: [
      { label: "On-time", value: "96%", deltaPct: 0.4 },
      { label: "Lead Time", value: "4.2d", deltaPct: -5.1 },
      { label: "Cost/Unit", value: "$4.12", deltaPct: 1.1 },
    ],
    spark: [94, 95, 95, 96, 96, 96, 96],
    note: "Lead times down 5.1% — supplier negotiations paying off. Monitor cost/unit creep.",
  },
  {
    id: "inventory",
    title: "Inventory",
    description: "Stock levels, replenishment, and shrinkage tracking.",
    href: "/inventory",
    status: "watch",
    kpis: [
      { label: "Stock Health", value: "92%", deltaPct: -2.3 },
      { label: "Turnover", value: "12.4x", deltaPct: 4.2 },
      { label: "Shrinkage", value: "0.8%", deltaPct: -1.2 },
    ],
    spark: [95, 94, 93, 93, 92, 92, 92],
    note: "5 items nearing stockout. Chicken wings critical at 2 locations — reorder now.",
  },
  {
    id: "hr",
    title: "HR",
    description: "Labor efficiency, hiring health, and retention signals.",
    href: "/hr",
    status: "healthy",
    kpis: [
      { label: "Labor", value: "29.4%", deltaPct: 1.6 },
      { label: "Open Roles", value: "45", deltaPct: -3.0 },
      { label: "Attrition", value: "3.1%", deltaPct: -0.6 },
    ],
    spark: [28.2, 28.6, 29.0, 28.8, 29.1, 29.3, 29.4],
    note: "Labor cost +1.6% over target. Weekend overtime flagged — review staffing model.",
  },
  {
    id: "customer",
    title: "Customer",
    description: "Experience signals across feedback, loyalty, and service.",
    href: "/customer",
    status: "atRisk",
    kpis: [
      { label: "NPS", value: "61", deltaPct: -4.2 },
      { label: "Complaints", value: "312", deltaPct: 12.4 },
      { label: "Loyalty", value: "38%", deltaPct: 1.8 },
    ],
    spark: [67, 66, 64, 63, 62, 62, 61],
    note: "NPS dropped -4.2 pts. Memphis complaints +18% — cold food & late delivery. Escalate.",
  },
];

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

// Org-level
const orgPerfRows: PerfRow[] = [
  { id: "org_craven", name: "Craven Group", level: "org", revenue: 1_640_000, cogsPct: 28.4, laborPct: 28.8, guestScore: 64, avgTicket: 18.2, alerts: 5 },
  { id: "org_nash", name: "Nashville Chicken House", level: "org", revenue: 460_000, cogsPct: 29.8, laborPct: 30.4, guestScore: 58, avgTicket: 15.9, alerts: 4 },
];

// Brand-level rows (includes all orgs)
const brandPerfRows: PerfRow[] = [
  // Craven Group brands
  { id: "brand_craven_wings", name: "Craven Wings", level: "brand", revenue: 980_000, cogsPct: 27.9, laborPct: 28.5, guestScore: 65, avgTicket: 19.4, alerts: 3 },
  { id: "brand_wings_express", name: "Wings Express", level: "brand", revenue: 420_000, cogsPct: 29.1, laborPct: 29.8, guestScore: 61, avgTicket: 17.1, alerts: 2 },
  { id: "brand_southern_bites", name: "Southern Bites", level: "brand", revenue: 240_000, cogsPct: 28.6, laborPct: 28.1, guestScore: 66, avgTicket: 16.8, alerts: 1 },
  // Nashville Chicken House brand
  { id: "brand_nch", name: "Nashville Chicken House", level: "brand", revenue: 460_000, cogsPct: 29.8, laborPct: 30.4, guestScore: 58, avgTicket: 15.9, alerts: 4 },
];

// Location-level
const locationPerfRows: PerfRow[] = [
  // Craven Wings
  { id: "loc_knox", name: "Knoxville West", level: "location", revenue: 324_000, cogsPct: 30.1, laborPct: 31.2, guestScore: 59, avgTicket: 18.6, alerts: 2 },
  { id: "loc_frank", name: "Franklin", level: "location", revenue: 298_000, cogsPct: 27.3, laborPct: 27.9, guestScore: 67, avgTicket: 20.1, alerts: 1 },
  { id: "loc_murf", name: "Murfreesboro", level: "location", revenue: 358_000, cogsPct: 26.2, laborPct: 27.1, guestScore: 68, avgTicket: 21.0, alerts: 1 },
  { id: "loc_atl_mid", name: "Atlanta Midtown", level: "location", revenue: 210_000, cogsPct: 29.4, laborPct: 30.1, guestScore: 62, avgTicket: 17.8, alerts: 1 },
  { id: "loc_atl_buck", name: "Atlanta Buckhead", level: "location", revenue: 196_000, cogsPct: 28.9, laborPct: 29.6, guestScore: 60, avgTicket: 16.9, alerts: 1 },
  // Wings Express
  { id: "loc_austin", name: "Austin Central", level: "location", revenue: 224_000, cogsPct: 28.7, laborPct: 29.5, guestScore: 63, avgTicket: 17.2, alerts: 1 },
  { id: "loc_dallas", name: "Dallas North", level: "location", revenue: 196_000, cogsPct: 29.8, laborPct: 30.2, guestScore: 59, avgTicket: 16.8, alerts: 1 },
  // Southern Bites
  { id: "loc_bham", name: "Birmingham", level: "location", revenue: 128_000, cogsPct: 28.2, laborPct: 27.8, guestScore: 67, avgTicket: 16.6, alerts: 1 },
  { id: "loc_hunts", name: "Huntsville", level: "location", revenue: 112_000, cogsPct: 29.1, laborPct: 28.5, guestScore: 65, avgTicket: 17.0, alerts: 0 },
  // Nashville Chicken House
  { id: "loc_nash_1", name: "Nashville Downtown", level: "location", revenue: 258_000, cogsPct: 30.4, laborPct: 31.0, guestScore: 57, avgTicket: 15.4, alerts: 2 },
  { id: "loc_nash_2", name: "Nashville East", level: "location", revenue: 202_000, cogsPct: 29.1, laborPct: 29.7, guestScore: 60, avgTicket: 16.5, alerts: 2 },
];

// Maps to know which brand/location belongs to which org/brand
const brandToOrg: Record<string, string> = {
  "Craven Wings": "Craven Group",
  "Wings Express": "Craven Group",
  "Southern Bites": "Craven Group",
  "Nashville Chicken House": "Nashville Chicken House",
};
const locationToBrand: Record<string, string> = {
  "Knoxville West": "Craven Wings",
  "Franklin": "Craven Wings",
  "Murfreesboro": "Craven Wings",
  "Atlanta Midtown": "Craven Wings",
  "Atlanta Buckhead": "Craven Wings",
  "Austin Central": "Wings Express",
  "Dallas North": "Wings Express",
  "Birmingham": "Southern Bites",
  "Huntsville": "Southern Bites",
  "Nashville Downtown": "Nashville Chicken House",
  "Nashville East": "Nashville Chicken House",
};

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

/** @deprecated Use PerfRow + getPerformanceRows instead */
export type OrgPerformanceRow = {
  id: string;
  name: string;
  revenue: number;
  marginPct: number;
  laborPct: number;
  guestScore: number;
  stockHealthPct: number;
  alerts: number;
};
/** @deprecated */
export const orgPerformance: OrgPerformanceRow[] = [
  { id: "org_craven", name: "Craven Group", revenue: 1640000, marginPct: 43.1, laborPct: 28.8, guestScore: 64, stockHealthPct: 93, alerts: 5 },
  { id: "org_wings", name: "Wings Express", revenue: 980000, marginPct: 41.9, laborPct: 29.6, guestScore: 61, stockHealthPct: 91, alerts: 3 },
  { id: "org_southern", name: "Southern Bites", revenue: 760000, marginPct: 44.0, laborPct: 28.1, guestScore: 66, stockHealthPct: 94, alerts: 2 },
  { id: "org_nash", name: "Nashville Chicken House", revenue: 460000, marginPct: 40.7, laborPct: 30.4, guestScore: 58, stockHealthPct: 89, alerts: 4 },
];

export type AccessGovernanceSnapshot = {
  activeUsers: number;
  pendingRequests: number;
  orgAdmins: number;
  locationManagers: number;
  crossBrandAccess: number;
  financeAccess: number;
  hrAccess: number;
  riskyCombos: number;
  needReview: number;
  inactiveUsers: number;
};

export const governanceSnapshot: AccessGovernanceSnapshot = {
  activeUsers: 286,
  pendingRequests: 9,
  orgAdmins: 15,
  locationManagers: 42,
  crossBrandAccess: 12,
  financeAccess: 38,
  hrAccess: 21,
  riskyCombos: 3,
  needReview: 2,
  inactiveUsers: 7,
};

export type AccessRequest = {
  id: string;
  name: string;
  requestedRole: Role;
  requestedModules: ("Finance" | "Sales" | "HR" | "Supply" | "Customer")[];
  scope: string;
  status: "pending" | "approved" | "rejected";
};

export const accessRequests: AccessRequest[] = [
  {
    id: "r1",
    name: "A. Patel",
    requestedRole: "LocationManager",
    requestedModules: ["Sales", "Supply"],
    scope: "Craven Group → Craven Wings → Knoxville West",
    status: "pending",
  },
  {
    id: "r2",
    name: "S. Johnson",
    requestedRole: "Analyst",
    requestedModules: ["Sales", "Customer"],
    scope: "Wings Express → All Locations",
    status: "pending",
  },
  {
    id: "r3",
    name: "M. Chen",
    requestedRole: "OrgAdmin",
    requestedModules: ["Finance", "HR"],
    scope: "Southern Bites → Org-wide",
    status: "pending",
  },
];

