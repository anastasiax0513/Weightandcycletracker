import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Scatter, ScatterChart, ZAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { WeightEntry, StepEntry, WaterEntry, CycleEntry } from '../types/health';
import { calculateOvulationDate } from '../utils/calculations';

interface ComparisonChartProps {
  weights: WeightEntry[];
  steps: StepEntry[];
  water: WaterEntry[];
  cycles: CycleEntry[];
}

export function ComparisonChart({ weights, steps, water, cycles }: ComparisonChartProps) {
  const [selectedMetrics, setSelectedMetrics] = useState({
    weight: true,
    steps: false,
    water: false,
    ovulation: false,
    periodLength: false,
  });

  // Calculate ovulation dates and period lengths
  const getOvulationDates = () => {
    const sortedCycles = [...cycles].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    
    const cycleLengths = sortedCycles.slice(1).map((cycle, i) => {
      const prevCycle = sortedCycles[i];
      const diff = new Date(cycle.startDate).getTime() - new Date(prevCycle.startDate).getTime();
      return Math.round(diff / (24 * 60 * 60 * 1000));
    });
    
    const avgCycleLength = cycleLengths.length > 0
      ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
      : 28;
    
    return sortedCycles.map(cycle => {
      const ovulationDate = calculateOvulationDate(new Date(cycle.startDate), avgCycleLength);
      return {
        date: ovulationDate.toISOString().split('T')[0],
        cycleStart: cycle.startDate,
      };
    });
  };

  const ovulationDates = getOvulationDates();

  // Normalize data to a common date range
  const getAllDates = () => {
    const dates = new Set<string>();
    weights.forEach(w => dates.add(w.date));
    steps.forEach(s => dates.add(s.date));
    water.forEach(w => dates.add(w.date));
    cycles.forEach(c => dates.add(c.startDate));
    ovulationDates.forEach(o => dates.add(o.date));
    return Array.from(dates).sort();
  };

  const allDates = getAllDates();

  // Create a map for quick lookup
  const weightMap = new Map(weights.map(w => [w.date, w.weight]));
  const stepsMap = new Map(steps.map(s => [s.date, s.steps]));
  const waterMap = new Map(water.map(w => [w.date, w.amount]));
  const ovulationMap = new Map(ovulationDates.map(o => [o.date, true]));
  const periodLengthMap = new Map(cycles.map(c => [c.startDate, c.periodLength]));

  // Normalize values to 0-100 scale for comparison
  const normalizeValue = (value: number, min: number, max: number) => {
    if (max === min) return 50;
    return ((value - min) / (max - min)) * 100;
  };

  const weightValues = weights.map(w => w.weight);
  const stepValues = steps.map(s => s.steps);
  const waterValues = water.map(w => w.amount);
  const periodLengthValues = cycles.map(c => c.periodLength);

  const weightMin = Math.min(...weightValues, Infinity);
  const weightMax = Math.max(...weightValues, -Infinity);
  const stepsMin = Math.min(...stepValues, Infinity);
  const stepsMax = Math.max(...stepValues, -Infinity);
  const waterMin = Math.min(...waterValues, Infinity);
  const waterMax = Math.max(...waterValues, -Infinity);
  const periodLengthMin = Math.min(...periodLengthValues, Infinity);
  const periodLengthMax = Math.max(...periodLengthValues, -Infinity);

  const chartData = allDates.map(date => {
    const data: any = {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: date,
    };

    const weight = weightMap.get(date);
    const stepCount = stepsMap.get(date);
    const waterAmount = waterMap.get(date);
    const isOvulation = ovulationMap.get(date);
    const periodLength = periodLengthMap.get(date);

    if (weight !== undefined) {
      data.weightRaw = weight;
      data.weight = normalizeValue(weight, weightMin, weightMax);
    }

    if (stepCount !== undefined) {
      data.stepsRaw = stepCount;
      data.steps = normalizeValue(stepCount, stepsMin, stepsMax);
    }

    if (waterAmount !== undefined) {
      data.waterRaw = waterAmount;
      data.water = normalizeValue(waterAmount, waterMin, waterMax);
    }

    if (isOvulation) {
      data.ovulation = 100; // Fixed high value for visibility
      data.ovulationRaw = 'Ovulation';
    }

    if (periodLength !== undefined) {
      data.periodLengthRaw = periodLength;
      data.periodLength = normalizeValue(periodLength, periodLengthMin, periodLengthMax);
    }

    return data;
  }).filter(d => 
    (selectedMetrics.weight && d.weight !== undefined) ||
    (selectedMetrics.steps && d.steps !== undefined) ||
    (selectedMetrics.water && d.water !== undefined) ||
    (selectedMetrics.ovulation && d.ovulation !== undefined) ||
    (selectedMetrics.periodLength && d.periodLength !== undefined)
  );

  const toggleMetric = (metric: keyof typeof selectedMetrics) => {
    setSelectedMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric],
    }));
  };

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="mb-2">{label}</p>
          {payload.map((entry: any, index: number) => {
            let rawValue = '';
            let unit = '';
            
            if (entry.dataKey === 'weight') {
              rawValue = entry.payload.weightRaw?.toFixed(1);
              unit = 'lbs';
            } else if (entry.dataKey === 'steps') {
              rawValue = entry.payload.stepsRaw?.toLocaleString();
              unit = 'steps';
            } else if (entry.dataKey === 'water') {
              rawValue = entry.payload.waterRaw?.toFixed(1);
              unit = 'oz';
            } else if (entry.dataKey === 'ovulation') {
              rawValue = entry.payload.ovulationRaw;
              unit = '';
            } else if (entry.dataKey === 'periodLength') {
              rawValue = entry.payload.periodLengthRaw?.toString();
              unit = 'days';
            }

            return (
              <p key={index} style={{ color: entry.color }}>
                {entry.name}: {rawValue} {unit}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparison Chart</CardTitle>
        <CardDescription>Compare multiple health metrics over time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="weight-metric" 
              checked={selectedMetrics.weight}
              onCheckedChange={() => toggleMetric('weight')}
            />
            <Label htmlFor="weight-metric" className="cursor-pointer">
              Weight
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="steps-metric" 
              checked={selectedMetrics.steps}
              onCheckedChange={() => toggleMetric('steps')}
            />
            <Label htmlFor="steps-metric" className="cursor-pointer">
              Steps
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="water-metric" 
              checked={selectedMetrics.water}
              onCheckedChange={() => toggleMetric('water')}
            />
            <Label htmlFor="water-metric" className="cursor-pointer">
              Water
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="ovulation-metric" 
              checked={selectedMetrics.ovulation}
              onCheckedChange={() => toggleMetric('ovulation')}
            />
            <Label htmlFor="ovulation-metric" className="cursor-pointer">
              Ovulation Dates
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="periodLength-metric" 
              checked={selectedMetrics.periodLength}
              onCheckedChange={() => toggleMetric('periodLength')}
            />
            <Label htmlFor="periodLength-metric" className="cursor-pointer">
              Period Length
            </Label>
          </div>
        </div>

        {!selectedMetrics.weight && !selectedMetrics.steps && !selectedMetrics.water && !selectedMetrics.ovulation && !selectedMetrics.periodLength ? (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            Select at least one metric to display
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            No data available for selected metrics
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis 
                  label={{ value: 'Normalized Value (0-100)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={customTooltip} />
                <Legend />
                
                {selectedMetrics.weight && (
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Weight"
                    connectNulls
                  />
                )}
                
                {selectedMetrics.steps && (
                  <Line 
                    type="monotone" 
                    dataKey="steps" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Steps"
                    connectNulls
                  />
                )}
                
                {selectedMetrics.water && (
                  <Line 
                    type="monotone" 
                    dataKey="water" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Water"
                    connectNulls
                  />
                )}
                
                {selectedMetrics.ovulation && (
                  <Line 
                    type="monotone" 
                    dataKey="ovulation" 
                    stroke="#10b981" 
                    strokeWidth={0}
                    dot={{ r: 8, fill: '#10b981' }}
                    name="Ovulation"
                    connectNulls={false}
                  />
                )}
                
                {selectedMetrics.periodLength && (
                  <Line 
                    type="monotone" 
                    dataKey="periodLength" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Period Length"
                    connectNulls
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="p-4 bg-muted rounded-lg">
          <p className="text-muted-foreground">
            <strong>Note:</strong> Values are normalized to a 0-100 scale for comparison. Hover over data points to see actual values.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="mb-2">Weight Range</div>
            <div className="text-muted-foreground">
              {weightMin !== Infinity && weightMax !== -Infinity
                ? `${weightMin.toFixed(1)} - ${weightMax.toFixed(1)} lbs`
                : 'No data'}
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="mb-2">Steps Range</div>
            <div className="text-muted-foreground">
              {stepsMin !== Infinity && stepsMax !== -Infinity
                ? `${stepsMin.toLocaleString()} - ${stepsMax.toLocaleString()} steps`
                : 'No data'}
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="mb-2">Water Range</div>
            <div className="text-muted-foreground">
              {waterMin !== Infinity && waterMax !== -Infinity
                ? `${waterMin.toFixed(1)} - ${waterMax.toFixed(1)} oz`
                : 'No data'}
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="mb-2">Ovulation Dates</div>
            <div className="text-muted-foreground">
              {ovulationDates.length > 0
                ? `${ovulationDates.length} recorded`
                : 'No data'}
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="mb-2">Period Length Range</div>
            <div className="text-muted-foreground">
              {periodLengthMin !== Infinity && periodLengthMax !== -Infinity
                ? `${periodLengthMin} - ${periodLengthMax} days`
                : 'No data'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
