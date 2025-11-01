'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Book, Cpu, CalendarDays, BarChart3, ChevronDown, Timer, Bell, Sparkles, Smartphone, Download, CheckSquare } from "lucide-react"
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
} from 'recharts'
import StudyHeatmap from './StudyHeatmap';
import { DailyProgress } from '@/lib/plan';
import WeeklyPlan from './WeeklyPlan';
import Analytics from './Analytics';
import LogForm from './LogForm';
import Pomodoro from './Pomodoro';
import LiveSessionTracker from './LiveSessionTracker';
import StudyCoach from './StudyCoach';

// Type definitions
interface LARStatus {
  learn: boolean
  apply: boolean
  reinforce: boolean
}

interface LARNotes {
  learn: string
  apply: string
  reinforce: string
}

interface DayLARChecks {
  FE: LARStatus
  SCADA: LARStatus
}

interface DayLARNotes {
  FE: LARNotes
  SCADA: LARNotes
}

interface LogEntry {
  date: string
  track: 'FE' | 'SCADA'
  hours: number
  note?: string
}

interface Settings {
  weeklyGoal: number
  notifyOn: boolean
  reminderTime: string
}

// --- Local helper to join class names (avoid external deps)
function cn(...classes: (string | boolean | undefined | null)[]) { return classes.filter(Boolean).join(' ') }

// ----------------- Date helpers -----------------
function startOfWeek(d: Date) {
  const date = new Date(d)
  const day = (date.getDay() + 6) % 7 // Mon=0..Sun=6
  date.setDate(date.getDate() - day)
  date.setHours(0, 0, 0, 0)
  return date
}
function addDays(d: Date, n: number) { 
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}
function subDays(d: Date, n: number) {
  const x = new Date(d)
  x.setDate(x.getDate() - n)
  return x
}
function ymd(d: Date) { return new Date(d).toISOString().slice(0, 10) }
function formatRange(a: Date, b: Date) {
  const fmt = (dt: Date) => dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  return `${fmt(a)} – ${fmt(b)}`
}
function getISOWeek(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dayNum = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

// Weak areas for smart suggestions
const FE_WEAK_AREAS = ['Geotechnical', 'Materials', 'Dynamics'];

export default function FeScadaDeluxeDashboard() {
  const [activeView, setActiveView] = useState('plan');

  // ----------------- Core state -----------------
  const [feProgress, setFeProgress] = useState<number>(0)
  const [scadaProgress, setScadaProgress] = useState<number>(0)
  const [logs, setLogs] = useState<LogEntry[]>([])

  const [settings, setSettings] = useState<Settings>({ weeklyGoal: 12, notifyOn: false, reminderTime: '20:30' })

  // simple persistence versioning for future migrations
  const STATE_VERSION = 3



  // week navigation (0=current, -1=prev, +1=next)
  const [weekOffset, setWeekOffset] = useState(0)
  // import CSV ref
  const fileRef = useRef<HTMLInputElement>(null)
  // current track for Pomodoro auto-log
  const [pomoTrack, setPomoTrack] = useState<'FE' | 'SCADA'>('FE')



  // form inputs
  const [logDate, setLogDate] = useState(ymd(new Date()))
  const [logTrack, setLogTrack] = useState<'FE' | 'SCADA'>('FE')
  const [logHours, setLogHours] = useState('1.0')
  const [logNote, setLogNote] = useState('')

  // ----------------- LocalStorage persistence -----------------
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fe_scada_state_v1')
      if (saved) {
        const parsed = JSON.parse(saved)
        setLogs(parsed.logs ?? [])
        setFeProgress(parsed.feProgress ?? 0)
        setScadaProgress(parsed.scadaProgress ?? 0)
        setSettings(parsed.settings ?? { weeklyGoal: 12, notifyOn: false, reminderTime: '20:30' })
      }
    } catch {}
  }, [])

  useEffect(() => {
    const payload = { logs, feProgress, scadaProgress, settings, version: STATE_VERSION }
    try { localStorage.setItem('fe_scada_state_v1', JSON.stringify(payload)) } catch {}
  }, [logs, feProgress, scadaProgress, settings])

  // ----------------- Add log -----------------
  const addLog = () => {
    const h = parseFloat(logHours)
    if (!logDate || isNaN(h) || h <= 0) return
    setLogs(prev => [...prev, { date: logDate, track: logTrack as 'FE' | 'SCADA', hours: h, note: logNote || undefined }])
    setLogNote('')
  }

  // ----------------- Time windows -----------------
  const weekStart = useMemo(() => startOfWeek(addDays(new Date(), weekOffset * 7)), [weekOffset])
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart])

  // ----------------- Aggregations -----------------
  const dayTotals = useMemo(() => {
    const map: Record<string, { day: string; FE: number; SCADA: number; Total: number }> = {}
    for (const d of weekDays) {
      const key = ymd(d)
      map[key] = { day: d.toLocaleDateString(undefined, { weekday: 'short' }), FE: 0, SCADA: 0, Total: 0 }
    }
    for (const l of logs) {
      if (l.date in map) {
        map[l.date][l.track] += l.hours
        map[l.date].Total += l.hours
      }
    }
    return weekDays.map(d => map[ymd(d)])
  }, [logs, weekDays])

  const cumulativeWeekly = useMemo(() => {
    let sum = 0
    return dayTotals.map((d) => ({ day: d.day, Hours: (sum += d.Total) }))
  }, [dayTotals])

  // Last 12 weeks for trend & heatmap
  const weeksBack = 12
  const daysBack = weeksBack * 7
  const lastN = Array.from({ length: daysBack }, (_, i) => ymd(subDays(new Date(), daysBack - 1 - i)))
  const byDateTotal = useMemo(() => {
    const map: Record<string, number> = {}
    for (const d of lastN) map[d] = 0
    for (const l of logs) if (l.date in map) map[l.date] += l.hours
    return map
  }, [logs])

  const weeklyTrend = useMemo(() => {
    const out = []
    let cursor = subDays(startOfWeek(new Date()), (weeksBack - 1) * 7)
    for (let w = 0; w < weeksBack; w++) {
      const start = addDays(cursor, w * 7)
      let sum = 0
      for (let d = 0; d < 7; d++) sum += byDateTotal[ymd(addDays(start, d))] || 0
      out.push({ label: start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), Hours: sum })
    }
    return out
  }, [byDateTotal])

  const allTimeTotals = useMemo(() => {
    const totals = { FE: 0, SCADA: 0 };
    for (const log of logs) {
      totals[log.track] += log.hours;
    }
    return [
      { name: 'FE', value: totals.FE },
      { name: 'SCADA', value: totals.SCADA },
    ];
  }, [logs]);

  const totalThisWeek = dayTotals.reduce((acc, d) => acc + d.Total, 0)
  const totalFE = dayTotals.reduce((acc, d) => acc + d.FE, 0)
  const totalSCADA = dayTotals.reduce((acc, d) => acc + d.SCADA, 0)
  const goalPct = Math.min(100, (totalThisWeek / settings.weeklyGoal) * 100)

  // Planned vs actual helpers
  const currentDayIdx = useMemo(() => {
    const today = new Date()
    if (today < weekStart || today > addDays(weekStart, 6)) return -1
    return Math.floor((today.getTime() - weekStart.getTime()) / (1000*60*60*24))
  }, [weekStart])



  // ----------------- Smart suggestions -----------------
  const suggestion = useMemo(() => {
    const weak = FE_WEAK_AREAS[(getISOWeek(new Date()) + Math.abs(weekOffset)) % FE_WEAK_AREAS.length]
    if (totalFE < Math.max(6, 0.6 * totalThisWeek)) {
      return `Focus FE → ${weak} today (Learn → Apply → Reinforce).`
    }
    if (totalSCADA < 4) return 'Add 60–90 min SCADA: create 5 Ignition tags & 1 alarm.'
    return 'Balanced week. Do a 30‑min mixed quiz or polish your SCADA mini‑project.'
  }, [totalFE, totalThisWeek, totalSCADA, weekOffset])

  // ----------------- Pomodoro timer -----------------
  const [pomoMins, setPomoMins] = useState(25)
  const [isRunning, setIsRunning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(pomoMins * 60)
  const [autoBreaks, setAutoBreaks] = useState(true)
  const intervalRef = useRef<number | null>(null)
  const [phase, setPhase] = useState<'focus' | 'break'>('focus')

  useEffect(() => { setSecondsLeft(pomoMins * 60) }, [pomoMins])

  useEffect(() => {
    if (!isRunning) return
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          try { new Audio("data:audio/wav;base64,UklGRhIAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABYAAAABAQAA").play() } catch {}
          if (("Notification" in window) && Notification.permission === 'granted' && settings.notifyOn) {
            new Notification(phase === 'focus' ? 'Focus complete — add a log?' : 'Break over — back to focus')
          }
          if (phase === 'focus') {
            const add = window.confirm(`Add ${(pomoMins/60).toFixed(2)}h to ${pomoTrack} for ${ymd(new Date())}?`)
            if (add) {
              setLogs(prev => [...prev, { date: ymd(new Date()), track: pomoTrack, hours: pomoMins/60, note: 'Pomodoro auto-log' }])
            }
          }
          if (autoBreaks) {
            const nextPhase = phase === 'focus' ? 'break' : 'focus'
            setPhase(nextPhase)
            return (nextPhase === 'focus' ? pomoMins * 60 : 5 * 60)
          } else {
            setIsRunning(false)
            return 0
          }
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (intervalRef.current) window.clearInterval(intervalRef.current) }
  }, [isRunning, autoBreaks, phase, pomoMins, settings.notifyOn, pomoTrack])

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(Math.floor(secondsLeft % 60)).padStart(2, '0')

  // ----------------- Notifications permission & daily reminder -----------------
  useEffect(() => {
    if (!settings.notifyOn) return
    if (!('Notification' in window)) return
    if (Notification.permission === 'default') Notification.requestPermission()
  }, [settings.notifyOn])

  useEffect(() => {
    if (!settings.notifyOn) return
    const id = window.setInterval(() => {
      const now = new Date()
      const hh = String(now.getHours()).padStart(2, '0')
      const mm = String(now.getMinutes()).padStart(2, '0')
      const cur = `${hh}:${mm}`
      if (cur === settings.reminderTime) {
        if (("Notification" in window) && Notification.permission === 'granted') {
          new Notification('Study reminder', { body: 'Do Learn → Apply → Reinforce (25 min).' })
        }
      }
    }, 60 * 1000)
    return () => window.clearInterval(id)
  }, [settings.notifyOn, settings.reminderTime])

  // ----------------- CSV export / import -----------------
  const exportCSV = () => {
    const header = 'date,track,hours,note\n'
    const rows = logs.map(l => `${l.date},${l.track},${l.hours},${(l.note||'').replace(/,/g,';')}`).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'fe-scada-study-log.csv'
    a.click()
    URL.revokeObjectURL(url)
  }
  const importCSV = async (file: File | undefined) => {
    if (!file) return
    const text = await file.text()
    const lines = text.trim().split(/\r?\n/)
    const out: LogEntry[] = []
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',')
      if (parts.length < 3) continue
      const [date, track, hours, ...rest] = parts
      const h = parseFloat(hours)
      if (!date || isNaN(h)) continue
      const note = rest.join(',')
      out.push({ date, track: (track === 'SCADA' ? 'SCADA' : 'FE') as 'FE' | 'SCADA', hours: h, note })
    }
    if (out.length) setLogs(prev => [...prev, ...out])
    if (fileRef.current) fileRef.current.value = ''
  }



  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">📘 FE + ⚙️ SCADA — Deluxe Study Dashboard</h1>
          <p className="text-xs md:text-sm text-muted-foreground">Week: {formatRange(weekStart, addDays(weekStart, 6))}</p>
          <div className="flex items-center gap-2 mt-1">
            <Button size="sm" variant="outline" onClick={() => setWeekOffset(w => w - 1)}>◀ Prev</Button>
            <Button size="sm" variant="outline" onClick={() => setWeekOffset(0)}>This Week</Button>
            <Button size="sm" variant="outline" onClick={() => setWeekOffset(w => w + 1)}>Next ▶</Button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground"><Smartphone className="h-4 w-4" />Mobile-friendly</div>
          <div className="flex items-center gap-2">
            <Label className="text-xs"><Bell className="inline-block h-4 w-4 mr-1" />Notifications</Label>
            <Switch checked={settings.notifyOn} onCheckedChange={(v) => setSettings(s => ({ ...s, notifyOn: v }))} />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs">Remind at</Label>
            <Input className="h-8 w-24" type="time" value={settings.reminderTime} onChange={e => setSettings(s => ({ ...s, reminderTime: e.target.value }))} />
          </div>
          <Select value={pomoTrack} onValueChange={(v) => setPomoTrack(v as 'FE' | 'SCADA')}>
            <SelectTrigger className="h-8 w-36"><SelectValue placeholder="Pomodoro track" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="FE">Pomodoro → FE</SelectItem>
              <SelectItem value="SCADA">Pomodoro → SCADA</SelectItem>
            </SelectContent>
          </Select>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => importCSV(e.target.files?.[0])} />
          <Button variant="secondary" size="sm" onClick={exportCSV}><Download className="h-4 w-4 mr-2" />Export CSV</Button>
          <Button size="sm" onClick={() => fileRef.current?.click()}>Import CSV</Button>
        </div>
      </header>

      {/* Top Navigation */}
      <div className="flex justify-center gap-4 mb-4">
        <Button onClick={() => setActiveView('coach')} variant={activeView === 'coach' ? 'default' : 'outline'}>🤖 AI Coach</Button>
        <Button onClick={() => setActiveView('session')} variant={activeView === 'session' ? 'default' : 'outline'}>⏱️ Live Session</Button>
        <Button onClick={() => setActiveView('plan')} variant={activeView === 'plan' ? 'default' : 'outline'}>Weekly Plan</Button>
        <Button onClick={() => setActiveView('analytics')} variant={activeView === 'analytics' ? 'default' : 'outline'}>Analytics</Button>
        <Button onClick={() => setActiveView('log')} variant={activeView === 'log' ? 'default' : 'outline'}>Log</Button>
      </div>

      {/* Main Content */}
      <div>
        {activeView === 'coach' && (
          <StudyCoach />
        )}
        {activeView === 'session' && (
          <LiveSessionTracker />
        )}
        {activeView === 'plan' && (
          <WeeklyPlan />
        )}
        {activeView === 'analytics' && (
          <Analytics
            dayTotals={dayTotals}
            cumulativeWeekly={cumulativeWeekly}
            allTimeTotals={allTimeTotals}
            weeklyTrend={weeklyTrend}
            byDateTotal={byDateTotal}
          />
        )}
        {activeView === 'log' && (
          <LogForm
            logDate={logDate}
            setLogDate={setLogDate}
            logTrack={logTrack}
            setLogTrack={setLogTrack}
            logHours={logHours}
            setLogHours={setLogHours}
            logNote={logNote}
            setLogNote={setLogNote}
            addLog={addLog}
            setLogs={setLogs}
          />
        )}
      </div>
    </div>
  )
}
