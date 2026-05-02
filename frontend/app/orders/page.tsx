'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store/authStore';
import Link from 'next/link';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-600',
  confirmed: 'bg-blue-50 text-blue-600',
  processing: 'bg-indigo-50 text-indigo-600',
  shipped: 'bg-purple-50 text-purple-600',
  delivered: 'bg-green-50 text-green-600',
  cancelled: 'bg-red-50 text-red-600',
  refunded: 'bg-slate-50 text-slate-600',
};

export default function OrdersPage() {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await api.get('/orders');
      return data;
    },
    enabled: !!user,
  });

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <Link href="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-xl">Login</Link>
    </div>
  );

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-4xl animate-spin">⏳</div>
    </div>
  );

  const orders = data?.data ?? [];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">My Orders</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-bold mb-2">No orders yet</h2>
            <Link href="/products" className="bg-indigo-600 text-white px-8 py-3 rounded-xl inline-block mt-4 hover:bg-indigo-500 transition">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-white rounded-2xl border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold">{order.order_number}</h3>
                    <p className="text-slate-500 text-sm">
                      {new Date(order.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusColors[order.status] ?? 'bg-slate-50 text-slate-600'}`}>
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    {order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''}
                  </p>
                  <p className="font-bold text-lg">£{order.total_amount}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}