import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Plus, Droplets } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { WaterEntry } from '../types/health';

interface WaterTrackerProps {
  water: WaterEntry[];
  onAddWater: (amount: number, date: string) => void;
}

export function WaterTracker({ water, onAddWater }: WaterTrackerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newAmount, setNewAmount] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);

  const sortedWater = [...water].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const chartData = sortedWater.slice(-14).map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    water: entry.amount,
  }));

  const avgWater = water.length > 0
    ? Math.round(water.reduce((sum, entry) => sum + entry.amount, 0) / water.length)
    : 0;

  const todayWater = sortedWater.find(
    entry => entry.date === new Date().toISOString().split('T')[0]
  )?.amount || 0;

  const goalWater = 64; // 64 oz = 8 cups

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAmount && newDate) {
      onAddWater(parseFloat(newAmount), newDate);
      setNewAmount('');
      setNewDate(new Date().toISOString().split('T')[0]);
      setIsOpen(false);
    }
  };

  const quickAdd = (amount: number) => {
    const today = new Date().toISOString().split('T')[0];
    const existing = sortedWater.find(entry => entry.date === today);
    const currentAmount = existing?.amount || 0;
    onAddWater(currentAmount + amount, today);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Water Intake</CardTitle>
            <CardDescription>Track your daily hydration</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Log Water
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Water Intake</DialogTitle>
                <DialogDescription>Enter your water intake in ounces</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount (oz)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.1"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="Enter amount"
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
              <Droplets className="h-4 w-4" />
              <span>Today</span>
            </div>
            <div>{todayWater} oz</div>
            <div className="text-muted-foreground mt-1">
              {((todayWater / goalWater) * 100).toFixed(0)}% of goal
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Droplets className="h-4 w-4" />
              <span>Average</span>
            </div>
            <div>{avgWater} oz</div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Droplets className="h-4 w-4" />
              <span>Goal</span>
            </div>
            <div>{goalWater} oz</div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Droplets className="h-4 w-4" />
              <span>In Cups</span>
            </div>
            <div>{(todayWater / 8).toFixed(1)} cups</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => quickAdd(8)} variant="outline" className="flex-1">
            <Droplets className="mr-2 h-4 w-4" />
            +8 oz
          </Button>
          <Button onClick={() => quickAdd(16)} variant="outline" className="flex-1">
            <Droplets className="mr-2 h-4 w-4" />
            +16 oz
          </Button>
          <Button onClick={() => quickAdd(32)} variant="outline" className="flex-1">
            <Droplets className="mr-2 h-4 w-4" />
            +32 oz
          </Button>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="water" fill="#3b82f6" name="Water (oz)" />
              <ReferenceLine y={goalWater} stroke="#22c55e" strokeDasharray="5 5" label="Goal" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="mb-4">Recent Activity</h3>
          <div className="space-y-2">
            {sortedWater.length === 0 ? (
              <p className="text-muted-foreground">No water intake logged yet</p>
            ) : (
              sortedWater.slice(-7).reverse().map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Droplets className="h-4 w-4 text-muted-foreground" />
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
                    <span>{entry.amount}</span>
                    <span className="text-muted-foreground">oz ({(entry.amount / 8).toFixed(1)} cups)</span>
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
