<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Category;
use App\Models\Order;
use App\Models\Outlet;
use App\Models\OutletTable;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class OutletTableOrderTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected Outlet $outlet;
    protected Product $product;

    protected function setUp(): void
    {
        parent::setUp();

        foreach (UserRole::values() as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }

        $this->admin = User::factory()->create([
            'name' => 'Table Manager Admin',
            'email' => 'admin_tables_' . uniqid() . '@dayalsweets.com',
            'email_verified_at' => now(),
        ]);
        $this->admin->assignRole(UserRole::Admin->value);

        $this->outlet = Outlet::create([
            'name' => 'Amb Royal Outlet',
            'slug' => 'amb-royal-' . uniqid(),
            'address' => 'Main Market, Amb',
            'city' => 'Amb',
            'state' => 'Himachal Pradesh',
            'pincode' => '177203',
            'status' => 'active',
            'is_active' => true,
            'is_coming_soon' => false,
        ]);

        $category = Category::create([
            'category_name' => 'Sweets',
            'category_slug' => 'sweets-' . uniqid(),
        ]);

        $this->product = Product::create([
            'product_name' => 'Desi Ghee Jalebi',
            'category_id' => $category->id,
            'product_price' => 250,
            'product_selling_price' => 220,
            'product_qty' => 50,
        ]);

        $this->outlet->products()->attach($this->product->id, [
            'is_available' => true,
            'stock_qty' => 50,
        ]);
    }

    public function test_admin_can_create_table_with_capacity_and_location_and_generate_qr_scanner(): void
    {
        $response = $this->actingAs($this->admin)->postJson(route('admin.tables.store'), [
            'outlet_id' => $this->outlet->id,
            'table_number' => 'VIP-05',
            'name' => 'Royal VIP Booth 5',
            'capacity' => 6,
            'location' => 'First Floor (AC Hall)',
            'status' => 'available',
            'notes' => 'Corner window booth',
        ]);

        $response->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.table_number', 'VIP-05')
            ->assertJsonPath('data.capacity', 6)
            ->assertJsonPath('data.location', 'First Floor (AC Hall)');

        $table = OutletTable::where('table_number', 'VIP-05')->first();
        $this->assertNotNull($table);
        $this->assertNotEmpty($table->qr_token);
        $this->assertStringContainsString('/scan/' . $table->qr_token, $table->scanner_url);
    }

    public function test_customer_can_open_qr_scanner_panel_and_place_direct_table_order(): void
    {
        $table = OutletTable::create([
            'outlet_id' => $this->outlet->id,
            'table_number' => 'T-10',
            'name' => 'Table T-10',
            'capacity' => 4,
            'location' => 'Ground Floor',
            'status' => 'available',
            'is_active' => true,
        ]);

        // 1. Customer scans QR code -> opens Table Ordering Panel
        $scanResponse = $this->get('/scan/' . $table->qr_token);
        $scanResponse->assertOk();

        // 2. Customer adds item to table cart and sends direct order
        $orderResponse = $this->postJson('/scan/' . $table->qr_token . '/order', [
            'customer_name' => 'Ankit ठाकुर',
            'customer_phone' => '9876543210',
            'guests_count' => 4,
            'payment_method' => 'pay_at_counter',
            'order_notes' => 'Serve hot with rabri',
            'items' => [
                [
                    'product_id' => $this->product->id,
                    'quantity' => 2,
                ],
            ],
        ]);

        $orderResponse->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('order.total_amount', 440);

        $order = Order::where('outlet_table_id', $table->id)->first();
        $this->assertNotNull($order);
        $this->assertSame('dine_in', $order->order_type);
        $this->assertSame($this->outlet->id, $order->outlet_id);
        $this->assertSame('T-10', $order->table_number);
        $this->assertSame('Ground Floor', $order->table_location);
        $this->assertSame(4, $order->guests_count);
        $this->assertEquals(440.00, (float) $order->total_amount);

        // Table status automatically becomes occupied
        $this->assertSame('occupied', $table->fresh()->status);
    }
}
