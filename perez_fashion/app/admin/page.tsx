import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic'; // Don't prerender at build time

export default async function AdminDashboard() {
  // Get statistics from database
  const [galleryCount, blogCount, visibleGalleryCount] = await Promise.all([
    prisma.galleryItem.count(),
    prisma.blogPost.count(),
    prisma.galleryItem.count({ where: { isVisible: true } }),
  ]);

  const stats = [
    {
      name: 'Gallery Items',
      value: galleryCount,
      description: `${visibleGalleryCount} visible`,
      href: '/admin/gallery',
      color: 'bg-blue-500',
    },
    {
      name: 'Blog Posts',
      value: blogCount,
      description: 'Total posts',
      href: '/admin/blog',
      color: 'bg-green-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome to your admin panel
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="relative bg-white dark:bg-gray-800 pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <dt>
              <div className={`absolute ${stat.color} rounded-md p-3`}>
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                {stat.description}
              </p>
            </dd>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/admin/gallery"
            className="relative rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 dark:hover:border-gray-600 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
          >
            <div className="flex-shrink-0">
              <span className="text-2xl">📸</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Add Gallery Item
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                Upload before/after photos
              </p>
            </div>
          </Link>

          <Link
            href="/admin/blog"
            className="relative rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 dark:hover:border-gray-600 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
          >
            <div className="flex-shrink-0">
              <span className="text-2xl">✍️</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Write Blog Post
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                Create new blog content
              </p>
            </div>
          </Link>

          <Link
            href="/gallery"
            target="_blank"
            className="relative rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 dark:hover:border-gray-600"
          >
            <div className="flex-shrink-0">
              <span className="text-2xl">👁️</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                View Gallery
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                See public gallery page
              </p>
            </div>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="relative rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 dark:hover:border-gray-600"
          >
            <div className="flex-shrink-0">
              <span className="text-2xl">🏠</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                View Website
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                Visit main site
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* System Info */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
          📊 System Information
        </h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>✅ Database: SQLite (Self-hosted)</li>
          <li>✅ Storage: Local filesystem</li>
          <li>✅ Authentication: NextAuth.js</li>
          <li>💾 Database location: /data/db.sqlite</li>
          <li>📁 Uploads location: /public/uploads</li>
        </ul>
      </div>
    </div>
  );
}
