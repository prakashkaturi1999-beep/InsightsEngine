// ─── Sales Domain Mock Data ───────────────────────────────────────────────────

// ── 1. SALES HOME — Daily Snapshot ───────────────────────────────────────────
export const dailySnapshot = {
  netSales: { value: 2_450, vsDailyGoal: 82, vsYesterday: 12 },
  orders: { value: 175, vsLastWeek: 8 },
  aov: { value: 14.0, vsLastWeek: -3 },
  revenueLeakage: {
    total: 210,
    discounts: 100,
    refunds: 85,
    voids: 25,
  },
};

export const homeFoodDonut = [
  { name: "Burgers", value: 52 },
  { name: "Pasta", value: 28 },
  { name: "Other", value: 20 },
];

export const homeChannelDonut = [
  { name: "Dine-In", value: 51 },
  { name: "Uber Eats", value: 24 },
  { name: "Takeout", value: 25 },
];

export const homeDrinksDonut = [
  { name: "Soft Drinks", value: 46 },
  { name: "Beer", value: 32 },
  { name: "Other", value: 22 },
];

export const homeSalesTrend = [
  { day: "Dec 1", revenue: 2100 },
  { day: "Dec 5", revenue: 2350 },
  { day: "Dec 10", revenue: 2200 },
  { day: "Dec 15", revenue: 2600 },
  { day: "Dec 20", revenue: 2850 },
  { day: "Dec 25", revenue: 1900 },
  { day: "Dec 28", revenue: 2700 },
  { day: "Dec 31", revenue: 2450 },
];

export const homeStoreSales = [
  { name: "Main St Location", sales: 1_080 },
  { name: "Park Ave Grill", sales: 820 },
  { name: "Riverside Café", sales: 550 },
];

// ── 2. OVERVIEW — Sales Performance ──────────────────────────────────────────
export const overviewKpis = {
  totalSales: { value: 53_250, delta: 12 },
  todaysOrders: { value: 720, delta: 10 },
  topStore: { value: 12_200, label: "Downtown" },
  avgOrderValue: { value: 11.63, delta: 1.9 },
};

export const overviewDailyTrend = [
  { day: "Mon", dineIn: 4300, delivery: 1450, pickup: 1450, downtown: 1750 },
  { day: "Tue", dineIn: 4450, delivery: 1500, pickup: 1600, downtown: 1800 },
  { day: "Wed", dineIn: 4525, delivery: 1525, pickup: 1630, downtown: 1780 },
  { day: "Thu", dineIn: 4680, delivery: 1580, pickup: 1750, downtown: 1900 },
  { day: "Fri", dineIn: 5230, delivery: 1820, pickup: 1870, downtown: 2100 },
  { day: "Sat", dineIn: 5600, delivery: 1950, pickup: 1900, downtown: 2200 },
  { day: "Sun", dineIn: 5665, delivery: 1925, pickup: 1850, downtown: 2150 },
];

export const overviewStoreDonut = [
  { name: "Downtown", value: 22.9 },
  { name: "Westside", value: 20.4 },
  { name: "Hilltop", value: 17.8 },
  { name: "Northside", value: 16.2 },
  { name: "Airport", value: 13.4 },
  { name: "Suburb", value: 9.3 },
];

export type OverviewProduct = {
  id: string;
  item: string;
  units: number;
  sales: number;
  trendPct: number;
};

export const overviewTopProducts: OverviewProduct[] = [
  { id: "1", item: "Burgers", units: 1490, sales: 15800, trendPct: 8.2 },
  { id: "2", item: "Wings", units: 1280, sales: 12600, trendPct: 6.4 },
  { id: "3", item: "Tacos", units: 920, sales: 8050, trendPct: 14.1 },
  { id: "4", item: "Fries", units: 1650, sales: 4950, trendPct: 2.3 },
  { id: "5", item: "Salads", units: 480, sales: 5760, trendPct: -1.1 },
  { id: "6", item: "Steaks", units: 310, sales: 6200, trendPct: 3.8 },
];

// ── 3. ITEM PERFORMANCE — Food ───────────────────────────────────────────────
export const foodKpis = {
  topByQuantity: { item: "Burgers", units: 1490 },
  topBySales: { item: "Wings", sales: 12600 },
  totalSales: 53_250,
  todaysOrders: 720,
};

export const foodTrend7d = [
  { day: "Mon", Burgers: 190, Wings: 160, Tacos: 110, Fries: 220, Salads: 60 },
  { day: "Tue", Burgers: 200, Wings: 175, Tacos: 120, Fries: 230, Salads: 65 },
  { day: "Wed", Burgers: 210, Wings: 180, Tacos: 130, Fries: 235, Salads: 70 },
  { day: "Thu", Burgers: 220, Wings: 190, Tacos: 140, Fries: 240, Salads: 72 },
  { day: "Fri", Burgers: 240, Wings: 210, Tacos: 155, Fries: 260, Salads: 68 },
  { day: "Sat", Burgers: 225, Wings: 195, Tacos: 150, Fries: 250, Salads: 75 },
  { day: "Sun", Burgers: 205, Wings: 170, Tacos: 115, Fries: 215, Salads: 70 },
];

export const foodDonut = [
  { name: "Burgers", value: 30 },
  { name: "Wings", value: 25 },
  { name: "Tacos", value: 16 },
  { name: "Fries", value: 10 },
  { name: "Salads", value: 11 },
  { name: "Other", value: 8 },
];

export const decliningFood = [
  { item: "Soda", units: 680, delta: -8 },
  { item: "Onion Rings", units: 310, delta: -5 },
  { item: "Mozzarella Sticks", units: 220, delta: -4 },
];

export const increasingFood = [
  { item: "Tacos", units: 920, delta: 14 },
  { item: "Salad", units: 480, delta: 9 },
  { item: "Chicken Tenders", units: 560, delta: 11 },
];

export type ItemRow = {
  id: string;
  category: string;
  item: string;
  units: number;
  revenue: number;
  aov: number;
  margin: number;
  delta: number;
};

export const foodItems: ItemRow[] = [
  { id: "f1", category: "Wings", item: "Classic Wings (10pc)", units: 18_400, revenue: 331_200, aov: 18.0, margin: 62, delta: 8.4 },
  { id: "f2", category: "Wings", item: "Boneless Wings (10pc)", units: 14_200, revenue: 227_200, aov: 16.0, margin: 64, delta: 5.1 },
  { id: "f3", category: "Wings", item: "Spicy Wings (12pc)", units: 11_800, revenue: 236_000, aov: 20.0, margin: 61, delta: 3.8 },
  { id: "f4", category: "Burgers", item: "Signature Smash Burger", units: 9_200, revenue: 175_600, aov: 19.1, margin: 58, delta: 6.2 },
  { id: "f5", category: "Burgers", item: "Double Cheese Burger", units: 8_100, revenue: 170_100, aov: 21.0, margin: 55, delta: 4.0 },
  { id: "f6", category: "Sides", item: "Loaded Fries", units: 22_400, revenue: 134_400, aov: 6.0, margin: 72, delta: 12.1 },
  { id: "f7", category: "Sides", item: "Onion Rings", units: 14_600, revenue: 87_600, aov: 6.0, margin: 70, delta: 2.3 },
  { id: "f8", category: "Sandwiches", item: "Nashville Hot Chicken Sandwich", units: 7_400, revenue: 133_200, aov: 18.0, margin: 57, delta: 9.7 },
  { id: "f9", category: "Sandwiches", item: "Classic Club", units: 5_200, revenue: 88_400, aov: 17.0, margin: 56, delta: -2.4 },
  { id: "f10", category: "Salads", item: "Caesar Salad", units: 4_100, revenue: 57_400, aov: 14.0, margin: 65, delta: -1.1 },
];

// ── 4. ITEM PERFORMANCE — Alcohol (All Categories) ──────────────────────────
export const alcoholKpis = {
  totalSales: 13_700,
  totalUnits: 1_050,
  topBySales: { item: "Whiskey", sales: 8_000 },
  declining: { item: "Vodka", units: 310, delta: -7 },
};

export const alcoholCategoryDonut = [
  { name: "Beer", value: 30 },
  { name: "Wine", value: 18 },
  { name: "Seltzer", value: 8 },
  { name: "Cocktail", value: 22 },
  { name: "Whiskey", value: 16 },
  { name: "Vodka", value: 6 },
];

export type AlcoholCategoryRow = {
  id: string;
  category: string;
  units: number;
  sales: number;
  avgPrice: number;
  sparkline: number[];
};

export const alcoholCategoryTable: AlcoholCategoryRow[] = [
  { id: "ac1", category: "Beer", units: 840, sales: 5_700, avgPrice: 6.79, sparkline: [780, 800, 810, 830, 840, 850, 840] },
  { id: "ac2", category: "Whiskey", units: 210, sales: 8_000, avgPrice: 38.1, sparkline: [190, 195, 200, 205, 210, 208, 210] },
  { id: "ac3", category: "Wine", units: 280, sales: 2_520, avgPrice: 9.0, sparkline: [260, 270, 275, 280, 285, 280, 280] },
  { id: "ac4", category: "Cocktail", units: 320, sales: 4_480, avgPrice: 14.0, sparkline: [290, 300, 310, 315, 320, 325, 320] },
  { id: "ac5", category: "Seltzer", units: 180, sales: 1_080, avgPrice: 6.0, sparkline: [150, 160, 165, 170, 175, 178, 180] },
  { id: "ac6", category: "Vodka", units: 310, sales: 2_790, avgPrice: 9.0, sparkline: [340, 330, 325, 320, 315, 312, 310] },
];

// ── 5. ITEM PERFORMANCE — Beer Deep Dive ─────────────────────────────────────
export const beerKpis = {
  totalSales: 5_700,
  totalUnits: 840,
  topBeer: { item: "IPA", sales: 1_250 },
  declining: { item: "Stout", units: 260, delta: -4 },
};

export const beerDonut = [
  { name: "IPA", value: 35 },
  { name: "Lager", value: 30 },
  { name: "Stout", value: 15 },
  { name: "Pilsner", value: 12 },
  { name: "Wheat", value: 8 },
];

export type BeerSubRow = {
  id: string;
  subCategory: string;
  units: number;
  sales: number;
  avgPrice: number;
  sparkline: number[];
};

export const beerSubTable: BeerSubRow[] = [
  { id: "b1", subCategory: "IPA", units: 294, sales: 1_250, avgPrice: 4.25, sparkline: [270, 278, 285, 290, 294, 296, 294] },
  { id: "b2", subCategory: "Lager", units: 252, sales: 1_134, avgPrice: 4.50, sparkline: [240, 245, 248, 250, 252, 254, 252] },
  { id: "b3", subCategory: "Stout", units: 126, sales: 756, avgPrice: 6.00, sparkline: [140, 138, 134, 130, 128, 127, 126] },
  { id: "b4", subCategory: "Pilsner", units: 101, sales: 505, avgPrice: 5.00, sparkline: [90, 92, 95, 98, 99, 100, 101] },
  { id: "b5", subCategory: "Wheat", units: 67, sales: 402, avgPrice: 6.00, sparkline: [55, 58, 60, 62, 64, 66, 67] },
];

// ── 5b. ITEM PERFORMANCE — Whiskey Deep Dive ─────────────────────────────────
export const whiskeyKpis = {
  totalSales: 8_000,
  totalUnits: 210,
  topWhiskey: { item: "Bourbon", sales: 2_500 },
  declining: { item: "Irish Whiskey", units: 30, delta: -6 },
};

export const whiskeyDonut = [
  { name: "Bourbon", value: 40 },
  { name: "Scotch", value: 25 },
  { name: "Rye", value: 18 },
  { name: "Irish", value: 10 },
  { name: "Japanese", value: 7 },
];

export const whiskeySubTable: BeerSubRow[] = [
  { id: "w1", subCategory: "Bourbon", units: 84, sales: 2_500, avgPrice: 29.76, sparkline: [75, 78, 80, 82, 83, 84, 84] },
  { id: "w2", subCategory: "Scotch", units: 53, sales: 2_120, avgPrice: 40.00, sparkline: [48, 49, 50, 51, 52, 53, 53] },
  { id: "w3", subCategory: "Rye", units: 38, sales: 1_520, avgPrice: 40.00, sparkline: [32, 33, 35, 36, 37, 38, 38] },
  { id: "w4", subCategory: "Irish Whiskey", units: 21, sales: 1_050, avgPrice: 50.00, sparkline: [28, 26, 25, 24, 22, 21, 21] },
  { id: "w5", subCategory: "Japanese", units: 14, sales: 810, avgPrice: 57.86, sparkline: [10, 11, 12, 12, 13, 14, 14] },
];

// Full alcohol item row type (for full table in "all alcohol" view)
export type AlcoholRow = {
  id: string;
  category: string;
  item: string;
  units: number;
  revenue: number;
  aov: number;
  margin: number;
  delta: number;
};

export const alcoholItems: AlcoholRow[] = [
  { id: "a1", category: "Beer", item: "Draft Lager (Pint)", units: 14_200, revenue: 99_400, aov: 7.0, margin: 76, delta: 5.2 },
  { id: "a2", category: "Beer", item: "Craft IPA (Pint)", units: 9_800, revenue: 88_200, aov: 9.0, margin: 74, delta: 8.1 },
  { id: "a3", category: "Beer", item: "Bottled Beer (330ml)", units: 12_400, revenue: 74_400, aov: 6.0, margin: 78, delta: 2.3 },
  { id: "a4", category: "Beer", item: "Low-Carb Beer", units: 6_200, revenue: 43_400, aov: 7.0, margin: 75, delta: 11.4 },
  { id: "a5", category: "Whiskey", item: "Bourbon (House Pour)", units: 5_100, revenue: 71_400, aov: 14.0, margin: 82, delta: 6.8 },
  { id: "a6", category: "Whiskey", item: "Tennessee Whiskey", units: 3_800, revenue: 57_000, aov: 15.0, margin: 80, delta: 9.2 },
  { id: "a7", category: "Whiskey", item: "Scotch (Single Malt)", units: 2_100, revenue: 42_000, aov: 20.0, margin: 78, delta: 3.5 },
  { id: "a8", category: "Wine", item: "House Red (Glass)", units: 8_600, revenue: 77_400, aov: 9.0, margin: 72, delta: 4.1 },
  { id: "a9", category: "Wine", item: "House White (Glass)", units: 7_200, revenue: 64_800, aov: 9.0, margin: 73, delta: 1.8 },
  { id: "a10", category: "Wine", item: "Prosecco (Glass)", units: 4_800, revenue: 52_800, aov: 11.0, margin: 70, delta: 7.6 },
  { id: "a11", category: "Wine", item: "Rosé (Glass)", units: 3_100, revenue: 27_900, aov: 9.0, margin: 71, delta: -3.2 },
  { id: "a12", category: "Cocktails", item: "Old Fashioned", units: 6_400, revenue: 102_400, aov: 16.0, margin: 68, delta: 14.2 },
  { id: "a13", category: "Cocktails", item: "Margarita", units: 5_900, revenue: 88_500, aov: 15.0, margin: 67, delta: 8.4 },
  { id: "a14", category: "Cocktails", item: "Moscow Mule", units: 4_200, revenue: 63_000, aov: 15.0, margin: 66, delta: 5.9 },
  { id: "a15", category: "Spirits", item: "Tequila Shot", units: 3_800, revenue: 34_200, aov: 9.0, margin: 84, delta: 19.4 },
  { id: "a16", category: "Spirits", item: "Vodka Shot", units: 3_200, revenue: 25_600, aov: 8.0, margin: 85, delta: 12.1 },
  { id: "a17", category: "Spirits", item: "Rum (House)", units: 2_100, revenue: 16_800, aov: 8.0, margin: 83, delta: 3.4 },
];

export const alcoholCategoryRevenue = [
  { name: "Beer", value: 305_400 },
  { name: "Whiskey", value: 170_400 },
  { name: "Wine", value: 222_900 },
  { name: "Cocktails", value: 253_900 },
  { name: "Spirits", value: 76_600 },
];

// ── 6. CHANNEL BREAKDOWN — Overview ──────────────────────────────────────────
export const channelOverviewKpis = {
  totalSales: 53_250,
  dineIn: 34_950,
  takeaway: 10_750,
  delivery: 7_550,
};

export const channelDonut = [
  { name: "Dine-In", value: 66 },
  { name: "Takeaway", value: 20 },
  { name: "Delivery", value: 14 },
];

export type ChannelTableRow = {
  id: string;
  channel: string;
  orders: number;
  sales: number;
  avgOrder: number;
  trendPct: number;
};

export const channelTable: ChannelTableRow[] = [
  { id: "c1", channel: "Dine-In", orders: 2_490, sales: 34_950, avgOrder: 14.04, trendPct: 5.2 },
  { id: "c2", channel: "Takeaway", orders: 920, sales: 10_750, avgOrder: 11.68, trendPct: 8.6 },
  { id: "c3", channel: "Delivery", orders: 580, sales: 7_550, avgOrder: 13.02, trendPct: -2.1 },
];

// ── 7. CHANNEL — Dine-In Detail ──────────────────────────────────────────────
export const dineInKpis = {
  sales: 35_050,
  avgOrder: 14.02,
};

export const dineInTrend = [
  { day: "Mon", sales: 4300 },
  { day: "Tue", sales: 4450 },
  { day: "Wed", sales: 4525 },
  { day: "Thu", sales: 4680 },
  { day: "Fri", sales: 5230 },
  { day: "Sat", sales: 5600 },
  { day: "Sun", sales: 5665 },
];

export const dineInMenuType = [
  { type: "Main Courses", sales: 28_040, pct: 80 },
  { type: "Desserts", sales: 7_010, pct: 20 },
];

export const dineInTopItems = [
  { item: "Burgers", units: 540, avgPrice: 14.50, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=120&h=120" },
  { item: "Tacos", units: 380, avgPrice: 12.75, image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=120&h=120" },
  { item: "Steaks", units: 260, avgPrice: 28.00, image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=120&h=120" },
  { item: "Wings", units: 420, avgPrice: 13.50, image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&q=80&w=120&h=120" },
];

export const dineInDecliningItems = [
  { item: "Salads", units: 120, avgPrice: 11.00, delta: -8, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=120&h=120" },
  { item: "Draft Beer", units: 210, avgPrice: 6.00, delta: -5, image: "https://images.unsplash.com/photo-1538481199005-411311b5e82b?auto=format&fit=crop&q=80&w=120&h=120" },
];

export const takeawayTopItems = [
  { item: "Family Meal Deal", units: 140, avgPrice: 45.00, image: "https://images.unsplash.com/photo-1610440042657-612c34d95e9f?auto=format&fit=crop&q=80&w=120&h=120" },
  { item: "Wings Bucket", units: 280, avgPrice: 24.00, image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&q=80&w=120&h=120" },
  { item: "Smash Burgers", units: 410, avgPrice: 14.50, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=120&h=120" },
];

export const takeawayDecliningItems = [
  { item: "Personal Pizza", units: 65, avgPrice: 12.00, delta: -12, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=120&h=120" },
  { item: "Side Salads", units: 110, avgPrice: 5.00, delta: -6, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=120&h=120" },
];

export const dineInTrending = [
  { item: "Soda", units: 320, delta: 6 },
  { item: "Onion Rings", units: 180, delta: 4 },
];

// ── 8. CHANNEL — Third-Party Delivery ────────────────────────────────────────
export const deliveryKpis = {
  totalSales: 7_450,
  uberEats: 3_200,
  doorDash: 3_400,
  grubHub: 850,
};

export const deliveryTrend = [
  { day: "Mon", uber: 380, doordash: 420, total: 800 },
  { day: "Tue", uber: 400, doordash: 440, total: 840 },
  { day: "Wed", uber: 420, doordash: 430, total: 850 },
  { day: "Thu", uber: 460, doordash: 480, total: 940 },
  { day: "Fri", uber: 520, doordash: 540, total: 1060 },
  { day: "Sat", uber: 560, doordash: 580, total: 1140 },
  { day: "Sun", uber: 540, doordash: 560, total: 1100 },
];

export const deliveryMarketShare = [
  { name: "Uber Eats", value: 43 },
  { name: "DoorDash", value: 46 },
  { name: "GrubHub", value: 11 },
];

export const uberEatsDonut = [
  { name: "Burgers", value: 35 },
  { name: "Wings", value: 28 },
  { name: "Tacos", value: 22 },
  { name: "Other", value: 15 },
];

export const doorDashDonut = [
  { name: "Wings", value: 32 },
  { name: "Burgers", value: 30 },
  { name: "Fries", value: 20 },
  { name: "Other", value: 18 },
];

export const deliveryTopItems = [
  { item: "Wings (10pc)", units: 190, sales: 2_850, image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&q=80&w=120&h=120" },
  { item: "Burgers", units: 160, sales: 2_240, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=120&h=120" },
  { item: "Tacos", units: 120, sales: 1_500, image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=120&h=120" },
];

export const deliveryDecliningItems = [
  { item: "Milkshakes", units: 85, avgPrice: 6.50, delta: -14, image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=120&h=120" },
  { item: "Onion Rings", units: 140, avgPrice: 5.50, delta: -7, image: "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&q=80&w=120&h=120" },
];

export const uberTopItems = [
  { item: "Classic Burger", units: 85, sales: 1_190, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=120&h=120" },
  { item: "Boneless Wings", units: 72, sales: 1_152, image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&q=80&w=120&h=120" },
  { item: "Tacos (3pc)", units: 58, sales: 725, image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=120&h=120" },
];

export const doorDashTopItems = [
  { item: "Hot Wings (12pc)", units: 95, sales: 1_900, image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&q=80&w=120&h=120" },
  { item: "Smash Burger", units: 78, sales: 1_170, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=120&h=120" },
  { item: "Loaded Fries", units: 64, sales: 384, image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=120&h=120" },
];

// ── CHANNEL SUMMARY (used across pages) ──────────────────────────────────────
export const channelSummary = [
  { channel: "Dine-In", revenue: 34_950, pct: 66, orders: 2_490, aov: 14.04, delta: 5.2 },
  { channel: "Takeaway", revenue: 10_750, pct: 20, orders: 920, aov: 11.68, delta: 8.6 },
  { channel: "Uber Eats", revenue: 3_200, pct: 6, orders: 245, aov: 13.06, delta: 8.2 },
  { channel: "DoorDash", revenue: 3_400, pct: 6.4, orders: 262, aov: 12.98, delta: 11.4 },
  { channel: "GrubHub", revenue: 850, pct: 1.6, orders: 65, aov: 13.08, delta: -2.1 },
];

export const channelDailyTrend = [
  { day: "Mon", dineIn: 4300, takeaway: 1250, uberEats: 380, doorDash: 420, grubhub: 100 },
  { day: "Tue", dineIn: 4450, takeaway: 1300, uberEats: 400, doorDash: 440, grubhub: 105 },
  { day: "Wed", dineIn: 4525, takeaway: 1320, uberEats: 420, doorDash: 430, grubhub: 98 },
  { day: "Thu", dineIn: 4680, takeaway: 1380, uberEats: 460, doorDash: 480, grubhub: 110 },
  { day: "Fri", dineIn: 5230, takeaway: 1540, uberEats: 520, doorDash: 540, grubhub: 120 },
  { day: "Sat", dineIn: 5600, takeaway: 1650, uberEats: 560, doorDash: 580, grubhub: 130 },
  { day: "Sun", dineIn: 5665, takeaway: 1600, uberEats: 540, doorDash: 560, grubhub: 125 },
];

// ── TOP STORES (used across pages) ───────────────────────────────────────────
export const topStores = [
  { id: "1", name: "Downtown", revenue: 12_200, orders: 870, aov: 14.02, margin: 44.1, delta: 7.2 },
  { id: "2", name: "Westside", revenue: 10_850, orders: 774, aov: 14.02, margin: 43.8, delta: 5.4 },
  { id: "3", name: "Hilltop", revenue: 9_450, orders: 674, aov: 14.02, margin: 41.2, delta: -1.8 },
  { id: "4", name: "Northside", revenue: 8_600, orders: 614, aov: 14.02, margin: 42.6, delta: 3.1 },
  { id: "5", name: "Airport", revenue: 7_150, orders: 510, aov: 14.02, margin: 40.9, delta: 2.0 },
];

// ── SALES ALERTS ─────────────────────────────────────────────────────────────
export const salesAlerts = [
  { id: "a1", severity: "critical" as const, title: "Hilltop revenue -6% vs target", detail: "3rd consecutive week below target. Investigate staffing & menu.", domain: "store" },
  { id: "a2", severity: "high" as const, title: "DoorDash commission costs up 12%", detail: "Third-party delivery fees eroding net margin.", domain: "channel" },
  { id: "a3", severity: "medium" as const, title: "Mozzarella Sticks declining -4%", detail: "Consistent unit decline. Consider promotion or menu removal.", domain: "item" },
  { id: "a4", severity: "medium" as const, title: "Low-Carb Beer demand +11%", detail: "Trending up fast. Ensure adequate stock.", domain: "item" },
  { id: "a5", severity: "low" as const, title: "Upsell rate below 20% at 2 locations", detail: "Airport & Hilltop below target. Training opportunity.", domain: "staff" },
];

// ── EMPLOYEE PERFORMANCE ─────────────────────────────────────────────────────
export type EmployeeRow = {
  id: string;
  name: string;
  location: string;
  role: "Server" | "Bartender" | "Cashier";
  orders: number;
  revenue: number;
  avgTicket: number;
  upsellRate: number;
  guestScore: number;
  delta: number;
};

export const employeePerformance: EmployeeRow[] = [
  { id: "e1", name: "Jordan Smith", location: "Downtown", role: "Server", orders: 1_240, revenue: 48_360, avgTicket: 39.0, upsellRate: 34, guestScore: 4.8, delta: 9.2 },
  { id: "e2", name: "Alex Rivera", location: "Westside", role: "Bartender", orders: 980, revenue: 42_140, avgTicket: 43.0, upsellRate: 48, guestScore: 4.9, delta: 11.4 },
  { id: "e3", name: "Taylor Brooks", location: "Hilltop", role: "Server", orders: 1_100, revenue: 41_800, avgTicket: 38.0, upsellRate: 29, guestScore: 4.7, delta: 6.1 },
  { id: "e4", name: "Morgan Lee", location: "Northside", role: "Server", orders: 1_020, revenue: 38_760, avgTicket: 38.0, upsellRate: 27, guestScore: 4.5, delta: -1.8 },
  { id: "e5", name: "Casey Wilson", location: "Airport", role: "Bartender", orders: 860, revenue: 37_540, avgTicket: 43.7, upsellRate: 52, guestScore: 4.9, delta: 14.2 },
  { id: "e6", name: "Riley Adams", location: "Downtown", role: "Server", orders: 890, revenue: 33_820, avgTicket: 38.0, upsellRate: 22, guestScore: 4.3, delta: -3.4 },
  { id: "e7", name: "Jamie Turner", location: "Westside", role: "Cashier", orders: 1_460, revenue: 32_120, avgTicket: 22.0, upsellRate: 18, guestScore: 4.4, delta: 2.1 },
  { id: "e8", name: "Drew Parker", location: "Hilltop", role: "Server", orders: 780, revenue: 30_420, avgTicket: 39.0, upsellRate: 31, guestScore: 4.6, delta: 4.5 },
  { id: "e9", name: "Sam Harris", location: "Northside", role: "Server", orders: 720, revenue: 28_080, avgTicket: 39.0, upsellRate: 24, guestScore: 4.5, delta: 1.9 },
  { id: "e10", name: "Quinn Murphy", location: "Airport", role: "Bartender", orders: 640, revenue: 27_520, avgTicket: 43.0, upsellRate: 44, guestScore: 4.7, delta: 7.8 },
];

// ── SALES TREND (period summary) ─────────────────────────────────────────────
export const salesTrend = [
  { day: "Mon", revenue: 7_200, orders: 510 },
  { day: "Tue", revenue: 7_550, orders: 538 },
  { day: "Wed", revenue: 7_680, orders: 548 },
  { day: "Thu", revenue: 8_010, orders: 572 },
  { day: "Fri", revenue: 8_920, orders: 637 },
  { day: "Sat", revenue: 9_450, orders: 675 },
  { day: "Sun", revenue: 9_440, orders: 674 },
];

// ── SALES KPIs for Sales Home header ─────────────────────────────────────────
export const salesKpis = {
  totalRevenue: { value: 53_250, delta: 12 },
  totalOrders: { value: 3_990, delta: 3.2 },
  avgOrderValue: { value: 13.35, delta: 1.1 },
  sameStoreSales: { value: 4.1, delta: 0.7 },
  grossMargin: { value: 42.6, delta: 1.2 },
  revenuePerSeat: { value: 184, delta: 2.4 },
};
