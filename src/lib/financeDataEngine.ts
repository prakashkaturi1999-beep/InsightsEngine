/**
 * financeDataEngine.ts
 *
 * Enterprise-grade finance data engine for a $1.2B multi-brand restaurant group.
 * All numbers scale dynamically when the user changes org/brand/location/date filters.
 */

import type { FinanceFilter } from "./financeFilterContext";
import {
  financeBaseMetrics, financeTrend, storePnL,
  channelMix, daypartMix, cogsBreakdown,
  cashFlowMetrics, capexPipeline, cashFlowActivity,
  laborDetail, controllableOpex, nonControllableOpex, gaExpenses,
  tenderMix, taxLiabilities, processingFees,
  forecastScenarios, rolling13WeekForecast, newUnitPipeline, sensitivityMatrix,
  leakageDetail, topExceptions,
  budgetVsActual
} from "./financeMockData";

// ── Scope multipliers ──────────────────────────────────────────────────────
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

function scopeMult(filters: FinanceFilter): number {
  const orgF = orgFactors[filters.org] ?? 1.0;
  const brandF = brandFactors[filters.brand] ?? 1.0;
  const locF = locationFactors[filters.location] ?? 1.0;
  const dateF = dateMultipliers[filters.dateRange] ?? 1.0;

  if (filters.location !== "All Locations") return locF * dateF;
  if (filters.brand !== "All Brands") return brandF * dateF;
  return orgF * dateF;
}

function sc(base: number | null, filters: FinanceFilter, decimals = 0): number | null {
  if (base === null) return null;
  const v = base * scopeMult(filters);
  return decimals > 0 ? Math.round(v * 10 ** decimals) / 10 ** decimals : Math.round(v);
}

function rnd2(n: number) { return Math.round(n * 100) / 100; }

// ── 1. Enterprise KPIs ───────────────────────────────────────────────────────
export function getFinanceKpis(filters: FinanceFilter) {
  const m = scopeMult(filters);
  const b = financeBaseMetrics;
  return {
    netRevenue: sc(b.netRevenue, filters) as number,
    sssg: rnd2(b.sssg + (m > 1 ? 0.3 : m < 1 ? -0.5 : 0)),
    transactionCount: sc(b.transactionCount, filters) as number,
    averageCheck: rnd2(b.averageCheck + (m - 1) * 0.12),
    unitCount: Math.round(b.unitCount * Math.min(m, 1.0)),
    compUnitCount: Math.round(b.compUnitCount * Math.min(m, 1.0)),
    auvWeekly: Math.round(b.auvWeekly * (1 + (b.sssg / 100))),

    cogs: sc(b.cogs, filters) as number,
    foodCost: sc(b.foodCost, filters) as number,
    bevCost: sc(b.bevCost, filters) as number,
    totalLabor: sc(b.totalLabor, filters) as number,

    primeCostPct: rnd2(b.primeCostPct + (m - 1) * 0.2),
    restaurantEbitda: sc(b.restaurantEbitda, filters) as number,
    restaurantEbitdaMargin: rnd2(b.restaurantEbitdaMargin - (m - 1) * 0.3),
    corporateEbitda: sc(b.corporateEbitda, filters) as number,
    corporateEbitdaMargin: rnd2(b.corporateEbitdaMargin - (m - 1) * 0.3),
    netIncome: sc(b.netIncome, filters) as number,
    netIncomeMargin: rnd2(b.netIncomeMargin - (m - 1) * 0.2),

    gaExpenses: sc(b.gaExpenses, filters) as number,
    occupancy: sc(b.occupancy, filters) as number,
    otherControllable: sc(b.otherControllable, filters) as number,
    nonControllable: sc(b.nonControllable, filters) as number,

    digitalMixPct: rnd2(b.digitalMixPct),
    revpash: rnd2(b.revpash + (m - 1) * 0.8),
    rplh: rnd2(b.rplh + (m - 1) * 0.6),
    overtimePct: rnd2(b.overtimePct),
    turnoverRateAnnual: b.turnoverRateAnnual,
    laborPct: rnd2((b.totalLabor / b.netRevenue) * 100),
    foodCostPct: rnd2((b.cogs / b.netRevenue) * 100),
  };
}

// ── 2. Period Trend ──────────────────────────────────────────────────────────
export function getFinanceTrend(filters: FinanceFilter) {
  const labels = dayLabels[filters.dateRange] ?? dayLabels["7d"];
  return labels.map((day, i) => {
    const idx = Math.round((i / Math.max(1, labels.length - 1)) * (financeTrend.length - 1));
    const row = financeTrend[idx];
    return {
      day,
      revenue: sc(row.revenue, filters) as number,
      ebitda: sc(row.ebitda, filters) as number,
      transactions: sc(row.transactions, filters) as number,
      avgCheck: rnd2(row.avgCheck),
      foodCostPct: row.foodCostPct,
      laborPct: row.laborPct,
    };
  });
}

// ── 3. Store Unit Economics ──────────────────────────────────────────────────
export function getStorePnL(filters: FinanceFilter) {
  let stores = storePnL;
  if (filters.org === "Nashville Chicken House") {
    stores = storePnL.filter(s => s.name.includes("Nashville") || s.name.includes("Franklin"));
  }
  return stores.map(s => ({
    ...s,
    revenue: sc(s.revenue, filters) as number,
    cogs: sc(s.cogs, filters) as number,
    labor: sc(s.labor, filters) as number,
    occupancy: sc(s.occupancy, filters) as number,
    otherOpex: sc(s.otherOpex, filters) as number,
    ebitda4Wall: sc(s.ebitda4Wall, filters) as number,
    txnCount: sc(s.txnCount, filters) as number,
    auvWeekly: s.auvWeekly,
    margin4Wall: s.margin4Wall,
    primeCost: s.primeCost,
    rplh: s.rplh,
    compStore: s.compStore,
    vintage: s.vintage,
    sqft: s.sqft,
    seats: s.seats,
  }));
}

// ── 4. Channel & Daypart Mix ─────────────────────────────────────────────────
export function getChannelMix(filters: FinanceFilter) {
  return channelMix.map(c => ({ ...c, value: sc(c.value, filters) as number }));
}

export function getDaypartMix(filters: FinanceFilter) {
  return daypartMix.map(d => ({
    ...d,
    value: sc(d.value, filters) as number,
    txnCount: sc(d.txnCount, filters) as number
  }));
}

// ── 5. COGS Breakdown ────────────────────────────────────────────────────────
export function getCogsBreakdown(filters: FinanceFilter) {
  return cogsBreakdown.map(c => ({ ...c, value: sc(c.value, filters) as number }));
}

export function getTheoreticalVsActual(filters: FinanceFilter) {
  const b = financeBaseMetrics;
  return {
    theoretical: sc(b.theoreticalFoodCost, filters) as number,
    actual: sc(b.foodCost, filters) as number,
    variance: sc(b.foodCostVariance, filters) as number,
    theoreticalPct: 22.0,
    actualPct: 23.0,
  };
}

// ── 6. Cash Flow & Treasury ──────────────────────────────────────────────────
export function getCashFlowMetrics(filters: FinanceFilter) {
  const cf = cashFlowMetrics;
  return {
    operatingCashFlow: sc(cf.operatingCashFlow, filters) as number,
    capex: sc(cf.capex, filters) as number,
    debtService: sc(cf.debtService, filters) as number,
    freeCashFlow: sc(cf.freeCashFlow, filters) as number,
    cashConversionCycleDays: cf.cashConversionCycleDays,
    workingCapitalDays: cf.workingCapitalDays,
    dscr: cf.debtServiceCoverageRatio,
    currentCashBalance: sc(cf.currentCashBalance, filters) as number,
    operatingReserve: sc(cf.operatingReserve, filters) as number,
  };
}

export function getCapexPipeline(filters: FinanceFilter) {
  return capexPipeline.map(c => ({ ...c, value: sc(c.value, filters) as number }));
}

export function getCashFlowActivity(filters: FinanceFilter) {
  return cashFlowActivity.map(a => ({
    ...a,
    inflow: sc(a.inflow, filters),
    outflow: sc(a.outflow, filters),
    net: sc(a.net, filters) as number,
    balance: sc(a.balance, filters) as number,
  }));
}

// ── 7. Labor & Expenses ──────────────────────────────────────────────────────
export function getLaborDetail(filters: FinanceFilter) {
  return laborDetail.map(l => ({ ...l, value: sc(l.value, filters) as number }));
}

export function getControllableOpex(filters: FinanceFilter) {
  return controllableOpex.map(c => ({ ...c, value: sc(c.value, filters) as number }));
}

export function getNonControllableOpex(filters: FinanceFilter) {
  return nonControllableOpex.map(c => ({ ...c, value: sc(c.value, filters) as number }));
}

export function getGaExpenses(filters: FinanceFilter) {
  return gaExpenses.map(g => ({ ...g, value: sc(g.value, filters) as number }));
}

// ── 8. Payments & Tax ────────────────────────────────────────────────────────
export function getTenderMix(filters: FinanceFilter) {
  return tenderMix.map(t => ({ ...t, value: sc(t.value, filters) as number }));
}

export function getTaxLiabilities(filters: FinanceFilter) {
  return taxLiabilities.map(t => ({ ...t, value: sc(t.value, filters) as number }));
}

export function getProcessingFees(filters: FinanceFilter) {
  return {
    totalFees: sc(processingFees.totalFees, filters) as number,
    effectiveRate: processingFees.effectiveRate,
    costPerTransaction: processingFees.costPerTransaction,
    deliveryCommissions: sc(processingFees.deliveryCommissions, filters) as number,
  };
}

// ── 9. Forecasting ───────────────────────────────────────────────────────────
export function getForecasts(filters: FinanceFilter) {
  return forecastScenarios; // Forecasts are annual projections, not scaled by period
}

export function getRolling13WeekForecast(filters: FinanceFilter) {
  const m = scopeMult(filters);
  const dateMult = dateMultipliers[filters.dateRange] ?? 1.0;
  const baseMult = m / dateMult; // Remove date scaling for weekly forecast
  return rolling13WeekForecast.map(w => ({
    ...w,
    revenue: Math.round(w.revenue * baseMult),
    ebitda: Math.round(w.ebitda * baseMult),
  }));
}

export function getNewUnitPipeline() {
  return newUnitPipeline;
}

export function getSensitivityMatrix() {
  return sensitivityMatrix;
}

// ── 10. Financial Leakage ────────────────────────────────────────────────────
export function getLeakage(filters: FinanceFilter) {
  return leakageDetail.map(l => ({ ...l, value: sc(l.value, filters) as number }));
}

export function getTopExceptions() {
  return topExceptions;
}

// ── 11. Budget vs Actual ─────────────────────────────────────────────────────
export function getBudgetVsActual(filters: FinanceFilter) {
  return budgetVsActual.map(b => ({
    item: b.item,
    budget: sc(b.budget, filters) as number,
    actual: sc(b.actual, filters) as number,
    rollingForecast: sc(b.rollingForecast, filters) as number,
  }));
}

// ── 12. AI-Powered Finance Alerts ────────────────────────────────────────────
export function getFinanceAlerts(filters: FinanceFilter) {
  if (filters.org === "Nashville Chicken House") {
    return [
      { id: "f1", severity: "high" as const, title: "Prime Cost Breach: Nashville East", detail: "Prime cost hit 63.2% — 5.2pp above the 58% group target. Labor scheduling review required." },
      { id: "f2", severity: "medium" as const, title: "Sysco Invoice Anomaly", detail: "Protein costs tracking 6.2% above 90-day PO average. Contract renegotiation recommended." },
      { id: "f3", severity: "info" as const, title: "Comp Store Outperformance", detail: "Nashville Flagship AUV running 38.5% above group average — candidate for best practice rollout." },
    ];
  }
  if (filters.location !== "All Locations") {
    return [
      { id: "f1", severity: "critical" as const, title: "Cash Reserve Below Threshold: " + filters.location, detail: "Current cash balance is below 10-day operating reserve. Immediate treasury action needed." },
      { id: "f2", severity: "high" as const, title: "4-Wall EBITDA Below Minimum", detail: "Restaurant-level EBITDA margin dropped to 18.2% — below the 20% intervention threshold." },
      { id: "f3", severity: "low" as const, title: "Favorable Utility Variance", detail: "Energy costs 14% below budget due to new HVAC efficiency program." },
    ];
  }
  return [
    { id: "f1", severity: "critical" as const, title: "Void-to-Sales Ratio Alert", detail: "Group void rate at 0.5% — exceeding 0.3% SLA threshold. 4 stores flagged for LP investigation." },
    { id: "f2", severity: "high" as const, title: "3P Delivery Commission Spike", detail: "DoorDash/UberEats commissions rose to 4.5% of revenue — 50bps above negotiated cap." },
    { id: "f3", severity: "high" as const, title: "SSSG Deceleration in Dallas Market", detail: "Dallas North SSSG declined from +6.1% to +1.8% over trailing 4 weeks. Traffic down -3.2%." },
    { id: "f4", severity: "medium" as const, title: "Labor Efficiency Alert: 12 Units", detail: "RPLH below $50 at 12 locations. Recommended: scheduling pattern optimization." },
    { id: "f5", severity: "medium" as const, title: "CapEx Pipeline Acceleration", detail: "3 new units moved to pre-opening ahead of schedule. Q2 CapEx forecast increased by $2.4M." },
    { id: "f6", severity: "info" as const, title: "Digital Mix Milestone", detail: "Digital ordering penetration crossed 38.5% — up from 31.2% same period prior year." },
  ];
}
