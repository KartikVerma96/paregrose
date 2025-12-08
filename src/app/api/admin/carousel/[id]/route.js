import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// PUT update carousel slide (admin)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const data = await request.json();

    const slide = await prisma.carousel_slides.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });

    return Response.json({
      success: true,
      data: slide,
    });
  } catch (error) {
    console.error('Error updating carousel slide:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to update carousel slide',
      },
      { status: 500 }
    );
  }
}

// DELETE carousel slide (admin)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    await prisma.carousel_slides.delete({
      where: { id },
    });

    return Response.json({
      success: true,
      message: 'Carousel slide deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting carousel slide:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to delete carousel slide',
      },
      { status: 500 }
    );
  }
}

