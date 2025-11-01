import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WEEKS_PLAN } from '@/lib/plan';

const WeeklyPlan: React.FC = () => {
  return (
    <div className="space-y-6">
      {WEEKS_PLAN.map((week) => (
        <Card key={week.week}>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold">{`Week ${week.week}: ${week.theme}`}</h3>
            <p className="text-sm text-muted-foreground">🎯 {week.goal}</p>
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  {['fe_focus', 'scada_focus', 'integration_task', 'task', 'focus', 'deliverable'].map(header => {
                    if (week.daily_goals.some(goal => (goal as any)[header])) {
                      return <TableHead key={header}>{header.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</TableHead>;
                    }
                    return null;
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {week.daily_goals.map((goal: any) => (
                  <TableRow key={goal.day}>
                    <TableCell>{goal.day}</TableCell>
                    {['fe_focus', 'scada_focus', 'integration_task', 'task', 'focus', 'deliverable'].map(header => {
                      if (week.daily_goals.some(g => (g as any)[header])) {
                        return <TableCell key={header}>{(goal as any)[header] || ''}</TableCell>;
                      }
                      return null;
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WeeklyPlan;