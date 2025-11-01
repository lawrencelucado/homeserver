export default function Services() {
  const services = [
    {
      title: "Alterations & Repairs",
      description: "Expert alterations for all types of clothing. From hemming pants to taking in dresses, we ensure the perfect fit for your wardrobe.",
      features: ["Hemming & resizing", "Zipper replacements", "Button repairs", "Seam repairs", "Jacket alterations"]
    },
    {
      title: "Custom Tailoring",
      description: "Bespoke tailoring services for custom garments made to your exact specifications. Quality craftsmanship that brings your vision to life.",
      features: ["Custom suits & dresses", "Wedding attire", "Special occasion outfits", "Traditional Nigerian attire", "Fabric consultation"]
    },
    {
      title: "Express Services",
      description: "Need it fast? We offer rush alterations and tailoring for time-sensitive occasions without compromising quality.",
      features: ["Same-day alterations", "Rush orders", "Emergency repairs", "Last-minute fittings"]
    },
    {
      title: "Fabric Sourcing",
      description: "Access to premium fabrics and materials for your custom projects. We help you find the perfect fabric for your design.",
      features: ["Traditional Nigerian fabrics", "Premium suit materials", "Special occasion fabrics", "Expert recommendations"]
    }
  ];

  return (
    <main className="min-h-screen p-8 md:p-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Professional alterations, custom tailoring, and fashion expertise for all your clothing needs
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 dark:border-gray-700 p-8 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-bold mb-4">{service.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-100 dark:bg-gray-800 rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Contact us today to discuss your alterations or custom tailoring needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Contact Us
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

        {/* Back to Home */}
        <div className="text-center mt-8">
          <a href="/" className="text-blue-600 hover:underline">← Back to Home</a>
        </div>
      </div>
    </main>
  );
}
