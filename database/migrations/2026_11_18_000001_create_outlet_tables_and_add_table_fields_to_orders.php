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
        if (! Schema::hasTable('outlet_tables')) {
            Schema::create('outlet_tables', function (Blueprint $table) {
                $table->id();
                $table->foreignId('outlet_id')->constrained('outlets')->cascadeOnDelete();
                $table->string('table_number', 50);
                $table->string('name', 120);
                $table->unsignedSmallInteger('capacity')->default(4)->comment('Number of people who can sit');
                $table->string('location', 120)->default('Main Dining Hall')->comment('Floor, hall, or zone inside outlet');
                $table->string('qr_token', 100)->unique();
                $table->string('status', 30)->default('available')->comment('available, occupied, reserved, inactive');
                $table->boolean('is_active')->default(true);
                $table->text('notes')->nullable();
                $table->unsignedInteger('sort_order')->default(0);
                $table->timestamps();

                $table->index(['outlet_id', 'is_active']);
                $table->index(['outlet_id', 'location']);
            });
        }

        Schema::table('orders', function (Blueprint $table) {
            if (! Schema::hasColumn('orders', 'order_type')) {
                $table->string('order_type', 30)->default('delivery')->after('user_id');
            }
            if (! Schema::hasColumn('orders', 'outlet_table_id')) {
                $table->foreignId('outlet_table_id')->nullable()->after('order_type')->constrained('outlet_tables')->nullOnDelete();
            }
            if (! Schema::hasColumn('orders', 'table_number')) {
                $table->string('table_number', 50)->nullable()->after('outlet_table_id');
            }
            if (! Schema::hasColumn('orders', 'table_location')) {
                $table->string('table_location', 120)->nullable()->after('table_number');
            }
            if (! Schema::hasColumn('orders', 'guests_count')) {
                $table->unsignedSmallInteger('guests_count')->nullable()->after('table_location');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'outlet_table_id')) {
                $table->dropConstrainedForeignId('outlet_table_id');
            }
            $columnsToDrop = array_filter(
                ['order_type', 'table_number', 'table_location', 'guests_count'],
                fn (string $col) => Schema::hasColumn('orders', $col)
            );
            if (! empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });

        Schema::dropIfExists('outlet_tables');
    }
};
