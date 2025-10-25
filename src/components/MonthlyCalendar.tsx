import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { WeightEntry, StepEntry, WaterEntry, CycleEntry } from '../types/health';

interface MonthlyCalendarProps {
  weights: WeightEntry[];
  steps: StepEntry[];
  water: WaterEntry[];
  cycles: CycleEntry[];
  onAddWeight: (weight: number, date: string) => void;
  onAddSteps: (steps: number, date: string) => void;
  onAddWater: (amount: number, date: string) => void;
  onAddCycle: (startDate: string, endDate: string) => void;
}

export function MonthlyCalendar({
  weights,
  steps,
  water,
  cycles,
  onAddWeight,
  onAddSteps,
  onAddWater,
  onAddCycle,
}: MonthlyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form states
  const [weightValue, setWeightValue] = useState('');
  const [stepsValue, setStepsValue] = useState('');
  const [waterValue, setWaterValue] = useState('');
  const [cycleStartDate, setCycleStartDate] = useState('');
  const [cycleEndDate, setCycleEndDate] = useState('');

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatDate = (day: number) => {
    return new Date(year, month, day).toISOString().split('T')[0];
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const getDataForDate = (day: number) => {
    const dateStr = formatDate(day);
    return {
      weight: weights.find(w => w.date === dateStr),
      steps: steps.find(s => s.date === dateStr),
      water: water.find(w => w.date === dateStr),
      isPeriod: cycles.some(c => {
        const start = new Date(c.startDate);
        const end = new Date(c.endDate);
        const current = new Date(dateStr);
        return current >= start && current <= end;
      }),
    };
  };

  const handleDayClick = (day: number) => {
    const dateStr = formatDate(day);
    setSelectedDate(dateStr);
    
    // Pre-fill existing data
    const data = getDataForDate(day);
    setWeightValue(data.weight?.weight.toString() || '');
    setStepsValue(data.steps?.steps.toString() || '');
    setWaterValue(data.water?.amount.toString() || '');
    setCycleStartDate('');
    setCycleEndDate('');
    
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!selectedDate) return;

    if (weightValue) {
      onAddWeight(parseFloat(weightValue), selectedDate);
    }
    if (stepsValue) {
      onAddSteps(parseInt(stepsValue), selectedDate);
    }
    if (waterValue) {
      onAddWater(parseFloat(waterValue), selectedDate);
    }
    if (cycleStartDate && cycleEndDate) {
      onAddCycle(cycleStartDate, cycleEndDate);
    }

    setIsDialogOpen(false);
    setWeightValue('');
    setStepsValue('');
    setWaterValue('');
    setCycleStartDate('');
    setCycleEndDate('');
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {monthNames[month]} {year}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {dayNames.map(day => (
              <div
                key={day}
                className="text-center py-2 text-muted-foreground"
              >
                {day}
              </div>
            ))}

            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const data = getDataForDate(day);
              const today = isToday(day);

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`
                    aspect-square p-2 rounded-lg border-2 transition-all relative
                    hover:border-primary hover:shadow-md
                    ${today ? 'border-primary bg-primary/5' : 'border-border'}
                  `}
                >
                  <div className="h-full flex flex-col">
                    <span className={`${today ? 'font-bold' : ''}`}>
                      {day}
                    </span>
                    <div className="flex-1 flex items-center justify-center gap-1 mt-1">
                      {data.weight && (
                        <div className="w-2 h-2 rounded-full bg-purple-500" title="Weight logged" />
                      )}
                      {data.steps && (
                        <div className="w-2 h-2 rounded-full bg-amber-500" title="Steps logged" />
                      )}
                      {data.water && (
                        <div className="w-2 h-2 rounded-full bg-blue-500" title="Water logged" />
                      )}
                      {data.isPeriod && (
                        <div className="w-2 h-2 rounded-full bg-red-500" title="Period day" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-muted-foreground">Weight</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">Steps</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">Water</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-muted-foreground">Period</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Log Data for {selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </DialogTitle>
            <DialogDescription>
              Add or update health data for this day
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="metrics" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="cycle">Cycle</TabsTrigger>
            </TabsList>

            <TabsContent value="metrics" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={weightValue}
                  onChange={(e) => setWeightValue(e.target.value)}
                  placeholder="Enter weight"
                />
              </div>

              <div>
                <Label htmlFor="steps">Steps</Label>
                <Input
                  id="steps"
                  type="number"
                  value={stepsValue}
                  onChange={(e) => setStepsValue(e.target.value)}
                  placeholder="Enter steps"
                />
              </div>

              <div>
                <Label htmlFor="water">Water (oz)</Label>
                <Input
                  id="water"
                  type="number"
                  step="0.1"
                  value={waterValue}
                  onChange={(e) => setWaterValue(e.target.value)}
                  placeholder="Enter water intake"
                />
              </div>

              <Button onClick={handleSave} className="w-full">
                Save Metrics
              </Button>
            </TabsContent>

            <TabsContent value="cycle" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="cycleStart">Period Start Date</Label>
                <Input
                  id="cycleStart"
                  type="date"
                  value={cycleStartDate}
                  onChange={(e) => setCycleStartDate(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="cycleEnd">Period End Date</Label>
                <Input
                  id="cycleEnd"
                  type="date"
                  value={cycleEndDate}
                  onChange={(e) => setCycleEndDate(e.target.value)}
                />
              </div>

              <Button onClick={handleSave} className="w-full">
                Save Cycle
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
