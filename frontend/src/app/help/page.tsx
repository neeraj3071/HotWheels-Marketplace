import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-600 mb-4">Help Center</h1>
        <p className="text-gray-700 mb-6">Quick answers to common questions about buying, selling, and account management.</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Buying</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Use filters to find listings by rarity, condition, price, or series.</li>
            <li>Inspect images and seller ratings before purchasing.</li>
            <li>Contact sellers via the messaging interface on listing pages.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Selling</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Create a clear title and description highlighting model, year, and condition.</li>
            <li>Upload multiple photos — we recommend 4:3 aspect ratio for best display.</li>
            <li>Set a fair price and respond promptly to messages from buyers.</li>
            <li>Start a new listing: <Link href="/listings/create" className="text-orange-600 hover:underline">Create a Listing</Link>.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Account</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Reset your password on the login page if needed.</li>
            <li>Update profile details from your profile edit page.</li>
          </ul>
        </section>

        <p className="text-sm text-gray-500">Still need help? <Link href="/contact" className="text-orange-600 hover:underline">Contact us</Link> and we'll get back to you.</p>
      </div>
    </div>
  );
}
