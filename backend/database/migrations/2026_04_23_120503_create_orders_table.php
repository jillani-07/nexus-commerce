<?php
public function up(): void
{
    Schema::create('orders', function (Blueprint $table) {
        $table->uuid('id')->primary();
        $table->uuid('user_id');
        $table->string('order_number')->unique();
        $table->enum('status', [
            'pending', 'confirmed', 'processing',
            'shipped', 'delivered', 'cancelled', 'refunded'
        ])->default('pending');
        $table->decimal('subtotal', 10, 2);
        $table->decimal('tax', 10, 2)->default(0);
        $table->decimal('shipping_cost', 10, 2)->default(0);
        $table->decimal('total', 10, 2);
        $table->text('shipping_address');
        $table->string('shipping_city');
        $table->string('shipping_country', 2);
        $table->string('shipping_postal_code', 20);
        $table->text('notes')->nullable();
        $table->timestamps();
        $table->softDeletes();

        $table->foreign('user_id')
              ->references('id')
              ->on('users')
              ->restrictOnDelete();

        $table->index(['user_id', 'status']);
        $table->index('order_number');
    });
}

public function down(): void
{
    Schema::dropIfExists('orders');
}