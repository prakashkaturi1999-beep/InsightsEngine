/**
 * financeMockData.ts
 *
 * Enterprise-grade baseline mock data for a $1.2B multi-brand restaurant group.
 * Craven Group: 450 units across 4 brands. Weekly base metrics at 1.0x scope.
 *
 * Key industry benchmarks embedded:
 *   - AUV: ~$52K/week ($2.7M/yr)     - Food Cost: ~29%
 *   - Prime Cost: ~58%                 - 4-Wall EBITDA: ~22%
 *   - Labor: ~29% of Revenue           - SSSG: +4.2%
 *   - RevPASH: ~$42                    - RPLH: ~$58
 */

// ── Core Weekly P&L (Group-level, 450 units) ─────────────────────────────────
export const financeBaseMetrics = {
  // Revenue
  netRevenue: 23_400_000,         // $23.4M/week
  sssg: 4.2,                       // Same-Store Sales Growth %
  transactionCount: 1_575_000,     // ~3,500 txns/unit/wk
  averageCheck: 14.86,             // $14.86
  unitCount: 450,
  compUnitCount: 412,
  newUnitCount: 38,
  auvWeekly: 52_000,               // Average Unit Volume weekly

  // Cost Structure
  cogs: 6_786_000,                 // 29.0% food + bev + packaging
  foodCost: 5_382_000,             // 23.0% — food only
  bevCost: 702_000,                // 3.0%
  packagingCost: 468_000,          // 2.0%
  wasteShrinkage: 234_000,         // 1.0%

  theoreticalFoodCost: 5_148_000,  // 22.0% — ideal/theoretical
  foodCostVariance: 234_000,       // $234K waste/variance

  // Labor
  totalLabor: 6_786_000,           // 29.0% of revenue
  hourlyWages: 4_914_000,          // 21.0%
  salaryMgmt: 936_000,             // 4.0%
  overtimePay: 351_000,            // 1.5%
  benefitsTaxes: 585_000,          // 2.5%

  laborHoursWeekly: 405_000,       // ~900 hrs/unit/wk
  rplh: 57.78,                     // Revenue Per Labor Hour
  overtimePct: 5.2,                // OT as % of total hours
  turnoverRateAnnual: 142,         // % — industry avg ~130-150%

  // Occupancy & Semi-Fixed
  occupancy: 1_638_000,            // 7.0% (rent, CAM, property tax)
  otherControllable: 1_170_000,    // 5.0% (R&M, supplies, utilities, marketing)
  nonControllable: 468_000,        // 2.0% (insurance, licenses, depreciation at unit)

  // Restaurant-Level (4-Wall) P&L
  restaurantEbitda: 6_552_000,     // 28.0% (after all unit-level costs)
  restaurantEbitdaMargin: 28.0,

  // Above-Store / G&A
  gaExpenses: 1_404_000,           // 6.0% (corporate overhead)
  corporateEbitda: 5_148_000,      // 22.0%
  corporateEbitdaMargin: 22.0,

  // Bottom Line
  interestExpense: 468_000,        // 2.0%
  taxProvision: 936_000,           // 4.0%
  netIncome: 3_744_000,            // 16.0%
  netIncomeMargin: 16.0,

  // Digital / Channel
  digitalMixPct: 38.5,             // % of revenue from digital channels
  revpash: 42.15,                  // Revenue Per Available Seat Hour

  // Prime Cost
  primeCostPct: 58.0,              // Food + Labor as % of Revenue
};

// ── Period Trend Data (7-day base) ───────────────────────────────────────────
export const financeTrend = [
  { day: "Mon", revenue: 2_800_000, ebitda: 784_000, transactions: 192_000, avgCheck: 14.58, foodCostPct: 29.4, laborPct: 29.8 },
  { day: "Tue", revenue: 2_950_000, ebitda: 826_000, transactions: 198_000, avgCheck: 14.90, foodCostPct: 29.2, laborPct: 29.5 },
  { day: "Wed", revenue: 3_100_000, ebitda: 899_000, transactions: 208_000, avgCheck: 14.90, foodCostPct: 28.8, laborPct: 29.0 },
  { day: "Thu", revenue: 3_350_000, ebitda: 971_000, transactions: 222_000, avgCheck: 15.09, foodCostPct: 28.6, laborPct: 28.8 },
  { day: "Fri", revenue: 3_900_000, ebitda: 1_170_000, transactions: 258_000, avgCheck: 15.12, foodCostPct: 28.4, laborPct: 28.2 },
  { day: "Sat", revenue: 3_800_000, ebitda: 1_102_000, transactions: 252_000, avgCheck: 15.08, foodCostPct: 28.9, laborPct: 28.5 },
  { day: "Sun", revenue: 3_500_000, ebitda: 980_000, transactions: 245_000, avgCheck: 14.29, foodCostPct: 29.1, laborPct: 29.6 },
];

// ── Store-Level Unit Economics (Top 8 representative units) ──────────────────
export const storePnL = [
  { name: "Nashville Flagship",   auvWeekly: 72_000, revenue: 72_000, cogs: 20_160, labor: 20_160, occupancy: 4_320, otherOpex: 3_600, ebitda4Wall: 23_760, margin4Wall: 33.0, primeCost: 56.0, rplh: 68.50, txnCount: 4_800, compStore: true,  vintage: 2018, sqft: 3200, seats: 120 },
  { name: "Atlanta Midtown",      auvWeekly: 65_000, revenue: 65_000, cogs: 19_500, labor: 19_500, occupancy: 4_875, otherOpex: 3_250, ebitda4Wall: 17_875, margin4Wall: 27.5, primeCost: 60.0, rplh: 61.20, txnCount: 4_300, compStore: true,  vintage: 2019, sqft: 2800, seats: 100 },
  { name: "Austin Central",       auvWeekly: 61_000, revenue: 61_000, cogs: 17_690, labor: 17_690, occupancy: 3_660, otherOpex: 3_050, ebitda4Wall: 18_910, margin4Wall: 31.0, primeCost: 58.0, rplh: 62.40, txnCount: 4_100, compStore: true,  vintage: 2020, sqft: 2600, seats: 95 },
  { name: "Dallas North",         auvWeekly: 58_000, revenue: 58_000, cogs: 17_400, labor: 17_400, occupancy: 3_480, otherOpex: 2_900, ebitda4Wall: 16_820, margin4Wall: 29.0, primeCost: 60.0, rplh: 55.80, txnCount: 3_900, compStore: true,  vintage: 2019, sqft: 2500, seats: 88 },
  { name: "Birmingham Square",    auvWeekly: 48_000, revenue: 48_000, cogs: 14_400, labor: 14_880, occupancy: 3_360, otherOpex: 2_880, ebitda4Wall: 12_480, margin4Wall: 26.0, primeCost: 61.0, rplh: 52.80, txnCount: 3_300, compStore: true,  vintage: 2017, sqft: 2400, seats: 82 },
  { name: "Knoxville West",       auvWeekly: 44_000, revenue: 44_000, cogs: 13_200, labor: 14_080, occupancy: 3_080, otherOpex: 2_640, ebitda4Wall: 11_000, margin4Wall: 25.0, primeCost: 62.0, rplh: 49.50, txnCount: 3_050, compStore: true,  vintage: 2016, sqft: 2200, seats: 78 },
  { name: "Huntsville New (2025)",auvWeekly: 55_000, revenue: 55_000, cogs: 15_950, labor: 16_500, occupancy: 3_300, otherOpex: 2_750, ebitda4Wall: 16_500, margin4Wall: 30.0, primeCost: 59.0, rplh: 56.10, txnCount: 3_700, compStore: false, vintage: 2025, sqft: 2700, seats: 92 },
  { name: "Franklin (2025)",      auvWeekly: 51_000, revenue: 51_000, cogs: 15_300, labor: 15_810, occupancy: 3_570, otherOpex: 2_550, ebitda4Wall: 13_770, margin4Wall: 27.0, primeCost: 61.0, rplh: 53.20, txnCount: 3_400, compStore: false, vintage: 2025, sqft: 2500, seats: 85 },
];

// ── Channel Mix ──────────────────────────────────────────────────────────────
export const channelMix = [
  { name: "Dine-In",       value: 8_190_000, pct: 35.0 },
  { name: "Drive-Thru",    value: 6_318_000, pct: 27.0 },
  { name: "Delivery (3P)", value: 3_510_000, pct: 15.0 },
  { name: "Delivery (1P)", value: 1_638_000, pct: 7.0  },
  { name: "Takeout",       value: 2_808_000, pct: 12.0 },
  { name: "Catering",      value: 936_000,   pct: 4.0  },
];

// ── Daypart Breakdown (QSR standard splits) ──────────────────────────────────
export const daypartMix = [
  { name: "Breakfast",    value: 3_276_000, pct: 14.0, txnCount: 252_000 },
  { name: "Lunch",        value: 7_956_000, pct: 34.0, txnCount: 551_250 },
  { name: "Afternoon",    value: 2_340_000, pct: 10.0, txnCount: 173_250 },
  { name: "Dinner",       value: 7_488_000, pct: 32.0, txnCount: 472_500 },
  { name: "Late Night",   value: 2_340_000, pct: 10.0, txnCount: 126_000 },
];

// ── COGS Category Detail ─────────────────────────────────────────────────────
export const cogsBreakdown = [
  { name: "Proteins",     value: 2_574_000, pct: 11.0 },
  { name: "Produce",      value: 936_000,   pct: 4.0  },
  { name: "Dairy",        value: 702_000,   pct: 3.0  },
  { name: "Dry Goods",    value: 1_170_000, pct: 5.0  },
  { name: "Beverages",    value: 702_000,   pct: 3.0  },
  { name: "Alcohol",      value: 234_000,   pct: 1.0  },
  { name: "Packaging",    value: 468_000,   pct: 2.0  },
];

// ── Cash Flow & Treasury ─────────────────────────────────────────────────────
export const cashFlowMetrics = {
  operatingCashFlow: 5_850_000,
  capex: 1_950_000,          // New units + remodels + equipment
  debtService: 780_000,      // Interest + principal
  freeCashFlow: 3_120_000,
  cashConversionCycleDays: 12,
  workingCapitalDays: 8,
  debtServiceCoverageRatio: 3.2,
  currentCashBalance: 42_500_000,
  operatingReserve: 35_000_000,  // 10-day runway
};

export const capexPipeline = [
  { name: "New Unit Construction", value: 975_000,  pct: 50 },
  { name: "Remodels & Refreshes",  value: 390_000,  pct: 20 },
  { name: "Equipment & FF&E",      value: 292_500,  pct: 15 },
  { name: "Technology & POS",      value: 195_000,  pct: 10 },
  { name: "Other",                 value: 97_500,   pct: 5  },
];

export const cashFlowActivity = [
  { date: "Mon",   category: "Opening Balance",       inflow: null,      outflow: null,      net: 0,          balance: 42_500_000 },
  { date: "Mon",   category: "Daily Sales Deposits",   inflow: 2_800_000, outflow: null,      net: 2_800_000,  balance: 45_300_000 },
  { date: "Tue",   category: "Sysco / US Foods",       inflow: null,      outflow: 3_200_000, net: -3_200_000, balance: 42_100_000 },
  { date: "Wed",   category: "Bi-Weekly Payroll",      inflow: null,      outflow: 6_786_000, net: -6_786_000, balance: 38_414_000 },
  { date: "Thu",   category: "Daily Sales Deposits",   inflow: 6_450_000, outflow: null,      net: 6_450_000,  balance: 44_864_000 },
  { date: "Fri",   category: "Rent & CAM (Monthly)",   inflow: null,      outflow: 1_638_000, net: -1_638_000, balance: 43_226_000 },
  { date: "Sat",   category: "Weekend Sales Deposits", inflow: 7_300_000, outflow: null,      net: 7_300_000,  balance: 50_526_000 },
  { date: "Sun",   category: "Debt Service Payment",   inflow: null,      outflow: 780_000,   net: -780_000,   balance: 49_746_000 },
];

// ── Labor & Expenses Detail ──────────────────────────────────────────────────
export const laborDetail = [
  { name: "Hourly FOH",    value: 2_808_000, pct: 41.4 },
  { name: "Hourly BOH",    value: 2_106_000, pct: 31.0 },
  { name: "Salaried Mgmt", value: 936_000,   pct: 13.8 },
  { name: "Overtime Pay",  value: 351_000,   pct: 5.2  },
  { name: "Benefits/Tax",  value: 585_000,   pct: 8.6  },
];

export const controllableOpex = [
  { name: "R&M / Repairs",       value: 351_000, pct: 1.5 },
  { name: "Smallwares & Supply", value: 234_000, pct: 1.0 },
  { name: "Utilities",           value: 351_000, pct: 1.5 },
  { name: "Marketing (Local)",   value: 234_000, pct: 1.0 },
];

export const nonControllableOpex = [
  { name: "Insurance",      value: 187_200, pct: 0.8 },
  { name: "Licenses/Permits", value: 46_800, pct: 0.2 },
  { name: "Depreciation",   value: 234_000, pct: 1.0 },
];

export const gaExpenses = [
  { name: "Corporate Salaries",   value: 561_600,  pct: 2.4 },
  { name: "Corporate Rent/Office",value: 187_200,  pct: 0.8 },
  { name: "Marketing (Brand)",    value: 234_000,  pct: 1.0 },
  { name: "Technology/IT",        value: 187_200,  pct: 0.8 },
  { name: "Legal/Audit/Advisory", value: 117_000,  pct: 0.5 },
  { name: "Travel/Other",         value: 117_000,  pct: 0.5 },
];

// ── Payments & Tax ───────────────────────────────────────────────────────────
export const tenderMix = [
  { name: "Visa",           value: 7_488_000, pct: 32.0, feeRate: 2.10 },
  { name: "Mastercard",     value: 5_616_000, pct: 24.0, feeRate: 2.05 },
  { name: "Amex",           value: 1_638_000, pct: 7.0,  feeRate: 2.90 },
  { name: "Discover",       value: 468_000,   pct: 2.0,  feeRate: 2.15 },
  { name: "Cash",           value: 2_574_000, pct: 11.0, feeRate: 0    },
  { name: "Digital Wallet", value: 2_808_000, pct: 12.0, feeRate: 1.80 },
  { name: "3P App Payments",value: 2_808_000, pct: 12.0, feeRate: 0    },
];

export const taxLiabilities = [
  { name: "Sales Tax Collected",  value: 1_872_000 },
  { name: "Payroll Tax Liability",value: 1_053_000 },
  { name: "Property Tax Accrual", value: 351_000   },
  { name: "Corporate Tax Est.",   value: 936_000   },
];

export const processingFees = {
  totalFees: 421_200,
  effectiveRate: 1.80,
  costPerTransaction: 0.267,
  deliveryCommissions: 1_053_000,  // 3P delivery commissions (~30% of 3P revenue)
};

// ── Forecasting ──────────────────────────────────────────────────────────────
export const forecastScenarios = {
  base: { annualRevenue: 1_216_800_000, annualEbitda: 267_696_000, sssg: 4.2, newUnits: 28 },
  best: { annualRevenue: 1_338_480_000, annualEbitda: 307_850_400, sssg: 6.8, newUnits: 35 },
  worst:{ annualRevenue: 1_095_120_000, annualEbitda: 219_024_000, sssg: 1.5, newUnits: 18 },
};

export const rolling13WeekForecast = [
  { week: "W1",  revenue: 23_400_000, ebitda: 5_148_000 },
  { week: "W2",  revenue: 23_600_000, ebitda: 5_192_000 },
  { week: "W3",  revenue: 23_800_000, ebitda: 5_236_000 },
  { week: "W4",  revenue: 24_200_000, ebitda: 5_324_000 },
  { week: "W5",  revenue: 24_000_000, ebitda: 5_280_000 },
  { week: "W6",  revenue: 24_400_000, ebitda: 5_368_000 },
  { week: "W7",  revenue: 24_800_000, ebitda: 5_456_000 },
  { week: "W8",  revenue: 24_600_000, ebitda: 5_412_000 },
  { week: "W9",  revenue: 25_000_000, ebitda: 5_500_000 },
  { week: "W10", revenue: 25_200_000, ebitda: 5_544_000 },
  { week: "W11", revenue: 25_400_000, ebitda: 5_588_000 },
  { week: "W12", revenue: 25_600_000, ebitda: 5_632_000 },
  { week: "W13", revenue: 25_800_000, ebitda: 5_676_000 },
];

export const newUnitPipeline = [
  { stage: "Signed LOI",          count: 42 },
  { stage: "Permitting",          count: 28 },
  { stage: "Under Construction",  count: 18 },
  { stage: "Pre-Opening",         count: 8  },
  { stage: "Opened (YTD)",        count: 14 },
];

export const sensitivityMatrix = [
  { driver: "Revenue +2%",    revenueImpact: 24_336_000,  ebitdaImpact: 10_108_800 },
  { driver: "Revenue -2%",    revenueImpact: -24_336_000, ebitdaImpact: -10_108_800 },
  { driver: "Food Cost +1pp", revenueImpact: 0,           ebitdaImpact: -12_168_000 },
  { driver: "Food Cost -1pp", revenueImpact: 0,           ebitdaImpact: 12_168_000  },
  { driver: "Labor +1pp",     revenueImpact: 0,           ebitdaImpact: -12_168_000 },
  { driver: "Labor -1pp",     revenueImpact: 0,           ebitdaImpact: 12_168_000  },
];

// ── Financial Leakage ────────────────────────────────────────────────────────
export const leakageDetail = [
  { name: "Discounts & Promos",  value: 702_000,   pctOfRev: 3.0, threshold: 3.5 },
  { name: "Voids",               value: 117_000,   pctOfRev: 0.5, threshold: 0.3 },
  { name: "Refunds",             value: 187_200,   pctOfRev: 0.8, threshold: 0.5 },
  { name: "Comp Meals",          value: 163_800,   pctOfRev: 0.7, threshold: 0.5 },
  { name: "Delivery Commissions",value: 1_053_000, pctOfRev: 4.5, threshold: 4.0 },
  { name: "Payment Processing",  value: 421_200,   pctOfRev: 1.8, threshold: 2.0 },
  { name: "Shrinkage/Theft",     value: 93_600,    pctOfRev: 0.4, threshold: 0.3 },
];

export const topExceptions = [
  { id: "EX-001", date: "Mar 14", store: "Birmingham Square", type: "Void",     amount: 2_847, description: "Manager void — 18 items voided in single ticket", flag: "high" },
  { id: "EX-002", date: "Mar 15", store: "Knoxville West",    type: "Refund",   amount: 1_250, description: "Full refund — customer complaint, no food returned", flag: "high" },
  { id: "EX-003", date: "Mar 16", store: "Dallas North",      type: "Discount", amount: 4_100, description: "Unauthorized 40% discount applied across 23 orders", flag: "critical" },
  { id: "EX-004", date: "Mar 15", store: "Atlanta Midtown",   type: "Comp",     amount: 890,   description: "Comp meals above weekly threshold", flag: "medium" },
  { id: "EX-005", date: "Mar 14", store: "Nashville Flagship", type: "Void",    amount: 1_620, description: "Post-settlement void — requires investigation", flag: "high" },
];

// ── Budget vs Actual ─────────────────────────────────────────────────────────
export const budgetVsActual = [
  { item: "Net Revenue",           budget: 22_800_000, actual: 23_400_000, rollingForecast: 23_200_000 },
  { item: "COGS",                  budget: 6_612_000,  actual: 6_786_000,  rollingForecast: 6_728_000  },
  { item: "Labor",                 budget: 6_840_000,  actual: 6_786_000,  rollingForecast: 6_800_000  },
  { item: "Occupancy",             budget: 1_596_000,  actual: 1_638_000,  rollingForecast: 1_624_000  },
  { item: "Other OpEx",            budget: 1_140_000,  actual: 1_170_000,  rollingForecast: 1_155_000  },
  { item: "Restaurant EBITDA",     budget: 6_612_000,  actual: 6_552_000,  rollingForecast: 6_580_000  },
  { item: "G&A",                   budget: 1_368_000,  actual: 1_404_000,  rollingForecast: 1_392_000  },
  { item: "Corporate EBITDA",      budget: 5_244_000,  actual: 5_148_000,  rollingForecast: 5_188_000  },
];
