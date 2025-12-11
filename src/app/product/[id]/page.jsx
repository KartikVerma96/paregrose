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
      },
      reviews: {
        where: { is_approved: true },
        include: {
          user: {
            select: { fullName: true }
          }
        },
        orderBy: { created_at: 'desc' },
        take: 10
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
  
  const fullImageUrl = primaryImage.startsWith('http') ? primaryImage : `https://paregrose.com${primaryImage}`;
  const description = product.description || product.short_description || `Buy ${product.name} at Paregrose. Premium quality ethnic wear${product.category ? ` in ${product.category.name}` : ''} category. Free shipping on orders above ₹999.`;

  return {
    metadataBase: new URL('https://paregrose.com'),
    title: pageTitle,
    description: description,
    keywords: [
      product.name.toLowerCase(),
      product.category?.name?.toLowerCase() || 'ethnic wear',
      product.subcategory?.name?.toLowerCase() || '',
      product.material?.toLowerCase() || '',
      product.brand?.toLowerCase() || '',
      'ethnic wear',
      'traditional wear',
      'premium fashion',
      'indian wear',
      'buy online',
      'women fashion',
      'designer wear',
    ].filter(Boolean),
    openGraph: {
      title: `${product.name}${discountPercentage > 0 ? ` - ${discountPercentage}% OFF` : ''} | Paregrose`,
      description: description,
      url: `https://paregrose.com/product/${product.id}`,
      siteName: 'Paregrose',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: 'product',
      locale: 'en_IN',
      ...(product.category && {
        section: product.category.name,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name}${discountPercentage > 0 ? ` - ${discountPercentage}% OFF` : ''} | Paregrose`,
      description: description,
      images: [fullImageUrl],
      creator: '@paregrose',
      site: '@paregrose',
    },
    alternates: {
      canonical: `https://paregrose.com/product/${product.id}`,
    },
    other: {
      'product:price:amount': price.toString(),
      'product:price:currency': 'INR',
      'product:availability': product.availability === 'In_Stock' ? 'in stock' : product.availability === 'Limited_Stock' ? 'limited availability' : 'out of stock',
      'product:condition': 'new',
      'product:brand': product.brand || 'Paregrose',
      'product:sku': product.sku || '',
      'product:retailer': 'Paregrose',
      'product:retailer_id': 'paregrose',
    },
  };
}

// Structured data for SEO
function generateStructuredData(product) {
  const price = parseFloat(product.price);
  const originalPrice = parseFloat(product.original_price || product.price);
  const images = product.images?.map(img => `https://paregrose.com${img.image_url}`) || ['https://paregrose.com/images/carousel/carousel_1.jpg'];
  const availability = product.availability === 'In_Stock' ? 'https://schema.org/InStock' : 
                      product.availability === 'Limited_Stock' ? 'https://schema.org/LimitedAvailability' : 
                      'https://schema.org/OutOfStock';
  
  const breadcrumbs = [
    { name: 'Home', url: 'https://paregrose.com' },
    { name: 'Shop', url: 'https://paregrose.com/shop' },
  ];
  if (product.category) {
    breadcrumbs.push({ name: product.category.name, url: `https://paregrose.com/shop/${product.category.slug}` });
  }
  breadcrumbs.push({ name: product.name, url: `https://paregrose.com/product/${product.id}` });

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.short_description || `Buy ${product.name} at Paregrose. Premium quality ethnic wear.`,
    image: images,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Paregrose',
    },
    sku: product.sku || '',
    mpn: product.sku || '',
    category: product.category?.name || 'Ethnic Wear',
    material: product.material || '',
    offers: {
      '@type': 'Offer',
      price: price,
      priceCurrency: 'INR',
      availability: availability,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      url: `https://paregrose.com/product/${product.id}`,
      seller: {
        '@type': 'Organization',
        name: 'Paregrose',
        url: 'https://paregrose.com',
      },
      ...(originalPrice > price && {
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: price,
          priceCurrency: 'INR',
          referenceQuantity: {
            '@type': 'QuantitativeValue',
            value: 1,
            unitCode: 'C62',
          },
        },
      }),
    },
    aggregateRating: product.reviews && product.reviews.length > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length,
      reviewCount: product.reviews.length,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    review: product.reviews?.slice(0, 5).map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.user?.fullName || 'Anonymous',
      },
      datePublished: review.created_at,
      reviewBody: review.comment || '',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
    })) || [],
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    },
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

