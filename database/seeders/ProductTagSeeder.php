<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\DietPreference;
use App\Models\Occasion;
use App\Models\Product;
use App\Models\ProductTag;
use App\Models\SeasonalMithai;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductTagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Seed Separate Table: Seasonal Mithai
        $seasonalNames = [
            'Baisakhi',
            'Christmas',
            'Diwali',
            'Eid',
            'Holi',
            'Navratri',
            'New Year',
            'Raksha Bandhan',
            'Summer Specials',
            'Wedding Collection',
            'Winter Specials',
        ];

        $seasonalMap = [];
        foreach ($seasonalNames as $name) {
            $seasonalMap[$name] = SeasonalMithai::firstOrCreate(
                ['category_slug' => Str::slug($name)],
                [
                    'category_name' => $name,
                    'category_description' => "Dayal Sweets {$name} special festive collection",
                    'category_image' => null,
                ]
            );
        }

        // 2. Seed Separate Table: Occasion
        $occasionNames = [
            'Birthday',
            'Wedding',
            'Anniversary',
            'Corporate Gifting',
            'Festival',
            'Family Celebration',
            'Housewarming',
        ];

        $occasionMap = [];
        foreach ($occasionNames as $name) {
            $occasionMap[$name] = Occasion::firstOrCreate(
                ['category_slug' => Str::slug($name)],
                [
                    'category_name' => $name,
                    'category_description' => "Dayal Sweets treats for {$name}",
                    'category_image' => null,
                ]
            );
        }

        // 3. Seed Separate Table: Diet Preference
        $dietNames = [
            'Sugar Free',
            'Low Sugar',
            'Jain Friendly',
            'Vegan',
            'Gluten Free',
        ];

        $dietMap = [];
        foreach ($dietNames as $name) {
            $dietMap[$name] = DietPreference::firstOrCreate(
                ['category_slug' => Str::slug($name)],
                [
                    'category_name' => $name,
                    'category_description' => "{$name} delicacies prepared with premium pure ingredients",
                    'category_image' => null,
                ]
            );
        }

        // 4. Seed Separate Table: Product Tags
        $tagNames = [
            'Bestseller',
            'Pure Desi Ghee',
            'Handcrafted',
            'Festive Special',
            'Heritage Recipe',
            'Premium Dry Fruits',
        ];

        $tagMap = [];
        foreach ($tagNames as $tName) {
            $tagMap[$tName] = ProductTag::firstOrCreate(
                ['product_tag_slug' => Str::slug($tName)],
                [
                    'product_tag_name' => $tName,
                    'product_tag_description' => "Special tag for {$tName}",
                ]
            );
        }

        // 5. Link Products to their separate category IDs (exactly like category_id)
        $productAssignments = [
            'Royal Kaju Katli' => [
                'seasonal' => 'Diwali',
                'occasion' => 'Wedding',
                'diet' => 'Gluten Free',
                'tag' => 'Bestseller',
                'tags' => ['Bestseller', 'Handcrafted', 'Festive Special'],
            ],
            'Desi Ghee Motichoor Laddu' => [
                'seasonal' => 'Raksha Bandhan',
                'occasion' => 'Festival',
                'diet' => 'Jain Friendly',
                'tag' => 'Pure Desi Ghee',
                'tags' => ['Pure Desi Ghee', 'Heritage Recipe'],
            ],
            'Shahi Namkeen Mixture' => [
                'seasonal' => 'Holi',
                'occasion' => 'Family Celebration',
                'diet' => 'Vegan',
                'tag' => 'Handcrafted',
                'tags' => ['Handcrafted'],
            ],
            'Artisan Chocolate Brownie Box' => [
                'seasonal' => 'Christmas',
                'occasion' => 'Birthday',
                'diet' => 'Low Sugar',
                'tag' => 'Festive Special',
                'tags' => ['Festive Special', 'Handcrafted'],
            ],
            'Imperial Gold Festive Sweet Hamper' => [
                'seasonal' => 'New Year',
                'occasion' => 'Corporate Gifting',
                'diet' => 'Sugar Free',
                'tag' => 'Premium Dry Fruits',
                'tags' => ['Premium Dry Fruits', 'Bestseller', 'Festive Special'],
            ],
        ];

        foreach ($productAssignments as $productName => $assignment) {
            $product = Product::where('product_name', $productName)->first();
            if ($product) {
                $seasonal = $seasonalMap[$assignment['seasonal']] ?? null;
                $occasion = $occasionMap[$assignment['occasion']] ?? null;
                $diet = $dietMap[$assignment['diet']] ?? null;
                $primaryTag = $tagMap[$assignment['tag']] ?? null;

                $product->update([
                    'seasonal_mithai_id' => $seasonal?->id,
                    'occasion_id' => $occasion?->id,
                    'diet_preference_id' => $diet?->id,
                    'product_tag_id' => $primaryTag?->id,
                ]);

                if (! empty($assignment['tags'])) {
                    $tagIds = [];
                    foreach ($assignment['tags'] as $t) {
                        if (isset($tagMap[$t])) {
                            $tagIds[] = $tagMap[$t]->id;
                        }
                    }
                    $product->tags()->syncWithoutDetaching($tagIds);
                }
            }
        }
    }
}
