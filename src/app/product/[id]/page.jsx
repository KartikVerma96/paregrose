import ProductDetailClient from './ProductDetailClient';

// Mock product data (in real app, this would come from API/database)
const products = [
  {
    id: 1,
    name: 'Sukhmani Gambhir Party Wear Saree With Moti Work Border',
    images: [
      '/images/carousel/pic_1.jpg',
      '/images/carousel/pic_2.jpg',
      '/images/carousel/pic_3.jpg',
    ],
    rating: 4.6,
    reviews: 18,
    originalPrice: 2799.0,
    discountedPrice: 1499.0,
    description:
      'Experience elegance with this exquisite party wear saree featuring intricate moti work border. Perfect for weddings and festive occasions, crafted with premium silk and adorned with delicate embellishments.',
    material: 'Silk',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'In Stock',
    category: 'Sarees',
    brand: 'Paregrose',
    sku: 'PRG-SAR-001',
  },
  {
    id: 2,
    name: 'Bollywood Star Suhana Khan Cream Colour Party Wear Saree',
    images: [
      '/images/carousel/pic_2.jpg',
      '/images/carousel/pic_1.jpg',
      '/images/carousel/pic_4.jpg',
    ],
    rating: 4.0,
    reviews: 7,
    originalPrice: 2049.0,
    discountedPrice: 999.0,
    description:
      'Inspired by Bollywood star Suhana Khan, this cream-colored saree blends modern style with traditional charm. Ideal for parties and casual outings.',
    material: 'Georgette',
    size: ['S', 'M', 'L'],
    availability: 'In Stock',
    category: 'Sarees',
    brand: 'Paregrose',
    sku: 'PRG-SAR-002',
  },
];

// Generate dynamic metadata
export async function generateMetadata({ params }) {
  const productId = parseInt(params.id);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  const discountPercentage = Math.round((1 - product.discountedPrice / product.originalPrice) * 100);
  
  return {
    title: `${product.name} - ${discountPercentage}% OFF | Paregrose`,
    description: `${product.description} Shop now at ₹${product.discountedPrice} (was ₹${product.originalPrice}). ${product.rating}★ rated by ${product.reviews} customers. Free shipping available.`,
    keywords: [
      product.name.toLowerCase(),
      product.category.toLowerCase(),
      product.material.toLowerCase(),
      'ethnic wear',
      'saree',
      'party wear',
      'traditional wear',
      'premium fashion',
      'designer saree',
      'indian wear'
    ],
    openGraph: {
      title: `${product.name} - ${discountPercentage}% OFF`,
      description: product.description,
      url: `https://paregrose.com/product/${product.id}`,
      images: [
        {
          url: product.images[0],
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
      title: `${product.name} - ${discountPercentage}% OFF`,
      description: product.description,
      images: [product.images[0]],
    },
    alternates: {
      canonical: `https://paregrose.com/product/${product.id}`,
    },
    other: {
      'product:price:amount': product.discountedPrice.toString(),
      'product:price:currency': 'INR',
      'product:availability': product.availability.toLowerCase(),
      'product:condition': 'new',
      'product:brand': product.brand,
      'product:sku': product.sku,
    },
  };
}

// Structured data for SEO
function generateStructuredData(product) {
  const discountPercentage = Math.round((1 - product.discountedPrice / product.originalPrice) * 100);
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    sku: product.sku,
    category: product.category,
    offers: {
      '@type': 'Offer',
      price: product.discountedPrice,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      seller: {
        '@type': 'Organization',
        name: 'Paregrose',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews,
      bestRating: 5,
      worstRating: 1,
    },
    material: product.material,
    size: product.size,
  };
}

export default function ProductDetail({ params }) {
  const productId = parseInt(params.id);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return <div className="text-center text-gray-600 py-20">Product not found</div>;
  }

  const structuredData = generateStructuredData(product);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}

