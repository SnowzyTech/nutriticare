import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api',
          '/checkout',
          '/login',
          '/signup',
          '/*.json',
          '/private',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
    sitemap: 'https://nutriticare.com/sitemap.xml',
    host: 'https://nutriticare.com',
  }
}
