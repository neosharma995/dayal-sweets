<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Outlet;
use App\Models\Product;
use App\Models\ShippingZone;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class DeliveryPincodeTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware([
            ValidateCsrfToken::class,
        ]);
    }

    public function test_valid_serviceable_pincode_returns_matched_outlets_and_stores_session(): void
    {
        $unique = uniqid();
        $outlet = Outlet::create([
            'name' => 'Test Una Outlet '.$unique,
            'slug' => 'test-una-outlet-'.$unique,
            'address' => 'Nangal Road, Una',
            'city' => 'Una',
            'state' => 'Himachal Pradesh',
            'pincode' => '174303',
            'status' => 'active',
            'is_active' => true,
            'is_coming_soon' => false,
        ]);

        ShippingZone::create([
            'outlet_id' => $outlet->id,
            'zone_name' => 'Una Local Delivery '.$unique,
            'zone_slug' => 'test-una-local-'.$unique,
            'zone_regions' => ['Una', 'Himachal Pradesh'],
            'zone_postcodes' => '174303, 174303...',
            'is_active' => true,
        ]);

        $response = $this->postJson(route('pincode.check'), [
            'pincode' => '174303',
        ]);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'serviceable' => true,
                'pincode' => '174303',
            ]);

        $this->assertEquals('174303', session('customer_pincode'));
        $this->assertTrue(session('is_pincode_verified'));
        $this->assertContains($outlet->id, session('serviceable_outlet_ids'));
    }

    public function test_unserviceable_pincode_returns_error_message(): void
    {
        $response = $this->postJson(route('pincode.check'), [
            'pincode' => '999999',
        ]);

        $response->assertOk()
            ->assertJson([
                'success' => false,
                'serviceable' => false,
                'pincode' => '999999',
            ]);

        $this->assertNull(session('customer_pincode'));
    }

    public function test_invalid_pincode_format_is_rejected(): void
    {
        $response = $this->postJson(route('pincode.check'), [
            'pincode' => '123',
        ]);

        $response->assertOk()
            ->assertJson([
                'success' => false,
                'serviceable' => false,
            ]);
    }

    public function test_clear_pincode_removes_session(): void
    {
        session([
            'customer_pincode' => '174303',
            'is_pincode_verified' => true,
            'serviceable_outlet_ids' => [1],
        ]);

        $response = $this->postJson(route('pincode.clear'));

        $response->assertOk();
        $this->assertNull(session('customer_pincode'));
        $this->assertNull(session('is_pincode_verified'));
    }

    public function test_shop_filters_products_by_serviceable_outlet(): void
    {
        $unique = uniqid();
        $outletA = Outlet::create([
            'name' => 'Outlet Alpha '.$unique,
            'slug' => 'outlet-alpha-'.$unique,
            'address' => 'Alpha Street',
            'city' => 'Una',
            'pincode' => '174301',
            'status' => 'active',
            'is_active' => true,
            'is_coming_soon' => false,
        ]);

        $productA = Product::create([
            'product_name' => 'Alpha Exclusive Laddu',
            'product_description' => 'Only at Alpha',
            'product_price' => 250,
            'product_selling_price' => 250,
            'product_qty' => 10,
        ]);

        $productB = Product::create([
            'product_name' => 'Beta Exclusive Katli',
            'product_description' => 'Only at Beta',
            'product_price' => 450,
            'product_selling_price' => 450,
            'product_qty' => 10,
        ]);

        $productA->outlets()->attach($outletA->id, ['is_available' => true]);

        // When visiting shop with customer_pincode session matching outletA
        $response = $this->withSession([
            'customer_pincode' => '174301',
            'is_pincode_verified' => true,
            'serviceable_outlet_ids' => [$outletA->id],
        ])->get(route('shop'));

        $response->assertOk();

        // Product A is present, Product B is not
        $response->assertInertia(function ($page) use ($productA, $productB) {
            $page->component('Shop');
            $products = $page->toArray()['props']['products'];
            $names = collect($products)->pluck('name');
            $this->assertTrue($names->contains($productA->product_name));
            $this->assertFalse($names->contains($productB->product_name));
        });
    }
}
