<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'sku',
        'price',
        'sale_price',
        'stock_quantity',
        'in_stock',
        'is_active',
        'is_featured',
        'attributes',
    ];

    protected $casts = [
        'price'          => 'decimal:2',
        'sale_price'     => 'decimal:2',
        'in_stock'       => 'boolean',
        'is_active'      => 'boolean',
        'is_featured'    => 'boolean',
        'attributes'     => 'array',
    ];

    // ─── Relationships ─────────────────────────────

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function primaryImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // ─── Helpers ───────────────────────────────────

    public function getEffectivePriceAttribute(): float
    {
        return $this->sale_price ?? $this->price;
    }

    public function isAvailable(): bool
    {
        return $this->is_active && $this->in_stock && $this->stock_quantity > 0;
    }
}