<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['category', 'primaryImage'])
            ->where('is_active', true);

        if ($request->filled('category_id')) {
            $category = Category::find($request->category_id);
            if ($category) {
                $categoryIds = $category->children()->pluck('id')->push($category->id);
                $query->whereIn('category_id', $categoryIds);
            }
        }

        if ($request->filled('search')) {
            $query->where('name', 'ilike', '%' . $request->search . '%');
        }

        if ($request->filled('featured')) {
            $query->where('is_featured', true);
        }

        $products = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 12));

        return response()->json($products);
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json([
            'data' => $product->load(['category', 'images']),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id'       => ['required', 'uuid', 'exists:categories,id'],
            'name'              => ['required', 'string', 'max:255'],
            'sku'               => ['required', 'string', 'unique:products,sku'],
            'description'       => ['nullable', 'string'],
            'short_description' => ['nullable', 'string'],
            'price'             => ['required', 'numeric', 'min:0'],
            'sale_price'        => ['nullable', 'numeric', 'min:0', 'lt:price'],
            'stock_quantity'    => ['integer', 'min:0'],
            'is_active'         => ['boolean'],
            'is_featured'       => ['boolean'],
            'attributes'        => ['nullable', 'array'],
            'weight'            => ['nullable', 'numeric'],
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $product = Product::create($validated);

        return response()->json(['data' => $product], 201);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'category_id'       => ['sometimes', 'uuid', 'exists:categories,id'],
            'name'              => ['sometimes', 'string', 'max:255'],
            'sku'               => ['sometimes', 'string', 'unique:products,sku,' . $product->id],
            'description'       => ['nullable', 'string'],
            'short_description' => ['nullable', 'string'],
            'price'             => ['sometimes', 'numeric', 'min:0'],
            'sale_price'        => ['nullable', 'numeric', 'min:0'],
            'stock_quantity'    => ['integer', 'min:0'],
            'is_active'         => ['boolean'],
            'is_featured'       => ['boolean'],
            'attributes'        => ['nullable', 'array'],
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $product->update($validated);

        return response()->json(['data' => $product]);
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();
        return response()->json(['message' => 'Product deleted']);
    }
}