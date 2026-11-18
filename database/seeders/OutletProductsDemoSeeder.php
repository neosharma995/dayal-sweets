<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Outlet;
use App\Models\Product;
use App\Models\ProductVariation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OutletProductsDemoSeeder extends Seeder
{
    public function run(): void
    {
        $sweetsCat = Category::where('category_slug', 'sweets')->first();
        $namkeenCat = Category::where('category_slug', 'namkeen')->first();
        $bakeryCat = Category::where('category_slug', 'bakery')->first();
        $giftingCat = Category::where('category_slug', 'gift-hampers')->first();
        $dessertsCat = Category::where('category_slug', 'desserts')->first();
        $comboCat = Category::where('category_slug', 'combo')->first();

        // 1. Royal Kaju Katli
        $p1 = Product::updateOrCreate(
            ['id' => 1],
            [
                'product_name' => 'Royal Kaju Katli',
                'category_id' => $sweetsCat?->id,
                'product_description' => 'Signature diamond-shaped cashew fudge crafted with premium Goan cashews and finished with pure edible silver leaf.',
                'product_price' => 550.00,
                'product_selling_price' => 500.00,
                'product_qty' => 100,
                'product_image' => '/uploads/2026/07/kaaju-katli.png',
                'rating' => 5.00,
                'rating_count' => 48,
            ]
        );

        // 2. Desi Ghee Motichoor Laddu
        $p2 = Product::updateOrCreate(
            ['id' => 2],
            [
                'product_name' => 'Desi Ghee Motichoor Laddu',
                'category_id' => $sweetsCat?->id,
                'product_description' => 'Tiny pearls of gram flour fried in pure cow desi ghee, infused with green cardamom and saffron syrup.',
                'product_price' => 300.00,
                'product_selling_price' => 270.00,
                'product_qty' => 120,
                'product_image' => '/uploads/2026/07/gulab-jamun.png',
                'rating' => 4.90,
                'rating_count' => 35,
            ]
        );

        // 3. Shahi Namkeen Mixture
        $p3 = Product::updateOrCreate(
            ['id' => 3],
            [
                'product_name' => 'Shahi Namkeen Mixture',
                'category_id' => $namkeenCat?->id,
                'product_description' => 'A mouth-watering blend of cashew nuts, roasted peanuts, crunchy sev, lentils, and secret royal spice seasoning.',
                'product_price' => 175.00,
                'product_selling_price' => 150.00,
                'product_qty' => 150,
                'product_image' => '/uploads/2026/07/Image-Namkeen.png',
                'rating' => 4.80,
                'rating_count' => 22,
            ]
        );

        // 4. Artisan Chocolate Brownie Box
        $p4 = Product::updateOrCreate(
            ['id' => 4],
            [
                'product_name' => 'Artisan Chocolate Brownie Box',
                'category_id' => $bakeryCat?->id,
                'product_description' => 'Fudgy rich dark chocolate brownies baked fresh with Belgian cocoa, real butter, and crunchy roasted walnuts.',
                'product_price' => 450.00,
                'product_selling_price' => 399.00,
                'product_qty' => 80,
                'product_image' => '/uploads/2026/07/Brownies.jpg',
                'rating' => 5.00,
                'rating_count' => 19,
            ]
        );

        // 5. Imperial Gold Festive Sweet Hamper
        $p5 = Product::updateOrCreate(
            ['id' => 5],
            [
                'product_name' => 'Imperial Gold Festive Sweet Hamper',
                'category_id' => $giftingCat?->id,
                'product_description' => 'A regal gift hamper featuring an assortment of Kaju Katli, Besan Laddu, Dry Fruit Peda, Roasted Salted Almonds, and Pistachios in a velvet-lined box.',
                'product_price' => 1600.00,
                'product_selling_price' => 1450.00,
                'product_qty' => 60,
                'product_image' => '/uploads/2026/07/sweets-box.png',
                'rating' => 5.00,
                'rating_count' => 14,
            ]
        );

        // 6. Amb Special Badam Barfi (Amb Exclusive)
        $p6 = Product::updateOrCreate(
            ['id' => 6],
            [
                'product_name' => 'Amb Special Badam Barfi',
                'category_id' => $sweetsCat?->id,
                'product_description' => 'Rich almond fudge slow-simmered with reduced organic whole milk and saffron, freshly crafted daily at our Amb kitchen.',
                'product_price' => 520.00,
                'product_selling_price' => 480.00,
                'product_qty' => 75,
                'product_image' => '/uploads/2026/07/sweets-box.png',
                'rating' => 4.95,
                'rating_count' => 28,
            ]
        );

        // 7. Hamirpur Special Besan Laddu (Hamirpur Exclusive)
        $p7 = Product::updateOrCreate(
            ['id' => 7],
            [
                'product_name' => 'Hamirpur Special Besan Laddu',
                'category_id' => $sweetsCat?->id,
                'product_description' => 'Coarse roasted gram flour stirred patiently in Danedar cow ghee with green cardamom and crunchy cashews, an authentic Hamirpur recipe.',
                'product_price' => 380.00,
                'product_selling_price' => 340.00,
                'product_qty' => 90,
                'product_image' => '/uploads/2026/07/gulab-jamun.png',
                'rating' => 4.90,
                'rating_count' => 31,
            ]
        );

        // 8. Una Special Gulab Jamun Box (Una Exclusive)
        $p8 = Product::updateOrCreate(
            ['id' => 8],
            [
                'product_name' => 'Una Special Gulab Jamun Box',
                'category_id' => $dessertsCat?->id,
                'product_description' => 'Melt-in-mouth milk solid dumplings fried to a golden hue and steeped in rose-scented cardamom sugar nectar.',
                'product_price' => 320.00,
                'product_selling_price' => 290.00,
                'product_qty' => 85,
                'product_image' => '/uploads/2026/07/Image-Gulab-Jamun.png',
                'rating' => 5.00,
                'rating_count' => 42,
            ]
        );

        // 9. Birthday Celebration Combo
        $p9 = Product::updateOrCreate(
            ['id' => 9],
            [
                'product_name' => 'Birthday Celebration Combo',
                'category_id' => $comboCat?->id,
                'product_description' => 'An all-in-one celebration assortment combining fresh bakery brownie bites, signature Motichoor laddus, and savoury namkeen snacks.',
                'product_price' => 650.00,
                'product_selling_price' => 599.00,
                'product_qty' => 50,
                'product_image' => '/uploads/2026/09/Birthday-Party-Combo.png',
                'rating' => 4.85,
                'rating_count' => 17,
            ]
        );

        // Clear existing outlet products mapping
        DB::table('outlet_products')->truncate();

        // Assign EXACTLY 4 products to Outlet 1: Amb (PIN 177203)
        // Products: 1 (Kaju Katli), 2 (Motichoor Laddu), 3 (Shahi Namkeen), 6 (Amb Special Badam Barfi)
        $ambOutlet = Outlet::where('slug', 'amb')->first() ?? Outlet::find(1);
        if ($ambOutlet) {
            $ambOutlet->products()->attach([
                1 => ['is_available' => true, 'stock_qty' => 50],
                2 => ['is_available' => true, 'stock_qty' => 60],
                3 => ['is_available' => true, 'stock_qty' => 80],
                6 => ['is_available' => true, 'stock_qty' => 40],
            ]);
        }

        // Assign EXACTLY 4 products to Outlet 2: Hamirpur (PIN 177005)
        // Products: 2 (Motichoor Laddu), 4 (Brownie Box), 5 (Imperial Hamper), 7 (Hamirpur Special Besan Laddu)
        $hamirpurOutlet = Outlet::where('slug', 'hamirpur')->first() ?? Outlet::find(2);
        if ($hamirpurOutlet) {
            $hamirpurOutlet->products()->attach([
                2 => ['is_available' => true, 'stock_qty' => 70],
                4 => ['is_available' => true, 'stock_qty' => 45],
                5 => ['is_available' => true, 'stock_qty' => 30],
                7 => ['is_available' => true, 'stock_qty' => 55],
            ]);
        }

        // Assign EXACTLY 4 products to Outlet 3: Una (PIN 174303)
        // Products: 1 (Kaju Katli), 3 (Shahi Namkeen), 4 (Brownie Box), 8 (Una Special Gulab Jamun)
        $unaOutlet = Outlet::where('slug', 'una')->first() ?? Outlet::find(3);
        if ($unaOutlet) {
            $unaOutlet->products()->attach([
                1 => ['is_available' => true, 'stock_qty' => 40],
                3 => ['is_available' => true, 'stock_qty' => 65],
                4 => ['is_available' => true, 'stock_qty' => 35],
                8 => ['is_available' => true, 'stock_qty' => 50],
            ]);
        }

        // Assign EXACTLY 4 products to Outlet 4: Una (Bus Stand) (PIN 174303)
        // Products: 1 (Kaju Katli), 5 (Imperial Hamper), 8 (Una Special Gulab Jamun), 9 (Birthday Combo)
        $unaBusOutlet = Outlet::where('slug', 'una-bus-stand')->first() ?? Outlet::find(4);
        if ($unaBusOutlet) {
            $unaBusOutlet->products()->attach([
                1 => ['is_available' => true, 'stock_qty' => 50],
                5 => ['is_available' => true, 'stock_qty' => 25],
                8 => ['is_available' => true, 'stock_qty' => 45],
                9 => ['is_available' => true, 'stock_qty' => 30],
            ]);
        }
    }
}
