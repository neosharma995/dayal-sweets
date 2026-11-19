<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('product_categories', 'parent_id')) {
            Schema::table('product_categories', function (Blueprint $table) {
                $table->foreignId('parent_id')
                    ->nullable()
                    ->after('id')
                    ->constrained('product_categories')
                    ->nullOnDelete();
            });
        }

        if (! Schema::hasTable('category_product')) {
            Schema::create('category_product', function (Blueprint $table) {
                $table->id();
                $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
                $table->foreignId('category_id')->constrained('product_categories')->cascadeOnDelete();
                $table->timestamps();
                $table->unique(['product_id', 'category_id']);
            });
        }

        if (! Schema::hasTable('product_seasonal_mithai')) {
            Schema::create('product_seasonal_mithai', function (Blueprint $table) {
                $table->id();
                $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
                $table->foreignId('seasonal_mithai_id')->constrained('product_seasonal_mithais')->cascadeOnDelete();
                $table->timestamps();
                $table->unique(['product_id', 'seasonal_mithai_id'], 'prod_seasonal_unique');
            });
        }

        if (! Schema::hasTable('occasion_product')) {
            Schema::create('occasion_product', function (Blueprint $table) {
                $table->id();
                $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
                $table->foreignId('occasion_id')->constrained('product_occasions')->cascadeOnDelete();
                $table->timestamps();
                $table->unique(['product_id', 'occasion_id']);
            });
        }

        if (! Schema::hasTable('diet_preference_product')) {
            Schema::create('diet_preference_product', function (Blueprint $table) {
                $table->id();
                $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
                $table->foreignId('diet_preference_id')->constrained('product_diet_preferences')->cascadeOnDelete();
                $table->timestamps();
                $table->unique(['product_id', 'diet_preference_id'], 'prod_diet_unique');
            });
        }

        // Backfill existing single-column classifications into pivot tables
        $now = now();
        $products = DB::table('products')
            ->select('id', 'category_id', 'seasonal_mithai_id', 'occasion_id', 'diet_preference_id')
            ->get();

        foreach ($products as $p) {
            if ($p->category_id) {
                DB::table('category_product')->insertOrIgnore([
                    'product_id' => $p->id,
                    'category_id' => $p->category_id,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
            if ($p->seasonal_mithai_id) {
                DB::table('product_seasonal_mithai')->insertOrIgnore([
                    'product_id' => $p->id,
                    'seasonal_mithai_id' => $p->seasonal_mithai_id,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
            if ($p->occasion_id) {
                DB::table('occasion_product')->insertOrIgnore([
                    'product_id' => $p->id,
                    'occasion_id' => $p->occasion_id,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
            if ($p->diet_preference_id) {
                DB::table('diet_preference_product')->insertOrIgnore([
                    'product_id' => $p->id,
                    'diet_preference_id' => $p->diet_preference_id,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('diet_preference_product');
        Schema::dropIfExists('occasion_product');
        Schema::dropIfExists('product_seasonal_mithai');
        Schema::dropIfExists('category_product');

        if (Schema::hasColumn('product_categories', 'parent_id')) {
            Schema::table('product_categories', function (Blueprint $table) {
                $table->dropConstrainedForeignId('parent_id');
            });
        }
    }
};
