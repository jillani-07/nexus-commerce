<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with('items', 'payment')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($orders);
    }

    public function show(Request $request, Order $order): JsonResponse
    {
        if ($order->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json([
            'data' => $order->load('items.product', 'payment'),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'shipping_address'          => ['required', 'array'],
            'shipping_address.name'     => ['required', 'string'],
            'shipping_address.line1'    => ['required', 'string'],
            'shipping_address.city'     => ['required', 'string'],
            'shipping_address.postcode' => ['required', 'string'],
            'shipping_address.country'  => ['required', 'string', 'size:2'],
            'billing_address'           => ['required', 'array'],
            'notes'                     => ['nullable', 'string', 'max:500'],
        ]);

        $cart = Cart::where('user_id', $request->user()->id)
            ->with('items.product')
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 422);
        }

        $order = DB::transaction(function () use ($request, $validated, $cart) {
            $subtotal = $cart->items->sum(fn($i) => $i->unit_price * $i->quantity);

            $order = Order::create([
                'user_id'          => $request->user()->id,
                'order_number'     => Order::generateOrderNumber(),
                'subtotal'         => $subtotal,
                'tax_amount'       => round($subtotal * 0.20, 2),
                'total_amount'     => round($subtotal * 1.20, 2),
                'shipping_address' => $validated['shipping_address'],
                'billing_address'  => $validated['billing_address'],
                'notes'            => $validated['notes'] ?? null,
            ]);

            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id'     => $order->id,
                    'product_id'   => $item->product_id,
                    'product_name' => $item->product->name,
                    'product_sku'  => $item->product->sku,
                    'quantity'     => $item->quantity,
                    'unit_price'   => $item->unit_price,
                    'total_price'  => $item->unit_price * $item->quantity,
                ]);
            }

            $cart->items()->delete();

            return $order;
        });

        return response()->json(['data' => $order->load('items')], 201);
    }
}