<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'order_id',
        'transaction_id',
        'method',
        'status',
        'amount',
        'currency',
        'gateway_response',
        'paid_at',
    ];

    protected $casts = [
        'amount'           => 'decimal:2',
        'gateway_response' => 'array',
        'paid_at'          => 'datetime',
    ];

    // Security: never expose gateway_response in API
    protected $hidden = [
        'gateway_response',
    ];

    // ─── Relationships ─────────────────────────────

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // ─── Helpers ───────────────────────────────────

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }
}