// Product population script - Populates database with realistic product data
import { prisma } from './db.js'

// Product categories for women's clothing
const categories = [
  {
    name: 'Sarees',
    slug: 'sarees',
    description: 'Traditional Indian sarees for all occasions - from daily wear to special events',
    imageUrl: '/images/carousel/pic_1.jpg'
  },
  {
    name: 'Lehengas',
    slug: 'lehengas',
    description: 'Beautiful lehengas perfect for weddings, festivals, and celebrations',
    imageUrl: '/images/carousel/pic_2.jpg'
  },
  {
    name: 'Gowns',
    slug: 'gowns',
    description: 'Elegant gowns for parties, events, and special occasions',
    imageUrl: '/images/carousel/pic_3.jpg'
  },
  {
    name: 'Kurtis',
    slug: 'kurtis',
    description: 'Comfortable and stylish kurtis for daily wear and casual outings',
    imageUrl: '/images/carousel/pic_4.jpg'
  },
  {
    name: 'Salwar Suits',
    slug: 'salwar-suits',
    description: 'Traditional salwar suits combining comfort with elegance',
    imageUrl: '/images/carousel/pic_5.jpg'
  },
  {
    name: 'Ethnic Sets',
    slug: 'ethnic-sets',
    description: 'Complete ethnic sets with matching accessories',
    imageUrl: '/images/carousel/pic_6.jpg'
  }
]

// Sample product data
const products = [
  // Sarees
  {
    name: 'Elegant Silk Saree',
    description: 'Beautiful traditional silk saree with intricate embroidery work. Perfect for weddings, festivals, and special occasions. Features premium quality silk fabric with elegant designs.',
    shortDescription: 'Premium silk saree with intricate embroidery',
    categorySlug: 'sarees',
    price: 2999.00,
    originalPrice: 3999.00,
    sku: 'PRG-SAR-001',
    brand: 'Paregrose',
    material: 'Pure Silk',
    sizeOptions: ['Free Size'],
    colorOptions: ['Red', 'Blue', 'Green', 'Pink', 'Purple'],
    availability: 'In Stock',
    stockQuantity: 50,
    weight: 0.8,
    dimensions: { length: '6.5 yards', width: '48 inches' },
    careInstructions: 'Dry clean only. Store in cool, dry place.',
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    metaTitle: 'Elegant Silk Saree - Traditional Indian Wear | Paregrose',
    metaDescription: 'Shop beautiful silk sarees with intricate embroidery. Perfect for weddings and festivals. Premium quality fabric with elegant designs.',
    metaKeywords: 'silk saree, traditional saree, wedding saree, embroidered saree',
    images: [
      { url: '/images/carousel/pic_1.jpg', alt: 'Elegant Silk Saree - Front View', isPrimary: true, sortOrder: 1 },
      { url: '/images/carousel/pic_2.jpg', alt: 'Elegant Silk Saree - Detail View', isPrimary: false, sortOrder: 2 }
    ]
  },
  {
    name: 'Designer Lehenga',
    description: 'Stunning designer lehenga with heavy work and embellishments. Perfect for weddings, receptions, and grand celebrations. Features premium fabric with intricate detailing.',
    shortDescription: 'Heavy work designer lehenga for special occasions',
    categorySlug: 'lehengas',
    price: 4999.00,
    originalPrice: 6999.00,
    sku: 'PRG-LEH-001',
    brand: 'Paregrose',
    material: 'Georgette',
    sizeOptions: ['S', 'M', 'L', 'XL'],
    colorOptions: ['Pink', 'Purple', 'Gold', 'Red', 'Blue'],
    availability: 'In Stock',
    stockQuantity: 30,
    weight: 1.2,
    dimensions: { length: 'Lehenga + Dupatta', width: 'Standard sizes' },
    careInstructions: 'Dry clean only. Handle with care due to heavy work.',
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    metaTitle: 'Designer Lehenga - Wedding Collection | Paregrose',
    metaDescription: 'Shop stunning designer lehengas with heavy work. Perfect for weddings and celebrations. Premium quality with intricate detailing.',
    metaKeywords: 'designer lehenga, wedding lehenga, heavy work lehenga, bridal lehenga',
    images: [
      { url: '/images/carousel/pic_3.jpg', alt: 'Designer Lehenga - Front View', isPrimary: true, sortOrder: 1 },
      { url: '/images/carousel/pic_4.jpg', alt: 'Designer Lehenga - Detail View', isPrimary: false, sortOrder: 2 }
    ]
  },
  {
    name: 'Party Gown',
    description: 'Elegant party gown perfect for evening events, parties, and formal occasions. Features contemporary design with premium fabric and flattering silhouette.',
    shortDescription: 'Elegant party gown for evening events',
    categorySlug: 'gowns',
    price: 1999.00,
    originalPrice: 2499.00,
    sku: 'PRG-GOW-001',
    brand: 'Paregrose',
    material: 'Chiffon',
    sizeOptions: ['S', 'M', 'L'],
    colorOptions: ['Black', 'Navy', 'Red', 'Burgundy'],
    availability: 'In Stock',
    stockQuantity: 25,
    weight: 0.6,
    dimensions: { length: 'Floor length', width: 'Standard sizes' },
    careInstructions: 'Dry clean recommended. Steam iron on low heat.',
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    metaTitle: 'Party Gown - Evening Wear Collection | Paregrose',
    metaDescription: 'Shop elegant party gowns for evening events. Contemporary design with premium fabric and flattering silhouette.',
    metaKeywords: 'party gown, evening gown, formal wear, party dress',
    images: [
      { url: '/images/carousel/pic_5.jpg', alt: 'Party Gown - Front View', isPrimary: true, sortOrder: 1 },
      { url: '/images/carousel/pic_6.jpg', alt: 'Party Gown - Back View', isPrimary: false, sortOrder: 2 }
    ]
  },
  {
    name: 'Cotton Kurti',
    description: 'Comfortable and stylish cotton kurti perfect for daily wear. Features breathable fabric with contemporary design and comfortable fit.',
    shortDescription: 'Comfortable cotton kurti for daily wear',
    categorySlug: 'kurtis',
    price: 899.00,
    originalPrice: 1199.00,
    sku: 'PRG-KUR-001',
    brand: 'Paregrose',
    material: 'Pure Cotton',
    sizeOptions: ['S', 'M', 'L', 'XL'],
    colorOptions: ['White', 'Blue', 'Green', 'Yellow', 'Pink'],
    availability: 'In Stock',
    stockQuantity: 100,
    weight: 0.3,
    dimensions: { length: 'Knee length', width: 'Standard sizes' },
    careInstructions: 'Machine wash cold. Tumble dry low.',
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    metaTitle: 'Cotton Kurti - Daily Wear Collection | Paregrose',
    metaDescription: 'Shop comfortable cotton kurtis for daily wear. Breathable fabric with contemporary design.',
    metaKeywords: 'cotton kurti, daily wear, casual kurti, comfortable kurti',
    images: [
      { url: '/images/carousel/pic_7.jpg', alt: 'Cotton Kurti - Front View', isPrimary: true, sortOrder: 1 },
      { url: '/images/carousel/pic_8.jpg', alt: 'Cotton Kurti - Side View', isPrimary: false, sortOrder: 2 }
    ]
  },
  {
    name: 'Traditional Salwar Suit',
    description: 'Traditional salwar suit combining comfort with elegance. Perfect for daily wear, office, or casual outings. Features premium fabric with traditional patterns.',
    shortDescription: 'Traditional salwar suit for daily wear',
    categorySlug: 'salwar-suits',
    price: 1599.00,
    originalPrice: 1999.00,
    sku: 'PRG-SAL-001',
    brand: 'Paregrose',
    material: 'Cotton Blend',
    sizeOptions: ['S', 'M', 'L', 'XL'],
    colorOptions: ['Maroon', 'Navy', 'Green', 'Purple'],
    availability: 'In Stock',
    stockQuantity: 75,
    weight: 0.7,
    dimensions: { length: 'Standard', width: 'Standard sizes' },
    careInstructions: 'Machine wash cold. Iron on medium heat.',
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    metaTitle: 'Traditional Salwar Suit - Ethnic Wear | Paregrose',
    metaDescription: 'Shop traditional salwar suits combining comfort with elegance. Perfect for daily wear and office.',
    metaKeywords: 'salwar suit, traditional wear, ethnic wear, office wear',
    images: [
      { url: '/images/carousel/pic_9.jpg', alt: 'Traditional Salwar Suit - Front View', isPrimary: true, sortOrder: 1 },
      { url: '/images/carousel/pic_10.jpg', alt: 'Traditional Salwar Suit - Detail View', isPrimary: false, sortOrder: 2 }
    ]
  },
  {
    name: 'Ethnic Set with Dupatta',
    description: 'Complete ethnic set with matching dupatta. Perfect for festivals, celebrations, and special occasions. Features coordinated colors and designs.',
    shortDescription: 'Complete ethnic set with matching dupatta',
    categorySlug: 'ethnic-sets',
    price: 2299.00,
    originalPrice: 2999.00,
    sku: 'PRG-ETH-001',
    brand: 'Paregrose',
    material: 'Georgette',
    sizeOptions: ['S', 'M', 'L'],
    colorOptions: ['Orange', 'Pink', 'Blue', 'Green'],
    availability: 'In Stock',
    stockQuantity: 40,
    weight: 0.9,
    dimensions: { length: 'Standard', width: 'Standard sizes' },
    careInstructions: 'Dry clean only. Store properly to maintain shape.',
    isFeatured: true,
    isBestseller: false,
    isNewArrival: false,
    metaTitle: 'Ethnic Set with Dupatta - Festival Collection | Paregrose',
    metaDescription: 'Shop complete ethnic sets with matching dupatta. Perfect for festivals and celebrations.',
    metaKeywords: 'ethnic set, festival wear, dupatta set, traditional wear',
    images: [
      { url: '/images/carousel/pic_11.jpg', alt: 'Ethnic Set - Front View', isPrimary: true, sortOrder: 1 },
      { url: '/images/carousel/pic_12.jpg', alt: 'Ethnic Set - Side View', isPrimary: false, sortOrder: 2 }
    ]
  },
  // Additional products using remaining images
  {
    name: 'Bridal Lehenga',
    description: 'Exquisite bridal lehenga with heavy embroidery and embellishments. Perfect for your special day with premium quality and royal look.',
    shortDescription: 'Exquisite bridal lehenga for special occasions',
    categorySlug: 'lehengas',
    price: 8999.00,
    originalPrice: 12999.00,
    sku: 'PRG-BRI-001',
    brand: 'Paregrose',
    material: 'Heavy Georgette',
    sizeOptions: ['S', 'M', 'L', 'XL'],
    colorOptions: ['Red', 'Maroon', 'Gold'],
    availability: 'In Stock',
    stockQuantity: 15,
    weight: 1.8,
    dimensions: { length: 'Lehenga + Dupatta + Choli', width: 'Standard sizes' },
    careInstructions: 'Professional dry clean only. Handle with extreme care.',
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    metaTitle: 'Bridal Lehenga - Wedding Collection | Paregrose',
    metaDescription: 'Shop exquisite bridal lehengas with heavy embroidery. Perfect for your special day.',
    metaKeywords: 'bridal lehenga, wedding lehenga, heavy embroidery, royal lehenga',
    images: [
      { url: '/images/carousel/pic_13.jpg', alt: 'Bridal Lehenga - Front View', isPrimary: true, sortOrder: 1 },
      { url: '/images/carousel/pic_14.jpg', alt: 'Bridal Lehenga - Detail View', isPrimary: false, sortOrder: 2 }
    ]
  },
  {
    name: 'Casual Kurti Set',
    description: 'Stylish casual kurti set perfect for everyday wear. Comfortable fabric with modern design and easy maintenance.',
    shortDescription: 'Stylish casual kurti set for everyday wear',
    categorySlug: 'kurtis',
    price: 1199.00,
    originalPrice: 1499.00,
    sku: 'PRG-CAS-001',
    brand: 'Paregrose',
    material: 'Cotton Blend',
    sizeOptions: ['S', 'M', 'L', 'XL'],
    colorOptions: ['Black', 'White', 'Grey', 'Blue'],
    availability: 'In Stock',
    stockQuantity: 80,
    weight: 0.4,
    dimensions: { length: 'Tunic length', width: 'Standard sizes' },
    careInstructions: 'Machine wash cold. Easy care fabric.',
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    metaTitle: 'Casual Kurti Set - Daily Wear | Paregrose',
    metaDescription: 'Shop stylish casual kurti sets for everyday wear. Comfortable and modern design.',
    metaKeywords: 'casual kurti, everyday wear, comfortable kurti, modern kurti',
    images: [
      { url: '/images/carousel/pic_15.jpg', alt: 'Casual Kurti Set - Front View', isPrimary: true, sortOrder: 1 },
      { url: '/images/carousel/pic_16.jpg', alt: 'Casual Kurti Set - Side View', isPrimary: false, sortOrder: 2 }
    ]
  },
  {
    name: 'Festival Saree',
    description: 'Beautiful festival saree with traditional patterns and vibrant colors. Perfect for festivals, pujas, and cultural celebrations.',
    shortDescription: 'Traditional festival saree with vibrant colors',
    categorySlug: 'sarees',
    price: 1799.00,
    originalPrice: 2299.00,
    sku: 'PRG-FES-001',
    brand: 'Paregrose',
    material: 'Cotton Silk',
    sizeOptions: ['Free Size'],
    colorOptions: ['Yellow', 'Orange', 'Red', 'Green'],
    availability: 'In Stock',
    stockQuantity: 60,
    weight: 0.6,
    dimensions: { length: '6 yards', width: '48 inches' },
    careInstructions: 'Dry clean recommended. Store in cool place.',
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
    metaTitle: 'Festival Saree - Traditional Collection | Paregrose',
    metaDescription: 'Shop beautiful festival sarees with traditional patterns. Perfect for festivals and celebrations.',
    metaKeywords: 'festival saree, traditional saree, puja saree, cultural wear',
    images: [
      { url: '/images/carousel/pic_17.jpg', alt: 'Festival Saree - Front View', isPrimary: true, sortOrder: 1 },
      { url: '/images/carousel/pic_18.jpg', alt: 'Festival Saree - Detail View', isPrimary: false, sortOrder: 2 }
    ]
  }
]

// Business settings for WhatsApp integration
const businessSettings = [
  {
    settingKey: 'whatsapp_business_number',
    settingValue: '+919876543210',
    description: 'WhatsApp business number for receiving orders'
  },
  {
    settingKey: 'business_name',
    settingValue: 'Paregrose',
    description: 'Business name for WhatsApp messages'
  },
  {
    settingKey: 'business_address',
    settingValue: '123 Fashion Street, Mumbai, Maharashtra 400001',
    description: 'Business address for delivery information'
  },
  {
    settingKey: 'business_hours',
    settingValue: '10:00 AM - 8:00 PM (Mon-Sat)',
    description: 'Business operating hours'
  },
  {
    settingKey: 'delivery_info',
    settingValue: 'Free delivery on orders above ₹999',
    description: 'Delivery information and policies'
  },
  {
    settingKey: 'contact_email',
    settingValue: 'info@paregrose.com',
    description: 'Business contact email'
  },
  {
    settingKey: 'contact_phone',
    settingValue: '+919876543210',
    description: 'Business contact phone number'
  }
]

// Main population function
export async function populateDatabase() {
  try {
    console.log('🚀 Starting database population...')
    
    // 1. Create categories
    console.log('📁 Creating categories...')
    const createdCategories = {}
    
    for (const category of categories) {
      const createdCategory = await prisma.category.upsert({
        where: { slug: category.slug },
        update: category,
        create: category
      })
      createdCategories[category.slug] = createdCategory
      console.log(`✅ Created category: ${category.name}`)
    }
    
    // 2. Create products
    console.log('🛍️ Creating products...')
    const createdProducts = []
    
    for (const productData of products) {
      const category = createdCategories[productData.categorySlug]
      
      // Create product
      const product = await prisma.product.upsert({
        where: { slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
        update: {
          ...productData,
          categoryId: category.id,
          sizeOptions: JSON.stringify(productData.sizeOptions),
          colorOptions: JSON.stringify(productData.colorOptions),
          dimensions: JSON.stringify(productData.dimensions)
        },
        create: {
          name: productData.name,
          slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: productData.description,
          shortDescription: productData.shortDescription,
          categoryId: category.id,
          price: productData.price,
          originalPrice: productData.originalPrice,
          sku: productData.sku,
          brand: productData.brand,
          material: productData.material,
          sizeOptions: JSON.stringify(productData.sizeOptions),
          colorOptions: JSON.stringify(productData.colorOptions),
          availability: productData.availability,
          stockQuantity: productData.stockQuantity,
          weight: productData.weight,
          dimensions: JSON.stringify(productData.dimensions),
          careInstructions: productData.careInstructions,
          isFeatured: productData.isFeatured,
          isBestseller: productData.isBestseller,
          isNewArrival: productData.isNewArrival,
          metaTitle: productData.metaTitle,
          metaDescription: productData.metaDescription,
          metaKeywords: productData.metaKeywords
        }
      })
      
      createdProducts.push(product)
      console.log(`✅ Created product: ${product.name}`)
      
      // Create product images
      for (const imageData of productData.images) {
        await prisma.productImage.upsert({
          where: {
            productId_imageUrl: {
              productId: product.id,
              imageUrl: imageData.url
            }
          },
          update: imageData,
          create: {
            productId: product.id,
            imageUrl: imageData.url,
            altText: imageData.alt,
            isPrimary: imageData.isPrimary,
            sortOrder: imageData.sortOrder
          }
        })
      }
      console.log(`📸 Added ${productData.images.length} images for ${product.name}`)
    }
    
    // 3. Create business settings
    console.log('⚙️ Creating business settings...')
    
    for (const setting of businessSettings) {
      await prisma.businessSetting.upsert({
        where: { settingKey: setting.settingKey },
        update: setting,
        create: setting
      })
      console.log(`✅ Created setting: ${setting.settingKey}`)
    }
    
    console.log('🎉 Database population completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`   - Categories: ${categories.length}`)
    console.log(`   - Products: ${products.length}`)
    console.log(`   - Images: ${products.reduce((sum, p) => sum + p.images.length, 0)}`)
    console.log(`   - Business Settings: ${businessSettings.length}`)
    
    return {
      success: true,
      categories: categories.length,
      products: products.length,
      images: products.reduce((sum, p) => sum + p.images.length, 0),
      settings: businessSettings.length
    }
    
  } catch (error) {
    console.error('❌ Error populating database:', error)
    throw error
  }
}

// Export for use in API routes
export default populateDatabase
