'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { Suspense } from 'react';

interface Product {
  id: string;
  name: string;
  price: string;
  sale_price: string | null;
  short_description: string;
  category: { name: string; slug: string };
  primary_image: { image_url: string } | null;
}

function ProductsGrid() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const categoryId = searchParams.get('category_id') ?? '';

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', search, categoryId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (categoryId) params.set('category_id', categoryId);
      params.set('per_page', '12');
      const { data } = await api.get(`/products?${params.toString()}`);
      return data;
    },
  });

  if (isLoading) return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden border animate-pulse">
          <div className="h-52 bg-slate-200"/>
          <div className="p-4 space-y-2">
            <div className="h-3 bg-slate-200 rounded w-1/2"/>
            <div className="h-4 bg-slate-200 rounded w-3/4"/>
            <div className="h-4 bg-slate-200 rounded w-1/3"/>
          </div>
        </div>
      ))}
    </div>
  );

  if (isError) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">❌</div>
      <p className="text-red-500">Error loading products.</p>
    </div>
  );

  if (!data?.data?.length) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">🔍</div>
      <p className="text-slate-500">No products found.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
      {data.data.map((product: Product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="bg-white rounded-2xl overflow-hidden border hover:shadow-xl transition group"
        >
          <div className="relative h-52 overflow-hidden bg-slate-100">
            {product.primary_image?.image_url ? (
              <img
                src={product.primary_image.image_url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
            )}
            {product.sale_price && (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                Sale
              </span>
            )}
          </div>
          <div className="p-4">
            <span className="text-xs text-indigo-600 font-medium">{product.category?.name}</span>
            <h3 className="font-semibold text-sm mt-1 mb-2 line-clamp-2 group-hover:text-indigo-600 transition">
              {product.name}
            </h3>
            <p className="text-slate-400 text-xs mb-3 line-clamp-1">{product.short_description}</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-bold text-slate-900">£{product.sale_price ?? product.price}</span>
              {product.sale_price && (
                <span className="text-xs text-slate-400 line-through">£{product.price}</span>
              )}
            </div>
            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl text-xs font-medium transition">
              Add to Cart
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold">All Products</h1>
          <p className="text-slate-500 mt-1">Browse our collection</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <ProductsGrid />
        </Suspense>
      </div>
    </main>
  );
}