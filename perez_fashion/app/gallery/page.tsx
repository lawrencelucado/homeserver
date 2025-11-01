import { prisma } from '@/lib/prisma';
import Image from 'next/image';

export const revalidate = 60; // Revalidate every 60 seconds
export const dynamic = 'force-dynamic'; // Don't prerender at build time

export default async function Gallery() {
  // Fetch visible gallery items from database
  const galleryItems = await prisma.galleryItem.findMany({
    where: { isVisible: true },
    orderBy: [
      { displayOrder: 'asc' },
      { createdAt: 'desc' },
    ],
  });

  return (
    <main className="min-h-screen p-8 md:p-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Work</h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Browse our portfolio of alterations, custom tailoring, and fashion consulting projects.
            See the transformation from start to finish.
          </p>
        </div>

        {galleryItems.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📸</div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              Gallery Coming Soon
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We're adding our best work. Check back soon to see our amazing transformations!
            </p>
          </div>
        ) : (
          <>
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Before/After Images */}
                  <div className="grid grid-cols-2 gap-1 bg-gray-100 dark:bg-gray-800">
                    <div className="relative aspect-[3/4]">
                      <div className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-1 text-xs font-semibold rounded z-10">
                        BEFORE
                      </div>
                      <Image
                        src={item.beforeImagePath}
                        alt={`${item.title} - Before`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                    </div>
                    <div className="relative aspect-[3/4]">
                      <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 text-xs font-semibold rounded z-10">
                        AFTER
                      </div>
                      <Image
                        src={item.afterImagePath}
                        alt={`${item.title} - After`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    {item.description && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {item.description}
                      </p>
                    )}
                    {item.category && item.category !== 'general' && (
                      <span className="inline-block mt-2 text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                        {item.category}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="text-center bg-gray-100 dark:bg-gray-800 rounded-lg p-12 mb-8">
              <h2 className="text-3xl font-bold mb-4">Ready for Your Transformation?</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Let us bring your vision to life with our expert alterations and custom tailoring
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </a>
                <a
                  href="https://wa.me/13463031855"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </>
        )}

        {/* Back to Home */}
        <div className="text-center">
          <a href="/" className="text-blue-600 hover:underline">← Back to Home</a>
        </div>
      </div>
    </main>
  );
}
