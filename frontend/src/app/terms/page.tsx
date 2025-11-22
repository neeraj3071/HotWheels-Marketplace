export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-600 mb-4">Terms of Service</h1>
        <p className="text-gray-700 mb-4">Last updated: November 2025</p>

        <section className="mb-4">
          <h2 className="font-semibold mb-2">Overview</h2>
          <p className="text-gray-700">These Terms govern your use of Hot Wheels Marketplace. By accessing or using the service, you agree to these Terms.</p>
        </section>

        <section className="mb-4">
          <h2 className="font-semibold mb-2">Accounts</h2>
          <p className="text-gray-700">You are responsible for your account, maintaining its security, and for all activities that occur under your account.</p>
        </section>

        <section className="mb-4">
          <h2 className="font-semibold mb-2">Listings & Transactions</h2>
          <p className="text-gray-700">Sellers are solely responsible for the accuracy of their listings and for fulfilling transactions with buyers.</p>
        </section>

        <section className="mb-4">
          <h2 className="font-semibold mb-2">Limitations of Liability</h2>
          <p className="text-gray-700">To the fullest extent permitted by law, Hot Wheels Marketplace is not liable for indirect or consequential damages arising from use of the service.</p>
        </section>

        <p className="text-sm text-gray-500">This is a template Terms of Service. Please review with legal counsel for production use.</p>
      </div>
    </div>
  );
}
