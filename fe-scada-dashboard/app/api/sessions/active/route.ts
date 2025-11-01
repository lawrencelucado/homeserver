import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/sessions/active - Get the current active or paused session
export async function GET() {
  try {
    const session = await prisma.studySession.findFirst({
      where: {
        status: {
          in: ['active', 'paused'],
        },
      },
      orderBy: { startTime: 'desc' },
    })

    return NextResponse.json({ session })
  } catch (error) {
    console.error('Error fetching active session:', error)
    return NextResponse.json(
      { error: 'Failed to fetch active session' },
      { status: 500 }
    )
  }
}
