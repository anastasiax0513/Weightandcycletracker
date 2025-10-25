import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Plus, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { StepEntry } from '../types/health';

interface StepsTrackerProps {
  steps: StepEntry[];
  onAddSteps: (steps: number, date: string) => void;
}

export function StepsTracker({ steps, onAddSteps }: StepsTrackerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newSteps, setNewSteps] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);

  const sortedSteps = [...steps].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const chartData = sortedSteps.slice(-14).map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    steps: entry.steps,
  }));

  const avgSteps = steps.length > 0
    ? Math.round(steps.reduce((sum, entry) => sum + entry.steps, 0) / steps.length)
    : 0;

  const totalSteps = steps.reduce((sum, entry) => sum + entry.steps, 0);

  const todaySteps = sortedSteps.find(
    entry => entry.date === new Date().toISOString().split('T')[0]
  )?.steps || 0;

  const goalSteps = 10000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSteps && newDate) {
      onAddSteps(parseInt(newSteps), newDate);
      setNewSteps('');
      setNewDate(new Date().toISOString().split('T')[0]);
      setIsOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Steps Tracker</CardTitle>
            <CardDescription>Monitor your daily step count</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Steps
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Steps</DialogTitle>
                <DialogDescription>Enter your step count for the day</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="steps">Steps</Label>
                  <Input
                    id="steps"
                    type="number"
                    value={newSteps}
                    onChange={(e) => setNewSteps(e.target.value)}
                    placeholder="Enter step count"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Activity className="h-4 w-4" />
              <span>Today</span>
            </div>
            <div>{todaySteps.toLocaleString()} steps</div>
            <div className="text-muted-foreground mt-1">
              {((todaySteps / goalSteps) * 100).toFixed(0)}% of goal
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Activity className="h-4 w-4" />
              <span>Average</span>
            </div>
            <div>{avgSteps.toLocaleString()} steps</div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Activity className="h-4 w-4" />
              <span>Total</span>
            </div>
            <div>{totalSteps.toLocaleString()} steps</div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Activity className="h-4 w-4" />
              <span>Goal</span>
            </div>
            <div>{goalSteps.toLocaleString()} steps</div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="steps" fill="#8b5cf6" name="Steps" />
              <ReferenceLine y={goalSteps} stroke="#22c55e" strokeDasharray="5 5" label="Goal" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="mb-4">Recent Activity</h3>
          <div className="space-y-2">
            {sortedSteps.length === 0 ? (
              <p className="text-muted-foreground">No steps logged yet</p>
            ) : (
              sortedSteps.slice(-7).reverse().map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div>
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          weekday: 'short',
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{entry.steps.toLocaleString()}</span>
                    <span className="text-muted-foreground">steps</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
