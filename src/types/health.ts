export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
}

export interface CycleEntry {
  id: string;
  startDate: string;
  endDate: string;
  periodLength: number;
  cycleLength?: number;
}

export interface StepEntry {
  id: string;
  date: string;
  steps: number;
}

export interface WaterEntry {
  id: string;
  date: string;
  amount: number; // in ounces
}

export interface UserSettings {
  goalWeight: number;
  averageCycleLength: number;
  averagePeriodLength: number;
}
