<?php
public function up(): void
{
    Schema::create('cart_items', function (Blueprint $table) {
        $table->uuid('id')->primary();
        $table->uuid('cart_id');
        $table->uuid('product_id');
        $table->integer('quantity');
        $table->decimal('unit_price', 10, 2);
        $table->timestamps();

        $table->foreign('cart_id')
              ->references('id')
              ->on('carts')
              ->cascadeOnDelete();

        $table->foreign('product_id')
              ->references('id')
              ->on('products')
              ->restrictOnDelete();

        $table->unique(['cart_id', 'product_id']);
    });
}

public function down(): void
{
    Schema::dropIfExists('cart_items');
}