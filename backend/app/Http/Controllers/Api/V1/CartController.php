<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\AddToCartRequest;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    private function getOrCreateCart(Request $request): Cart
    {
        if ($request->user()) {
            return Cart::firstOrCreate(['user_id' => $request->user()->id]);
        }

        return Cart::firstOrCreate(['session_id' => $request->session()->getId()]);
    }

    public function index(Request $request): JsonResponse
    {
        $cart = $this->getOrCreateCart($request);
        $cart->load('items.product.primaryImage');

        return response()->json([
            'cart'        => $cart,
            'total'       => $cart->total,
            'total_items' => $cart->total_items,
        ]);
    }

    public function add(AddToCartRequest $request): JsonResponse
    {
        $product = Product::findOrFail($request->product_id);

        if (!$product->isAvailable()) {
            return response()->json(['message' => 'Product is not available.'], 422);
        }

        if ($product->stock_quantity < $request->quantity) {
            return response()->json([
                'message' => "Only {$product->stock_quantity} items available in stock.",
            ], 422);
        }

        $cart = $this->getOrCreateCart($request);

        $cartItem = CartItem::updateOrCreate(
            ['cart_id' => $cart->id, 'product_id' => $product->id],
            [
                'quantity'   => $request->quantity,
                'unit_price' => $product->effective_price,
            ]
        );

        return response()->json([
            'message'   => 'Product added to cart.',
            'cart_item' => $cartItem,
        ], 201);
    }

    public function remove(Request $request, string $itemId): JsonResponse
    {
        $cart = $this->getOrCreateCart($request);

        // Security: only delete items belonging to this cart
        $deleted = CartItem::where('id', $itemId)
            ->where('cart_id', $cart->id)
            ->delete();

        if (!$deleted) {
            return response()->json(['message' => 'Cart item not found.'], 404);
        }

        return response()->json(['message' => 'Item removed from cart.']);
    }

    public function clear(Request $request): JsonResponse
    {
        $cart = $this->getOrCreateCart($request);
        $cart->items()->delete();

        return response()->json(['message' => 'Cart cleared.']);
    }
}