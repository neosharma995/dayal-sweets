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
            if (! Schema::hasColumn('products', 'tax_rate_id')) {
                $table->foreignId('tax_rate_id')->nullable()->after('diet_preference_id')->constrained('tax_rates')->nullOnDelete();
            }
            if (! Schema::hasColumn('products', 'tax_status')) {
                $table->string('tax_status')->default('taxable')->after('tax_rate_id'); // taxable, none, shipping
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'tax_rate_id')) {
                $table->dropConstrainedForeignId('tax_rate_id');
            }
            if (Schema::hasColumn('products', 'tax_status')) {
                $table->dropColumn('tax_status');
            }
        });
    }
};
