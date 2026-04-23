<?php
public function up(): void
{
    Schema::create('categories', function (Blueprint $table) {
        $table->uuid('id')->primary();
        $table->string('name');
        $table->string('slug')->unique();
        $table->text('description')->nullable();
        $table->string('image')->nullable();
        $table->uuid('parent_id')->nullable();
        $table->boolean('is_active')->default(true);
        $table->integer('sort_order')->default(0);
        $table->timestamps();

        $table->foreign('parent_id')
              ->references('id')
              ->on('categories')
              ->nullOnDelete();
    });
}

public function down(): void
{
    Schema::dropIfExists('categories');
}