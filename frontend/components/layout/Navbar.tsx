'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } finally {
      logout();
      router.push('/');
    }
  };

  return (
    <nav className="border-b px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Nexus Commerce
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/products" className="text-slate-600 hover:text-slate-900">
            Products
          </Link>

          {user ? (
            <>
              <Link href="/cart" className="text-slate-600 hover:text-slate-900">
                Cart
              </Link>
              <Link href="/orders" className="text-slate-600 hover:text-slate-900">
                Orders
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin/dashboard" className="text-slate-600 hover:text-slate-900">
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-slate-600 hover:text-slate-900"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-600 hover:text-slate-900">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}