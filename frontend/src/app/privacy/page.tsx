export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-600 mb-4">Privacy Policy</h1>
        <p className="text-gray-700 mb-4">Last updated: November 2025</p>

        <section className="mb-4">
          <h2 className="font-semibold mb-2">Information We Collect</h2>
          <p className="text-gray-700">We collect information you provide (account details, listings, messages) and usage data to operate and improve the service.</p>
        </section>

        <section className="mb-4">
          <h2 className="font-semibold mb-2">How We Use Information</h2>
          <p className="text-gray-700">We use data to provide core functionality, communicate with users, and improve the platform. We do not sell personal data.</p>
        </section>

        <section className="mb-4">
          <h2 className="font-semibold mb-2">Cookies & Tracking</h2>
          <p className="text-gray-700">We use cookies and similar technologies for session management and analytics.</p>
        </section>

        <p className="text-sm text-gray-500">This privacy policy is a basic template — adapt it to your production needs and consult legal counsel if necessary.</p>
      </div>
    </div>
  );
}
