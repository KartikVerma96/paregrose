import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const slides = await prisma.carousel_slides.findMany({
      where: {
        is_active: true,
      },
      orderBy: {
        sort_order: 'asc',
      },
    });

    return Response.json({
      success: true,
      data: slides,
    });
  } catch (error) {
    console.error('Error fetching carousel slides:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch carousel slides',
      },
      { status: 500 }
    );
  }
}

