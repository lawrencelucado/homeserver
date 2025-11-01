import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/coach/conversations - Get conversation history
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')

    const conversations = await prisma.coachConversation.findMany({
      orderBy: { createdAt: 'asc' },
      take: limit,
    })

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}

// DELETE /api/coach/conversations - Clear conversation history
export async function DELETE() {
  try {
    await prisma.coachConversation.deleteMany({})
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error clearing conversations:', error)
    return NextResponse.json(
      { error: 'Failed to clear conversations' },
      { status: 500 }
    )
  }
}
