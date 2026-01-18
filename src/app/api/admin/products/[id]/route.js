import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createAdminRoute, USER_ROLES } from '@/lib/adminMiddleware'

// GET /api/admin/products/[id] - Get single product for admin
async function handler(request, context, user) {
  try {
    const params = await context.params
    const { id } = params
    
    console.log('🔍 GET /api/admin/products/[id] - Fetching product with ID:', id)
    console.log('📊 Parsed ID:', parseInt(id))
    
    const product = await prisma.products.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        subcategory: true,
        images: {
          orderBy: [
            { is_primary: 'desc' },
            { sort_order: 'asc' }
          ]
        },
        variants: {
          orderBy: [
            { size: 'asc' },
            { color: 'asc' }
          ]
        },
        _count: {
          select: {
            images: true,
            cart_items: true,
            reviews: true
          }
        }
      }
    })
    
    console.log('✅ Product query result:', product ? `Found product: ${product.name}` : 'Product not found')
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: product
    })
    
  } catch (error) {
    console.error('❌ Error fetching product:', error)
    console.error('❌ Error name:', error.name)
    console.error('❌ Error message:', error.message)
    console.error('❌ Error code:', error.code)
    console.error('❌ Error stack:', error.stack)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/products/[id] - Update product (Admin only)
async function updateProductHandler(request, context, user) {
  try {
    const params = await context.params
    const { id } = params
    const body = await request.json()
    
    // Check if product exists
    const existingProduct = await prisma.products.findUnique({
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
    
    // Map availability to enum value
    const availabilityMap = {
      'In Stock': 'In_Stock',
      'Out of Stock': 'Out_of_Stock',
      'Limited Stock': 'Limited_Stock'
    }
    
    // Map camelCase to snake_case for database fields
    const updateData = {}
    if (body.name !== undefined) updateData.name = body.name || existingProduct.name
    if (slug !== existingProduct.slug) updateData.slug = slug
    if (body.description !== undefined) updateData.description = body.description || null
    if (body.shortDescription !== undefined) updateData.short_description = body.shortDescription || null
    if (body.short_description !== undefined) updateData.short_description = body.short_description || null
    if (body.categoryId !== undefined) updateData.category_id = parseInt(body.categoryId)
    if (body.category_id !== undefined) updateData.category_id = parseInt(body.category_id)
    if (body.subcategoryId !== undefined) updateData.subcategory_id = body.subcategoryId ? parseInt(body.subcategoryId) : null
    if (body.subcategory_id !== undefined) updateData.subcategory_id = body.subcategory_id ? parseInt(body.subcategory_id) : null
    if (body.price !== undefined) updateData.price = parseFloat(body.price)
    if (body.originalPrice !== undefined) updateData.original_price = body.originalPrice ? parseFloat(body.originalPrice) : null
    if (body.original_price !== undefined) updateData.original_price = body.original_price ? parseFloat(body.original_price) : null
    if (body.discountPercentage !== undefined) updateData.discount_percentage = parseFloat(body.discountPercentage) || 0
    if (body.discount_percentage !== undefined) updateData.discount_percentage = parseFloat(body.discount_percentage) || 0
    if (body.sku !== undefined) updateData.sku = body.sku || null
    if (body.brand !== undefined) updateData.brand = body.brand || null
    if (body.material !== undefined) updateData.material = body.material || null
    if (body.sizeOptions !== undefined) updateData.size_options = body.sizeOptions ? (typeof body.sizeOptions === 'string' ? body.sizeOptions : JSON.stringify(body.sizeOptions)) : null
    if (body.size_options !== undefined) updateData.size_options = body.size_options ? (typeof body.size_options === 'string' ? body.size_options : JSON.stringify(body.size_options)) : null
    if (body.colorOptions !== undefined) updateData.color_options = body.colorOptions ? (typeof body.colorOptions === 'string' ? body.colorOptions : JSON.stringify(body.colorOptions)) : null
    if (body.color_options !== undefined) updateData.color_options = body.color_options ? (typeof body.color_options === 'string' ? body.color_options : JSON.stringify(body.color_options)) : null
    if (body.availability !== undefined) updateData.availability = availabilityMap[body.availability] || 'In_Stock'
    if (body.stockQuantity !== undefined) updateData.stock_quantity = parseInt(body.stockQuantity) || 0
    if (body.stock_quantity !== undefined) updateData.stock_quantity = parseInt(body.stock_quantity) || 0
    if (body.weight !== undefined) updateData.weight = body.weight ? parseFloat(body.weight) : null
    if (body.dimensions !== undefined) updateData.dimensions = body.dimensions ? (typeof body.dimensions === 'string' ? body.dimensions : JSON.stringify(body.dimensions)) : null
    if (body.careInstructions !== undefined) updateData.care_instructions = body.careInstructions || null
    if (body.care_instructions !== undefined) updateData.care_instructions = body.care_instructions || null
    if (body.isFeatured !== undefined) updateData.is_featured = body.isFeatured === 'true' || body.isFeatured === true
    if (body.is_featured !== undefined) updateData.is_featured = body.is_featured === 'true' || body.is_featured === true
    if (body.isBestseller !== undefined) updateData.is_bestseller = body.isBestseller === 'true' || body.isBestseller === true
    if (body.is_bestseller !== undefined) updateData.is_bestseller = body.is_bestseller === 'true' || body.is_bestseller === true
    if (body.isNewArrival !== undefined) updateData.is_new_arrival = body.isNewArrival === 'true' || body.isNewArrival === true
    if (body.is_new_arrival !== undefined) updateData.is_new_arrival = body.is_new_arrival === 'true' || body.is_new_arrival === true
    if (body.isActive !== undefined) updateData.is_active = body.isActive !== 'false' && body.isActive !== false
    if (body.is_active !== undefined) updateData.is_active = body.is_active !== 'false' && body.is_active !== false
    if (body.metaTitle !== undefined) updateData.meta_title = body.metaTitle || null
    if (body.meta_title !== undefined) updateData.meta_title = body.meta_title || null
    if (body.metaDescription !== undefined) updateData.meta_description = body.metaDescription || null
    if (body.meta_description !== undefined) updateData.meta_description = body.meta_description || null
    if (body.metaKeywords !== undefined) updateData.meta_keywords = body.metaKeywords || null
    if (body.meta_keywords !== undefined) updateData.meta_keywords = body.meta_keywords || null
    
    // Update product
    const updatedProduct = await prisma.products.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        category: true,
        subcategory: true,
        images: true
      }
    })
    
    // Update images if provided
    if (body.images && Array.isArray(body.images)) {
      // Delete existing images
      await prisma.product_images.deleteMany({
        where: { product_id: parseInt(id) }
      })
      
      // Ensure only one image is marked as primary
      const hasPrimaryImage = body.images.some(img => img.isPrimary === true);
      
      // Create new images
      await Promise.all(
        body.images.map((imageData, index) =>
          prisma.product_images.create({
            data: {
              product_id: parseInt(id),
              image_url: imageData.url,
              alt_text: imageData.alt || updatedProduct.name,
              is_primary: imageData.isPrimary === true || (!hasPrimaryImage && index === 0),
              sort_order: imageData.sortOrder || index + 1
            }
          })
        )
      )
    }
    
    // Update variants if provided
    if (body.variants !== undefined) {
      console.log('🔄 Updating variants for product:', id);
      
      // Delete existing variants
      await prisma.product_variants.deleteMany({
        where: { product_id: parseInt(id) }
      })
      
      // Create new variants
      if (body.variants && body.variants.length > 0) {
        console.log('💾 Creating', body.variants.length, 'new variants');
        await Promise.all(
          body.variants.map((variant) =>
            prisma.product_variants.create({
              data: {
                product_id: parseInt(id),
                size: variant.size || null,
                color: variant.color || null,
                stock_quantity: parseInt(variant.stock_quantity) || 0,
                price_adjustment: parseFloat(variant.price_adjustment) || 0,
                is_active: variant.is_active !== false
              }
            })
          )
        )
        console.log('✅ Variants updated successfully');
      }
    }
    
    // Fetch the complete updated product
    const completeProduct = await prisma.products.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        subcategory: true,
        images: {
          orderBy: { sort_order: 'asc' }
        },
        variants: {
          orderBy: [
            { size: 'asc' },
            { color: 'asc' }
          ]
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: completeProduct
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

// DELETE /api/admin/products/[id] - Delete product (Admin only)
async function deleteProductHandler(request, context, user) {
  try {
    const params = await context.params
    const { id } = params
    
    // Check if product exists
    const existingProduct = await prisma.products.findUnique({
      where: { id: parseInt(id) }
    })
    
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Delete product (this will cascade delete related records due to foreign keys)
    await prisma.products.delete({
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

export const GET = createAdminRoute(handler, USER_ROLES.STAFF)
export const PUT = createAdminRoute(updateProductHandler, USER_ROLES.STAFF)
export const DELETE = createAdminRoute(deleteProductHandler, USER_ROLES.STAFF)
