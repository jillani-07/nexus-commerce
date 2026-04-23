<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CartController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\Admin\AdminOrderController;
use App\Http\Controllers\Api\V1\Admin\AdminProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // ─── Public Routes ─────────────────────────────
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login',    [AuthController::class, 'login']);
    });

    Route::get('products',          [ProductController::class, 'index']);
    Route::get('products/{slug}',   [ProductController::class, 'show']);
    Route::get('categories',        [CategoryController::class, 'index']);

    // ─── Authenticated Routes ──────────────────────
    Route::middleware('auth:sanctum')->group(function () {

        Route::post('auth/logout',  [AuthController::class, 'logout']);
        Route::get('auth/me',       [AuthController::class, 'me']);

        // Cart
        Route::get('cart',                  [CartController::class, 'index']);
        Route::post('cart/add',             [CartController::class, 'add']);
        Route::delete('cart/items/{id}',    [CartController::class, 'remove']);
        Route::delete('cart',               [CartController::class, 'clear']);

        // Orders
        Route::get('orders',                [OrderController::class, 'index']);
        Route::post('orders',               [OrderController::class, 'store']);
        Route::get('orders/{id}',           [OrderController::class, 'show']);
        Route::patch('orders/{id}/cancel',  [OrderController::class, 'cancel']);
    });

    // ─── Admin Routes ──────────────────────────────
    Route::middleware(['auth:sanctum', 'admin'])
        ->prefix('admin')
        ->group(function () {

        // Products
        Route::apiResource('products', AdminProductController::class);

        // Orders
        Route::get('orders',                    [AdminOrderController::class, 'index']);
        Route::patch('orders/{id}/status',      [AdminOrderController::class, 'updateStatus']);
    });
});