import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET all carousel slides (admin)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const slides = await prisma.carousel_slides.findMany({
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

// POST create new carousel slide (admin)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    console.log('📥 Received carousel slide data:', JSON.stringify(data, null, 2));
    
    const {
      image_url,
      alt_text,
      title,
      subtext,
      offer_text,
      button_text = 'Shop Now',
      button_link = '/shop',
      is_active = true,
      sort_order = 0,
    } = data;

    console.log('✅ Parsed fields:', {
      image_url: image_url || 'MISSING',
      title: title || 'MISSING',
      hasImageUrl: !!image_url,
      hasTitle: !!title,
    });

    if (!image_url || !title) {
      console.error('❌ Validation failed:', { 
        hasImageUrl: !!image_url, 
        hasTitle: !!title,
        image_url: image_url || 'EMPTY',
        title: title || 'EMPTY'
      });
      return Response.json(
        { success: false, error: `Image URL and title are required. Received: image_url=${!!image_url}, title=${!!title}` },
        { status: 400 }
      );
    }

    // Note: Prisma client check removed - if model doesn't exist, Prisma will throw a clear error

    const slide = await prisma.carousel_slides.create({
      data: {
        image_url,
        alt_text,
        title,
        subtext,
        offer_text,
        button_text,
        button_link,
        is_active,
        sort_order,
      },
    });

    return Response.json({
      success: true,
      data: slide,
    });
  } catch (error) {
    console.error('Error creating carousel slide:', error);
    return Response.json(
      {
        success: false,
        error: error.message || 'Failed to create carousel slide',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

