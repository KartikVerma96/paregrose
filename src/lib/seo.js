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
    title: {
      default: seoSettings.metaTitle,
      template: `%s | ${seoSettings.metaTitle.split(' - ')[0]}`
    },
    description: seoSettings.metaDescription,
    keywords: seoSettings.metaKeywords.split(',').map(k => k.trim()),
    authors: [{ name: "Paregrose" }],
    creator: "Paregrose",
    publisher: "Paregrose",
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
      locale: 'en_US',
      url: 'https://paregrose.com',
      title: seoSettings.metaTitle,
      description: seoSettings.metaDescription,
      siteName: 'Paregrose',
      images: [
        {
          url: '/images/paregrose_logo.png',
          width: 1200,
          height: 630,
          alt: 'Paregrose - Premium Ethnic Wear',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoSettings.metaTitle,
      description: seoSettings.metaDescription,
      images: ['/images/paregrose_logo.png'],
    },
    verification: {
      google: seoSettings.googleAnalyticsId || 'your-google-verification-code',
    },
    alternates: {
      canonical: 'https://paregrose.com',
    },
  }
}
