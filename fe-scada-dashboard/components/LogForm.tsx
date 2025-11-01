import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LogFormProps {
  logDate: string;
  setLogDate: (value: string) => void;
  logTrack: 'FE' | 'SCADA';
  setLogTrack: (value: 'FE' | 'SCADA') => void;
  logHours: string;
  setLogHours: (value: string) => void;
  logNote: string;
  setLogNote: (value: string) => void;
  addLog: () => void;
  setLogs: (value: any) => void; // I should use a proper type here
}

const LogForm: React.FC<LogFormProps> = ({
  logDate,
  setLogDate,
  logTrack,
  setLogTrack,
  logHours,
  setLogHours,
  logNote,
  setLogNote,
  addLog,
  setLogs,
}) => {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <p className="font-semibold">Add Study Log</p>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" value={logDate} onChange={e => setLogDate(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Track</Label>
          <Select value={logTrack} onValueChange={(v) => setLogTrack(v as 'FE' | 'SCADA')}>
            <SelectTrigger>
              <SelectValue placeholder="Choose track" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FE">FE</SelectItem>
              <SelectItem value="SCADA">SCADA</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="hours">Hours</Label>
          <Input id="hours" type="number" step="0.5" min="0" value={logHours} onChange={e => setLogHours(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="note">Note (optional)</Label>
          <Input id="note" type="text" placeholder="What did you do?" value={logNote} onChange={e => setLogNote(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Button onClick={addLog}>Log Hours</Button>
          <Button variant="secondary" onClick={() => setLogs([])}>Clear Logs</Button>
        </div>
        <p className="text-xs text-muted-foreground">Log after each block. Analytics, suggestions, and goal progress update automatically.</p>
      </CardContent>
    </Card>
  );
};

export default LogForm;