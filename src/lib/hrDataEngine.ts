import { HrFilter } from "./hrFilterContext";

// Math invariants as requested:
// Total Tips Collected (42,530) = Cash Tips (11,755) + Card Tips (30,775)
// Unplanned OT (32 hours) within Labor Cost OT (704 MTD)
// Cost per Labor Hour (17.76), Revenue per Labor Hour (54.23)

const hrData = {
  kpis: {
    laborCostPct: 34.2,
    activeHeadcount: 52, // From home dashboard view
    activeHeadcountTotal: 227, // From workforce overview
    attendanceRate: 92.5,
    lateClockInRate: 8.3,
    scheduleVsActual: 6.8, // percent variance
    avgTicketTime: 5.5, // minutes
    
    // Overview KPIs
    avgTenureYrs: 1.8,
    newHires30d: 28,
    openPositions: 12,

    // Labor Prod KPIs
    revenuePerLaborHour: 54.23,
    costPerLaborHour: 17.76,
    
    // Derived total cost based on RPLH and CPLH (If CPLH is 17.76 and RPLH is 54.23 -> Labor is ~32.8% of Revenue)
    laborCostProdPct: 32.8, 
    
    // Scheduling
    staffingLevels: 96,
    variancePct: 4.1,
    accuracyScore: 92,
    unplannedOtShifts: 14,
    shiftCoverageStatus: 68,
    unplannedOtHours: 32,
    laborCostOtHoursMtd: 704,

    // Reliability
    lateClockIns: 6,
    missedPunches: 2,
    lateClockInRateAlt: 6.8, // Specific to attendance view
    earlyClockOutRate: 2.4,
    missedPunchRate: 3.5,

    // Compliance
    complianceRiskScore: 72,
    breakComplianceRate: 89,
    overtimeViolations: 12,
    tipPoolAllocAccuracy: 96,

    // Payroll
    payrollAdjFrequency: 8,
    // Note: adjusting cost per hour slightly for Payroll view as requested (16.78)
    payrollCostPerLaborHour: 16.78, 
    totalTipsCollected: 42530,
    cashTips: 11755,
    cardTips: 30775,
    tipDistVariance: 4.6,

    // Hiring
    timeToFillDays: 13,
    offerAcceptanceRate: 68,
    onboardingCompletion: 74,

    // Role Performance
    roleAvgTicketTimeStr: "11:32",
    ticketsPerLaborHour: 5.4,
    checkAvgPerServer: 32.50,
    laborRoiIndex: 4.5,
    
    // Idle Labor
    idleLaborCost: 4517,
    idleLaborHours: 258,
  }
};

export function getHrKpis(filters: HrFilter) {
  // We can apply minor variations based on dateRange or store if needed,
  // but for the sake of strict mock data consistency, we'll return the core payload.
  return { ...hrData.kpis };
}

// Add more data getters here as we build out the 9 views...
