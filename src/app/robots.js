export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cart', '/wishlist', '/admin', '/api/'],
    },
    sitemap: 'https://paregrose.com/sitemap.xml',
  };
}
