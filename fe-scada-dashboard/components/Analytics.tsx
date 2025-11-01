import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import StudyHeatmap from './StudyHeatmap';

interface AnalyticsProps {
  dayTotals: any[];
  cumulativeWeekly: any[];
  allTimeTotals: any[];
  weeklyTrend: any[];
  byDateTotal: Record<string, number>;
}

const Analytics: React.FC<AnalyticsProps> = ({
  dayTotals,
  cumulativeWeekly,
  allTimeTotals,
  weeklyTrend,
  byDateTotal,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Daily stacked bar */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">Daily Hours (This Week)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayTotals}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="FE" stackId="a" />
                <Bar dataKey="SCADA" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      {/* Cumulative line */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">Cumulative Hours (This Week)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cumulativeWeekly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Hours" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      {/* Pie chart */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">Study Time Distribution (All Time)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={allTimeTotals} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                  {allTimeTotals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#82ca9d' : '#8884d8'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      {/* Weekly trend */}
      <Card className="md:col-span-2">
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">Weekly Hours Trend (Last 12 Weeks)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Hours" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      {/* Heatmap */}
      <Card className="md:col-span-2">
        <CardContent className="p-4 space-y-2">
          <p className="font-semibold">Study Heatmap (Last Year)</p>
          <StudyHeatmap data={byDateTotal} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;