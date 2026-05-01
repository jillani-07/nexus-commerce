<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    private function getCart(Request $request): Cart
    {
        return Cart::firstOrCreate([
            'user_id' => $request->user()->id,
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $cart = $this->getCart($request);
        $cart->load('items.product.primaryImage');

        return response()->json([
            'data'  => $cart,
            'total' => $cart->total,
        ]);
    }

    public function addItem(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'uuid', 'exists:products,id'],
            'quantity'   => ['required', 'integer', 'min:1'],
        ]);

        $product = Product::findOrFail($validated['product_id']);

        if (!$product->isInStock()) {
            return response()->json(['message' => 'Product out of stock'], 422);
        }

        $cart = $this->getCart($request);

        $item = CartItem::updateOrCreate(
            ['cart_id' => $cart->id, 'product_id' => $product->id],
            ['quantity' => $validated['quantity'], 'unit_price' => $product->effective_price]
        );

        return response()->json(['data' => $item], 201);
    }

    public function updateItem(Request $request, CartItem $cartItem): JsonResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cartItem->update($validated);

        return response()->json(['data' => $cartItem]);
    }

    public function removeItem(CartItem $cartItem): JsonResponse
    {
        $cartItem->delete();

        return response()->json(['message' => 'Item removed']);
    }

    public function clear(Request $request): JsonResponse
    {
        $cart = $this->getCart($request);
        $cart->items()->delete();

        return response()->json(['message' => 'Cart cleared']);
    }
}