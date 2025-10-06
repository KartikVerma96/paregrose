import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createAdminRoute, USER_ROLES } from '@/lib/adminMiddleware'

// GET /api/admin/products - Get products for admin (with admin-specific data)
async function handler(request, context, user) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Query parameters
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const availability = searchParams.get('availability')
    const isFeatured = searchParams.get('featured')
    const isBestseller = searchParams.get('bestseller')
    const isNewArrival = searchParams.get('newArrival')
    const isActive = searchParams.get('active')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit
    
    // Build where clause
    const where = {}
    
    // Add category filter
    if (category) {
      where.category_id = {
        equals: parseInt(category)
      }
    }
    
    // Add search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // Add availability filter
    if (availability) {
      where.availability = availability
    }
    
    // Add feature filters
    if (isFeatured !== null && isFeatured !== '') {
      where.is_featured = isFeatured === 'true'
    }
    if (isBestseller !== null && isBestseller !== '') {
      where.is_bestseller = isBestseller === 'true'
    }
    if (isNewArrival !== null && isNewArrival !== '') {
      where.is_new_arrival = isNewArrival === 'true'
    }
    if (isActive !== null && isActive !== '') {
      where.is_active = isActive === 'true'
    }
    
    // Build orderBy clause
    const orderBy = {}
    if (sortBy === 'price') {
      orderBy.price = sortOrder
    } else if (sortBy === 'name') {
      orderBy.name = sortOrder
    } else if (sortBy === 'stockQuantity') {
      orderBy.stock_quantity = sortOrder
    } else if (sortBy === 'createdAt') {
      orderBy.created_at = sortOrder
    } else {
      orderBy.created_at = 'desc'
    }
    
    // Execute query with pagination
    const [products, totalCount] = await Promise.all([
      prisma.products.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          short_description: true,
          category_id: true,
          subcategory_id: true,
          price: true,
          original_price: true,
          discount_percentage: true,
          sku: true,
          brand: true,
          material: true,
          availability: true,
          stock_quantity: true,
          is_featured: true,
          is_bestseller: true,
          is_new_arrival: true,
          is_active: true,
          created_at: true,
          updated_at: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          subcategory: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          images: {
            select: {
              id: true,
              image_url: true,
              alt_text: true,
              is_primary: true
            }
          }
        },
        orderBy,
        skip: offset,
        take: limit
      }),
      prisma.products.count({ where })
    ])
    
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
    console.error('Error fetching admin products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/admin/products - Create new product (Admin only)
async function createProductHandler(request, context, user) {
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
    const product = await prisma.products.create({
      data: {
        name: body.name,
        slug,
        description: body.description,
        short_description: body.shortDescription,
        category_id: parseInt(body.categoryId),
        price: parseFloat(body.price),
        original_price: body.originalPrice ? parseFloat(body.originalPrice) : null,
        discount_percentage: body.discountPercentage ? parseFloat(body.discountPercentage) : 0,
        sku: body.sku,
        brand: body.brand,
        material: body.material,
        size_options: body.sizeOptions ? JSON.stringify(body.sizeOptions) : null,
        color_options: body.colorOptions ? JSON.stringify(body.colorOptions) : null,
        availability: body.availability || 'In Stock',
        stock_quantity: parseInt(body.stockQuantity) || 0,
        weight: body.weight ? parseFloat(body.weight) : null,
        dimensions: body.dimensions ? JSON.stringify(body.dimensions) : null,
        care_instructions: body.careInstructions,
        is_featured: body.isFeatured === 'true' || body.isFeatured === true,
        is_bestseller: body.isBestseller === 'true' || body.isBestseller === true,
        is_new_arrival: body.isNewArrival === 'true' || body.isNewArrival === true,
        is_active: body.isActive !== 'false' && body.isActive !== false,
        meta_title: body.metaTitle,
        meta_description: body.metaDescription,
        meta_keywords: body.metaKeywords
      },
      include: {
        category: true,
        images: true
      }
    })
    
    // Create product images if provided
    if (body.images && body.images.length > 0) {
      await Promise.all(
        body.images.map((imageData, index) =>
          prisma.product_images.create({
            data: {
              product_id: product.id,
              image_url: imageData.url,
              alt_text: imageData.alt || product.name,
              is_primary: imageData.isPrimary || index === 0,
              sort_order: imageData.sortOrder || index + 1
            }
          })
        )
      )
    }
    
    // Fetch the complete product with images
    const completeProduct = await prisma.products.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        images: {
          orderBy: { sort_order: 'asc' }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: completeProduct
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

export const GET = createAdminRoute(handler, USER_ROLES.STAFF)
export const POST = createAdminRoute(createProductHandler, USER_ROLES.STAFF)
