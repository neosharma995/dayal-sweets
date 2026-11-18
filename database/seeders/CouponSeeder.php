<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Coupon;
use App\Models\Outlet;
use Illuminate\Database\Seeder;

class CouponSeeder extends Seeder
{
    public function run(): void
    {
        if (Coupon::count() > 0) {
            return;
        }

        $amb = Outlet::where('city', 'Amb')->orWhere('name', 'like', '%Amb%')->first();
        $una = Outlet::where('city', 'Una')->orWhere('name', 'like', '%Una%')->first();
        $hamirpur = Outlet::where('city', 'Hamirpur')->orWhere('name', 'like', '%Hamirpur%')->first();

        // 1. Global Percentage Coupon
        Coupon::create([
            'code' => 'DAYAL10',
            'description' => '10% off on all sweets across all outlets',
            'discount_type' => 'percentage',
            'discount_value' => 10,
            'min_order_amount' => 500,
            'max_discount_amount' => 150,
            'is_global' => true,
            'is_active' => true,
            'starts_at' => now(),
            'expires_at' => now()->addDays(90),
            'usage_limit' => 500,
        ]);

        // 2. Global Flat Fixed Coupon
        Coupon::create([
            'code' => 'FLAT50',
            'description' => 'Flat ₹50 off on orders above ₹400',
            'discount_type' => 'fixed',
            'discount_value' => 50,
            'min_order_amount' => 400,
            'is_global' => true,
            'is_active' => true,
            'starts_at' => now(),
            'expires_at' => now()->addDays(60),
        ]);

        // 3. Amb Outlet Exclusive Coupon
        if ($amb) {
            $c = Coupon::create([
                'code' => 'AMB15',
                'description' => '15% exclusive discount at Amb outlet',
                'discount_type' => 'percentage',
                'discount_value' => 15,
                'min_order_amount' => 600,
                'max_discount_amount' => 200,
                'is_global' => false,
                'outlet_id' => $amb->id,
                'is_active' => true,
            ]);
            $c->outlets()->sync([$amb->id]);
        }

        // 4. Una Outlet Exclusive Coupon
        if ($una) {
            $c = Coupon::create([
                'code' => 'UNA20',
                'description' => 'Special 20% discount at Una outlet',
                'discount_type' => 'percentage',
                'discount_value' => 20,
                'min_order_amount' => 750,
                'max_discount_amount' => 250,
                'is_global' => false,
                'outlet_id' => $una->id,
                'is_active' => true,
            ]);
            $c->outlets()->sync([$una->id]);
        }
    }
}
