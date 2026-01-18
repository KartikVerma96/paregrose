import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/products - Get all products with filtering and search
export async function GET(request) {
  try {
    console.log('🔍 GET /api/products called');
    const { searchParams } = new URL(request.url)
    
    // Query parameters
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 12
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const minPrice = parseFloat(searchParams.get('minPrice'))
    const maxPrice = parseFloat(searchParams.get('maxPrice'))
    const availability = searchParams.get('availability')
    const isFeatured = searchParams.get('featured') === 'true'
    const isBestseller = searchParams.get('bestseller') === 'true'
    const isNewArrival = searchParams.get('newArrival') === 'true'
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    
    console.log('📊 Query params:', { page, limit, category, search });
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit
    
    // Build where clause
    const where = {
      is_active: true
    }
    
    // Add category filter
    if (category) {
      where.category = {
        slug: category
      }
    }
    
    // Add search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { short_description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // Add price range filter (only if valid numbers)
    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      where.price = {
        gte: minPrice,
        lte: maxPrice
      }
    } else if (!isNaN(minPrice)) {
      where.price = { gte: minPrice }
    } else if (!isNaN(maxPrice)) {
      where.price = { lte: maxPrice }
    }
    
    // Add availability filter
    if (availability) {
      where.availability = availability
    }
    
    // Add feature filters
    if (isFeatured) where.is_featured = true
    if (isBestseller) where.is_bestseller = true
    if (isNewArrival) where.is_new_arrival = true
    
    // Build orderBy clause
    const orderBy = {}
    if (sortBy === 'price') {
      orderBy.price = sortOrder
    } else if (sortBy === 'name') {
      orderBy.name = sortOrder
    } else if (sortBy === 'createdAt') {
      orderBy.created_at = sortOrder
    } else {
      orderBy.created_at = 'desc'
    }
    
    console.log('🔎 Where clause:', JSON.stringify(where, null, 2));
    console.log('📑 OrderBy:', JSON.stringify(orderBy, null, 2));
    
    // Execute query with pagination
    const [products, totalCount] = await Promise.all([
      prisma.products.findMany({
        where,
        include: {
          category: true,
          subcategory: true,
          images: {
            orderBy: [
              { is_primary: 'desc' },  // Primary images first
              { sort_order: 'asc' }     // Then by sort order
            ]
          },
          _count: {
            select: {
              reviews: true
            }
          }
        },
        orderBy,
        skip: offset,
        take: limit
      }),
      prisma.products.count({ where })
    ])
    
    console.log('✅ Products found:', products.length);
    console.log('📊 Total count:', totalCount);
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1
    
    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage,
          hasPrevPage
        }
      }
    })
    
  } catch (error) {
    console.error('❌ Error fetching products:', error)
    console.error('❌ Error name:', error.name)
    console.error('❌ Error message:', error.message)
    console.error('❌ Error code:', error.code)
    console.error('❌ Error stack:', error.stack)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create new product (Admin only)
export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'price', 'categoryId']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }
    
    // Create slug from name
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    
    // Create product
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug,
        description: body.description,
        shortDescription: body.shortDescription,
        categoryId: parseInt(body.categoryId),
        price: parseFloat(body.price),
        originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
        discountPercentage: body.discountPercentage ? parseFloat(body.discountPercentage) : 0,
        sku: body.sku,
        brand: body.brand,
        material: body.material,
        sizeOptions: body.sizeOptions ? JSON.parse(body.sizeOptions) : null,
        colorOptions: body.colorOptions ? JSON.parse(body.colorOptions) : null,
        availability: body.availability || 'In Stock',
        stockQuantity: parseInt(body.stockQuantity) || 0,
        weight: body.weight ? parseFloat(body.weight) : null,
        dimensions: body.dimensions ? JSON.parse(body.dimensions) : null,
        careInstructions: body.careInstructions,
        isFeatured: body.isFeatured === 'true' || body.isFeatured === true,
        isBestseller: body.isBestseller === 'true' || body.isBestseller === true,
        isNewArrival: body.isNewArrival === 'true' || body.isNewArrival === true,
        isActive: body.isActive !== 'false' && body.isActive !== false,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        metaKeywords: body.metaKeywords
      },
      include: {
        category: true,
        images: true
      }
    })
    
    return NextResponse.json({
      success: true,
      data: product
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating product:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Product with this name or SKU already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
