<?php

declare(strict_types=1);

namespace Database\Seeders;

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

        $tax0 = TaxRate::firstOrCreate(
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

        // 2. Seed Shipping Zones (WooCommerce Style)
        // Zone 1: Delhi NCR
        $delhiZone = ShippingZone::firstOrCreate(
            ['zone_slug' => 'delhi-ncr'],
            [
                'zone_name' => 'Delhi NCR & Local',
                'zone_regions' => ['Delhi NCR', 'Delhi', 'Haryana', 'Uttar Pradesh'],
                'zone_postcodes' => '110001...110096, 122001...122508, 201301...201318',
                'description' => 'Same-day and next-day delivery across Delhi, Noida, Gurgaon, Ghaziabad, and Faridabad.',
                'is_active' => true,
                'sort_order' => 1,
            ]
        );

        if ($delhiZone->methods()->count() === 0) {
            ShippingZoneMethod::create([
                'shipping_zone_id' => $delhiZone->id,
                'method_type' => 'flat_rate',
                'title' => 'Standard Local Delivery',
                'cost' => 50.00,
                'tax_status' => 'none',
                'is_enabled' => true,
            ]);

            ShippingZoneMethod::create([
                'shipping_zone_id' => $delhiZone->id,
                'method_type' => 'free_shipping',
                'title' => 'Free Local Shipping',
                'cost' => 0.00,
                'min_order_amount' => 499.00,
                'tax_status' => 'none',
                'is_enabled' => true,
            ]);

            ShippingZoneMethod::create([
                'shipping_zone_id' => $delhiZone->id,
                'method_type' => 'local_pickup',
                'title' => 'Store Pickup (Dayal Sweets Counter)',
                'cost' => 0.00,
                'tax_status' => 'none',
                'is_enabled' => true,
            ]);
        }

        // Zone 2: North India Express
        $northZone = ShippingZone::firstOrCreate(
            ['zone_slug' => 'north-india-express'],
            [
                'zone_name' => 'North India Express',
                'zone_regions' => ['Punjab', 'Rajasthan', 'Uttarakhand', 'Himachal Pradesh', 'Chandigarh'],
                'zone_postcodes' => '140001...160071, 301001...345034, 171001...177601',
                'description' => 'Express 2-3 day courier delivery across northern states.',
                'is_active' => true,
                'sort_order' => 2,
            ]
        );

        if ($northZone->methods()->count() === 0) {
            ShippingZoneMethod::create([
                'shipping_zone_id' => $northZone->id,
                'method_type' => 'flat_rate',
                'title' => 'Regional Express Courier',
                'cost' => 99.00,
                'tax_status' => 'none',
                'is_enabled' => true,
            ]);

            ShippingZoneMethod::create([
                'shipping_zone_id' => $northZone->id,
                'method_type' => 'free_shipping',
                'title' => 'Free Express Shipping',
                'cost' => 0.00,
                'min_order_amount' => 999.00,
                'tax_status' => 'none',
                'is_enabled' => true,
            ]);
        }

        // Zone 3: Pan India
        $panIndiaZone = ShippingZone::firstOrCreate(
            ['zone_slug' => 'pan-india'],
            [
                'zone_name' => 'Rest of India (Pan-India)',
                'zone_regions' => ['Rest of India'],
                'description' => 'Reliable temperature-controlled delivery to all other Indian states.',
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
