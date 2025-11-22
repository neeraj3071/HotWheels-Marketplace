import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-orange-600 mb-4">About Hot Wheels Marketplace</h1>
        <p className="text-gray-700 mb-6">
          Hot Wheels Marketplace is a community-driven platform for collectors and enthusiasts to
          buy, sell, and discover rare Hot Wheels cars. Our mission is to make collecting easier,
          safer, and more fun — whether you're just starting out or have a world-class collection.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Our Values</h2>
        <ul className="text-left list-disc list-inside text-gray-700 space-y-2">
          <li>Community-first: we prioritize collector safety and authenticity.</li>
          <li>Transparency: clear listings, verified sellers, and straightforward fees.</li>
          <li>Passion: built by collectors, for collectors.</li>
        </ul>

        <p className="mt-6 text-gray-700">
          Want to get involved or tell us your story? <Link href="/contact" className="text-orange-600 hover:underline">Contact us</Link> — we'd love to hear from you.
        </p>
      </div>
    </div>
  );
}
