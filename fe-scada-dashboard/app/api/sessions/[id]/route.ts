import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/sessions/[id] - Get a specific session
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    const session = await prisma.studySession.findUnique({
      where: { id },
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ session })
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    )
  }
}

// PUT /api/sessions/[id] - Update a session
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()

    // Build update data object
    const updateData: any = {}

    if (body.endTime !== undefined) updateData.endTime = body.endTime ? new Date(body.endTime) : null
    if (body.pausedAt !== undefined) updateData.pausedAt = body.pausedAt ? new Date(body.pausedAt) : null
    if (body.totalPaused !== undefined) updateData.totalPaused = body.totalPaused
    if (body.track) updateData.track = body.track
    if (body.topic !== undefined) updateData.topic = body.topic
    if (body.status) updateData.status = body.status
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.questionCount !== undefined) updateData.questionCount = body.questionCount
    if (body.accuracy !== undefined) updateData.accuracy = body.accuracy
    if (body.breaksTaken !== undefined) updateData.breaksTaken = body.breaksTaken
    if (body.targetMinutes !== undefined) updateData.targetMinutes = body.targetMinutes

    const session = await prisma.studySession.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ session })
  } catch (error) {
    console.error('Error updating session:', error)
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    )
  }
}

// DELETE /api/sessions/[id] - Delete a session
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    await prisma.studySession.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting session:', error)
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    )
  }
}
