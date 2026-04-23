<?php
public function up(): void
{
    Schema::create('products', function (Blueprint $table) {
        $table->uuid('id')->primary();
        $table->uuid('category_id');
        $table->string('name');
        $table->string('slug')->unique();
        $table->text('description')->nullable();
        $table->string('sku')->unique();
        $table->decimal('price', 10, 2);
        $table->decimal('sale_price', 10, 2)->nullable();
        $table->integer('stock_quantity')->default(0);
        $table->boolean('in_stock')->default(true);
        $table->boolean('is_active')->default(true);
        $table->boolean('is_featured')->default(false);
        $table->json('attributes')->nullable();
        $table->timestamps();
        $table->softDeletes();

        $table->foreign('category_id')
              ->references('id')
              ->on('categories')
              ->restrictOnDelete();

        $table->index(['is_active', 'in_stock']);
        $table->index('slug');
    });
}

public function down(): void
{
    Schema::dropIfExists('products');
}