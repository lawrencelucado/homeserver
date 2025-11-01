import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Timer } from "lucide-react";

interface PomodoroProps {
  pomoMins: number;
  setPomoMins: (value: number) => void;
  isRunning: boolean;
  setIsRunning: (value: boolean) => void;
  secondsLeft: number;
  autoBreaks: boolean;
  setAutoBreaks: (value: boolean) => void;
  phase: 'focus' | 'break';
  setPhase: (value: 'focus' | 'break') => void;
  setSecondsLeft: (value: number) => void;
}

const Pomodoro: React.FC<PomodoroProps> = ({
  pomoMins,
  setPomoMins,
  isRunning,
  setIsRunning,
  secondsLeft,
  autoBreaks,
  setAutoBreaks,
  phase,
  setPhase,
  setSecondsLeft,
}) => {
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(Math.floor(secondsLeft % 60)).padStart(2, '0');

  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold"><Timer className="inline-block h-4 w-4 mr-2" />Pomodoro</p>
          <Select value={String(pomoMins)} onValueChange={(v) => setPomoMins(parseInt(v))}>
            <SelectTrigger className="h-8 w-28"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25 min</SelectItem>
              <SelectItem value="45">45 min</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-3xl font-mono text-center">{mm}:{ss}</div>
        <div className="flex items-center justify-center gap-2">
          <Button size="sm" onClick={() => setIsRunning(true)} disabled={isRunning}>Start</Button>
          <Button size="sm" variant="secondary" onClick={() => setIsRunning(false)}>Pause</Button>
          <Button size="sm" variant="ghost" onClick={() => { setIsRunning(false); setPhase('focus'); setSecondsLeft(pomoMins * 60) }}>Reset</Button>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <Switch checked={autoBreaks} onCheckedChange={setAutoBreaks} />
            <span className="text-xs text-muted-foreground">Auto 5-min breaks</span>
          </div>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">{phase}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Pomodoro;