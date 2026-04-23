<?php
public function up(): void
{
    Schema::create('product_images', function (Blueprint $table) {
        $table->uuid('id')->primary();
        $table->uuid('product_id');
        $table->string('image_url');
        $table->string('alt_text')->nullable();
        $table->boolean('is_primary')->default(false);
        $table->integer('sort_order')->default(0);
        $table->timestamps();

        $table->foreign('product_id')
              ->references('id')
              ->on('products')
              ->cascadeOnDelete();
    });
}

public function down(): void
{
    Schema::dropIfExists('product_images');
}