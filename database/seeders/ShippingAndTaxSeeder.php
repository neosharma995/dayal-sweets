<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Outlet;
use App\Models\Product;
use App\Models\ShippingZone;
use App\Models\ShippingZoneMethod;
use App\Models\TaxRate;
use Illuminate\Database\Seeder;

class ShippingAndTaxSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Seed Tax Rates
        $tax5 = TaxRate::firstOrCreate(
            ['code' => 'GST-5'],
            [
                'name' => 'GST 5% (Mithai & Traditional Sweets)',
                'rate' => 5.00,
                'type' => 'percent',
                'tax_class' => 'standard',
                'description' => 'Applicable to authentic Indian sweets, desi ghee mithai, and plain bakery items.',
                'is_active' => true,
                'is_compound' => false,
                'apply_to_shipping' => false,
                'priority' => 1,
            ]
        );

        $tax12 = TaxRate::firstOrCreate(
            ['code' => 'GST-12'],
            [
                'name' => 'GST 12% (Namkeen & Snacks)',
                'rate' => 12.00,
                'type' => 'percent',
                'tax_class' => 'standard',
                'description' => 'Applicable to packaged savory namkeen, roasted dry fruits, and snacks.',
                'is_active' => true,
                'is_compound' => false,
                'apply_to_shipping' => false,
                'priority' => 2,
            ]
        );

        $tax18 = TaxRate::firstOrCreate(
            ['code' => 'GST-18'],
            [
                'name' => 'GST 18% (Gift Hampers & Premium Confectionery)',
                'rate' => 18.00,
                'type' => 'percent',
                'tax_class' => 'standard',
                'description' => 'Applicable to artisanal chocolates, festive hampers, and luxury gift boxes.',
                'is_active' => true,
                'is_compound' => false,
                'apply_to_shipping' => true,
                'priority' => 3,
            ]
        );

        TaxRate::firstOrCreate(
            ['code' => 'GST-0'],
            [
                'name' => 'Zero GST (Exempt Essentials)',
                'rate' => 0.00,
                'type' => 'percent',
                'tax_class' => 'zero_rate',
                'description' => 'Zero-rated items exempt from goods and service taxes.',
                'is_active' => true,
                'is_compound' => false,
                'apply_to_shipping' => false,
                'priority' => 4,
            ]
        );

        // Assign default 5% GST to existing products that don't have a tax rate set
        Product::whereNull('tax_rate_id')->update([
            'tax_rate_id' => $tax5->id,
            'tax_status' => 'taxable',
        ]);

        // 2. Seed Shipping Zones Per Outlet
        $outlets = Outlet::all();
        if ($outlets->isEmpty()) {
            // Fallback: seed at least one outlet if none exist yet
            $this->call(OutletSeeder::class);
            $outlets = Outlet::all();
        }

        foreach ($outlets as $outlet) {
            $prefix = $outlet->slug;

            // Zone 1: Local Delivery & Pickup for this outlet
            $localZone = ShippingZone::firstOrCreate(
                [
                    'outlet_id' => $outlet->id,
                    'zone_slug' => "{$prefix}-local-delivery",
                ],
                [
                    'zone_name' => "{$outlet->name} Local & Counter",
                    'zone_regions' => [$outlet->city ?? $outlet->name, 'Himachal Pradesh'],
                    'zone_postcodes' => $outlet->pincode ? "{$outlet->pincode}, {$outlet->pincode}..." : '171001...177601',
                    'description' => "Fast local delivery and counter pickup from {$outlet->name} outlet.",
                    'is_active' => true,
                    'sort_order' => 1,
                ]
            );

            if ($localZone->methods()->count() === 0) {
                ShippingZoneMethod::create([
                    'shipping_zone_id' => $localZone->id,
                    'method_type' => 'local_pickup',
                    'title' => "Store Pickup ({$outlet->name} Counter)",
                    'cost' => 0.00,
                    'tax_status' => 'none',
                    'is_enabled' => true,
                ]);

                ShippingZoneMethod::create([
                    'shipping_zone_id' => $localZone->id,
                    'method_type' => 'flat_rate',
                    'title' => 'Standard City Delivery',
                    'cost' => 40.00,
                    'tax_status' => 'none',
                    'is_enabled' => true,
                ]);

                ShippingZoneMethod::create([
                    'shipping_zone_id' => $localZone->id,
                    'method_type' => 'free_shipping',
                    'title' => 'Free Local Shipping',
                    'cost' => 0.00,
                    'min_order_amount' => 499.00,
                    'tax_status' => 'none',
                    'is_enabled' => true,
                ]);
            }

            // Zone 2: Northern Regional Express
            $regionalZone = ShippingZone::firstOrCreate(
                [
                    'outlet_id' => $outlet->id,
                    'zone_slug' => "{$prefix}-north-express",
                ],
                [
                    'zone_name' => 'North India Express',
                    'zone_regions' => ['Punjab', 'Haryana', 'Chandigarh', 'Delhi', 'Uttarakhand'],
                    'zone_postcodes' => '140001...160071, 110001...110096, 121001...136135',
                    'description' => "Express 2-3 day courier dispatched from {$outlet->name} hub across northern states.",
                    'is_active' => true,
                    'sort_order' => 2,
                ]
            );

            if ($regionalZone->methods()->count() === 0) {
                ShippingZoneMethod::create([
                    'shipping_zone_id' => $regionalZone->id,
                    'method_type' => 'flat_rate',
                    'title' => 'Regional Express Courier',
                    'cost' => 89.00,
                    'tax_status' => 'none',
                    'is_enabled' => true,
                ]);

                ShippingZoneMethod::create([
                    'shipping_zone_id' => $regionalZone->id,
                    'method_type' => 'free_shipping',
                    'title' => 'Free Regional Express',
                    'cost' => 0.00,
                    'min_order_amount' => 999.00,
                    'tax_status' => 'none',
                    'is_enabled' => true,
                ]);
            }

            // Zone 3: Rest of India (Pan-India)
            $panIndiaZone = ShippingZone::firstOrCreate(
                [
                    'outlet_id' => $outlet->id,
                    'zone_slug' => "{$prefix}-pan-india",
                ],
                [
                    'zone_name' => 'Rest of India (Pan-India)',
                    'zone_regions' => ['Rest of India'],
                    'description' => "Reliable temperature-controlled air freight and courier to all other Indian states from {$outlet->name}.",
                    'is_active' => true,
                    'sort_order' => 3,
                ]
            );

            if ($panIndiaZone->methods()->count() === 0) {
                ShippingZoneMethod::create([
                    'shipping_zone_id' => $panIndiaZone->id,
                    'method_type' => 'flat_rate',
                    'title' => 'National Air Cargo / Courier',
                    'cost' => 149.00,
                    'tax_status' => 'none',
                    'is_enabled' => true,
                ]);

                ShippingZoneMethod::create([
                    'shipping_zone_id' => $panIndiaZone->id,
                    'method_type' => 'free_shipping',
                    'title' => 'Free National Shipping',
                    'cost' => 0.00,
                    'min_order_amount' => 1499.00,
                    'tax_status' => 'none',
                    'is_enabled' => true,
                ]);
            }
        }
    }
}
