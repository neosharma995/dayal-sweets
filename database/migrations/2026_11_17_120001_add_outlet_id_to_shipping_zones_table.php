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
        Schema::table('shipping_zones', function (Blueprint $table) {
            $table->foreignId('outlet_id')
                ->nullable()
                ->after('id')
                ->constrained('outlets')
                ->cascadeOnDelete();

            // Drop unique constraint on zone_slug so different outlets can have identical zone slugs (e.g. 'local-delivery')
            $table->dropUnique(['zone_slug']);
            $table->index('zone_slug');
            $table->index('outlet_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shipping_zones', function (Blueprint $table) {
            $table->dropForeign(['outlet_id']);
            $table->dropColumn('outlet_id');
            $table->dropIndex(['zone_slug']);
            $table->unique('zone_slug');
        });
    }
};
