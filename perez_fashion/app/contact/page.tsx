export default function Contact() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="mt-4 text-lg">We'd love to hear from you. Here's how you can reach us:</p>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-lg bg-gray-100 p-8 dark:bg-gray-800">
          <h2 className="text-2xl font-bold">Business Information</h2>
          <div className="mt-4 space-y-2">
            <p><strong>Email:</strong> contact@perezfashion.com</p>
            <p><strong>Phone:</strong> +1 346-303-1855</p>
            <p><strong>WhatsApp:</strong> <a href="https://wa.me/13463031855" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">+1 346-303-1855</a></p>
          </div>
        </div>
        <div className="rounded-lg bg-gray-100 p-8 dark:bg-gray-800">
          <h2 className="text-2xl font-bold">Send us a message</h2>
          <form action="https://formspree.io/f/myznoerd" method="POST" className="mt-4 space-y-4">
            <div>
              <label htmlFor="name" className="block font-medium">Your Name</label>
              <input type="text" id="name" name="name" className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="email" className="block font-medium">Your Email</label>
              <input type="email" id="email" name="email" className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="message" className="block font-medium">Message</label>
              <textarea id="message" name="message" rows={4} className="mt-1 block w-full rounded-md border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
            </div>
            <div>
              <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Send Message</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
