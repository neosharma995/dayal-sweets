<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Order;
use App\Models\Outlet;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminOutletScopedManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private Outlet $outletA;
    private Outlet $outletB;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();

        $this->admin = User::factory()->create();
        $this->admin->assignRole(UserRole::Admin->value);

        $this->outletA = Outlet::where('slug', 'amb')->first() ?? Outlet::factory()->create([
            'name' => 'Amb Center',
            'slug' => 'amb-center',
            'is_active' => true,
        ]);

        $this->outletB = Outlet::where('slug', 'una')->first() ?? Outlet::factory()->create([
            'name' => 'Una Central',
            'slug' => 'una-central',
            'is_active' => true,
        ]);
    }

    public function test_admin_can_switch_and_clear_outlet_context(): void
    {
        // Switch context to Outlet A
        $response = $this->actingAs($this->admin)->post('/admin/outlets/switch-context', [
            'outlet_id' => $this->outletA->id,
        ]);

        $response->assertSessionHas('active_outlet_id', $this->outletA->id);
        $response->assertSessionHas('success');

        // Clear context
        $clearResponse = $this->actingAs($this->admin)->post('/admin/outlets/clear-context');
        $clearResponse->assertSessionMissing('active_outlet_id');
        $clearResponse->assertSessionHas('success');
    }

    public function test_product_index_filters_by_active_outlet_context(): void
    {
        $product1 = Product::first();
        $product2 = Product::skip(1)->first();

        // Assign product 1 only to Outlet A
        $this->outletA->products()->sync([
            $product1->id => ['stock_qty' => 50, 'is_available' => true],
        ]);

        // When Outlet A is active in session
        $response = $this->actingAs($this->admin)
            ->withSession(['active_outlet_id' => $this->outletA->id])
            ->get('/admin/products');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Products/Index')
            ->has('products', 1)
            ->where('products.0.id', $product1->id)
        );

        // When global (clear session outlet filter)
        $globalResponse = $this->actingAs($this->admin)
            ->withSession(['active_outlet_id' => null])
            ->get('/admin/products');

        $globalResponse->assertOk();
        $globalResponse->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Products/Index')
            ->has('products', Product::count())
        );
    }

    private function createOrder(array $attributes = []): Order
    {
        static $seq = 1;
        $seq++;
        return Order::create(array_merge([
            'order_number' => "ORD-TEST-{$seq}-" . uniqid(),
            'user_id' => $this->admin->id,
            'customer_name' => 'Test Customer',
            'customer_email' => 'test@example.com',
            'customer_phone' => '9876543210',
            'shipping_address' => '123 Main Road',
            'city' => 'Amb',
            'state' => 'Himachal Pradesh',
            'pincode' => '177203',
            'subtotal' => 500,
            'total_amount' => 500,
            'delivery_status' => 'pending',
            'payment_status' => 'paid',
        ], $attributes));
    }

    public function test_order_index_filters_by_active_outlet_context(): void
    {
        $orderA = $this->createOrder([
            'order_number' => 'ORD-AMB-001',
            'outlet_id' => $this->outletA->id,
            'customer_name' => 'Amb Customer',
            'city' => 'Amb',
            'subtotal' => 500,
            'total_amount' => 500,
            'delivery_status' => 'pending',
        ]);

        $orderB = $this->createOrder([
            'order_number' => 'ORD-UNA-002',
            'outlet_id' => $this->outletB->id,
            'customer_name' => 'Una Customer',
            'city' => 'Una',
            'subtotal' => 800,
            'total_amount' => 800,
            'delivery_status' => 'delivered',
        ]);

        // Filtered to Outlet A
        $response = $this->actingAs($this->admin)
            ->withSession(['active_outlet_id' => $this->outletA->id])
            ->get('/admin/orders');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Orders/Index')
            ->has('orders.data', 1)
            ->where('orders.data.0.id', $orderA->id)
            ->where('counts.total', 1)
            ->where('counts.pending', 1)
        );
    }

    public function test_outlet_show_page_provides_tabs_data(): void
    {
        $product = Product::first();
        $this->outletA->products()->sync([
            $product->id => ['stock_qty' => 45, 'is_available' => true],
        ]);

        $order = $this->createOrder([
            'order_number' => 'ORD-TAB-001',
            'outlet_id' => $this->outletA->id,
            'customer_name' => 'Tab Customer',
            'subtotal' => 350,
            'total_amount' => 350,
            'delivery_status' => 'shipping',
        ]);

        $response = $this->actingAs($this->admin)->get("/admin/outlets/{$this->outletA->id}");

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Outlets/Show')
            ->has('outlet')
            ->has('outlet.products', 1)
            ->has('outlet.orders', 1)
            ->has('unassignedProducts')
            ->has('stats')
            ->where('stats.total_products', 1)
            ->where('stats.total_orders', 1)
            ->where('stats.total_revenue', 350)
        );
    }

    public function test_admin_can_sync_update_and_detach_outlet_products(): void
    {
        $p1 = Product::first();
        $p2 = Product::skip(1)->first();

        // 1. Assign products to outlet
        $syncResponse = $this->actingAs($this->admin)->post("/admin/outlets/{$this->outletA->id}/products/sync", [
            'product_ids' => [$p1->id, $p2->id],
            'stock_qty' => 75,
        ]);

        $syncResponse->assertRedirect();
        $this->assertDatabaseHas('outlet_products', [
            'outlet_id' => $this->outletA->id,
            'product_id' => $p1->id,
            'stock_qty' => 75,
            'is_available' => 1,
        ]);

        // 2. Update stock & availability on pivot
        $pivotResponse = $this->actingAs($this->admin)->patch("/admin/outlets/{$this->outletA->id}/products/{$p1->id}/pivot", [
            'stock_qty' => 120,
            'is_available' => false,
        ]);

        $pivotResponse->assertRedirect();
        $this->assertDatabaseHas('outlet_products', [
            'outlet_id' => $this->outletA->id,
            'product_id' => $p1->id,
            'stock_qty' => 120,
            'is_available' => 0,
        ]);

        // 3. Detach product from outlet
        $detachResponse = $this->actingAs($this->admin)->delete("/admin/outlets/{$this->outletA->id}/products/{$p1->id}");

        $detachResponse->assertRedirect();
        $this->assertDatabaseMissing('outlet_products', [
            'outlet_id' => $this->outletA->id,
            'product_id' => $p1->id,
        ]);
        $this->assertDatabaseHas('outlet_products', [
            'outlet_id' => $this->outletA->id,
            'product_id' => $p2->id,
        ]);
    }
}
