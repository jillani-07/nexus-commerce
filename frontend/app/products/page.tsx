'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  sale_price: string | null;
  short_description: string;
  category: { name: string };
  primary_image: { image_url: string } | null;
}

async function fetchProducts() {
  const { data } = await api.get('/products');
  return data;
}

export default function ProductsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (isError) return <div className="p-10 text-center text-red-500">Error loading products.</div>;

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.data?.map((product: Product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="border rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="bg-slate-100 h-48 rounded-md mb-4 flex items-center justify-center text-slate-400">
              No Image
            </div>
            <p className="text-xs text-slate-400 mb-1">{product.category?.name}</p>
            <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
            <div className="flex items-center gap-2">
              {product.sale_price ? (
                <>
                  <span className="font-bold text-slate-900">£{product.sale_price}</span>
                  <span className="text-sm text-slate-400 line-through">£{product.price}</span>
                </>
              ) : (
                <span className="font-bold">£{product.price}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}