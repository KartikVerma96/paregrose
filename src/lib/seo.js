import { prisma } from '@/lib/db'

// Default SEO settings
const defaultSEOSettings = {
  metaTitle: 'Paregrose - Premium Ethnic Wear & Fashion',
  metaDescription: 'Discover exquisite ethnic wear at Paregrose. Premium sarees, lehengas, gowns, and traditional outfits for women.',
  metaKeywords: 'ethnic wear, sarees, lehengas, gowns, traditional wear, women fashion',
  googleAnalyticsId: '',
  facebookPixelId: ''
}

export async function getSEOSettings() {
  try {
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('postgresql://')) {
      return defaultSEOSettings
    }

    // Fetch SEO settings from database
    const seoSettings = await prisma.business_settings.findMany({
      where: {
        setting_key: {
          startsWith: 'seo.'
        }
      }
    })

    // Convert to object
    const settings = { ...defaultSEOSettings }
    
    seoSettings.forEach(record => {
      const field = record.setting_key.replace('seo.', '')
      if (settings.hasOwnProperty(field)) {
        settings[field] = record.setting_value
      }
    })

    return settings
  } catch (error) {
    console.error('Error fetching SEO settings:', error)
    return defaultSEOSettings
  }
}

export async function generateMetadata() {
  const seoSettings = await getSEOSettings()
  
  return {
    metadataBase: new URL('https://paregrose.com'),
    title: {
      default: seoSettings.metaTitle,
      template: `%s | ${seoSettings.metaTitle.split(' - ')[0]}`
    },
    description: seoSettings.metaDescription,
    keywords: seoSettings.metaKeywords.split(',').map(k => k.trim()),
    authors: [{ name: "Paregrose" }],
    creator: "Paregrose",
    publisher: "Paregrose",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: 'https://paregrose.com',
      title: seoSettings.metaTitle,
      description: seoSettings.metaDescription,
      siteName: 'Paregrose',
      images: [
        {
          url: '/images/carousel/carousel_1.jpg',
          width: 1200,
          height: 630,
          alt: 'Paregrose - Premium Ethnic Wear & Designer Fashion',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoSettings.metaTitle,
      description: seoSettings.metaDescription,
      images: ['/images/carousel/carousel_1.jpg'],
      creator: '@paregrose',
      site: '@paregrose',
    },
    verification: {
      google: seoSettings.googleAnalyticsId || '',
    },
    alternates: {
      canonical: 'https://paregrose.com',
    },
    category: 'Fashion',
  }
}

// Generate Organization structured data
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Paregrose',
    url: 'https://paregrose.com',
    logo: 'https://paregrose.com/images/paregrose_logo.png',
    description: 'Premium Ethnic Wear & Designer Fashion - Discover exquisite sarees, lehengas, gowns, and traditional outfits for women.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      // Add social media links here when available
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
  }
}

// Generate Website structured data
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Paregrose',
    url: 'https://paregrose.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://paregrose.com/shop?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

// Generate Breadcrumb structured data
export function generateBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
