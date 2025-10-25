import { useState, useEffect } from 'react';
import { Plus, Calendar as CalendarIcon, Circle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { CycleEntry } from '../types/health';
import { predictNextPeriod, calculateOvulationDate, getPredictedPeriodLength, shouldShowPeriodAlert } from '../utils/calculations';

interface CycleTrackerProps {
  cycles: CycleEntry[];
  onAddCycle: (startDate: string, endDate: string) => void;
}

export function CycleTracker({ cycles, onAddCycle }: CycleTrackerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const predictedNextPeriod = predictNextPeriod(cycles);
  const predictedPeriodLength = getPredictedPeriodLength(cycles);
  
  const sortedCycles = [...cycles].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

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

  const predictedOvulation = predictedNextPeriod 
    ? calculateOvulationDate(predictedNextPeriod, avgCycleLength)
    : null;

  useEffect(() => {
    const shouldShow = shouldShowPeriodAlert(predictedNextPeriod);
    setShowAlert(shouldShow);
  }, [predictedNextPeriod]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      onAddCycle(startDate, endDate);
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
      setIsOpen(false);
    }
  };

  const getDaysUntil = (date: Date | null) => {
    if (!date) return null;
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    return Math.ceil(diff / (24 * 60 * 60 * 1000));
  };

  const daysUntilPeriod = getDaysUntil(predictedNextPeriod);
  const daysUntilOvulation = getDaysUntil(predictedOvulation);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cycle Tracker</CardTitle>
            <CardDescription>Track your menstrual cycle and predictions</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Log Period
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Period</DialogTitle>
                <DialogDescription>Enter the start and end dates of your period</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Save</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showAlert && (
          <Alert>
            <CalendarIcon className="h-4 w-4" />
            <AlertTitle>Period Alert</AlertTitle>
            <AlertDescription>
              Your period is predicted to start within the next 24 hours.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CalendarIcon className="h-4 w-4" />
              <span>Next Period</span>
            </div>
            <div>
              {predictedNextPeriod 
                ? predictedNextPeriod.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Not available'}
            </div>
            {daysUntilPeriod !== null && (
              <div className="text-muted-foreground mt-1">
                {daysUntilPeriod > 0 ? `in ${daysUntilPeriod} days` : 'Today or passed'}
              </div>
            )}
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Circle className="h-4 w-4" />
              <span>Predicted Ovulation</span>
            </div>
            <div>
              {predictedOvulation 
                ? predictedOvulation.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Not available'}
            </div>
            {daysUntilOvulation !== null && (
              <div className="text-muted-foreground mt-1">
                {daysUntilOvulation > 0 ? `in ${daysUntilOvulation} days` : 'Passed'}
              </div>
            )}
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CalendarIcon className="h-4 w-4" />
              <span>Avg. Cycle Length</span>
            </div>
            <div>{avgCycleLength} days</div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CalendarIcon className="h-4 w-4" />
              <span>Avg. Period Length</span>
            </div>
            <div>{predictedPeriodLength} days</div>
          </div>
        </div>

        <div>
          <h3 className="mb-4">Recent Cycles</h3>
          <div className="space-y-2">
            {sortedCycles.length === 0 ? (
              <p className="text-muted-foreground">No cycles logged yet</p>
            ) : (
              sortedCycles.slice(0, 5).map((cycle) => (
                <div key={cycle.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div>
                        {new Date(cycle.startDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })} - {new Date(cycle.endDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                      <div className="text-muted-foreground">
                        {cycle.periodLength} days
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {predictedNextPeriod && predictedOvulation && (
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="mb-3">Cycle Calendar</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span>Period: {predictedNextPeriod.toLocaleDateString()} - {
                  new Date(predictedNextPeriod.getTime() + predictedPeriodLength * 24 * 60 * 60 * 1000).toLocaleDateString()
                }</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span>Ovulation: {predictedOvulation.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>Fertile Window: {
                  new Date(predictedOvulation.getTime() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString()
                } - {
                  new Date(predictedOvulation.getTime() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString()
                }</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
