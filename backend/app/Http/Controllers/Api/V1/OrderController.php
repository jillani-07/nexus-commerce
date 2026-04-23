<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $orders = Order::with(['items', 'payment'])
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate(10);

        return response()->json($orders);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        // Security: user can only see their own orders
        $order = Order::with(['items.product', 'payment'])
            ->where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return response()->json(['order' => $order]);
    }

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $cart = Cart::with('items.product')
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Cart is empty.'], 422);
        }

        // Validate stock for all items before creating order
        foreach ($cart->items as $item) {
            if (!$item->product->isAvailable()) {
                return response()->json([
                    'message' => "Product '{$item->product->name}' is no longer available.",
                ], 422);
            }

            if ($item->product->stock_quantity < $item->quantity) {
                return response()->json([
                    'message' => "Insufficient stock for '{$item->product->name}'.",
                ], 422);
            }
        }

        DB::beginTransaction();

        try {
            $subtotal = $cart->items->sum(fn($i) => $i->unit_price * $i->quantity);
            $tax      = round($subtotal * 0.18, 2);
            $total    = $subtotal + $tax;

            $order = Order::create([
                'user_id'              => $request->user()->id,
                'order_number'         => Order::generateOrderNumber(),
                'status'               => 'pending',
                'subtotal'             => $subtotal,
                'tax'                  => $tax,
                'shipping_cost'        => 0,
                'total'                => $total,
                'shipping_address'     => $request->shipping_address,
                'shipping_city'        => $request->shipping_city,
                'shipping_country'     => $request->shipping_country,
                'shipping_postal_code' => $request->shipping_postal_code,
                'notes'                => $request->notes,
            ]);

            foreach ($cart->items as $item) {
                $order->items()->create([
                    'product_id'   => $item->product_id,
                    'product_name' => $item->product->name,
                    'product_sku'  => $item->product->sku,
                    'quantity'     => $item->quantity,
                    'unit_price'   => $item->unit_price,
                    'total_price'  => $item->unit_price * $item->quantity,
                ]);

                // Decrement stock
                $item->product->decrement('stock_quantity', $item->quantity);
            }

            Payment::create([
                'order_id' => $order->id,
                'method'   => $request->payment_method,
                'status'   => 'pending',
                'amount'   => $total,
                'currency' => 'INR',
            ]);

            // Clear cart after order
            $cart->items()->delete();

            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully.',
                'order'   => $order->load(['items', 'payment']),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Order could not be placed. Please try again.',
            ], 500);
        }
    }

    public function cancel(Request $request, string $id): JsonResponse
    {
        $order = Order::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if (!$order->isCancellable()) {
            return response()->json([
                'message' => 'This order cannot be cancelled.',
            ], 422);
        }

        DB::beginTransaction();

        try {
            // Restore stock
            foreach ($order->items as $item) {
                $item->product->increment('stock_quantity', $item->quantity);
            }

            $order->update(['status' => 'cancelled']);

            DB::commit();

            return response()->json(['message' => 'Order cancelled successfully.']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Cancellation failed.'], 500);
        }
    }
}