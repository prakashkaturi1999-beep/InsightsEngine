export type ChannelKey = "dineIn" | "takeaway" | "delivery";

export const TOTAL_SALES = 53250;

export const channelSales = {
  dineIn: 34950,
  takeaway: 10750,
  delivery: 7550,
} as const;

export const deliveryBreakdown = {
  uberEats: 3200,
  doorDash: 3400,
  grubHub: 950,
} as const;

// Home view snapshot (today)
export const homeSnapshot = {
  netSales: 2450,
  totalOrders: 175,
  averageOrderValue: 14.0,
  vsGoalPct: 8.5,
  vsLastWeekPct: 12.0,
};

export const homeFoodBreakdown = [
  { name: "Burgers", value: 52 },
  { name: "Pasta", value: 28 },
  { name: "Other", value: 20 },
];

export const homeChannelBreakdown = [
  { name: "Uber Eats", value: 24 },
  { name: "Dine-In", value: 51 },
  { name: "Takeaway", value: 25 },
];

export const homeDrinksBreakdown = [
  { name: "Soft Drinks", value: 46 },
  { name: "Beer", value: 32 },
  { name: "Other", value: 22 },
];

export const storeSalesToday = [
  { store: "Downtown", sales: 12200 },
  { store: "Uptown", sales: 9800 },
  { store: "Airport", sales: 8600 },
  { store: "Suburb East", sales: 7400 },
  { store: "Suburb West", sales: 6250 },
];

export const revenueLeakage = [
  { label: "Discounts", value: 420 },
  { label: "Refunds", value: 180 },
  { label: "Voids", value: 95 },
];

export const salesTrend7Days = [
  { day: "Mon", sales: 7200 },
  { day: "Tue", sales: 7550 },
  { day: "Wed", sales: 7680 },
  { day: "Thu", sales: 8010 },
  { day: "Fri", sales: 8920 },
  { day: "Sat", sales: 9450 },
  { day: "Sun", sales: 9440 },
];

// Overview metrics
export const overviewMetrics = {
  totalSales: TOTAL_SALES,
  todaysOrders: 720,
  topStoreSales: 12200,
  averageOrderValue: 11.63,
};

export const overviewDailyChannelTrend = [
  { day: "Mon", dineIn: 4300, delivery: 1450, pickup: 1450 },
  { day: "Tue", dineIn: 4450, delivery: 1500, pickup: 1600 },
  { day: "Wed", dineIn: 4525, delivery: 1525, pickup: 1630 },
  { day: "Thu", dineIn: 4680, delivery: 1580, pickup: 1750 },
  { day: "Fri", dineIn: 5230, delivery: 1820, pickup: 1870 },
  { day: "Sat", dineIn: 5600, delivery: 1950, pickup: 1900 },
  { day: "Sun", dineIn: 5665, delivery: 1925, pickup: 1850 },
];

export const overviewStoreContribution = [
  { name: "Downtown", value: 12200 },
  { name: "Uptown", value: 10850 },
  { name: "Airport", value: 9450 },
  { name: "Suburb East", value: 8600 },
  { name: "Suburb West", value: 7150 },
];

// Top products table (overview)
export type TopProductRow = {
  id: string;
  store: string;
  item: string;
  units: number;
  avgPrice: number;
  sales: number;
  trendPct: number;
};

export const topProducts: TopProductRow[] = [
  {
    id: "1",
    store: "Downtown",
    item: "Classic Burger",
    units: 540,
    avgPrice: 14.5,
    sales: 540 * 14.5,
    trendPct: 9.8,
  },
  {
    id: "2",
    store: "Uptown",
    item: "Chicken Sandwich",
    units: 460,
    avgPrice: 13.25,
    sales: 460 * 13.25,
    trendPct: 6.4,
  },
  {
    id: "3",
    store: "Airport",
    item: "Pasta Alfredo",
    units: 390,
    avgPrice: 15.75,
    sales: 390 * 15.75,
    trendPct: -3.1,
  },
  {
    id: "4",
    store: "Suburb East",
    item: "Grilled Salmon",
    units: 280,
    avgPrice: 18.0,
    sales: 280 * 18.0,
    trendPct: 4.2,
  },
  {
    id: "5",
    store: "Suburb West",
    item: "Veggie Bowl",
    units: 260,
    avgPrice: 12.5,
    sales: 260 * 12.5,
    trendPct: -1.7,
  },
];

