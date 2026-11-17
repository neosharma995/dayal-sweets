<?php

declare(strict_types=1);

use App\Models\Page;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $page = Page::where('slug', 'gallery')->first();

        if (! $page) {
            Page::getOrCreateGallery();
        } else {
            // Ensure full defaults if images or categories were empty
            $sections = $page->sections ?? [];
            if (empty($sections['images']) || empty($sections['categories'])) {
                $page->sections = Page::getGalleryDefaults();
                $page->save();
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Retain data
    }
};
