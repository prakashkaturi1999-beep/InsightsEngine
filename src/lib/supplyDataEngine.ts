import { SupplyFilter } from "./supplyFilterContext";

export function getSupplyKpis(filter: SupplyFilter) {
  // --- INVENTORY CORE METRICS ---
  const currentInventoryValue = 125400;
  const currentInventoryUnits = 15200;
  
  const incomingValue = 73200;
  const incomingUnits = 8500;

  const outgoingValue = 20700;
  const outgoingUnits = 9200;

  // Rule 4 constraint mapping
  const netInventoryFlowUnits = 1300; 
  const netInventoryFlowValue = 6200; 

  const daysOfCover = 20;

  // --- ORDERS / CONSUMPTION METRICS ---
  // Math Invariant Rule 1: Meat ($1,680) + Veg ($630) + Bar ($630) + Supplies ($260) + Dry Goods ($600) = $3,800
  const consumptionTodayValue = 3800; // 1680 + 630 + 630 + 260 + 600
  const consumptionTodayUnits = 620;

  const varianceValue = 1380; // Expected vs Actual

  // --- RISK & EXPOSURE METRICS ---
  const stockoutRiskValue = 26000;
  const expiryRiskValue = 12400;
  const overstockRiskValue = 18400; // Overstock risk
  
  // Rule 6: Total Risk Value = Stockout + Expiry + Overstock
  const totalRiskValue = stockoutRiskValue + expiryRiskValue + overstockRiskValue; 

  // --- HEALTH SCORE METRICS ---
  const understockValue = 26000; // mirrors stockout risk
  const healthyStockValue = 81000;
  // Rule 8: Understock + Healthy + Overstock = Total Value Health
  const totalValueHealth = understockValue + healthyStockValue + overstockRiskValue; // $125,400

  return {
    // Inventory Overarching
    currentValue: currentInventoryValue,
    currentUnits: currentInventoryUnits,
    incomingValue,
    incomingUnits,
    outgoingValue,
    outgoingUnits,
    netFlowValue: netInventoryFlowValue,
    netFlowUnits: netInventoryFlowUnits,
    daysOfCover,
    totalItems: 325,

    // Orders Overarching
    consumptionTodayValue,
    consumptionTodayUnits,
    sevenDayTrend: 9.7, // %
    spikeTrend: 18, // %
    varianceValue,
    
    // Risks & Health
    stockoutRiskValue,
    expiryRiskValue,
    overstockRiskValue,
    totalRiskValue,
    healthScore: 72,

    totalValueHealth,
    understockValue,
    healthyStockValue,
  };
}

export const CATEGORY_CONSUMPTION_TODAY = [
  { category: "Meat", value: 1680, units: 120 },
  { category: "Veg", value: 630, units: 190 },
  { category: "Bar", value: 630, units: 110 },
  { category: "Dry Goods", value: 600, units: 150 },
  { category: "Supplies", value: 260, units: 50 },
]; // Precisely sums to $3,800 and 620 units.

export const SHARED_INVENTORY_ITEMS = [
  { id: "INV-101", name: "Premium Ground Beef", category: "Meat", onHand: 420, onHandValue: 4200, avgDailyUsage: 35, daysCover: 12, status: "Healthy" },
  { id: "INV-102", name: "Chicken Breast", category: "Meat", onHand: 150, onHandValue: 850, avgDailyUsage: 50, daysCover: 3, status: "Stockout Risk", reorderRec: 90 },
  { id: "INV-201", name: "Avocados (Case)", category: "Veg", onHand: 8, onHandValue: 320, avgDailyUsage: 4, daysCover: 2, status: "Stockout Risk", reorderRec: 15 },
  { id: "INV-202", name: "Romaine Hearts", category: "Veg", onHand: 45, onHandValue: 675, avgDailyUsage: 3, daysCover: 15, status: "Healthy" },
  { id: "INV-301", name: "IPA Keg (50L)", category: "Bar", onHand: 10, onHandValue: 1500, avgDailyUsage: 2, daysCover: 5, status: "Stockout Risk", reorderRec: 50 },
  { id: "INV-401", name: "Cooking Oil (35lb)", category: "Dry Goods", onHand: 24, onHandValue: 1080, avgDailyUsage: 3, daysCover: 8, status: "Low Cover" },
  { id: "INV-501", name: "Napkins (Case)", category: "Supplies", onHand: 120, onHandValue: 3600, avgDailyUsage: 2, daysCover: 60, status: "Overstock" },
];
