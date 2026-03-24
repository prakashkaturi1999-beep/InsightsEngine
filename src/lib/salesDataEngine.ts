/**
 * salesDataEngine.ts
 *
 * Provides filter-reactive (computed) sales data for all Sales domain pages.
 * When the user changes org / brand / location / date range, all numbers
 * visibly change — the underlying shape is consistent but scaled by scope factors.
 */

import type { SalesFilter } from "./salesFilterContext";

// ── Scope multipliers ──────────────────────────────────────────────────────────
const orgFactors: Record<string, number> = {
  "Craven Group": 1.0,
  "Nashville Chicken House": 0.57,
};

const brandFactors: Record<string, number> = {
  "All Brands": 1.0,
  "Craven Wings": 0.60,
  "Wings Express": 0.26,
  "Southern Bites": 0.15,
  "Nashville Chicken House": 0.57,
};

const locationFactors: Record<string, number> = {
  "All Locations": 1.0,
  "Knoxville West": 0.20,
  "Franklin": 0.18,
  "Murfreesboro": 0.22,
  "Atlanta Midtown": 0.13,
  "Atlanta Buckhead": 0.12,
  "Austin Central": 0.14,
  "Dallas North": 0.12,
  "Birmingham": 0.08,
  "Huntsville": 0.07,
  "Nashville Downtown": 0.16,
  "Nashville East": 0.12,
  "Main St Location": 0.44,
  "Park Ave Grill": 0.33,
  "Riverside Café": 0.22,
};

const dateMultipliers: Record<string, number> = {
  "7d": 1.0,
  "14d": 1.94,
  mtd: 4.2,
  qtd: 13.0,
  ytd: 52.0,
};

const dayLabels: Record<string, string[]> = {
  "7d": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "14d": ["W1 Mon", "W1 Wed", "W1 Fri", "W1 Sun", "W2 Mon", "W2 Wed", "W2 Fri", "W2 Sun"],
  mtd: ["Wk 1", "Wk 2", "Wk 3", "Wk 4"],
  qtd: ["Jan", "Feb", "Mar"],
  ytd: ["Q1", "Q2", "Q3", "Q4"],
};

function scopeMult(filters: SalesFilter): number {
  const orgF = orgFactors[filters.org] ?? 1.0;
  const brandF = brandFactors[filters.brand] ?? 1.0;
  const locF = locationFactors[filters.location] ?? 1.0;
  const dateF = dateMultipliers[filters.dateRange] ?? 1.0;

  // If a specific brand is selected within an org, use brand factor (not org × brand)
  if (filters.location !== "All Locations") return locF * dateF;
  if (filters.brand !== "All Brands") return brandF * dateF;
  return orgF * dateF;
}

function sc(base: number, filters: SalesFilter, decimals = 0): number {
  const v = base * scopeMult(filters);
  return decimals > 0 ? Math.round(v * 10 ** decimals) / 10 ** decimals : Math.round(v);
}

/** Round a number to 2 decimal places */
function rnd2(n: number) { return Math.round(n * 100) / 100; }

// ── 1. Daily Snapshot KPIs ────────────────────────────────────────────────────
export function getDailySnapshot(filters: SalesFilter) {
  const m = scopeMult(filters);
  return {
    netSales: { value: Math.round(2_450 * m), vsDailyGoal: Math.round(82 * (m >= 0.5 ? 1 : 0.7)), vsYesterday: Math.round(12 * (m >= 0.5 ? 1.1 : 0.85)) },
    orders: { value: Math.round(175 * m), vsLastWeek: Math.round(8 * (m >= 0.5 ? 1.1 : 0.9)) },
    aov: { value: rnd2(14.0 + (m - 1) * 2), vsLastWeek: rnd2(-3 + (m - 1) * 0.5) },
    revenueLeakage: {
      total: Math.round(210 * m),
      discounts: Math.round(100 * m),
      refunds: Math.round(85 * m),
      voids: Math.round(25 * m),
    },
  };
}

// ── 2. Overview KPIs ─────────────────────────────────────────────────────────
export function getOverviewKpis(filters: SalesFilter) {
  const m = scopeMult(filters);
  return {
    totalSales: { value: Math.round(53_250 * m), delta: 12 },
    todaysOrders: { value: Math.round(720 * m), delta: 10 },
    topStore: { value: Math.round(12_200 * m), label: filters.brand !== "All Brands" ? filters.brand : "Downtown" },
    avgOrderValue: { value: rnd2(11.63 + (m - 1) * 1.2), delta: 1.9 },
  };
}

// ── 3. Sales Trend (period line chart) ───────────────────────────────────────
export function getSalesTrend(filters: SalesFilter) {
  const m = scopeMult(filters);
  const labels = dayLabels[filters.dateRange] ?? dayLabels["7d"];
  const baseRevs = [7_200, 7_550, 7_680, 8_010, 8_920, 9_450, 9_440];
  const baseOrders = [510, 538, 548, 572, 637, 675, 674];

  // Scale & pad/trim to match the number of labels
  return labels.map((day, i) => {
    const idx = Math.round((i / (labels.length - 1)) * (baseRevs.length - 1));
    return {
      day,
      revenue: Math.round(baseRevs[idx] * m),
      orders: Math.round(baseOrders[idx] * m),
    };
  });
}

// ── 4. Home Donut data (unchanged ratios, but totals change) ─────────────────
// Donuts are always %, so they don't scale — they just reflect category mix.
// But we add slight variation by location to make it feel reactive.
export function getHomeDonutData(filters: SalesFilter) {
  const isNash = filters.org === "Nashville Chicken House";
  const isBrand = filters.brand !== "All Brands";

  const food = isNash
    ? [{ name: "Chicken", value: 68 }, { name: "Sides", value: 22 }, { name: "Other", value: 10 }]
    : isBrand && filters.brand === "Craven Wings"
    ? [{ name: "Wings", value: 60 }, { name: "Burgers", value: 25 }, { name: "Other", value: 15 }]
    : [{ name: "Burgers", value: 52 }, { name: "Pasta", value: 28 }, { name: "Other", value: 20 }];

  const channel = isNash
    ? [{ name: "Dine-In", value: 42 }, { name: "Uber Eats", value: 35 }, { name: "Takeout", value: 23 }]
    : [{ name: "Dine-In", value: 51 }, { name: "Uber Eats", value: 24 }, { name: "Takeout", value: 25 }];

  const drinks = [{ name: "Soft Drinks", value: 46 }, { name: "Beer", value: 32 }, { name: "Other", value: 22 }];

  return { food, channel, drinks };
}

// ── 5. Home Sales Trend (mini monthly chart) ─────────────────────────────────
export function getHomeSalesTrend(filters: SalesFilter) {
  const m = scopeMult(filters);
  const baseRevs = [2100, 2350, 2200, 2600, 2850, 1900, 2700, 2450];
  const days = ["Dec 1", "Dec 5", "Dec 10", "Dec 15", "Dec 20", "Dec 25", "Dec 28", "Dec 31"];
  return days.map((day, i) => ({ day, revenue: Math.round(baseRevs[i] * m) }));
}

// ── 6. Home Store Sales ───────────────────────────────────────────────────────
export function getHomeStoreSales(filters: SalesFilter) {
  const m = scopeMult(filters);
  if (filters.org === "Nashville Chicken House") {
    return [
      { name: "Nashville Downtown", sales: Math.round(1_080 * 0.57 * m / m * m) },
      { name: "Nashville East", sales: Math.round(820 * 0.47 * m / m * m) },
    ];
  }
  return [
    { name: "Main St Location", sales: Math.round(1_080 * m) },
    { name: "Park Ave Grill", sales: Math.round(820 * m) },
    { name: "Riverside Café", sales: Math.round(550 * m) },
  ];
}

// ── 7. Top Stores (overview) ─────────────────────────────────────────────────
export function getTopStores(filters: SalesFilter) {
  const m = scopeMult(filters);
  const base = [
    { id: "1", name: "Downtown", revenue: 12_200, orders: 870, aov: 14.02, delta: 7.2 },
    { id: "2", name: "Westside", revenue: 10_850, orders: 774, aov: 14.02, delta: 5.4 },
    { id: "3", name: "Hilltop", revenue: 9_450, orders: 674, aov: 14.02, delta: -1.8 },
    { id: "4", name: "Northside", revenue: 8_600, orders: 614, aov: 14.02, delta: 3.1 },
    { id: "5", name: "Airport", revenue: 7_150, orders: 510, aov: 14.02, delta: 2.0 },
  ];
  if (filters.org === "Nashville Chicken House") {
    return [
      { id: "1", name: "Nashville Downtown", revenue: Math.round(7_100 * (scopeMult({ ...filters, org: "Nashville Chicken House" }) / 0.57)), orders: 460, aov: 15.40, delta: 3.1 },
      { id: "2", name: "Nashville East", revenue: Math.round(5_600 * (scopeMult({ ...filters, org: "Nashville Chicken House" }) / 0.57)), orders: 362, aov: 15.47, delta: 2.4 },
    ];
  }
  return base.map((s) => ({ ...s, revenue: Math.round(s.revenue * m), orders: Math.round(s.orders * m) }));
}

// ── 8. Channel Summary ────────────────────────────────────────────────────────
export function getChannelSummary(filters: SalesFilter) {
  const m = scopeMult(filters);
  return [
    { channel: "Dine-In", revenue: Math.round(34_950 * m), pct: 66, orders: Math.round(2_490 * m), aov: 14.04, delta: 5.2 },
    { channel: "Takeaway", revenue: Math.round(10_750 * m), pct: 20, orders: Math.round(920 * m), aov: 11.68, delta: 8.6 },
    { channel: "Uber Eats", revenue: Math.round(3_200 * m), pct: 6, orders: Math.round(245 * m), aov: 13.06, delta: 8.2 },
    { channel: "DoorDash", revenue: Math.round(3_400 * m), pct: 6.4, orders: Math.round(262 * m), aov: 12.98, delta: 11.4 },
    { channel: "GrubHub", revenue: Math.round(850 * m), pct: 1.6, orders: Math.round(65 * m), aov: 13.08, delta: -2.1 },
  ];
}

// ── 9. Channel Daily Trend ───────────────────────────────────────────────────
export function getChannelDailyTrend(filters: SalesFilter) {
  const m = scopeMult(filters);
  const labels = dayLabels[filters.dateRange] ?? dayLabels["7d"];
  const base = [
    { dineIn: 4300, takeaway: 1250, uberEats: 380, doorDash: 420, grubhub: 100 },
    { dineIn: 4450, takeaway: 1300, uberEats: 400, doorDash: 440, grubhub: 105 },
    { dineIn: 4525, takeaway: 1320, uberEats: 420, doorDash: 430, grubhub: 98 },
    { dineIn: 4680, takeaway: 1380, uberEats: 460, doorDash: 480, grubhub: 110 },
    { dineIn: 5230, takeaway: 1540, uberEats: 520, doorDash: 540, grubhub: 120 },
    { dineIn: 5600, takeaway: 1650, uberEats: 560, doorDash: 580, grubhub: 130 },
    { dineIn: 5665, takeaway: 1600, uberEats: 540, doorDash: 560, grubhub: 125 },
  ];
  return labels.map((day, i) => {
    const idx = Math.round((i / Math.max(1, labels.length - 1)) * (base.length - 1));
    const row = base[idx];
    return {
      day,
      dineIn: Math.round(row.dineIn * m),
      takeaway: Math.round(row.takeaway * m),
      uberEats: Math.round(row.uberEats * m),
      doorDash: Math.round(row.doorDash * m),
      grubhub: Math.round(row.grubhub * m),
    };
  });
}

// ── 10. Overview Daily Trend (multi-line) ────────────────────────────────────
export function getOverviewDailyTrend(filters: SalesFilter) {
  const m = scopeMult(filters);
  const labels = dayLabels[filters.dateRange] ?? dayLabels["7d"];
  const base = [
    { dineIn: 4300, delivery: 1450, pickup: 1450, downtown: 1750 },
    { dineIn: 4450, delivery: 1500, pickup: 1600, downtown: 1800 },
    { dineIn: 4525, delivery: 1525, pickup: 1630, downtown: 1780 },
    { dineIn: 4680, delivery: 1580, pickup: 1750, downtown: 1900 },
    { dineIn: 5230, delivery: 1820, pickup: 1870, downtown: 2100 },
    { dineIn: 5600, delivery: 1950, pickup: 1900, downtown: 2200 },
    { dineIn: 5665, delivery: 1925, pickup: 1850, downtown: 2150 },
  ];
  return labels.map((day, i) => {
    const idx = Math.round((i / Math.max(1, labels.length - 1)) * (base.length - 1));
    const row = base[idx];
    return {
      day,
      dineIn: Math.round(row.dineIn * m),
      delivery: Math.round(row.delivery * m),
      pickup: Math.round(row.pickup * m),
      downtown: Math.round(row.downtown * m),
    };
  });
}

// ── 11. Top Products ─────────────────────────────────────────────────────────
export function getTopProducts(filters: SalesFilter) {
  const m = scopeMult(filters);
  const base = [
    { id: "1", item: "Burgers", units: 1490, sales: 15_800, trendPct: 8.2 },
    { id: "2", item: "Wings", units: 1280, sales: 12_600, trendPct: 6.4 },
    { id: "3", item: "Tacos", units: 920, sales: 8_050, trendPct: 14.1 },
    { id: "4", item: "Fries", units: 1650, sales: 4_950, trendPct: 2.3 },
    { id: "5", item: "Salads", units: 480, sales: 5_760, trendPct: -1.1 },
    { id: "6", item: "Steaks", units: 310, sales: 6_200, trendPct: 3.8 },
  ];
  // NCH shows chicken-centric menu
  if (filters.org === "Nashville Chicken House") {
    return [
      { id: "1", item: "Nashville Hot Chicken", units: Math.round(890 * m / 0.57), sales: Math.round(14_200 * m / 0.57), trendPct: 12.4 },
      { id: "2", item: "Crispy Tenders", units: Math.round(720 * m / 0.57), sales: Math.round(10_800 * m / 0.57), trendPct: 8.1 },
      { id: "3", item: "Chicken Sandwich", units: Math.round(560 * m / 0.57), sales: Math.round(7_800 * m / 0.57), trendPct: 6.2 },
      { id: "4", item: "Mac & Cheese", units: Math.round(480 * m / 0.57), sales: Math.round(4_320 * m / 0.57), trendPct: 3.8 },
      { id: "5", item: "Coleslaw", units: Math.round(920 * m / 0.57), sales: Math.round(2_760 * m / 0.57), trendPct: 2.1 },
    ];
  }
  return base.map((p) => ({ ...p, units: Math.round(p.units * m), sales: Math.round(p.sales * m) }));
}

// ── 12. Sales Alerts (org-aware) ─────────────────────────────────────────────
export function getSalesAlerts(filters: SalesFilter) {
  if (filters.org === "Nashville Chicken House") {
    return [
      { id: "a1", severity: "high" as const, title: "Nashville Downtown -5% vs target", detail: "Declining guest score driving drop in repeat visits." },
      { id: "a2", severity: "high" as const, title: "DoorDash commission costs at 32%", detail: "Highest commission rate in portfolio. Renegotiate contract." },
      { id: "a3", severity: "medium" as const, title: "Chicken sandwich declining -6%", detail: "Competitor promotion impact. Review pricing strategy." },
    ];
  }
  if (filters.brand !== "All Brands") {
    return [
      { id: "a1", severity: "medium" as const, title: `${filters.brand} AOV slight dip`, detail: "Avg order value declined 3% — check menu mix." },
      { id: "a2", severity: "low" as const, title: "Upsell rate improving at 2 locations", detail: "Suggest highlighting upselling training at remaining sites." },
    ];
  }
  return [
    { id: "a1", severity: "critical" as const, title: "Hilltop revenue -6% vs target", detail: "3rd consecutive week below target. Investigate staffing & menu." },
    { id: "a2", severity: "high" as const, title: "DoorDash commission costs up 12%", detail: "Third-party delivery fees eroding net margin." },
    { id: "a3", severity: "medium" as const, title: "Mozzarella Sticks declining -4%", detail: "Consistent unit decline. Consider promotion or menu removal." },
    { id: "a4", severity: "medium" as const, title: "Low-Carb Beer demand +11%", detail: "Trending up fast. Ensure adequate stock." },
    { id: "a5", severity: "low" as const, title: "Upsell rate below 20% at 2 locations", detail: "Airport & Hilltop below target. Training opportunity." },
  ];
}

// ── 13. Food KPIs ─────────────────────────────────────────────────────────────
export function getFoodKpis(filters: SalesFilter) {
  const m = scopeMult(filters);
  return {
    topByQuantity: { item: filters.org === "Nashville Chicken House" ? "Hot Chicken" : "Burgers", units: Math.round(1490 * m) },
    topBySales: { item: filters.org === "Nashville Chicken House" ? "Hot Chicken" : "Wings", sales: Math.round(12_600 * m) },
    totalSales: Math.round(53_250 * m),
    todaysOrders: Math.round(720 * m),
  };
}

// ── 14. Alcohol KPIs ─────────────────────────────────────────────────────────
export function getAlcoholKpis(filters: SalesFilter) {
  const m = scopeMult(filters);
  return {
    totalSales: Math.round(13_700 * m),
    totalUnits: Math.round(1_050 * m),
    topBySales: { item: "Whiskey", sales: Math.round(8_000 * m) },
    declining: { item: "Vodka", units: Math.round(310 * m), delta: -7 },
  };
}

// ── 15. Channel Overview KPIs ─────────────────────────────────────────────────
export function getChannelOverviewKpis(filters: SalesFilter) {
  const m = scopeMult(filters);
  return {
    totalSales: Math.round(53_250 * m),
    dineIn: Math.round(34_950 * m),
    takeaway: Math.round(10_750 * m),
    delivery: Math.round(7_550 * m),
  };
}

// ── 16. Dine-In KPIs & trend ─────────────────────────────────────────────────
export function getDineInData(filters: SalesFilter) {
  const m = scopeMult(filters);
  const labels = dayLabels[filters.dateRange] ?? dayLabels["7d"];
  const baseRevs = [4300, 4450, 4525, 4680, 5230, 5600, 5665];
  return {
    kpis: { sales: Math.round(35_050 * m), avgOrder: rnd2(14.02) },
    trend: labels.map((day, i) => {
      const idx = Math.round((i / Math.max(1, labels.length - 1)) * (baseRevs.length - 1));
      return { day, sales: Math.round(baseRevs[idx] * m) };
    }),
  };
}

// ── 17. Delivery KPIs & trend ────────────────────────────────────────────────
export function getDeliveryData(filters: SalesFilter) {
  const m = scopeMult(filters);
  const labels = dayLabels[filters.dateRange] ?? dayLabels["7d"];
  const base = [
    { uber: 380, doordash: 420, total: 800 },
    { uber: 400, doordash: 440, total: 840 },
    { uber: 420, doordash: 430, total: 850 },
    { uber: 460, doordash: 480, total: 940 },
    { uber: 520, doordash: 540, total: 1060 },
    { uber: 560, doordash: 580, total: 1140 },
    { uber: 540, doordash: 560, total: 1100 },
  ];
  return {
    kpis: {
      totalSales: Math.round(7_450 * m),
      uberEats: Math.round(3_200 * m),
      doorDash: Math.round(3_400 * m),
      grubHub: Math.round(850 * m),
    },
    trend: labels.map((day, i) => {
      const idx = Math.round((i / Math.max(1, labels.length - 1)) * (base.length - 1));
      return {
        day,
        uber: Math.round(base[idx].uber * m),
        doordash: Math.round(base[idx].doordash * m),
        total: Math.round(base[idx].total * m),
      };
    }),
  };
}
