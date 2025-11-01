import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

// GET - Fetch all gallery items (public or admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const onlyVisible = searchParams.get('visible') === 'true';

    const where = session ? {} : { isVisible: true };

    if (onlyVisible) {
      where.isVisible = true;
    }

    const items = await prisma.galleryItem.findMany({
      where,
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Gallery GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery items' },
      { status: 500 }
    );
  }
}

// POST - Create new gallery item (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, beforeImagePath, afterImagePath, category, isVisible, displayOrder } = body;

    if (!title || !beforeImagePath || !afterImagePath) {
      return NextResponse.json(
        { error: 'Missing required fields: title, beforeImagePath, afterImagePath' },
        { status: 400 }
      );
    }

    const item = await prisma.galleryItem.create({
      data: {
        title,
        description: description || null,
        beforeImagePath,
        afterImagePath,
        category: category || 'general',
        isVisible: isVisible !== undefined ? isVisible : true,
        displayOrder: displayOrder || 0,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Gallery POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create gallery item' },
      { status: 500 }
    );
  }
}

// PUT - Update gallery item (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const item = await prisma.galleryItem.update({
      where: { id: parseInt(id) },
      data,
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Gallery PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update gallery item' },
      { status: 500 }
    );
  }
}

// DELETE - Delete gallery item (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    await prisma.galleryItem.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Gallery DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete gallery item' },
      { status: 500 }
    );
  }
}
