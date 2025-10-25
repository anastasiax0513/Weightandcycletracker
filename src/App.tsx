import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { WeightTracker } from './components/WeightTracker';
import { CycleTracker } from './components/CycleTracker';
import { StepsTracker } from './components/StepsTracker';
import { WaterTracker } from './components/WaterTracker';
import { ComparisonChart } from './components/ComparisonChart';
import { MonthlyCalendar } from './components/MonthlyCalendar';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { PWAHead } from './components/PWAHead';
import { useLocalStorage } from './hooks/useLocalStorage';
import { WeightEntry, CycleEntry, StepEntry, WaterEntry } from './types/health';
import { Activity, Scale, Calendar, Droplets, TrendingUp, CalendarDays } from 'lucide-react';
import { registerServiceWorker } from './utils/registerServiceWorker';

function App() {
  // Register service worker for PWA
  useEffect(() => {
    registerServiceWorker();
  }, []);
  const [weights, setWeights] = useLocalStorage<WeightEntry[]>('health-weights', []);
  const [cycles, setCycles] = useLocalStorage<CycleEntry[]>('health-cycles', []);
  const [steps, setSteps] = useLocalStorage<StepEntry[]>('health-steps', []);
  const [water, setWater] = useLocalStorage<WaterEntry[]>('health-water', []);
  const [goalWeight, setGoalWeight] = useLocalStorage<number>('health-goal-weight', 150);
  const [weightUnit, setWeightUnit] = useLocalStorage<'lbs' | 'kg'>('health-weight-unit', 'lbs');

  const handleAddWeight = (weight: number, date: string) => {
    // Check if entry for this date already exists
    const existingIndex = weights.findIndex(w => w.date === date);
    
    if (existingIndex >= 0) {
      const updatedWeights = [...weights];
      updatedWeights[existingIndex] = {
        ...updatedWeights[existingIndex],
        weight,
      };
      setWeights(updatedWeights);
      toast.success('Weight updated successfully');
    } else {
      const newEntry: WeightEntry = {
        id: Date.now().toString(),
        date,
        weight,
      };
      setWeights([...weights, newEntry]);
      toast.success('Weight logged successfully');
    }
  };

  const handleUpdateGoal = (goal: number) => {
    setGoalWeight(goal);
    toast.success('Goal weight updated');
  };

  const handleAddCycle = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const periodLength = Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1;

    const newEntry: CycleEntry = {
      id: Date.now().toString(),
      startDate,
      endDate,
      periodLength,
    };
    setCycles([...cycles, newEntry]);
    toast.success('Cycle logged successfully');
  };

  const handleAddSteps = (stepCount: number, date: string) => {
    // Check if entry for this date already exists
    const existingIndex = steps.findIndex(s => s.date === date);
    
    if (existingIndex >= 0) {
      const updatedSteps = [...steps];
      updatedSteps[existingIndex] = {
        ...updatedSteps[existingIndex],
        steps: stepCount,
      };
      setSteps(updatedSteps);
      toast.success('Steps updated successfully');
    } else {
      const newEntry: StepEntry = {
        id: Date.now().toString(),
        date,
        steps: stepCount,
      };
      setSteps([...steps, newEntry]);
      toast.success('Steps logged successfully');
    }
  };

  const handleAddWater = (amount: number, date: string) => {
    // Check if entry for this date already exists
    const existingIndex = water.findIndex(w => w.date === date);
    
    if (existingIndex >= 0) {
      const updatedWater = [...water];
      updatedWater[existingIndex] = {
        ...updatedWater[existingIndex],
        amount,
      };
      setWater(updatedWater);
      toast.success('Water intake updated successfully');
    } else {
      const newEntry: WaterEntry = {
        id: Date.now().toString(),
        date,
        amount,
      };
      setWater([...water, newEntry]);
      toast.success('Water intake logged successfully');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PWAHead />
      <div className="container mx-auto p-3 sm:p-6 max-w-7xl">
        <div className="mb-4 sm:mb-8">
          <h1 className="mb-2">Health Tracker</h1>
          <p className="text-muted-foreground">
            Track your weight, menstrual cycle, and daily activity
          </p>
        </div>

        <Tabs defaultValue="calendar" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-6 h-auto">
            <TabsTrigger value="calendar" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3">
              <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="weight" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3">
              <Scale className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Weight</span>
            </TabsTrigger>
            <TabsTrigger value="cycle" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Cycle</span>
            </TabsTrigger>
            <TabsTrigger value="steps" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Steps</span>
            </TabsTrigger>
            <TabsTrigger value="water" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3">
              <Droplets className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Water</span>
            </TabsTrigger>
            <TabsTrigger value="compare" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Compare</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <MonthlyCalendar
              weights={weights}
              steps={steps}
              water={water}
              cycles={cycles}
              onAddWeight={handleAddWeight}
              onAddSteps={handleAddSteps}
              onAddWater={handleAddWater}
              onAddCycle={handleAddCycle}
            />
          </TabsContent>

          <TabsContent value="weight">
            <WeightTracker
              weights={weights}
              goalWeight={goalWeight}
              weightUnit={weightUnit}
              onAddWeight={handleAddWeight}
              onUpdateGoal={handleUpdateGoal}
              onToggleUnit={() => setWeightUnit(weightUnit === 'lbs' ? 'kg' : 'lbs')}
            />
          </TabsContent>

          <TabsContent value="cycle">
            <CycleTracker
              cycles={cycles}
              onAddCycle={handleAddCycle}
            />
          </TabsContent>

          <TabsContent value="steps">
            <StepsTracker
              steps={steps}
              onAddSteps={handleAddSteps}
            />
          </TabsContent>

          <TabsContent value="water">
            <WaterTracker
              water={water}
              onAddWater={handleAddWater}
            />
          </TabsContent>

          <TabsContent value="compare">
            <ComparisonChart
              weights={weights}
              steps={steps}
              water={water}
              cycles={cycles}
            />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
      <PWAInstallPrompt />
    </div>
  );
}

export default App;
