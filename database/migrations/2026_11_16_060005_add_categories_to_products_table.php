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
        Schema::table('products', function (Blueprint $table) {
            if (! Schema::hasColumn('products', 'seasonal_mithai_id')) {
                $table->foreignId('seasonal_mithai_id')->nullable()->after('category_id')->constrained('product_seasonal_mithais')->nullOnDelete();
            }
            if (! Schema::hasColumn('products', 'occasion_id')) {
                $table->foreignId('occasion_id')->nullable()->after('seasonal_mithai_id')->constrained('product_occasions')->nullOnDelete();
            }
            if (! Schema::hasColumn('products', 'diet_preference_id')) {
                $table->foreignId('diet_preference_id')->nullable()->after('occasion_id')->constrained('product_diet_preferences')->nullOnDelete();
            }
            if (! Schema::hasColumn('products', 'product_tag_id')) {
                $table->foreignId('product_tag_id')->nullable()->after('diet_preference_id')->constrained('product_tags')->nullOnDelete();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'product_tag_id')) {
                $table->dropConstrainedForeignId('product_tag_id');
            }
            if (Schema::hasColumn('products', 'diet_preference_id')) {
                $table->dropConstrainedForeignId('diet_preference_id');
            }
            if (Schema::hasColumn('products', 'occasion_id')) {
                $table->dropConstrainedForeignId('occasion_id');
            }
            if (Schema::hasColumn('products', 'seasonal_mithai_id')) {
                $table->dropConstrainedForeignId('seasonal_mithai_id');
            }
        });
    }
};
