<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->index('invoice');
            $table->index('cashier_id');
            $table->index('customer_id');
            $table->index('created_at');
            $table->index('payment_status');
            $table->index('payment_method');
        });

        Schema::table('transaction_details', function (Blueprint $table) {
            $table->index('transaction_id');
            $table->index('product_id');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->index('category_id');
            $table->index('title');
        });

        Schema::table('profits', function (Blueprint $table) {
            $table->index('transaction_id');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropIndex(['invoice']);
            $table->dropIndex(['cashier_id']);
            $table->dropIndex(['customer_id']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['payment_status']);
            $table->dropIndex(['payment_method']);
        });

        Schema::table('transaction_details', function (Blueprint $table) {
            $table->dropIndex(['transaction_id']);
            $table->dropIndex(['product_id']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['category_id']);
            $table->dropIndex(['title']);
        });

        Schema::table('profits', function (Blueprint $table) {
            $table->dropIndex(['transaction_id']);
            $table->dropIndex(['created_at']);
        });
    }
};
