import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/study-logs - Get all study logs
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '100')

    const logs = await prisma.studyLog.findMany({
      orderBy: { date: 'desc' },
      take: limit,
    })

    return NextResponse.json({ logs })
  } catch (error) {
    console.error('Error fetching study logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch study logs' },
      { status: 500 }
    )
  }
}

// POST /api/study-logs - Create a new study log (from completed session)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Check if a log already exists for today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existingLog = await prisma.studyLog.findFirst({
      where: {
        date: {
          gte: today,
        },
      },
    })

    let log

    if (existingLog) {
      // Update existing log (add hours)
      const topicField = body.track === 'FE' ? 'topicFE' : 'topicSCADA'
      const updateData: any = {}

      if (body.track === 'FE' && body.questionCount) {
        updateData.questionsFE = (existingLog.questionsFE || 0) + (body.questionCount || 0)
        if (body.accuracy) {
          updateData.accuracyFE = body.accuracy
        }
      }

      if (body.notes) {
        const existingNotes = existingLog.notes || ''
        updateData.notes = existingNotes
          ? `${existingNotes}\n\n${new Date().toLocaleTimeString()}: ${body.notes}`
          : body.notes
      }

      log = await prisma.studyLog.update({
        where: { id: existingLog.id },
        data: updateData,
      })
    } else {
      // Create new log
      log = await prisma.studyLog.create({
        data: {
          date: new Date(),
          topicFE: body.track === 'FE' ? (body.topic || 'General') : '',
          topicSCADA: body.track === 'SCADA' ? (body.topic || 'General') : '',
          questionsFE: body.questionCount || 0,
          accuracyFE: body.accuracy || 0,
          notes: body.notes,
        },
      })
    }

    return NextResponse.json({ log }, { status: 201 })
  } catch (error) {
    console.error('Error creating study log:', error)
    return NextResponse.json(
      { error: 'Failed to create study log' },
      { status: 500 }
    )
  }
}
