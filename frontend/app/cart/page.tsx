'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data } = await api.get('/cart');
      return data;
    },
    enabled: !!user,
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => api.delete(`/cart/items/${itemId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      api.put(`/cart/items/${itemId}`, { quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold mb-2">Please login to view cart</h2>
          <Link href="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-xl inline-block mt-4 hover:bg-indigo-500 transition">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-4xl animate-spin">⏳</div>
    </div>
  );

  const items = data?.data?.items ?? [];
  const total = items.reduce((sum: number, item: any) =>
    sum + (parseFloat(item.unit_price) * item.quantity), 0
  );

  if (items.length === 0) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-6">Add some products to get started</p>
        <Link href="/products" className="bg-indigo-600 text-white px-8 py-3 rounded-xl inline-block hover:bg-indigo-500 transition font-semibold">
          Browse Products
        </Link>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
          <p className="text-slate-500 text-sm">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item: any) => (
              <div key={item.id} className="bg-white rounded-2xl border p-4 flex gap-4">
                {/* Image */}
                <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                  {item.product?.primary_image?.image_url ? (
                    <img
                      src={item.product.primary_image.image_url}
                      alt={item.product?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1 truncate">{item.product?.name}</h3>
                  <p className="text-slate-500 text-xs mb-3">{item.product?.category?.name}</p>

                  <div className="flex items-center justify-between">
                    {/* Quantity */}
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button
                        onClick={() => {
                          if (item.quantity <= 1) {
                            removeMutation.mutate(item.id);
                          } else {
                            updateMutation.mutate({ itemId: item.id, quantity: item.quantity - 1 });
                          }
                        }}
                        className="px-3 py-1 hover:bg-slate-100 transition text-sm font-bold"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateMutation.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                        className="px-3 py-1 hover:bg-slate-100 transition text-sm font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold text-slate-900">
                        £{(parseFloat(item.unit_price) * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-400">£{item.unit_price} each</p>
                    </div>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeMutation.mutate(item.id)}
                  className="text-slate-400 hover:text-red-500 transition text-lg self-start"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border p-6 sticky top-24">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Shipping</span>
                  <span className="text-green-600">{total >= 50 ? 'Free' : '£4.99'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tax (20%)</span>
                  <span>£{(total * 0.20).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>£{(total * 1.20 + (total >= 50 ? 0 : 4.99)).toFixed(2)}</span>
                </div>
              </div>

              {total < 50 && (
                <div className="bg-indigo-50 text-indigo-600 text-xs px-3 py-2 rounded-lg mb-4">
                  Add £{(50 - total).toFixed(2)} more for free shipping!
                </div>
              )}

              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold transition mb-3"
              >
                Proceed to Checkout →
              </button>

              <Link
                href="/products"
                className="block text-center text-sm text-slate-500 hover:text-indigo-600 transition"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}