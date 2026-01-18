import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/products/[id] - Get single product by ID or slug
export async function GET(request, { params }) {
  try {
    const { id } = params
    
    // Check if id is a number (ID) or string (slug)
    const isNumericId = !isNaN(parseInt(id))
    
    const whereClause = isNumericId 
      ? { id: parseInt(id) }
      : { slug: id }
    
    const product = await prisma.product.findFirst({
      where: whereClause,
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' }
        },
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { fullName: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      }
    })
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Calculate average rating
    const avgRating = product.reviews.length > 0 
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0
    
    return NextResponse.json({
      success: true,
      data: {
        ...product,
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: product.reviews.length
      }
    })
    
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update product (Admin only)
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    })
    
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Create slug from name if name is being updated
    const slug = body.name && body.name !== existingProduct.name
      ? body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : existingProduct.slug
    
    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name || existingProduct.name,
        slug,
        description: body.description !== undefined ? body.description : existingProduct.description,
        shortDescription: body.shortDescription !== undefined ? body.shortDescription : existingProduct.shortDescription,
        categoryId: body.categoryId ? parseInt(body.categoryId) : existingProduct.categoryId,
        price: body.price ? parseFloat(body.price) : existingProduct.price,
        originalPrice: body.originalPrice !== undefined ? (body.originalPrice ? parseFloat(body.originalPrice) : null) : existingProduct.originalPrice,
        discountPercentage: body.discountPercentage !== undefined ? parseFloat(body.discountPercentage) : existingProduct.discountPercentage,
        sku: body.sku !== undefined ? body.sku : existingProduct.sku,
        brand: body.brand !== undefined ? body.brand : existingProduct.brand,
        material: body.material !== undefined ? body.material : existingProduct.material,
        sizeOptions: body.sizeOptions ? JSON.parse(body.sizeOptions) : existingProduct.sizeOptions,
        colorOptions: body.colorOptions ? JSON.parse(body.colorOptions) : existingProduct.colorOptions,
        availability: body.availability || existingProduct.availability,
        stockQuantity: body.stockQuantity !== undefined ? parseInt(body.stockQuantity) : existingProduct.stockQuantity,
        weight: body.weight !== undefined ? (body.weight ? parseFloat(body.weight) : null) : existingProduct.weight,
        dimensions: body.dimensions ? JSON.parse(body.dimensions) : existingProduct.dimensions,
        careInstructions: body.careInstructions !== undefined ? body.careInstructions : existingProduct.careInstructions,
        isFeatured: body.isFeatured !== undefined ? (body.isFeatured === 'true' || body.isFeatured === true) : existingProduct.isFeatured,
        isBestseller: body.isBestseller !== undefined ? (body.isBestseller === 'true' || body.isBestseller === true) : existingProduct.isBestseller,
        isNewArrival: body.isNewArrival !== undefined ? (body.isNewArrival === 'true' || body.isNewArrival === true) : existingProduct.isNewArrival,
        isActive: body.isActive !== undefined ? (body.isActive !== 'false' && body.isActive !== false) : existingProduct.isActive,
        metaTitle: body.metaTitle !== undefined ? body.metaTitle : existingProduct.metaTitle,
        metaDescription: body.metaDescription !== undefined ? body.metaDescription : existingProduct.metaDescription,
        metaKeywords: body.metaKeywords !== undefined ? body.metaKeywords : existingProduct.metaKeywords
      },
      include: {
        category: true,
        images: true
      }
    })
    
    return NextResponse.json({
      success: true,
      data: updatedProduct
    })
    
  } catch (error) {
    console.error('Error updating product:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Product with this name or SKU already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete product (Admin only)
export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    })
    
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Delete product (this will cascade delete related records due to foreign keys)
    await prisma.product.delete({
      where: { id: parseInt(id) }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
