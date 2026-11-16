<?php

declare(strict_types=1);

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
        Schema::create('product_variations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('attribute_value_id')->nullable()->constrained('product_attribute_values')->nullOnDelete();
            $table->string('variation_name'); // e.g. "250g", "500g", "1kg", "Festive Pack"
            $table->decimal('price', 10, 2); // Regular MRP
            $table->decimal('selling_price', 10, 2); // Discounted / Active Selling Price
            $table->integer('product_qty')->default(1); // Specific stock quantity
            $table->decimal('weight_value', 8, 2)->nullable(); // e.g. 250, 500, 1000
            $table->string('weight_unit', 20)->default('g'); // e.g. "g", "kg", "pcs", "box"
            $table->string('sku')->nullable(); // Optional inventory SKU
            $table->boolean('is_default')->default(false); // Whether pre-selected on product page
            $table->timestamps();

            $table->index(['product_id', 'is_default']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variations');
    }
};
