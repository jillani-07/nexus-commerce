import Link from 'next/link';
import api from '@/lib/api';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

async function getFeaturedProducts() {
  try {
    const { data } = await api.get('/products?featured=true&per_page=8');
    return data.data ?? [];
  } catch (e) {
    console.error('Featured products error:', e);
    return [];
  }
}

async function getCategories() {
  try {
    const { data } = await api.get('/categories');
    return data.data ?? [];
  } catch (e) {
    console.error('Categories error:', e);
    return [];
  }
}

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <main className="min-h-screen bg-white">

      {/* Hero Banner */}
      <section className="relative h-[580px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"/>
        <div className="relative h-full flex items-center px-10 max-w-6xl mx-auto">
          <div className="text-white max-w-lg">
            <span className="inline-block bg-indigo-500 text-white text-xs px-3 py-1 rounded-full mb-4 font-medium tracking-wide uppercase">
              New Season Arrivals
            </span>
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Shop Smarter with<br />
              <span className="text-indigo-400">Nexus Commerce</span>
            </h1>
            <p className="text-slate-300 text-lg mb-8">
              Discover premium products at unbeatable prices. Fast delivery, easy returns.
            </p>
            <div className="flex gap-4">
              <Link href="/products" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-semibold transition">
                Shop Now →
              </Link>
              <Link href="/register" className="border border-white/40 hover:border-white text-white px-8 py-3 rounded-xl font-semibold transition">
                Join Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-indigo-600 text-white py-4">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-around gap-4 text-center">
          {[
            { v: 'Free Shipping', s: 'On orders over £50' },
            { v: 'Easy Returns', s: '30-day return policy' },
            { v: 'Secure Payment', s: '256-bit SSL encryption' },
            { v: '24/7 Support', s: 'Always here to help' },
          ].map((i) => (
            <div key={i.v}>
              <div className="font-bold text-sm">{i.v}</div>
              <div className="text-indigo-200 text-xs">{i.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-14 px-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Shop by Category</h2>
            <p className="text-slate-500 text-sm mt-1">Find exactly what you are looking for</p>
          </div>
          <Link href="/products" className="text-indigo-600 hover:underline text-sm font-medium">
            View All →
          </Link>
        </div>
        {categories.length === 0 ? (
          <p className="text-slate-400 text-sm">No categories found</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {categories.slice(0, 7).map((cat: any) => (
              <Link
                key={cat.id}
                href={`/products?category_id=${cat.id}`}
                className="group flex flex-col items-center gap-2"
              >
                <div className="w-full aspect-square rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-indigo-400 transition">
                  {cat.image_url ? (
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-3xl">🛍️</div>
                  )}
                </div>
                <span className="text-xs font-medium text-center text-slate-700 group-hover:text-indigo-600 transition">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="py-14 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Featured Products</h2>
              <p className="text-slate-500 text-sm mt-1">Handpicked just for you</p>
            </div>
            <Link href="/products" className="text-indigo-600 hover:underline text-sm font-medium">
              View All →
            </Link>
          </div>
          {featured.length === 0 ? (
            <p className="text-slate-400 text-sm">No featured products found</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {featured.map((product: any) => (
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
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">
                        £{product.sale_price ?? product.price}
                      </span>
                      {product.sale_price && (
                        <span className="text-xs text-slate-400 line-through">£{product.price}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Banner Strip */}
      <section className="py-14 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="relative h-52 rounded-2xl overflow-hidden"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800')", backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-8">
              <p className="text-white/80 text-sm mb-1">Limited Time</p>
              <h3 className="text-white text-2xl font-bold mb-3">Up to 50% Off</h3>
              <Link href="/products" className="bg-white text-slate-900 px-5 py-2 rounded-lg text-sm font-semibold w-fit hover:bg-slate-100 transition">
                Shop Now
              </Link>
            </div>
          </div>
          <div
            className="relative h-52 rounded-2xl overflow-hidden"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800')", backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-8">
              <p className="text-white/80 text-sm mb-1">New Collection</p>
              <h3 className="text-white text-2xl font-bold mb-3">Fashion Trends 2025</h3>
              <Link href="/products?category_id=clothing" className="bg-white text-slate-900 px-5 py-2 rounded-lg text-sm font-semibold w-fit hover:bg-slate-100 transition">
                Explore
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-3">Ready to start shopping?</h2>
        <p className="text-indigo-100 mb-8">Join thousands of happy customers today.</p>
        <Link href="/register" className="bg-white text-indigo-600 px-10 py-3 rounded-xl font-bold hover:bg-indigo-50 transition inline-block">
          Create Free Account
        </Link>
      </section>

    </main>
  );
}