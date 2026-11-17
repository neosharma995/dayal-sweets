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
        Schema::create('outlets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('subtitle')->nullable();
            $table->text('address');
            $table->string('city')->nullable();
            $table->string('state')->default('Himachal Pradesh');
            $table->string('pincode', 20)->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('phone_raw', 50)->nullable();
            $table->string('whatsapp', 50)->nullable();
            $table->string('whatsapp_raw', 50)->nullable();
            $table->string('email')->nullable();
            $table->string('timings')->nullable();
            $table->string('image')->nullable();
            $table->text('map_url')->nullable();
            $table->string('status', 30)->default('active'); // active, coming_soon, inactive
            $table->boolean('is_active')->default(true);
            $table->boolean('is_coming_soon')->default(false);
            $table->string('expected_opening')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index('status');
            $table->index('is_active');
            $table->index('sort_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('outlets');
    }
};
