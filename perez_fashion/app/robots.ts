import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = 'https://perezfashion.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    host: base,
    sitemap: `${base}/sitemap.xml`,
  };
}

