import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/coach/stats - Get study statistics for AI coach
export async function GET() {
  try {
    // Get all study logs
    const logs = await prisma.studyLog.findMany({
      orderBy: { date: 'desc' },
      take: 100,
    })

    // Get recent sessions (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentSessions = await prisma.studySession.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
        status: 'completed',
      },
    })

    // Calculate totals
    let totalFE = 0
    let totalSCADA = 0
    let totalQuestions = 0
    let totalCorrect = 0

    for (const log of logs) {
      // Assuming some field exists for hours, or calculate from sessions
      // For now, use questionsFE as proxy
      if (log.questionsFE > 0) {
        totalQuestions += log.questionsFE
        totalCorrect += Math.floor((log.questionsFE * log.accuracyFE) / 100)
      }
    }

    // Calculate from sessions
    for (const session of recentSessions) {
      if (session.endTime && session.startTime) {
        const hours = (session.endTime.getTime() - session.startTime.getTime() - (session.totalPaused * 1000)) / (1000 * 60 * 60)
        if (session.track === 'FE') {
          totalFE += hours
        } else if (session.track === 'SCADA') {
          totalSCADA += hours
        } else {
          // Both
          totalFE += hours / 2
          totalSCADA += hours / 2
        }
      }
    }

    const avgAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0

    // Get weak topics
    const weakTopics = await prisma.weakTopic.findMany({
      where: {
        priority: {
          gte: 3,
        },
      },
      orderBy: { priority: 'desc' },
      take: 5,
    })

    const stats = {
      totalHours: Math.round((totalFE + totalSCADA) * 100) / 100,
      feHours: Math.round(totalFE * 100) / 100,
      scadaHours: Math.round(totalSCADA * 100) / 100,
      avgAccuracy,
      weakTopics: weakTopics.map((t: { topic: string }) => t.topic),
      recentSessions: recentSessions.length,
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Error fetching coach stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
