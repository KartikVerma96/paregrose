import { prisma } from '@/lib/db';

export default async function sitemap() {
  const baseUrl = 'https://paregrose.com';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  try {
    // Fetch active products from database
    const products = await prisma.products.findMany({
      where: { is_active: true },
      select: {
        id: true,
        updated_at: true,
      },
      orderBy: { updated_at: 'desc' },
    });

    // Fetch active categories from database
    const categories = await prisma.categories.findMany({
      where: { is_active: true },
      select: {
        slug: true,
        updated_at: true,
      },
    });

    // Dynamic product pages
    const productPages = products.map((product) => ({
      url: `${baseUrl}/product/${product.id}`,
      lastModified: product.updated_at || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Category pages
    const categoryPages = categories.map((category) => ({
      url: `${baseUrl}/shop/${category.slug}`,
      lastModified: category.updated_at || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticPages, ...productPages, ...categoryPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static pages only if database query fails
    return staticPages;
  }
}
