import Link from 'next/link';

const categories = [
  { id: 'new-arrivals', label: 'New Arrivals' },
  { id: 'by-year', label: 'By Year' },
  { id: 'series', label: 'By Series' },
  { id: 'rarity', label: 'By Rarity' },
  { id: 'condition', label: 'By Condition' },
  { id: 'popular', label: 'Popular Picks' }
];

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Categories</h1>

        <div className="grid sm:grid-cols-2 gap-4">
          {categories.map((c) => (
            <Link key={c.id} href={`/listings?category=${encodeURIComponent(c.id)}`} className="block p-4 bg-white rounded shadow hover:shadow-md">
              <h3 className="font-semibold text-gray-800">{c.label}</h3>
              <p className="text-sm text-gray-500">Browse curated listings for {c.label.toLowerCase()}.</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
