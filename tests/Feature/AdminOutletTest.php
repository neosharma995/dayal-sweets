<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Outlet;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminOutletTest extends TestCase
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

    public function test_guest_cannot_access_outlets(): void
    {
        $response = $this->get('/admin/outlets');
        $response->assertRedirect('/login');
    }

    public function test_admin_can_view_outlets_index(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/outlets');
        $response->assertOk();
    }

    public function test_sample_outlets_are_seeded(): void
    {
        $this->assertDatabaseHas('outlets', ['name' => 'Amb', 'slug' => 'amb']);
        $this->assertDatabaseHas('outlets', ['name' => 'Hamirpur', 'slug' => 'hamirpur']);
        $this->assertDatabaseHas('outlets', ['name' => 'Una', 'slug' => 'una']);
        $this->assertDatabaseHas('outlets', ['name' => 'Una (Bus Stand)', 'slug' => 'una-bus-stand']);
        $this->assertDatabaseHas('outlets', ['name' => 'Palampur', 'slug' => 'palampur', 'status' => 'coming_soon']);
    }

    public function test_admin_can_get_all_outlets_via_json(): void
    {
        $response = $this->actingAs($this->admin)->getJson('/admin/outlets/get-all');

        $response->assertOk()
            ->assertJsonPath('success', true);
    }

    public function test_admin_can_view_create_outlet_page(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/outlets/create');
        $response->assertOk();
    }

    public function test_admin_can_create_outlet(): void
    {
        $payload = [
            'name' => 'Shimla Mall Road',
            'slug' => 'shimla-mall-road',
            'subtitle' => 'Flagship Lounge',
            'address' => 'The Mall, Shimla, Himachal Pradesh 171001',
            'city' => 'Shimla',
            'state' => 'Himachal Pradesh',
            'pincode' => '171001',
            'phone' => '+91 80627 57395',
            'whatsapp' => '+91 80627 57395',
            'timings' => 'Mon - Sun: 8:00 AM - 10:00 PM',
            'status' => 'active',
            'sort_order' => 6,
        ];

        $response = $this->actingAs($this->admin)->post('/admin/outlets', $payload);

        $response->assertRedirect('/admin/outlets');
        $this->assertDatabaseHas('outlets', [
            'name' => 'Shimla Mall Road',
            'slug' => 'shimla-mall-road',
            'city' => 'Shimla',
            'is_active' => true,
        ]);
    }

    public function test_admin_can_update_outlet(): void
    {
        $outlet = Outlet::where('slug', 'amb')->firstOrFail();

        $payload = [
            'name' => 'Amb Flagship Store',
            'slug' => 'amb-flagship',
            'subtitle' => 'Main Market',
            'address' => $outlet->address,
            'city' => 'Amb',
            'state' => 'Himachal Pradesh',
            'pincode' => '177203',
            'phone' => '+91 80627 57395',
            'whatsapp' => '+91 80627 57395',
            'timings' => 'Mon - Sun: 8:00 AM - 10:00 PM',
            'status' => 'active',
            'sort_order' => 1,
        ];

        $response = $this->actingAs($this->admin)->put("/admin/outlets/{$outlet->id}", $payload);

        $response->assertRedirect('/admin/outlets');
        $this->assertDatabaseHas('outlets', [
            'id' => $outlet->id,
            'name' => 'Amb Flagship Store',
            'slug' => 'amb-flagship',
        ]);
    }

    public function test_admin_can_toggle_outlet_active_status(): void
    {
        $outlet = Outlet::where('slug', 'amb')->firstOrFail();

        $response = $this->actingAs($this->admin)->patch("/admin/outlets/{$outlet->id}/toggle");
        $response->assertRedirect();

        $this->assertDatabaseHas('outlets', [
            'id' => $outlet->id,
            'is_active' => false,
            'status' => 'inactive',
        ]);
    }

    public function test_admin_can_delete_outlet(): void
    {
        $outlet = Outlet::create([
            'name' => 'Temporary Outlet',
            'slug' => 'temp-outlet',
            'address' => 'Temporary Address, HP',
            'status' => 'inactive',
            'is_active' => false,
        ]);

        $response = $this->actingAs($this->admin)->delete("/admin/outlets/{$outlet->id}");

        $response->assertRedirect('/admin/outlets');
        $this->assertDatabaseMissing('outlets', [
            'id' => $outlet->id,
        ]);
    }

    public function test_admin_can_view_outlet_show_with_products(): void
    {
        $outlet = Outlet::where('slug', 'amb')->firstOrFail();
        $product = Product::create([
            'product_name' => 'Outlet Test Laddu',
            'product_price' => 300.00,
            'product_selling_price' => 280.00,
        ]);
        $outlet->products()->attach($product->id);

        $response = $this->actingAs($this->admin)->get("/admin/outlets/{$outlet->id}");
        $response->assertOk();

        // Also test JSON show endpoint
        $jsonResponse = $this->actingAs($this->admin)->getJson("/admin/outlets/{$outlet->id}");
        $jsonResponse->assertOk()
            ->assertJsonPath('data.name', 'Amb')
            ->assertJsonPath('data.products_count', $outlet->products()->count());
    }
}
