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
        Schema::table('pages', function (Blueprint $table) {
            if (! Schema::hasColumn('pages', 'meta_keywords')) {
                $table->text('meta_keywords')->nullable()->after('meta_description');
            }
            if (! Schema::hasColumn('pages', 'canonical_url')) {
                $table->string('canonical_url')->nullable()->after('meta_keywords');
            }
            if (! Schema::hasColumn('pages', 'og_title')) {
                $table->string('og_title')->nullable()->after('canonical_url');
            }
            if (! Schema::hasColumn('pages', 'og_description')) {
                $table->text('og_description')->nullable()->after('og_title');
            }
            if (! Schema::hasColumn('pages', 'og_image')) {
                $table->string('og_image')->nullable()->after('og_description');
            }
            if (! Schema::hasColumn('pages', 'robots')) {
                $table->string('robots')->default('index, follow')->after('og_image');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $columns = array_filter([
                Schema::hasColumn('pages', 'meta_keywords') ? 'meta_keywords' : null,
                Schema::hasColumn('pages', 'canonical_url') ? 'canonical_url' : null,
                Schema::hasColumn('pages', 'og_title') ? 'og_title' : null,
                Schema::hasColumn('pages', 'og_description') ? 'og_description' : null,
                Schema::hasColumn('pages', 'og_image') ? 'og_image' : null,
                Schema::hasColumn('pages', 'robots') ? 'robots' : null,
            ]);

            if (! empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }
};
