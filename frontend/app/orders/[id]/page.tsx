'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { Suspense } from 'react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-600',
  confirmed: 'bg-blue-50 text-blue-600',
  processing: 'bg-indigo-50 text-indigo-600',
  shipped: 'bg-purple-50 text-purple-600',
  delivered: 'bg-green-50 text-green-600',
  cancelled: 'bg-red-50 text-red-600',
};

function OrderDetail() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';

  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${id}`);
      return data.data;
    },
  });

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-4xl animate-spin">⏳</div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500">Order not found.</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50">
      {isSuccess && (
        <div className="bg-green-500 text-white text-center py-4">
          <div className="text-2xl mb-1">🎉</div>
          <p className="font-semibold">Order placed successfully! Thank you for your purchase.</p>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold">{data.order_number}</h1>
              <p className="text-slate-500 text-sm">
                {new Date(data.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            </div>
            <span className={`text-sm px-3 py-1 rounded-full font-medium capitalize ${statusColors[data.status] ?? 'bg-slate-50 text-slate-600'}`}>
              {data.status}
            </span>
          </div>

          {/* Shipping Address */}
          <div className="bg-slate-50 rounded-xl p-4 mb-4">
            <h3 className="font-semibold text-sm mb-2">Shipping Address</h3>
            <p className="text-sm text-slate-600">{data.shipping_address?.name}</p>
            <p className="text-sm text-slate-600">{data.shipping_address?.line1}</p>
            <p className="text-sm text-slate-600">{data.shipping_address?.city}, {data.shipping_address?.postcode}</p>
          </div>

          {/* Items */}
          <h3 className="font-semibold mb-3">Items</h3>
          <div className="space-y-3 mb-4">
            {data.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-sm">{item.product_name}</p>
                  <p className="text-xs text-slate-400">SKU: {item.product_sku} × {item.quantity}</p>
                </div>
                <p className="font-semibold">£{item.total_price}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span>£{data.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Tax</span>
              <span>£{data.tax_amount}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>£{data.total_amount}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Link href="/orders" className="flex-1 border border-indigo-600 text-indigo-600 py-3 rounded-xl font-semibold text-center hover:bg-indigo-50 transition">
            All Orders
          </Link>
          <Link href="/products" className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold text-center hover:bg-indigo-500 transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-4xl animate-spin">⏳</div></div>}>
      <OrderDetail />
    </Suspense>
  );
}