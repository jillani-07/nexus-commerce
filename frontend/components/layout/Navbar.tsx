'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/lib/api';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } finally {
      logout();
      router.push('/');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${search}`);
    }
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-indigo-600 shrink-0">
          Nexus Commerce
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full border border-slate-200 rounded-xl px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
          </div>
        </form>

        {/* Nav Links */}
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/products" className="text-slate-600 hover:text-indigo-600 text-sm font-medium transition">
            Products
          </Link>

          {user ? (
            <>
              <Link href="/cart" className="text-slate-600 hover:text-indigo-600 text-sm font-medium transition">
                🛒 Cart
              </Link>
              <Link href="/orders" className="text-slate-600 hover:text-indigo-600 text-sm font-medium transition">
                Orders
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin/dashboard" className="text-slate-600 hover:text-indigo-600 text-sm font-medium transition">
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-slate-600 hover:text-red-500 transition font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-600 hover:text-indigo-600 text-sm font-medium transition">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
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