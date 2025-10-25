import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Plus, TrendingDown, TrendingUp, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { WeightEntry } from '../types/health';
import { calculateWeightTrend, estimateDaysToGoal } from '../utils/calculations';

interface WeightTrackerProps {
  weights: WeightEntry[];
  goalWeight: number;
  weightUnit: 'lbs' | 'kg';
  onAddWeight: (weight: number, date: string) => void;
  onUpdateGoal: (goal: number) => void;
  onToggleUnit: () => void;
}

// Conversion functions
const lbsToKg = (lbs: number) => lbs * 0.453592;
const kgToLbs = (kg: number) => kg * 2.20462;

const convertWeight = (weight: number, fromUnit: 'lbs' | 'kg', toUnit: 'lbs' | 'kg') => {
  if (fromUnit === toUnit) return weight;
  if (fromUnit === 'lbs' && toUnit === 'kg') return lbsToKg(weight);
  return kgToLbs(weight);
};

export function WeightTracker({ weights, goalWeight, weightUnit, onAddWeight, onUpdateGoal, onToggleUnit }: WeightTrackerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [goalInput, setGoalInput] = useState(goalWeight.toString());

  // All weights are stored in lbs, convert for display
  const displayWeight = (lbs: number) => convertWeight(lbs, 'lbs', weightUnit);
  const displayGoalWeight = displayWeight(goalWeight);

  const sortedWeights = [...weights].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const chartData = sortedWeights.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: displayWeight(entry.weight),
    goal: displayGoalWeight,
  }));

  const currentWeight = sortedWeights.length > 0 ? sortedWeights[sortedWeights.length - 1].weight : 0;
  const dailyTrend = calculateWeightTrend(weights);
  const daysToGoal = estimateDaysToGoal(currentWeight, goalWeight, dailyTrend);
  const displayCurrentWeight = displayWeight(currentWeight);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWeight && newDate) {
      // Convert input weight to lbs for storage
      const weightValue = parseFloat(newWeight);
      const weightInLbs = weightUnit === 'kg' ? kgToLbs(weightValue) : weightValue;
      onAddWeight(weightInLbs, newDate);
      setNewWeight('');
      setNewDate(new Date().toISOString().split('T')[0]);
      setIsOpen(false);
    }
  };

  const handleGoalUpdate = (newGoalValue: number) => {
    // Convert input goal to lbs for storage
    const goalInLbs = weightUnit === 'kg' ? kgToLbs(newGoalValue) : newGoalValue;
    if (goalInLbs > 0) {
      onUpdateGoal(goalInLbs);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-end gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="unit-toggle" className="text-sm">lbs</Label>
            <Switch 
              id="unit-toggle"
              checked={weightUnit === 'kg'}
              onCheckedChange={onToggleUnit}
            />
            <Label htmlFor="unit-toggle" className="text-sm">kg</Label>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Weight
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Weight</DialogTitle>
                <DialogDescription>Enter your weight for today</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="weight">Weight ({weightUnit})</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="Enter weight"
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
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-muted-foreground mb-1">Current Weight</div>
            <div>{currentWeight > 0 ? `${displayCurrentWeight.toFixed(1)} ${weightUnit}` : 'No data'}</div>
          </div>
          
          <div>
            <div className="text-muted-foreground mb-1">Goal Weight</div>
            <div>{displayGoalWeight.toFixed(1)} {weightUnit}</div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                const newGoal = prompt(`Enter new goal weight (${weightUnit}):`, displayGoalWeight.toFixed(1));
                if (newGoal) {
                  const goal = parseFloat(newGoal);
                  if (goal > 0) handleGoalUpdate(goal);
                }
              }}
              className="mt-1 h-6 px-2"
            >
              Edit
            </Button>
          </div>
          
          <div>
            <div className="text-muted-foreground mb-1">Est. Time to Goal</div>
            <div>
              {daysToGoal !== null 
                ? `${daysToGoal} days`
                : 'N/A'}
            </div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -30, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis domain={['dataMin - 5', 'dataMax + 5']} axisLine={false} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Weight"
              />
              <ReferenceLine 
                y={displayGoalWeight} 
                stroke="#22c55e" 
                strokeDasharray="5 5" 
                label="Goal"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
