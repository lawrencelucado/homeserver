import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://perezfashion.com';
  const routes = ['', '/services', '/consulting', '/contact', '/gallery'];
  const now = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.7,
  }));
}

