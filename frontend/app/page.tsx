import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Nexus Commerce</h1>
          <p className="text-xl text-slate-300 mb-8">
            Premium products, delivered fast.
          </p>
          <Link
            href="/products"
            className="bg-white text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-slate-100 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
            <p className="text-slate-500">On orders over £50</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Secure Payments</h3>
            <p className="text-slate-500">256-bit SSL encryption</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Easy Returns</h3>
            <p className="text-slate-500">30-day return policy</p>
          </div>
        </div>
      </section>
    </main>
  );
}