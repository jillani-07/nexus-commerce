<?php
public function up(): void
{
    Schema::create('payments', function (Blueprint $table) {
        $table->uuid('id')->primary();
        $table->uuid('order_id');
        $table->string('transaction_id')->unique()->nullable();
        $table->enum('method', ['stripe', 'razorpay', 'cod'])->default('cod');
        $table->enum('status', ['pending', 'completed', 'failed', 'refunded'])->default('pending');
        $table->decimal('amount', 10, 2);
        $table->string('currency', 3)->default('INR');
        $table->json('gateway_response')->nullable();
        $table->timestamp('paid_at')->nullable();
        $table->timestamps();

        $table->foreign('order_id')
              ->references('id')
              ->on('orders')
              ->cascadeOnDelete();

        $table->index(['order_id', 'status']);
    });
}

public function down(): void
{
    Schema::dropIfExists('payments');
}