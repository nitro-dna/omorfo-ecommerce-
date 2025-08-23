import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/auth/',
          '/account/',
          '/checkout/',
          '/cart',
          '/search',
          '*.json',
          '*.xml',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/auth/',
          '/account/',
          '/checkout/',
          '/cart',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/auth/',
          '/account/',
          '/checkout/',
          '/cart',
        ],
      },
    ],
    sitemap: 'https://omorfo.com/sitemap.xml',
    host: 'https://omorfo.com',
  }
}
