import Image from "next/image";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Perez Fashion",
    "description": "Alterations, Tailoring & Event Fashion Consulting",
    "url": "https://perezfashion.com",
    "telephone": "+13463031855",
    "email": "contact@perezfashion.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Richmond",
      "addressRegion": "TX",
      "addressCountry": "US"
    },
    "priceRange": "$$",
    "sameAs": [
      "https://wa.me/13463031855"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <header className="w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center lg:text-left">Perez Fashion</h1>
        <p className="text-lg text-center lg:text-left">Alterations, Tailoring & Event Fashion Consulting</p>
      </header>

      <div className="text-center mt-12">
        <h2 className="text-2xl font-bold">Your Vision, Perfectly Tailored</h2>
        <p className="mt-4 text-lg">From everyday alterations to stunning custom designs, we bring your fashion ideas to life.</p>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <a
          href="/services"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Services{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Find in-depth information about our services.
          </p>
        </a>

        <a
          href="/consulting"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Consulting{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn about our fashion consulting services.
          </p>
        </a>

        <a
          href="/contact"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Contact{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Get in touch with us.
          </p>
        </a>

        <a
          href="/gallery"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Gallery{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Explore our work.
          </p>
        </a>
      </div>

      <footer className="w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="text-center">
          <p><strong>Email:</strong> contact@perezfashion.com</p>
          <p><strong>Phone:</strong> +1 346-303-1855</p>
          <p><strong>WhatsApp:</strong> <a href="https://wa.me/13463031855" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">+1 346-303-1855</a></p>
        </div>
      </footer>
    </main>
    </>
  );
}
