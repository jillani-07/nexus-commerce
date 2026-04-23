<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $cacheKey = 'products:' . md5(json_encode($request->all()));

        $products = Cache::remember($cacheKey, 300, function () use ($request) {
            $query = Product::with(['primaryImage', 'category'])
                ->where('is_active', true)
                ->where('in_stock', true);

            if ($request->filled('category')) {
                $query->whereHas('category', fn($q) =>
                    $q->where('slug', $request->category)
                );
            }

            if ($request->filled('search')) {
                $search = strip_tags($request->search);
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'ilike', "%{$search}%")
                      ->orWhere('description', 'ilike', "%{$search}%");
                });
            }

            if ($request->filled('min_price')) {
                $query->where('price', '>=', (float) $request->min_price);
            }

            if ($request->filled('max_price')) {
                $query->where('price', '<=', (float) $request->max_price);
            }

            $sortBy = in_array($request->sort, ['price', 'name', 'created_at'])
                ? $request->sort : 'created_at';
            $sortDir = $request->sort_dir === 'asc' ? 'asc' : 'desc';

            return $query->orderBy($sortBy, $sortDir)
                         ->paginate(min($request->per_page ?? 12, 50));
        });

        return response()->json($products);
    }

    public function show(string $slug): JsonResponse
    {
        $product = Cache::remember("product:{$slug}", 300, function () use ($slug) {
            return Product::with(['images', 'category'])
                ->where('slug', $slug)
                ->where('is_active', true)
                ->firstOrFail();
        });

        return response()->json(['product' => $product]);
    }
}