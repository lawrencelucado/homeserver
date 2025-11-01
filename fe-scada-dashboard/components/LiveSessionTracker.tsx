'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Play, Pause, Square, Coffee, Mic, MicOff } from 'lucide-react'

interface StudySession {
  id?: number
  startTime: Date
  endTime?: Date
  pausedAt?: Date
  totalPaused: number
  track: 'FE' | 'SCADA' | 'Both'
  topic?: string
  status: 'active' | 'paused' | 'completed'
  notes?: string
  questionCount?: number
  accuracy?: number
  breaksTaken: number
  targetMinutes?: number
}

export default function LiveSessionTracker() {
  const [session, setSession] = useState<StudySession | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [localNotes, setLocalNotes] = useState('')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const recognitionRef = useRef<any>(null)

  // Load active session on mount
  useEffect(() => {
    loadActiveSession()

    // Setup voice recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
          } else {
            interimTranscript += transcript
          }
        }

        if (finalTranscript) {
          setLocalNotes(prev => prev + finalTranscript)
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (recognitionRef.current) recognitionRef.current.stop()
    }
  }, [])

  // Timer effect
  useEffect(() => {
    if (session && session.status === 'active') {
      intervalRef.current = setInterval(() => {
        const now = new Date()
        const start = new Date(session.startTime)
        const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000) - session.totalPaused
        setElapsedSeconds(elapsed)

        // Auto-save every 30 seconds
        if (elapsed % 30 === 0) {
          autoSaveSession()
        }

        // Break reminder every 25 minutes (Pomodoro)
        if (elapsed > 0 && elapsed % (25 * 60) === 0) {
          showBreakReminder()
        }
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [session])

  // Sync notes to session
  useEffect(() => {
    if (session && localNotes !== session.notes) {
      const timer = setTimeout(() => {
        autoSaveSession()
      }, 1000) // Debounce 1 second
      return () => clearTimeout(timer)
    }
  }, [localNotes])

  const loadActiveSession = async () => {
    try {
      const response = await fetch('/api/sessions/active')
      if (response.ok) {
        const data = await response.json()
        if (data.session) {
          const sess = {
            ...data.session,
            startTime: new Date(data.session.startTime),
            endTime: data.session.endTime ? new Date(data.session.endTime) : undefined,
            pausedAt: data.session.pausedAt ? new Date(data.session.pausedAt) : undefined,
          }
          setSession(sess)
          setLocalNotes(sess.notes || '')

          // Calculate elapsed time
          const now = new Date()
          const start = new Date(sess.startTime)
          const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000) - sess.totalPaused
          setElapsedSeconds(elapsed)
        }
      }
    } catch (error) {
      console.error('Failed to load active session:', error)
    }
  }

  const startSession = async (track: 'FE' | 'SCADA' | 'Both', targetMinutes?: number) => {
    const newSession: StudySession = {
      startTime: new Date(),
      totalPaused: 0,
      track,
      status: 'active',
      breaksTaken: 0,
      targetMinutes,
    }

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSession),
      })

      if (response.ok) {
        const data = await response.json()
        setSession({
          ...data.session,
          startTime: new Date(data.session.startTime),
        })
        setElapsedSeconds(0)
        setLocalNotes('')
      }
    } catch (error) {
      console.error('Failed to start session:', error)
    }
  }

  const pauseSession = async () => {
    if (!session) return

    const updatedSession = {
      ...session,
      status: 'paused' as const,
      pausedAt: new Date(),
    }

    setSession(updatedSession)
    await saveSession(updatedSession)
  }

  const resumeSession = async () => {
    if (!session || !session.pausedAt) return

    const pausedDuration = Math.floor((new Date().getTime() - session.pausedAt.getTime()) / 1000)
    const updatedSession = {
      ...session,
      status: 'active' as const,
      pausedAt: undefined,
      totalPaused: session.totalPaused + pausedDuration,
    }

    setSession(updatedSession)
    await saveSession(updatedSession)
  }

  const stopSession = async () => {
    if (!session) return

    const updatedSession = {
      ...session,
      status: 'completed' as const,
      endTime: new Date(),
      notes: localNotes,
    }

    await saveSession(updatedSession)

    // Create a study log entry from this session
    await createStudyLogFromSession(updatedSession)

    setSession(null)
    setElapsedSeconds(0)
    setLocalNotes('')
  }

  const takeBreak = async () => {
    if (!session) return

    const updatedSession = {
      ...session,
      breaksTaken: session.breaksTaken + 1,
      status: 'paused' as const,
      pausedAt: new Date(),
    }

    setSession(updatedSession)
    await saveSession(updatedSession)

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Break Time! 🌟', {
        body: 'Take 5 minutes to rest. You deserve it!',
        icon: '/icon.png',
      })
    }

    // Auto-resume after 5 minutes
    setTimeout(() => {
      if (session?.status === 'paused') {
        resumeSession()
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Break Over! 📚', {
            body: 'Ready to continue studying?',
            icon: '/icon.png',
          })
        }
      }
    }, 5 * 60 * 1000) // 5 minutes
  }

  const autoSaveSession = async () => {
    if (!session) return

    const updatedSession = {
      ...session,
      notes: localNotes,
    }

    await saveSession(updatedSession, false) // Silent save
  }

  const saveSession = async (sessionData: StudySession, showNotification = true) => {
    if (!sessionData.id) return

    try {
      const response = await fetch(`/api/sessions/${sessionData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      })

      if (response.ok && showNotification) {
        // Could show a toast notification here
      }
    } catch (error) {
      console.error('Failed to save session:', error)
    }
  }

  const createStudyLogFromSession = async (sessionData: StudySession) => {
    const hours = elapsedSeconds / 3600

    try {
      await fetch('/api/study-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date(),
          track: sessionData.track,
          hours: Math.round(hours * 100) / 100,
          topic: sessionData.topic,
          notes: sessionData.notes,
          questionCount: sessionData.questionCount,
          accuracy: sessionData.accuracy,
        }),
      })
    } catch (error) {
      console.error('Failed to create study log:', error)
    }
  }

  const showBreakReminder = () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Time for a break? ☕', {
          body: "You've been studying for 25 minutes. Consider taking a 5-minute break!",
          icon: '/icon.png',
        })
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission()
      }
    }
  }

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice input not supported in this browser. Try Chrome or Edge.')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = () => {
    if (!session?.targetMinutes) return 0
    const targetSeconds = session.targetMinutes * 60
    return Math.min((elapsedSeconds / targetSeconds) * 100, 100)
  }

  return (
    <Card className="border-green-900/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>⏱️ Live Study Session</span>
          {session && (
            <span className="text-sm font-normal text-neutral-400">
              {session.track} {session.topic && `· ${session.topic}`}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!session ? (
          /* Start Session Form */
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Study Track</Label>
                <Select onValueChange={(value) => {
                  const track = value as 'FE' | 'SCADA' | 'Both'
                  startSession(track, 25)
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select track" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FE">FE Civil</SelectItem>
                    <SelectItem value="SCADA">SCADA Engineering</SelectItem>
                    <SelectItem value="Both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Target Duration</Label>
                <Select defaultValue="25">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="25">25 minutes (Pomodoro)</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={() => startSession('FE', 25)}
            >
              <Play className="mr-2 h-5 w-5" />
              Start Study Session
            </Button>
          </div>
        ) : (
          /* Active Session Display */
          <div className="space-y-4">
            {/* Timer Display */}
            <div className="text-center">
              <div className="text-5xl font-mono font-bold text-green-400">
                {formatTime(elapsedSeconds)}
              </div>
              {session.targetMinutes && (
                <div className="mt-2">
                  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600 transition-all duration-1000"
                      style={{ width: `${getProgressPercentage()}%` }}
                    />
                  </div>
                  <p className="text-sm text-neutral-400 mt-1">
                    {session.targetMinutes} minute goal · {session.breaksTaken} breaks taken
                  </p>
                </div>
              )}
            </div>

            <Separator />

            {/* Session Controls */}
            <div className="grid grid-cols-4 gap-2">
              {session.status === 'active' ? (
                <Button
                  variant="outline"
                  className="col-span-1"
                  onClick={pauseSession}
                >
                  <Pause className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="col-span-1 border-green-600"
                  onClick={resumeSession}
                >
                  <Play className="h-4 w-4" />
                </Button>
              )}

              <Button
                variant="outline"
                className="col-span-1"
                onClick={takeBreak}
              >
                <Coffee className="h-4 w-4" />
              </Button>

              <Button
                variant="destructive"
                className="col-span-2"
                onClick={stopSession}
              >
                <Square className="mr-2 h-4 w-4" />
                End Session
              </Button>
            </div>

            {/* Notes Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Session Notes</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleVoiceInput}
                  className={isListening ? 'text-red-500' : ''}
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-4 w-4 mr-1" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-1" />
                      Voice
                    </>
                  )}
                </Button>
              </div>
              <textarea
                className="w-full min-h-[100px] rounded-md border border-neutral-800 bg-neutral-950 p-3 text-sm"
                placeholder="What are you learning? (Auto-saves)"
                value={localNotes}
                onChange={(e) => setLocalNotes(e.target.value)}
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-lg bg-neutral-900 p-2">
                <div className="text-neutral-400">Hours</div>
                <div className="font-semibold">{(elapsedSeconds / 3600).toFixed(2)}</div>
              </div>
              <div className="rounded-lg bg-neutral-900 p-2">
                <div className="text-neutral-400">Status</div>
                <div className="font-semibold capitalize">{session.status}</div>
              </div>
              <div className="rounded-lg bg-neutral-900 p-2">
                <div className="text-neutral-400">Track</div>
                <div className="font-semibold">{session.track}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
