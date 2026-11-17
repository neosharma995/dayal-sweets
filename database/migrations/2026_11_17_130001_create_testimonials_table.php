<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('testimonials')) {
            Schema::create('testimonials', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('name');
                $table->unsignedTinyInteger('rating')->default(5);
                $table->text('content');
                $table->string('avatar')->nullable();
                $table->string('avatar_bg')->nullable();
                $table->string('status', 30)->default('published');
                $table->timestamps();
            });

            // Seed initial 5 authentic testimonials from the live site (matching the reference screenshot exactly)
            DB::table('testimonials')->insert([
                [
                    'name' => 'Neha Kapoor',
                    'rating' => 4,
                    'content' => 'We ordered Rasmalai, Motichoor Laddu, and some savouries for a family gathering. Everything arrived fresh, beautifully packed, and tasted amazing. The quality really stands out, and the service was excellent from start to finish.',
                    'avatar' => null,
                    'avatar_bg' => null,
                    'status' => 'published',
                    'created_at' => now()->subMonths(3),
                    'updated_at' => now()->subMonths(3),
                ],
                [
                    'name' => 'Vikram Thakur',
                    'rating' => 3,
                    'content' => 'Ordered a variety of sweets and snacks for a family celebration, and everything was fresh and delicious. The packaging was excellent and the flavours were exactly what we were looking for. Dayal Sweets has definitely become our go-to!',
                    'avatar' => null,
                    'avatar_bg' => null,
                    'status' => 'published',
                    'created_at' => now()->subMonths(3),
                    'updated_at' => now()->subMonths(3),
                ],
                [
                    'name' => 'Rajesh Verma',
                    'rating' => 5,
                    'content' => 'We ordered corporate Diwali hampers for 200 employees. The presentation was impeccable, delivery was on time, and every sweet was packed beautifully. Our team loved the variety and quality. Highly recommended for corporate gifting!',
                    'avatar' => '/uploads/2026/07/Container-15.png',
                    'avatar_bg' => null,
                    'status' => 'published',
                    'created_at' => now()->subMonths(4),
                    'updated_at' => now()->subMonths(4),
                ],
                [
                    'name' => 'Priya Mehta',
                    'rating' => 5,
                    'content' => 'The Kaju Katli is in a league of its own. I\'ve tried mithai from across Himachal but nothing comes close to Dayal\'s. The texture was perfect, the sweetness was just right, and every bite tasted incredibly fresh.',
                    'avatar' => null, // Displayed with initials "PM" in amber circle as shown in screenshot
                    'avatar_bg' => '#FFF4E3',
                    'status' => 'published',
                    'created_at' => now()->subMonths(4),
                    'updated_at' => now()->subMonths(4),
                ],
                [
                    'name' => 'Ananya Sharma',
                    'rating' => 5,
                    'content' => 'Dayal Sweets made our wedding reception extraordinary. The custom mithai trays were not only beautiful but absolutely divine in taste. Every guest complimented the sweets — we couldn\'t have asked for better.',
                    'avatar' => '/uploads/2026/07/Container-14.png',
                    'avatar_bg' => null,
                    'status' => 'published',
                    'created_at' => now()->subMonths(4),
                    'updated_at' => now()->subMonths(4),
                ],
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
