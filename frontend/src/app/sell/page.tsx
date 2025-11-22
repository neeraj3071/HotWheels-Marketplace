"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SellRedirect() {
  const router = useRouter();

  useEffect(() => {
    // redirect to listing create page
    router.replace('/listings/create');
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <p className="text-gray-600">Redirecting to the listing creation page…</p>
    </div>
  );
}
