<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\ShippingZone;
use App\Models\ShippingZoneMethod;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminShippingZonesTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();

        $this->admin = User::factory()->create();
        $this->admin->assignRole(UserRole::Admin->value);
    }

    public function test_guest_cannot_access_shipping_zones(): void
    {
        $response = $this->get('/admin/shipping-zones');
        $response->assertRedirect('/login');
    }

    public function test_admin_can_view_shipping_zones_index(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/shipping-zones');
        $response->assertOk();
    }

    public function test_admin_can_get_all_shipping_zones_via_json(): void
    {
        $response = $this->actingAs($this->admin)->getJson('/admin/shipping-zones/get-all');

        $response->assertOk()
            ->assertJsonPath('success', true);
    }

    public function test_admin_can_view_create_shipping_zone_page(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/shipping-zones/create');
        $response->assertOk();
    }

    public function test_admin_can_create_shipping_zone_with_methods(): void
    {
        $payload = [
            'zone_name' => 'South India Zone',
            'zone_slug' => 'south-india-zone',
            'zone_regions' => ['Karnataka', 'Tamil Nadu', 'Kerala'],
            'zone_postcodes' => '560001...591346, 600001...643253',
            'description' => 'Express delivery across southern states.',
            'is_active' => true,
            'sort_order' => 5,
            'methods' => [
                [
                    'method_type' => 'flat_rate',
                    'title' => 'Express Air Shipping',
                    'cost' => 120.00,
                    'tax_status' => 'none',
                    'is_enabled' => true,
                ],
                [
                    'method_type' => 'free_shipping',
                    'title' => 'Free Express Shipping',
                    'cost' => 0.00,
                    'min_order_amount' => 1299.00,
                    'tax_status' => 'none',
                    'is_enabled' => true,
                ],
            ],
        ];

        $response = $this->actingAs($this->admin)->post('/admin/shipping-zones', $payload);
        $response->assertRedirect('/admin/shipping-zones');

        $this->assertDatabaseHas('shipping_zones', [
            'zone_name' => 'South India Zone',
            'zone_slug' => 'south-india-zone',
            'zone_postcodes' => '560001...591346, 600001...643253',
        ]);

        $zone = ShippingZone::where('zone_slug', 'south-india-zone')->first();
        $this->assertNotNull($zone);
        $this->assertCount(2, $zone->methods);
        $this->assertDatabaseHas('shipping_zone_methods', [
            'shipping_zone_id' => $zone->id,
            'title' => 'Express Air Shipping',
            'cost' => 120.00,
        ]);
    }

    public function test_admin_can_create_shipping_zone_with_custom_name_and_pincode_objects(): void
    {
        $payload = [
            'zone_name' => 'Custom Delhi Pincodes',
            'zone_slug' => 'custom-delhi-pincodes',
            'zone_regions' => [
                ['name' => 'South Delhi', 'pincode' => '110017'],
                ['name' => 'Connaught Place', 'pincode' => '110001'],
            ],
            'zone_postcodes' => '110001, 110017',
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post('/admin/shipping-zones', $payload);
        $response->assertRedirect('/admin/shipping-zones');

        $zone = ShippingZone::where('zone_slug', 'custom-delhi-pincodes')->first();
        $this->assertNotNull($zone);
        $this->assertCount(2, $zone->zone_regions);
        $this->assertEquals('South Delhi', $zone->zone_regions[0]['name']);
        $this->assertEquals('110017', $zone->zone_regions[0]['pincode']);
        $this->assertEquals('110001, 110017', $zone->zone_postcodes);
    }

    public function test_admin_can_update_shipping_zone_and_sync_methods(): void
    {
        $zone = ShippingZone::create([
            'zone_name' => 'Western Zone',
            'zone_slug' => 'western-zone',
            'zone_regions' => ['Maharashtra'],
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $method = $zone->methods()->create([
            'method_type' => 'flat_rate',
            'title' => 'Standard Rate',
            'cost' => 70.00,
            'tax_status' => 'none',
            'is_enabled' => true,
        ]);

        $updatePayload = [
            'zone_name' => 'Western & Central Zone',
            'zone_slug' => 'western-zone',
            'zone_regions' => ['Maharashtra', 'Gujarat', 'Madhya Pradesh'],
            'is_active' => true,
            'sort_order' => 2,
            'methods' => [
                [
                    'id' => $method->id,
                    'method_type' => 'flat_rate',
                    'title' => 'Updated Courier Rate',
                    'cost' => 85.00,
                    'tax_status' => 'none',
                    'is_enabled' => true,
                ],
                [
                    'method_type' => 'local_pickup',
                    'title' => 'Mumbai Depot Pickup',
                    'cost' => 0.00,
                    'tax_status' => 'none',
                    'is_enabled' => true,
                ],
            ],
        ];

        $response = $this->actingAs($this->admin)->put("/admin/shipping-zones/{$zone->id}", $updatePayload);
        $response->assertRedirect('/admin/shipping-zones');

        $this->assertDatabaseHas('shipping_zones', [
            'id' => $zone->id,
            'zone_name' => 'Western & Central Zone',
        ]);

        $this->assertDatabaseHas('shipping_zone_methods', [
            'id' => $method->id,
            'title' => 'Updated Courier Rate',
            'cost' => 85.00,
        ]);

        $this->assertCount(2, $zone->fresh()->methods);
    }

    public function test_admin_can_delete_shipping_zone(): void
    {
        $zone = ShippingZone::create([
            'zone_name' => 'Temporary Zone',
            'zone_slug' => 'temp-zone',
            'is_active' => true,
        ]);

        $method = $zone->methods()->create([
            'method_type' => 'flat_rate',
            'title' => 'Temp Method',
            'cost' => 50.00,
        ]);

        $response = $this->actingAs($this->admin)->delete("/admin/shipping-zones/{$zone->id}");
        $response->assertRedirect('/admin/shipping-zones');

        $this->assertDatabaseMissing('shipping_zones', ['id' => $zone->id]);
        $this->assertDatabaseMissing('shipping_zone_methods', ['id' => $method->id]);
    }

    public function test_admin_can_toggle_zone_active_status(): void
    {
        $zone = ShippingZone::create([
            'zone_name' => 'Toggle Zone',
            'zone_slug' => 'toggle-zone',
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->admin)->patchJson("/admin/shipping-zones/{$zone->id}/toggle");
        $response->assertOk()
            ->assertJsonPath('is_active', false);

        $this->assertFalse($zone->fresh()->is_active);
    }
}
