'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import { useState } from 'react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data.data;
    },
  });

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setAdding(true);
    try {
      await api.post('/cart/items', {
        product_id: id,
        quantity,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      alert('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin text-4xl">⏳</div>
    </div>
  );

  if (isError || !data) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">❌</div>
        <p className="text-red-500">Product not found.</p>
        <Link href="/products" className="text-indigo-600 hover:underline mt-4 inline-block">
          Back to Products
        </Link>
      </div>
    </div>
  );

  const price = data.sale_price ?? data.price;
  const images = data.images ?? [];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b px-6 py-3">
        <div className="max-w-6xl mx-auto text-sm text-slate-500 flex gap-2">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-indigo-600">Products</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">{data.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

            {/* Image */}
            <div className="bg-slate-100 h-96 md:h-auto flex items-center justify-center p-8">
              {images[0]?.image_url ? (
                <img
                  src={images[0].image_url}
                  alt={data.name}
                  className="max-h-80 w-full object-contain"
                />
              ) : (
                <div className="text-8xl">📦</div>
              )}
            </div>

            {/* Details */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                <span className="inline-block bg-indigo-50 text-indigo-600 text-xs px-3 py-1 rounded-full mb-3 font-medium">
                  {data.category?.name}
                </span>
                <h1 className="text-2xl font-bold mb-3">{data.name}</h1>
                <p className="text-slate-500 text-sm mb-6">{data.short_description}</p>

                {/* Price */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-bold text-slate-900">£{price}</span>
                  {data.sale_price && (
                    <>
                      <span className="text-lg text-slate-400 line-through">£{data.price}</span>
                      <span className="bg-red-50 text-red-500 text-sm px-2 py-0.5 rounded-full font-medium">
                        Save £{(data.price - data.sale_price).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>

                {/* Stock */}
                <div className="flex items-center gap-2 mb-6">
                  <div className={`w-2 h-2 rounded-full ${data.stock_quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}/>
                  <span className="text-sm text-slate-600">
                    {data.stock_quantity > 0 ? `${data.stock_quantity} in stock` : 'Out of stock'}
                  </span>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-sm font-medium text-slate-700">Quantity:</span>
                  <div className="flex items-center border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-slate-100 transition font-bold"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(data.stock_quantity, quantity + 1))}
                      className="px-4 py-2 hover:bg-slate-100 transition font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={adding || data.stock_quantity === 0}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition"
                >
                  {added ? '✓ Added!' : adding ? 'Adding...' : 'Add to Cart'}
                </button>
                <Link
                  href="/cart"
                  className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-xl font-semibold transition"
                >
                  View Cart
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t">
                {[
                  { icon: '🚚', text: 'Free Shipping' },
                  { icon: '↩️', text: 'Easy Returns' },
                  { icon: '🔒', text: 'Secure Payment' },
                ].map((b) => (
                  <div key={b.text} className="flex flex-col items-center gap-1 text-center">
                    <span className="text-xl">{b.icon}</span>
                    <span className="text-xs text-slate-500">{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}