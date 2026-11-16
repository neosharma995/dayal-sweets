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
        Schema::create('tax_rates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->decimal('rate', 5, 2); // e.g. 5.00, 12.00, 18.00
            $table->string('type')->default('percent'); // percent or fixed
            $table->string('tax_class')->default('standard'); // standard, reduced_rate, zero_rate
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_compound')->default(false);
            $table->boolean('apply_to_shipping')->default(false);
            $table->integer('priority')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tax_rates');
    }
};
