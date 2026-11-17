<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Add rating and rating_count to products table if not present
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'rating')) {
                $table->decimal('rating', 3, 2)->default(5.00)->after('product_details');
            }
            if (!Schema::hasColumn('products', 'rating_count')) {
                $table->unsignedInteger('rating_count')->default(0)->after('rating');
            }
        });

        // 2. Create product_reviews table
        Schema::create('product_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
            $table->unsignedTinyInteger('rating')->default(5);
            $table->text('review')->nullable();
            $table->boolean('is_verified_purchase')->default(true);
            $table->string('status', 30)->default('approved');
            $table->timestamps();

            // One review per user per product (industry standard: allows updating review)
            $table->unique(['product_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_reviews');

        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'rating_count')) {
                $table->dropColumn('rating_count');
            }
            if (Schema::hasColumn('products', 'rating')) {
                $table->dropColumn('rating');
            }
        });
    }
};
