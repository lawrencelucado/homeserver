'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Brain, Send, Sparkles, BookOpen, Target, Lightbulb, Mic, MicOff, RefreshCw } from 'lucide-react'

interface Message {
  id: number
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

interface StudyStats {
  totalHours: number
  feHours: number
  scadaHours: number
  avgAccuracy: number
  weakTopics: string[]
  recentSessions: number
}

export default function StudyCoach() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [stats, setStats] = useState<StudyStats | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  // Load conversation history and stats
  useEffect(() => {
    loadConversationHistory()
    loadStudyStats()

    // Setup voice recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop()
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadConversationHistory = async () => {
    try {
      const response = await fetch('/api/coach/conversations?limit=50')
      if (response.ok) {
        const data = await response.json()
        setMessages(data.conversations.map((c: any, idx: number) => ({
          id: c.id || idx,
          role: c.role,
          content: c.content,
          timestamp: new Date(c.createdAt),
        })))
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error)
    }
  }

  const loadStudyStats = async () => {
    try {
      const response = await fetch('/api/coach/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to load study stats:', error)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          stats,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: Message = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error('Failed to get response')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
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

  const getQuickAction = async (action: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/coach/quick-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, stats }),
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: Message = {
          id: Date.now(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Quick action failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearConversation = async () => {
    if (confirm('Clear conversation history?')) {
      try {
        await fetch('/api/coach/conversations', { method: 'DELETE' })
        setMessages([])
      } catch (error) {
        console.error('Failed to clear conversation:', error)
      }
    }
  }

  return (
    <Card className="border-blue-900/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-400" />
            AI Study Coach
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearConversation}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
        {stats && (
          <div className="grid grid-cols-4 gap-2 text-xs text-neutral-400 mt-2">
            <div>
              <div className="font-semibold text-neutral-300">{stats.totalHours.toFixed(1)}h</div>
              <div>Total Study</div>
            </div>
            <div>
              <div className="font-semibold text-neutral-300">{stats.avgAccuracy}%</div>
              <div>Avg Accuracy</div>
            </div>
            <div>
              <div className="font-semibold text-neutral-300">{stats.weakTopics.length}</div>
              <div>Weak Topics</div>
            </div>
            <div>
              <div className="font-semibold text-neutral-300">{stats.recentSessions}</div>
              <div>Sessions (7d)</div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => getQuickAction('weak_topics')}
            disabled={isLoading}
          >
            <Target className="h-3 w-3 mr-1" />
            What should I study?
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => getQuickAction('generate_flashcards')}
            disabled={isLoading}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Generate flashcards
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => getQuickAction('practice_problems')}
            disabled={isLoading}
          >
            <BookOpen className="h-3 w-3 mr-1" />
            Practice problems
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => getQuickAction('study_tip')}
            disabled={isLoading}
          >
            <Lightbulb className="h-3 w-3 mr-1" />
            Study tip
          </Button>
        </div>

        <Separator />

        {/* Messages */}
        <div className="h-[400px] overflow-y-auto space-y-3 pr-2">
          {messages.length === 0 ? (
            <div className="text-center text-neutral-400 mt-20">
              <Brain className="h-12 w-12 mx-auto mb-3 text-blue-400" />
              <p className="text-sm">Ask me anything about your FE Civil or SCADA studies!</p>
              <p className="text-xs mt-2">
                I can help you identify weak topics, generate flashcards,<br />
                suggest practice problems, and create personalized study plans.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-neutral-800 text-neutral-100'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                  <div className="text-xs opacity-60 mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-neutral-800 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  Thinking...
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleVoiceInput}
            className={isListening ? 'border-red-500 text-red-500' : ''}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Input
            placeholder="Ask me anything about your studies..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-xs text-neutral-500">
          <strong>Try asking:</strong> "What are my weak topics?" • "Generate flashcards for Statics" •
          "Suggest practice problems for circuits" • "Explain Bernoulli's equation"
        </div>
      </CardContent>
    </Card>
  )
}
