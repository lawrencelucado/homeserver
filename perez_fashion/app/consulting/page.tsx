export default function Consulting() {
  const consultingServices = [
    {
      title: "Nigerian Wedding Fashion",
      description: "Expert guidance for traditional Nigerian wedding attire including Aso Ebi coordination, fabric selection, and styling for brides, grooms, and wedding parties.",
      highlights: [
        "Traditional attire consultation",
        "Aso Ebi coordination & sourcing",
        "Bridal & groom styling",
        "Color scheme guidance",
        "Cultural fashion expertise"
      ]
    },
    {
      title: "Special Events Styling",
      description: "Professional styling services for all your special occasions. From corporate events to cultural celebrations, we help you make the perfect impression.",
      highlights: [
        "Event wardrobe planning",
        "Outfit selection & coordination",
        "Color & style recommendations",
        "Accessory consultation",
        "Cultural event expertise"
      ]
    },
    {
      title: "Virtual Consultations",
      description: "Connect with us from anywhere! Our virtual consulting services bring expert fashion advice to your home via video call.",
      highlights: [
        "Video call appointments",
        "Remote styling advice",
        "Digital lookbooks",
        "Online fabric viewing",
        "Convenient scheduling"
      ]
    }
  ];

  return (
    <main className="min-h-screen p-8 md:p-24">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Fashion Consulting</h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Expert fashion guidance for Nigerian weddings, special events, and everything in between.
            Let us help you look your absolute best.
          </p>
        </div>

        {/* Consulting Services */}
        <div className="space-y-8 mb-16">
          {consultingServices.map((service, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 dark:border-gray-700 p-8 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{service.title}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                {service.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {service.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start">
                    <span className="text-green-600 mr-2 text-xl">✓</span>
                    <span className="text-gray-700 dark:text-gray-200">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Why Choose Perez Fashion?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">👗</div>
              <h3 className="font-bold text-xl mb-2">Cultural Expertise</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Deep understanding of Nigerian fashion traditions and modern styling
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-bold text-xl mb-2">Personalized Service</h3>
              <p className="text-gray-600 dark:text-gray-300">
                One-on-one attention tailored to your unique vision and needs
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="font-bold text-xl mb-2">Proven Results</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Years of experience creating stunning looks for special occasions
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-100 dark:bg-gray-800 rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Consultation?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Let's discuss your vision and create something beautiful together
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Schedule Consultation
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
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            Virtual consultations available by appointment
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <a href="/" className="text-blue-600 hover:underline">← Back to Home</a>
        </div>
      </div>
    </main>
  );
}
