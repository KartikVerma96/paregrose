import ProductDetailClient from './ProductDetailClient';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

// Helper function to fetch product
async function getProduct(id) {
  const product = await prisma.products.findUnique({
    where: { id: parseInt(id), is_active: true },
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
        where: { is_active: true },
        orderBy: [
          { size: 'asc' },
          { color: 'asc' }
        ]
      }
    }
  });
  
  if (!product) {
    return null;
  }
  
  // Convert Decimal fields to plain numbers for client component
  return {
    ...product,
    price: product.price ? parseFloat(product.price.toString()) : 0,
    original_price: product.original_price ? parseFloat(product.original_price.toString()) : null,
    discount_percentage: product.discount_percentage ? parseFloat(product.discount_percentage.toString()) : 0,
    weight: product.weight ? parseFloat(product.weight.toString()) : null,
    variants: product.variants?.map(v => ({
      ...v,
      stock_quantity: v.stock_quantity ? parseInt(v.stock_quantity.toString()) : 0,
      price_adjustment: v.price_adjustment ? parseFloat(v.price_adjustment.toString()) : 0
    })) || []
  };
}

// Generate dynamic metadata
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }
  
  // Calculate discount properly
  const price = parseFloat(product.price) || 0;
  const originalPrice = product.original_price ? parseFloat(product.original_price) : price;
  const discountPercentage = (originalPrice > price && price > 0) 
    ? Math.round((1 - price / originalPrice) * 100) 
    : 0;
  
  const primaryImage = product.images?.[0]?.image_url || '/images/carousel/pic_1.jpg';
  
  // Generate clean title
  const titleParts = [product.name];
  if (discountPercentage > 0) {
    titleParts.push(`${discountPercentage}% OFF`);
  }
  titleParts.push('Paregrose');
  const pageTitle = titleParts.join(' - ');
  
  return {
    title: pageTitle,
    description: product.description || product.short_description || `Buy ${product.name} at Paregrose. Premium quality ethnic wear.`,
    keywords: [
      product.name.toLowerCase(),
      product.category?.name?.toLowerCase() || 'ethnic wear',
      product.material?.toLowerCase() || '',
      'ethnic wear',
      'traditional wear',
      'premium fashion',
      'indian wear'
    ].filter(Boolean),
    openGraph: {
      title: `${product.name}${discountPercentage > 0 ? ` - ${discountPercentage}% OFF` : ''}`,
      description: product.description || product.short_description || '',
      url: `https://paregrose.com/product/${product.id}`,
      images: [
        {
          url: primaryImage,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      type: 'website',
      siteName: 'Paregrose',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name}${discountPercentage > 0 ? ` - ${discountPercentage}% OFF` : ''}`,
      description: product.description || product.short_description || '',
      images: [primaryImage],
    },
    alternates: {
      canonical: `https://paregrose.com/product/${product.id}`,
    },
    other: {
      'product:price:amount': price.toString(),
      'product:price:currency': 'INR',
      'product:availability': product.availability || 'in stock',
      'product:condition': 'new',
      'product:brand': product.brand || 'Paregrose',
      'product:sku': product.sku || '',
    },
  };
}

// Structured data for SEO
function generateStructuredData(product) {
  const price = parseFloat(product.price);
  const originalPrice = parseFloat(product.original_price || product.price);
  const images = product.images?.map(img => img.image_url) || [];
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.short_description,
    image: images,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Paregrose',
    },
    sku: product.sku || '',
    category: product.category?.name || '',
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: 'INR',
      availability: product.availability === 'In_Stock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      seller: {
        '@type': 'Organization',
        name: 'Paregrose',
      },
    },
    material: product.material,
  };
}

export default async function ProductDetail({ params }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  const structuredData = generateStructuredData(product);
  
  // Calculate the title for consistency
  const price = parseFloat(product.price) || 0;
  const originalPrice = product.original_price ? parseFloat(product.original_price) : price;
  const discountPercentage = (originalPrice > price && price > 0) 
    ? Math.round((1 - price / originalPrice) * 100) 
    : 0;

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <ProductDetailClient 
        product={product}
        discountPercentage={discountPercentage}
      />
    </>
  );
}

