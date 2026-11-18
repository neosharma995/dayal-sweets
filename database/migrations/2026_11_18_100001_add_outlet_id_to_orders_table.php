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
        if (Schema::hasTable('orders') && !Schema::hasColumn('orders', 'outlet_id')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->foreignId('outlet_id')
                    ->nullable()
                    ->after('user_id')
                    ->constrained('outlets')
                    ->nullOnDelete();

                $table->index('outlet_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('orders') && Schema::hasColumn('orders', 'outlet_id')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->dropForeign(['outlet_id']);
                $table->dropColumn('outlet_id');
            });
        }
    }
};
