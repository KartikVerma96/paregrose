import { z } from 'zod'

// Category validation schema
export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Category name must be less than 100 characters'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  description: z.string().optional(),
  imageUrl: z.union([
    z.string().refine(
      val => !val || val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/'),
      { message: 'Must be a valid URL or path' }
    ),
    z.literal('')
  ]).optional(),
  isActive: z.boolean().optional()
})

// Subcategory validation schema
export const subcategorySchema = z.object({
  categoryId: z.string().min(1, 'Parent category is required'),
  name: z.string().min(1, 'Subcategory name is required').max(100, 'Subcategory name must be less than 100 characters'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  description: z.string().optional(),
  imageUrl: z.union([
    z.string().refine(
      val => !val || val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/'),
      { message: 'Must be a valid URL or path' }
    ),
    z.literal('')
  ]).optional(),
  isActive: z.boolean().optional()
})

// Product validation schema
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200, 'Product name must be less than 200 characters'),
  description: z.string().optional().default(''),
  shortDescription: z.string().optional().default(''),
  categoryId: z.string().min(1, 'Category is required'),
  subcategoryId: z.string().optional().nullable().default(''),
  price: z.union([
    z.number().positive('Price must be greater than 0'),
    z.string().min(1, 'Price is required').refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Price must be a valid number greater than 0'
    })
  ]),
  originalPrice: z.union([
    z.number().positive().nullable(),
    z.string(),
    z.null()
  ]).optional().nullable(),
  discountPercentage: z.union([
    z.number().min(0).max(100),
    z.string(),
    z.null()
  ]).optional().nullable(),
  brand: z.string().optional().default(''),
  material: z.string().optional().default(''),
  sizeOptions: z.string().optional().default(''),
  colorOptions: z.string().optional().default(''),
  availability: z.string().optional().default('In Stock'),
  stockQuantity: z.union([
    z.number().min(0, 'Stock quantity cannot be negative'),
    z.string()
  ]).optional().default(0),
  weight: z.union([
    z.number().positive().nullable(),
    z.string(),
    z.null()
  ]).optional().nullable(),
  dimensions: z.string().optional().default(''),
  careInstructions: z.string().optional().default(''),
  isFeatured: z.boolean().optional().default(false),
  isBestseller: z.boolean().optional().default(false),
  isNewArrival: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  metaTitle: z.string().optional().default(''),
  metaDescription: z.string().optional().default(''),
  metaKeywords: z.string().optional().default(''),
  images: z.array(z.object({
    url: z.string().min(1, 'Image URL is required').refine(
      val => val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/'),
      { message: 'Must be a valid URL or path' }
    ),
    alt: z.string().optional().default(''),
    isPrimary: z.boolean().optional().default(false),
    sortOrder: z.number().optional().default(0)
  })).optional().default([])
})

