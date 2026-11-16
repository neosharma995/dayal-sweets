<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\ProductAttributeValue;
use App\Models\ProductVariation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductCatalogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ---------------------------------------------------------------------
        // 1. Five Product Categories
        // ---------------------------------------------------------------------
        $categoriesData = [
            [
                'category_name' => 'Sweets & Mithai',
                'category_slug' => 'sweets-mithai',
                'category_image' => '/uploads/2026/07/kaaju-katli.png',
                'category_description' => 'Handcrafted traditional Indian sweets made with 100% pure desi ghee, saffron, and premium dry fruits.',
            ],
            [
                'category_name' => 'Namkeen & Snacks',
                'category_slug' => 'namkeen-snacks',
                'category_image' => '/uploads/2026/07/Image-Namkeen.png',
                'category_description' => 'Crispy, crunchy savouries made with authentic spices and roasted to perfection.',
            ],
            [
                'category_name' => 'Bakery & Confectionery',
                'category_slug' => 'bakery-confectionery',
                'category_image' => '/uploads/2026/07/Cakes.jpg',
                'category_description' => 'Freshly baked cookies, eggless cakes, artisan pastries, and crunchy rusks.',
            ],
            [
                'category_name' => 'Beverages & Shakes',
                'category_slug' => 'beverages-shakes',
                'category_image' => '/uploads/2026/07/bubble-tea-01.png',
                'category_description' => 'Traditional chilled thandai, kesar badam milk, fresh fruit shakes, and masala chaas.',
            ],
            [
                'category_name' => 'Festive Gift Hampers',
                'category_slug' => 'festive-gift-hampers',
                'category_image' => '/uploads/2026/07/sweets-box.png',
                'category_description' => 'Curated celebration packs and royal tin boxes designed for festivals and corporate gifting.',
            ],
        ];

        $categories = [];
        foreach ($categoriesData as $data) {
            $categories[$data['category_slug']] = Category::updateOrCreate(
                ['category_slug' => $data['category_slug']],
                $data
            );
        }

        // ---------------------------------------------------------------------
        // 2. Product Attributes & Attribute Values
        // ---------------------------------------------------------------------
        $weightAttr = ProductAttribute::updateOrCreate(
            ['slug' => 'weight'],
            [
                'name' => 'Weight',
                'description' => 'Weight pack sizes for mithai, savouries, cookies, and gift boxes.',
            ]
        );

        $weightValues = [
            '150g', '200g', '250g', '300g', '400g', '500g', '750g', '800g',
            '1kg', '1.5kg', '2kg', '2.2kg', '3kg',
        ];
        $weightValModels = [];
        foreach ($weightValues as $wVal) {
            $weightValModels[$wVal] = ProductAttributeValue::updateOrCreate(
                ['attribute_id' => $weightAttr->id, 'value' => $wVal],
                ['slug' => Str::slug($wVal)]
            );
        }

        $packagingAttr = ProductAttribute::updateOrCreate(
            ['slug' => 'packaging-type'],
            [
                'name' => 'Packaging Type',
                'description' => 'Container materials including royal tins, standard gift boxes, and pouches.',
            ]
        );

        $packagingValues = [
            'Standard Box',
            'Royal Golden Tin',
            'Snack Pouch',
            'Velvet Gift Box',
            'Corporate Wooden Crate',
        ];
        $pkgValModels = [];
        foreach ($packagingValues as $pkgVal) {
            $pkgValModels[$pkgVal] = ProductAttributeValue::updateOrCreate(
                ['attribute_id' => $packagingAttr->id, 'value' => $pkgVal],
                ['slug' => Str::slug($pkgVal)]
            );
        }

        // ---------------------------------------------------------------------
        // 3. Five Products (each linked to a Category with 5 Variations)
        // ---------------------------------------------------------------------
        $productsData = [
            [
                'category_slug' => 'sweets-mithai',
                'product_name' => 'Royal Kaju Katli',
                'product_description' => 'Signature diamond-shaped cashew fudge crafted with premium Goan cashews and finished with pure edible silver leaf.',
                'product_price' => 550.00,
                'product_selling_price' => 500.00,
                'product_qty' => 100,
                'product_image' => '/uploads/2026/07/kaaju-katli.png',
                'product_gallaries' => [
                    '/uploads/2026/07/kaaju-katli.png',
                    '/uploads/2026/07/sweets-box.png',
                ],
                'product_details' => [
                    '100% Pure Cashew Fudge',
                    'Shelf Life: 30 Days',
                    'Storage: Keep in a cool, dry place',
                    'Vegetarian: Yes',
                ],
                'variations' => [
                    [
                        'variation_name' => '250g Pack',
                        'price' => 280.00,
                        'selling_price' => 260.00,
                        'product_qty' => 50,
                        'weight_value' => 250,
                        'weight_unit' => 'g',
                        'sku' => 'KK-250G',
                        'is_default' => false,
                    ],
                    [
                        'variation_name' => '500g Standard Box',
                        'price' => 550.00,
                        'selling_price' => 500.00,
                        'product_qty' => 40,
                        'weight_value' => 500,
                        'weight_unit' => 'g',
                        'sku' => 'KK-500G',
                        'is_default' => true,
                    ],
                    [
                        'variation_name' => '1kg Family Pack',
                        'price' => 1050.00,
                        'selling_price' => 950.00,
                        'product_qty' => 30,
                        'weight_value' => 1000,
                        'weight_unit' => 'g',
                        'sku' => 'KK-1KG',
                        'is_default' => false,
                    ],
                    [
                        'variation_name' => '2kg Celebration Pack',
                        'price' => 2000.00,
                        'selling_price' => 1800.00,
                        'product_qty' => 15,
                        'weight_value' => 2000,
                        'weight_unit' => 'g',
                        'sku' => 'KK-2KG',
                        'is_default' => false,
                    ],
                    [
                        'variation_name' => '500g Royal Golden Tin',
                        'price' => 650.00,
                        'selling_price' => 600.00,
                        'product_qty' => 25,
                        'weight_value' => 500,
                        'weight_unit' => 'g',
                        'sku' => 'KK-TIN-500G',
                        'is_default' => false,
                    ],
                ],
            ],
            [
                'category_slug' => 'sweets-mithai',
                'product_name' => 'Desi Ghee Motichoor Laddu',
                'product_description' => 'Tiny pearls of gram flour fried in pure cow desi ghee, infused with green cardamom and saffron syrup.',
                'product_price' => 300.00,
                'product_selling_price' => 270.00,
                'product_qty' => 120,
                'product_image' => '/uploads/2026/07/gulab-jamun.png',
                'product_gallaries' => [
                    '/uploads/2026/07/gulab-jamun.png',
                    '/uploads/2026/07/image-262.png',
                ],
                'product_details' => [
                    '100% Pure Cow Desi Ghee',
                    'Shelf Life: 15 Days',
                    'Contains: Pistachios, Cardamom',
                    'Vegetarian: Yes',
                ],
                'variations' => [
                    [
                        'variation_name' => '250g Treat Pack',
                        'price' => 160.00,
                        'selling_price' => 140.00,
                        'product_qty' => 60,
                        'weight_value' => 250,
                        'weight_unit' => 'g',
                        'sku' => 'ML-250G',
                        'is_default' => false,
                    ],
                    [
                        'variation_name' => '500g Gift Box',
                        'price' => 300.00,
                        'selling_price' => 270.00,
                        'product_qty' => 50,
                        'weight_value' => 500,
                        'weight_unit' => 'g',
                        'sku' => 'ML-500G',
                        'is_default' => true,
                    ],
                    [
                        'variation_name' => '1kg Feast Box',
                        'price' => 580.00,
                        'selling_price' => 520.00,
                        'product_qty' => 35,
                        'weight_value' => 1000,
                        'weight_unit' => 'g',
                        'sku' => 'ML-1KG',
                        'is_default' => false,
                    ],
                    [
                        'variation_name' => '2kg Mega Box',
                        'price' => 1100.00,
                        'selling_price' => 990.00,
                        'product_qty' => 20,
                        'weight_value' => 2000,
                        'weight_unit' => 'g',
                        'sku' => 'ML-2KG',
                        'is_default' => false,
                    ],
                    [
                        'variation_name' => '500g Desi Ghee Tin',
                        'price' => 350.00,
                        'selling_price' => 320.00,
                        'product_qty' => 25,
                        'weight_value' => 500,
                        'weight_unit' => 'g',
                        'sku' => 'ML-TIN-500G',
                        'is_default' => false,
                    ],
                ],
            ],
            [
                'category_slug' => 'namkeen-snacks',
                'product_name' => 'Shahi Namkeen Mixture',
                'product_description' => 'A mouth-watering blend of cashew nuts, roasted peanuts, crunchy sev, lentils, and secret royal spice seasoning.',
                'product_price' => 175.00,
                'product_selling_price' => 150.00,
                'product_qty' => 150,
                'product_image' => '/uploads/2026/07/Image-Namkeen.png',
                'product_gallaries' => [
                    '/uploads/2026/07/Image-Namkeen.png',
                    '/uploads/2026/07/photo-1601050690597-df0568f70950.png',
                ],
                'product_details' => [
                    'Crunchy & Mildly Spiced',
                    'Shelf Life: 90 Days',
                    'Trans Fat Free',
                    'Vegetarian: Yes',
                ],
                'variations' => [
                    [
                        'variation_name' => '200g Snack Pouch',
                        'price' => 90.00,
                        'selling_price' => 80.00,
                        'product_qty' => 80,
                        'weight_value' => 200,
                        'weight_unit' => 'g',
                        'sku' => 'SNM-200G',
                        'is_default' => false,
                    ],
                    [
                        'variation_name' => '400g Zip Pouch',
                        'price' => 175.00,
                        'selling_price' => 150.00,
                        'product_qty' => 60,
                        'weight_value' => 400,
                        'weight_unit' => 'g',
                        'sku' => 'SNM-400G',
                        'is_default' => true,
                    ],
                    [
                        'variation_name' => '800g Value Pack',
                        'price' => 340.00,
                        'selling_price' => 290.00,
                        'product_qty' => 40,
                        'weight_value' => 800,
                        'weight_unit' => 'g',
                        'sku' => 'SNM-800G',
                        'is_default' => false,
                    ],
                    [
                        'variation_name' => '1kg Airtight Pet Jar',
                        'price' => 420.00,
                        'selling_price' => 360.00,
                        'product_qty' => 30,
                        'weight_value' => 1000,
                        'weight_unit' => 'g',
                        'sku' => 'SNM-1KG',
                        'is_default' => false,
                    ],
                    [
                        'variation_name' => '2kg Bulk Family Sack',
                        'price' => 800.00,
                        'selling_price' => 690.00,
                        'product_qty' => 15,
                        'weight_value' => 2000,
                        'weight_unit' => 'g',
                        'sku' => 'SNM-2KG',
                        'is_default' => false,
                    ],
                ],
            ],
            [
                'category_slug' => 'bakery-confectionery',
                'product_name' => 'Artisan Chocolate Brownie Box',
                'product_description' => 'Fudgy rich dark chocolate brownies baked fresh with Belgian cocoa, real butter, and crunchy roasted walnuts.',
                'product_price' => 450.00,
                'product_selling_price' => 399.00,
                'product_qty' => 80,
                'product_image' => '/uploads/2026/07/Brownies.jpg',
                'product_gallaries' => [
                    '/uploads/2026/07/Brownies.jpg',
                    '/uploads/2026/07/Donuts.jpg',
                ],
                'product_details' => [
                    '100% Eggless Recipe',
                    'Shelf Life: 10 Days',
                    'Made with Belgian Cocoa',
                    'Serve Warm with Ice Cream',
                ],
                'variations' => [
                    [
                        'variation_name' => 'Single Piece 80g',
                        'price' => 90.00,
                        'selling_price' => 80.00,
                        'product_qty' => 50,
                        'weight_value' => 80,
                        'weight_unit' => 'g',
                        'sku' => 'BR-80G',
                        'is_default' => false,
                    ],
                    [
                        'variation_name' => 'Box of 4 Pcs (320g)',
                        'price' => 320.00,
                        'selling_price' => 280.00,
                        'product_qty' => 40,
                        'weight_value' => 320,
                        'weight_unit' => 'g',
                        'sku' => 'BR-4PC',
                        'is_default' => false,
                    ],
                    [
                        'variation_name' => 'Box of 6 Pcs (480g)',
                        'price' => 450.00,
                        'selling_price' => 399.00,
                        'product_qty' => 35,
                        'weight_value' => 480,
                        'weight_unit' => 'g',
                        'sku' => 'BR-6PC',
                        'is_default' => true,
                    ],
                    [
                        'variation_name' => 'Box of 9 Pcs (720g)',
                        'price' => 650.00,
                        'selling_price' => 580.00,
                        'product_qty' => 25,
                        'weight_value' => 720,
                        'weight_unit' => 'g',
                        'sku' => 'BR-9PC',
                        'is_default' => false,
                    ],
                    [
                        'variation_name' => 'Luxury Gift Box 12 Pcs',
                        'price' => 850.00,
                        'selling_price' => 760.00,
                        'product_qty' => 20,
                        'weight_value' => 960,
                        'weight_unit' => 'g',
                        'sku' => 'BR-12PC',
                        'is_default' => false,
                    ],
                ],
            ],
            [
                'category_slug' => 'festive-gift-hampers',
                'product_name' => 'Imperial Gold Festive Sweet Hamper',
                'product_description' => 'A regal gift hamper featuring an assortment of Kaju Katli, Besan Laddu, Dry Fruit Peda, Roasted Salted Almonds, and Pistachios in a velvet-lined box.',
                'product_price' => 1600.00,
                'product_selling_price' => 1450.00,
                'product_qty' => 60,
                'product_image' => '/uploads/2026/07/sweets-box.png',
                'product_gallaries' => [
                    '/uploads/2026/07/sweets-box.png',
                    '/uploads/2026/07/Container-9.png',
                ],
                'product_details' => [
                    'Includes 4 Mithai Varieties & 2 Dry Fruit Jars',
                    'Premium Velvet Finish Gift Box',
                    'Shelf Life: 30 Days',
                    'Perfect for Diwali & Weddings',
                ],
                'variations' => [
                    [
                        'variation_name' => 'Silver Box (600g)',
                        'price' => 899.00,
                        'selling_price' => 799.00,
                        'product_qty' => 30,
                        'weight_value' => 600,
                        'weight_unit' => 'g',
                        'sku' => 'HAM-SLV',
                        'is_default' => false,
                    ],
                    [
                        'variation_name' => 'Gold Velvet Box (1kg)',
                        'price' => 1600.00,
                        'selling_price' => 1450.00,
                        'product_qty' => 25,
                        'weight_value' => 1000,
                        'weight_unit' => 'g',
                        'sku' => 'HAM-GLD',
                        'is_default' => true,
                    ],
                    [
                        'variation_name' => 'Royal Emperor Box (1.5kg)',
                        'price' => 2350.00,
                        'selling_price' => 2100.00,
                        'product_qty' => 20,
                        'weight_value' => 1500,
                        'weight_unit' => 'g',
                        'sku' => 'HAM-EMP',
                        'is_default' => false,
                    ],
                    [
                        'variation_name' => 'Grand Maharaja Trunk (2.2kg)',
                        'price' => 3500.00,
                        'selling_price' => 3150.00,
                        'product_qty' => 15,
                        'weight_value' => 2200,
                        'weight_unit' => 'g',
                        'sku' => 'HAM-TRK',
                        'is_default' => false,
                    ],
                    [
                        'variation_name' => 'Corporate Wooden Crate (3kg)',
                        'price' => 4800.00,
                        'selling_price' => 4299.00,
                        'product_qty' => 10,
                        'weight_value' => 3000,
                        'weight_unit' => 'g',
                        'sku' => 'HAM-WOD',
                        'is_default' => false,
                    ],
                ],
            ],
        ];

        foreach ($productsData as $pData) {
            $category = $categories[$pData['category_slug']] ?? null;

            $product = Product::updateOrCreate(
                ['product_name' => $pData['product_name']],
                [
                    'category_id' => $category?->id,
                    'product_description' => $pData['product_description'],
                    'product_price' => $pData['product_price'],
                    'product_selling_price' => $pData['product_selling_price'],
                    'product_qty' => $pData['product_qty'],
                    'product_image' => $pData['product_image'],
                    'product_gallaries' => $pData['product_gallaries'],
                    'product_details' => $pData['product_details'],
                ]
            );

            // Create or update variations for this product
            foreach ($pData['variations'] as $vData) {
                $attrValueId = null;
                if (! empty($vData['weight_value']) && ! empty($vData['weight_unit'])) {
                    $weightVal = (float) $vData['weight_value'];
                    $weightUnit = (string) $vData['weight_unit'];

                    $strKey = ($weightVal >= 1000 && $weightUnit === 'g' && fmod($weightVal, 1000) == 0.0)
                        ? ((int) ($weightVal / 1000)).'kg'
                        : ((int) $weightVal).$weightUnit;

                    if (isset($weightValModels[$strKey])) {
                        $attrValueId = $weightValModels[$strKey]->id;
                    }
                }

                ProductVariation::updateOrCreate(
                    [
                        'product_id' => $product->id,
                        'variation_name' => $vData['variation_name'],
                    ],
                    array_merge($vData, [
                        'product_id' => $product->id,
                        'attribute_value_id' => $attrValueId,
                    ])
                );
            }
        }
    }
}
