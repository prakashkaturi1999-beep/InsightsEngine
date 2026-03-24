import { CustomerFilter } from "./customerFilterContext";

export type CustomerProfile = {
  id: string;
  name: string;
  ltv: number;
  avgSpent: number;
  visitFreqStr: string;
  status: "VIP" | "Regular" | "New" | "At-Risk";
  channel: string;
  store: string;
  lastVisitDaysAgo: number;
};

// --- MOCK INVARIANTS & STRICT RULES ---
// Rule 1: Active Customers (18,200) >= Repeat (11,284), At-Risk (1,456), Routine (8,500), VIP (2,925)
// Rule 2: Repeat Rate % (62%) = Repeat (11,284) / Active (18,200)
// Rule 3: At-Risk % (8%) = At-Risk (1,456) / Active (18,200)
// Rule 4: New % (12%) = New (5,400) / Total (45,000)
// Rule 5: VIP Share % (6.5%) = VIP (2,925) / Total (45,000)
// Rule 6: Multi-Channel % (6%) = Multi-Channel (2,700) / Total (45,000)
// Rule 7: Cross-Store Customers (1,200) <= Active (18,200)
// Rule 10: Financial alignment (Avg LTV $420 * 45k total = $18.9M lifetime revenue alignment)

const CORE_METRICS = {
  totalCustomers: 45000,
  activeCustomers: 18200,
  newCustomers: 5400,
  repeatCustomers: 11284,
  atRiskCustomers: 1456,
  routineCustomers: 8500,
  vipCount: 2925,
  multiChannelCustomers: 2700,
  crossStoreCustomers: 1200,
  topChannelRevenue: 6450000, // Matches $18.9M LTV scale
};

// Derived precisely by math rules to guarantee 0 drift.
const DERIVED_METRICS = {
  repeatRatePct: Number(((CORE_METRICS.repeatCustomers / CORE_METRICS.activeCustomers) * 100).toFixed(1)), // ~62.0%
  atRiskPct: Number(((CORE_METRICS.atRiskCustomers / CORE_METRICS.activeCustomers) * 100).toFixed(1)), // ~8.0%
  newPct: Number(((CORE_METRICS.newCustomers / CORE_METRICS.totalCustomers) * 100).toFixed(1)), // 12.0%
  vipSharePct: Number(((CORE_METRICS.vipCount / CORE_METRICS.totalCustomers) * 100).toFixed(1)), // 6.5%
  multiChannelPct: Number(((CORE_METRICS.multiChannelCustomers / CORE_METRICS.totalCustomers) * 100).toFixed(1)), // 6.0%
  
  avgVisit: 3.4,
  avgLtv: 420.50,
  activeChangeAbs: 1240, // vs last month
  activeAvgAov: 34.50,
};

// Consistent Customer Identifiers (Rule 9)
export const SHARED_TOP_CUSTOMERS: CustomerProfile[] = [
  { id: "CUST-001", name: "Sarah Jenkins", ltv: 4250, avgSpent: 62.10, visitFreqStr: "3.2/mo", status: "VIP", channel: "Dine-In", store: "Downtown (001)", lastVisitDaysAgo: 2 },
  { id: "CUST-002", name: "Marcus Thompson", ltv: 3804, avgSpent: 48.50, visitFreqStr: "2.8/mo", status: "VIP", channel: "Delivery", store: "Westside (003)", lastVisitDaysAgo: 5 },
  { id: "CUST-003", name: "Emily Chen", ltv: 1240, avgSpent: 31.20, visitFreqStr: "1.1/mo", status: "At-Risk", channel: "Takeaway", store: "Uptown (002)", lastVisitDaysAgo: 42 },
  { id: "CUST-004", name: "David Wright", ltv: 120, avgSpent: 120.00, visitFreqStr: "1.0/mo", status: "New", channel: "Dine-In", store: "Downtown (001)", lastVisitDaysAgo: 4 },
  { id: "CUST-005", name: "Jessica Albes", ltv: 2980, avgSpent: 55.40, visitFreqStr: "2.5/mo", status: "VIP", channel: "Dine-In", store: "Uptown (002)", lastVisitDaysAgo: 1 },
  { id: "CUST-006", name: "Brian O'Conner", ltv: 980, avgSpent: 42.10, visitFreqStr: "1.5/mo", status: "At-Risk", channel: "Third-Party", store: "Westside (003)", lastVisitDaysAgo: 55 },
  { id: "CUST-007", name: "Alicia Keys", ltv: 2200, avgSpent: 38.00, visitFreqStr: "1.9/mo", status: "Regular", channel: "Dine-In", store: "Downtown (001)", lastVisitDaysAgo: 12 },
  { id: "CUST-008", name: "Tom Hanks", ltv: 1850, avgSpent: 44.50, visitFreqStr: "1.8/mo", status: "Regular", channel: "Delivery", store: "Uptown (002)", lastVisitDaysAgo: 18 },
];

export function getCustomerKpis(filters: CustomerFilter) {
  return { ...CORE_METRICS, ...DERIVED_METRICS };
}
