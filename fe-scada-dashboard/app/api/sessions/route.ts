import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/sessions - Get all sessions (with optional filtering)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where = status ? { status } : {}

    const sessions = await prisma.studySession.findMany({
      where,
      orderBy: { startTime: 'desc' },
      take: limit,
    })

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

// POST /api/sessions - Create a new session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const session = await prisma.studySession.create({
      data: {
        startTime: new Date(body.startTime || new Date()),
        track: body.track,
        topic: body.topic,
        status: body.status || 'active',
        targetMinutes: body.targetMinutes,
        notes: body.notes,
      },
    })

    return NextResponse.json({ session }, { status: 201 })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}
