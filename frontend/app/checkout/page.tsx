'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', line1: '', city: '', postcode: '', country: 'GB', notes: '',
  });
  const [error, setError] = useState('');

  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data } = await api.get('/cart');
      return data;
    },
    enabled: !!user,
  });

  const orderMutation = useMutation({
    mutationFn: async () => {
      const address = {
        name: form.name,
        line1: form.line1,
        city: form.city,
        postcode: form.postcode,
        country: form.country,
      };
      const { data } = await api.post('/orders', {
        shipping_address: address,
        billing_address: address,
        notes: form.notes,
      });
      return data;
    },
    onSuccess: (data) => {
      router.push(`/orders/${data.data.id}?success=true`);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Order failed. Please try again.');
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <Link href="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-xl inline-block">Login to Checkout</Link>
        </div>
      </div>
    );
  }

  const items = cartData?.data?.items ?? [];
  const subtotal = items.reduce((sum: number, item: any) =>
    sum + (parseFloat(item.unit_price) * item.quantity), 0
  );
  const tax = subtotal * 0.20;
  const shipping = subtotal >= 50 ? 0 : 4.99;
  const total = subtotal + tax + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.line1 || !form.city || !form.postcode) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    orderMutation.mutate();
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Shipping Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border p-6">
                <h2 className="font-bold text-lg mb-4">Shipping Address</h2>

                {error && (
                  <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Address Line 1 *</label>
                    <input
                      type="text"
                      required
                      value={form.line1}
                      onChange={(e) => setForm({ ...form, line1: e.target.value })}
                      className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="123 High Street"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="London"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Postcode *</label>
                      <input
                        type="text"
                        required
                        value={form.postcode}
                        onChange={(e) => setForm({ ...form, postcode: e.target.value })}
                        className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="SW1A 1AA"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Order Notes (optional)</label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      rows={3}
                      placeholder="Any special instructions..."
                    />
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white rounded-2xl border p-6">
                <h2 className="font-bold text-lg mb-4">Payment</h2>
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center gap-3">
                  <span className="text-2xl">🔒</span>
                  <div>
                    <p className="text-sm font-medium text-indigo-700">Secure Demo Payment</p>
                    <p className="text-xs text-indigo-500">This is a demo — no real payment required</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border p-6 sticky top-24">
                <h2 className="font-bold text-lg mb-4">Order Summary</h2>

                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate-600 truncate mr-2">
                        {item.product?.name} × {item.quantity}
                      </span>
                      <span className="font-medium shrink-0">
                        £{(parseFloat(item.unit_price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span>£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600' : ''}>
                      {shipping === 0 ? 'Free' : `£${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tax (20%)</span>
                    <span>£{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>£{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={orderMutation.isPending || items.length === 0}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition"
                >
                  {orderMutation.isPending ? 'Placing Order...' : 'Place Order →'}
                </button>

                <Link href="/cart" className="block text-center text-sm text-slate-500 hover:text-indigo-600 mt-3 transition">
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}