import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ["/blocks", "/profile", "/blocks/schedules", "/blocks/consultations", "/terms", "/privacypolicy", "/signin", "/signup"],
    },
    sitemap: 'https://retold.com.ua/sitemap.xml',
  }
}