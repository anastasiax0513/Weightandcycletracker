import { WeightEntry, CycleEntry } from '../types/health';

export function calculateWeightTrend(entries: WeightEntry[]): number {
  if (entries.length < 2) return 0;
  
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Calculate linear regression
  const n = sortedEntries.length;
  const dates = sortedEntries.map(e => new Date(e.date).getTime());
  const weights = sortedEntries.map(e => e.weight);
  
  const sumX = dates.reduce((a, b) => a + b, 0);
  const sumY = weights.reduce((a, b) => a + b, 0);
  const sumXY = dates.reduce((sum, x, i) => sum + x * weights[i], 0);
  const sumXX = dates.reduce((sum, x) => sum + x * x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  
  // Convert slope from per millisecond to per day
  return slope * 24 * 60 * 60 * 1000;
}

export function estimateDaysToGoal(
  currentWeight: number,
  goalWeight: number,
  dailyTrend: number
): number | null {
  if (dailyTrend === 0) return null;
  
  const difference = goalWeight - currentWeight;
  const days = Math.ceil(Math.abs(difference / dailyTrend));
  
  // Check if trend is in the right direction
  if ((difference > 0 && dailyTrend < 0) || (difference < 0 && dailyTrend > 0)) {
    return null;
  }
  
  return days;
}

export function predictNextPeriod(cycles: CycleEntry[]): Date | null {
  if (cycles.length === 0) return null;
  
  const sortedCycles = [...cycles].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
  
  const lastCycle = sortedCycles[0];
  
  // Calculate average cycle length
  const cycleLengths = sortedCycles.slice(0, -1).map((cycle, i) => {
    const nextCycle = sortedCycles[i + 1];
    if (!nextCycle) return null;
    
    const diff = new Date(cycle.startDate).getTime() - new Date(nextCycle.startDate).getTime();
    return Math.round(diff / (24 * 60 * 60 * 1000));
  }).filter(Boolean) as number[];
  
  const avgCycleLength = cycleLengths.length > 0
    ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
    : 28;
  
  const nextPeriodDate = new Date(lastCycle.startDate);
  nextPeriodDate.setDate(nextPeriodDate.getDate() + avgCycleLength);
  
  return nextPeriodDate;
}

export function calculateOvulationDate(periodStartDate: Date, avgCycleLength: number = 28): Date {
  const ovulationDate = new Date(periodStartDate);
  // Ovulation typically occurs 14 days before the next period
  ovulationDate.setDate(ovulationDate.getDate() + (avgCycleLength - 14));
  return ovulationDate;
}

export function getPredictedPeriodLength(cycles: CycleEntry[]): number {
  if (cycles.length === 0) return 5;
  
  const avgLength = cycles.reduce((sum, cycle) => sum + cycle.periodLength, 0) / cycles.length;
  return Math.round(avgLength);
}

export function shouldShowPeriodAlert(predictedDate: Date | null): boolean {
  if (!predictedDate) return false;
  
  const now = new Date();
  const timeDiff = predictedDate.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);
  
  // Show alert if predicted date is within 24 hours
  return hoursDiff > 0 && hoursDiff <= 24;
}
